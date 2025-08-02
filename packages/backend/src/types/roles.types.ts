import { ActionType } from './werewolf-roles.types';

// Re-export ActionType for compatibility
export type { ActionType } from './werewolf-roles.types';

export enum PlayerRole {
  VILLAGER = 'VILLAGER',
  WEREWOLF = 'WEREWOLF', 
  SEER = 'SEER',
  WITCH = 'WITCH',
  HUNTER = 'HUNTER',
  CUPID = 'CUPID'
}

export enum WinCondition {
  VILLAGERS_WIN = 'VILLAGERS_WIN',    // Alle Werwölfe eliminiert
  WEREWOLVES_WIN = 'WEREWOLVES_WIN',  // Werwölfe kontrollieren das Dorf
  LOVERS_WIN = 'LOVERS_WIN'           // Liebespaar überlebt als einziges
}

export interface NightAction {
  actionType: ActionType;
  actorId: string;
  targetId?: string;
  secondTargetId?: string; // Für Cupid (zwei Ziele)
  timestamp: Date;
  resolved: boolean;
}

export interface RoleAbility {
  name: string;
  description: string;
  canUseAtNight: boolean;
  canUseAtDay: boolean;
  usesPerGame?: number; // undefined = unlimited
  usesRemaining?: number;
}

export interface BaseRole {
  role: PlayerRole;
  team: 'VILLAGE' | 'WEREWOLF' | 'LOVERS';
  abilities: RoleAbility[];
  winConditions: WinCondition[];
  canVote: boolean;
  isRevealed: boolean; // Ob die Rolle öffentlich bekannt ist
}

export interface PlayerState {
  userId: string;
  role: PlayerRole;
  team: 'VILLAGE' | 'WEREWOLF' | 'LOVERS';
  isAlive: boolean;
  isHost: boolean;
  abilities: RoleAbility[];
  specialStates: {
    // Hexe
    hasHealPotion?: boolean;
    hasPoisonPotion?: boolean;
    
    // Jäger  
    canRevenge?: boolean;
    
    // Liebespaar
    loverId?: string;
    
    // Allgemein
    isProtected?: boolean; // Schutz vor Tod in dieser Nacht
    votesReceived?: number;
  };
  actionHistory: NightAction[];
}

export interface GamePhaseState {
  phase: 'DAY' | 'NIGHT';
  dayNumber: number;
  timeRemaining?: number;
  activeRole?: PlayerRole; // Welche Rolle gerade aktiv ist (nachts)
  pendingActions: NightAction[];
  votingResults?: {
    targetId: string;
    votes: Array<{
      voterId: string;
      targetId: string;
    }>;
  };
}

// Rollen-spezifische Definitionen
export interface VillagerRole extends BaseRole {
  role: PlayerRole.VILLAGER;
  team: 'VILLAGE';
}

export interface WerewolfRole extends BaseRole {
  role: PlayerRole.WEREWOLF;
  team: 'WEREWOLF';
}

export interface SeerRole extends BaseRole {
  role: PlayerRole.SEER;
  team: 'VILLAGE';
}

export interface WitchRole extends BaseRole {
  role: PlayerRole.WITCH;
  team: 'VILLAGE';
}

export interface HunterRole extends BaseRole {
  role: PlayerRole.HUNTER;
  team: 'VILLAGE';
}

export interface CupidRole extends BaseRole {
  role: PlayerRole.CUPID;
  team: 'VILLAGE';
}

// Action Results
export interface ActionResult {
  success: boolean;
  message: string;
  revealedInfo?: {
    targetId: string;
    role?: PlayerRole;
    isWerewolf?: boolean;
  };
  effects?: {
    deaths?: string[];
    protections?: string[];
    revelations?: Array<{
      playerId: string;
      info: string;
    }>;
  };
}

// Game Results
export interface GameResult {
  winner: WinCondition;
  survivors: string[];
  gameStats: {
    totalDays: number;
    totalDeaths: number;
    actionsPerformed: number;
  };
}