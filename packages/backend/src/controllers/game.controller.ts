import { Response, NextFunction } from 'express';
import { GameService } from '../services/game.service';
import { AuthenticatedRequest } from '../types/auth.types';

const gameService = new GameService();

export class GameController {
  /**
   * POST /api/games - Create new game
   */
  async createGame(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.userId;
      const game = await gameService.createGame({
        creatorId: userId,
        maxPlayers: req.body.maxPlayers || 8,
        isPrivate: req.body.isPrivate || false,
        name: req.body.name
      });
      
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
  async listGames(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
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
  async getGame(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const gameId = req.params.id;
      if (!gameId) {
        res.status(400).json({ success: false, error: 'Game ID is required' });
        return;
      }
      const game = await gameService.getGameDetails(gameId);
      
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
  async joinGame(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.userId;
      const gameId = req.params.id;
      if (!gameId) {
        res.status(400).json({ success: false, error: 'Game ID is required' });
        return;
      }
      const game = await gameService.joinGame(gameId, userId);
      
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
  async joinByCode(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.userId;
      const code = req.params.code;
      if (!code) {
        res.status(400).json({ success: false, error: 'Game code is required' });
        return;
      }
      const game = await gameService.joinGameByCode(code, userId);
      
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
  async leaveGame(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.userId;
      const gameId = req.params.id;
      if (!gameId) {
        res.status(400).json({ success: false, error: 'Game ID is required' });
        return;
      }
      const result = await gameService.leaveGame(gameId, userId);
      
      res.json({
        success: true,
        message: 'Successfully left the game',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/games/:id/start - Start game
   */
  async startGame(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user.userId;
      const gameId = req.params.id;
      if (!gameId) {
        res.status(400).json({ success: false, error: 'Game ID is required' });
        return;
      }
      await gameService.startGame(gameId, userId);
      
      res.json({
        success: true,
        message: 'Game started successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}