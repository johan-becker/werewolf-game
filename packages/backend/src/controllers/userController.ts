// src/controllers/userController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../utils/logger';

export class UserController {
  // Get public user profile by ID
  static async getPublicProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          error: 'User ID is required'
        });
        return;
      }

      const profile = await AuthService.getPublicProfile(id);

      res.status(200).json({
        success: true,
        user: profile
      });

    } catch (error: any) {
      logger.error('Get public profile controller error:', error);
      
      if (error.message.includes('not found')) {
        res.status(404).json({
          error: 'User not found'
        });
        return;
      }

      res.status(500).json({
        error: error.message || 'Failed to get user profile'
      });
    }
  }

  // Update current user's profile
  static async updateMyProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated'
        });
        return;
      }

      const { username, full_name, bio, avatar_url } = req.body;
      const updates: any = {};

      if (username !== undefined) {
        if (username.length < 3 || username.length > 20) {
          res.status(400).json({
            error: 'Username must be between 3 and 20 characters'
          });
          return;
        }
        updates.username = username;
      }

      if (full_name !== undefined) updates.full_name = full_name;
      if (bio !== undefined) updates.bio = bio;
      if (avatar_url !== undefined) updates.avatar_url = avatar_url;

      if (Object.keys(updates).length === 0) {
        res.status(400).json({
          error: 'No valid fields to update'
        });
        return;
      }

      // Get access token from request
      const accessToken = req.headers.authorization?.replace('Bearer ', '');
      if (!accessToken) {
        res.status(401).json({
          error: 'Access token required'
        });
        return;
      }

      const updatedProfile = await AuthService.updateProfile(req.user.userId, updates, accessToken);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedProfile
      });

    } catch (error: any) {
      logger.error('Update profile controller error:', error);
      
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        res.status(409).json({
          error: 'Username already taken'
        });
        return;
      }

      res.status(500).json({
        error: error.message || 'Failed to update profile'
      });
    }
  }

  // Get current user's full profile
  static async getMyProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated'
        });
        return;
      }

      const profile = await AuthService.getUserProfile(req.user.userId);

      res.status(200).json({
        success: true,
        user: profile
      });

    } catch (error: any) {
      logger.error('Get my profile controller error:', error);
      res.status(500).json({
        error: error.message || 'Failed to get user profile'
      });
    }
  }
}