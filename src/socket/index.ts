import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { authenticateSocket, rateLimitMiddleware } from './middleware';
import { RoomManager } from './rooms';
import { handleLobbyEvents } from './events/lobby.events';
import { handleGameEvents } from './events/game.events';
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
    path: '/socket.io/'
  });

  // Initialize services
  const roomManager = new RoomManager();
  const gameService = new GameService();

  // Authentication middleware
  io.use(authenticateSocket);

  // Connection handler
  io.on('connection', (socket) => {
    console.log(`User ${socket.data.username} connected`);

    // Apply rate limiting to events
    socket.use((event, next) => {
      const rateLimitedEvents = ['game:create', 'game:join', 'game:message'];
      if (rateLimitedEvents.includes(event[0])) {
        rateLimitMiddleware(event[0])(socket, next);
      } else {
        next();
      }
    });

    // Register event handlers
    handleLobbyEvents(socket, io);
    handleGameEvents(io, socket, roomManager, gameService);

    // Handle disconnect is now in lobby.events.ts
    socket.on('disconnect', async () => {
      console.log(`User ${socket.data.username} disconnected`);
      roomManager.handleDisconnect(socket.data.userId);
    });
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    io.close(() => {
      console.log('Socket.io server closed');
    });
  });

  return io;
}