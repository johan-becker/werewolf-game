import { Request, Response, NextFunction } from 'express';
import { MockAuthService } from './auth-service.mock';

/**
 * Mock authentication middleware for tests
 * Provides the same interface as the real auth middleware but uses MockAuthService
 */
export async function mockAuthenticateToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Authentication token is required',
        code: 'NO_TOKEN',
        timestamp: new Date(),
      });
      return;
    }

    const token = authHeader.substring(7);
    
    const result = await MockAuthService.verifyToken(token);
    
    // Attach user info to request object to match the real middleware
    (req as any).user = {
      userId: result.user.id,
      username: result.user.user_metadata.username,
      email: result.user.email,
      role: 'user', // Default role for tests
      permissions: ['read', 'write'], // Default permissions for tests
    };

    next();
  } catch (error: any) {
    res.status(401).json({
      error: error.message || 'Invalid authentication token',
      code: 'INVALID_TOKEN',
      timestamp: new Date(),
    });
  }
}

/**
 * Mock optional auth middleware - allows both authenticated and anonymous users
 */
export async function mockOptionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const result = await MockAuthService.verifyToken(token);
        
        (req as any).user = {
          userId: result.user.id,
          username: result.user.user_metadata.username,
          email: result.user.email,
          role: 'user',
          permissions: ['read', 'write'],
        };
      } catch (error) {
        // Ignore auth errors in optional auth
        // The request continues without user info
      }
    }

    next();
  } catch (error) {
    // In optional auth, we don't fail on errors
    next();
  }
}