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
router.post('/', validateCreateGame, gameController.createGame.bind(gameController));
router.get('/', validateGameList, gameController.listGames.bind(gameController));
router.get('/:id', validateGameId, gameController.getGame.bind(gameController));
router.post('/:id/join', validateGameId, gameController.joinGame.bind(gameController));
router.post('/join/:code', validateGameCode, gameController.joinByCode.bind(gameController));
router.delete('/:id/leave', validateGameId, gameController.leaveGame.bind(gameController));
router.post('/:id/start', validateGameId, gameController.startGame.bind(gameController));

export default router;