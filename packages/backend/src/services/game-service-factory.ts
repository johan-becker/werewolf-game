import { hasSupabaseConfig } from '../lib/supabase';
import { GameService } from './game.service';
import { DevGameService } from './game.service.dev';
import { logger } from '../utils/logger';

/**
 * Factory function to create the appropriate game service based on configuration
 */
export function createGameService(): GameService | DevGameService {
  if (hasSupabaseConfig) {
    logger.info('Using production game service with Supabase integration');
    return new GameService();
  } else {
    logger.warn('Using development game service (Prisma-only) - Supabase not configured');
    return new DevGameService();
  }
}

// Create singleton instance for the application
export const gameServiceInstance = createGameService();