import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth-simple';
import userRoutes from './routes/users';
import gameRoutes from './routes/games-simple';
import { initializeSocketServer } from './socket';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.use(helmet());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// API Routes FIRST
console.log('Loading auth routes...');
console.log('Auth routes object:', authRoutes);
app.use('/api/auth', authRoutes);
console.log('Loading user routes...');
app.use('/api/users', userRoutes);
console.log('Loading game routes...');
app.use('/api/games', gameRoutes);
console.log('All routes loaded successfully');

// Test route directly in server
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'Direct route works' });
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Werewolf Game API',
    version: '1.0.0',
  });
});

// Initialize Socket.IO server
const io = initializeSocketServer(httpServer);

app.use(notFoundHandler);
app.use(errorHandler);

const gracefulShutdown = (signal: string): void => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Rejection:', reason);
  process.exit(1);
});

httpServer.listen(PORT, () => {
  logger.info(`Server running on http://${HOST}:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

export { app, io };