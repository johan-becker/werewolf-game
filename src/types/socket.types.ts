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
  'ping': (callback?: () => void) => void;
  'connection:test': (callback: (response: any) => void) => void;
  'reconnect': () => void;
  
  // Lobby events
  'lobby:join': () => void;
  'lobby:leave': () => void;
  'lobby:list': (callback: (response: any) => void) => void;
  
  // Game management
  'game:create': (data: { maxPlayers?: number; isPrivate?: boolean }, callback: (response: any) => void) => void;
  'game:join': (data: { gameId: string }, callback: (response: any) => void) => void;
  'game:joinByCode': (data: { code: string }, callback: (response: any) => void) => void;
  'game:leave': (data: { gameId: string }, callback: (response: any) => void) => void;
  'game:start': (data: { gameId: string }, callback: (response: any) => void) => void;
  'game:end': (callback: (response: any) => void) => void;
  'game:pause': (callback: (response: any) => void) => void;
  'game:resume': (callback: (response: any) => void) => void;
  
  // Game state
  'game:getState': (callback: (response: any) => void) => void;
  'game:ready': (callback: (response: any) => void) => void;
  'game:action': (data: { type: string; target?: string; extra?: any }, callback: (response: any) => void) => void;
  
  // Communication
  'game:message': (data: { message: string; channel?: string }) => void;
  'game:typing': (data: { isTyping: boolean }) => void;
}

// Server to Client Events
export interface ServerToClientEvents {
  // Server management
  'server:shutdown': (data: { message: string; timestamp: string }) => void;
  
  // Lobby updates
  'lobby:gameList': (data: { games: any[] }) => void;
  'lobby:gameCreated': (data: { gameId: string; name: string; currentPlayers: number; maxPlayers: number; status: string; isPrivate: boolean; code: string }) => void;
  'lobby:gameUpdated': (data: { gameId: string; currentPlayers: number; maxPlayers: number }) => void;
  'lobby:gameRemoved': (data: { gameId: string }) => void;
  'lobby:periodicUpdate': (data: { games: any[] }) => void;
  
  // Game updates
  'game:playerJoined': (data: { gameId: string; player: any }) => void;
  'game:playerLeft': (data: { gameId: string; userId: string; username: string }) => void;
  'game:playerDisconnected': (data: { gameId: string; userId: string; username: string; reason?: string }) => void;
  'game:playerReconnected': (data: { gameId: string; userId: string; username: string }) => void;
  'game:started': (data: { gameId: string; game?: any }) => void;
  'game:ended': (data: { endedBy: string; timestamp: string }) => void;
  'game:cancelled': (reason: string) => void;
  'game:paused': (data: { pausedBy: string; timestamp: string }) => void;
  'game:resumed': (data: { resumedBy: string; timestamp: string }) => void;
  'game:hostTransferred': (data: { gameId: string; newHostId: string }) => void;
  
  // Game state sync
  'game:stateSync': (data: { game: any }) => void;
  'game:playerReady': (data: { userId: string; username: string; timestamp: string }) => void;
  'game:actionPerformed': (data: { userId: string; username: string; action: string; target?: string; timestamp: string }) => void;
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
  
  // Error handling
  'error': (error: SocketError) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  username: string;
}