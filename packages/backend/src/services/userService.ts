import { prisma } from '@/database';
import { logger } from '@utils/logger';
import {
  User,
  UserRegistrationData,
  UserProfile,
  UserFilters,
  PaginationOptions,
  PaginatedResponse,
  DatabaseError,
  ConflictError,
} from '@/types/database';

export class UserService {
  private static readonly SALT_ROUNDS = 12;

  // Create a new user
  static async createUser(userData: UserRegistrationData): Promise<User> {
    try {
      // Check if username already exists
      const existingUser = await prisma.profile.findFirst({
        where: {
          username: userData.username,
        },
      });

      if (existingUser) {
        throw new ConflictError('Username already exists');
      }

      // Create user profile (authentication handled by Supabase)
      const user = await prisma.profile.create({
        data: {
          id: crypto.randomUUID(), // Will be replaced by Supabase auth ID
          username: userData.username,
          full_name: null,
          avatar_url: null,
        },
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

  // Get user by username (authentication handled by Supabase)
  static async getUserByUsername(username: string): Promise<User | null> {
    try {
      const user = await prisma.profile.findUnique({
        where: { username: username },
      });

      if (!user) {
        return null;
      }

      logger.info(`User found: ${user.username}`);
      return user;
    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw new DatabaseError('Authentication failed');
    }
  }

  // Get user by ID
  static async getUserById(id: string): Promise<User | null> {
    try {
      return await prisma.profile.findUnique({
        where: { id },
      });
    } catch (error) {
      logger.error('Error fetching user by ID:', error);
      throw new DatabaseError('Failed to fetch user');
    }
  }

  // Get user profile with calculated win rate
  static async getUserProfile(id: string): Promise<UserProfile | null> {
    try {
      const user = await prisma.profile.findUnique({
        where: { id },
      });

      if (!user) {
        return null;
      }

      const winRate = user.games_played > 0 ? (user.games_won / user.games_played) * 100 : 0;

      return {
        id: user.id,
        username: user.username || 'Unknown',
        email: '', // Email handled by Supabase Auth
        gamesPlayed: user.games_played,
        gamesWon: user.games_won,
        winRate: Math.round(winRate * 100) / 100,
        createdAt: user.created_at,
        lastLogin: null, // Not tracked in current schema
      };
    } catch (error) {
      logger.error('Error fetching user profile:', error);
      throw new DatabaseError('Failed to fetch user profile');
    }
  }

  // Update user stats after game
  static async updateUserStats(userId: string, won: boolean): Promise<void> {
    try {
      await prisma.profile.update({
        where: { id: userId },
        data: {
          games_played: { increment: 1 },
          ...(won && { games_won: { increment: 1 } }),
        },
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
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = pagination;
      const { minGamesPlayed } = filters;

      const where: any = {};
      // Note: isActive field doesn't exist in current schema
      if (minGamesPlayed !== undefined) {
        where.games_played = { gte: minGamesPlayed };
      }

      const [users, total] = await Promise.all([
        prisma.profile.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.profile.count({ where }),
      ]);

      return {
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching users:', error);
      throw new DatabaseError('Failed to fetch users');
    }
  }

  // Update user
  static async updateUser(id: string, updateData: Partial<User>): Promise<User> {
    try {
      const user = await prisma.profile.update({
        where: { id },
        data: updateData,
      });

      logger.info(`User updated: ${user.username} (${user.id})`);
      return user;
    } catch (error) {
      logger.error('Error updating user:', error);
      throw new DatabaseError('Failed to update user');
    }
  }

  // Note: User deactivation not implemented in current schema
  // Users are managed through Supabase Auth
  static async deactivateUser(id: string): Promise<void> {
    try {
      // In current implementation, we would need to delete the profile
      // or add an isActive field to the schema
      await prisma.profile.delete({
        where: { id },
      });

      logger.info(`User profile deleted: ${id}`);
    } catch (error) {
      logger.error('Error deleting user profile:', error);
      throw new DatabaseError('Failed to delete user profile');
    }
  }

  // Get user's game history
  static async getUserGameHistory(userId: string, pagination: PaginationOptions = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;

      const [players, total] = await Promise.all([
        prisma.player.findMany({
          where: { user_id: userId },
          include: {
            game: {
              select: {
                id: true,
                name: true,
                status: true,
                created_at: true,
                started_at: true,
                finished_at: true,
              },
            },
          },
          orderBy: { joined_at: 'desc' },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.player.count({ where: { user_id: userId } }),
      ]);

      return {
        data: players,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching user game history:', error);
      throw new DatabaseError('Failed to fetch game history');
    }
  }
}
