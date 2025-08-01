/**
 * Enhanced game routes with comprehensive error boundary pattern
 * Uses standardized error interceptors and response handlers
 */

import { Router } from 'express';
import { EnhancedGameController } from '../controllers/game.controller.enhanced';
import { requireAuth } from '../middleware/auth';
import {
  requestTrackingMiddleware,
  controllerErrorInterceptor,
  validateGameId,
  validateGameCode,
  validatePagination,
  asyncController,
  asyncControllerWithStatus,
  responseTimeMiddleware
} from '../middleware/controller-error.middleware';

const router = Router();
const gameController = new EnhancedGameController();

// Apply request tracking and response time middleware to all routes
router.use(requestTrackingMiddleware);
router.use(responseTimeMiddleware);

// All routes require authentication
router.use(requireAuth);

// Game management routes with comprehensive error handling

/**
 * POST /api/games - Create new game
 * Returns 201 on success with game details
 * Comprehensive validation for maxPlayers, name, isPrivate
 */
router.post('/', 
  asyncControllerWithStatus(
    gameController.createGame.bind(gameController), 
    201
  )
);

/**
 * GET /api/games - List games with pagination
 * Validates pagination parameters (limit: 1-100, offset: ≥0)
 * Returns filtered game list with metadata
 */
router.get('/', 
  validatePagination,
  asyncController(gameController.listGames.bind(gameController))
);

/**
 * GET /api/games/:id - Get game details
 * Validates game ID format and existence
 * Checks permissions for private games
 */
router.get('/:id', 
  validateGameId('id'),
  asyncController(gameController.getGame.bind(gameController))
);

/**
 * POST /api/games/:id/join - Join game by ID
 * Validates game state, capacity, and user eligibility
 * Handles host transfer logic if needed
 */
router.post('/:id/join', 
  validateGameId('id'),
  asyncController(gameController.joinGame.bind(gameController))
);

/**
 * POST /api/games/join/:code - Join game by code
 * Validates 6-character alphanumeric game code format
 * Redirects to ID-based join for consistency
 */
router.post('/join/:code', 
  validateGameCode('code'),
  asyncController(gameController.joinByCode.bind(gameController))
);

/**
 * DELETE /api/games/:id/leave - Leave game
 * Handles host transfer and game dissolution logic
 * Validates game phase restrictions
 */
router.delete('/:id/leave', 
  validateGameId('id'),
  asyncController(gameController.leaveGame.bind(gameController))
);

/**
 * POST /api/games/:id/start - Start game
 * Validates host permissions and minimum player count
 * Initializes game state and role assignments
 */
router.post('/:id/start', 
  validateGameId('id'),
  asyncController(gameController.startGame.bind(gameController))
);

// Apply global error interceptor for unhandled exceptions
router.use(controllerErrorInterceptor);

export default router;