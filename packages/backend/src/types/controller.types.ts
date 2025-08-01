/**
 * Comprehensive controller response types with explicit error boundary patterns
 * Implements Result pattern for predictable client behavior and debugging
 */

import { Response } from 'express';

// Result pattern for explicit success/error state discrimination
export type Result<TSuccess, TError> = 
  | { success: true; data: TSuccess; error?: never }
  | { success: false; data?: never; error: TError };

// Base controller response interface with typed discriminators
export interface GameControllerResponse<TData = any> {
  success: boolean;
  data?: TData;
  error?: GameControllerError;
  metadata?: ResponseMetadata;
  timestamp: string;
}

// Success response with guaranteed data presence
export interface SuccessResponse<TData> extends GameControllerResponse<TData> {
  success: true;
  data: TData;
  error?: never;
}

// Error response with guaranteed error presence
export interface ErrorResponse extends GameControllerResponse<never> {
  success: false;
  data?: never;
  error: GameControllerError;
}

// Response metadata for debugging and client optimization
export interface ResponseMetadata {
  requestId?: string;
  executionTime?: number;
  cacheStatus?: 'hit' | 'miss' | 'bypass';
  rateLimitRemaining?: number;
  deprecationWarning?: string;
}

// Comprehensive game controller error types
export interface GameControllerError {
  code: GameErrorCode;
  message: string;
  details?: Record<string, any>;
  field?: string;
  retryAfter?: number;
  suggestion?: string;
  timestamp: string;
}

// Exhaustive error codes for all game actions
export enum GameErrorCode {
  // Authentication & Authorization
  AUTHENTICATION_REQUIRED = 'AUTHENTICATION_REQUIRED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  INVALID_TOKEN = 'INVALID_TOKEN',
  SESSION_EXPIRED = 'SESSION_EXPIRED',

  // Validation Errors
  INVALID_REQUEST_FORMAT = 'INVALID_REQUEST_FORMAT',
  MISSING_REQUIRED_FIELDS = 'MISSING_REQUIRED_FIELDS',
  INVALID_FIELD_VALUE = 'INVALID_FIELD_VALUE',
  FIELD_TOO_LONG = 'FIELD_TOO_LONG',
  FIELD_TOO_SHORT = 'FIELD_TOO_SHORT',

  // Game Management
  GAME_NOT_FOUND = 'GAME_NOT_FOUND',
  GAME_ALREADY_EXISTS = 'GAME_ALREADY_EXISTS',
  GAME_FULL = 'GAME_FULL',
  GAME_ALREADY_STARTED = 'GAME_ALREADY_STARTED',
  GAME_NOT_STARTED = 'GAME_NOT_STARTED',
  GAME_ENDED = 'GAME_ENDED',
  INVALID_GAME_STATE = 'INVALID_GAME_STATE',
  INVALID_GAME_CODE = 'INVALID_GAME_CODE',

  // Player Management
  PLAYER_NOT_FOUND = 'PLAYER_NOT_FOUND',
  PLAYER_ALREADY_IN_GAME = 'PLAYER_ALREADY_IN_GAME',
  PLAYER_NOT_IN_GAME = 'PLAYER_NOT_IN_GAME',
  PLAYER_NOT_HOST = 'PLAYER_NOT_HOST',
  INSUFFICIENT_PLAYERS = 'INSUFFICIENT_PLAYERS',
  TOO_MANY_PLAYERS = 'TOO_MANY_PLAYERS',

  // Game Actions
  ACTION_NOT_ALLOWED = 'ACTION_NOT_ALLOWED',
  INVALID_TARGET = 'INVALID_TARGET',
  ACTION_ALREADY_PERFORMED = 'ACTION_ALREADY_PERFORMED',
  WRONG_GAME_PHASE = 'WRONG_GAME_PHASE',
  VOTING_NOT_ACTIVE = 'VOTING_NOT_ACTIVE',
  ALREADY_VOTED = 'ALREADY_VOTED',

  // Role & Permission
  INVALID_ROLE = 'INVALID_ROLE',
  ROLE_NOT_ACTIVE = 'ROLE_NOT_ACTIVE',
  ABILITY_ON_COOLDOWN = 'ABILITY_ON_COOLDOWN',
  ABILITY_EXHAUSTED = 'ABILITY_EXHAUSTED',

  // Rate Limiting & System
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVER_ERROR = 'SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  MAINTENANCE_MODE = 'MAINTENANCE_MODE',

  // Configuration
  INVALID_GAME_CONFIG = 'INVALID_GAME_CONFIG',
  UNSUPPORTED_FEATURE = 'UNSUPPORTED_FEATURE'
}

// HTTP status code mappings for each error type
export const ERROR_STATUS_CODES: Record<GameErrorCode, number> = {
  // 401 Unauthorized
  [GameErrorCode.AUTHENTICATION_REQUIRED]: 401,
  [GameErrorCode.INVALID_TOKEN]: 401,
  [GameErrorCode.SESSION_EXPIRED]: 401,

  // 403 Forbidden
  [GameErrorCode.INSUFFICIENT_PERMISSIONS]: 403,
  [GameErrorCode.PLAYER_NOT_HOST]: 403,
  [GameErrorCode.ACTION_NOT_ALLOWED]: 403,

  // 400 Bad Request
  [GameErrorCode.INVALID_REQUEST_FORMAT]: 400,
  [GameErrorCode.MISSING_REQUIRED_FIELDS]: 400,
  [GameErrorCode.INVALID_FIELD_VALUE]: 400,
  [GameErrorCode.FIELD_TOO_LONG]: 400,
  [GameErrorCode.FIELD_TOO_SHORT]: 400,
  [GameErrorCode.INVALID_GAME_CODE]: 400,
  [GameErrorCode.INVALID_TARGET]: 400,
  [GameErrorCode.INVALID_ROLE]: 400,
  [GameErrorCode.INVALID_GAME_CONFIG]: 400,

  // 404 Not Found
  [GameErrorCode.GAME_NOT_FOUND]: 404,
  [GameErrorCode.PLAYER_NOT_FOUND]: 404,

  // 409 Conflict
  [GameErrorCode.GAME_ALREADY_EXISTS]: 409,
  [GameErrorCode.PLAYER_ALREADY_IN_GAME]: 409,
  [GameErrorCode.GAME_ALREADY_STARTED]: 409,
  [GameErrorCode.ACTION_ALREADY_PERFORMED]: 409,
  [GameErrorCode.ALREADY_VOTED]: 409,

  // 422 Unprocessable Entity
  [GameErrorCode.GAME_FULL]: 422,
  [GameErrorCode.GAME_NOT_STARTED]: 422,
  [GameErrorCode.GAME_ENDED]: 422,
  [GameErrorCode.INVALID_GAME_STATE]: 422,
  [GameErrorCode.PLAYER_NOT_IN_GAME]: 422,
  [GameErrorCode.INSUFFICIENT_PLAYERS]: 422,
  [GameErrorCode.TOO_MANY_PLAYERS]: 422,
  [GameErrorCode.WRONG_GAME_PHASE]: 422,
  [GameErrorCode.VOTING_NOT_ACTIVE]: 422,
  [GameErrorCode.ROLE_NOT_ACTIVE]: 422,
  [GameErrorCode.ABILITY_ON_COOLDOWN]: 422,
  [GameErrorCode.ABILITY_EXHAUSTED]: 422,

  // 429 Too Many Requests
  [GameErrorCode.RATE_LIMIT_EXCEEDED]: 429,

  // 500 Internal Server Error
  [GameErrorCode.SERVER_ERROR]: 500,
  [GameErrorCode.DATABASE_ERROR]: 500,
  [GameErrorCode.EXTERNAL_SERVICE_ERROR]: 500,

  // 501 Not Implemented
  [GameErrorCode.UNSUPPORTED_FEATURE]: 501,

  // 503 Service Unavailable
  [GameErrorCode.MAINTENANCE_MODE]: 503
};

// Domain-specific error context for enhanced debugging
export interface GameErrorContext {
  gameId?: string;
  playerId?: string;
  action?: string;
  phase?: string;
  roleType?: string;
  targetId?: string;
  requestBody?: any;
  validationErrors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  value: any;
  constraint: string;
  message: string;
}

// Result types for specific game operations
export type GameCreationResult = Result<GameCreationSuccess, GameControllerError>;
export type GameJoinResult = Result<GameJoinSuccess, GameControllerError>;
export type GameLeaveResult = Result<GameLeaveSuccess, GameControllerError>;
export type GameStartResult = Result<GameStartSuccess, GameControllerError>;
export type GameListResult = Result<GameListSuccess, GameControllerError>;
export type GameDetailsResult = Result<GameDetailsSuccess, GameControllerError>;

// Success payload types
export interface GameCreationSuccess {
  game: {
    id: string;
    code: string;
    name?: string;
    status: string;
    maxPlayers: number;
    isPrivate: boolean;
    createdAt: string;
    hostId: string;
  };
  playerCount: number;
}

export interface GameJoinSuccess {
  game: {
    id: string;
    code: string;
    name?: string;
    status: string;
    playerCount: number;
    maxPlayers: number;
  };
  player: {
    id: string;
    username: string;
    joinedAt: string;
    isHost: boolean;
  };
  otherPlayers: Array<{
    id: string;
    username: string;
    isHost: boolean;
  }>;
}

export interface GameLeaveSuccess {
  message: string;
  gameStatus: 'active' | 'disbanded' | 'host_transferred';
  newHostId?: string;
}

export interface GameStartSuccess {
  message: string;
  gamePhase: string;
  playerCount: number;
  estimatedDuration: number;
}

export interface GameListSuccess {
  games: Array<{
    id: string;
    code: string;
    name?: string;
    status: string;
    playerCount: number;
    maxPlayers: number;
    isPrivate: boolean;
    createdAt: string;
    hostName: string;
  }>;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface GameDetailsSuccess {
  id: string;
  code: string;
  name?: string;
  status: string;
  phase?: string;
  playerCount: number;
  maxPlayers: number;
  isPrivate: boolean;
  createdAt: string;
  startedAt?: string;
  host: {
    id: string;
    username: string;
  };
  players: Array<{
    id: string;
    username: string;
    status: string;
    joinedAt: string;
    isHost: boolean;
  }>;
  settings?: {
    timeLimit?: number;
    enableChat: boolean;
    allowSpectators: boolean;
  };
}

// Controller method signature with explicit Result return
export type ControllerMethod<TSuccess, TRequest = any> = (
  req: TRequest,
  res: Response
) => Promise<Result<TSuccess, GameControllerError>>;

// Error factory functions for consistent error creation
export class GameErrorFactory {
  static createAuthenticationError(
    message: string = 'Authentication required',
    details?: Record<string, any>
  ): GameControllerError {
    const error: GameControllerError = {
      code: GameErrorCode.AUTHENTICATION_REQUIRED,
      message,
      suggestion: 'Please log in and try again',
      timestamp: new Date().toISOString()
    };
    
    if (details) {
      error.details = details;
    }
    
    return error;
  }

  static createValidationError(
    field: string,
    value: any,
    constraint: string,
    customMessage?: string
  ): GameControllerError {
    return {
      code: GameErrorCode.INVALID_FIELD_VALUE,
      message: customMessage || `Invalid value for field '${field}': ${constraint}`,
      field,
      details: { value, constraint },
      suggestion: `Please provide a valid ${field}`,
      timestamp: new Date().toISOString()
    };
  }

  static createGameNotFoundError(
    gameId: string,
    searchType: 'id' | 'code' = 'id'
  ): GameControllerError {
    return {
      code: GameErrorCode.GAME_NOT_FOUND,
      message: `Game not found with ${searchType}: ${gameId}`,
      details: { searchType, searchValue: gameId },
      suggestion: 'Please verify the game ID or code and try again',
      timestamp: new Date().toISOString()
    };
  }

  static createGameStateError(
    expectedState: string,
    actualState: string,
    action: string
  ): GameControllerError {
    return {
      code: GameErrorCode.INVALID_GAME_STATE,
      message: `Cannot ${action} - game is in '${actualState}' state, expected '${expectedState}'`,
      details: { expectedState, actualState, action },
      suggestion: `Wait for the game to reach '${expectedState}' state`,
      timestamp: new Date().toISOString()
    };
  }

  static createPermissionError(
    requiredPermission: string,
    context?: string
  ): GameControllerError {
    return {
      code: GameErrorCode.INSUFFICIENT_PERMISSIONS,
      message: `Insufficient permissions: ${requiredPermission}${context ? ` for ${context}` : ''}`,
      details: { requiredPermission, context },
      suggestion: 'Contact the game host or administrator for access',
      timestamp: new Date().toISOString()
    };
  }

  static createRateLimitError(
    retryAfter: number,
    action: string
  ): GameControllerError {
    return {
      code: GameErrorCode.RATE_LIMIT_EXCEEDED,
      message: `Too many ${action} requests. Please try again later.`,
      retryAfter,
      details: { action, retryAfter },
      suggestion: `Wait ${retryAfter} seconds before trying again`,
      timestamp: new Date().toISOString()
    };
  }

  static createServerError(
    internalMessage: string,
    publicMessage: string = 'An internal server error occurred'
  ): GameControllerError {
    return {
      code: GameErrorCode.SERVER_ERROR,
      message: publicMessage,
      details: { internalError: internalMessage },
      suggestion: 'Please try again later or contact support if the problem persists',
      timestamp: new Date().toISOString()
    };
  }
}