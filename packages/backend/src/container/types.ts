/**
 * Dependency Injection Container Types
 * Defines service identifiers for IoC container
 */

export const TYPES = {
  // Core Services
  Logger: Symbol.for('Logger'),
  Database: Symbol.for('Database'),
  Redis: Symbol.for('Redis'),
  
  // Authentication Services
  AuthService: Symbol.for('AuthService'),
  JwtService: Symbol.for('JwtService'),
  PasswordService: Symbol.for('PasswordService'),
  SessionService: Symbol.for('SessionService'),
  
  // Business Services
  UserService: Symbol.for('UserService'),
  PackService: Symbol.for('PackService'),
  TerritoryService: Symbol.for('TerritoryService'),
  MoonPhaseService: Symbol.for('MoonPhaseService'),
  GameService: Symbol.for('GameService'),
  
  // Repository Layer
  UserRepository: Symbol.for('UserRepository'),
  PackRepository: Symbol.for('PackRepository'),
  TerritoryRepository: Symbol.for('TerritoryRepository'),
  MoonPhaseRepository: Symbol.for('MoonPhaseRepository'),
  RefreshTokenRepository: Symbol.for('RefreshTokenRepository'),
  
  // Middleware
  AuthMiddleware: Symbol.for('AuthMiddleware'),
  ValidationMiddleware: Symbol.for('ValidationMiddleware'),
  
  // Configuration
  AppConfig: Symbol.for('AppConfig')
} as const;

export type ServiceType = typeof TYPES[keyof typeof TYPES];