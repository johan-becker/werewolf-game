/**
 * Request Validation Middleware using Zod
 * Validates incoming requests against predefined schemas
 */

import { Request, Response, NextFunction } from 'express';
import { injectable } from 'inversify';
import { z, ZodError } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

@injectable()
export class ValidationMiddleware {
  /**
   * Create validation middleware for a given schema
   */
  validate<T extends z.ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // Validate the request against the schema
        const validatedData = schema.parse({
          body: req.body,
          query: req.query,
          params: req.params,
          headers: req.headers
        });

        // Replace request data with validated data
        req.body = validatedData.body || req.body;
        req.query = validatedData.query || req.query;
        req.params = validatedData.params || req.params;

        return next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationErrors: ValidationError[] = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            value: err.input
          }));

          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: validationErrors,
            timestamp: new Date().toISOString()
          });
        }

        // Handle unexpected validation errors
        console.error('Unexpected validation error:', error);
        return res.status(500).json({
          success: false,
          error: 'Internal validation error',
          timestamp: new Date().toISOString()
        });
      }
    };
  }

  /**
   * Validate body only
   */
  validateBody<T extends z.ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const validatedBody = schema.parse(req.body);
        req.body = validatedBody;
        return next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationErrors: ValidationError[] = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            value: err.input
          }));

          return res.status(400).json({
            success: false,
            error: 'Request body validation failed',
            details: validationErrors,
            timestamp: new Date().toISOString()
          });
        }

        console.error('Unexpected body validation error:', error);
        return res.status(500).json({
          success: false,
          error: 'Internal validation error',
          timestamp: new Date().toISOString()
        });
      }
    };
  }

  /**
   * Validate query parameters only
   */
  validateQuery<T extends z.ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const validatedQuery = schema.parse(req.query);
        req.query = validatedQuery;
        return next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationErrors: ValidationError[] = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            value: err.input
          }));

          return res.status(400).json({
            success: false,
            error: 'Query parameter validation failed',
            details: validationErrors,
            timestamp: new Date().toISOString()
          });
        }

        console.error('Unexpected query validation error:', error);
        return res.status(500).json({
          success: false,
          error: 'Internal validation error',
          timestamp: new Date().toISOString()
        });
      }
    };
  }

  /**
   * Validate path parameters only
   */
  validateParams<T extends z.ZodTypeAny>(schema: T) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const validatedParams = schema.parse(req.params);
        req.params = validatedParams;
        return next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationErrors: ValidationError[] = error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            value: err.input
          }));

          return res.status(400).json({
            success: false,
            error: 'Path parameter validation failed',
            details: validationErrors,
            timestamp: new Date().toISOString()
          });
        }

        console.error('Unexpected params validation error:', error);
        return res.status(500).json({
          success: false,
          error: 'Internal validation error',
          timestamp: new Date().toISOString()
        });
      }
    };
  }

  /**
   * Sanitize input data
   */
  sanitize() {
    return (req: Request, res: Response, next: NextFunction) => {
      // Sanitize body
      if (req.body && typeof req.body === 'object') {
        req.body = this.sanitizeObject(req.body);
      }

      // Sanitize query
      if (req.query && typeof req.query === 'object') {
        req.query = this.sanitizeObject(req.query);
      }

      return next();
    };
  }

  /**
   * Recursively sanitize object properties
   */
  private sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = this.sanitizeObject(value);
      }
      return sanitized;
    }

    return obj;
  }

  /**
   * Sanitize string input
   */
  private sanitizeString(str: string): string {
    // Remove potential XSS characters
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>/g, '')
      .trim();
  }

  /**
   * Rate limiting validation
   */
  validateRateLimit(maxRequests: number, windowMs: number) {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return (req: Request, res: Response, next: NextFunction) => {
      const clientId = req.ip || 'unknown';
      const now = Date.now();
      const windowStart = now - windowMs;

      // Clean up old entries
      for (const [id, data] of requests.entries()) {
        if (data.resetTime < windowStart) {
          requests.delete(id);
        }
      }

      // Get or create client data
      let clientData = requests.get(clientId);
      if (!clientData || clientData.resetTime < windowStart) {
        clientData = { count: 0, resetTime: now + windowMs };
        requests.set(clientId, clientData);
      }

      // Check rate limit
      if (clientData.count >= maxRequests) {
        return res.status(429).json({
          success: false,
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
          timestamp: new Date().toISOString()
        });
      }

      // Increment counter
      clientData.count++;

      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': (maxRequests - clientData.count).toString(),
        'X-RateLimit-Reset': new Date(clientData.resetTime).toISOString()
      });

      return next();
    };
  }
}