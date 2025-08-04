// src/routes/users.ts
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { requireAuth, generalRateLimit } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

// Apply rate limiting to all user routes
router.use(generalRateLimit);

// Get current user's full profile (protected)
router.get('/me', requireAuth, asyncHandler(UserController.getMyProfile));

// Update current user's profile (protected)
router.patch('/me', requireAuth, asyncHandler(UserController.updateMyProfile));

// Get public user profile by ID
router.get('/:id', asyncHandler(UserController.getPublicProfile));

// Placeholder routes for future implementation
router.get('/me/games', requireAuth, (req, res) => {
  res.status(501).json({ error: 'Game history not yet implemented' });
});

router.get('/search', (req, res) => {
  res.status(501).json({ error: 'User search not yet implemented' });
});

export default router;
