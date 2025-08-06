import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  userId: string;
  username: string;
  currentGame?: string;
}

export interface SocketError {
  code: string;
  message: string;
}

// Client to Server Events
export interface ClientToServerEvents {
  // Connection management
  ping: (callback?: () => void) => void;
  'connection:test': (callback: (response: any) => void) => void;
  reconnect: () => void;

  // Lobby events
  'lobby:join': () => void;
  'lobby:leave': () => void;
  'lobby:list': (callback: (response: any) => void) => void;

  // Game management
  'game:create': (
    data: { maxPlayers?: number; isPrivate?: boolean },
    callback: (response: any) => void
  ) => void;
  'game:join': (data: { gameId: string }, callback: (response: any) => void) => void;
  'game:joinByCode': (data: { code: string }, callback: (response: any) => void) => void;
  'game:leave': (data: { gameId: string }, callback: (response: any) => void) => void;
  'game:start': (data: { gameId: string }, callback: (response: any) => void) => void;
  'game:end': (callback: (response: any) => void) => void;
  'game:pause': (callback: (response: any) => void) => void;
  'game:resume': (callback: (response: any) => void) => void;

  // Role-based actions
  'game:nightAction': (
    data: {
      actionType: string;
      targetId?: string;
      secondTargetId?: string;
    },
    callback: (response: any) => void
  ) => void;
  'game:vote': (data: { targetId: string }, callback: (response: any) => void) => void;
  'game:getRole': (callback: (response: any) => void) => void;
  'game:getAvailableActions': (callback: (response: any) => void) => void;

  // Game state
  'game:getState': (callback: (response: any) => void) => void;
  'game:ready': (callback: (response: any) => void) => void;
  'game:action': (
    data: { type: string; target?: string; extra?: any },
    callback: (response: any) => void
  ) => void;

  // Communication
  'game:message': (data: { message: string; channel?: string }) => void;
  'game:typing': (data: { isTyping: boolean }) => void;

  // Chat Events
  'chat:send': (
    data: {
      content: string;
      channel: 'LOBBY' | 'DAY' | 'NIGHT' | 'DEAD' | 'SYSTEM';
      gameId?: string;
    },
    callback: (response: any) => void
  ) => void;
  'chat:history': (
    data: {
      channel: 'LOBBY' | 'DAY' | 'NIGHT' | 'DEAD' | 'SYSTEM';
      gameId?: string;
      limit?: number;
      before?: string;
    },
    callback: (response: any) => void
  ) => void;
  'chat:typing:start': (data: { channel: string; gameId?: string }) => void;
  'chat:typing:stop': (data: { channel: string; gameId?: string }) => void;
  'chat:edit': (
    data: { messageId: string; content: string },
    callback: (response: any) => void
  ) => void;
  'chat:delete': (data: { messageId: string }, callback: (response: any) => void) => void;
}

// Server to Client Events
export interface ServerToClientEvents {
  // Server management
  'server:stats': (data: {
    connectedUsers: number;
    activeGames: number;
    timestamp: string;
  }) => void;
  'server:shutdown': (data: { message: string; timestamp: string }) => void;

  // Lobby updates
  'lobby:gameList': (data: { games: any[] }) => void;
  'lobby:gameCreated': (data: {
    gameId: string;
    name: string;
    currentPlayers: number;
    maxPlayers: number;
    status: string;
    isPrivate: boolean;
    code: string;
  }) => void;
  'lobby:gameUpdated': (data: {
    gameId: string;
    currentPlayers: number;
    maxPlayers: number;
  }) => void;
  'lobby:gameRemoved': (data: { gameId: string }) => void;
  'lobby:periodicUpdate': (data: { games: any[] }) => void;

  // Game updates
  'game:playerJoined': (data: { gameId: string; player: any }) => void;
  'game:playerLeft': (data: { gameId: string; userId: string; username: string }) => void;
  'game:playerDisconnected': (data: {
    gameId: string;
    userId: string;
    username: string;
    reason?: string;
  }) => void;
  'game:playerReconnected': (data: { gameId: string; userId: string; username: string }) => void;
  'game:started': (data: { gameId: string; game?: any; roleAssignments?: any[] }) => void;
  'game:ended': (data: { winner: string; endedBy: string; timestamp: string }) => void;
  'game:cancelled': (reason: string) => void;
  'game:paused': (data: { pausedBy: string; timestamp: string }) => void;
  'game:resumed': (data: { resumedBy: string; timestamp: string }) => void;
  'game:hostTransferred': (data: { gameId: string; newHostId: string }) => void;

  // Role and phase updates
  'game:phaseChanged': (data: { phase: 'DAY' | 'NIGHT'; dayNumber: number }) => void;
  'game:roleAssigned': (data: { role: string; abilities: any[] }) => void;
  'game:playerEliminated': (data: { playerId: string; playerName: string; role?: string }) => void;
  'game:nightResolved': (data: { deaths: string[]; phase: 'DAY' | 'NIGHT' }) => void;

  // Game state sync
  'game:stateSync': (data: { game: any }) => void;
  'game:playerReady': (data: { userId: string; username: string; timestamp: string }) => void;
  'game:actionPerformed': (data: {
    userId: string;
    username: string;
    action: string;
    target?: string;
    timestamp: string;
  }) => void;
  'game:investigationResult': (data: { target: string; result: string; timestamp: string }) => void;

  // Communication
  'game:message': (data: {
    userId: string;
    username: string;
    message: string;
    timestamp: string;
    channel: string;
    playerRole?: string;
    isAlive?: boolean;
  }) => void;
  'game:userTyping': (data: { userId: string; username: string; isTyping: boolean }) => void;

  // Chat Events
  'chat:message': (data: {
    id: string;
    gameId?: string;
    userId: string;
    username: string;
    avatarUrl?: string;
    channel: 'LOBBY' | 'DAY' | 'NIGHT' | 'DEAD' | 'SYSTEM';
    type: 'TEXT' | 'SYSTEM' | 'JOIN' | 'LEAVE' | 'DEATH' | 'ROLE_REVEAL';
    content: string;
    mentions: string[];
    edited: boolean;
    editedAt?: string;
    createdAt: string;
  }) => void;
  'chat:history': (data: { messages: any[]; hasMore: boolean }) => void;
  'chat:typing': (data: {
    userId: string;
    username: string;
    channel: string;
    gameId?: string;
    isTyping: boolean;
  }) => void;
  'chat:messageEdited': (data: { messageId: string; content: string; editedAt: string }) => void;
  'chat:messageDeleted': (data: { messageId: string }) => void;

  // Error handling
  error: (error: SocketError) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  username: string;
  currentGame?: string;
  roomId?: string;
}
