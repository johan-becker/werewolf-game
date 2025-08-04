import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from '../../routes/auth';
import gameRoutes from '../../routes/game.routes';
import moonPhaseRoutes from '../../routes/moon-phases.routes';
import packRoutes from '../../routes/packs.routes';
import territoryRoutes from '../../routes/territories.routes';

// Import middleware
import { errorHandler } from '../../middleware/errorHandler';
import { authenticateToken } from '../../middleware/auth';

/**
 * Creates a test Express application for werewolf game testing
 * Configures all necessary middleware and routes for integration tests
 */
export async function createTestApp(): Promise<Express> {
  const app = express();

  // Security middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https://werewolf-avatars.test'],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
    })
  );

  // CORS configuration for werewolf game
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Werewolf-Game-Token'],
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Rate limiting for test environment (more lenient)
  const testRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Allow more requests in test environment
    message: {
      error: 'Too many requests from this IP, please try again later.',
      werewolf_hint: 'Even werewolves need to pace themselves! 🐺',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', testRateLimit);

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      environment: 'test',
      werewolf_status: 'pack_assembled',
      moon_phase: 'testing_phase',
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/games', gameRoutes);
  app.use('/api/moon-phases', moonPhaseRoutes);
  app.use('/api/packs', packRoutes);
  app.use('/api/territories', territoryRoutes);

  // Werewolf-specific test endpoints
  app.use('/api/test', createTestRoutes());

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

/**
 * Creates test-specific routes for werewolf game testing
 */
function createTestRoutes(): express.Router {
  const router = express.Router();

  // Reset test database
  router.post('/reset-database', async (req, res) => {
    try {
      const { testDb } = await import('../test-database');
      await testDb.cleanup();
      await testDb.setup();

      res.json({
        success: true,
        message: 'Test database reset successfully',
        werewolf_status: 'territory_cleared',
      });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        werewolf_status: 'pack_scattered',
      });
    }
  });

  // Create test werewolf scenarios
  router.post('/scenarios/:scenario', authenticateToken, async (req, res): Promise<void> => {
    try {
      const { scenario } = req.params;
      const { WerewolfFactories } = await import('../factories/werewolf-factories');

      let scenarioData;

      switch (scenario) {
        case 'full-moon-pack':
          scenarioData = {
            game: WerewolfFactories.Game.createFullMoonGame(),
            players: [
              WerewolfFactories.Player.createAlphaWerewolf(),
              WerewolfFactories.Player.createWerewolf(),
              WerewolfFactories.Player.createVillager(),
              WerewolfFactories.Player.createVillager(),
            ],
          };
          break;

        case 'new-moon-mystery':
          scenarioData = {
            game: WerewolfFactories.Game.create({ moon_phase: 'new_moon' }),
            players: WerewolfFactories.Player.createGamePlayers('test-game', 6),
          };
          break;

        case 'alpha-showdown':
          scenarioData = {
            game: WerewolfFactories.Game.createActiveGame(),
            players: [
              WerewolfFactories.Player.createAlphaWerewolf(),
              WerewolfFactories.Player.create({ role: 'hunter' }),
              WerewolfFactories.Player.create({ role: 'seer' }),
              WerewolfFactories.Player.create({ role: 'witch' }),
            ],
          };
          break;

        default:
          res.status(400).json({
            error: 'Unknown werewolf scenario',
            available_scenarios: ['full-moon-pack', 'new-moon-mystery', 'alpha-showdown'],
          });
          return;
      }

      res.json({
        success: true,
        scenario,
        data: scenarioData,
        werewolf_status: 'scenario_prepared',
      });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        werewolf_status: 'scenario_failed',
      });
    }
  });

  // Simulate moon phase transitions
  router.post('/moon-phase/:phase', authenticateToken, async (req, res): Promise<void> => {
    try {
      const { phase } = req.params;
      const validPhases = [
        'new_moon',
        'waxing_crescent',
        'first_quarter',
        'waxing_gibbous',
        'full_moon',
        'waning_gibbous',
        'third_quarter',
        'waning_crescent',
      ];

      if (!phase || !validPhases.includes(phase)) {
        res.status(400).json({
          error: 'Invalid moon phase',
          valid_phases: validPhases,
        });
        return;
      }

      // Simulate moon phase effects
      const effects = {
        new_moon: { stealth_bonus: true, vision_penalty: true },
        full_moon: { transformation_bonus: true, pack_coordination: true },
        waxing_crescent: { growth_bonus: true },
        waning_gibbous: { wisdom_bonus: true },
      };

      res.json({
        success: true,
        moon_phase: phase,
        effects: (phase && effects[phase as keyof typeof effects]) || {},
        werewolf_status: `moon_phase_${phase}`,
        next_transition: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Generate test chat messages with werewolf theme
  router.post('/chat/generate/:count', authenticateToken, async (req, res) => {
    try {
      const count = parseInt(req.params.count || '10') || 10;
      const { WerewolfFactories } = await import('../factories/werewolf-factories');

      const messages = Array.from({ length: count }, () => WerewolfFactories.Chat.create());

      res.json({
        success: true,
        messages,
        count: messages.length,
        werewolf_status: 'pack_communication_established',
      });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // Validate werewolf game rules
  router.post('/validate/rules', async (req, res) => {
    try {
      const { players, settings } = req.body;

      const validation = {
        player_count_valid: players.length >= 4 && players.length <= 20,
        werewolf_ratio_valid: settings.werewolf_ratio >= 0.15 && settings.werewolf_ratio <= 0.45,
        min_werewolves: Math.floor(players.length * 0.15),
        max_werewolves: Math.floor(players.length * 0.45),
        special_roles_balanced: true, // Would implement actual balance checking
        moon_phase_compatible: settings.moon_phase_effects ? true : 'disabled',
      };

      const isValid = Object.values(validation).every(
        v => v === true || typeof v === 'number' || typeof v === 'string'
      );

      res.json({
        success: true,
        validation,
        is_valid: isValid,
        werewolf_status: isValid ? 'rules_validated' : 'rules_violation',
      });
    } catch (error: unknown) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  return router;
}

/**
 * Test database configuration helper
 */
export async function setupTestDatabase(): Promise<void> {
  const { testDb } = await import('../test-database');
  await testDb.setup();
}

/**
 * Clean up test database
 */
export async function cleanupTestDatabase(): Promise<void> {
  const { testDb } = await import('../test-database');
  await testDb.cleanup();
}

/**
 * Create authenticated test request headers
 */
export function createAuthHeaders(token: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'X-Werewolf-Game-Token': 'test-token',
  };
}

/**
 * Mock Socket.IO server for testing
 */
export function createTestSocketServer(httpServer: any): any {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Server } = require('socket.io');

  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['polling'], // Use polling for tests to avoid WebSocket issues
  });

  // Mock werewolf-specific socket events
  io.on('connection', (socket: any) => {
    console.log('🐺 Test werewolf joined the pack:', socket.id);

    socket.on('join_pack', (data: any) => {
      socket.join(`game:${data.gameId}`);
      socket.emit('pack_joined', {
        success: true,
        pack_id: data.gameId,
        werewolf_status: 'pack_member',
      });
    });

    socket.on('werewolf_howl', (data: any) => {
      socket.to(`game:${data.gameId}`).emit('pack_howl_received', {
        from: socket.id,
        message: data.message,
        moon_phase: data.moon_phase || 'full_moon',
      });
    });

    socket.on('night_action', (data: any) => {
      socket.emit('night_action_received', {
        success: true,
        action: data.action,
        target: data.target,
        werewolf_status: 'action_executed',
      });
    });

    socket.on('disconnect', () => {
      console.log('🌙 Werewolf left the pack:', socket.id);
    });
  });

  return io;
}
