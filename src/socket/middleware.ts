// src/socket/middleware.ts
import { supabaseAdmin } from '../lib/supabase';
import { logger } from '../utils/logger';

export async function authenticateSocket(socket: any, next: any) {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    logger.warn('Socket connection rejected: No token provided');
    return next(new Error('No token provided'));
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      logger.warn('Socket connection rejected: Invalid token');
      throw new Error('Invalid token');
    }
    
    socket.userId = user.id;
    socket.user = user;
    
    logger.info(`Socket authenticated for user: ${user.id}`);
    next();
  } catch (err: any) {
    logger.error('Socket authentication error:', err);
    next(new Error('Authentication failed'));
  }
}

export async function requireSocketAuth(socket: any, next: any) {
  if (!socket.userId || !socket.user) {
    logger.warn('Socket action rejected: User not authenticated');
    return next(new Error('User not authenticated'));
  }
  
  next();
}