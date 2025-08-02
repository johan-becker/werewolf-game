/**
 * Dependency Injection Container Configuration
 * Using InversifyJS for IoC container management
 */

import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Core Services
import { logger as Logger } from '../utils/logger';
import { DatabaseService } from '../services/core/database.service';
import { RedisService } from '../services/core/redis.service';
import { AppConfig } from '../config/app.config';

// Controllers
import { AuthController } from '../controllers/auth.enhanced.controller';
import { MoonPhaseController } from '../controllers/moon-phase.controller';
import { PackController } from '../controllers/pack.controller';
import { TerritoryController } from '../controllers/territory.controller';

// Authentication Services
// import { AuthService } from '../services/auth/auth.service'; // TODO: Create this service
import { JwtService } from '../services/auth/jwt.service';
import { PasswordService } from '../services/auth/password.service';
// import { SessionService } from '../services/auth/session.service'; // TODO: Create this service

// Business Services
// import { UserService } from '../services/business/user.service'; // TODO: Create this service
// import { PackService } from '../services/business/pack.service'; // TODO: Create this service
// import { TerritoryService } from '../services/business/territory.service'; // TODO: Create this service
// import { MoonPhaseService } from '../services/business/moon-phase.service'; // TODO: Create this service
// import { GameService } from '../services/business/game.service'; // TODO: Create this service

// Repository Layer
// import { UserRepository } from '../repositories/user.repository'; // TODO: Create this repository
// import { PackRepository } from '../repositories/pack.repository'; // TODO: Create this repository
// import { TerritoryRepository } from '../repositories/territory.repository'; // TODO: Create this repository
// import { MoonPhaseRepository } from '../repositories/moon-phase.repository'; // TODO: Create this repository
// import { RefreshTokenRepository } from '../repositories/refresh-token.repository'; // TODO: Create this repository

// Middleware
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ValidationMiddleware } from '../middleware/validation.middleware';

// Interfaces
import { ILogger } from '../interfaces/core/logger.interface';
import { IDatabase } from '../interfaces/core/database.interface';
import { IRedis } from '../interfaces/core/redis.interface';
// import { IAuthService } from '../interfaces/auth/auth-service.interface'; // TODO: Create this interface
import { IJwtService } from '../interfaces/auth/jwt-service.interface';
import { IPasswordService } from '../interfaces/auth/password-service.interface';
// import { ISessionService } from '../interfaces/auth/session-service.interface'; // TODO: Create this interface
// import { IUserService } from '../interfaces/business/user-service.interface'; // TODO: Create this interface
// import { IPackService } from '../interfaces/business/pack-service.interface'; // TODO: Create this interface
// import { ITerritoryService } from '../interfaces/business/territory-service.interface'; // TODO: Create this interface
// import { IMoonPhaseService } from '../interfaces/business/moon-phase-service.interface'; // TODO: Create this interface
// import { IGameService } from '../interfaces/business/game-service.interface'; // TODO: Create this interface
// import { IUserRepository } from '../interfaces/repositories/user-repository.interface'; // TODO: Create this interface
// import { IPackRepository } from '../interfaces/repositories/pack-repository.interface'; // TODO: Create this interface
// import { ITerritoryRepository } from '../interfaces/repositories/territory-repository.interface'; // TODO: Create this interface
// import { IMoonPhaseRepository } from '../interfaces/repositories/moon-phase-repository.interface'; // TODO: Create this interface
// import { IRefreshTokenRepository } from '../interfaces/repositories/refresh-token-repository.interface'; // TODO: Create this interface
import { IAppConfig } from '../interfaces/config/app-config.interface';

class DIContainer {
  private static instance: Container;

  public static getInstance(): Container {
    if (!DIContainer.instance) {
      DIContainer.instance = DIContainer.createContainer();
    }
    return DIContainer.instance;
  }

  private static createContainer(): Container {
    const container = new Container();

    // Configuration
    container.bind<IAppConfig>(TYPES.AppConfig).to(AppConfig).inSingletonScope();

    // Core Services
    // container.bind<ILogger>(TYPES.Logger).to(Logger).inSingletonScope(); // TODO: Fix Logger binding
    container.bind<IDatabase>(TYPES.Database).to(DatabaseService).inSingletonScope();
    container.bind<IRedis>(TYPES.Redis).to(RedisService).inSingletonScope();

    // Authentication Services
    // container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope(); // TODO: Create AuthService
    container.bind<IJwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();
    container.bind<IPasswordService>(TYPES.PasswordService).to(PasswordService).inSingletonScope();
    // container.bind<ISessionService>(TYPES.SessionService).to(SessionService).inSingletonScope(); // TODO: Create SessionService

    // Repository Layer - TODO: Create repositories
    // container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
    // container.bind<IPackRepository>(TYPES.PackRepository).to(PackRepository).inSingletonScope();
    // container.bind<ITerritoryRepository>(TYPES.TerritoryRepository).to(TerritoryRepository).inSingletonScope();
    // container.bind<IMoonPhaseRepository>(TYPES.MoonPhaseRepository).to(MoonPhaseRepository).inSingletonScope();
    // container.bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository).to(RefreshTokenRepository).inSingletonScope();

    // Business Services - TODO: Create business services
    // container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
    // container.bind<IPackService>(TYPES.PackService).to(PackService).inSingletonScope();
    // container.bind<ITerritoryService>(TYPES.TerritoryService).to(TerritoryService).inSingletonScope();
    // container.bind<IMoonPhaseService>(TYPES.MoonPhaseService).to(MoonPhaseService).inSingletonScope();
    // container.bind<IGameService>(TYPES.GameService).to(GameService).inSingletonScope();

    // Middleware
    container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware).inSingletonScope();
    container.bind<ValidationMiddleware>(TYPES.ValidationMiddleware).to(ValidationMiddleware).inSingletonScope();
    // container.bind<EnhancedErrorMiddleware>(TYPES.EnhancedErrorMiddleware).to(EnhancedErrorMiddleware).inSingletonScope(); // TODO: Fix EnhancedErrorMiddleware

    // Controllers
    container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();
    container.bind<MoonPhaseController>(TYPES.MoonPhaseController).to(MoonPhaseController).inSingletonScope();
    container.bind<PackController>(TYPES.PackController).to(PackController).inSingletonScope();
    container.bind<TerritoryController>(TYPES.TerritoryController).to(TerritoryController).inSingletonScope();

    return container;
  }

  public static reset(): void {
    DIContainer.instance = DIContainer.createContainer();
  }
}

export const container = DIContainer.getInstance();
export { DIContainer };