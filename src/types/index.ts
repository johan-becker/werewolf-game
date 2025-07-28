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
  team: Team;
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

export enum Team {
  VILLAGERS = 'villagers',
  WEREWOLVES = 'werewolves',
  NEUTRAL = 'neutral',
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
  actionType: ActionType;
  targetId?: string;
  phase: GamePhase;
  day: number;
  createdAt: Date;
}

export enum ActionType {
  VOTE = 'vote',
  KILL = 'kill',
  HEAL = 'heal',
  INVESTIGATE = 'investigate',
  SHOOT = 'shoot',
  POISON = 'poison',
  ANTIDOTE = 'antidote',
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