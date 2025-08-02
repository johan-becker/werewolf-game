/**
 * Authenticated Socket Event Handlers
 * All handlers require verified user context through authentication state machine
 */

import { Server } from 'socket.io';
import { socketAuthStateMachine } from '../middleware/socket-auth-state.middleware';
import {
  AuthenticatedSocket,
  AuthenticatedSocketEvents,
  GameCreateData,
  GameJoinData,
  GameLeaveData,
  GameStartData,
  NightActionData,
  VoteData,
  ChatData,
  AuthenticateData,
  RefreshTokenData,
  GameResponse,
  GameStateResponse,
  ActionResponse,
  VoteResponse,
  ChatResponse,
  SocketAuthResult
} from '../types/socket-auth.types';
import { GameService } from '../services/game.service';

export class AuthenticatedSocketEventHandler {
  private io: Server;
  private gameService: GameService;

  constructor(io: Server) {
    this.io = io;
    this.gameService = new GameService();
  }

  /**
   * Set up all authenticated event handlers for a socket
   */
  public setupEventHandlers(socket: AuthenticatedSocket): void {
    // Authentication events (allowed before full authentication)
    this.setupAuthenticationEvents(socket);
    
    // Game management events (require authentication)
    this.setupGameManagementEvents(socket);
    
    // Game action events (require authentication)
    this.setupGameActionEvents(socket);
    
    // Connection management events
    this.setupConnectionEvents(socket);
  }

  private setupAuthenticationEvents(socket: AuthenticatedSocket): void {
    // Handle authentication challenge response
    socket.on('auth:authenticate', async (data: AuthenticateData, callback) => {
      try {
        const result = await socketAuthStateMachine.authenticateSocket(
          socket,
          data.token,
          data.deviceId
        );

        callback(result);

        if (result.success && result.user) {
          // Notify other systems about successful authentication
          socket.emit('auth:success', {
            user: {
              id: result.user.userId,
              username: result.user.username || result.user.email.split('@')[0],
              role: result.user.role
            },
            session: result.metadata
          });

          console.log(`User ${result.user.userId} authenticated on socket ${socket.id}`);
        }
      } catch (error) {
        console.error('Authentication event error:', error);
        callback({
          success: false,
          error: {
            code: 'SERVER_ERROR' as any,
            message: 'Authentication processing error',
            canRetry: true
          }
        });
      }
    });

    // Handle token refresh
    socket.on('auth:refresh', async (data: RefreshTokenData, callback) => {
      // For now, treat refresh the same as authenticate
      // In a full implementation, this would use refresh token logic
      callback({
        success: false,
        error: {
          code: 'INVALID_TOKEN' as any,
          message: 'Refresh tokens not implemented yet',
          canRetry: false
        }
      });
    });

    // Handle logout
    socket.on('auth:logout', async (callback) => {
      try {
        // Clean up authentication state
        await socketAuthStateMachine.cleanupSocket(socket);
        callback({ success: true });
        socket.disconnect(true);
      } catch (error) {
        callback({ success: false });
      }
    });
  }

  private setupGameManagementEvents(socket: AuthenticatedSocket): void {
    // Create game
    socket.on('game:create', async (data: GameCreateData, callback) => {
      if (!socketAuthStateMachine.validateAuthentication(socket, 'game:create')) {
        return;
      }

      try {
        const user = socketAuthStateMachine.getAuthenticatedUser(socket);
        
        const game = await this.gameService.createGame({
          creatorId: user.userId,
          name: data.name || '',
          maxPlayers: data.maxPlayers,
          isPrivate: data.isPrivate
        });

        // Join the created game room
        socket.join(`game:${game.id}`);
        socket.data.currentGame = game.id;
        socket.data.roomId = `game:${game.id}`;

        const response: GameResponse = {
          success: true,
          data: {
            gameId: game.id,
            gameCode: game.code,
            status: game.status,
            playerCount: 1,
            userRole: 'host',
            isHost: true
          }
        };

        callback(response);

        console.log(`User ${user.userId} created game ${game.id}`);
      } catch (error) {
        console.error('Game creation error:', error);
        callback({
          success: false,
          error: {
            code: 'GAME_CREATION_FAILED',
            message: error instanceof Error ? error.message : 'Failed to create game'
          }
        });
      }
    });

    // Join game
    socket.on('game:join', async (data: GameJoinData, callback) => {
      if (!socketAuthStateMachine.validateAuthentication(socket, 'game:join')) {
        return;
      }

      try {
        const user = socketAuthStateMachine.getAuthenticatedUser(socket);
        let game;

        if (data.gameCode) {
          game = await this.gameService.joinGameByCode(data.gameCode, user.userId);
        } else if (data.gameId) {
          game = await this.gameService.joinGame(data.gameId, user.userId);
        } else {
          callback({
            success: false,
            error: {
              code: 'INVALID_REQUEST',
              message: 'Either gameId or gameCode is required'
            }
          });
          return;
        }

        // Join the game room
        socket.join(`game:${game.id}`);
        socket.data.currentGame = game.id;
        socket.data.roomId = `game:${game.id}`;

        const response: GameResponse = {
          success: true,
          data: {
            gameId: game.id,
            gameCode: game.code,
            status: game.status,
            playerCount: game.playerCount || 1,
            isHost: game.creatorId === user.userId
          }
        };

        callback(response);

        // Notify other players in the game
        socket.to(`game:${game.id}`).emit('game:playerJoined', {
          gameId: game.id,
          player: {
            id: user.userId,
            username: user.username || user.email.split('@')[0],
            isHost: game.creatorId === user.userId
          },
          playerCount: game.playerCount || 1
        });

        console.log(`User ${user.userId} joined game ${game.id}`);
      } catch (error) {
        console.error('Game join error:', error);
        callback({
          success: false,
          error: {
            code: 'GAME_JOIN_FAILED',
            message: error instanceof Error ? error.message : 'Failed to join game'
          }
        });
      }
    });

    // Leave game
    socket.on('game:leave', async (data: GameLeaveData, callback) => {
      if (!socketAuthStateMachine.validateAuthentication(socket, 'game:leave')) {
        return;
      }

      try {
        const user = socketAuthStateMachine.getAuthenticatedUser(socket);
        
        await this.gameService.leaveGame(data.gameId, user.userId);

        // Leave the game room
        socket.leave(`game:${data.gameId}`);
        delete socket.data.currentGame;
        delete socket.data.roomId;

        callback({ success: true });

        // Notify other players
        socket.to(`game:${data.gameId}`).emit('game:playerLeft', {
          gameId: data.gameId,
          playerId: user.userId,
          username: user.username || user.email.split('@')[0],
          reason: data.reason,
          playerCount: 0 // Would need to get actual count
        });

        console.log(`User ${user.userId} left game ${data.gameId}`);
      } catch (error) {
        console.error('Game leave error:', error);
        callback({
          success: false,
          error: {
            code: 'GAME_LEAVE_FAILED',
            message: error instanceof Error ? error.message : 'Failed to leave game'
          }
        });
      }
    });

    // Start game
    socket.on('game:start', async (data: GameStartData, callback) => {
      if (!socketAuthStateMachine.validateAuthentication(socket, 'game:start')) {
        return;
      }

      try {
        const user = socketAuthStateMachine.getAuthenticatedUser(socket);
        
        await this.gameService.startGame(data.gameId, user.userId);

        callback({ success: true });

        // Notify all players in the game
        this.io.to(`game:${data.gameId}`).emit('game:gameStarted', {
          gameId: data.gameId,
          phase: 'night',
          dayNumber: 1,
          playerCount: 0, // Would need actual count
          userRole: 'villager', // Would need actual role assignment
          roleDescription: 'You are a villager...',
          teammates: []
        });

        console.log(`User ${user.userId} started game ${data.gameId}`);
      } catch (error) {
        console.error('Game start error:', error);
        callback({
          success: false,
          error: {
            code: 'GAME_START_FAILED',
            message: error instanceof Error ? error.message : 'Failed to start game'
          }
        });
      }
    });

    // Get game state
    socket.on('game:getState', async (callback) => {
      if (!socketAuthStateMachine.validateAuthentication(socket, 'game:getState')) {
        return;
      }

      try {
        const user = socketAuthStateMachine.getAuthenticatedUser(socket);
        const gameId = socket.data.currentGame;

        if (!gameId) {
          callback({
            success: false,
            error: {
              code: 'NOT_IN_GAME',
              message: 'Not currently in a game'
            }
          });
          return;
        }

        const game = await this.gameService.getGameDetails(gameId);

        const response: GameStateResponse = {
          success: true,
          data: {
            gameId: game.id,
            phase: game.phase || 'waiting',
            dayNumber: game.dayNumber || 1,
            timeRemaining: game.timeRemaining,
            players: (game.players || []).map(player => ({
              id: player.id,
              username: player.username || 'Unknown',
              isAlive: player.isAlive !== false,
              isHost: player.id === game.creatorId,
              hasVoted: player.hasVoted
            })),
            userState: {
              role: 'villager', // Would need actual role
              team: 'village',
              isAlive: true,
              canVote: true,
              hasVoted: false
            },
            availableActions: [] // Would need actual available actions
          }
        };

        callback(response);
      } catch (error) {
        console.error('Get game state error:', error);
        callback({
          success: false,
          error: {
            code: 'GET_STATE_FAILED',
            message: error instanceof Error ? error.message : 'Failed to get game state'
          }
        });
      }
    });
  }

  private setupGameActionEvents(socket: AuthenticatedSocket): void {
    // Night action
    socket.on('game:nightAction', async (data: NightActionData, callback) => {
      if (!socketAuthStateMachine.validateAuthentication(socket, 'game:nightAction')) {
        return;
      }

      try {
        const user = socketAuthStateMachine.getAuthenticatedUser(socket);

        // Validate user is in the specified game
        if (socket.data.currentGame !== data.gameId) {
          callback({
            success: false,
            error: {
              code: 'INVALID_GAME',
              message: 'Not in the specified game'
            }
          });
          return;
        }

        // Process night action (would need game service method)
        // For now, just acknowledge
        const response: ActionResponse = {
          success: true,
          data: {
            actionType: data.action,
            result: 'Action queued for processing',
            effects: {
              deaths: [],
              protected: [],
              lovers: [],
              revealed: []
            }
          }
        };

        callback(response);

        console.log(`User ${user.userId} performed night action ${data.action} in game ${data.gameId}`);
      } catch (error) {
        console.error('Night action error:', error);
        callback({
          success: false,
          error: {
            code: 'ACTION_FAILED',
            message: error instanceof Error ? error.message : 'Failed to perform action'
          }
        });
      }
    });

    // Vote
    socket.on('game:vote', async (data: VoteData, callback) => {
      if (!socketAuthStateMachine.validateAuthentication(socket, 'game:vote')) {
        return;
      }

      try {
        const user = socketAuthStateMachine.getAuthenticatedUser(socket);

        // Validate user is in the specified game
        if (socket.data.currentGame !== data.gameId) {
          callback({
            success: false,
            error: {
              code: 'INVALID_GAME',
              message: 'Not in the specified game'
            }
          });
          return;
        }

        // Process vote (would need game service method)
        const response: VoteResponse = {
          success: true,
          data: {
            voteCount: 1,
            totalVotes: 5,
            timeRemaining: 60000
          }
        };

        callback(response);

        console.log(`User ${user.userId} voted for ${data.targetId} in game ${data.gameId}`);
      } catch (error) {
        console.error('Vote error:', error);
        callback({
          success: false,
          error: {
            code: 'VOTE_FAILED',
            message: error instanceof Error ? error.message : 'Failed to cast vote'
          }
        });
      }
    });

    // Chat
    socket.on('game:chat', async (data: ChatData, callback) => {
      if (!socketAuthStateMachine.validateAuthentication(socket, 'game:chat')) {
        return;
      }

      try {
        const user = socketAuthStateMachine.getAuthenticatedUser(socket);

        // Validate user is in the specified game
        if (socket.data.currentGame !== data.gameId) {
          callback({
            success: false,
            error: {
              code: 'INVALID_GAME',
              message: 'Not in the specified game'
            }
          });
          return;
        }

        const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        const timestamp = new Date();

        // Broadcast chat message to appropriate channel
        this.io.to(`game:${data.gameId}`).emit('game:chatMessage', {
          gameId: data.gameId,
          messageId,
          playerId: user.userId,
          username: user.username || user.email.split('@')[0],
          message: data.message,
          channel: data.channel,
          timestamp,
          mentions: data.mentions,
          isSystemMessage: false
        });

        const response: ChatResponse = {
          success: true,
          data: {
            messageId,
            timestamp,
            channel: data.channel
          }
        };

        callback(response);

        console.log(`User ${user.userId} sent chat message in game ${data.gameId}`);
      } catch (error) {
        console.error('Chat error:', error);
        callback({
          success: false,
          error: {
            code: 'CHAT_FAILED',
            message: error instanceof Error ? error.message : 'Failed to send message'
          }
        });
      }
    });
  }

  private setupConnectionEvents(socket: AuthenticatedSocket): void {
    // Connection heartbeat
    socket.on('connection:heartbeat', (callback) => {
      // This is allowed even without full authentication
      callback({
        timestamp: new Date(),
        serverTime: new Date(),
        latency: Date.now() - socket.data.lastActivityAt.getTime()
      });
    });

    // Connection status
    socket.on('connection:status', (callback) => {
      callback({
        authState: socket.data.authState,
        connectedAt: socket.data.connectedAt,
        lastActivity: socket.data.lastActivityAt,
        gameId: socket.data.currentGame,
        roomId: socket.data.roomId
      });
    });
  }
}