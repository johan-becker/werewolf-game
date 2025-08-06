import { Socket, Server } from 'socket.io';
import { GameService } from '../../services/game.service';
import { RoomManager } from '../rooms';
import { RoleFactory } from '../../services/role-factory';
import { GameRoleConfig } from '../../types/werewolf-roles.types';

const gameService = new GameService();

export function handleLobbyEvents(socket: Socket, io: Server, roomManager?: RoomManager) {
  const manager = roomManager || new RoomManager();

  // Join lobby room to receive updates
  socket.on('lobby:join', async () => {
    await manager.joinLobby(socket);

    // Send initial game list
    try {
      const games = await gameService.getGameList();
      socket.emit('lobby:gameList', { games });
    } catch (error: any) {
      socket.emit('error', {
        code: 'LOBBY_ERROR',
        message: 'Failed to load game list',
      });
    }
  });

  // Leave lobby room
  socket.on('lobby:leave', async () => {
    await manager.leaveLobby(socket);
  });

  // List games with callback
  socket.on('lobby:list', async callback => {
    try {
      const games = await gameService.getGameList();
      callback({ success: true, games });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Create new game
  socket.on('game:create', async (data: { maxPlayers?: number; isPrivate?: boolean }, callback) => {
    try {
      const game = await gameService.createGame({
        creatorId: socket.data.userId,
        maxPlayers: data.maxPlayers || 8,
        isPrivate: data.isPrivate || false,
      });

      // Join the game room as creator
      await manager.joinRoom(socket, game.id);

      // Broadcast new game to lobby
      manager.broadcastToLobby(io, 'lobby:gameCreated', {
        gameId: game.id,
        name: game.name,
        currentPlayers: game.currentPlayers,
        maxPlayers: game.maxPlayers,
        status: game.status,
        code: game.code,
      });

      callback({ success: true, game });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Join game via socket
  socket.on('game:join', async (data: { gameId: string }, callback) => {
    try {
      const game = await gameService.joinGame(data.gameId, socket.data.userId);

      // Join game room via room manager
      await manager.joinRoom(socket, data.gameId);

      // Get player that just joined
      const joinedPlayer = game.players?.find(p => p.userId === socket.data.userId);

      // Notify game room about new player
      manager.broadcastToRoom(io, data.gameId, 'game:playerJoined', {
        gameId: data.gameId,
        player: joinedPlayer,
      });

      // Update lobby with new player count
      manager.broadcastToLobby(io, 'lobby:gameUpdated', {
        gameId: data.gameId,
        currentPlayers: game.currentPlayers,
        maxPlayers: game.maxPlayers,
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

      // Join game room via room manager
      await manager.joinRoom(socket, game.id);

      // Get player that just joined
      const joinedPlayer = game.players?.find(p => p.userId === socket.data.userId);

      // Notify game room about new player
      manager.broadcastToRoom(io, game.id, 'game:playerJoined', {
        gameId: game.id,
        player: joinedPlayer,
      });

      // Update lobby
      manager.broadcastToLobby(io, 'lobby:gameUpdated', {
        gameId: game.id,
        currentPlayers: game.currentPlayers,
        maxPlayers: game.maxPlayers,
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

      // Leave game room via room manager
      await manager.leaveCurrentRoom(socket);

      // Notify game room about player leaving
      manager.broadcastToRoom(io, data.gameId, 'game:playerLeft', {
        gameId: data.gameId,
        userId: socket.data.userId,
        username: socket.data.username,
      });

      // Handle host transfer
      if (result.newHostId) {
        manager.broadcastToRoom(io, data.gameId, 'game:hostTransferred', {
          gameId: data.gameId,
          newHostId: result.newHostId,
        });
      }

      // Update lobby - get updated game info or remove if deleted
      if (result.gameDeleted) {
        manager.broadcastToLobby(io, 'lobby:gameRemoved', { gameId: data.gameId });
      } else {
        try {
          const updatedGame = await gameService.getGameDetails(data.gameId);
          manager.broadcastToLobby(io, 'lobby:gameUpdated', {
            gameId: data.gameId,
            currentPlayers: updatedGame.currentPlayers,
            maxPlayers: updatedGame.maxPlayers,
          });
        } catch {
          // Game might have been deleted by race condition
          manager.broadcastToLobby(io, 'lobby:gameRemoved', { gameId: data.gameId });
        }
      }

      callback({ success: true });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Configure game roles (host only)
  socket.on(
    'game:configureRoles',
    async (
      data: {
        gameId: string;
        config: GameRoleConfig;
      },
      callback
    ) => {
      try {
        const game = await gameService.getGameDetails(data.gameId);

        // Check if user is host
        if (game.creatorId !== socket.data.userId) {
          return callback({ success: false, error: 'Only host can configure roles' });
        }

        // Check if game is in waiting state
        if (game.status !== 'waiting') {
          return callback({
            success: false,
            error: 'Cannot configure roles after game has started',
          });
        }

        // Validate configuration
        const validation = RoleFactory.validateConfig(data.config, game.currentPlayers);
        if (!validation.isValid) {
          return callback({
            success: false,
            error: validation.errors.join(', '),
            validation,
          });
        }

        // Store configuration (would need to be implemented in GameService)
        await gameService.setRoleConfiguration(data.gameId, data.config);

        // Notify all players in the game about role configuration
        manager.broadcastToRoom(io, data.gameId, 'game:rolesConfigured', {
          config: data.config,
          validation,
          configuredBy: socket.data.username,
        });

        callback({ success: true, config: data.config, validation });
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    }
  );

  // Validate role configuration (host only)
  socket.on(
    'game:validateRoleConfig',
    async (
      data: {
        gameId: string;
        config: GameRoleConfig;
      },
      callback
    ) => {
      try {
        const game = await gameService.getGameDetails(data.gameId);

        // Check if user is host
        if (game.creatorId !== socket.data.userId) {
          return callback({ success: false, error: 'Only host can validate role configuration' });
        }

        const validation = RoleFactory.validateConfig(data.config, game.currentPlayers);

        callback({ success: true, validation });
      } catch (error: any) {
        callback({ success: false, error: error.message });
      }
    }
  );

  // Get optimal role configuration suggestion (host only)
  socket.on('game:getOptimalRoleConfig', async (data: { gameId: string }, callback) => {
    try {
      const game = await gameService.getGameDetails(data.gameId);

      // Check if user is host
      if (game.creatorId !== socket.data.userId) {
        return callback({ success: false, error: 'Only host can get role suggestions' });
      }

      const optimalConfig = RoleFactory.createOptimalConfig(game.currentPlayers);
      const validation = RoleFactory.validateConfig(optimalConfig, game.currentPlayers);

      callback({
        success: true,
        config: optimalConfig,
        validation,
      });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Start game via socket
  socket.on('game:start', async (data: { gameId: string }, callback) => {
    try {
      const game = await gameService.startGame(data.gameId, socket.data.userId);

      // Notify game room that game started
      manager.broadcastToRoom(io, data.gameId, 'game:started', {
        gameId: data.gameId,
        game: game,
      });

      // Remove from lobby (game no longer waiting)
      manager.broadcastToLobby(io, 'lobby:gameRemoved', { gameId: data.gameId });

      callback({ success: true, game });
    } catch (error: any) {
      callback({ success: false, error: error.message });
    }
  });

  // Handle disconnect - delegate to room manager
  socket.on('disconnect', async () => {
    console.log(`User ${socket.data.username} disconnected`);

    // Room manager handles the grace period and cleanup
    const gameId = manager.handleDisconnect(socket.data.userId);

    if (gameId) {
      // Notify the game room about temporary disconnect
      manager.broadcastToRoom(io, gameId, 'game:playerDisconnected', {
        gameId,
        userId: socket.data.userId,
        username: socket.data.username,
      });
    }
  });

  // Handle reconnection
  socket.on('reconnect', async () => {
    console.log(`User ${socket.data.username} attempting reconnection`);

    const gameId = await manager.handleReconnection(socket);

    if (gameId) {
      // Notify the game room about reconnection
      manager.broadcastToRoom(io, gameId, 'game:playerReconnected', {
        gameId,
        userId: socket.data.userId,
        username: socket.data.username,
      });

      // Send current game state to reconnected user
      try {
        const game = await gameService.getGameDetails(gameId);
        socket.emit('game:stateSync', { game });
      } catch (error) {
        console.error('Failed to sync game state on reconnection:', error);
      }
    }
  });
}
