/**
 * Enhanced Game Controller with comprehensive error boundary pattern
 * Implements Result pattern with explicit success/error state discriminators
 */

import { Response } from 'express';
import { GameService } from '../services/game.service';
import { AuthenticatedRequest } from '../types/auth.types';
import {
  Result,
  GameCreationResult,
  GameJoinResult,
  GameLeaveResult,
  GameStartResult,
  GameListResult,
  GameDetailsResult,
  GameCreationSuccess,
  GameJoinSuccess,
  GameLeaveSuccess,
  GameStartSuccess,
  GameListSuccess,
  GameDetailsSuccess,
  GameControllerError,
  GameErrorFactory,
  GameErrorCode
} from '../types/controller.types';

export class EnhancedGameController {
  private readonly gameService: GameService;

  constructor() {
    this.gameService = new GameService();
  }

  /**
   * POST /api/games - Create new game with comprehensive error handling
   */
  async createGame(req: AuthenticatedRequest, res: Response): Promise<GameCreationResult> {
    try {
      // Input validation
      const { maxPlayers, isPrivate, name } = req.body;
      
      if (maxPlayers !== undefined) {
        if (typeof maxPlayers !== 'number' || maxPlayers < 4 || maxPlayers > 20) {
          return {
            success: false,
            error: GameErrorFactory.createValidationError(
              'maxPlayers',
              maxPlayers,
              'number between 4 and 20',
              'Maximum players must be between 4 and 20'
            )
          };
        }
      }

      if (name !== undefined) {
        if (typeof name !== 'string') {
          return {
            success: false,
            error: GameErrorFactory.createValidationError(
              'name',
              name,
              'string',
              'Game name must be a string'
            )
          };
        }
        
        if (name.length > 50) {
          return {
            success: false,
            error: {
              code: GameErrorCode.FIELD_TOO_LONG,
              message: 'Game name is too long',
              field: 'name',
              details: { maxLength: 50, actualLength: name.length },
              suggestion: 'Please use a shorter game name (max 50 characters)',
              timestamp: new Date().toISOString()
            }
          };
        }
        
        if (name.trim().length === 0) {
          return {
            success: false,
            error: {
              code: GameErrorCode.FIELD_TOO_SHORT,
              message: 'Game name cannot be empty',
              field: 'name',
              suggestion: 'Please provide a non-empty game name',
              timestamp: new Date().toISOString()
            }
          };
        }
      }

      if (isPrivate !== undefined && typeof isPrivate !== 'boolean') {
        return {
          success: false,
          error: GameErrorFactory.createValidationError(
            'isPrivate',
            isPrivate,
            'boolean',
            'isPrivate must be true or false'
          )
        };
      }

      // Check if user already has an active game
      const existingGames = await this.gameService.getGameList(10, 0);
      const userActiveGame = existingGames.find(game => 
        game.creatorId === req.user.userId && 
        (game.status === 'waiting' || game.status === 'in_progress')
      );

      if (userActiveGame) {
        return {
          success: false,
          error: {
            code: GameErrorCode.PLAYER_ALREADY_IN_GAME,
            message: 'You already have an active game',
            details: { 
              existingGameId: userActiveGame.id, 
              existingGameCode: userActiveGame.code,
              existingGameStatus: userActiveGame.status
            },
            suggestion: 'Finish or leave your current game before creating a new one',
            timestamp: new Date().toISOString()
          }
        };
      }

      // Create the game
      const game = await this.gameService.createGame({
        creatorId: req.user.userId,
        maxPlayers: maxPlayers || 8,
        isPrivate: isPrivate || false,
        name: name?.trim()
      });

      const successData: GameCreationSuccess = {
        game: {
          id: game.id,
          code: game.code,
          name: game.name,
          status: game.status,
          maxPlayers: game.maxPlayers,
          isPrivate: game.isPrivate ?? false,
          createdAt: typeof game.createdAt === 'string' ? game.createdAt : new Date(game.createdAt).toISOString(),
          hostId: game.creatorId
        },
        playerCount: 1
      };

      return {
        success: true,
        data: successData
      };

    } catch (error: any) {
      // Transform service errors to controller errors
      if (error.message?.includes('duplicate') || error.message?.includes('unique')) {
        return {
          success: false,
          error: {
            code: GameErrorCode.GAME_ALREADY_EXISTS,
            message: 'A game with this configuration already exists',
            details: { originalError: error.message },
            suggestion: 'Please try with different settings',
            timestamp: new Date().toISOString()
          }
        };
      }

      if (error.message?.includes('connection') || error.message?.includes('timeout')) {
        return {
          success: false,
          error: GameErrorFactory.createServerError(
            error.message,
            'Unable to create game due to database connectivity'
          )
        };
      }

      return {
        success: false,
        error: GameErrorFactory.createServerError(
          error.message,
          'Failed to create game'
        )
      };
    }
  }

  /**
   * GET /api/games - List games with comprehensive filtering and error handling
   */
  async listGames(req: AuthenticatedRequest, res: Response): Promise<GameListResult> {
    try {
      const limit = Math.min(Number(req.query.limit) || 20, 100);
      const offset = Math.max(Number(req.query.offset) || 0, 0);
      
      // Validate pagination parameters were already handled by middleware
      
      const games = await this.gameService.getGameList(limit, offset);
      const totalCount = games.length; // Simplified count for now

      const successData: GameListSuccess = {
        games: games.map(game => ({
          id: game.id,
          code: game.code,
          name: game.name,
          status: game.status,
          playerCount: game.playerCount || 0,
          maxPlayers: game.maxPlayers,
          isPrivate: game.isPrivate ?? false,
          createdAt: typeof game.createdAt === 'string' ? game.createdAt : new Date(game.createdAt).toISOString(),
          hostName: game.hostName || 'Unknown'
        })),
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        }
      };

      return {
        success: true,
        data: successData
      };

    } catch (error: any) {
      return {
        success: false,
        error: GameErrorFactory.createServerError(
          error.message,
          'Failed to retrieve game list'
        )
      };
    }
  }

  /**
   * GET /api/games/:id - Get game details with comprehensive validation
   */
  async getGame(req: AuthenticatedRequest, res: Response): Promise<GameDetailsResult> {
    try {
      const gameId = req.params.id;
      
      if (!gameId) {
        return {
          success: false,
          error: GameErrorFactory.createGameNotFoundError('undefined', 'id')
        };
      }
      
      const game = await this.gameService.getGameDetails(gameId);
      
      if (!game) {
        return {
          success: false,
          error: GameErrorFactory.createGameNotFoundError(gameId, 'id')
        };
      }

      // Check if user has permission to view this game
      const isParticipant = game.players?.some(player => player.id === req.user.userId);
      const isHost = game.creatorId === req.user.userId;
      
      if (game.isPrivate && !isParticipant && !isHost) {
        return {
          success: false,
          error: GameErrorFactory.createPermissionError(
            'view private game',
            'private game access'
          )
        };
      }

      const successData: GameDetailsSuccess = {
        id: game.id,
        code: game.code,
        name: game.name,
        status: game.status,
        phase: game.phase,
        playerCount: game.players?.length || 0,
        maxPlayers: game.maxPlayers,
        isPrivate: game.isPrivate ?? false,
        createdAt: typeof game.createdAt === 'string' ? game.createdAt : new Date(game.createdAt).toISOString(),
        startedAt: game.startedAt ? (typeof game.startedAt === 'string' ? game.startedAt : new Date(game.startedAt).toISOString()) : '',
        host: {
          id: game.creatorId,
          username: game.hostName || 'Unknown'
        },
        players: (game.players || []).map(player => ({
          id: player.id,
          username: player.username || 'Unknown',
          status: player.status || 'active',
          joinedAt: player.joinedAt ? (typeof player.joinedAt === 'string' ? player.joinedAt : new Date(player.joinedAt).toISOString()) : new Date().toISOString(),
          isHost: player.id === game.creatorId
        })),
        settings: {
          timeLimit: game.timeLimit ?? 300,
          enableChat: game.enableChat !== false,
          allowSpectators: game.allowSpectators !== false
        }
      };

      return {
        success: true,
        data: successData
      };

    } catch (error: any) {
      if (error.message?.includes('not found')) {
        return {
          success: false,
          error: GameErrorFactory.createGameNotFoundError(req.params.id || 'unknown', 'id')
        };
      }

      return {
        success: false,
        error: GameErrorFactory.createServerError(
          error.message,
          'Failed to retrieve game details'
        )
      };
    }
  }

  /**
   * POST /api/games/:id/join - Join game by ID with comprehensive validation
   */
  async joinGame(req: AuthenticatedRequest, res: Response): Promise<GameJoinResult> {
    try {
      const gameId = req.params.id;
      const userId = req.user.userId;
      
      if (!gameId) {
        return {
          success: false,
          error: GameErrorFactory.createGameNotFoundError('undefined', 'id')
        };
      }
      
      // Check if game exists first
      const game = await this.gameService.getGameDetails(gameId);
      if (!game) {
        return {
          success: false,
          error: GameErrorFactory.createGameNotFoundError(gameId, 'id')
        };
      }

      // Validate game state
      if (game.status !== 'waiting') {
        const currentPhase = game.status === 'in_progress' ? 'in progress' : game.status;
        return {
          success: false,
          error: GameErrorFactory.createGameStateError(
            'waiting',
            currentPhase,
            'join game'
          )
        };
      }

      // Check if game is full
      const currentPlayerCount = game.players?.length || 0;
      if (currentPlayerCount >= game.maxPlayers) {
        return {
          success: false,
          error: {
            code: GameErrorCode.GAME_FULL,
            message: `Game is full (${currentPlayerCount}/${game.maxPlayers} players)`,
            details: { 
              currentPlayers: currentPlayerCount, 
              maxPlayers: game.maxPlayers 
            },
            suggestion: 'Try joining a different game or wait for a slot to open',
            timestamp: new Date().toISOString()
          }
        };
      }

      // Check if user is already in this game
      const isAlreadyInGame = game.players?.some(player => player.id === userId);
      if (isAlreadyInGame) {
        return {
          success: false,
          error: {
            code: GameErrorCode.PLAYER_ALREADY_IN_GAME,
            message: 'You are already in this game',
            details: { gameId, playerId: userId },
            suggestion: 'You can leave and rejoin if needed',
            timestamp: new Date().toISOString()
          }
        };
      }

      // Check if user is in another active game
      const userGames: any[] = []; // Skip active game check - would need custom implementation
      if (userGames.length > 0) {
        const activeGame = userGames[0];
        return {
          success: false,
          error: {
            code: GameErrorCode.PLAYER_ALREADY_IN_GAME,
            message: 'You are already in another game',
            details: { 
              currentGameId: activeGame.id,
              currentGameCode: activeGame.code,
              currentGameStatus: activeGame.status
            },
            suggestion: 'Leave your current game before joining a new one',
            timestamp: new Date().toISOString()
          }
        };
      }

      // Join the game
      const joinResult = await this.gameService.joinGame(gameId, userId);
      const updatedGame = await this.gameService.getGameDetails(gameId);

      const successData: GameJoinSuccess = {
        game: {
          id: updatedGame.id,
          code: updatedGame.code,
          name: updatedGame.name,
          status: updatedGame.status,
          playerCount: updatedGame.players?.length || 0,
          maxPlayers: updatedGame.maxPlayers
        },
        player: {
          id: userId,
          username: req.user.username || (req.user.email ? req.user.email.split('@')[0] : 'Unknown'),
          joinedAt: new Date().toISOString(),
          isHost: updatedGame.creatorId === userId
        },
        otherPlayers: (updatedGame.players || [])
          .filter(p => p.id !== userId)
          .map(player => ({
            id: player.id,
            username: player.username || 'Unknown',
            isHost: player.id === updatedGame.creatorId
          }))
      };

      return {
        success: true,
        data: successData
      };

    } catch (error: any) {
      if (error.message?.includes('not found')) {
        return {
          success: false,
          error: GameErrorFactory.createGameNotFoundError(req.params.id || 'unknown', 'id')
        };
      }

      if (error.message?.includes('full') || error.message?.includes('capacity')) {
        return {
          success: false,
          error: {
            code: GameErrorCode.GAME_FULL,
            message: 'Cannot join - game is at capacity',
            suggestion: 'Try joining a different game',
            timestamp: new Date().toISOString()
          }
        };
      }

      return {
        success: false,
        error: GameErrorFactory.createServerError(
          error.message,
          'Failed to join game'
        )
      };
    }
  }

  /**
   * POST /api/games/join/:code - Join game by code
   */
  async joinByCode(req: AuthenticatedRequest, res: Response): Promise<GameJoinResult> {
    try {
      const code = req.params.code?.toUpperCase();
      const userId = req.user.userId;
      
      if (!code) {
        return {
          success: false,
          error: GameErrorFactory.createGameNotFoundError('undefined', 'code')
        };
      }

      // Code validation handled by middleware

      // Find game by code first
      const games = await this.gameService.getGameList(100, 0);
      const game = games.find(g => g.code === code);

      if (!game) {
        return {
          success: false,
          error: GameErrorFactory.createGameNotFoundError(code, 'code')
        };
      }

      // Reuse the join logic by calling joinGame with the found game ID
      // This ensures consistent validation and error handling
      return await this.joinGame(
        { ...req, params: { ...req.params, id: game.id } } as AuthenticatedRequest,
        res
      );

    } catch (error: any) {
      return {
        success: false,
        error: GameErrorFactory.createServerError(
          error.message,
          'Failed to join game by code'
        )
      };
    }
  }

  /**
   * DELETE /api/games/:id/leave - Leave game with host transfer logic
   */
  async leaveGame(req: AuthenticatedRequest, res: Response): Promise<GameLeaveResult> {
    try {
      const gameId = req.params.id;
      const userId = req.user.userId;

      // Check if game exists
      const game = await this.gameService.getGameDetails(gameId);
      if (!game) {
        return {
          success: false,
          error: GameErrorFactory.createGameNotFoundError(gameId, 'id')
        };
      }

      // Check if user is in the game
      const playerInGame = game.players?.find(player => player.id === userId);
      if (!playerInGame) {
        return {
          success: false,
          error: {
            code: GameErrorCode.PLAYER_NOT_IN_GAME,
            message: 'You are not in this game',
            details: { gameId, playerId: userId },
            suggestion: 'You can only leave games you have joined',
            timestamp: new Date().toISOString()
          }
        };
      }

      // Check if game can be left (not in critical phases)
      if (game.status === 'in_progress' && game.phase && ['voting', 'night_action'].includes(game.phase)) {
        return {
          success: false,
          error: {
            code: GameErrorCode.WRONG_GAME_PHASE,
            message: 'Cannot leave during critical game phase',
            details: { currentPhase: game.phase },
            suggestion: 'Wait for the current phase to complete before leaving',
            timestamp: new Date().toISOString()
          }
        };
      }

      const isHost = game.creatorId === userId;
      const remainingPlayerCount = (game.players?.length || 1) - 1;

      // Leave the game
      const leaveResult = await this.gameService.leaveGame(gameId, userId);

      let gameStatus: 'active' | 'disbanded' | 'host_transferred' = 'active';
      let newHostId: string | undefined;

      if (remainingPlayerCount === 0) {
        gameStatus = 'disbanded';
      } else if (isHost) {
        gameStatus = 'host_transferred';
        // Find new host (typically the next player who joined)
        const remainingPlayers = game.players?.filter(p => p.id !== userId) || [];
        newHostId = remainingPlayers[0]?.id;
      }

      const successData: GameLeaveSuccess = {
        message: remainingPlayerCount === 0 
          ? 'Game disbanded - no players remaining'
          : isHost 
            ? 'Left game and transferred host privileges'
            : 'Successfully left the game',
        gameStatus,
        newHostId
      };

      return {
        success: true,
        data: successData
      };

    } catch (error: any) {
      return {
        success: false,
        error: GameErrorFactory.createServerError(
          error.message,
          'Failed to leave game'
        )
      };
    }
  }

  /**
   * POST /api/games/:id/start - Start game with comprehensive validation
   */
  async startGame(req: AuthenticatedRequest, res: Response): Promise<GameStartResult> {
    try {
      const gameId = req.params.id;
      const userId = req.user.userId;

      // Check if game exists
      const game = await this.gameService.getGameDetails(gameId);
      if (!game) {
        return {
          success: false,
          error: GameErrorFactory.createGameNotFoundError(gameId, 'id')
        };
      }

      // Check if user is the host
      if (game.creatorId !== userId) {
        return {
          success: false,
          error: GameErrorFactory.createPermissionError(
            'start game',
            'only the host can start the game'
          )
        };
      }

      // Check game state
      if (game.status !== 'waiting') {
        return {
          success: false,
          error: GameErrorFactory.createGameStateError(
            'waiting',
            game.status,
            'start game'
          )
        };
      }

      // Check minimum players
      const playerCount = game.players?.length || 0;
      const minPlayers = 4; // Minimum for werewolf game
      
      if (playerCount < minPlayers) {
        return {
          success: false,
          error: {
            code: GameErrorCode.INSUFFICIENT_PLAYERS,
            message: `Not enough players to start (${playerCount}/${minPlayers} minimum)`,
            details: { 
              currentPlayers: playerCount, 
              minRequired: minPlayers,
              maxPlayers: game.maxPlayers
            },
            suggestion: `Wait for at least ${minPlayers - playerCount} more player(s) to join`,
            timestamp: new Date().toISOString()
          }
        };
      }

      // Start the game
      await this.gameService.startGame(gameId, userId);

      // Estimate game duration (rough calculation)
      const estimatedMinutes = Math.ceil(playerCount * 5 + 10); // 5 min per player + 10 min base

      const successData: GameStartSuccess = {
        message: `Game started with ${playerCount} players`,
        gamePhase: 'night',
        playerCount,
        estimatedDuration: estimatedMinutes
      };

      return {
        success: true,
        data: successData
      };

    } catch (error: any) {
      if (error.message?.includes('already started')) {
        return {
          success: false,
          error: {
            code: GameErrorCode.GAME_ALREADY_STARTED,
            message: 'Game has already been started',
            suggestion: 'Join the game in progress or create a new game',
            timestamp: new Date().toISOString()
          }
        };
      }

      return {
        success: false,
        error: GameErrorFactory.createServerError(
          error.message,
          'Failed to start game'
        )
      };
    }
  }
}