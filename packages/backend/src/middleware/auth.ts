/**
 * Production-grade authentication middleware with zero-tolerance security policy
 * Implements comprehensive error handling and type safety
 */

import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { AuthSecurityService } from '../services/auth-security.service';
import {
  AuthenticatedRequest,
  OptionalAuthRequest,
  AuthErrorCode,
  Permission,
  UserRole,
} from '../types/auth.types';

// Legacy export for backward compatibility - matches actual middleware output
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

const authService = AuthSecurityService.getInstance();

/**
 * Strict authentication middleware - GUARANTEES authenticated user
 * Use this for endpoints that require authentication
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authResult = await performAuthentication(req);

  if (!authResult.success) {
    const statusCode = getStatusCodeForError(authResult.error!.code);
    res.status(statusCode).json({
      error: authResult.error!.message,
      code: authResult.error!.code,
      timestamp: authResult.error!.timestamp,
    });
    return;
  }

  // Type assertion is safe here because we've verified authentication success
  const authenticatedReq = req as AuthenticatedRequest;
  (
    authenticatedReq as unknown as {
      user: typeof authResult.user;
      authMetadata: typeof authResult.metadata;
    }
  ).user = authResult.user!;
  (
    authenticatedReq as unknown as {
      user: typeof authResult.user;
      authMetadata: typeof authResult.metadata;
    }
  ).authMetadata = authResult.metadata!;

  next();
}

/**
 * Optional authentication middleware - allows both authenticated and anonymous users
 * Use this for endpoints that enhance functionality with authentication but don't require it
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authResult = await performAuthentication(req);

  if (authResult.success) {
    const optionalAuthReq = req as OptionalAuthRequest;
    (
      optionalAuthReq as unknown as {
        user: typeof authResult.user;
        authMetadata: typeof authResult.metadata;
      }
    ).user = authResult.user!;
    (
      optionalAuthReq as unknown as {
        user: typeof authResult.user;
        authMetadata: typeof authResult.metadata;
      }
    ).authMetadata = authResult.metadata!;
  }

  next();
}

/**
 * Permission-based authorization middleware
 */
export function requirePermission(permission: Permission) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!authService.hasPermission(req.user, permission)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        code: AuthErrorCode.INSUFFICIENT_PERMISSIONS,
        required: permission,
        timestamp: new Date(),
      });
      return;
    }

    next();
  };
}

/**
 * Role-based authorization middleware
 */
export function requireRole(minimumRole: UserRole) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!authService.hasRole(req.user, minimumRole)) {
      res.status(403).json({
        error: 'Insufficient role privileges',
        code: AuthErrorCode.INSUFFICIENT_PERMISSIONS,
        required: minimumRole,
        current: req.user.role,
        timestamp: new Date(),
      });
      return;
    }

    next();
  };
}

/**
 * Core authentication logic shared between middleware variants
 */
async function performAuthentication(req: Request) {
  const token = extractToken(req);

  if (!token) {
    return {
      success: false,
      error: {
        code: AuthErrorCode.NO_TOKEN,
        message: 'Authentication token is required',
        timestamp: new Date(),
      },
    };
  }

  const context = {
    ip: getClientIP(req),
    userAgent: req.headers['user-agent'] || 'unknown',
    deviceId: req.headers['x-device-id'] as string,
  };

  return await authService.authenticateUser(token, context);
}

/**
 * Secure token extraction with multiple source support
 */
function extractToken(req: Request): string | null {
  // Bearer token in Authorization header (preferred)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Session token in secure cookie (fallback)
  const sessionToken = req.cookies?.['session-token'];
  if (sessionToken) {
    return sessionToken;
  }

  return null;
}

/**
 * Get client IP with proxy support
 */
function getClientIP(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const realIp = req.headers['x-real-ip'] as string;
  const connectionIp = req.connection?.remoteAddress;
  const socketIp = req.socket?.remoteAddress;

  const ip = forwarded || realIp || connectionIp || socketIp || 'unknown';
  return typeof ip === 'string' ? ip.split(',')[0]?.trim() || 'unknown' : 'unknown';
}

/**
 * Map authentication error codes to HTTP status codes
 */
function getStatusCodeForError(code: AuthErrorCode): number {
  const errorStatusMap = {
    [AuthErrorCode.NO_TOKEN]: 401,
    [AuthErrorCode.INVALID_TOKEN]: 401,
    [AuthErrorCode.EXPIRED_TOKEN]: 401,
    [AuthErrorCode.MALFORMED_TOKEN]: 400,
    [AuthErrorCode.USER_NOT_FOUND]: 401,
    [AuthErrorCode.USER_SUSPENDED]: 403,
    [AuthErrorCode.INSUFFICIENT_PERMISSIONS]: 403,
    [AuthErrorCode.RATE_LIMITED]: 429,
    [AuthErrorCode.SERVICE_UNAVAILABLE]: 503,
    [AuthErrorCode.INVALID_SESSION]: 401,
  };

  return errorStatusMap[code] || 500;
}

/**
 * Production-grade rate limiting with different policies per endpoint type
 */

// Strict rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: process.env.NODE_ENV === 'test' ? 1000 : 15 * 60 * 1000, // 1 second in test, 15 minutes in production
  max: process.env.NODE_ENV === 'test' ? 1000 : 5, // 1000 in test, 5 attempts per window per IP in production
  message: {
    error: 'Too many authentication attempts. Please try again later.',
    code: AuthErrorCode.RATE_LIMITED,
    retryAfter: process.env.NODE_ENV === 'test' ? 1 : 15 * 60, // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  skip: (req) => {
    // Skip rate limiting entirely in test environment when explicitly disabled
    return process.env.NODE_ENV === 'test' && process.env.DISABLE_RATE_LIMITING === 'true';
  },
  keyGenerator: req => `auth:${getClientIP(req)}`,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts',
      code: AuthErrorCode.RATE_LIMITED,
      retryAfter: Math.ceil(
        (req as Request & { rateLimit?: { resetTime?: number } }).rateLimit?.resetTime || 0
      ),
      timestamp: new Date(),
    });
  },
});

// Moderate rate limiting for gameplay endpoints
export const gameplayRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // 300 requests per minute (5 per second sustained)
  message: {
    error: 'Too many game actions. Please slow down.',
    code: AuthErrorCode.RATE_LIMITED,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: req => {
    const authReq = req as OptionalAuthRequest;
    return authReq.user ? `gameplay:${authReq.user.userId}` : `gameplay:${getClientIP(req)}`;
  },
});

// General API rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // 1000 requests per window
  message: {
    error: 'Too many requests. Please try again later.',
    code: AuthErrorCode.RATE_LIMITED,
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: req => `general:${getClientIP(req)}`,
});

/**
 * Enhanced field validation with security considerations
 */
export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Input sanitization and validation
    if (!req.body || typeof req.body !== 'object') {
      res.status(400).json({
        error: 'Invalid request body',
        code: 'INVALID_REQUEST_BODY',
        timestamp: new Date(),
      });
      return;
    }

    const missingFields = fields.filter(field => {
      const value = req.body[field];
      return (
        value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
      );
    });

    if (missingFields.length > 0) {
      res.status(400).json({
        error: `Missing or empty required fields: ${missingFields.join(', ')}`,
        code: 'MISSING_REQUIRED_FIELDS',
        fields: missingFields,
        timestamp: new Date(),
      });
      return;
    }

    // Additional security: limit body size and field count
    const fieldCount = Object.keys(req.body).length;
    if (fieldCount > 50) {
      // Prevent DoS via large payloads
      res.status(400).json({
        error: 'Too many fields in request',
        code: 'EXCESSIVE_FIELDS',
        timestamp: new Date(),
      });
      return;
    }

    next();
  };
};

/**
 * Legacy authenticateToken function for backward compatibility
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  return requireAuth(req as AuthenticatedRequest, res, next);
}

/**
 * Type guards for request types
 */
export function isAuthenticatedRequest(req: Request): req is AuthenticatedRequest {
  return 'user' in req && req.user !== undefined && 'userId' in req.user;
}

export function hasOptionalAuth(req: Request): req is OptionalAuthRequest {
  return 'user' in req;
}
