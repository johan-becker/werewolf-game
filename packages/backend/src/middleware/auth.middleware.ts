/**
 * Enhanced Authentication Middleware
 * JWT validation with role-based access control
 */

import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { IJwtService } from '../interfaces/auth/jwt-service.interface';
import { TYPES } from '../container/types';
import { WerewolfRole } from '../types/werewolf-user.types';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        username: string;
        email: string;
        role: string;
        permissions: string[];
      };
    }
  }
}

@injectable()
export class AuthMiddleware {
  constructor(
    @inject(TYPES.JwtService) private readonly jwtService: IJwtService
  ) {}

  /**
   * Verify JWT token and attach user to request
   */
  authenticate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = this.extractToken(req);
        
        if (!token) {
          return res.status(401).json({
            success: false,
            error: 'Authentication required',
            code: 'NO_TOKEN',
            timestamp: new Date().toISOString()
          });
        }

        const validation = await this.jwtService.validateAccessToken(token);
        
        if (!validation.isValid) {
          if (validation.expired) {
            return res.status(401).json({
              success: false,
              error: 'Token expired',
              code: 'TOKEN_EXPIRED',
              timestamp: new Date().toISOString()
            });
          }

          return res.status(401).json({
            success: false,
            error: 'Invalid token',
            code: 'INVALID_TOKEN',
            timestamp: new Date().toISOString()
          });
        }

        // Attach user to request
        req.user = validation.payload;
        next();
      } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({
          success: false,
          error: 'Authentication service error',
          code: 'AUTH_SERVICE_ERROR',
          timestamp: new Date().toISOString()
        });
      }
    };
  }

  /**
   * Optional authentication - doesn't fail if no token
   */
  optionalAuth() {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const token = this.extractToken(req);
        
        if (!token) {
          return next();
        }

        const validation = await this.jwtService.validateAccessToken(token);
        
        if (validation.isValid && validation.payload) {
          req.user = validation.payload;
        }

        next();
      } catch (error) {
        // Don't fail on optional auth errors
        console.error('Optional auth error:', error);
        next();
      }
    };
  }

  /**
   * Require specific werewolf role
   */
  requireRole(...roles: WerewolfRole[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'NO_AUTH',
          timestamp: new Date().toISOString()
        });
      }

      const userRole = req.user.role as WerewolfRole;
      
      if (!roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_ROLE',
          required: roles,
          current: userRole,
          timestamp: new Date().toISOString()
        });
      }

      next();
    };
  }

  /**
   * Require specific permissions
   */
  requirePermissions(...permissions: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'NO_AUTH',
          timestamp: new Date().toISOString()
        });
      }

      const userPermissions = req.user.permissions || [];
      const hasAllPermissions = permissions.every(permission => 
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        const missingPermissions = permissions.filter(permission => 
          !userPermissions.includes(permission)
        );

        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: permissions,
          missing: missingPermissions,
          timestamp: new Date().toISOString()
        });
      }

      next();
    };
  }

  /**
   * Require Alpha or Beta role (pack leadership)
   */
  requirePackLeadership() {
    return this.requireRole(WerewolfRole.ALPHA, WerewolfRole.BETA);
  }

  /**
   * Require Alpha role only
   */
  requireAlpha() {
    return this.requireRole(WerewolfRole.ALPHA);
  }

  /**
   * Require user to own resource or be pack leader
   */
  requireOwnershipOrLeadership(userIdField: string = 'userId') {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          code: 'NO_AUTH',
          timestamp: new Date().toISOString()
        });
      }

      const resourceUserId = req.params[userIdField] || req.body[userIdField];
      const currentUserId = req.user.userId;
      const userRole = req.user.role as WerewolfRole;

      // Allow if user owns the resource
      if (resourceUserId === currentUserId) {
        return next();
      }

      // Allow if user is pack leadership
      if ([WerewolfRole.ALPHA, WerewolfRole.BETA].includes(userRole)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        error: 'Access denied - insufficient permissions',
        code: 'ACCESS_DENIED',
        timestamp: new Date().toISOString()
      });
    };
  }

  /**
   * Extract token from various sources
   */
  private extractToken(req: Request): string | null {
    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check cookie
    const cookieToken = req.cookies?.accessToken;
    if (cookieToken) {
      return cookieToken;
    }

    // Check query parameter (not recommended for production)
    const queryToken = req.query.token as string;
    if (queryToken) {
      return queryToken;
    }

    return null;
  }

  /**
   * Set secure cookie with token
   */
  setTokenCookie(res: Response, token: string, maxAge: number): void {
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: maxAge * 1000, // Convert to milliseconds
      path: '/'
    });
  }

  /**
   * Clear token cookie
   */
  clearTokenCookie(res: Response): void {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });
  }
}