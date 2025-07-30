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
  'lobby:list': (callback: (games: any[]) => void) => void;
  'game:create': (data: any, callback: (response: any) => void) => void;
  'game:join': (gameId: string, callback: (response: any) => void) => void;
  'game:leave': (callback: (response: any) => void) => void;
  
  // In-game events
  'game:message': (message: string) => void;
  'game:ready': () => void;
  'game:start': () => void;
}

// Server to Client Events
export interface ServerToClientEvents {
  // Lobby updates
  'lobby:update': (games: any[]) => void;
  
  // Game updates
  'game:playerJoined': (player: any) => void;
  'game:playerLeft': (userId: string) => void;
  'game:started': () => void;
  'game:cancelled': (reason: string) => void;
  
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