/**
 * Werewolf User System Types
 * Extended user types with werewolf-themed roles and capabilities
 */

import { z } from 'zod';

// Werewolf Role Hierarchy
export enum WerewolfRole {
  // Leadership Roles
  ALPHA = 'ALPHA', // Pack leader - highest authority
  BETA = 'BETA', // Second in command - trusted lieutenant

  // Specialized Roles
  OMEGA = 'OMEGA', // Pack peace keeper - conflict resolver
  HUNTER = 'HUNTER', // Skilled tracker and warrior
  HEALER = 'HEALER', // Pack medic and herbalist
  SCOUT = 'SCOUT', // Territory explorer and messenger
  GUARDIAN = 'GUARDIAN', // Pack protector and defender

  // Standard Roles
  PACK_MEMBER = 'PACK_MEMBER', // Regular pack member
  LONE_WOLF = 'LONE_WOLF', // Independent werewolf

  // Special Status
  CUB = 'CUB', // Young werewolf in training
  ELDER = 'ELDER', // Retired pack member with wisdom

  // Human Roles (for mixed gameplay)
  HUMAN = 'HUMAN', // Unaware human
  HUNTER_HUMAN = 'HUNTER_HUMAN', // Human werewolf hunter
}

// Pack Status
export enum PackStatus {
  ALPHA = 'ALPHA', // Leading a pack
  MEMBER = 'MEMBER', // Part of a pack
  BETA = 'BETA', // Second in command
  OMEGA = 'OMEGA', // Special pack role
  LONE = 'LONE', // No pack affiliation
  EXILE = 'EXILE', // Banished from pack
  CHALLENGER = 'CHALLENGER', // Challenging current alpha
}

// Transformation State
export enum TransformationState {
  HUMAN = 'HUMAN', // Human form
  PARTIAL = 'PARTIAL', // Partial transformation
  WOLF = 'WOLF', // Full wolf form
  HYBRID = 'HYBRID', // Human-wolf hybrid
  LOCKED_HUMAN = 'LOCKED_HUMAN', // Cannot transform
  LOCKED_WOLF = 'LOCKED_WOLF', // Stuck in wolf form
}

// User Abilities based on role and experience
export interface WerewolfAbilities {
  // Physical Abilities
  strength: number; // 1-10 scale
  speed: number; // 1-10 scale
  endurance: number; // 1-10 scale
  senses: number; // Enhanced hearing/smell/sight

  // Leadership Abilities (mainly for Alpha/Beta)
  leadership: number; // Ability to command pack
  intimidation: number; // Fear factor
  diplomacy: number; // Negotiation skills

  // Specialized Skills
  tracking: number; // Following scents/trails
  healing: number; // Medical knowledge
  stealth: number; // Staying hidden
  territory_knowledge: number; // Understanding of lands

  // Supernatural Abilities
  transformation_control: number; // Control over shifting
  moon_resistance: number; // Resist forced transformation
  silver_tolerance: number; // Resistance to silver
  pack_bond_strength: number; // Connection to pack members
}

// Territory Control
export interface TerritoryInfo {
  controlled_territories: string[]; // Territory IDs
  claimed_at: Date;
  last_patrol: Date;
  territory_disputes: string[]; // Active dispute IDs
  boundary_markers: {
    latitude: number;
    longitude: number;
    marker_type: 'scent' | 'physical' | 'spiritual';
  }[];
}

// Pack Information
export interface PackInfo {
  pack_id: string;
  pack_name: string;
  role_in_pack: PackStatus;
  joined_at: Date;
  loyalty_score: number; // 1-100 scale
  challenges_won: number;
  challenges_lost: number;
  last_challenge: Date | null;
}

// Werewolf User Profile
export interface WerewolfUserProfile {
  // Base Information
  id: string;
  username: string;
  email: string;
  full_name?: string;

  // Werewolf-specific Information
  werewolf_role: WerewolfRole;
  transformation_state: TransformationState;
  abilities: WerewolfAbilities;

  // Pack Information
  pack_info: PackInfo | null;

  // Territory Information
  territory_info: TerritoryInfo | null;

  // Status Information
  is_active: boolean;
  last_transformation: Date | null;
  next_forced_transformation: Date | null; // During full moon
  transformation_cooldown_until: Date | null;

  // Experience and Progression
  level: number;
  experience_points: number;
  reputation: number; // Community standing

  // Relationships
  allies: string[]; // User IDs of allies
  enemies: string[]; // User IDs of enemies
  mentors: string[]; // User IDs of mentors
  apprentices: string[]; // User IDs being mentored

  // Game Statistics
  games_played: number;
  games_won: number;
  total_eliminations: number;
  survival_rate: number;

  // Metadata
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
  last_activity: Date | null;
}

// Validation Schemas
export const WerewolfRoleSchema = z.nativeEnum(WerewolfRole);
export const PackStatusSchema = z.nativeEnum(PackStatus);
export const TransformationStateSchema = z.nativeEnum(TransformationState);

export const WerewolfAbilitiesSchema = z.object({
  strength: z.number().min(1).max(10),
  speed: z.number().min(1).max(10),
  endurance: z.number().min(1).max(10),
  senses: z.number().min(1).max(10),
  leadership: z.number().min(1).max(10),
  intimidation: z.number().min(1).max(10),
  diplomacy: z.number().min(1).max(10),
  tracking: z.number().min(1).max(10),
  healing: z.number().min(1).max(10),
  stealth: z.number().min(1).max(10),
  territory_knowledge: z.number().min(1).max(10),
  transformation_control: z.number().min(1).max(10),
  moon_resistance: z.number().min(1).max(10),
  silver_tolerance: z.number().min(1).max(10),
  pack_bond_strength: z.number().min(1).max(10),
});

export const TerritoryInfoSchema = z.object({
  controlled_territories: z.array(z.string()),
  claimed_at: z.date(),
  last_patrol: z.date(),
  territory_disputes: z.array(z.string()),
  boundary_markers: z.array(
    z.object({
      latitude: z.number(),
      longitude: z.number(),
      marker_type: z.enum(['scent', 'physical', 'spiritual']),
    })
  ),
});

export const PackInfoSchema = z.object({
  pack_id: z.string(),
  pack_name: z.string(),
  role_in_pack: PackStatusSchema,
  joined_at: z.date(),
  loyalty_score: z.number().min(1).max(100),
  challenges_won: z.number().min(0),
  challenges_lost: z.number().min(0),
  last_challenge: z.date().nullable(),
});

export const WerewolfUserProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  full_name: z.string().optional(),
  werewolf_role: WerewolfRoleSchema,
  transformation_state: TransformationStateSchema,
  abilities: WerewolfAbilitiesSchema,
  pack_info: PackInfoSchema.nullable(),
  territory_info: TerritoryInfoSchema.nullable(),
  is_active: z.boolean(),
  last_transformation: z.date().nullable(),
  next_forced_transformation: z.date().nullable(),
  transformation_cooldown_until: z.date().nullable(),
  level: z.number().min(1),
  experience_points: z.number().min(0),
  reputation: z.number(),
  allies: z.array(z.string()),
  enemies: z.array(z.string()),
  mentors: z.array(z.string()),
  apprentices: z.array(z.string()),
  games_played: z.number().min(0),
  games_won: z.number().min(0),
  total_eliminations: z.number().min(0),
  survival_rate: z.number().min(0).max(100),
  created_at: z.date(),
  updated_at: z.date(),
  last_login: z.date().nullable(),
  last_activity: z.date().nullable(),
});

// API Request/Response Types
export const CreateUserRequestSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  full_name: z.string().optional(),
  preferred_role: WerewolfRoleSchema.optional(),
});

export const UpdateUserRequestSchema = z
  .object({
    full_name: z.string().optional(),
    werewolf_role: WerewolfRoleSchema.optional(),
    abilities: WerewolfAbilitiesSchema.partial().optional(),
  })
  .partial();

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const TransformationRequestSchema = z.object({
  target_state: TransformationStateSchema,
  forced: z.boolean().default(false),
});

export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type TransformationRequest = z.infer<typeof TransformationRequestSchema>;
