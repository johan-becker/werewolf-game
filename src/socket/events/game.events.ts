import { Socket, Server } from 'socket.io';
import { GameService } from '../../services/game.service';
import { RoomManager } from '../rooms';

export function handleGameEvents(
  io: Server,
  socket: Socket,
  roomManager: RoomManager,
  gameService: GameService
) {
  // Get current game state
  socket.on('game:getState', async (callback) => {
    try {
      const gameId = socket.data.currentGame;
      if (!gameId) {
        return callback({ success: false, error: 'Not in a game' });
      }

      const game = await gameService.getGameDetails(gameId);
      callback({ success: true, game });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Chat message with room/phase validation
  socket.on('game:message', async (data: { message: string; channel?: string }) => {
    const gameId = socket.data.currentGame;
    if (!gameId) {
      socket.emit('error', { code: 'NOT_IN_GAME', message: 'Not in a game' });
      return;
    }

    try {
      // Validate game state and user permissions
      const game = await gameService.getGameDetails(gameId);
      const player = game.players?.find(p => p.userId === socket.data.userId);
      
      if (!player) {
        socket.emit('error', { code: 'NOT_PLAYER', message: 'Not a player in this game' });
        return;
      }

      // Message validation
      if (!data.message || data.message.trim().length === 0) {
        socket.emit('error', { code: 'EMPTY_MESSAGE', message: 'Message cannot be empty' });
        return;
      }

      if (data.message.length > 500) {
        socket.emit('error', { code: 'MESSAGE_TOO_LONG', message: 'Message too long' });
        return;
      }

      const messageData = {
        userId: socket.data.userId,
        username: socket.data.username,
        message: data.message.trim(),
        timestamp: new Date().toISOString(),
        channel: data.channel || 'general',
        playerRole: player.role,
        isAlive: player.isAlive
      };

      // Broadcast based on game phase and channel
      if (game.status === 'waiting') {
        // Pre-game: everyone can see all messages
        roomManager.broadcastToRoom(io, gameId, 'game:message', messageData);
      } else if (game.status === 'in_progress') {
        // During game: channel-based messaging
        switch (data.channel) {
          case 'dead':
            // Dead players can talk to each other
            if (!player.isAlive) {
              const deadSockets = roomManager.getSocketsInRoom(gameId).filter(s => {
                const p = game.players?.find(pl => pl.userId === s.data.userId);
                return p && !p.isAlive;
              });
              deadSockets.forEach(s => s.emit('game:message', messageData));
            }
            break;
          
          case 'werewolf':
            // Werewolves can talk to each other during night phase
            if (player.role === 'werewolf' && player.isAlive) {
              const werewolfSockets = roomManager.getSocketsInRoom(gameId).filter(s => {
                const p = game.players?.find(pl => pl.userId === s.data.userId);
                return p && p.role === 'werewolf' && p.isAlive;
              });
              werewolfSockets.forEach(s => s.emit('game:message', messageData));
            }
            break;
          
          default:
            // General chat: all alive players during day phase
            if (player.isAlive) {
              const aliveSockets = roomManager.getSocketsInRoom(gameId).filter(s => {
                const p = game.players?.find(pl => pl.userId === s.data.userId);
                return p && p.isAlive;
              });
              aliveSockets.forEach(s => s.emit('game:message', messageData));
            }
        }
      }
    } catch (error: any) {
      socket.emit('error', { code: 'MESSAGE_ERROR', message: error.message });
    }
  });

  // Player ready state
  socket.on('game:ready', async (callback) => {
    try {
      const gameId = socket.data.currentGame;
      if (!gameId) {
        return callback({ success: false, error: 'Not in a game' });
      }

      // Update player ready state (would need to be implemented in GameService)
      // For now, just broadcast the ready state
      roomManager.broadcastToRoom(io, gameId, 'game:playerReady', {
        userId: socket.data.userId,
        username: socket.data.username,
        timestamp: new Date().toISOString()
      });

      callback({ success: true });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Game action (voting, special abilities, etc.)
  socket.on('game:action', async (data: { type: string; target?: string; extra?: any }, callback) => {
    try {
      const gameId = socket.data.currentGame;
      if (!gameId) {
        return callback({ success: false, error: 'Not in a game' });
      }

      const game = await gameService.getGameDetails(gameId);
      const player = game.players?.find(p => p.userId === socket.data.userId);
      
      if (!player) {
        return callback({ success: false, error: 'Not a player in this game' });
      }

      if (!player.isAlive && data.type !== 'spectate') {
        return callback({ success: false, error: 'Dead players cannot perform actions' });
      }

      // Validate action based on game phase and player role
      const actionResult = {
        userId: socket.data.userId,
        username: socket.data.username,
        action: data.type,
        target: data.target,
        timestamp: new Date().toISOString()
      };

      // Broadcast action to appropriate players
      switch (data.type) {
        case 'vote':
          // Public voting action
          roomManager.broadcastToRoom(io, gameId, 'game:actionPerformed', actionResult);
          break;
        
        case 'werewolf_kill':
          // Private werewolf action - only to werewolves
          if (player.role === 'werewolf') {
            const werewolfSockets = roomManager.getSocketsInRoom(gameId).filter(s => {
              const p = game.players?.find(pl => pl.userId === s.data.userId);
              return p && p.role === 'werewolf' && p.isAlive;
            });
            werewolfSockets.forEach(s => s.emit('game:actionPerformed', actionResult));
          }
          break;
        
        case 'seer_investigate':
          // Private seer action - only to seer
          if (player.role === 'seer') {
            socket.emit('game:investigationResult', {
              target: data.target,
              result: 'werewolf', // This would come from actual game logic
              timestamp: new Date().toISOString()
            });
          }
          break;
        
        default:
          // Generic action
          roomManager.broadcastToRoom(io, gameId, 'game:actionPerformed', actionResult);
      }

      callback({ success: true });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Pause/Resume game (host only)
  socket.on('game:pause', async (callback) => {
    try {
      const gameId = socket.data.currentGame;
      if (!gameId) {
        return callback({ success: false, error: 'Not in a game' });
      }

      const game = await gameService.getGameDetails(gameId);
      if (game.creatorId !== socket.data.userId) {
        return callback({ success: false, error: 'Only host can pause the game' });
      }

      roomManager.broadcastToRoom(io, gameId, 'game:paused', {
        pausedBy: socket.data.username,
        timestamp: new Date().toISOString()
      });

      callback({ success: true });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  socket.on('game:resume', async (callback) => {
    try {
      const gameId = socket.data.currentGame;
      if (!gameId) {
        return callback({ success: false, error: 'Not in a game' });
      }

      const game = await gameService.getGameDetails(gameId);
      if (game.creatorId !== socket.data.userId) {
        return callback({ success: false, error: 'Only host can resume the game' });
      }

      roomManager.broadcastToRoom(io, gameId, 'game:resumed', {
        resumedBy: socket.data.username,
        timestamp: new Date().toISOString()
      });

      callback({ success: true });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // End game (host only)
  socket.on('game:end', async (callback) => {
    try {
      const gameId = socket.data.currentGame;
      if (!gameId) {
        return callback({ success: false, error: 'Not in a game' });
      }

      const game = await gameService.getGameDetails(gameId);
      if (game.creatorId !== socket.data.userId) {
        return callback({ success: false, error: 'Only host can end the game' });
      }

      // End the game
      await gameService.endGame(gameId, socket.data.userId);

      roomManager.broadcastToRoom(io, gameId, 'game:ended', {
        endedBy: socket.data.username,
        timestamp: new Date().toISOString()
      });

      // Update lobby
      roomManager.broadcastToLobby(io, 'lobby:gameRemoved', { gameId });

      callback({ success: true });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Typing indicator
  socket.on('game:typing', (data: { isTyping: boolean }) => {
    const gameId = socket.data.currentGame;
    if (!gameId) return;

    socket.to(`game:${gameId}`).emit('game:userTyping', {
      userId: socket.data.userId,
      username: socket.data.username,
      isTyping: data.isTyping
    });
  });
}