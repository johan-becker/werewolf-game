import { prisma } from '@/database';
import { logger } from '@utils/logger';
import {
  Game,
  GameStatus,
  GameCreateData,
  GameWithDetails,
  GameJoinData,
  GameFilters,
  PaginationOptions,
  PaginatedResponse,
  GameSettingsType,
  DatabaseError,
  ValidationError,
  ConflictError,
  NotFoundError
} from '@/types/database';
import { $Enums } from '../generated/prisma';

export class GameService {
  // Generate a unique 6-character game code
  private static generateGameCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Create a new game
  static async createGame(gameData: GameCreateData): Promise<GameWithDetails> {
    try {
      // Generate unique game code
      let gameCode: string;
      let isUnique = false;
      let attempts = 0;
      const maxAttempts = 10;

      do {
        gameCode = this.generateGameCode();
        const existingGame = await prisma.game.findUnique({
          where: { code: gameCode }
        });
        isUnique = !existingGame;
        attempts++;
      } while (!isUnique && attempts < maxAttempts);

      if (!isUnique) {
        throw new DatabaseError('Failed to generate unique game code');
      }

      // Default game settings
      const defaultSettings: GameSettingsType = {
        roles: {
          werewolf: 2,
          villager: 6,
          seer: 1,
          doctor: 1
        },
        timing: {
          dayPhaseSeconds: 300,
          nightPhaseSeconds: 120,
          votingSeconds: 60
        },
        rules: {
          allowSpectators: true,
          revealRolesOnDeath: true,
          enableChat: true
        }
      };

      const game = await prisma.game.create({
        data: {
          name: gameData.name,
          code: gameCode!,
          maxPlayers: gameData.maxPlayers || 12,
          gameSettings: gameData.gameSettings || defaultSettings as any,
          creatorId: gameData.creatorId,
          currentPlayers: 1
        },
        include: {
          creator: true,
          players: {
            include: { user: true }
          },
          _count: {
            select: { players: true }
          }
        }
      });

      // Add creator as first player and host
      await prisma.player.create({
        data: {
          userId: gameData.creatorId,
          gameId: game.id,
          isHost: true
        }
      });

      logger.info(`Game created: ${game.name} (${game.code}) by ${game.creator.username}`);
      return game;

    } catch (error) {
      logger.error('Error creating game:', error);
      throw new DatabaseError('Failed to create game');
    }
  }

  // Get game by ID with full details
  static async getGameById(id: string): Promise<GameWithDetails | null> {
    try {
      return await prisma.game.findUnique({
        where: { id },
        include: {
          creator: true,
          players: {
            include: { user: true },
            orderBy: { joinedAt: 'asc' }
          },
          _count: {
            select: { players: true }
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching game by ID:', error);
      throw new DatabaseError('Failed to fetch game');
    }
  }

  // Get game by code
  static async getGameByCode(code: string): Promise<GameWithDetails | null> {
    try {
      return await prisma.game.findUnique({
        where: { code },
        include: {
          creator: true,
          players: {
            include: { user: true },
            orderBy: { joinedAt: 'asc' }
          },
          _count: {
            select: { players: true }
          }
        }
      });
    } catch (error) {
      logger.error('Error fetching game by code:', error);
      throw new DatabaseError('Failed to fetch game');
    }
  }

  // Join a game
  static async joinGame(joinData: GameJoinData): Promise<GameWithDetails> {
    try {
      const game = await this.getGameByCode(joinData.gameCode);

      if (!game) {
        throw new NotFoundError('Game', joinData.gameCode);
      }

      if (game.status !== $Enums.GameStatus.WAITING) {
        throw new ConflictError('Game is not accepting new players');
      }

      if (game.currentPlayers >= game.maxPlayers) {
        throw new ConflictError('Game is full');
      }

      // Check if user is already in the game
      const existingPlayer = await prisma.player.findUnique({
        where: {
          userId_gameId: {
            userId: joinData.userId,
            gameId: game.id
          }
        }
      });

      if (existingPlayer) {
        throw new ConflictError('User is already in this game');
      }

      // Add player to game
      await prisma.$transaction(async (tx) => {
        await tx.player.create({
          data: {
            userId: joinData.userId,
            gameId: game.id
          }
        });

        await tx.game.update({
          where: { id: game.id },
          data: { currentPlayers: { increment: 1 } }
        });
      });

      logger.info(`User ${joinData.userId} joined game ${game.code}`);

      // Return updated game
      return (await this.getGameById(game.id))!;

    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      logger.error('Error joining game:', error);
      throw new DatabaseError('Failed to join game');
    }
  }

  // Leave a game
  static async leaveGame(userId: string, gameId: string): Promise<void> {
    try {
      const player = await prisma.player.findUnique({
        where: {
          userId_gameId: { userId, gameId }
        },
        include: { game: true }
      });

      if (!player) {
        throw new NotFoundError('Player in game');
      }

      if (player.game.status === $Enums.GameStatus.RUNNING) {
        throw new ConflictError('Cannot leave a running game');
      }

      await prisma.$transaction(async (tx) => {
        await tx.player.delete({
          where: {
            userId_gameId: { userId, gameId }
          }
        });

        await tx.game.update({
          where: { id: gameId },
          data: { currentPlayers: { decrement: 1 } }
        });

        // If host leaves, assign new host
        if (player.isHost) {
          const nextPlayer = await tx.player.findFirst({
            where: { gameId },
            orderBy: { joinedAt: 'asc' }
          });

          if (nextPlayer) {
            await tx.player.update({
              where: {
                userId_gameId: {
                  userId: nextPlayer.userId,
                  gameId
                }
              },
              data: { isHost: true }
            });
          }
        }
      });

      logger.info(`User ${userId} left game ${gameId}`);

    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      logger.error('Error leaving game:', error);
      throw new DatabaseError('Failed to leave game');
    }
  }

  // Start a game
  static async startGame(gameId: string, hostId: string): Promise<GameWithDetails> {
    try {
      const game = await this.getGameById(gameId);

      if (!game) {
        throw new NotFoundError('Game', gameId);
      }

      // Verify user is host
      const host = game.players.find(p => p.userId === hostId && p.isHost);
      if (!host) {
        throw new ValidationError('Only the host can start the game');
      }

      if (game.status !== $Enums.GameStatus.WAITING) {
        throw new ConflictError('Game is not in waiting state');
      }

      if (game.currentPlayers < 5) {
        throw new ValidationError('Need at least 5 players to start');
      }

      // Update game status
      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: {
          status: $Enums.GameStatus.RUNNING,
          startedAt: new Date()
        },
        include: {
          creator: true,
          players: {
            include: { user: true }
          },
          _count: {
            select: { players: true }
          }
        }
      });

      logger.info(`Game ${game.code} started by ${host.user.username}`);
      return updatedGame;

    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError || error instanceof ValidationError) {
        throw error;
      }
      logger.error('Error starting game:', error);
      throw new DatabaseError('Failed to start game');
    }
  }

  // End a game
  static async endGame(gameId: string): Promise<void> {
    try {
      await prisma.game.update({
        where: { id: gameId },
        data: {
          status: $Enums.GameStatus.FINISHED,
          finishedAt: new Date()
        }
      });

      logger.info(`Game ${gameId} ended`);

    } catch (error) {
      logger.error('Error ending game:', error);
      throw new DatabaseError('Failed to end game');
    }
  }

  // Get games with pagination and filters
  static async getGames(
    filters: GameFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResponse<GameWithDetails>> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
      const { status, creatorId, hasSlots } = filters;

      const where: any = {};
      if (status) {
        where.status = status;
      }
      if (creatorId) {
        where.creatorId = creatorId;
      }
      if (hasSlots) {
        where.currentPlayers = { lt: { _ref: 'maxPlayers' } };
      }

      const [games, total] = await Promise.all([
        prisma.game.findMany({
          where,
          include: {
            creator: true,
            players: {
              include: { user: true }
            },
            _count: {
              select: { players: true }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.game.count({ where })
      ]);

      return {
        data: games,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };

    } catch (error) {
      logger.error('Error fetching games:', error);
      throw new DatabaseError('Failed to fetch games');
    }
  }

  // Update game settings
  static async updateGameSettings(
    gameId: string,
    hostId: string,
    settings: Partial<GameSettingsType>
  ): Promise<GameWithDetails> {
    try {
      const game = await this.getGameById(gameId);

      if (!game) {
        throw new NotFoundError('Game', gameId);
      }

      const host = game.players.find(p => p.userId === hostId && p.isHost);
      if (!host) {
        throw new ValidationError('Only the host can update game settings');
      }

      if (game.status !== $Enums.GameStatus.WAITING) {
        throw new ConflictError('Cannot update settings of a running game');
      }

      const currentSettings = game.gameSettings as any as GameSettingsType;
      const updatedSettings = { ...currentSettings, ...settings };

      const updatedGame = await prisma.game.update({
        where: { id: gameId },
        data: { gameSettings: updatedSettings },
        include: {
          creator: true,
          players: {
            include: { user: true }
          },
          _count: {
            select: { players: true }
          }
        }
      });

      logger.info(`Game settings updated for ${game.code}`);
      return updatedGame;

    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError || error instanceof ConflictError) {
        throw error;
      }
      logger.error('Error updating game settings:', error);
      throw new DatabaseError('Failed to update game settings');
    }
  }
}