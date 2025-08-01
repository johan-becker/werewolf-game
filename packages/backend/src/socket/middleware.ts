/**
 * Legacy socket middleware - Use for backward compatibility
 * For new implementations, use socket-auth.ts
 */

import { Socket } from 'socket.io';
import { createClient } from '@supabase/supabase-js';
import { ExtendedError } from 'socket.io/dist/namespace';
import { AuthSecurityService } from '../services/auth-security.service';
import { AuthErrorCode } from '../types/auth.types';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const authService = AuthSecurityService.getInstance();

// Connection tracking for reconnection handling
const activeConnections = new Map<string, {
  socket: Socket;
  lastSeen: number;
  gameId?: string;
}>();

export async function authenticateSocket(
  socket: Socket,
  next: (err?: ExtendedError) => void
) {
  try {
    let token: string | undefined;

    // Get token from multiple sources (priority order)
    // 1. Auth object (most common for direct connections)
    if (socket.handshake.auth.token) {
      token = socket.handshake.auth.token;
    }
    // 2. Authorization header
    else if (socket.handshake.headers.authorization) {
      token = socket.handshake.headers.authorization.replace('Bearer ', '');
    }
    // 3. Query parameter (useful for browser connections)
    else if (socket.handshake.query.token && typeof socket.handshake.query.token === 'string') {
      token = socket.handshake.query.token;
    }
    // 4. Cookie (if set by browser)
    else if (socket.handshake.headers.cookie) {
      const cookies = parseCookies(socket.handshake.headers.cookie);
      token = cookies['access_token'] || cookies['sb_access_token'];
    }

    if (!token) {
      return next(new Error('No authentication token provided'));
    }

    // Verify with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return next(new Error('Invalid or expired token'));
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, full_name')
      .eq('id', user.id)
      .single();

    // Ensure socket.data exists and attach user data with null safety
    if (!socket.data) {
      socket.data = {};
    }
    
    socket.data.userId = user.id;
    socket.data.username = profile?.username || profile?.full_name || user.email?.split('@')[0] || 'Anonymous';

    // Handle reconnection - check if user was previously connected
    const existingConnection = activeConnections.get(user.id);
    if (existingConnection) {
      // Disconnect old socket if still connected
      if (existingConnection.socket.connected) {
        existingConnection.socket.disconnect(true);
      }
      
      // Transfer game room if user was in one
      if (existingConnection.gameId) {
        (socket.data as any).gameId = existingConnection.gameId;
        await socket.join(`game:${existingConnection.gameId}`);
      }
    }

    // Track new connection
    activeConnections.set(user.id, {
      socket,
      lastSeen: Date.now(),
      gameId: (socket.data as any).gameId
    });

    // Auto-disconnect on invalid token (session expired)
    socket.on('disconnect', () => {
      const connection = activeConnections.get(user.id);
      if (connection && connection.socket.id === socket.id) {
        // Start grace period for reconnection
        setTimeout(() => {
          const stillExists = activeConnections.get(user.id);
          if (stillExists && stillExists.socket.id === socket.id) {
            activeConnections.delete(user.id);
          }
        }, 30000); // 30 second grace period
      }
    });

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    next(new Error('Authentication failed'));
  }
}

// Helper function to parse cookies
function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.trim().split('=');
    if (parts.length === 2 && parts[0] && parts[1]) {
      cookies[parts[0]] = decodeURIComponent(parts[1]);
    }
  });
  return cookies;
}

// Get active connection for user (useful for reconnection logic)
export function getActiveConnection(userId: string) {
  return activeConnections.get(userId);
}

// Update connection game room
export function updateConnectionGame(userId: string, gameId?: string) {
  const connection = activeConnections.get(userId);
  if (connection) {
    connection.gameId = gameId || undefined;
    connection.lastSeen = Date.now();
  }
}

// Rate limiting middleware
const rateLimitMap = new Map<string, number[]>();

export function rateLimitMiddleware(
  eventName: string,
  maxRequests: number = 10,
  windowMs: number = 60000
) {
  return (socket: Socket, next: () => void) => {
    // Add null safety check
    if (!socket.data?.userId) {
      socket.emit('error', {
        code: AuthErrorCode.INVALID_SESSION,
        message: 'Socket not properly authenticated'
      });
      return;
    }
    
    const key = `${socket.data.userId}:${eventName}`;
    const now = Date.now();
    const requests = rateLimitMap.get(key) || [];
    
    // Clean old requests
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      socket.emit('error', {
        code: 'RATE_LIMIT',
        message: `Too many requests for ${eventName}`
      });
      return;
    }
    
    validRequests.push(now);
    rateLimitMap.set(key, validRequests);
    next();
  };
}