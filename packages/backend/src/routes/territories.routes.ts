/**
 * Territory Management Routes
 * Werewolf territory claiming, disputes, and boundary management
 */

import { Router } from 'express';
import { container } from '../container/container';
import { TYPES } from '../container/types';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { EnhancedErrorMiddleware } from '../middleware/enhanced-error.middleware';
import { TerritoryController } from '../controllers/territory.controller';
import { z } from 'zod';

const router = Router();

// Get middleware and controller instances
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
const validationMiddleware = container.get<ValidationMiddleware>(TYPES.ValidationMiddleware);
const errorMiddleware = container.get<EnhancedErrorMiddleware>(TYPES.EnhancedErrorMiddleware);
const territoryController = container.get<TerritoryController>(TYPES.TerritoryController);

// Wrap async handlers
const asyncHandler = errorMiddleware.asyncHandler.bind(errorMiddleware);

// Validation schemas
const claimTerritorySchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100),
    description: z.string().max(500).optional(),
    boundaries: z.array(z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180)
    })).min(3),
    markerType: z.enum(['scent', 'physical', 'spiritual']).default('scent'),
    isPublic: z.boolean().default(false)
  })
});

const updateTerritorySchema = z.object({
  body: z.object({
    name: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional(),
    boundaries: z.array(z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180)
    })).min(3).optional(),
    markerType: z.enum(['scent', 'physical', 'spiritual']).optional(),
    isPublic: z.boolean().optional()
  })
});

const disputeTerritorySchema = z.object({
  body: z.object({
    reason: z.string().min(10).max(1000),
    evidenceType: z.enum(['historical_claim', 'boundary_violation', 'resource_rights', 'pack_expansion']),
    proposedResolution: z.string().max(500).optional()
  })
});

const patrolSchema = z.object({
  body: z.object({
    route: z.array(z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
      timestamp: z.string().datetime()
    })).min(2),
    observations: z.string().max(1000).optional(),
    threats: z.array(z.string()).optional(),
    scent_markers_refreshed: z.boolean().default(false)
  })
});

/**
 * @route   GET /api/territories
 * @desc    Get all territories (public) or user's territories
 * @access  Private
 */
router.get(
  '/',
  authMiddleware.authenticate(),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController)) // TODO: implement getTerritories
);

/**
 * @route   POST /api/territories/claim
 * @desc    Claim new territory
 * @access  Private (Pack leadership required)
 */
router.post(
  '/claim',
  authMiddleware.authenticate(),
  authMiddleware.requirePackLeadership(),
  validationMiddleware.validate(claimTerritorySchema),
  asyncHandler(territoryController.claimTerritory.bind(territoryController))
);

/**
 * @route   GET /api/territories/nearby
 * @desc    Get territories near coordinates
 * @access  Private
 */
router.get(
  '/nearby',
  authMiddleware.authenticate(),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController)) // TODO: implement getNearbyTerritories
);

/**
 * @route   GET /api/territories/unclaimed
 * @desc    Get unclaimed territories in area
 * @access  Private
 */
router.get(
  '/unclaimed',
  authMiddleware.authenticate(),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController)) // TODO: implement getUnclaimedTerritories
);

/**
 * @route   GET /api/territories/disputes
 * @desc    Get territory disputes (pack members or mediators)
 * @access  Private
 */
router.get(
  '/disputes',
  authMiddleware.authenticate(),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController)) // TODO: implement getTerritoryDisputes
);

/**
 * @route   GET /api/territories/:territoryId
 * @desc    Get territory by ID
 * @access  Private
 */
router.get(
  '/:territoryId',
  authMiddleware.authenticate(),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController))
);

/**
 * @route   PUT /api/territories/:territoryId
 * @desc    Update territory (Alpha only)
 * @access  Private (Alpha only)
 */
router.put(
  '/:territoryId',
  authMiddleware.authenticate(),
  authMiddleware.requireAlpha(),
  validationMiddleware.validate(updateTerritorySchema),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController)) // TODO: implement updateTerritory
);

/**
 * @route   DELETE /api/territories/:territoryId
 * @desc    Abandon territory (Alpha only)
 * @access  Private (Alpha only)
 */
router.delete(
  '/:territoryId',
  authMiddleware.authenticate(),
  authMiddleware.requireAlpha(),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController)) // TODO: implement abandonTerritory
);

/**
 * @route   POST /api/territories/:territoryId/dispute
 * @desc    File territory dispute
 * @access  Private (Pack leadership required)
 */
router.post(
  '/:territoryId/dispute',
  authMiddleware.authenticate(),
  authMiddleware.requirePackLeadership(),
  validationMiddleware.validate(disputeTerritorySchema),
  asyncHandler(territoryController.defendTerritory.bind(territoryController)) // TODO: implement fileDispute
);

/**
 * @route   POST /api/territories/:territoryId/patrol
 * @desc    Record territory patrol
 * @access  Private (Pack members only)
 */
router.post(
  '/:territoryId/patrol',
  authMiddleware.authenticate(),
  validationMiddleware.validate(patrolSchema),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController)) // TODO: implement recordPatrol
);

/**
 * @route   GET /api/territories/:territoryId/patrols
 * @desc    Get territory patrol history
 * @access  Private (Pack members only)
 */
router.get(
  '/:territoryId/patrols',
  authMiddleware.authenticate(),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController)) // TODO: implement getPatrolHistory
);

/**
 * @route   POST /api/territories/:territoryId/mark
 * @desc    Refresh territory markers
 * @access  Private (Pack members only)
 */
router.post(
  '/:territoryId/mark',
  authMiddleware.authenticate(),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController)) // TODO: implement refreshMarkers
);

/**
 * @route   GET /api/territories/:territoryId/resources
 * @desc    Get territory resources
 * @access  Private (Pack members only)  
 */
router.get(
  '/:territoryId/resources',
  authMiddleware.authenticate(),
  asyncHandler(territoryController.getTerritoryBonuses.bind(territoryController))
);

/**
 * @route   POST /api/territories/:territoryId/expand
 * @desc    Request territory expansion
 * @access  Private (Alpha only)
 */
router.post(
  '/:territoryId/expand',
  authMiddleware.authenticate(),
  authMiddleware.requireAlpha(),
  asyncHandler(territoryController.claimTerritory.bind(territoryController)) // TODO: implement requestExpansion
);

/**
 * @route   GET /api/territories/:territoryId/threats
 * @desc    Get territory threat assessment
 * @access  Private (Pack members only)
 */
router.get(
  '/:territoryId/threats',
  authMiddleware.authenticate(),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController)) // TODO: implement getThreatAssessment
);

/**
 * @route   POST /api/territories/:territoryId/alliance
 * @desc    Propose territory alliance
 * @access  Private (Alpha only)
 */
router.post(
  '/:territoryId/alliance',
  authMiddleware.authenticate(),
  authMiddleware.requireAlpha(),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController)) // TODO: implement proposeAlliance
);

/**
 * @route   GET /api/territories/:territoryId/history
 * @desc    Get territory ownership history
 * @access  Private
 */
router.get(
  '/:territoryId/history',
  authMiddleware.authenticate(),
  asyncHandler(territoryController.getTerritoryInfo.bind(territoryController))
);

/**
 * @route   POST /api/territories/:territoryId/contest
 * @desc    Contest territory claim
 * @access  Private (Pack leadership required)
 */
router.post(
  '/:territoryId/contest',
  authMiddleware.authenticate(),
  authMiddleware.requirePackLeadership(),
  asyncHandler(territoryController.defendTerritory.bind(territoryController)) // TODO: implement contestClaim
);

export default router;