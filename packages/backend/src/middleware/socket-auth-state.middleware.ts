/**
 * Socket Authentication State Machine Implementation
 * Enforces mandatory authentication with timeout and message queuing
 */

import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { AuthSecurityService } from '../services/auth-security.service';
import {
  SocketAuthenticationState,
  AuthenticatedSocket,
  QueuedMessage,
  SocketAuthResult,
  SocketAuthErrorCode,
  SocketStateTransition,
  SocketStateTrigger,
  MessageQueueConfig,
  SocketSecurityConfig
} from '../types/socket-auth.types';

export class SocketAuthenticationStateMachine {
  private static instance: SocketAuthenticationStateMachine;
  private authService: AuthSecurityService;
  private connectedSockets = new Map<string, AuthenticatedSocket>();
  private ipConnectionCount = new Map<string, number>();
  private userConnectionCount = new Map<string, number>();

  // Configuration
  private readonly config: SocketSecurityConfig = {
    authenticationTimeout: 5000, // 5 seconds as required
    maxConnectionsPerIP: 10,
    maxConnectionsPerUser: 3,
    rateLimitWindow: 60000, // 1 minute
    rateLimitMaxRequests: 100,
    enableHeartbeat: true,
    heartbeatInterval: 30000, // 30 seconds
    heartbeatTimeout: 10000 // 10 seconds
  };

  private readonly messageQueueConfig: MessageQueueConfig = {
    maxQueueSize: 50,
    maxMessageAge: 10000, // 10 seconds
    queueProcessingInterval: 100, // 100ms
    priorityOrder: [
      'auth:authenticate',
      'auth:refresh',
      'connection:heartbeat',
      'game:getState',
      'game:chat',
      'game:nightAction',
      'game:vote'
    ]
  };

  // Valid state transitions
  private readonly validTransitions: SocketStateTransition[] = [
    {
      from: SocketAuthenticationState.PENDING,
      to: SocketAuthenticationState.AUTHENTICATED,
      trigger: SocketStateTrigger.AUTHENTICATION_SUCCESS
    },
    {
      from: SocketAuthenticationState.PENDING,
      to: SocketAuthenticationState.REJECTED,
      trigger: SocketStateTrigger.AUTHENTICATION_FAILURE
    },
    {
      from: SocketAuthenticationState.PENDING,
      to: SocketAuthenticationState.REJECTED,
      trigger: SocketStateTrigger.AUTHENTICATION_TIMEOUT
    },
    {
      from: SocketAuthenticationState.AUTHENTICATED,
      to: SocketAuthenticationState.REJECTED,
      trigger: SocketStateTrigger.CONNECTION_ERROR
    }
  ];

  private constructor() {
    this.authService = AuthSecurityService.getInstance();
  }

  public static getInstance(): SocketAuthenticationStateMachine {
    if (!SocketAuthenticationStateMachine.instance) {
      SocketAuthenticationStateMachine.instance = new SocketAuthenticationStateMachine();
    }
    return SocketAuthenticationStateMachine.instance;
  }

  /**
   * Initialize socket with authentication state machine
   */
  public async initializeSocket(socket: Socket): Promise<void> {
    const authSocket = socket as AuthenticatedSocket;
    const clientIP = this.getClientIP(socket);

    // Check connection limits
    if (!this.checkConnectionLimits(clientIP)) {
      socket.emit('auth:error', {
        code: SocketAuthErrorCode.RATE_LIMITED,
        message: 'Too many connections from this IP address',
        canRetry: true,
        retryAfter: 60,
        timestamp: new Date()
      });
      socket.disconnect(true);
      return;
    }

    // Initialize socket data with PENDING state
    authSocket.data = {
      authState: SocketAuthenticationState.PENDING,
      connectedAt: new Date(),
      lastActivityAt: new Date(),
      messageQueue: []
    };

    // Track connection
    this.connectedSockets.set(socket.id, authSocket);
    this.incrementConnectionCount(clientIP);

    console.log(`Socket ${socket.id} initialized in PENDING state from IP ${clientIP}`);

    // Set up authentication timeout (5 seconds as required)
    this.setupAuthenticationTimeout(authSocket);

    // Set up message queuing for pending authentication
    this.setupMessageQueuing(authSocket);

    // Set up connection event handlers
    this.setupConnectionHandlers(authSocket);

    // Challenge client for authentication
    this.challengeAuthentication(authSocket);
  }

  /**
   * Process authentication attempt
   */
  public async authenticateSocket(
    socket: AuthenticatedSocket,
    token: string,
    deviceId?: string
  ): Promise<SocketAuthResult> {
    if (socket.data.authState !== SocketAuthenticationState.PENDING) {
      return {
        success: false,
        error: {
          code: SocketAuthErrorCode.INVALID_TOKEN,
          message: 'Authentication already processed',
          canRetry: false
        }
      };
    }

    try {
      const context = {
        ip: this.getClientIP(socket),
        userAgent: socket.handshake.headers['user-agent'] || 'unknown',
        deviceId: deviceId || socket.handshake.headers['x-device-id'] as string
      };

      const authResult = await this.authService.authenticateUser(token, context);

      if (authResult.success && authResult.user) {
        // Check user connection limits
        const userId = authResult.user.id;
        if (!this.checkUserConnectionLimits(userId)) {
          return {
            success: false,
            error: {
              code: SocketAuthErrorCode.RATE_LIMITED,
              message: 'Too many active connections for this user',
              canRetry: true
            }
          };
        }

        // Transition to AUTHENTICATED state
        await this.transitionState(
          socket,
          SocketAuthenticationState.AUTHENTICATED,
          SocketStateTrigger.AUTHENTICATION_SUCCESS
        );

        // Update socket data with authenticated user
        socket.data.user = authResult.user;
        socket.data.authenticatedAt = new Date();
        socket.data.sessionId = this.generateSessionId();

        // Clear authentication timeout
        if (socket.data.authTimeoutId) {
          clearTimeout(socket.data.authTimeoutId);
          delete socket.data.authTimeoutId;
        }

        // Process queued messages
        await this.processMessageQueue(socket);

        // Track user connection
        this.incrementUserConnectionCount(userId);

        console.log(`Socket ${socket.id} authenticated for user ${userId}`);

        return {
          success: true,
          user: authResult.user,
          metadata: {
            sessionId: socket.data.sessionId,
            authenticatedAt: socket.data.authenticatedAt,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
          }
        };
      } else {
        // Authentication failed
        await this.transitionState(
          socket,
          SocketAuthenticationState.REJECTED,
          SocketStateTrigger.AUTHENTICATION_FAILURE
        );

        return {
          success: false,
          error: {
            code: authResult.error?.code === 'EXPIRED_TOKEN' 
              ? SocketAuthErrorCode.EXPIRED_TOKEN 
              : SocketAuthErrorCode.INVALID_TOKEN,
            message: authResult.error?.message || 'Authentication failed',
            canRetry: true
          }
        };
      }
    } catch (error) {
      console.error('Socket authentication error:', error);
      
      await this.transitionState(
        socket,
        SocketAuthenticationState.REJECTED,
        SocketStateTrigger.AUTHENTICATION_FAILURE
      );

      return {
        success: false,
        error: {
          code: SocketAuthErrorCode.SERVER_ERROR,
          message: 'Authentication service error',
          canRetry: true
        }
      };
    }
  }

  /**
   * Validate that socket is authenticated for game events
   */
  public validateAuthentication(socket: AuthenticatedSocket, eventName: string): boolean {
    // Allow authentication events even when not authenticated
    const authEvents = ['auth:authenticate', 'auth:refresh', 'auth:challenge'];
    if (authEvents.includes(eventName)) {
      return true;
    }

    // All other events require authentication
    if (socket.data.authState !== SocketAuthenticationState.AUTHENTICATED) {
      socket.emit('auth:error', {
        code: SocketAuthErrorCode.AUTHENTICATION_TIMEOUT,
        message: 'Authentication required for this action',
        canRetry: true,
        timestamp: new Date()
      });
      return false;
    }

    // Update last activity
    socket.data.lastActivityAt = new Date();
    return true;
  }

  /**
   * Get authenticated user from socket (guaranteed to exist if validation passed)
   */
  public getAuthenticatedUser(socket: AuthenticatedSocket) {
    if (socket.data.authState !== SocketAuthenticationState.AUTHENTICATED || !socket.data.user) {
      throw new Error('Socket not authenticated - validation should have been called first');
    }
    return socket.data.user;
  }

  /**
   * Clean up socket connection
   */
  public async cleanupSocket(socket: AuthenticatedSocket): Promise<void> {
    const clientIP = this.getClientIP(socket);
    
    // Clear timeouts
    if (socket.data.authTimeoutId) {
      clearTimeout(socket.data.authTimeoutId);
    }

    // Update connection counts
    this.decrementConnectionCount(clientIP);
    
    if (socket.data.user) {
      this.decrementUserConnectionCount(socket.data.user.id);
    }

    // Remove from tracking
    this.connectedSockets.delete(socket.id);

    console.log(`Socket ${socket.id} cleaned up`);
  }

  // Private methods

  private setupAuthenticationTimeout(socket: AuthenticatedSocket): void {
    socket.data.authTimeoutId = setTimeout(async () => {
      if (socket.data.authState === SocketAuthenticationState.PENDING) {
        console.log(`Socket ${socket.id} authentication timeout`);
        
        socket.emit('auth:timeout', {
          message: 'Authentication timeout - connection will be closed',
          timeoutDuration: this.config.authenticationTimeout,
          canReconnect: true,
          timestamp: new Date()
        });

        await this.transitionState(
          socket,
          SocketAuthenticationState.REJECTED,
          SocketStateTrigger.AUTHENTICATION_TIMEOUT
        );

        // Disconnect after timeout
        setTimeout(() => {
          if (socket.connected) {
            socket.disconnect(true);
          }
        }, 1000); // Give client 1 second to handle timeout message
      }
    }, this.config.authenticationTimeout);
  }

  private setupMessageQueuing(socket: AuthenticatedSocket): void {
    // Override socket.on to queue messages during pending authentication
    const originalOn = socket.on.bind(socket);
    
    socket.on = ((event: string, listener: (...args: any[]) => void) => {
      if (socket.data.authState === SocketAuthenticationState.PENDING && 
          !event.startsWith('auth:') && 
          !event.startsWith('connection:')) {
        
        // Queue the message instead of processing immediately
        return originalOn(event, (...args: any[]) => {
          this.queueMessage(socket, event, args, listener);
        });
      }
      
      return originalOn(event, listener);
    }) as any;
  }

  private queueMessage(
    socket: AuthenticatedSocket,
    event: string,
    args: any[],
    originalListener: (...args: any[]) => void
  ): void {
    if (socket.data.messageQueue.length >= this.messageQueueConfig.maxQueueSize) {
      socket.emit('error', {
        code: 'QUEUE_FULL',
        message: 'Message queue full - authenticate to process messages',
        event,
        timestamp: new Date(),
        canRetry: true
      });
      return;
    }

    const queuedMessage: QueuedMessage = {
      id: this.generateMessageId(),
      event,
      data: args,
      timestamp: new Date(),
      callback: args[args.length - 1] && typeof args[args.length - 1] === 'function' 
        ? args[args.length - 1] 
        : undefined
    };

    socket.data.messageQueue.push(queuedMessage);
    
    console.log(`Queued message ${event} for socket ${socket.id} (queue size: ${socket.data.messageQueue.length})`);
  }

  private async processMessageQueue(socket: AuthenticatedSocket): Promise<void> {
    const queue = socket.data.messageQueue;
    const now = new Date();

    // Remove expired messages
    const validMessages = queue.filter(
      msg => now.getTime() - msg.timestamp.getTime() < this.messageQueueConfig.maxMessageAge
    );

    // Sort by priority
    validMessages.sort((a, b) => {
      const priorityA = this.messageQueueConfig.priorityOrder.indexOf(a.event);
      const priorityB = this.messageQueueConfig.priorityOrder.indexOf(b.event);
      
      // Higher priority (lower index) comes first
      if (priorityA !== -1 && priorityB !== -1) return priorityA - priorityB;
      if (priorityA !== -1) return -1;
      if (priorityB !== -1) return 1;
      
      // Same priority, process by timestamp
      return a.timestamp.getTime() - b.timestamp.getTime();
    });

    console.log(`Processing ${validMessages.length} queued messages for socket ${socket.id}`);

    // Process messages
    for (const message of validMessages) {
      try {
        // Re-emit the event with original data
        socket.emit('internal:process_queued', message.event, ...message.data);
      } catch (error) {
        console.error(`Error processing queued message ${message.id}:`, error);
      }
    }

    // Clear the queue
    socket.data.messageQueue = [];
  }

  private setupConnectionHandlers(socket: AuthenticatedSocket): void {
    socket.on('disconnect', async (reason) => {
      console.log(`Socket ${socket.id} disconnected: ${reason}`);
      await this.cleanupSocket(socket);
    });

    socket.on('error', (error) => {
      console.error(`Socket ${socket.id} error:`, error);
    });

    // Heartbeat handling
    if (this.config.enableHeartbeat) {
      socket.on('connection:heartbeat', (callback) => {
        callback({
          timestamp: new Date(),
          serverTime: new Date(),
          latency: Date.now() - socket.data.lastActivityAt.getTime()
        });
      });
    }
  }

  private challengeAuthentication(socket: AuthenticatedSocket): void {
    socket.emit('auth:challenge', (response: any) => {
      // Client should respond with authentication token
    });
  }

  private async transitionState(
    socket: AuthenticatedSocket,
    newState: SocketAuthenticationState,
    trigger: SocketStateTrigger
  ): Promise<void> {
    const currentState = socket.data.authState;
    
    // Validate transition
    const validTransition = this.validTransitions.find(
      t => t.from === currentState && t.to === newState && t.trigger === trigger
    );

    if (!validTransition) {
      console.warn(`Invalid state transition: ${currentState} -> ${newState} (trigger: ${trigger})`);
      return;
    }

    socket.data.authState = newState;
    console.log(`Socket ${socket.id} state transition: ${currentState} -> ${newState}`);

    // Handle state-specific actions
    if (newState === SocketAuthenticationState.REJECTED) {
      // Disconnect rejected sockets after a brief delay
      setTimeout(() => {
        if (socket.connected) {
          socket.disconnect(true);
        }
      }, 2000);
    }
  }

  private checkConnectionLimits(clientIP: string): boolean {
    const currentConnections = this.ipConnectionCount.get(clientIP) || 0;
    return currentConnections < this.config.maxConnectionsPerIP;
  }

  private checkUserConnectionLimits(userId: string): boolean {
    const currentConnections = this.userConnectionCount.get(userId) || 0;
    return currentConnections < this.config.maxConnectionsPerUser;
  }

  private incrementConnectionCount(clientIP: string): void {
    const current = this.ipConnectionCount.get(clientIP) || 0;
    this.ipConnectionCount.set(clientIP, current + 1);
  }

  private decrementConnectionCount(clientIP: string): void {
    const current = this.ipConnectionCount.get(clientIP) || 0;
    if (current > 0) {
      this.ipConnectionCount.set(clientIP, current - 1);
    }
  }

  private incrementUserConnectionCount(userId: string): void {
    const current = this.userConnectionCount.get(userId) || 0;
    this.userConnectionCount.set(userId, current + 1);
  }

  private decrementUserConnectionCount(userId: string): void {
    const current = this.userConnectionCount.get(userId) || 0;
    if (current > 0) {
      this.userConnectionCount.set(userId, current - 1);
    }
  }

  private getClientIP(socket: Socket): string {
    const forwarded = socket.handshake.headers['x-forwarded-for'];
    const realIP = socket.handshake.headers['x-real-ip'];
    const socketIP = socket.handshake.address;

    if (forwarded && typeof forwarded === 'string') {
      const firstIP = forwarded.split(',')[0];
      return firstIP?.trim() || '';
    }
    
    if (realIP && typeof realIP === 'string') {
      return realIP;
    }

    return typeof socketIP === 'string' ? socketIP : 'unknown';
  }

  private generateSessionId(): string {
    return `socket_session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  }
}

// Export middleware function for Socket.IO
export const socketAuthStateMachine = SocketAuthenticationStateMachine.getInstance();

export async function initializeSocketAuth(
  socket: Socket,
  next: (err?: ExtendedError) => void
): Promise<void> {
  try {
    await socketAuthStateMachine.initializeSocket(socket);
    next();
  } catch (error) {
    const socketError = new Error('Failed to initialize socket authentication') as ExtendedError;
    socketError.data = { 
      code: SocketAuthErrorCode.SERVER_ERROR,
      originalError: error instanceof Error ? error.message : 'Unknown error'
    };
    next(socketError);
  }
}

// Middleware to validate authentication before processing events
export function requireSocketAuth(eventName: string) {
  return (socket: Socket, next: (err?: Error) => void) => {
    const authSocket = socket as AuthenticatedSocket;
    
    if (socketAuthStateMachine.validateAuthentication(authSocket, eventName)) {
      next();
    } else {
      next(new Error('Authentication required'));
    }
  };
}