import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types';

// In-memory rate limit storage (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  windowMs: number; // time window in milliseconds
  max: number; // maximum number of requests per window
  message?: string;
  keyGenerator?: (req: Request) => string;
}

/**
 * Rate limiting middleware factory
 */
export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    message = 'Too many requests, please try again later.',
    keyGenerator = (req: Request) => {
      // Use user ID if authenticated, otherwise fall back to IP
      const authReq = req as AuthenticatedRequest;
      return authReq.user?.userId || req.ip || 'anonymous';
    },
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    // Note: Rate limiting is now always enabled, including in test environment
    // This allows proper testing of rate limiting functionality

    const key = keyGenerator(req);
    const now = Date.now();

    // Clean up expired entries
    for (const [storeKey, data] of rateLimitStore.entries()) {
      if (now > data.resetTime) {
        rateLimitStore.delete(storeKey);
      }
    }

    // Get current data for this key
    let rateLimitData = rateLimitStore.get(key);

    // Check if we need to reset or initialize
    if (!rateLimitData || now > rateLimitData.resetTime) {
      // Initialize or reset the rate limit data
      rateLimitData = {
        count: 1, // Start with 1 to count this request
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, rateLimitData);
    } else {
      // Increment the request count atomically
      rateLimitData.count += 1;
      // Update the store to ensure consistency
      rateLimitStore.set(key, rateLimitData);
    }

    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': max.toString(),
      'X-RateLimit-Remaining': Math.max(0, max - rateLimitData.count).toString(),
      'X-RateLimit-Reset': new Date(rateLimitData.resetTime).toISOString(),
    });

    // Check if limit exceeded
    if (rateLimitData.count > max) {
      res.status(429).json({
        success: false,
        error: message,
        retryAfter: Math.ceil((rateLimitData.resetTime - now) / 1000),
      });
      return;
    }

    next();
  };
}

/**
 * Rate limiter for game creation - 5 games per 10 minutes
 */
export const gameCreationRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each user to 5 game creations per windowMs
  message: 'Too many games created. Please wait before creating another game.',
});

/**
 * Rate limiter for game joining - 20 joins per minute
 */
export const gameJoinRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each user to 20 game joins per minute
  message: 'Too many join attempts. Please wait before trying again.',
});

/**
 * Rate limiter for night actions - 1 action per 30 seconds
 */
export const nightActionRateLimit = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 1, // limit each user to 1 night action per 30 seconds
  message: 'You can only perform one night action every 30 seconds.',
});
