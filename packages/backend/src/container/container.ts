/**
 * Dependency Injection Container Configuration
 * Using InversifyJS for IoC container management
 */

import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';

// Core Services
import { Logger } from '../services/core/logger.service';
import { DatabaseService } from '../services/core/database.service';
import { RedisService } from '../services/core/redis.service';
import { AppConfig } from '../config/app.config';

// Authentication Services
import { AuthService } from '../services/auth/auth.service';
import { JwtService } from '../services/auth/jwt.service';
import { PasswordService } from '../services/auth/password.service';
import { SessionService } from '../services/auth/session.service';

// Business Services
import { UserService } from '../services/business/user.service';
import { PackService } from '../services/business/pack.service';
import { TerritoryService } from '../services/business/territory.service';
import { MoonPhaseService } from '../services/business/moon-phase.service';
import { GameService } from '../services/business/game.service';

// Repository Layer
import { UserRepository } from '../repositories/user.repository';
import { PackRepository } from '../repositories/pack.repository';
import { TerritoryRepository } from '../repositories/territory.repository';
import { MoonPhaseRepository } from '../repositories/moon-phase.repository';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';

// Middleware
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ValidationMiddleware } from '../middleware/validation.middleware';

// Interfaces
import { ILogger } from '../interfaces/core/logger.interface';
import { IDatabase } from '../interfaces/core/database.interface';
import { IRedis } from '../interfaces/core/redis.interface';
import { IAuthService } from '../interfaces/auth/auth-service.interface';
import { IJwtService } from '../interfaces/auth/jwt-service.interface';
import { IPasswordService } from '../interfaces/auth/password-service.interface';
import { ISessionService } from '../interfaces/auth/session-service.interface';
import { IUserService } from '../interfaces/business/user-service.interface';
import { IPackService } from '../interfaces/business/pack-service.interface';
import { ITerritoryService } from '../interfaces/business/territory-service.interface';
import { IMoonPhaseService } from '../interfaces/business/moon-phase-service.interface';
import { IGameService } from '../interfaces/business/game-service.interface';
import { IUserRepository } from '../interfaces/repositories/user-repository.interface';
import { IPackRepository } from '../interfaces/repositories/pack-repository.interface';
import { ITerritoryRepository } from '../interfaces/repositories/territory-repository.interface';
import { IMoonPhaseRepository } from '../interfaces/repositories/moon-phase-repository.interface';
import { IRefreshTokenRepository } from '../interfaces/repositories/refresh-token-repository.interface';
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
    container.bind<ILogger>(TYPES.Logger).to(Logger).inSingletonScope();
    container.bind<IDatabase>(TYPES.Database).to(DatabaseService).inSingletonScope();
    container.bind<IRedis>(TYPES.Redis).to(RedisService).inSingletonScope();

    // Authentication Services
    container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();
    container.bind<IJwtService>(TYPES.JwtService).to(JwtService).inSingletonScope();
    container.bind<IPasswordService>(TYPES.PasswordService).to(PasswordService).inSingletonScope();
    container.bind<ISessionService>(TYPES.SessionService).to(SessionService).inSingletonScope();

    // Repository Layer
    container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
    container.bind<IPackRepository>(TYPES.PackRepository).to(PackRepository).inSingletonScope();
    container.bind<ITerritoryRepository>(TYPES.TerritoryRepository).to(TerritoryRepository).inSingletonScope();
    container.bind<IMoonPhaseRepository>(TYPES.MoonPhaseRepository).to(MoonPhaseRepository).inSingletonScope();
    container.bind<IRefreshTokenRepository>(TYPES.RefreshTokenRepository).to(RefreshTokenRepository).inSingletonScope();

    // Business Services
    container.bind<IUserService>(TYPES.UserService).to(UserService).inSingletonScope();
    container.bind<IPackService>(TYPES.PackService).to(PackService).inSingletonScope();
    container.bind<ITerritoryService>(TYPES.TerritoryService).to(TerritoryService).inSingletonScope();
    container.bind<IMoonPhaseService>(TYPES.MoonPhaseService).to(MoonPhaseService).inSingletonScope();
    container.bind<IGameService>(TYPES.GameService).to(GameService).inSingletonScope();

    // Middleware
    container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware).inSingletonScope();
    container.bind<ValidationMiddleware>(TYPES.ValidationMiddleware).to(ValidationMiddleware).inSingletonScope();

    return container;
  }

  public static reset(): void {
    DIContainer.instance = DIContainer.createContainer();
  }
}

export const container = DIContainer.getInstance();
export { DIContainer };