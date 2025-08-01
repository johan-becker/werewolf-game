/**
 * Centralized type exports to prevent import confusion
 * All ActionType references should use the canonical werewolf-roles.types.ts definition
 */

// Import canonical ActionType for internal use
import { ActionType as CanonicalActionType } from './werewolf-roles.types';

// Re-export canonical ActionType from werewolf-roles.types.ts
export { ActionType } from './werewolf-roles.types';

// Re-export other commonly used types
export { 
  WerewolfRole, 
  Team, 
  WinCondition, 
  NightPhase,
  NightAction,
  ActionResult,
  WerewolfPlayer,
  WerewolfGameState,
  GameRoleConfig
} from './werewolf-roles.types';

export { 
  PlayerRole, 
  WinCondition as LegacyWinCondition,
  NightAction as LegacyNightAction,
  RoleAbility,
  BaseRole
} from './roles.types';

// Legacy types for backward compatibility
export interface Player {
  id: string;
  username: string;
  email: string;
  socketId?: string;
  isAlive: boolean;
  role?: Role;
  gameId?: string;
  votedFor?: string;
  hasVoted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Game {
  id: string;
  name: string;
  status: GameStatus;
  phase: GamePhase;
  players: Player[];
  maxPlayers: number;
  minPlayers: number;
  currentDay: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Role {
  id: string;
  name: RoleName;
  team: 'VILLAGERS' | 'WEREWOLVES' | 'NEUTRAL';
  description: string;
  abilities: string[];
}

export enum GameStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
}

export enum GamePhase {
  DAY = 'day',
  NIGHT = 'night',
  VOTING = 'voting',
  RESULTS = 'results',
}

export enum RoleName {
  VILLAGER = 'villager',
  WEREWOLF = 'werewolf',
  SEER = 'seer',
  DOCTOR = 'doctor',
  HUNTER = 'hunter',
  WITCH = 'witch',
  MAYOR = 'mayor',
}

export interface GameAction {
  id: string;
  gameId: string;
  playerId: string;
  actionType: CanonicalActionType; // Now uses canonical ActionType from werewolf-roles.types.ts
  targetId?: string;
  phase: GamePhase;
  day: number;
  createdAt: Date;
}

export interface SocketEvents {
  connection: () => void;
  disconnect: () => void;
  joinGame: (gameId: string) => void;
  leaveGame: (gameId: string) => void;
  startGame: (gameId: string) => void;
  performAction: (action: Omit<GameAction, 'id' | 'createdAt'>) => void;
  sendMessage: (message: ChatMessage) => void;
}

export interface ChatMessage {
  id: string;
  gameId: string;
  playerId: string;
  message: string;
  type: MessageType;
  createdAt: Date;
}

export enum MessageType {
  PUBLIC = 'public',
  WEREWOLF = 'werewolf',
  DEAD = 'dead',
  SYSTEM = 'system',
}

// Type aliases for common patterns to prevent import confusion
// Note: These reference the canonical ActionType from werewolf-roles.types.ts
export type GameActionType = CanonicalActionType;
export type WerewolfActionType = CanonicalActionType;
export type RoleActionType = CanonicalActionType;

/**
 * IMPORTANT: Always import ActionType from this centralized index or directly from werewolf-roles.types.ts
 * 
 * ✅ Correct imports:
 * import { ActionType } from '../types';
 * import { ActionType } from '../types/werewolf-roles.types';
 * 
 * ❌ Avoid these imports:
 * import { ActionType } from '../types/roles.types'; // ActionType removed from this file
 */