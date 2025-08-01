/**
 * Production-grade WebSocket authentication middleware
 * Ensures secure real-time connections with comprehensive error handling
 */

import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { AuthSecurityService } from '../services/auth-security.service';
import { 
  SocketAuthContext, 
  AuthErrorCode,
  SecurityEventType,
  SecuritySeverity 
} from '../types/auth.types';

const authService = AuthSecurityService.getInstance();

/**
 * Enhanced socket data interface with strict typing
 */
export interface AuthenticatedSocket extends Socket {
  data: {
    user: SocketAuthContext['user'];
    sessionId: string;
    connectedAt: Date;
    lastActivityAt: Date;
    roomId?: string;
    deviceId?: string;
  };
}

/**
 * Socket.IO authentication middleware with zero-tolerance security policy
 */
export const authenticateSocket = async (
  socket: Socket, 
  next: (err?: ExtendedError) => void
): Promise<void> => {
  try {
    const token = extractSocketToken(socket);
    
    if (!token) {
      const error = createSocketError(
        AuthErrorCode.NO_TOKEN,
        'Authentication token is required for WebSocket connection'
      );
      return next(error);
    }

    const context = {
      ip: getSocketIP(socket),
      userAgent: socket.handshake.headers['user-agent'] || 'unknown',
      deviceId: socket.handshake.headers['x-device-id'] as string
    };

    const authResult = await authService.authenticateUser(token, context);
    
    if (!authResult.success) {
      const error = createSocketError(
        authResult.error!.code,
        authResult.error!.message
      );
      return next(error);
    }

    // Initialize authenticated socket data
    const authenticatedSocket = socket as AuthenticatedSocket;
    authenticatedSocket.data = {
      user: authResult.user!,
      sessionId: generateSessionId(),
      connectedAt: new Date(),
      lastActivityAt: new Date(),
      deviceId: context.deviceId
    };

    // Set up activity tracking
    setupActivityTracking(authenticatedSocket);

    // Set up automatic cleanup
    setupSocketCleanup(authenticatedSocket);

    next();

  } catch (error) {
    const socketError = createSocketError(
      AuthErrorCode.SERVICE_UNAVAILABLE,
      'Authentication service temporarily unavailable'
    );
    next(socketError);
  }
};

/**
 * Extract authentication token from socket handshake
 */
function extractSocketToken(socket: Socket): string | null {
  // Check authorization header
  const authHeader = socket.handshake.headers.authorization;
  if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check auth query parameter (less secure, for compatibility)
  const tokenParam = socket.handshake.auth?.token;
  if (tokenParam && typeof tokenParam === 'string') {
    return tokenParam;
  }

  // Check query string (least secure, legacy support)
  const queryToken = socket.handshake.query.token;
  if (queryToken && typeof queryToken === 'string') {
    return queryToken;
  }

  return null;
}

/**
 * Get client IP from socket with proxy support
 */
function getSocketIP(socket: Socket): string {
  const forwarded = socket.handshake.headers['x-forwarded-for'];
  const realIP = socket.handshake.headers['x-real-ip'];
  const socketIP = socket.handshake.address;

  if (forwarded && typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP && typeof realIP === 'string') {
    return realIP;
  }

  return typeof socketIP === 'string' ? socketIP : 'unknown';
}

/**
 * Create properly typed socket error
 */
function createSocketError(code: AuthErrorCode, message: string): ExtendedError {
  const error = new Error(message) as ExtendedError;
  error.data = {
    code,
    timestamp: new Date()
  };
  return error;
}

/**
 * Type guard for authenticated sockets
 */
export function isAuthenticatedSocket(socket: Socket): socket is AuthenticatedSocket {
  return socket.data && 
         socket.data.user && 
         socket.data.sessionId && 
         socket.data.connectedAt instanceof Date;
}

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

/**
 * Set up automatic activity tracking for socket
 */
function setupActivityTracking(socket: AuthenticatedSocket): void {
  // Track activity on any event
  const originalEmit = socket.emit;
  socket.emit = function(this: AuthenticatedSocket, event: string, ...args: any[]) {
    socket.data.lastActivityAt = new Date();
    return originalEmit.call(this, event, ...args);
  } as any;

  // Set up periodic activity check
  const activityInterval = setInterval(() => {
    const inactiveTime = Date.now() - socket.data.lastActivityAt.getTime();
    const maxInactiveTime = 30 * 60 * 1000; // 30 minutes

    if (inactiveTime > maxInactiveTime) {
      socket.emit('session:timeout', {
        message: 'Session expired due to inactivity',
        timestamp: new Date()
      });
      socket.disconnect(true);
    }
  }, 60000); // Check every minute

  socket.on('disconnect', () => {
    clearInterval(activityInterval);
  });
}

/**
 * Set up automatic socket cleanup
 */
function setupSocketCleanup(socket: AuthenticatedSocket): void {
  socket.on('disconnect', (reason) => {
    console.log(`Socket ${socket.id} disconnected:`, {
      userId: socket.data.user.id,
      sessionId: socket.data.sessionId,
      reason,
      connectedDuration: Date.now() - socket.data.connectedAt.getTime(),
      lastActivity: socket.data.lastActivityAt
    });

    // Clean up any game-specific state
    if (socket.data.roomId) {
      // Game cleanup logic would go here
    }
  });
}