/**
 * Moon Phase Management Routes
 * Lunar cycle tracking, transformation events, and werewolf calendar
 */

import { Router } from 'express';
import { container } from '../container/container';
import { TYPES } from '../container/types';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { EnhancedErrorMiddleware } from '../middleware/enhanced-error.middleware';
import { MoonPhaseController } from '../controllers/moon-phase.controller';
import { WerewolfRole } from '../types/werewolf-roles.types';
import { z } from 'zod';

const router = Router();

// Get middleware and controller instances
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
const validationMiddleware = container.get<ValidationMiddleware>(TYPES.ValidationMiddleware);
const errorMiddleware = container.get<EnhancedErrorMiddleware>(TYPES.EnhancedErrorMiddleware);
const moonPhaseController = container.get<MoonPhaseController>(TYPES.MoonPhaseController);

// Wrap async handlers
const asyncHandler = errorMiddleware.asyncHandler.bind(errorMiddleware);

// Validation schemas
const scheduleEventSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100),
    description: z.string().max(500).optional(),
    eventType: z.enum(['hunt', 'ritual', 'gathering', 'training', 'ceremony']),
    scheduledFor: z.string().datetime(),
    duration: z.number().min(1).max(480), // minutes, max 8 hours
    location: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      name: z.string().max(100).optional()
    }).optional(),
    requiredRoles: z.array(z.string()).optional(),
    maxParticipants: z.number().min(1).max(50).optional(),
    isPrivate: z.boolean().default(false)
  })
});

const transformationLogSchema = z.object({
  body: z.object({
    transformationType: z.enum(['voluntary', 'forced', 'partial', 'failed']),
    duration: z.number().min(1), // minutes
    location: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180)
    }).optional(),
    difficulty: z.number().min(1).max(10),
    complications: z.string().max(1000).optional(),
    witnesses: z.array(z.string()).optional(),
    notes: z.string().max(500).optional()
  })
});

/**
 * @route   GET /api/moon-phases/current
 * @desc    Get current moon phase and transformation info
 * @access  Private
 */
router.get(
  '/current',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getCurrentPhase.bind(moonPhaseController))
);

/**
 * @route   GET /api/moon-phases/calendar
 * @desc    Get lunar calendar for date range
 * @access  Private
 */
router.get(
  '/calendar',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getPhaseCalendar.bind(moonPhaseController))
);

/**
 * @route   GET /api/moon-phases/next-full-moon
 * @desc    Get next full moon date and countdown
 * @access  Private
 */
router.get(
  '/next-full-moon',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getNextFullMoon.bind(moonPhaseController))
);

/**
 * @route   GET /api/moon-phases/transformation-schedule
 * @desc    Get user's transformation schedule
 * @access  Private
 */
router.get(
  '/transformation-schedule',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getTransformationSchedule.bind(moonPhaseController))
);

/**
 * @route   POST /api/moon-phases/transformation-log
 * @desc    Log transformation event
 * @access  Private
 */
router.post(
  '/transformation-log',
  authMiddleware.authenticate(),
  validationMiddleware.validate(transformationLogSchema),
  asyncHandler(moonPhaseController.logTransformation.bind(moonPhaseController))
);

/**
 * @route   GET /api/moon-phases/transformation-history
 * @desc    Get user's transformation history
 * @access  Private
 */
router.get(
  '/transformation-history',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getTransformationHistory.bind(moonPhaseController))
);

/**
 * @route   GET /api/moon-phases/events
 * @desc    Get moon phase events (hunts, rituals, etc.)
 * @access  Private
 */
router.get(
  '/events',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getMoonPhaseEvents.bind(moonPhaseController))
);

/**
 * @route   POST /api/moon-phases/events
 * @desc    Schedule moon phase event
 * @access  Private (Pack leadership required)
 */
router.post(
  '/events',
  authMiddleware.authenticate(),
  authMiddleware.requirePackLeadership(),
  validationMiddleware.validate(scheduleEventSchema),
  asyncHandler(moonPhaseController.scheduleEvent.bind(moonPhaseController))
);

/**
 * @route   GET /api/moon-phases/events/:eventId
 * @desc    Get specific moon phase event
 * @access  Private
 */
router.get(
  '/events/:eventId',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getEventById.bind(moonPhaseController))
);

/**
 * @route   POST /api/moon-phases/events/:eventId/join
 * @desc    Join moon phase event
 * @access  Private
 */
router.post(
  '/events/:eventId/join',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.joinEvent.bind(moonPhaseController))
);

/**
 * @route   POST /api/moon-phases/events/:eventId/leave
 * @desc    Leave moon phase event
 * @access  Private
 */
router.post(
  '/events/:eventId/leave',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.leaveEvent.bind(moonPhaseController))
);

/**
 * @route   GET /api/moon-phases/predictions
 * @desc    Get transformation predictions based on moon phase
 * @access  Private
 */
router.get(
  '/predictions',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getTransformationPredictions.bind(moonPhaseController))
);

/**
 * @route   GET /api/moon-phases/statistics
 * @desc    Get user's moon phase statistics
 * @access  Private
 */
router.get(
  '/statistics',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getMoonPhaseStatistics.bind(moonPhaseController))
);

/**
 * @route   POST /api/moon-phases/resistance-training
 * @desc    Log moon resistance training session
 * @access  Private
 */
router.post(
  '/resistance-training',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.logResistanceTraining.bind(moonPhaseController))
);

/**
 * @route   GET /api/moon-phases/pack-activity
 * @desc    Get pack's moon phase activity
 * @access  Private (Pack members only)
 */
router.get(
  '/pack-activity',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getPackMoonActivity.bind(moonPhaseController))
);

/**
 * @route   POST /api/moon-phases/ritual
 * @desc    Perform moon phase ritual
 * @access  Private (Healer or Alpha required)
 */
router.post(
  '/ritual',
  authMiddleware.authenticate(),
  authMiddleware.requireRole(WerewolfRole.WITCH), // Fixed: HEALER -> WITCH
  asyncHandler(moonPhaseController.performRitual.bind(moonPhaseController))
);

/**
 * @route   GET /api/moon-phases/optimal-times
 * @desc    Get optimal times for activities based on moon phase
 * @access  Private
 */
router.get(
  '/optimal-times',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getOptimalTimes.bind(moonPhaseController))
);

/**
 * @route   POST /api/moon-phases/set-preferences
 * @desc    Set moon phase notification preferences
 * @access  Private
 */
router.post(
  '/set-preferences',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.setMoonPhasePreferences.bind(moonPhaseController))
);

/**
 * @route   GET /api/moon-phases/eclipse-events
 * @desc    Get lunar eclipse events (special transformation events)
 * @access  Private
 */
router.get(
  '/eclipse-events',
  authMiddleware.authenticate(),
  asyncHandler(moonPhaseController.getEclipseEvents.bind(moonPhaseController))
);

export default router;