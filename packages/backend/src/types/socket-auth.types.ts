/**
 * Socket Authentication State Management Types
 * Implements state machine pattern for secure socket connections
 */

import { Socket } from 'socket.io';
import { AuthenticatedUser } from './auth.types';
import { ActionType } from './werewolf-roles.types';

// Socket Authentication State Machine
export enum SocketAuthenticationState {
  PENDING = 'PENDING',       // Initial state - awaiting authentication
  AUTHENTICATED = 'AUTHENTICATED', // Successfully authenticated
  REJECTED = 'REJECTED'      // Authentication failed or timeout
}

// Enhanced socket interface with authentication state
export interface AuthenticatedSocket extends Socket {
  data: {
    // Authentication state
    authState: SocketAuthenticationState;
    user?: AuthenticatedUser;
    sessionId?: string;
    
    // Connection metadata
    connectedAt: Date;
    lastActivityAt: Date;
    authenticatedAt?: Date;
    
    // Game context
    currentGame?: string;
    roomId?: string;
    
    // Message queue for pending authentication
    messageQueue: QueuedMessage[];
    
    // Timeout handling
    authTimeoutId?: NodeJS.Timeout;
  };
}

// Queued message structure for pending authentication
export interface QueuedMessage {
  id: string;
  event: string;
  data: any;
  timestamp: Date;
  callback?: (response: any) => void;
}

// Authentication result for socket connections
export interface SocketAuthResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: {
    code: SocketAuthErrorCode;
    message: string;
    canRetry: boolean;
  };
  metadata?: {
    sessionId: string;
    authenticatedAt: Date;
    expiresAt: Date;
  };
}

// Socket authentication error codes
export enum SocketAuthErrorCode {
  NO_TOKEN = 'NO_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_SUSPENDED = 'USER_SUSPENDED',
  AUTHENTICATION_TIMEOUT = 'AUTHENTICATION_TIMEOUT',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVER_ERROR = 'SERVER_ERROR'
}

// Typed socket event interfaces that require authenticated user context
export interface AuthenticatedSocketEvents {
  // Game management events
  'game:create': (data: GameCreateData, callback: (response: GameResponse) => void) => void;
  'game:join': (data: GameJoinData, callback: (response: GameResponse) => void) => void;
  'game:leave': (data: GameLeaveData, callback: (response: GameResponse) => void) => void;
  'game:start': (data: GameStartData, callback: (response: GameResponse) => void) => void;
  'game:getState': (callback: (response: GameStateResponse) => void) => void;
  
  // Game action events
  'game:nightAction': (data: NightActionData, callback: (response: ActionResponse) => void) => void;
  'game:vote': (data: VoteData, callback: (response: VoteResponse) => void) => void;
  'game:chat': (data: ChatData, callback: (response: ChatResponse) => void) => void;
  
  // Real-time game events (server-to-client)
  'game:playerJoined': (data: PlayerJoinedData) => void;
  'game:playerLeft': (data: PlayerLeftData) => void;
  'game:gameStarted': (data: GameStartedData) => void;
  'game:phaseChanged': (data: PhaseChangedData) => void;
  'game:actionRequired': (data: ActionRequiredData) => void;
  'game:actionResult': (data: ActionResultData) => void;
  'game:chatMessage': (data: ChatMessageData) => void;
  
  // Authentication events
  'auth:challenge': (callback: (response: AuthChallengeResponse) => void) => void;
  'auth:authenticate': (data: AuthenticateData, callback: (response: SocketAuthResult) => void) => void;
  'auth:refresh': (data: RefreshTokenData, callback: (response: SocketAuthResult) => void) => void;
  'auth:logout': (callback: (response: { success: boolean }) => void) => void;
  
  // Connection management
  'connection:heartbeat': (callback: (response: HeartbeatResponse) => void) => void;
  'connection:status': (callback: (response: ConnectionStatusResponse) => void) => void;
  
  // Error handling
  'error': (data: SocketErrorData) => void;
  'auth:error': (data: AuthErrorData) => void;
  'auth:timeout': (data: AuthTimeoutData) => void;
}

// Event data interfaces with mandatory user context
export interface GameCreateData {
  name?: string;
  maxPlayers: number;
  isPrivate: boolean;
  settings?: GameSettings;
}

export interface GameJoinData {
  gameId?: string;
  gameCode?: string;
}

export interface GameLeaveData {
  gameId: string;
  reason?: string;
}

export interface GameStartData {
  gameId: string;
  roleConfig?: RoleConfiguration;
}

export interface NightActionData {
  gameId: string;
  action: ActionType;
  targetId?: string;
  secondTargetId?: string;
}

export interface VoteData {
  gameId: string;
  targetId: string;
  voteType: 'eliminate' | 'mayor';
}

export interface ChatData {
  gameId: string;
  message: string;
  channel: ChatChannel;
  mentions?: string[];
}

// Response interfaces with user context validation
export interface GameResponse {
  success: boolean;
  data?: {
    gameId: string;
    gameCode?: string;
    status: string;
    playerCount: number;
    userRole?: string;
    isHost: boolean;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface GameStateResponse {
  success: boolean;
  data?: {
    gameId: string;
    phase: string;
    dayNumber: number;
    timeRemaining?: number;
    players: PlayerInfo[];
    userState: UserGameState;
    availableActions: ActionType[];
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface ActionResponse {
  success: boolean;
  data?: {
    actionType: ActionType;
    result: string;
    effects?: ActionEffects;
    nextAction?: ActionType;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface VoteResponse {
  success: boolean;
  data?: {
    voteCount: number;
    totalVotes: number;
    timeRemaining?: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface ChatResponse {
  success: boolean;
  data?: {
    messageId: string;
    timestamp: Date;
    channel: ChatChannel;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Authentication-specific interfaces
export interface AuthChallengeResponse {
  challenge: string;
  methods: AuthMethod[];
  timeout: number; // seconds
}

export interface AuthenticateData {
  token: string;
  method: AuthMethod;
  deviceId?: string;
  clientInfo?: ClientInfo;
}

export interface RefreshTokenData {
  refreshToken: string;
  deviceId?: string;
}

export interface HeartbeatResponse {
  timestamp: Date;
  serverTime: Date;
  latency: number;
}

export interface ConnectionStatusResponse {
  authState: SocketAuthenticationState;
  connectedAt: Date;
  lastActivity: Date;
  gameId?: string;
  roomId?: string;
}

// Real-time event data interfaces
export interface PlayerJoinedData {
  gameId: string;
  player: {
    id: string;
    username: string;
    isHost: boolean;
  };
  playerCount: number;
}

export interface PlayerLeftData {
  gameId: string;
  playerId: string;
  username: string;
  reason?: string;
  newHost?: string;
  playerCount: number;
}

export interface GameStartedData {
  gameId: string;
  phase: string;
  dayNumber: number;
  playerCount: number;
  userRole: string;
  roleDescription: string;
  teammates?: string[];
}

export interface PhaseChangedData {
  gameId: string;
  phase: string;
  dayNumber: number;
  timeRemaining?: number;
  availableActions: ActionType[];
  phaseMessage: string;
}

export interface ActionRequiredData {
  gameId: string;
  actionType: ActionType;
  timeLimit?: number;
  targets?: string[];
  message: string;
}

export interface ActionResultData {
  gameId: string;
  phase: string;
  results: {
    deaths: string[];
    protected: string[];
    investigated?: {
      target: string;
      result: 'village' | 'werewolf';
      revealed?: boolean;
    };
  };
  nextPhase?: string;
  message: string;
}

export interface ChatMessageData {
  gameId: string;
  messageId: string;
  playerId: string;
  username: string;
  message: string;
  channel: ChatChannel;
  timestamp: Date;
  mentions?: string[];
  isSystemMessage: boolean;
}

// Error interfaces
export interface SocketErrorData {
  code: string;
  message: string;
  event?: string;
  timestamp: Date;
  canRetry: boolean;
}

export interface AuthErrorData {
  code: SocketAuthErrorCode;
  message: string;
  canRetry: boolean;
  retryAfter?: number;
  timestamp: Date;
}

export interface AuthTimeoutData {
  message: string;
  timeoutDuration: number;
  canReconnect: boolean;
  timestamp: Date;
}

// Supporting types
export interface GameSettings {
  timeLimit?: number;
  allowSpectators: boolean;
  enableChat: boolean;
  autoStart: boolean;
}

export interface RoleConfiguration {
  villagers: number;
  werewolves: number;
  seer: boolean;
  witch: boolean;
  hunter: boolean;
  cupid: boolean;
  littleGirl: boolean;
}

export interface PlayerInfo {
  id: string;
  username: string;
  isAlive: boolean;
  isHost: boolean;
  hasVoted?: boolean;
  role?: string; // Only revealed if appropriate
}

export interface UserGameState {
  role: string;
  team: string;
  isAlive: boolean;
  canVote: boolean;
  hasVoted: boolean;
  specialStates?: {
    hasHealPotion?: boolean;
    hasPoisonPotion?: boolean;
    canShoot?: boolean;
    isProtected?: boolean;
  };
}

export interface ActionEffects {
  deaths: string[];
  protected: string[];
  lovers: string[];
  revealed: string[];
}

export interface ClientInfo {
  userAgent: string;
  platform: string;
  version: string;
  features: string[];
}

export enum AuthMethod {
  JWT_TOKEN = 'JWT_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  SESSION_COOKIE = 'SESSION_COOKIE'
}

export enum ChatChannel {
  LOBBY = 'LOBBY',
  DAY = 'DAY',
  NIGHT = 'NIGHT',
  WEREWOLF = 'WEREWOLF',
  DEAD = 'DEAD',
  SYSTEM = 'SYSTEM'
}

// State machine transition validation
export interface SocketStateTransition {
  from: SocketAuthenticationState;
  to: SocketAuthenticationState;
  trigger: SocketStateTrigger;
  conditions?: StateTransitionCondition[];
}

export enum SocketStateTrigger {
  CONNECTION_ESTABLISHED = 'CONNECTION_ESTABLISHED',
  AUTHENTICATION_REQUESTED = 'AUTHENTICATION_REQUESTED',
  AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS',
  AUTHENTICATION_FAILURE = 'AUTHENTICATION_FAILURE',
  AUTHENTICATION_TIMEOUT = 'AUTHENTICATION_TIMEOUT',
  MANUAL_DISCONNECT = 'MANUAL_DISCONNECT',
  CONNECTION_ERROR = 'CONNECTION_ERROR'
}

export interface StateTransitionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'exists' | 'not_exists';
  value?: any;
}

// Message queue management
export interface MessageQueueConfig {
  maxQueueSize: number;
  maxMessageAge: number; // milliseconds
  queueProcessingInterval: number; // milliseconds
  priorityOrder: string[]; // event names in priority order
}

// Connection security configuration
export interface SocketSecurityConfig {
  authenticationTimeout: number; // milliseconds
  maxConnectionsPerIP: number;
  maxConnectionsPerUser: number;
  rateLimitWindow: number; // milliseconds
  rateLimitMaxRequests: number;
  enableHeartbeat: boolean;
  heartbeatInterval: number; // milliseconds
  heartbeatTimeout: number; // milliseconds
}