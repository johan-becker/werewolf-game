/**
 * Pack Management Routes
 * Werewolf pack creation, management, and hierarchy endpoints
 */

import { Router } from 'express';
import { container } from '../container/container';
import { TYPES } from '../container/types';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ValidationMiddleware } from '../middleware/validation.middleware';
import { EnhancedErrorMiddleware } from '../middleware/enhanced-error.middleware';
import { PackController } from '../controllers/pack.controller';
import { WerewolfRole } from '../types/werewolf-user.types';
import { z } from 'zod';

const router = Router();

// Get middleware and controller instances
const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
const validationMiddleware = container.get<ValidationMiddleware>(TYPES.ValidationMiddleware);
const errorMiddleware = container.get<EnhancedErrorMiddleware>(TYPES.EnhancedErrorMiddleware);
const packController = container.get<PackController>(TYPES.PackController);

// Wrap async handlers
const asyncHandler = errorMiddleware.asyncHandler.bind(errorMiddleware);

// Validation schemas
const createPackSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50),
    description: z.string().max(500).optional(),
    isPrivate: z.boolean().default(false),
    maxMembers: z.number().min(3).max(20).default(12),
    requirements: z.object({
      minLevel: z.number().min(1).default(1),
      minReputation: z.number().default(0),
      requiredRoles: z.array(z.nativeEnum(WerewolfRole)).optional()
    }).optional()
  })
});

const joinPackSchema = z.object({
  body: z.object({
    message: z.string().max(200).optional()
  })
});

const updatePackSchema = z.object({
  body: z.object({
    name: z.string().min(3).max(50).optional(),
    description: z.string().max(500).optional(),
    isPrivate: z.boolean().optional(),
    maxMembers: z.number().min(3).max(20).optional(),
    requirements: z.object({
      minLevel: z.number().min(1).optional(),
      minReputation: z.number().optional(),
      requiredRoles: z.array(z.nativeEnum(WerewolfRole)).optional()
    }).optional()
  })
});

const assignRoleSchema = z.object({
  body: z.object({
    role: z.nativeEnum(WerewolfRole)
  })
});

/**
 * @route   GET /api/packs
 * @desc    Get all public packs or user's packs
 * @access  Private
 */
router.get(
  '/',
  authMiddleware.authenticate(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement getPacks
);

/**
 * @route   POST /api/packs
 * @desc    Create new pack
 * @access  Private
 */
router.post(
  '/',
  authMiddleware.authenticate(),
  validationMiddleware.validate(createPackSchema),
  asyncHandler(packController.createPack.bind(packController))
);

/**
 * @route   GET /api/packs/my-pack
 * @desc    Get current user's pack
 * @access  Private
 */
router.get(
  '/my-pack',
  authMiddleware.authenticate(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement getMyPack
);

/**
 * @route   GET /api/packs/search
 * @desc    Search packs
 * @access  Private
 */
router.get(
  '/search',
  authMiddleware.authenticate(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement searchPacks
);

/**
 * @route   GET /api/packs/:packId
 * @desc    Get pack by ID
 * @access  Private
 */
router.get(
  '/:packId',
  authMiddleware.authenticate(),
  asyncHandler(packController.getPackInfo.bind(packController))
);

/**
 * @route   PUT /api/packs/:packId
 * @desc    Update pack (Alpha only)
 * @access  Private (Alpha only)
 */
router.put(
  '/:packId',
  authMiddleware.authenticate(),
  authMiddleware.requireAlpha(),
  validationMiddleware.validate(updatePackSchema),
  asyncHandler(packController.updatePackHierarchy.bind(packController)) // TODO: implement updatePack
);

/**
 * @route   DELETE /api/packs/:packId
 * @desc    Disband pack (Alpha only)
 * @access  Private (Alpha only)
 */
router.delete(
  '/:packId',
  authMiddleware.authenticate(),
  authMiddleware.requireAlpha(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement disbandPack
);

/**
 * @route   POST /api/packs/:packId/join
 * @desc    Request to join pack
 * @access  Private
 */
router.post(
  '/:packId/join',
  authMiddleware.authenticate(),
  validationMiddleware.validate(joinPackSchema),
  asyncHandler(packController.joinPack.bind(packController))
);

/**
 * @route   POST /api/packs/:packId/leave
 * @desc    Leave pack
 * @access  Private
 */
router.post(
  '/:packId/leave',
  authMiddleware.authenticate(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement leavePack
);

/**
 * @route   GET /api/packs/:packId/members
 * @desc    Get pack members
 * @access  Private (Pack members only)
 */
router.get(
  '/:packId/members',
  authMiddleware.authenticate(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement getPackMembers
);

/**
 * @route   POST /api/packs/:packId/members/:userId/approve
 * @desc    Approve join request
 * @access  Private (Alpha/Beta only)
 */
router.post(
  '/:packId/members/:userId/approve',
  authMiddleware.authenticate(),
  authMiddleware.requirePackLeadership(),
  asyncHandler(packController.joinPack.bind(packController)) // TODO: implement approveJoinRequest
);

/**
 * @route   POST /api/packs/:packId/members/:userId/reject
 * @desc    Reject join request
 * @access  Private (Alpha/Beta only)
 */
router.post(
  '/:packId/members/:userId/reject',
  authMiddleware.authenticate(),
  authMiddleware.requirePackLeadership(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement rejectJoinRequest
);

/**
 * @route   PUT /api/packs/:packId/members/:userId/role
 * @desc    Assign role to pack member
 * @access  Private (Alpha only)
 */
router.put(
  '/:packId/members/:userId/role',
  authMiddleware.authenticate(),
  authMiddleware.requireAlpha(),
  validationMiddleware.validate(assignRoleSchema),
  asyncHandler(packController.updatePackHierarchy.bind(packController))
);

/**
 * @route   DELETE /api/packs/:packId/members/:userId
 * @desc    Remove member from pack
 * @access  Private (Alpha/Beta only)
 */
router.delete(
  '/:packId/members/:userId',
  authMiddleware.authenticate(),
  authMiddleware.requirePackLeadership(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement removeMember
);

/**
 * @route   POST /api/packs/:packId/challenge
 * @desc    Challenge pack alpha
 * @access  Private (Pack members only)
 */
router.post(
  '/:packId/challenge',
  authMiddleware.authenticate(),
  asyncHandler(packController.updatePackHierarchy.bind(packController)) // TODO: implement challengeAlpha
);

/**
 * @route   GET /api/packs/:packId/territories
 * @desc    Get pack territories
 * @access  Private (Pack members only)
 */
router.get(
  '/:packId/territories',
  authMiddleware.authenticate(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement getPackTerritories
);

/**
 * @route   GET /api/packs/:packId/activities
 * @desc    Get pack activity log
 * @access  Private (Pack members only)
 */
router.get(
  '/:packId/activities',
  authMiddleware.authenticate(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement getPackActivity
);

/**
 * @route   POST /api/packs/:packId/hunt
 * @desc    Organize pack hunt
 * @access  Private (Alpha/Beta only)
 */
router.post(
  '/:packId/hunt',
  authMiddleware.authenticate(),
  authMiddleware.requirePackLeadership(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement organizeHunt
);

/**
 * @route   GET /api/packs/:packId/statistics
 * @desc    Get pack statistics
 * @access  Private (Pack members only)
 */
router.get(
  '/:packId/statistics',
  authMiddleware.authenticate(),
  asyncHandler(packController.getPackInfo.bind(packController)) // TODO: implement getPackStatistics
);

export default router;