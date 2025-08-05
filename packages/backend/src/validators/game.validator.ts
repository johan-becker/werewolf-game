import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateCreateGame = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Game name must be between 3 and 50 characters'),
  body('maxPlayers').isInt({ min: 4, max: 20 }).withMessage('Max players must be between 4 and 20'),
  body('settings').optional().isObject().withMessage('Settings must be an object'),
  handleValidationErrors,
];

export const validateGameId = [
  param('id').isUUID().withMessage('Invalid game ID format'),
  handleValidationErrors,
];

export const validateGameCode = [
  param('code')
    .isLength({ min: 4, max: 10 })
    .matches(/^[A-Z0-9]+$/i)
    .withMessage('Invalid game code format'),
  handleValidationErrors,
];

export const validateGameList = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative'),
  handleValidationErrors,
];

function handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array(),
    });
    return;
  }
  next();
}
