/**
 * Controller-level error interceptors and response handlers
 * Transforms domain exceptions into standardized HTTP response objects
 */

import { Request, Response, NextFunction } from 'express';
import { 
  GameControllerResponse, 
  GameControllerError, 
  GameErrorCode, 
  ERROR_STATUS_CODES,
  ResponseMetadata,
  Result,
  SuccessResponse,
  ErrorResponse,
  GameErrorFactory
} from '../types/controller.types';
import { AuthenticatedRequest } from '../types/auth.types';

// Enhanced request interface with performance tracking
export interface TrackedRequest extends Request {
  startTime?: number;
  requestId?: string;
}

// Controller response handler utilities
export class ControllerResponseHandler {
  /**
   * Sends a standardized success response
   */
  static sendSuccess<TData>(
    res: Response,
    data: TData,
    statusCode: number = 200,
    metadata?: Partial<ResponseMetadata>
  ): void {
    const response: SuccessResponse<TData> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
      ...(metadata && { metadata: metadata as ResponseMetadata })
    };

    res.status(statusCode).json(response);
  }

  /**
   * Sends a standardized error response
   */
  static sendError(
    res: Response,
    error: GameControllerError,
    metadata?: Partial<ResponseMetadata>
  ): void {
    const statusCode = ERROR_STATUS_CODES[error.code] || 500;
    
    const response: ErrorResponse = {
      success: false,
      error,
      timestamp: new Date().toISOString(),
      ...(metadata && { metadata: metadata as ResponseMetadata })
    };

    res.status(statusCode).json(response);
  }

  /**
   * Handles Result pattern responses automatically
   */
  static handleResult<TData>(
    res: Response,
    result: Result<TData, GameControllerError>,
    successStatusCode: number = 200,
    metadata?: Partial<ResponseMetadata>
  ): void {
    if (result.success) {
      this.sendSuccess(res, result.data, successStatusCode, metadata);
    } else {
      this.sendError(res, result.error, metadata);
    }
  }

  /**
   * Creates response metadata from request context
   */
  static createMetadata(req: TrackedRequest): ResponseMetadata {
    const executionTime = req.startTime ? Date.now() - req.startTime : undefined;
    
    return {
      requestId: req.requestId,
      executionTime,
      cacheStatus: 'bypass' // Can be overridden by specific controllers
    };
  }
}

// Request tracking middleware
export function requestTrackingMiddleware(
  req: TrackedRequest,
  res: Response,
  next: NextFunction
): void {
  req.startTime = Date.now();
  req.requestId = generateRequestId();
  
  // Add request ID to response headers for debugging
  res.setHeader('X-Request-ID', req.requestId);
  
  next();
}

// Global error interceptor for unhandled domain exceptions
export function controllerErrorInterceptor(
  error: Error,
  req: TrackedRequest,
  res: Response,
  next: NextFunction
): void {
  console.error('Controller Error:', {
    requestId: req.requestId,
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    userId: (req as any).user?.id,
    timestamp: new Date().toISOString()
  });

  // Transform known domain exceptions
  const gameError = transformDomainException(error, req);
  const metadata = ControllerResponseHandler.createMetadata(req);
  
  ControllerResponseHandler.sendError(res, gameError, metadata);
}

// Transform domain exceptions to standardized game errors
function transformDomainException(error: Error, req: TrackedRequest): GameControllerError {
  const errorMessage = error.message.toLowerCase();
  
  // Database/Supabase errors
  if (errorMessage.includes('connection') || errorMessage.includes('timeout')) {
    return GameErrorFactory.createServerError(
      error.message,
      'Database connection error. Please try again.'
    );
  }
  
  if (errorMessage.includes('duplicate') || errorMessage.includes('unique constraint')) {
    if (errorMessage.includes('game')) {
      return {
        code: GameErrorCode.GAME_ALREADY_EXISTS,
        message: 'A game with this identifier already exists',
        details: { originalError: error.message },
        suggestion: 'Please try with a different game name or code',
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      code: GameErrorCode.INVALID_REQUEST_FORMAT,
      message: 'Duplicate entry detected',
      details: { originalError: error.message },
      timestamp: new Date().toISOString()
    };
  }
  
  // Permission/Auth errors
  if (errorMessage.includes('permission') || errorMessage.includes('unauthorized')) {
    return GameErrorFactory.createPermissionError('access to this resource');
  }
  
  if (errorMessage.includes('not found')) {
    if (errorMessage.includes('game')) {
      return GameErrorFactory.createGameNotFoundError('unknown', 'id');
    }
    
    return {
      code: GameErrorCode.PLAYER_NOT_FOUND,
      message: 'Requested resource not found',
      details: { originalError: error.message },
      timestamp: new Date().toISOString()
    };
  }
  
  // Validation errors
  if (errorMessage.includes('invalid') || errorMessage.includes('validation')) {
    return {
      code: GameErrorCode.INVALID_REQUEST_FORMAT,
      message: 'Request validation failed',
      details: { originalError: error.message },
      suggestion: 'Please check your request format and try again',
      timestamp: new Date().toISOString()
    };
  }
  
  // Rate limiting
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many')) {
    return GameErrorFactory.createRateLimitError(60, 'API');
  }
  
  // Default server error for unknown exceptions
  return GameErrorFactory.createServerError(
    error.message,
    'An unexpected error occurred'
  );
}

// Validation middleware for common request patterns
export function validateGameId(paramName: string = 'id') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const gameId = req.params[paramName];
    
    if (!gameId) {
      const error = GameErrorFactory.createValidationError(
        paramName,
        gameId,
        'required',
        `Game ${paramName} is required`
      );
      return ControllerResponseHandler.sendError(res, error);
    }
    
    if (typeof gameId !== 'string' || gameId.trim().length === 0) {
      const error = GameErrorFactory.createValidationError(
        paramName,
        gameId,
        'non-empty string',
        `Game ${paramName} must be a non-empty string`
      );
      return ControllerResponseHandler.sendError(res, error);
    }
    
    next();
  };
}

export function validateGameCode(paramName: string = 'code') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const gameCode = req.params[paramName];
    
    if (!gameCode) {
      const error = GameErrorFactory.createValidationError(
        paramName,
        gameCode,
        'required',
        `Game ${paramName} is required`
      );
      return ControllerResponseHandler.sendError(res, error);
    }
    
    // Game codes should be 6 alphanumeric characters
    if (!/^[A-Z0-9]{6}$/.test(gameCode)) {
      const error = GameErrorFactory.createValidationError(
        paramName,
        gameCode,
        '6 uppercase alphanumeric characters',
        'Game code must be 6 uppercase letters and numbers'
      );
      return ControllerResponseHandler.sendError(res, error);
    }
    
    next();
  };
}

export function validatePagination(req: Request, res: Response, next: NextFunction): void {
  const { limit, offset } = req.query;
  
  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      const error = GameErrorFactory.createValidationError(
        'limit',
        limit,
        'number between 1 and 100',
        'Limit must be a number between 1 and 100'
      );
      return ControllerResponseHandler.sendError(res, error);
    }
  }
  
  if (offset !== undefined) {
    const offsetNum = Number(offset);
    if (isNaN(offsetNum) || offsetNum < 0) {
      const error = GameErrorFactory.createValidationError(
        'offset',
        offset,
        'non-negative number',
        'Offset must be a non-negative number'
      );
      return ControllerResponseHandler.sendError(res, error);
    }
  }
  
  next();
}

// Async controller wrapper that handles promise rejections
export function asyncController<TSuccess>(
  controllerFn: (req: AuthenticatedRequest, res: Response) => Promise<Result<TSuccess, GameControllerError>>
) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await controllerFn(req, res);
      const metadata = ControllerResponseHandler.createMetadata(req as TrackedRequest);
      ControllerResponseHandler.handleResult(res, result, 200, metadata);
    } catch (error) {
      next(error);
    }
  };
}

// Async controller wrapper with custom success status code
export function asyncControllerWithStatus<TSuccess>(
  controllerFn: (req: AuthenticatedRequest, res: Response) => Promise<Result<TSuccess, GameControllerError>>,
  successStatusCode: number
) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await controllerFn(req, res);
      const metadata = ControllerResponseHandler.createMetadata(req as TrackedRequest);
      ControllerResponseHandler.handleResult(res, result, successStatusCode, metadata);
    } catch (error) {
      next(error);
    }
  };
}

// Request ID generation
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

// Response time tracking middleware
export function responseTimeMiddleware(req: TrackedRequest, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    res.setHeader('X-Response-Time', `${responseTime}ms`);
  });
  
  next();
}