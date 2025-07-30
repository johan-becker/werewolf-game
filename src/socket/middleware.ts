import { Socket } from 'socket.io';
import { createClient } from '@supabase/supabase-js';
import { ExtendedError } from 'socket.io/dist/namespace';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function authenticateSocket(
  socket: Socket,
  next: (err?: ExtendedError) => void
) {
  try {
    // Get token from handshake
    const token = socket.handshake.auth.token || 
                 socket.handshake.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new Error('No token provided'));
    }

    // Verify with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return next(new Error('Invalid token'));
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    // Attach user data to socket
    socket.data.userId = user.id;
    socket.data.username = profile?.username || 'Anonymous';

    next();
  } catch (error) {
    next(new Error('Authentication failed'));
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