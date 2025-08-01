/**
 * Application Configuration Interface
 */

export interface IAppConfig {
  // Server Configuration
  readonly nodeEnv: string;
  readonly port: number;
  readonly host: string;
  readonly wsPort: number;

  // Database Configuration
  readonly databaseUrl: string;
  readonly redisUrl: string;

  // Supabase Configuration
  readonly supabaseUrl?: string;
  readonly supabaseAnonKey?: string;
  readonly supabaseServiceRoleKey?: string;

  // JWT Configuration
  readonly jwtSecret: string;
  readonly jwtExpiresIn: string;
  readonly jwtRefreshSecret: string;
  readonly jwtRefreshExpiresIn: string;

  // Security Configuration
  readonly bcryptRounds: number;
  readonly argon2Memory: number;
  readonly argon2Time: number;
  readonly argon2Parallelism: number;

  // Rate Limiting Configuration
  readonly rateLimitWindowMs: number;
  readonly rateLimitMaxRequests: number;

  // Game Configuration
  readonly gameCodeLength: number;
  readonly maxPlayersPerGame: number;
  readonly minPlayersPerGame: number;
  readonly gameTimeoutMinutes: number;
  readonly chatMessageRateLimit: number;

  // Socket Authentication Configuration
  readonly socketAuthTimeout: number;
  readonly maxConnectionsPerIp: number;
  readonly maxConnectionsPerUser: number;

  // CORS Configuration
  readonly corsOrigin: string;

  // Logging Configuration
  readonly logLevel: string;
  readonly logFile: string;
  readonly logToFile: boolean;

  // Session Configuration
  readonly sessionSecret: string;

  // Email Configuration
  readonly mailHost?: string;
  readonly mailPort?: number;
  readonly mailUser?: string;
  readonly mailPassword?: string;

  // Werewolf-specific Configuration
  readonly moonCycleDays: number;
  readonly transformationCooldownHours: number;
  readonly territoryClaimRadiusKm: number;
  readonly packMaxSize: number;
  readonly alphaChallengeeCooldownDays: number;

  // Utility methods
  readonly isDevelopment: boolean;
  readonly isProduction: boolean;
  readonly isTest: boolean;
}