import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
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
  next: NextFunction
): void => {
  const { statusCode = 500, message, stack } = err;

  logger.error({
    message: err.message,
    statusCode,
    stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  if (process.env.NODE_ENV === 'production') {
    if (err.isOperational) {
      res.status(statusCode).json({
        success: false,
        error: {
          message,
          statusCode,
        },
      });
    } else {
      res.status(500).json({
        success: false,
        error: {
          message: 'Something went wrong!',
          statusCode: 500,
        },
      });
    }
  } else {
    res.status(statusCode).json({
      success: false,
      error: {
        message,
        statusCode,
        stack,
      },
    });
  }
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = createError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);