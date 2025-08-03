/**
 * Enhanced Socket.IO Server with Authentication State Machine
 * Implements mandatory authentication enforcement and secure connection management
 */

import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { 
  initializeSocketAuth,
  socketAuthStateMachine
} from '../middleware/socket-auth-state.middleware';
import { AuthenticatedSocketEventHandler } from './authenticated-events';
import {
  AuthenticatedSocket,
  AuthenticatedSocketEvents
} from '../types/socket-auth.types';

export function initializeEnhancedSocketServer(httpServer: HttpServer) {
  const io = new Server<AuthenticatedSocketEvents>(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true
    },
    path: '/socket.io/',
    transports: ['websocket', 'polling'],
    pingTimeout: 30000,  // Reduced for faster detection of disconnects
    pingInterval: 15000, // More frequent pings for better connection monitoring
    connectTimeout: 10000, // 10 second connection timeout
    upgradeTimeout: 5000,  // 5 second upgrade timeout
    maxHttpBufferSize: 1e6, // 1MB max message size
    allowEIO3: false // Disable Engine.IO v3 for security
  });

  // Initialize event handler
  const eventHandler = new AuthenticatedSocketEventHandler(io);

  // Global connection state tracking
  const connectionStats = {
    totalConnections: 0,
    authenticatedConnections: 0,
    rejectedConnections: 0,
    timeoutConnections: 0
  };

  // Authentication middleware - MANDATORY for all connections
  io.use(initializeSocketAuth);

  // Global rate limiting middleware
  io.use((socket, next) => {
    // const clientIP = socket.handshake.address;
    
    // Additional IP-based rate limiting could be implemented here
    // For now, rely on the state machine's connection limits
    
    next();
  });

  // Connection event handler with authentication state machine
  io.on('connection', async (socket: AuthenticatedSocket) => {
    connectionStats.totalConnections++;
    
    const clientIP = socket.handshake.address;
    const userAgent = socket.handshake.headers['user-agent'] || 'unknown';
    
    console.log(`New socket connection ${socket.id} from ${clientIP} (UA: ${userAgent})`);
    console.log(`Connection stats: ${connectionStats.totalConnections} total, ${connectionStats.authenticatedConnections} authenticated`);

    // Set up authenticated event handlers
    eventHandler.setupEventHandlers(socket);

    // Set up authentication state monitoring
    setupAuthenticationMonitoring(socket, connectionStats);

    // Set up periodic connection health checks
    setupConnectionHealthChecks(socket);

    // Set up graceful disconnect handling
    setupDisconnectHandling(socket, connectionStats);

    // Set up security monitoring
    setupSecurityMonitoring(socket);

    // Set up message validation middleware
    setupMessageValidation(socket);
  });

  // Global error handling
  io.engine.on('connection_error', (err) => {
    console.error('Socket.IO connection error:', {
      code: err.code,
      message: err.message,
      context: err.context,
      type: err.type
    });
    
    connectionStats.rejectedConnections++;
  });

  // Periodic health monitoring
  setInterval(() => {
    const authenticatedSockets = Array.from(io.sockets.sockets.values())
      .filter(s => (s as AuthenticatedSocket).data?.authState === 'AUTHENTICATED');

    console.log(`Socket Health Check: ${authenticatedSockets.length} authenticated sockets of ${io.sockets.sockets.size} total`);

    // Update connection stats
    connectionStats.authenticatedConnections = authenticatedSockets.length;

    // Emit server statistics to monitoring system
    io.emit('server:stats', {
      timestamp: new Date(),
      connections: connectionStats,
      authenticatedSockets: authenticatedSockets.length,
      totalSockets: io.sockets.sockets.size
    });
  }, 30000); // Every 30 seconds

  // Cleanup expired authentication attempts
  setInterval(async () => {
    const allSockets = Array.from(io.sockets.sockets.values());
    let cleanedUp = 0;

    for (const socket of allSockets) {
      const authSocket = socket as AuthenticatedSocket;
      
      if (authSocket.data?.authState === 'PENDING') {
        const timeSinceConnection = Date.now() - authSocket.data.connectedAt.getTime();
        
        // Force disconnect sockets that have been pending too long
        if (timeSinceConnection > 10000) { // 10 seconds grace period beyond the 5-second timeout
          console.log(`Force disconnecting expired pending socket ${socket.id}`);
          socket.disconnect(true);
          cleanedUp++;
        }
      }
    }

    if (cleanedUp > 0) {
      console.log(`Cleaned up ${cleanedUp} expired authentication attempts`);
    }
  }, 15000); // Every 15 seconds

  // Graceful shutdown with authentication state cleanup
  const gracefulShutdown = async (signal: string) => {
    console.log(`Received ${signal}, starting graceful shutdown...`);
    
    // Notify all authenticated clients
    const authenticatedSockets = Array.from(io.sockets.sockets.values())
      .filter(s => (s as AuthenticatedSocket).data?.authState === 'AUTHENTICATED');

    console.log(`Notifying ${authenticatedSockets.length} authenticated clients of shutdown`);

    for (const socket of authenticatedSockets) {
      socket.emit('server:shutdown', {
        message: 'Server is shutting down for maintenance',
        timestamp: new Date(),
        reconnectAfter: 30000 // Suggest reconnection after 30 seconds
      });
    }

    // Clean up authentication state machine
    const allSockets = Array.from(io.sockets.sockets.values());
    for (const socket of allSockets) {
      await socketAuthStateMachine.cleanupSocket(socket as AuthenticatedSocket);
    }

    // Give clients time to save state and prepare for reconnection
    setTimeout(() => {
      io.close(() => {
        console.log('Enhanced Socket.IO server closed gracefully');
        console.log(`Final stats: ${connectionStats.totalConnections} total connections, ${connectionStats.authenticatedConnections} successful authentications`);
        process.exit(0);
      });
    }, 3000); // 3 seconds to allow client-side cleanup
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  console.log('Enhanced Socket.IO server initialized with authentication state machine');
  console.log('Features enabled:');
  console.log('- Mandatory 5-second authentication timeout');
  console.log('- Message queuing during pending authentication');
  console.log('- Connection state machine enforcement');
  console.log('- Typed event interfaces with user context validation');
  console.log('- Automatic cleanup of failed authentication attempts');

  return io;
}

// Helper functions for socket setup

function setupAuthenticationMonitoring(socket: AuthenticatedSocket, stats: any): void {
  // Monitor authentication state changes
  const originalEmit = socket.emit.bind(socket);
  
  socket.emit = function(event: string, ...args: any[]) {
    // Track authentication events
    if (event === 'auth:success') {
      stats.authenticatedConnections++;
      console.log(`Socket ${socket.id} successfully authenticated`);
    } else if (event === 'auth:error' || event === 'auth:timeout') {
      stats.rejectedConnections++;
      if (event === 'auth:timeout') {
        stats.timeoutConnections++;
      }
      console.log(`Socket ${socket.id} authentication failed: ${event}`);
    }
    
    return originalEmit(event, ...args);
  } as any;
}

function setupConnectionHealthChecks(socket: AuthenticatedSocket): void {
  // Periodic health check for authenticated sockets
  const healthCheckInterval = setInterval(() => {
    if (socket.data?.authState === 'AUTHENTICATED') {
      const lastActivity = socket.data.lastActivityAt;
      const inactiveTime = Date.now() - lastActivity.getTime();
      
      // Disconnect inactive authenticated sockets after 30 minutes
      if (inactiveTime > 30 * 60 * 1000) {
        console.log(`Disconnecting inactive authenticated socket ${socket.id} (inactive for ${Math.round(inactiveTime / 60000)} minutes)`);
        
        socket.emit('connection:timeout', {
          reason: 'Inactivity timeout',
          inactiveTime,
          timestamp: new Date()
        });
        
        setTimeout(() => socket.disconnect(true), 2000);
      }
    }
  }, 60000); // Check every minute

  socket.on('disconnect', () => {
    clearInterval(healthCheckInterval);
  });
}

function setupDisconnectHandling(socket: AuthenticatedSocket, stats: any): void {
  socket.on('disconnect', async (reason) => {
    const authState = socket.data?.authState || 'UNKNOWN';
    const user = socket.data?.user;
    const gameId = socket.data?.currentGame;

    console.log(`Socket ${socket.id} disconnected (state: ${authState}, reason: ${reason})`);
    
    if (user) {
      console.log(`User ${user.userId} (${user.username || user.email}) disconnected from game ${gameId || 'none'}`);
    }

    // Update connection stats
    if (authState === 'AUTHENTICATED') {
      stats.authenticatedConnections = Math.max(0, stats.authenticatedConnections - 1);
    }

    // Clean up authentication state
    try {
      await socketAuthStateMachine.cleanupSocket(socket);
    } catch (error) {
      console.error(`Error cleaning up socket ${socket.id}:`, error);
    }

    // Notify game room if user was in a game
    if (gameId && user) {
      socket.to(`game:${gameId}`).emit('game:playerDisconnected', {
        gameId,
        playerId: user.userId,
        username: user.username || user.email.split('@')[0],
        reason,
        timestamp: new Date()
      });
    }
  });
}

function setupSecurityMonitoring(socket: AuthenticatedSocket): void {
  // Monitor for suspicious activity
  let eventCount = 0;
  let suspiciousEvents = 0;
  const eventWindow = 60000; // 1 minute
  const maxEventsPerWindow = 100;

  const eventCountReset = setInterval(() => {
    eventCount = 0;
    suspiciousEvents = 0;
  }, eventWindow);

  socket.onAny((_eventName, ..._args) => {
    eventCount++;
    
    // Check for suspicious patterns
    if (eventCount > maxEventsPerWindow) {
      suspiciousEvents++;
      
      if (suspiciousEvents > 5) {
        console.warn(`Suspicious activity detected on socket ${socket.id}: ${eventCount} events in ${eventWindow}ms`);
        
        socket.emit('security:warning', {
          reason: 'High event frequency detected',
          eventCount,
          window: eventWindow,
          timestamp: new Date()
        });
        
        // Consider disconnecting repeat offenders
        if (suspiciousEvents > 10) {
          socket.disconnect(true);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    clearInterval(eventCountReset);
  });
}

function setupMessageValidation(socket: AuthenticatedSocket): void {
  // Validate message structure and content
  socket.use(([event, ...args], next) => {
    // Basic message validation
    if (typeof event !== 'string') {
      next(new Error('Invalid event name'));
      return;
    }

    // Check message size (prevent DoS)
    const messageSize = JSON.stringify(args).length;
    if (messageSize > 100000) { // 100KB limit
      next(new Error('Message too large'));
      return;
    }

    // Validate authentication requirement
    if (!socketAuthStateMachine.validateAuthentication(socket, event)) {
      // validateAuthentication already sends error to client
      next(new Error('Authentication required'));
      return;
    }

    next();
  });
}