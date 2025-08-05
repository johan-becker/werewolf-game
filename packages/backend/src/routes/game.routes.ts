import { Router } from 'express';
import { GameController } from '../controllers/game.controller';
import { requireAuth } from '../middleware/auth';
import {
  gameCreationRateLimit,
  gameJoinRateLimit,
  nightActionRateLimit,
} from '../middleware/rate-limit.middleware';
import {
  validateCreateGame,
  validateGameId,
  validateGameCode,
  validateGameList,
} from '../validators/game.validator';

const router = Router();
const gameController = new GameController();

// All routes require authentication
router.use(requireAuth);

// Game management routes
router.post('/', gameCreationRateLimit, validateCreateGame, gameController.createGame.bind(gameController) as any);
router.get('/', validateGameList, gameController.listGames.bind(gameController) as any);
router.get('/:id', validateGameId, gameController.getGame.bind(gameController) as any);

// Join routes
router.post('/join/:code', gameJoinRateLimit, validateGameCode, gameController.joinByCode.bind(gameController) as any); // Keep backward compatibility
router.post('/:code/join', gameJoinRateLimit, validateGameCode, gameController.joinByCode.bind(gameController) as any);

router.delete('/:id/leave', validateGameId, gameController.leaveGame.bind(gameController) as any);
router.post('/:id/start', validateGameId, gameController.startGame.bind(gameController) as any);
router.patch('/:id/start', validateGameId, gameController.startGame.bind(gameController) as any);

// Night actions and game progression
router.post('/:id/actions/night', nightActionRateLimit, validateGameId, gameController.performNightAction.bind(gameController) as any);
router.patch('/:id/phase/advance', validateGameId, gameController.advancePhase.bind(gameController) as any);

// Game state information
router.get('/:id/moon-phase', validateGameId, gameController.getMoonPhase.bind(gameController) as any);

export default router;
