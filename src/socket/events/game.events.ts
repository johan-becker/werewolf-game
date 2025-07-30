import { Socket, Server } from 'socket.io';
import { GameService } from '../../services/game.service';
import { RoomManager } from '../rooms';

export function handleGameEvents(
  io: Server,
  socket: Socket,
  roomManager: RoomManager,
  gameService: GameService
) {
  // Join game
  socket.on('game:join', async (gameId, callback) => {
    try {
      const game = await gameService.joinGame(gameId, socket.data.userId);
      
      // Join socket room
      await roomManager.joinRoom(socket, gameId);
      
      // Notify other players
      socket.to(`game:${gameId}`).emit('game:playerJoined', {
        userId: socket.data.userId,
        username: socket.data.username
      });
      
      // Update lobby
      io.emit('lobby:update', await gameService.getGameList());
      
      callback({ success: true, game });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Leave game
  socket.on('game:leave', async (callback) => {
    try {
      const gameId = socket.data.currentGame;
      if (!gameId) {
        return callback({ success: false, error: 'Not in a game' });
      }
      
      await gameService.leaveGame(gameId, socket.data.userId);
      
      // Leave socket room
      const leftGame = await roomManager.leaveCurrentRoom(socket);
      
      if (leftGame) {
        // Notify other players
        socket.to(`game:${leftGame}`).emit('game:playerLeft', socket.data.userId);
      }
      
      // Update lobby
      io.emit('lobby:update', await gameService.getGameList());
      
      callback({ success: true });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Chat message
  socket.on('game:message', async (message) => {
    const gameId = socket.data.currentGame;
    if (!gameId) return;
    
    // Broadcast to room including sender
    io.to(`game:${gameId}`).emit('game:message', {
      userId: socket.data.userId,
      username: socket.data.username,
      message,
      timestamp: new Date().toISOString()
    });
  });

  // Start game
  socket.on('game:start', async () => {
    try {
      const gameId = socket.data.currentGame;
      if (!gameId) return;
      
      await gameService.startGame(gameId, socket.data.userId);
      
      // Notify all players
      io.to(`game:${gameId}`).emit('game:started');
      
      // Update lobby
      io.emit('lobby:update', await gameService.getGameList());
    } catch (error: any) {
      socket.emit('error', {
        code: 'START_FAILED',
        message: error.message
      });
    }
  });
}