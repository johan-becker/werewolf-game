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
router.post('/', validateCreateGame, gameController.createGame.bind(gameController) as any);
router.get('/', validateGameList, gameController.listGames.bind(gameController) as any);
router.get('/:id', validateGameId, gameController.getGame.bind(gameController) as any);
router.post('/:id/join', validateGameId, gameController.joinGame.bind(gameController) as any);
router.post('/join/:code', validateGameCode, gameController.joinByCode.bind(gameController) as any);
router.delete('/:id/leave', validateGameId, gameController.leaveGame.bind(gameController) as any);
router.post('/:id/start', validateGameId, gameController.startGame.bind(gameController) as any);

export default router;