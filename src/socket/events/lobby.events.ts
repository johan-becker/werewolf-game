import { Socket } from 'socket.io';
import { GameService } from '../../services/game.service';

const gameService = new GameService();

export function handleLobbyEvents(socket: Socket) {
  // List games
  socket.on('lobby:list', async (callback) => {
    try {
      const games = await gameService.getGameList();
      callback({ success: true, games });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Create game via socket
  socket.on('game:create', async (data, callback) => {
    try {
      const game = await gameService.createGame(socket.data.userId, data);
      
      // Broadcast to lobby
      socket.broadcast.emit('lobby:update', await gameService.getGameList());
      
      callback({ success: true, game });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });
}