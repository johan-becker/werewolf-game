import Joi from 'joi';
import { ValidationError } from '@/types/database';

// User validation schemas
export const userRegistrationSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(20).required().messages({
    'string.alphanum': 'Username must contain only letters and numbers',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must not exceed 20 characters',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password must not exceed 100 characters',
      'string.pattern.base':
        'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      'any.required': 'Password is required',
    }),
});

export const userLoginSchema = Joi.object({
  username: Joi.string().required().messages({
    'any.required': 'Username is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});

// Game validation schemas
export const gameCreateSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    'string.min': 'Game name must be at least 3 characters long',
    'string.max': 'Game name must not exceed 50 characters',
    'any.required': 'Game name is required',
  }),
  maxPlayers: Joi.number().integer().min(5).max(20).optional().messages({
    'number.min': 'Maximum players must be at least 5',
    'number.max': 'Maximum players must not exceed 20',
    'number.integer': 'Maximum players must be a whole number',
  }),
  gameSettings: Joi.object({
    roles: Joi.object({
      werewolf: Joi.number().integer().min(1).max(5).required(),
      villager: Joi.number().integer().min(1).max(15).required(),
      seer: Joi.number().integer().min(0).max(2).optional(),
      doctor: Joi.number().integer().min(0).max(2).optional(),
      hunter: Joi.number().integer().min(0).max(1).optional(),
    }).required(),
    timing: Joi.object({
      dayPhaseSeconds: Joi.number().integer().min(60).max(600).required(),
      nightPhaseSeconds: Joi.number().integer().min(30).max(300).required(),
      votingSeconds: Joi.number().integer().min(30).max(180).required(),
    }).required(),
    rules: Joi.object({
      allowSpectators: Joi.boolean().required(),
      revealRolesOnDeath: Joi.boolean().required(),
      enableChat: Joi.boolean().required(),
    }).required(),
  }).optional(),
});

export const gameJoinSchema = Joi.object({
  gameCode: Joi.string().length(6).alphanum().uppercase().required().messages({
    'string.length': 'Game code must be exactly 6 characters',
    'string.alphanum': 'Game code must contain only letters and numbers',
    'any.required': 'Game code is required',
  }),
});

// Game log validation schemas
export const gameLogCreateSchema = Joi.object({
  gameId: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.guid': 'Game ID must be a valid UUID',
    'any.required': 'Game ID is required',
  }),
  roundNumber: Joi.number().integer().min(0).required().messages({
    'number.integer': 'Round number must be a whole number',
    'number.min': 'Round number must be 0 or greater',
    'any.required': 'Round number is required',
  }),
  phase: Joi.string().valid('DAY', 'NIGHT').required().messages({
    'any.only': 'Phase must be either DAY or NIGHT',
    'any.required': 'Phase is required',
  }),
  actionType: Joi.string()
    .valid(
      'VOTE',
      'WEREWOLF_KILL',
      'SEER_CHECK',
      'DOCTOR_HEAL',
      'HUNTER_SHOT',
      'PLAYER_ELIMINATED',
      'GAME_START',
      'GAME_END',
      'PHASE_CHANGE',
      'PLAYER_JOIN',
      'PLAYER_LEAVE'
    )
    .required()
    .messages({
      'any.only': 'Invalid action type',
      'any.required': 'Action type is required',
    }),
  actorId: Joi.string().guid({ version: 'uuidv4' }).optional().messages({
    'string.guid': 'Actor ID must be a valid UUID',
  }),
  targetId: Joi.string().guid({ version: 'uuidv4' }).optional().messages({
    'string.guid': 'Target ID must be a valid UUID',
  }),
  details: Joi.object().optional(),
});

// Pagination validation schema
export const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().messages({
    'number.integer': 'Page must be a whole number',
    'number.min': 'Page must be 1 or greater',
  }),
  limit: Joi.number().integer().min(1).max(100).optional().messages({
    'number.integer': 'Limit must be a whole number',
    'number.min': 'Limit must be 1 or greater',
    'number.max': 'Limit must not exceed 100',
  }),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().valid('asc', 'desc').optional().messages({
    'any.only': 'Sort order must be either asc or desc',
  }),
});

// UUID validation schema
export const uuidSchema = Joi.string().guid({ version: 'uuidv4' }).required().messages({
  'string.guid': 'Must be a valid UUID',
  'any.required': 'ID is required',
});

// Generic validation function
export const validate = <T>(
  schema: Joi.ObjectSchema<T>,
  data: any,
  options: Joi.ValidationOptions = {}
): T => {
  const defaultOptions: Joi.ValidationOptions = {
    abortEarly: false,
    stripUnknown: true,
    ...options,
  };

  const { error, value } = schema.validate(data, defaultOptions);

  if (error) {
    const message = error.details.map(detail => detail.message).join('; ');
    throw new ValidationError(message);
  }

  return value;
};

// Validate UUID parameter
export const validateUUID = (id: string, fieldName: string = 'ID'): void => {
  const { error } = uuidSchema.validate(id);
  if (error) {
    throw new ValidationError(`${fieldName} must be a valid UUID`);
  }
};

// Validate game code format
export const validateGameCode = (code: string): void => {
  const { error } = gameJoinSchema.extract('gameCode').validate(code);
  if (error) {
    throw new ValidationError('Invalid game code format');
  }
};

// Custom validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
  return usernameRegex.test(username);
};

export const isStrongPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

// Game settings validation helpers
export const validateGameRoles = (roles: any): boolean => {
  if (!roles || typeof roles !== 'object') return false;

  const totalWerewolves = roles.werewolf || 0;
  const totalVillagers =
    (roles.villager || 0) + (roles.seer || 0) + (roles.doctor || 0) + (roles.hunter || 0);
  const totalPlayers = totalWerewolves + totalVillagers;

  // Basic validation rules
  if (totalPlayers < 5 || totalPlayers > 20) return false;
  if (totalWerewolves < 1 || totalWerewolves >= totalVillagers) return false;
  if (totalVillagers < 3) return false;

  return true;
};

export const validateGameTiming = (timing: any): boolean => {
  if (!timing || typeof timing !== 'object') return false;

  return (
    timing.dayPhaseSeconds >= 60 &&
    timing.dayPhaseSeconds <= 600 &&
    timing.nightPhaseSeconds >= 30 &&
    timing.nightPhaseSeconds <= 300 &&
    timing.votingSeconds >= 30 &&
    timing.votingSeconds <= 180
  );
};
