import { Router } from 'express';
import { GameController } from '../controllers/game.controller';
import { requireAuth } from '../middleware/auth';
import { 
  validateCreateGame, 
  validateGameId, 
  validateGameCode, 
  validateGameList 
} from '../validators/game.validator';

const router = Router();
const gameController = new GameController();

// All routes require authentication
router.use(requireAuth);

// Game management routes
router.post('/', validateCreateGame, gameController.createGame);
router.get('/', validateGameList, gameController.listGames);
router.get('/:id', validateGameId, gameController.getGame);
router.post('/:id/join', validateGameId, gameController.joinGame);
router.post('/join/:code', validateGameCode, gameController.joinByCode);
router.delete('/:id/leave', validateGameId, gameController.leaveGame);
router.post('/:id/start', validateGameId, gameController.startGame);

export default router;