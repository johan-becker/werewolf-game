import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { DatabaseError, ValidationError, NotFoundError, ConflictError } from '../types/database';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export const createError = (
  message: string,
  statusCode: number = 500,
  isOperational: boolean = true
): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = isOperational;
  return error;
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorCode = 'INTERNAL_ERROR';

  // Handle custom database errors
  if (err instanceof ValidationError) {
    statusCode = 400;
    message = err.message;
    errorCode = 'VALIDATION_ERROR';
  } else if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
    errorCode = 'NOT_FOUND';
  } else if (err instanceof ConflictError) {
    statusCode = 409;
    message = err.message;
    errorCode = 'CONFLICT';
  } else if (err instanceof DatabaseError) {
    statusCode = 500;
    message = process.env.NODE_ENV === 'production' ? 'Database error occurred' : err.message;
    errorCode = 'DATABASE_ERROR';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    errorCode = 'INVALID_TOKEN';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    errorCode = 'TOKEN_EXPIRED';
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = err.code || 'CUSTOM_ERROR';
  }

  // Log error (don't log validation errors as they're expected)
  if (statusCode >= 500) {
    logger.error('Server Error:', {
      error: err.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    });
  } else if (statusCode === 404) {
    logger.warn('Not Found:', {
      url: req.url,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.info('Client Error:', {
      error: err.message,
      statusCode,
      url: req.url,
      method: req.method,
      ip: req.ip,
    });
  }

  const response: any = {
    success: false,
    error: {
      code: errorCode,
      message,
    },
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = createError(`Route ${req.originalUrl} not found`, 404);
  error.code = 'ROUTE_NOT_FOUND';
  next(error);
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
