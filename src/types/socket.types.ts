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
  // Lobby events
  'lobby:join': () => void;
  'lobby:leave': () => void;
  'lobby:list': (callback: (response: any) => void) => void;
  
  // Game management
  'game:join': (data: { gameId: string }, callback: (response: any) => void) => void;
  'game:joinByCode': (data: { code: string }, callback: (response: any) => void) => void;
  'game:leave': (data: { gameId: string }, callback: (response: any) => void) => void;
  'game:start': (data: { gameId: string }, callback: (response: any) => void) => void;
  
  // In-game events
  'game:message': (message: string) => void;
  'game:ready': () => void;
}

// Server to Client Events
export interface ServerToClientEvents {
  // Lobby updates
  'lobby:gameUpdated': (data: { gameId: string; currentPlayers: number }) => void;
  'lobby:gameRemoved': (data: { gameId: string }) => void;
  
  // Game updates
  'game:playerJoined': (data: { gameId: string; player: any }) => void;
  'game:playerLeft': (data: { gameId: string; userId: string }) => void;
  'game:started': (data: { gameId: string }) => void;
  'game:cancelled': (reason: string) => void;
  'game:hostTransferred': (data: { gameId: string; newHostId: string }) => void;
  
  // Chat
  'game:message': (data: { userId: string; username: string; message: string; timestamp: string }) => void;
  
  // Error
  'error': (error: SocketError) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  username: string;
}