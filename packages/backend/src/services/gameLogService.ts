import { prisma } from '@/database';
import { logger } from '@utils/logger';
import {
  GameLog,
  GameLogCreateData,
  GameLogWithDetails,
  GameActionType,
  GamePhase,
  PaginationOptions,
  PaginatedResponse,
  DatabaseError,
} from '@/types/database';
import { $Enums } from '../generated/prisma';

export class GameLogService {
  // Create a new game log entry
  static async createGameLog(logData: GameLogCreateData): Promise<GameLog> {
    try {
      const gameLog = await prisma.gameLog.create({
        data: {
          game_id: logData.gameId,
          day_number: logData.roundNumber,
          phase: logData.phase,
          action: logData.actionType,
          user_id: logData.actorId || null,
          details: logData.details,
        },
      });

      logger.debug(`Game log created: ${logData.actionType} in game ${logData.gameId}`);
      return gameLog;
    } catch (error) {
      logger.error('Error creating game log:', error);
      throw new DatabaseError('Failed to create game log');
    }
  }

  // Get game logs for a specific game
  static async getGameLogs(
    gameId: string,
    pagination: PaginationOptions = {}
  ): Promise<PaginatedResponse<GameLogWithDetails>> {
    try {
      const { page = 1, limit = 50, sortBy = 'created_at', sortOrder = 'asc' } = pagination;

      const [logs, total] = await Promise.all([
        prisma.gameLog.findMany({
          where: { game_id: gameId },
          include: {
            game: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.gameLog.count({ where: { game_id: gameId } }),
      ]);

      return {
        data: logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error('Error fetching game logs:', error);
      throw new DatabaseError('Failed to fetch game logs');
    }
  }

  // Get logs for a specific round and phase
  static async getRoundLogs(
    gameId: string,
    roundNumber: number,
    phase?: GamePhase
  ): Promise<GameLogWithDetails[]> {
    try {
      const where: any = { game_id: gameId, day_number: roundNumber };
      if (phase) {
        where.phase = phase;
      }

      return await prisma.gameLog.findMany({
        where,
        include: {
          game: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
        orderBy: { created_at: 'asc' },
      });
    } catch (error) {
      logger.error('Error fetching round logs:', error);
      throw new DatabaseError('Failed to fetch round logs');
    }
  }

  // Log player action
  static async logPlayerAction(
    gameId: string,
    roundNumber: number,
    phase: GamePhase,
    actionType: GameActionType,
    actorId: string,
    targetId?: string | null,
    details?: any
  ): Promise<GameLog> {
    return this.createGameLog({
      gameId,
      roundNumber,
      phase,
      actionType,
      actorId,
      targetId: targetId || null,
      details,
    });
  }

  // Log game event (no specific actor)
  static async logGameEvent(
    gameId: string,
    roundNumber: number,
    phase: GamePhase,
    actionType: GameActionType,
    details?: any
  ): Promise<GameLog> {
    return this.createGameLog({
      gameId,
      roundNumber,
      phase,
      actionType,
      details,
    });
  }

  // Log voting action
  static async logVote(
    gameId: string,
    roundNumber: number,
    voterId: string,
    targetId: string
  ): Promise<GameLog> {
    return this.logPlayerAction(
      gameId,
      roundNumber,
      $Enums.GamePhase.DAY,
      'VOTE',
      voterId,
      targetId,
      { action: 'vote', target: targetId }
    );
  }

  // Log werewolf kill
  static async logWerewolfKill(
    gameId: string,
    roundNumber: number,
    killerId: string,
    victimId: string
  ): Promise<GameLog> {
    return this.logPlayerAction(
      gameId,
      roundNumber,
      $Enums.GamePhase.NIGHT,
      'WEREWOLF_KILL',
      killerId,
      victimId,
      { action: 'kill', victim: victimId }
    );
  }

  // Log seer check
  static async logSeerCheck(
    gameId: string,
    roundNumber: number,
    seerId: string,
    targetId: string,
    result: 'werewolf' | 'villager'
  ): Promise<GameLog> {
    return this.logPlayerAction(
      gameId,
      roundNumber,
      $Enums.GamePhase.NIGHT,
      'SEER_CHECK',
      seerId,
      targetId,
      { action: 'seer_check', target: targetId, result }
    );
  }

  // Log doctor heal
  static async logDoctorHeal(
    gameId: string,
    roundNumber: number,
    doctorId: string,
    targetId: string
  ): Promise<GameLog> {
    return this.logPlayerAction(
      gameId,
      roundNumber,
      $Enums.GamePhase.NIGHT,
      'DOCTOR_HEAL',
      doctorId,
      targetId,
      { action: 'heal', target: targetId }
    );
  }

  // Log player elimination
  static async logPlayerElimination(
    gameId: string,
    roundNumber: number,
    phase: GamePhase,
    eliminatedId: string,
    reason: 'vote' | 'werewolf_kill' | 'hunter_shot',
    details?: any
  ): Promise<GameLog> {
    return this.logPlayerAction(
      gameId,
      roundNumber,
      phase,
      'PLAYER_ELIMINATED',
      eliminatedId,
      undefined,
      { reason, ...details }
    );
  }

  // Log game start
  static async logGameStart(gameId: string): Promise<GameLog> {
    return this.logGameEvent(gameId, 0, $Enums.GamePhase.DAY, 'GAME_START', {
      event: 'game_started',
    });
  }

  // Log game end
  static async logGameEnd(
    gameId: string,
    roundNumber: number,
    winningTeam: 'werewolves' | 'villagers',
    survivors: string[]
  ): Promise<GameLog> {
    return this.logGameEvent(gameId, roundNumber, $Enums.GamePhase.DAY, 'GAME_END', {
      event: 'game_ended',
      winner: winningTeam,
      survivors,
    });
  }

  // Log phase change
  static async logPhaseChange(
    gameId: string,
    roundNumber: number,
    newPhase: GamePhase
  ): Promise<GameLog> {
    return this.logGameEvent(gameId, roundNumber, newPhase, 'PHASE_CHANGE', {
      event: 'phase_change',
      phase: newPhase,
      round: roundNumber,
    });
  }

  // Log player join
  static async logPlayerJoin(gameId: string, playerId: string, username: string): Promise<GameLog> {
    return this.logPlayerAction(
      gameId,
      0,
      $Enums.GamePhase.DAY,
      'PLAYER_JOIN',
      playerId,
      undefined,
      { event: 'player_joined', username }
    );
  }

  // Log player leave
  static async logPlayerLeave(
    gameId: string,
    playerId: string,
    username: string
  ): Promise<GameLog> {
    return this.logPlayerAction(
      gameId,
      0,
      $Enums.GamePhase.DAY,
      'PLAYER_LEAVE',
      playerId,
      undefined,
      { event: 'player_left', username }
    );
  }

  // Get game statistics from logs
  static async getGameStatistics(gameId: string) {
    try {
      const logs = await prisma.gameLog.findMany({
        where: { game_id: gameId },
        select: {
          action: true,
          day_number: true,
          phase: true,
          details: true,
        },
      });

      const stats = {
        totalRounds: Math.max(...logs.map(l => l.day_number || 0), 0),
        totalActions: logs.length,
        actionsByType: {} as Record<string, number>,
        actionsByPhase: {
          DAY: 0,
          NIGHT: 0,
        },
        votingRounds: logs.filter(l => l.action === 'VOTE').length,
        eliminations: logs.filter(l => l.action === 'PLAYER_ELIMINATED').length,
      };

      // Count actions by type
      logs.forEach(log => {
        stats.actionsByType[log.action] = (stats.actionsByType[log.action] || 0) + 1;
        if (log.phase) {
          stats.actionsByPhase[log.phase]++;
        }
      });

      return stats;
    } catch (error) {
      logger.error('Error calculating game statistics:', error);
      throw new DatabaseError('Failed to calculate game statistics');
    }
  }

  // Delete logs for a game (cleanup)
  static async deleteGameLogs(gameId: string): Promise<void> {
    try {
      const result = await prisma.gameLog.deleteMany({
        where: { game_id: gameId },
      });

      logger.info(`Deleted ${result.count} logs for game ${gameId}`);
    } catch (error) {
      logger.error('Error deleting game logs:', error);
      throw new DatabaseError('Failed to delete game logs');
    }
  }
}
