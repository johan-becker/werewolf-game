import { Request, Response, NextFunction } from 'express';
import { GameService } from '../services/game.service';
import { AuthRequest } from '../middleware/auth';

const gameService = new GameService();

export class GameController {
  /**
   * POST /api/games - Create new game
   */
  async createGame(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const game = await gameService.createGame(userId, req.body);
      
      res.status(201).json({
        success: true,
        data: game
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/games - List games
   */
  async listGames(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const games = await gameService.getGameList(
        Number(limit),
        Number(offset)
      );
      
      res.json({
        success: true,
        data: games,
        pagination: {
          limit: Number(limit),
          offset: Number(offset)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/games/:id - Get game details
   */
  async getGame(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const game = await gameService.getGameDetails(req.params.id);
      
      res.json({
        success: true,
        data: game
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/games/:id/join - Join by ID
   */
  async joinGame(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const game = await gameService.joinGame(req.params.id, userId);
      
      res.json({
        success: true,
        data: game
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/games/join/:code - Join by code
   */
  async joinByCode(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const game = await gameService.joinGameByCode(req.params.code, userId);
      
      res.json({
        success: true,
        data: game
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/games/:id/leave - Leave game
   */
  async leaveGame(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      await gameService.leaveGame(req.params.id, userId);
      
      res.json({
        success: true,
        message: 'Successfully left the game'
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/games/:id/start - Start game
   */
  async startGame(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      await gameService.startGame(req.params.id, userId);
      
      res.json({
        success: true,
        message: 'Game started successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}