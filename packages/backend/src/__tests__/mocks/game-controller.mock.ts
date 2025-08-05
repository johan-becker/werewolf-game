// @ts-nocheck
import { Request, Response } from 'express';
import { MockGameService } from './game-service.mock';

/**
 * Mock Game Controller for integration tests
 * Uses MockGameService instead of real Supabase connections
 */
export class MockGameController {
  static async createGame(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const { name, maxPlayers, settings } = req.body;

      if (!name || name.trim().length < 3) {
        res.status(400).json({
          success: false,
          error: 'Game name must be at least 3 characters long',
          errors: [
            {
              type: 'field',
              location: 'body',
              path: 'name',
              msg: 'Game name must be at least 3 characters long'
            }
          ]
        });
        return;
      }

      if (maxPlayers && (maxPlayers < 4 || maxPlayers > 20)) {
        res.status(400).json({
          success: false,
          error: 'Max players must be between 4 and 20',
          errors: [
            {
              type: 'field',
              location: 'body',
              path: 'maxPlayers',
              msg: 'Max players must be between 4 and 20'
            }
          ]
        });
        return;
      }

      const result = await MockGameService.createGame(userId, {
        name: name.trim(),
        maxPlayers: maxPlayers || 8,
        settings: settings || {},
      });

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Mock game creation error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to create game',
      });
    }
  }

  static async getGame(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || (req as any).user?.id;

      const result = await MockGameService.getGame(id, userId as any);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Game not found') {
        res.status(404).json({
          success: false,
          error: 'Game not found',
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to get game',
        });
      }
    }
  }

  static async listGames(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId || (req as any).user?.id;
      const result = await MockGameService.listGames(userId);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to list games',
      });
    }
  }

  static async joinGame(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const result = await MockGameService.joinGame(id, userId as any);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Game not found') {
        res.status(404).json({
          success: false,
          error: 'Game not found',
        });
      } else if (error.message.includes('full') || error.message.includes('started') || error.message.includes('already')) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to join game',
        });
      }
    }
  }

  static async joinByCode(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      const userId = (req as any).user?.userId || (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const result = await MockGameService.joinGameByCode(code, userId as any);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Game not found') {
        res.status(404).json({
          success: false,
          error: 'Game not found',
        });
      } else if (error.message.includes('full') || error.message.includes('started') || error.message.includes('already')) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to join game',
        });
      }
    }
  }

  static async leaveGame(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const result = await MockGameService.leaveGame(id, userId as any);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Game not found') {
        res.status(404).json({
          success: false,
          error: 'Game not found',
        });
      } else if (error.message.includes('not in this game')) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to leave game',
        });
      }
    }
  }

  static async startGame(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const result = await MockGameService.startGame(id, userId as any);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Game not found') {
        res.status(404).json({
          success: false,
          error: 'Game not found',
        });
      } else if (error.message.includes('Only the host')) {
        res.status(403).json({
          success: false,
          error: error.message,
        });
      } else if (error.message.includes('players') || error.message.includes('minimum')) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to start game',
        });
      }
    }
  }

  static async performNightAction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || (req as any).user?.id;
      const { action, target_id } = req.body;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      if (!action) {
        res.status(400).json({
          success: false,
          error: 'Action type is required',
        });
        return;
      }

      const result = await MockGameService.performNightAction(id, userId as any, {
        action,
        target_id,
      });
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Game not found') {
        res.status(404).json({
          success: false,
          error: 'Game not found',
        });
      } else if (error.message.includes('invalid target')) {
        res.status(400).json({
          success: false,
          error: 'Invalid target for night action',
        });
      } else if (error.message.includes('phase')) {
        res.status(400).json({
          success: false,
          error: 'Night actions can only be performed during night phase',
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to perform night action',
        });
      }
    }
  }

  static async advancePhase(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const result = await MockGameService.advancePhase(id, userId as any);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Game not found') {
        res.status(404).json({
          success: false,
          error: 'Game not found',
        });
      } else if (error.message.includes('host')) {
        res.status(403).json({
          success: false,
          error: 'Only the host can advance the game phase',
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to advance phase',
        });
      }
    }
  }

  static async getMoonPhase(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId || (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const result = await MockGameService.getMoonPhase(id);
      res.status(200).json(result);
    } catch (error: any) {
      if (error.message === 'Game not found') {
        res.status(404).json({
          success: false,
          error: 'Game not found',
        });
      } else {
        res.status(500).json({
          success: false,
          error: error.message || 'Failed to get moon phase information',
        });
      }
    }
  }
}