import { 
  $Enums,
  Profile, 
  Game, 
  Player, 
  GameLog, 
  Prisma 
} from '../generated/prisma';

export type GameStatus = $Enums.GameStatus;
export type GamePhase = $Enums.GamePhase;

// Base entity types (direct from Prisma)
export type { Profile as User, Game, Player, GameLog };

// User related types
export type UserCreateInput = Prisma.ProfileCreateInput;
export type UserUpdateInput = Prisma.ProfileUpdateInput;
export type UserWhereInput = Prisma.ProfileWhereInput;
export type UserWithStats = Profile;

export interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
}

export interface UserCreateData {
  username: string;
  email: string;
  passwordHash: string;
}

export interface UserLoginData {
  username: string;
  password: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  createdAt: Date;
  lastLogin: Date | null;
}

// Game related types
export type GameCreateInput = Prisma.GameCreateInput;
export type GameUpdateInput = Prisma.GameUpdateInput;
export type GameWhereInput = Prisma.GameWhereInput;

export interface GameCreateData {
  name: string;
  maxPlayers?: number;
  gameSettings?: GameSettingsType;
  creatorId: string;
}

export interface GameSettingsType {
  roles: {
    werewolf: number;
    villager: number;
    seer?: number;
    doctor?: number;
    hunter?: number;
  };
  timing: {
    dayPhaseSeconds: number;
    nightPhaseSeconds: number;
    votingSeconds: number;
  };
  rules: {
    allowSpectators: boolean;
    revealRolesOnDeath: boolean;
    enableChat: boolean;
  };
}

export interface GameWithDetails extends Game {
  creator: Profile;
  players: PlayerWithUser[];
  _count: {
    players: number;
  };
}

// Player related types
export type PlayerCreateInput = Prisma.PlayerCreateInput;
export type PlayerUpdateInput = Prisma.PlayerUpdateInput;
export type PlayerWhereInput = Prisma.PlayerWhereInput;

export interface PlayerWithUser extends Player {
  user: Profile;
}

export interface PlayerWithGame extends Player {
  game: Game;
  user: Profile;
}

export interface GameJoinData {
  gameCode: string;
  userId: string;
}

// GameLog related types
export type GameLogCreateInput = Prisma.GameLogCreateInput;
export type GameLogUpdateInput = Prisma.GameLogUpdateInput;
export type GameLogWhereInput = Prisma.GameLogWhereInput;

export interface GameLogWithDetails extends GameLog {
  game: {
    id: string;
    name: string;
    code: string;
  };
  actor?: {
    id: string;
    username: string;
  } | null;
}

export interface GameLogCreateData {
  gameId: string;
  roundNumber: number;
  phase: GamePhase;
  actionType: string;
  actorId?: string | null;
  targetId?: string | null;
  details?: any;
}

// Common query options
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface GameFilters {
  status?: GameStatus;
  creatorId?: string;
  hasSlots?: boolean;
}

export interface UserFilters {
  isActive?: boolean;
  minGamesPlayed?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Game action types
export type GameActionType = 
  | 'VOTE'
  | 'WEREWOLF_KILL'
  | 'SEER_CHECK'
  | 'DOCTOR_HEAL'
  | 'HUNTER_SHOT'
  | 'PLAYER_ELIMINATED'
  | 'GAME_START'
  | 'GAME_END'
  | 'PHASE_CHANGE'
  | 'PLAYER_JOIN'
  | 'PLAYER_LEAVE';

// Role types
export type GameRole = 
  | 'villager'
  | 'werewolf'
  | 'seer'
  | 'doctor'
  | 'hunter'
  | 'mayor'
  | 'witch';

// Error types
export class DatabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id?: string) {
    super(`${resource}${id ? ` with id ${id}` : ''} not found`);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}