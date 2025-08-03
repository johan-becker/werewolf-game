// src/controllers/authController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

export class AuthController {
  // Signup new user with Supabase
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { username, email, password, full_name } = req.body;

      // Basic validation
      if (!username || !email || !password) {
        res.status(400).json({
          error: 'Username, email, and password are required'
        });
        return;
      }

      if (password.length < 8) {
        res.status(400).json({
          error: 'Password must be at least 8 characters long'
        });
        return;
      }

      if (username.length < 3 || username.length > 20) {
        res.status(400).json({
          error: 'Username must be between 3 and 20 characters'
        });
        return;
      }

      const result = await AuthService.signup({
        username,
        email,
        password,
        full_name
      });

      res.status(201).json({
        success: true,
        message: result.message,
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.user_metadata?.username
        },
        session: result.session ? {
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
          expires_at: result.session.expires_at
        } : null
      });

    } catch (error: any) {
      logger.error('Signup controller error:', error);
      res.status(400).json({
        error: error.message || 'Registration failed'
      });
    }
  }

  // Signin user with Supabase
  static async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: 'Email and password are required'
        });
        return;
      }

      const result = await AuthService.signin({
        email,
        password
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.user_metadata?.username
        },
        session: {
          access_token: result.accessToken,
          refresh_token: result.refreshToken,
          expires_at: result.session.expires_at
        }
      });

    } catch (error: any) {
      logger.error('Signin controller error:', error);
      res.status(401).json({
        error: error.message || 'Login failed'
      });
    }
  }

  // Refresh tokens
  static async refresh(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          error: 'Refresh token is required'
        });
        return;
      }

      const result = await AuthService.refreshTokens(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.user_metadata?.username
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      });

    } catch (error: any) {
      logger.error('Refresh controller error:', error);
      res.status(401).json({
        error: error.message || 'Token refresh failed'
      });
    }
  }

  // Logout user with Supabase
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      await AuthService.logout();

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });

    } catch (error: any) {
      logger.error('Logout controller error:', error);
      // Still return success even if logout fails
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    }
  }

  // Get current user profile
  static async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not found'
        });
        return;
      }

      const profile = await AuthService.getUserProfile(req.user.userId);

      res.status(200).json({
        success: true,
        user: profile
      });

    } catch (error: any) {
      logger.error('Get profile controller error:', error);
      res.status(500).json({
        error: error.message || 'Failed to get user profile'
      });
    }
  }

  // OAuth provider signin
  static async signInWithProvider(req: Request, res: Response): Promise<void> {
    try {
      const { provider } = req.params as { provider: string };

      if (!provider || !['google', 'github', 'discord'].includes(provider)) {
        res.status(400).json({
          error: 'Unsupported OAuth provider'
        });
        return;
      }

      const result = await AuthService.signInWithProvider(provider as 'google' | 'github' | 'discord');

      res.status(200).json({
        success: true,
        data: result
      });

    } catch (error: any) {
      logger.error('OAuth signin controller error:', error);
      res.status(400).json({
        error: error.message || 'OAuth signin failed'
      });
    }
  }

  // OAuth callback handler
  static async oauthCallback(req: Request, res: Response): Promise<void> {
    try {
      // This would typically handle the OAuth callback
      // and redirect to the frontend with tokens
      res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    } catch (error: any) {
      logger.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/auth/error`);
    }
  }
}