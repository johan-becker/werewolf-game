import bcrypt from 'bcrypt';
import { prisma } from '@/database';
import { logger } from '@utils/logger';
import {
  User,
  UserCreateData,
  UserRegistrationData,
  UserLoginData,
  UserProfile,
  UserFilters,
  PaginationOptions,
  PaginatedResponse,
  DatabaseError,
  ValidationError,
  ConflictError,
  NotFoundError
} from '@/types/database';

export class UserService {
  private static readonly SALT_ROUNDS = 12;

  // Create a new user
  static async createUser(userData: UserRegistrationData): Promise<User> {
    try {
      // Check if username or email already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: userData.username },
            { email: userData.email }
          ]
        }
      });

      if (existingUser) {
        if (existingUser.username === userData.username) {
          throw new ConflictError('Username already exists');
        }
        throw new ConflictError('Email already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

      // Create user
      const user = await prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          passwordHash
        }
      });

      logger.info(`User created: ${user.username} (${user.id})`);
      return user;

    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      logger.error('Error creating user:', error);
      throw new DatabaseError('Failed to create user');
    }
  }

  // Authenticate user
  static async authenticateUser(loginData: UserLoginData): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { username: loginData.username }
      });

      if (!user || !user.isActive) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(loginData.password, user.passwordHash);
      if (!isPasswordValid) {
        return null;
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });

      logger.info(`User authenticated: ${user.username}`);
      return user;

    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw new DatabaseError('Authentication failed');
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw new DatabaseError('Failed to fetch user');
    }
  }

  // Get user by username
  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      return await prisma.user.findUnique({
        where: { username }
      });
    } catch (error) {
      logger.error('Error fetching user by username:', error);
      throw new DatabaseError('Failed to fetch user');
    }
  }

  // Get user profile with calculated win rate
  static async getUserProfile(id: string): Promise<UserProfile | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        return null;
      }

      const winRate = user.gamesPlayed > 0 ? (user.gamesWon / user.gamesPlayed) * 100 : 0;

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        gamesPlayed: user.gamesPlayed,
        gamesWon: user.gamesWon,
        winRate: Math.round(winRate * 100) / 100,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      };

    } catch (error) {
      logger.error('Error fetching user profile:', error);
      throw new DatabaseError('Failed to fetch user profile');
    }
  }

  // Update user stats after game
  static async updateUserStats(userId: string, won: boolean): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          gamesPlayed: { increment: 1 },
          ...(won && { gamesWon: { increment: 1 } })
        }
      });

      logger.info(`Updated stats for user ${userId}: won=${won}`);

    } catch (error) {
      logger.error('Error updating user stats:', error);
      throw new DatabaseError('Failed to update user stats');
    }
  }

  // Get users with pagination and filters
  static async getUsers(
    filters: UserFilters = {},
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResponse<User>> {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
      const { isActive, minGamesPlayed } = filters;

      const where: any = {};
      if (isActive !== undefined) {
        where.isActive = isActive;
      }
      if (minGamesPlayed !== undefined) {
        where.gamesPlayed = { gte: minGamesPlayed };
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.user.count({ where })
      ]);

      return {
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };

    } catch (error) {
      logger.error('Error fetching users:', error);
      throw new DatabaseError('Failed to fetch users');
    }
  }

  // Update user
  static async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updateData
      });

      logger.info(`User updated: ${user.username} (${user.id})`);
      return user;

    } catch (error) {
      logger.error('Error updating user:', error);
      throw new DatabaseError('Failed to update user');
    }
  }

  // Deactivate user (soft delete)
  static async deactivateUser(id: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id },
        data: { isActive: false }
      });

      logger.info(`User deactivated: ${id}`);

    } catch (error) {
      logger.error('Error deactivating user:', error);
      throw new DatabaseError('Failed to deactivate user');
    }
  }

  // Get user's game history
  static async getUserGameHistory(userId: string, pagination: PaginationOptions = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;

      const [players, total] = await Promise.all([
        prisma.player.findMany({
          where: { userId },
          include: {
            game: {
              select: {
                id: true,
                name: true,
                status: true,
                createdAt: true,
                startedAt: true,
                finishedAt: true
              }
            }
          },
          orderBy: { joinedAt: 'desc' },
          skip: (page - 1) * limit,
          take: limit
        }),
        prisma.player.count({ where: { userId } })
      ]);

      return {
        data: players,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };

    } catch (error) {
      logger.error('Error fetching user game history:', error);
      throw new DatabaseError('Failed to fetch game history');
    }
  }
}