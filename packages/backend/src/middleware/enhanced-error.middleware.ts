/**
 * Enhanced Error Handling Middleware
 * Comprehensive error handling with logging and user-friendly responses
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { ZodError } from 'zod';
import { ILogger } from '../interfaces/core/logger.interface';
import { TYPES } from '../container/types';

export interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  timestamp: string;
  requestId?: string;
  details?: Record<string, unknown> | unknown[];
  stack?: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown> | unknown[] | undefined;

  constructor(
    message: string,
    statusCode: number = 500,
    code: string = 'INTERNAL_ERROR',
    isOperational: boolean = true,
    details?: Record<string, unknown> | unknown[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

@injectable()
export class EnhancedErrorMiddleware {
  constructor(@inject(TYPES.Logger) private readonly logger: ILogger) {}

  /**
   * Global error handler
   */
  handleError() {
    return (error: Error, req: Request, res: Response, _next: NextFunction) => {
      const requestId = (req.headers['x-request-id'] as string) || this.generateRequestId();

      // Log the error
      this.logError(error, req, requestId);

      // Handle different error types
      if (error instanceof AppError) {
        return this.handleAppError(error, res, requestId);
      }

      if (error instanceof ZodError) {
        return this.handleValidationError(error, res, requestId);
      }

      if (error.name === 'JsonWebTokenError') {
        return this.handleJWTError(error, res, requestId);
      }

      if (error.name === 'TokenExpiredError') {
        return this.handleTokenExpiredError(error, res, requestId);
      }

      if (error.name === 'MulterError') {
        return this.handleFileUploadError(error, res, requestId);
      }

      // Handle database errors
      if (this.isDatabaseError(error)) {
        return this.handleDatabaseError(error, res, requestId);
      }

      // Handle network/timeout errors
      if (this.isNetworkError(error)) {
        return this.handleNetworkError(error, res, requestId);
      }

      // Default to internal server error
      this.handleInternalError(error, res, requestId);
    };
  }

  /**
   * Handle 404 not found
   */
  handleNotFound() {
    return (req: Request, res: Response, next: NextFunction) => {
      const error = new AppError(
        `Route ${req.method} ${req.originalUrl} not found`,
        404,
        'ROUTE_NOT_FOUND'
      );
      next(error);
    };
  }

  /**
   * Async error wrapper
   */
  asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Handle application errors
   */
  private handleAppError(error: AppError, res: Response, requestId: string): void {
    const response: ErrorResponse = {
      success: false,
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
      requestId,
    };

    if (error.details) {
      response.details = error.details;
    }

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development' && error.stack) {
      response.stack = error.stack;
    }

    res.status(error.statusCode).json(response);
  }

  /**
   * Handle validation errors
   */
  private handleValidationError(error: ZodError, res: Response, requestId: string): void {
    const validationErrors = error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      value: (err as { received?: unknown }).received || 'invalid',
    }));

    const response: ErrorResponse = {
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString(),
      requestId,
      details: validationErrors,
    };

    res.status(400).json(response);
  }

  /**
   * Handle JWT errors
   */
  private handleJWTError(error: Error, res: Response, requestId: string): void {
    const response: ErrorResponse = {
      success: false,
      error: 'Invalid authentication token',
      code: 'INVALID_TOKEN',
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(401).json(response);
  }

  /**
   * Handle token expired errors
   */
  private handleTokenExpiredError(error: Error, res: Response, requestId: string): void {
    const response: ErrorResponse = {
      success: false,
      error: 'Authentication token expired',
      code: 'TOKEN_EXPIRED',
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(401).json(response);
  }

  /**
   * Handle file upload errors
   */
  private handleFileUploadError(error: unknown, res: Response, requestId: string): void {
    let message = 'File upload error';
    let code = 'FILE_UPLOAD_ERROR';

    const errorCode = (error as { code?: string }).code;
    switch (errorCode) {
      case 'LIMIT_FILE_SIZE':
        message = 'File too large';
        code = 'FILE_TOO_LARGE';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files';
        code = 'TOO_MANY_FILES';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field';
        code = 'UNEXPECTED_FILE';
        break;
    }

    const response: ErrorResponse = {
      success: false,
      error: message,
      code,
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(400).json(response);
  }

  /**
   * Handle database errors
   */
  private handleDatabaseError(error: unknown, res: Response, requestId: string): void {
    let message = 'Database error';
    let code = 'DATABASE_ERROR';
    let statusCode = 500;

    // Handle common database errors
    const errorCode = (error as { code?: string }).code;
    const errorMessage = (error as { message?: string }).message || '';
    if (errorCode === '23505' || errorMessage.includes('unique constraint')) {
      message = 'Resource already exists';
      code = 'DUPLICATE_RESOURCE';
      statusCode = 409;
    } else if (errorCode === '23503' || errorMessage.includes('foreign key')) {
      message = 'Referenced resource not found';
      code = 'FOREIGN_KEY_ERROR';
      statusCode = 400;
    } else if (errorCode === '23502' || errorMessage.includes('null value')) {
      message = 'Required field is missing';
      code = 'NULL_CONSTRAINT_ERROR';
      statusCode = 400;
    }

    const response: ErrorResponse = {
      success: false,
      error: message,
      code,
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(statusCode).json(response);
  }

  /**
   * Handle network errors
   */
  private handleNetworkError(error: unknown, res: Response, requestId: string): void {
    const response: ErrorResponse = {
      success: false,
      error: 'Service temporarily unavailable',
      code: 'NETWORK_ERROR',
      timestamp: new Date().toISOString(),
      requestId,
    };

    res.status(503).json(response);
  }

  /**
   * Handle internal server errors
   */
  private handleInternalError(error: Error, res: Response, requestId: string): void {
    const response: ErrorResponse = {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      requestId,
    };

    // Include error details in development
    if (process.env.NODE_ENV === 'development') {
      response.details = {
        message: error.message,
        stack: error.stack,
      };
    }

    res.status(500).json(response);
  }

  /**
   * Log error with context
   */
  private logError(error: Error, req: Request, requestId: string): void {
    const errorInfo = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.userId,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    };

    if (error instanceof AppError && !error.isOperational) {
      this.logger.error('Non-operational error occurred', errorInfo);
    } else if (error instanceof AppError && error.statusCode >= 500) {
      this.logger.error('Server error occurred', errorInfo);
    } else if (error instanceof AppError) {
      this.logger.warn('Client error occurred', errorInfo);
    } else {
      this.logger.error('Unexpected error occurred', errorInfo);
    }
  }

  /**
   * Check if error is database-related
   */
  private isDatabaseError(error: unknown): boolean {
    const errorCode = (error as { code?: string }).code;
    return Boolean(
      errorCode &&
      (errorCode.startsWith('23') || // Integrity constraint violation
        errorCode.startsWith('42') || // Syntax error or access rule violation
        (error as { name?: string }).name === 'SequelizeError' ||
        (error as { name?: string }).name === 'PrismaClientKnownRequestError' ||
        (error as { name?: string }).name === 'QueryFailedError')
    );
  }

  /**
   * Check if error is network-related
   */
  private isNetworkError(error: unknown): boolean {
    const errorCode = (error as { code?: string }).code;
    return (
      errorCode === 'ECONNREFUSED' ||
      errorCode === 'ECONNRESET' ||
      errorCode === 'ETIMEDOUT' ||
      errorCode === 'ENOTFOUND' ||
      (error as { name?: string }).name === 'TimeoutError'
    );
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

// AppError class is already exported above
