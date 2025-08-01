/**
 * Application Configuration
 * Centralized configuration management with validation
 */

import { injectable } from 'inversify';
import { z } from 'zod';
import { IAppConfig } from '../interfaces/config/app-config.interface';

// Configuration validation schema
const ConfigSchema = z.object({
  // Server Configuration
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
  WS_PORT: z.coerce.number().default(3001),

  // Database Configuration
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  REDIS_URL: z.string().min(1, 'Redis URL is required'),

  // Supabase Configuration
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // JWT Configuration
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Security Configuration
  BCRYPT_ROUNDS: z.coerce.number().default(12),
  ARGON2_MEMORY: z.coerce.number().default(65536), // 64MB
  ARGON2_TIME: z.coerce.number().default(3),
  ARGON2_PARALLELISM: z.coerce.number().default(4),

  // Rate Limiting Configuration
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

  // Game Configuration
  GAME_CODE_LENGTH: z.coerce.number().default(6),
  MAX_PLAYERS_PER_GAME: z.coerce.number().default(20),
  MIN_PLAYERS_PER_GAME: z.coerce.number().default(5),
  GAME_TIMEOUT_MINUTES: z.coerce.number().default(30),
  CHAT_MESSAGE_RATE_LIMIT: z.coerce.number().default(5),

  // Socket Authentication Configuration
  SOCKET_AUTH_TIMEOUT: z.coerce.number().default(5000), // 5 seconds
  MAX_CONNECTIONS_PER_IP: z.coerce.number().default(10),
  MAX_CONNECTIONS_PER_USER: z.coerce.number().default(3),

  // CORS Configuration
  CORS_ORIGIN: z.string().default('http://localhost:3002'),

  // Logging Configuration
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE: z.string().default('logs/app.log'),
  LOG_TO_FILE: z.coerce.boolean().default(true),

  // Session Configuration
  SESSION_SECRET: z.string().min(32, 'Session secret must be at least 32 characters'),

  // Email Configuration (optional)
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.coerce.number().optional(),
  MAIL_USER: z.string().optional(),
  MAIL_PASSWORD: z.string().optional(),

  // Werewolf-specific Configuration
  MOON_CYCLE_DAYS: z.coerce.number().default(29), // Lunar cycle
  TRANSFORMATION_COOLDOWN_HOURS: z.coerce.number().default(24),
  TERRITORY_CLAIM_RADIUS_KM: z.coerce.number().default(5),
  PACK_MAX_SIZE: z.coerce.number().default(12),
  ALPHA_CHALLENGE_COOLDOWN_DAYS: z.coerce.number().default(7)
});

export type ConfigType = z.infer<typeof ConfigSchema>;

@injectable()
export class AppConfig implements IAppConfig {
  private readonly config: ConfigType;

  constructor() {
    try {
      this.config = ConfigSchema.parse(process.env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        throw new Error(`Configuration validation failed:\n${errorMessages.join('\n')}`);
      }
      throw error;
    }
  }

  // Server Configuration
  get nodeEnv(): string { return this.config.NODE_ENV; }
  get port(): number { return this.config.PORT; }
  get host(): string { return this.config.HOST; }
  get wsPort(): number { return this.config.WS_PORT; }

  // Database Configuration
  get databaseUrl(): string { return this.config.DATABASE_URL; }
  get redisUrl(): string { return this.config.REDIS_URL; }

  // Supabase Configuration
  get supabaseUrl(): string | undefined { return this.config.SUPABASE_URL; }
  get supabaseAnonKey(): string | undefined { return this.config.SUPABASE_ANON_KEY; }
  get supabaseServiceRoleKey(): string | undefined { return this.config.SUPABASE_SERVICE_ROLE_KEY; }

  // JWT Configuration
  get jwtSecret(): string { return this.config.JWT_SECRET; }
  get jwtExpiresIn(): string { return this.config.JWT_EXPIRES_IN; }
  get jwtRefreshSecret(): string { return this.config.JWT_REFRESH_SECRET; }
  get jwtRefreshExpiresIn(): string { return this.config.JWT_REFRESH_EXPIRES_IN; }

  // Security Configuration
  get bcryptRounds(): number { return this.config.BCRYPT_ROUNDS; }
  get argon2Memory(): number { return this.config.ARGON2_MEMORY; }
  get argon2Time(): number { return this.config.ARGON2_TIME; }
  get argon2Parallelism(): number { return this.config.ARGON2_PARALLELISM; }

  // Rate Limiting Configuration
  get rateLimitWindowMs(): number { return this.config.RATE_LIMIT_WINDOW_MS; }
  get rateLimitMaxRequests(): number { return this.config.RATE_LIMIT_MAX_REQUESTS; }

  // Game Configuration
  get gameCodeLength(): number { return this.config.GAME_CODE_LENGTH; }
  get maxPlayersPerGame(): number { return this.config.MAX_PLAYERS_PER_GAME; }
  get minPlayersPerGame(): number { return this.config.MIN_PLAYERS_PER_GAME; }
  get gameTimeoutMinutes(): number { return this.config.GAME_TIMEOUT_MINUTES; }
  get chatMessageRateLimit(): number { return this.config.CHAT_MESSAGE_RATE_LIMIT; }

  // Socket Authentication Configuration
  get socketAuthTimeout(): number { return this.config.SOCKET_AUTH_TIMEOUT; }
  get maxConnectionsPerIp(): number { return this.config.MAX_CONNECTIONS_PER_IP; }
  get maxConnectionsPerUser(): number { return this.config.MAX_CONNECTIONS_PER_USER; }

  // CORS Configuration
  get corsOrigin(): string { return this.config.CORS_ORIGIN; }

  // Logging Configuration
  get logLevel(): string { return this.config.LOG_LEVEL; }
  get logFile(): string { return this.config.LOG_FILE; }
  get logToFile(): boolean { return this.config.LOG_TO_FILE; }

  // Session Configuration
  get sessionSecret(): string { return this.config.SESSION_SECRET; }

  // Email Configuration
  get mailHost(): string | undefined { return this.config.MAIL_HOST; }
  get mailPort(): number | undefined { return this.config.MAIL_PORT; }
  get mailUser(): string | undefined { return this.config.MAIL_USER; }
  get mailPassword(): string | undefined { return this.config.MAIL_PASSWORD; }

  // Werewolf-specific Configuration
  get moonCycleDays(): number { return this.config.MOON_CYCLE_DAYS; }
  get transformationCooldownHours(): number { return this.config.TRANSFORMATION_COOLDOWN_HOURS; }
  get territoryClaimRadiusKm(): number { return this.config.TERRITORY_CLAIM_RADIUS_KM; }
  get packMaxSize(): number { return this.config.PACK_MAX_SIZE; }
  get alphaChallengeeCooldownDays(): number { return this.config.ALPHA_CHALLENGE_COOLDOWN_DAYS; }

  // Utility methods
  get isDevelopment(): boolean { return this.config.NODE_ENV === 'development'; }
  get isProduction(): boolean { return this.config.NODE_ENV === 'production'; }
  get isTest(): boolean { return this.config.NODE_ENV === 'test'; }

  // Get all configuration (for debugging)
  getAll(): ConfigType { return { ...this.config }; }
}