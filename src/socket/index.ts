import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { authenticateSocket, rateLimitMiddleware } from './middleware';
import { RoomManager } from './rooms';
import { handleLobbyEvents } from './events/lobby.events';
import { handleGameEvents } from './events/game.events';
import { handleChatEvents } from './events/chat.events';
import { GameService } from '../services/game.service';
import { 
  ClientToServerEvents, 
  ServerToClientEvents, 
  InterServerEvents, 
  SocketData 
} from '../types/socket.types';

export function initializeSocketServer(httpServer: HttpServer) {
  const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true
    },
    path: '/socket.io/',
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Initialize services
  const roomManager = new RoomManager();
  const gameService = new GameService();

  // Authentication middleware
  io.use(authenticateSocket);

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User ${socket.data.username} (${socket.data.userId}) connected from ${socket.handshake.address}`);

    // Apply rate limiting to events
    socket.use((event, next) => {
      const rateLimitedEvents = ['game:create', 'game:join', 'game:message', 'game:action'];
      if (rateLimitedEvents.includes(event[0])) {
        return rateLimitMiddleware(event[0])(socket, next);
      } else {
        next();
      }
    });

    // Check for reconnection and handle it
    roomManager.handleReconnection(socket).then(gameId => {
      if (gameId) {
        console.log(`User ${socket.data.username} reconnected to game ${gameId}`);
        // Notify game room about reconnection
        roomManager.broadcastToRoom(io, gameId, 'game:playerReconnected', {
          gameId,
          userId: socket.data.userId,
          username: socket.data.username
        });
        
        // Send current game state to reconnected user
        gameService.getGameDetails(gameId)
          .then(game => socket.emit('game:stateSync', { game }))
          .catch(error => console.error('Failed to sync game state on reconnection:', error));
      }
    });

    // Register event handlers with shared room manager instance
    handleLobbyEvents(socket, io, roomManager);
    handleGameEvents(io, socket, roomManager, gameService);
    handleChatEvents(socket, io, roomManager);

    // Handle heartbeat/ping
    socket.on('ping', (callback) => {
      if (callback) callback();
    });

    // Handle connection test
    socket.on('connection:test', (callback) => {
      callback({ 
        success: true, 
        timestamp: new Date().toISOString(),
        userId: socket.data.userId,
        username: socket.data.username 
      });
    });

    // Handle disconnect with improved logging
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.data.username} disconnected: ${reason}`);
      
      // Room manager handles the grace period and cleanup
      const gameId = roomManager.handleDisconnect(socket.data.userId);
      
      if (gameId) {
        // Notify the game room about temporary disconnect
        roomManager.broadcastToRoom(io, gameId, 'game:playerDisconnected', {
          gameId,
          userId: socket.data.userId,
          username: socket.data.username,
          reason: reason
        });
      }
    });

    // Handle connection errors
    socket.on('error', (error: any) => {
      console.error(`Socket error for user ${socket.data.username}:`, error);
    });
  });

  // Cleanup expired disconnects every 5 minutes
  setInterval(() => {
    roomManager.cleanupExpiredDisconnects();
  }, 5 * 60 * 1000);

  // Periodic lobby updates (every 30 seconds)
  setInterval(async () => {
    try {
      const games = await gameService.getGameList();
      roomManager.broadcastToLobby(io, 'lobby:periodicUpdate', { games });
    } catch (error) {
      console.error('Error in periodic lobby update:', error);
    }
  }, 30000);

  // Health check endpoint for monitoring
  io.engine.on('connection_error', (err) => {
    console.error('Socket.IO connection error:', err);
  });

  // Graceful shutdown
  const gracefulShutdown = () => {
    console.log('Starting graceful shutdown of Socket.io server...');
    
    // Notify all connected clients
    io.emit('server:shutdown', { 
      message: 'Server is shutting down',
      timestamp: new Date().toISOString()
    });

    // Give clients time to process shutdown message
    setTimeout(() => {
      io.close(() => {
        console.log('Socket.io server closed gracefully');
        process.exit(0);
      });
    }, 2000);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);

  console.log('Socket.io server initialized with enhanced authentication and room management');
  return io;
}