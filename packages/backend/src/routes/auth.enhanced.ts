/**
 * Enhanced Authentication Routes
 * Comprehensive auth endpoints with werewolf role management
 */

import { Router } from 'express';
import { container } from '../container/container';
import { TYPES } from '../container/types';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { EnhancedErrorMiddleware } from '../middleware/enhanced-error.middleware';
import { AuthController } from '../controllers/auth.enhanced.controller';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../validation/auth.validation';

const router = Router();

// Get middleware and controller instances
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
const validationMiddleware = container.get<ValidationMiddleware>(TYPES.ValidationMiddleware);
const errorMiddleware = container.get<EnhancedErrorMiddleware>(TYPES.EnhancedErrorMiddleware);
const authController = container.get<AuthController>(TYPES.AuthController);

// Wrap async handlers
const asyncHandler = errorMiddleware.asyncHandler.bind(errorMiddleware);

/**
 * @route   POST /api/auth/register
 * @desc    Register new werewolf user
 * @access  Public
 */
router.post(
  '/register',
  validationMiddleware.validate(registerSchema),
  asyncHandler(authController.register.bind(authController))
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return JWT tokens
 * @access  Public
 */
router.post(
  '/login',
  validationMiddleware.validate(loginSchema),
  asyncHandler(authController.login.bind(authController))
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh JWT access token
 * @access  Public
 */
router.post(
  '/refresh',
  validationMiddleware.validate(refreshTokenSchema),
  asyncHandler(authController.refreshToken.bind(authController))
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user and blacklist token
 * @access  Private
 */
router.post(
  '/logout',
  authMiddleware.authenticate(),
  asyncHandler(authController.logout.bind(authController))
);

/**
 * @route   POST /api/auth/logout-all
 * @desc    Logout from all devices
 * @access  Private
 */
router.post(
  '/logout-all',
  authMiddleware.authenticate(),
  asyncHandler(authController.logoutAll.bind(authController))
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  authMiddleware.authenticate(),
  asyncHandler(authController.getCurrentUser.bind(authController))
);

/**
 * @route   PUT /api/auth/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/me',
  authMiddleware.authenticate(),
  validationMiddleware.validate(updateProfileSchema),
  asyncHandler(authController.updateProfile.bind(authController))
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post(
  '/change-password',
  authMiddleware.authenticate(),
  validationMiddleware.validate(changePasswordSchema),
  asyncHandler(authController.changePassword.bind(authController))
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  validationMiddleware.validate(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword.bind(authController))
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  validationMiddleware.validate(resetPasswordSchema),
  asyncHandler(authController.resetPassword.bind(authController))
);

/**
 * @route   GET /api/auth/sessions
 * @desc    Get user's active sessions
 * @access  Private
 */
router.get(
  '/sessions',
  authMiddleware.authenticate(),
  asyncHandler(authController.getActiveSessions.bind(authController))
);

/**
 * @route   DELETE /api/auth/sessions/:sessionId
 * @desc    Revoke specific session
 * @access  Private
 */
router.delete(
  '/sessions/:sessionId',
  authMiddleware.authenticate(),
  asyncHandler(authController.revokeSession.bind(authController))
);

/**
 * @route   POST /api/auth/transform
 * @desc    Request werewolf transformation
 * @access  Private
 */
router.post(
  '/transform',
  authMiddleware.authenticate(),
  asyncHandler(authController.requestTransformation.bind(authController))
);

/**
 * @route   GET /api/auth/pack-status
 * @desc    Get current pack status
 * @access  Private
 */
router.get(
  '/pack-status',
  authMiddleware.authenticate(),
  asyncHandler(authController.getPackStatus.bind(authController))
);

/**
 * @route   POST /api/auth/challenge-alpha
 * @desc    Challenge current pack alpha
 * @access  Private (Pack members only)
 */
router.post(
  '/challenge-alpha',
  authMiddleware.authenticate(),
  asyncHandler(authController.challengeAlpha.bind(authController))
);

/**
 * @route   GET /api/auth/abilities
 * @desc    Get user's werewolf abilities
 * @access  Private
 */
router.get(
  '/abilities',
  authMiddleware.authenticate(),
  asyncHandler(authController.getAbilities.bind(authController))
);

/**
 * @route   POST /api/auth/upgrade-ability
 * @desc    Upgrade werewolf ability
 * @access  Private
 */
router.post(
  '/upgrade-ability',
  authMiddleware.authenticate(),
  asyncHandler(authController.upgradeAbility.bind(authController))
);

export default router;