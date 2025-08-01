// src/routes/auth.ts
import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { requireAuth, authRateLimit, validateRequiredFields } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Public authentication routes
router.post(
  '/signup',
  authRateLimit,
  validateRequiredFields(['username', 'email', 'password']),
  asyncHandler(AuthController.signup)
);

router.post(
  '/signin',
  authRateLimit,
  validateRequiredFields(['email', 'password']),
  asyncHandler(AuthController.signin)
);

// Legacy routes for backward compatibility
router.post(
  '/register',
  authRateLimit,
  validateRequiredFields(['username', 'email', 'password']),
  asyncHandler(AuthController.signup)
);

router.post(
  '/login',
  authRateLimit,
  validateRequiredFields(['email', 'password']),
  asyncHandler(AuthController.signin)
);

router.post(
  '/refresh',
  authRateLimit,
  asyncHandler(AuthController.refresh)
);

router.post(
  '/logout',
  asyncHandler(AuthController.logout)
);

// Protected authentication routes (require valid access token)
router.get(
  '/me',
  requireAuth,
  asyncHandler(AuthController.me)
);

// OAuth routes
router.post(
  '/provider/:provider',
  asyncHandler(AuthController.signInWithProvider)
);

router.get(
  '/callback',
  asyncHandler(AuthController.oauthCallback)
);

export default router;