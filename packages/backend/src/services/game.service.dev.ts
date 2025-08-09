import { PrismaClient } from '../generated/prisma';
import { generateGameCode } from '../utils/gameCode';
import { CreateGameDTO, GameResponse, PlayerResponse } from '../types/game.types';
import { RoleService } from './role.service';
import { NightActionService } from './night-action.service';
import {
  PlayerRole,
  PlayerState,
  GamePhaseState,
  WinCondition,
  ActionType,
  NightAction,
} from '../types/roles.types';
import { GameRoleConfig } from '../types/werewolf-roles.types';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class DevGameService {
  private roleService: RoleService;
  private nightActionService: NightActionService;
  private gameStates: Map<string, GamePhaseState> = new Map();
  private playerStates: Map<string, PlayerState[]> = new Map();
  private roleConfigurations: Map<string, GameRoleConfig> = new Map();

  constructor() {
    this.roleService = new RoleService();
    this.nightActionService = new NightActionService();
  }

  /**
   * Creates a new game with auto-generated code
   */
  async createGame(data: {
    creatorId: string;
    maxPlayers: number;
    isPrivate: boolean;
    name?: string;
  }): Promise<GameResponse> {
    const gameData: CreateGameDTO = {
      name: data.name || `Game ${Date.now()}`,
      maxPlayers: data.maxPlayers,
    };

    return this.createGameInternal(data.creatorId, gameData, data.isPrivate);
  }

  /**
   * Internal method for creating games
   */
  private async createGameInternal(
    userId: string,
    data: CreateGameDTO,
    _isPrivate: boolean = false
  ): Promise<GameResponse> {
    // Validate input
    if (!data.name || data.name.trim().length < 3) {
      throw new Error('Game name must be at least 3 characters long');
    }
    if (data.maxPlayers < 4 || data.maxPlayers > 12) {
      throw new Error('Max players must be between 4 and 12');
    }

    try {
      // Check if user is already hosting a game
      const existingGame = await prisma.game.findFirst({
        where: {
          creator_id: userId,
          status: 'WAITING'
        }
      });

      if (existingGame) {
        throw new Error('You are already hosting a game. Leave your current game first.');
      }

      // Generate unique code (with retry logic)
      let code: string;
      let attempts = 0;

      do {
        code = generateGameCode();
        const existing = await prisma.game.findUnique({
          where: { code }
        });

        if (!existing) break;
        attempts++;
      } while (attempts < 10);

      if (attempts >= 10) {
        throw new Error('Unable to generate unique game code. Please try again.');
      }

      // Create game and add creator as host in transaction
      const result = await prisma.$transaction(async (tx) => {
        // First ensure the profile exists
        const profile = await tx.profile.findUnique({
          where: { id: userId }
        });

        if (!profile) {
          // Create profile if it doesn't exist
          await tx.profile.create({
            data: {
              id: userId,
              username: `User_${userId.slice(0, 8)}`,
              created_at: new Date()
            }
          });
        }

        // Create game
        const game = await tx.game.create({
          data: {
            name: data.name,
            code,
            max_players: data.maxPlayers,
            game_settings: {},
            creator_id: userId,
            current_players: 1
          }
        });

        // Add creator as host player
        await tx.player.create({
          data: {
            game_id: game.id,
            user_id: userId,
            is_host: true,
          }
        });

        return game;
      });

      return this.formatGameResponse({
        ...result,
        host_name: 'Host',
        current_players: 1,
        phase: result.phase || 'WAITING',
        status: result.status.toString()
      });

    } catch (error) {
      logger.error('Error creating game:', error);
      throw new Error(`Failed to create game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get list of waiting games
   */
  async getGameList(limit = 20, offset = 0): Promise<GameResponse[]> {
    try {
      const games = await prisma.game.findMany({
        where: {
          status: 'WAITING'
        },
        include: {
          creator: {
            select: {
              username: true
            }
          },
          _count: {
            select: {
              players: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        take: limit,
        skip: offset
      });

      return games.map(game => this.formatGameResponse({
        ...game,
        current_players: game._count.players,
        host_name: game.creator.username || 'Unknown',
        phase: game.phase || 'WAITING',
        status: game.status.toString()
      }));

    } catch (error) {
      logger.error('Error fetching games:', error);
      throw new Error(`Failed to fetch games: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get game details with players
   */
  async getGameDetails(gameId: string): Promise<GameResponse> {
    try {
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
          creator: {
            select: {
              username: true
            }
          },
          players: {
            include: {
              user: {
                select: {
                  username: true,
                  avatar_url: true
                }
              }
            }
          }
        }
      });

      if (!game) throw new Error('Game not found');

      return this.formatGameResponseWithPlayers({
        ...game,
        current_players: game.players.length,
        host_name: game.creator.username || 'Unknown',
        phase: game.phase || 'WAITING',
        status: game.status.toString(),
        players: game.players.map(p => {
          const player: any = {
            user_id: p.user_id,
            is_host: p.is_host,
            is_alive: p.is_alive,
            role: p.role?.toString(),
            joined_at: p.joined_at.toISOString(),
            profile: {
              username: p.user.username || 'Unknown'
            }
          };
          
          if (p.user.avatar_url) {
            player.profile.avatar_url = p.user.avatar_url;
          }
          
          return player;
        })
      });

    } catch (error) {
      logger.error('Error getting game details:', error);
      throw new Error(`Failed to get game details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Join game by ID
   */
  async joinGame(gameId: string, userId: string): Promise<GameResponse> {
    try {
      // Check if game is joinable
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
          _count: {
            select: {
              players: true
            }
          }
        }
      });

      if (!game) throw new Error('Game not found');
      if (game.status !== 'WAITING') throw new Error('Game is no longer accepting players');
      if (game._count.players >= game.max_players) throw new Error('Game is full');

      // Check if user is already in the game
      const existingPlayer = await prisma.player.findUnique({
        where: {
          user_id_game_id: {
            user_id: userId,
            game_id: gameId
          }
        }
      });

      if (existingPlayer) throw new Error('You are already in this game');

      // Ensure profile exists and add player to game in transaction
      await prisma.$transaction(async (tx) => {
        const profile = await tx.profile.findUnique({
          where: { id: userId }
        });

        if (!profile) {
          await tx.profile.create({
            data: {
              id: userId,
              username: `User_${userId.slice(0, 8)}`,
              created_at: new Date()
            }
          });
        }

        await tx.player.create({
          data: {
            game_id: gameId,
            user_id: userId,
            is_host: false,
          }
        });

        // Update game current_players count
        await tx.game.update({
          where: { id: gameId },
          data: {
            current_players: {
              increment: 1
            }
          }
        });
      });

      return this.getGameDetails(gameId);

    } catch (error) {
      logger.error('Error joining game:', error);
      throw new Error(`Failed to join game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Join game by code
   */
  async joinGameByCode(code: string, userId: string): Promise<GameResponse> {
    try {
      // First find game with this code
      const game = await prisma.game.findUnique({
        where: { code },
        include: {
          _count: {
            select: {
              players: true
            }
          }
        }
      });

      if (!game) throw new Error('Game not found');

      return this.joinGame(game.id, userId);

    } catch (error) {
      logger.error('Error joining game by code:', error);
      throw new Error(`Failed to join game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Leave game
   */
  async leaveGame(
    gameId: string,
    userId: string
  ): Promise<{ gameDeleted: boolean; newHostId?: string }> {
    try {
      // Check if user is in game
      const player = await prisma.player.findUnique({
        where: {
          user_id_game_id: {
            user_id: userId,
            game_id: gameId
          }
        }
      });

      if (!player) throw new Error('You are not in this game');

      const isHost = player.is_host;

      // Remove player and handle host transfer/game deletion in transaction
      const result = await prisma.$transaction(async (tx) => {
        // Remove player
        await tx.player.delete({
          where: {
            user_id_game_id: {
              user_id: userId,
              game_id: gameId
            }
          }
        });

        // Update game current_players count
        await tx.game.update({
          where: { id: gameId },
          data: {
            current_players: {
              decrement: 1
            }
          }
        });

        // Handle host transfer or game deletion
        if (isHost) {
          return await this.handleHostLeaveInternal(gameId, tx);
        }

        return { gameDeleted: false };
      });

      return result;

    } catch (error) {
      logger.error('Error leaving game:', error);
      throw new Error(`Failed to leave game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle host leaving - transfer or delete game (internal transaction version)
   */
  private async handleHostLeaveInternal(
    gameId: string,
    tx: any
  ): Promise<{ gameDeleted: boolean; newHostId?: string }> {
    // Get remaining players ordered by join time
    const players = await tx.player.findMany({
      where: { game_id: gameId },
      orderBy: { joined_at: 'asc' }
    });

    if (players && players.length > 0) {
      // Transfer host to oldest remaining player
      const newHostId = players[0]!.user_id;

      await tx.player.update({
        where: {
          user_id_game_id: {
            user_id: newHostId,
            game_id: gameId
          }
        },
        data: { is_host: true }
      });

      return { gameDeleted: false, newHostId };
    } else {
      // Delete empty game
      await tx.game.delete({
        where: { id: gameId }
      });

      return { gameDeleted: true };
    }
  }

  /**
   * Start game (host only)
   */
  async startGame(gameId: string, userId: string): Promise<void> {
    try {
      // Verify host
      const player = await prisma.player.findUnique({
        where: {
          user_id_game_id: {
            user_id: userId,
            game_id: gameId
          }
        }
      });

      if (!player?.is_host) throw new Error('Only host can start the game');

      // Check game status and player count
      const game = await prisma.game.findUnique({
        where: { id: gameId },
        include: {
          _count: {
            select: {
              players: true
            }
          }
        }
      });

      if (!game) throw new Error('Game not found');
      if (game.status !== 'WAITING') throw new Error('Game has already started or finished');
      if (game._count.players < 4) {
        throw new Error('Need at least 4 players to start');
      }
      if (game._count.players > game.max_players) {
        throw new Error('Too many players in game');
      }

      // Start the game - update status
      await prisma.game.update({
        where: { id: gameId },
        data: {
          status: 'IN_PROGRESS',
          phase: 'NIGHT',
          started_at: new Date()
        }
      });

    } catch (error) {
      logger.error('Error starting game:', error);
      throw new Error(`Failed to start game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * End game (host only)
   */
  async endGame(gameId: string, userId: string): Promise<GameResponse> {
    try {
      // Check if user is host
      const player = await prisma.player.findUnique({
        where: {
          user_id_game_id: {
            user_id: userId,
            game_id: gameId
          }
        }
      });

      if (!player?.is_host) throw new Error('Only host can end the game');

      // Update game status to finished
      await prisma.game.update({
        where: { id: gameId },
        data: {
          status: 'FINISHED',
          finished_at: new Date()
        }
      });

      return this.getGameDetails(gameId);

    } catch (error) {
      logger.error('Error ending game:', error);
      throw new Error(`Failed to end game: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Format game response
   */
  private formatGameResponse(game: {
    id: string;
    name: string;
    code: string;
    status: string;
    creator_id: string;
    max_players: number;
    current_players?: number;
    created_at: Date | string;
    phase?: string;
    day_number?: number;
    time_remaining?: number;
    host_name?: string;
  }): GameResponse {
    return {
      id: game.id,
      name: game.name,
      code: game.code,
      status: game.status,
      creatorId: game.creator_id,
      maxPlayers: game.max_players,
      currentPlayers: game.current_players || 0,
      createdAt: typeof game.created_at === 'string' ? game.created_at : game.created_at.toISOString(),
      playerCount: game.current_players || 0,
      phase: game.phase || 'waiting',
      dayNumber: game.day_number || 1,
      timeRemaining: game.time_remaining || 0,
      hostName: game.host_name || 'Unknown',
    };
  }

  /**
   * Format game response with players
   */
  private formatGameResponseWithPlayers(game: {
    id: string;
    name: string;
    code: string;
    status: string;
    creator_id: string;
    max_players: number;
    current_players?: number;
    created_at: Date | string;
    phase?: string;
    day_number?: number;
    time_remaining?: number;
    host_name?: string;
    players: Array<{
      user_id: string;
      profile: { username?: string; avatar_url?: string };
      role?: string;
      is_alive?: boolean;
      is_host?: boolean;
      joined_at?: string;
    }>;
  }): GameResponse {
    const response = this.formatGameResponse(game);

    response.players = game.players.map(p => {
      const player: PlayerResponse & { user_id: string; werewolf_team?: string } = {
        id: p.user_id,
        userId: p.user_id,
        user_id: p.user_id, // Add for test compatibility
        username: p.profile.username || 'Unknown',
        isHost: p.is_host || false,
        isAlive: p.is_alive || true,
        hasVoted: false, // Default value
        status: 'active', // Default value
        joinedAt: p.joined_at || new Date().toISOString(),
      };

      if (p.profile.avatar_url) {
        player.avatarUrl = p.profile.avatar_url;
      }

      if (p.role) {
        player.role = p.role;
        // Add werewolf_team for test compatibility
        if (p.role === 'WEREWOLF') {
          player.werewolf_team = 'werewolf';
        } else {
          player.werewolf_team = 'villager';
        }
      }

      return player;
    });

    return response;
  }

  /**
   * Get host transfer info (used by socket events)
   */
  async getHostTransferInfo(gameId: string): Promise<{ newHostId?: string }> {
    try {
      const players = await prisma.player.findMany({
        where: { game_id: gameId },
        orderBy: { joined_at: 'asc' }
      });

      const currentHost = players?.find(p => p.is_host);
      if (!currentHost && players && players.length > 0) {
        return { newHostId: players[0]!.user_id };
      }

      return {};
    } catch (error) {
      logger.error('Error getting host transfer info:', error);
      return {};
    }
  }

  // =================== COMPATIBILITY METHODS ===================
  // These methods provide compatibility with the full GameService interface
  // but are simplified for development use

  /**
   * Handle host leaving - called by socket events
   */
  async handleHostLeave(gameId: string): Promise<{ gameDeleted: boolean; newHostId?: string }> {
    return this.handleHostLeaveInternal(gameId, prisma);
  }

  /**
   * Start game with roles (simplified for dev)
   */
  async startGameWithRoles(gameId: string, hostId: string): Promise<{
    success: boolean;
    message: string;
    roleAssignments?: Array<{ userId: string; role: PlayerRole }>;
  }> {
    try {
      await this.startGame(gameId, hostId);
      return {
        success: true,
        message: 'Game started successfully',
        roleAssignments: [] // Simplified for dev
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get player role (simplified for dev)
   */
  getPlayerRole(gameId: string, userId: string): PlayerRole | null {
    // Simplified implementation - in production this would use cached state
    return null;
  }

  /**
   * Get available actions (simplified for dev)
   */
  getAvailableActions(gameId: string, userId: string): ActionType[] {
    return [];
  }

  /**
   * Perform night action (simplified for dev)
   */
  async performNightAction(gameId: string, action: NightAction): Promise<{
    success: boolean;
    message: string;
    revealedInfo?: unknown;
  }> {
    return { success: false, message: 'Not implemented in dev mode' };
  }

  /**
   * Resolve night phase (simplified for dev)
   */
  async resolveNightPhase(gameId: string): Promise<{
    success: boolean;
    message: string;
    deaths: string[];
    gameEnded: boolean;
    winner?: WinCondition;
  }> {
    return {
      success: false,
      message: 'Not implemented in dev mode',
      deaths: [],
      gameEnded: false
    };
  }

  /**
   * Start night phase (simplified for dev)
   */
  async startNightPhase(gameId: string): Promise<{ success: boolean; message: string }> {
    return { success: false, message: 'Not implemented in dev mode' };
  }

  /**
   * Set role configuration (simplified for dev)
   */
  async setRoleConfiguration(gameId: string, config: GameRoleConfig): Promise<void> {
    // Store in memory for dev mode
    this.roleConfigurations.set(gameId, config);
  }

  /**
   * Get role configuration (simplified for dev)
   */
  getRoleConfiguration(gameId: string): GameRoleConfig | null {
    return this.roleConfigurations.get(gameId) || null;
  }

  /**
   * Get game state (simplified for dev)
   */
  getGameState(gameId: string): {
    phase: GamePhaseState | null;
    players: PlayerState[] | null;
  } {
    return {
      phase: this.gameStates.get(gameId) || null,
      players: this.playerStates.get(gameId) || null,
    };
  }

  /**
   * Are all night actions submitted (simplified for dev)
   */
  areAllNightActionsSubmitted(gameId: string): boolean {
    return true; // Simplified for dev
  }

  /**
   * Get night actions summary (simplified for dev)
   */
  getNightActionsSummary(gameId: string): unknown {
    return null;
  }

  /**
   * Perform village vote (simplified for dev)
   */
  async performVillageVote(
    gameId: string,
    votes: Array<{ voterId: string; targetId: string }>
  ): Promise<{
    success: boolean;
    message: string;
    eliminatedPlayer?: string;
    gameEnded: boolean;
    winner?: WinCondition;
  }> {
    return {
      success: false,
      message: 'Not implemented in dev mode',
      gameEnded: false
    };
  }
}