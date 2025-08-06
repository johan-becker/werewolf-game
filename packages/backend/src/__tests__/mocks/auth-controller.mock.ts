import { Request, Response } from 'express';
import { MockAuthService } from './auth-service.mock';
import { logger } from '../../utils/logger';

/**
 * Mock AuthController for integration tests
 * Mimics the real AuthController but uses MockAuthService
 */
export class MockAuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, display_name } = req.body;

      const result = await MockAuthService.signup({
        username,
        email,
        password,
        full_name: display_name,
      });

      res.status(201).json({
        success: true,
        message: result.message,
        user: {
          id: result.user.id,
          username: result.user.user_metadata.username,
          email: result.user.email,
          full_name: result.user.user_metadata.full_name,
        },
        token: result.session?.access_token,
      });
    } catch (error: any) {
      logger.error('Mock signup error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Registration failed',
      });
    }
  }

  static async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await MockAuthService.signin({
        email,
        password,
      });

      res.status(200).json({
        success: true,
        message: result.message,
        user: {
          id: result.user.id,
          username: result.user.user_metadata.username,
          email: result.user.email,
          full_name: result.user.user_metadata.full_name,
        },
        token: result.session?.access_token,
      });
    } catch (error: any) {
      logger.error('Mock signin error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Login failed',
      });
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refresh_token } = req.body;

      const result = await MockAuthService.refreshToken(refresh_token);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        user: {
          id: result.user.id,
          username: result.user.user_metadata.username,
          email: result.user.email,
          full_name: result.user.user_metadata.full_name,
        },
        token: result.session?.access_token,
      });
    } catch (error: any) {
      logger.error('Mock refresh error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Token refresh failed',
      });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      await MockAuthService.logout();

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error: any) {
      logger.error('Mock logout error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Logout failed',
      });
    }
  }

  static async me(req: Request, res: Response): Promise<void> {
    try {
      // In a real implementation, this would extract user ID from the authenticated request
      const userId = (req as any).user?.userId || (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      const profile = await MockAuthService.getProfile(userId);

      res.status(200).json({
        success: true,
        user: profile,
      });
    } catch (error: any) {
      logger.error('Mock me error:', error);
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to get profile',
      });
    }
  }

  // OAuth methods (simplified for testing)
  static async signInWithProvider(req: Request, res: Response): Promise<void> {
    res.status(501).json({
      success: false,
      error: 'OAuth not implemented in test environment',
    });
  }

  static async oauthCallback(req: Request, res: Response): Promise<void> {
    res.status(501).json({
      success: false,
      error: 'OAuth callback not implemented in test environment',
    });
  }
}