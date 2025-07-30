import { Socket, Server } from 'socket.io';
import { GameService } from '../../services/game.service';

const gameService = new GameService();

export function handleLobbyEvents(socket: Socket, io: Server) {
  // Join lobby room to receive updates
  socket.on('lobby:join', () => {
    socket.join('lobby');
  });

  // Leave lobby room
  socket.on('lobby:leave', () => {
    socket.leave('lobby');
  });

  // List games
  socket.on('lobby:list', async (callback) => {
    try {
      const games = await gameService.getGameList();
      callback({ success: true, games });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Join game via socket
  socket.on('game:join', async (data: { gameId: string }, callback) => {
    try {
      const game = await gameService.joinGame(data.gameId, socket.data.userId);
      
      // Join game room
      socket.join(`game:${data.gameId}`);
      
      // Notify game room about new player
      io.to(`game:${data.gameId}`).emit('game:playerJoined', {
        gameId: data.gameId,
        player: game.players?.find(p => p.userId === socket.data.userId)
      });
      
      // Update lobby with new player count
      io.to('lobby').emit('lobby:gameUpdated', {
        gameId: data.gameId,
        currentPlayers: game.currentPlayers
      });
      
      callback({ success: true, game });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Join game by code via socket
  socket.on('game:joinByCode', async (data: { code: string }, callback) => {
    try {
      const game = await gameService.joinGameByCode(data.code, socket.data.userId);
      
      // Join game room
      socket.join(`game:${game.id}`);
      
      // Notify game room about new player
      io.to(`game:${game.id}`).emit('game:playerJoined', {
        gameId: game.id,
        player: game.players?.find(p => p.userId === socket.data.userId)
      });
      
      // Update lobby
      io.to('lobby').emit('lobby:gameUpdated', {
        gameId: game.id,
        currentPlayers: game.currentPlayers
      });
      
      callback({ success: true, game });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Leave game via socket
  socket.on('game:leave', async (data: { gameId: string }, callback) => {
    try {
      const result = await gameService.leaveGame(data.gameId, socket.data.userId);
      
      // Leave game room
      socket.leave(`game:${data.gameId}`);
      
      // Notify game room about player leaving
      io.to(`game:${data.gameId}`).emit('game:playerLeft', {
        gameId: data.gameId,
        userId: socket.data.userId
      });
      
      // Handle host transfer
      if (result.newHostId) {
        io.to(`game:${data.gameId}`).emit('game:hostTransferred', {
          gameId: data.gameId,
          newHostId: result.newHostId
        });
      }
      
      // Update lobby - get updated game info or remove if deleted
      if (result.gameDeleted) {
        io.to('lobby').emit('lobby:gameRemoved', { gameId: data.gameId });
      } else {
        try {
          const updatedGame = await gameService.getGameDetails(data.gameId);
          io.to('lobby').emit('lobby:gameUpdated', {
            gameId: data.gameId,
            currentPlayers: updatedGame.currentPlayers
          });
        } catch {
          // Game might have been deleted by race condition
          io.to('lobby').emit('lobby:gameRemoved', { gameId: data.gameId });
        }
      }
      
      callback({ success: true });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Start game via socket
  socket.on('game:start', async (data: { gameId: string }, callback) => {
    try {
      await gameService.startGame(data.gameId, socket.data.userId);
      
      // Notify game room that game started
      io.to(`game:${data.gameId}`).emit('game:started', {
        gameId: data.gameId
      });
      
      // Remove from lobby (game no longer waiting)
      io.to('lobby').emit('lobby:gameRemoved', { gameId: data.gameId });
      
      callback({ success: true });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Handle disconnect - auto-leave games
  socket.on('disconnect', async () => {
    const rooms = Array.from(socket.rooms);
    
    for (const room of rooms) {
      if (room.startsWith('game:')) {
        const gameId = room.replace('game:', '');
        try {
          const result = await gameService.leaveGame(gameId, socket.data.userId);
          
          // Notify remaining players
          io.to(room).emit('game:playerLeft', {
            gameId,
            userId: socket.data.userId
          });
          
          // Handle host transfer
          if (result.newHostId) {
            io.to(room).emit('game:hostTransferred', {
              gameId,
              newHostId: result.newHostId
            });
          }
          
          // Update lobby
          if (result.gameDeleted) {
            io.to('lobby').emit('lobby:gameRemoved', { gameId });
          } else {
            try {
              const updatedGame = await gameService.getGameDetails(gameId);
              io.to('lobby').emit('lobby:gameUpdated', {
                gameId,
                currentPlayers: updatedGame.currentPlayers
              });
            } catch {
              // Game was deleted by race condition
              io.to('lobby').emit('lobby:gameRemoved', { gameId });
            }
          }
        } catch (error) {
          // Game might not exist anymore
          console.log(`Error leaving game ${gameId} on disconnect:`, error);
        }
      }
    }
  });
}