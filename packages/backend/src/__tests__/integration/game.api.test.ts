import request from 'supertest';
import { Express } from 'express';
import { createTestApp } from '../helpers/test-app';
import { WerewolfFactories } from '../factories/werewolf-factories';
import { testDb } from '../test-database';

describe('Werewolf Game API Integration Tests', () => {
  let app: Express;
  let authToken: string;
  let testUser: any;
  let testGame: any;

  beforeAll(async () => {
    app = await createTestApp();
    await testDb.setup();
  });

  beforeEach(async () => {
    // Create test user and authenticate
    testUser = WerewolfFactories.User.create();

    // Register user
    const registerResponse = await request(app).post('/api/auth/register').send({
      username: testUser.username,
      email: testUser.email,
      password: 'WerewolfPack123!',
      display_name: testUser.display_name,
    });

    expect(registerResponse.status).toBe(201);

    // Login to get auth token
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'WerewolfPack123!',
    });

    expect(loginResponse.status).toBe(200);
    authToken = loginResponse.body.token;
  });

  afterEach(async () => {
    await testDb.cleanup();
  });

  afterAll(async () => {
    await testDb.disconnect();
  });

  describe('POST /api/games - Create Werewolf Game', () => {
    it('should create a new werewolf game successfully', async () => {
      const gameData = {
        name: 'Moonlit Village Massacre',
        max_players: 12,
        settings: {
          night_length_minutes: 5,
          day_length_minutes: 10,
          werewolf_ratio: 0.25,
          pack_hunting_enabled: true,
          moon_phase_effects: true,
          territory_bonuses: true,
        },
      };

      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(gameData);

      expect(response.status).toBe(201);
      expect(response.body.game.name).toBe(gameData.name);
      expect(response.body.game.code).toMatch(/^[A-Z0-9]{6,8}$/);
      expect(response.body.game.status).toBe('waiting');
      expect(response.body.game.creator_id).toBe(testUser.id);
      expect(response.body.game.settings.pack_hunting_enabled).toBe(true);
    });

    it('should validate werewolf game settings', async () => {
      const invalidGameData = {
        name: 'Test Game',
        max_players: 25, // Too many players
        settings: {
          werewolf_ratio: 0.8, // Invalid ratio
        },
      };

      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidGameData);

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('max_players');
      expect(response.body.errors).toContain('werewolf_ratio');
    });

    it('should require authentication for game creation', async () => {
      const gameData = WerewolfFactories.Game.create();

      const response = await request(app).post('/api/games').send(gameData);

      expect(response.status).toBe(401);
      expect(response.body.error).toContain('authentication');
    });

    it('should generate unique werewolf game codes', async () => {
      const gameCodes = new Set();

      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .post('/api/games')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            name: `Werewolf Game ${i}`,
            max_players: 8,
          });

        expect(response.status).toBe(201);
        const gameCode = response.body.game.code;
        expect(gameCodes.has(gameCode)).toBe(false);
        gameCodes.add(gameCode);
      }
    });
  });

  describe('POST /api/games/:code/join - Join Werewolf Game', () => {
    beforeEach(async () => {
      // Create a test game
      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Werewolf Game',
          max_players: 8,
        });

      testGame = response.body.game;
    });

    it('should allow player to join werewolf game by code', async () => {
      // Create another user to join
      const joinUser = WerewolfFactories.User.create();

      await request(app).post('/api/auth/register').send({
        username: joinUser.username,
        email: joinUser.email,
        password: 'WerewolfPack123!',
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: joinUser.email,
        password: 'WerewolfPack123!',
      });

      const joinToken = loginResponse.body.token;

      const response = await request(app)
        .post(`/api/games/${testGame.code}/join`)
        .set('Authorization', `Bearer ${joinToken}`);

      expect(response.status).toBe(200);
      expect(response.body.player.game_id).toBe(testGame.id);
      expect(response.body.player.user_id).toBe(joinUser.id);
      expect(response.body.player.is_host).toBe(false);
      expect(response.body.game.player_count).toBe(2);
    });

    it('should not allow joining full werewolf game', async () => {
      // Fill the game to capacity
      testGame.max_players = 1; // Game creator already in

      // Try to join full game
      const joinUser = WerewolfFactories.User.create();
      await request(app).post('/api/auth/register').send({
        username: joinUser.username,
        email: joinUser.email,
        password: 'WerewolfPack123!',
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: joinUser.email,
        password: 'WerewolfPack123!',
      });

      const response = await request(app)
        .post(`/api/games/${testGame.code}/join`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('full');
    });

    it('should not allow joining with invalid game code', async () => {
      const response = await request(app)
        .post('/api/games/INVALID/join')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('not found');
    });

    it('should not allow joining already started game', async () => {
      // Simulate game start
      await request(app)
        .patch(`/api/games/${testGame.id}/start`)
        .set('Authorization', `Bearer ${authToken}`);

      const joinUser = WerewolfFactories.User.create();
      await request(app).post('/api/auth/register').send({
        username: joinUser.username,
        email: joinUser.email,
        password: 'WerewolfPack123!',
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: joinUser.email,
        password: 'WerewolfPack123!',
      });

      const response = await request(app)
        .post(`/api/games/${testGame.code}/join`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('already started');
    });
  });

  describe('PATCH /api/games/:id/start - Start Werewolf Game', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Werewolf Start Test Game',
          max_players: 8,
        });

      testGame = response.body.game;

      // Add more players for a valid game start
      for (let i = 0; i < 4; i++) {
        const player = WerewolfFactories.User.create();
        await request(app).post('/api/auth/register').send({
          username: player.username,
          email: player.email,
          password: 'WerewolfPack123!',
        });

        const loginResponse = await request(app).post('/api/auth/login').send({
          email: player.email,
          password: 'WerewolfPack123!',
        });

        await request(app)
          .post(`/api/games/${testGame.code}/join`)
          .set('Authorization', `Bearer ${loginResponse.body.token}`);
      }
    });

    it('should start werewolf game with proper role distribution', async () => {
      const response = await request(app)
        .patch(`/api/games/${testGame.id}/start`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.game.status).toBe('in_progress');
      expect(response.body.game.current_phase).toBe('day');
      expect(response.body.role_distribution.werewolf_count).toBeGreaterThan(0);
      expect(response.body.role_distribution.villager_count).toBeGreaterThan(0);
      expect(response.body.moon_phase).toBeDefined();
    });

    it('should only allow host to start the game', async () => {
      const nonHostUser = WerewolfFactories.User.create();
      await request(app).post('/api/auth/register').send({
        username: nonHostUser.username,
        email: nonHostUser.email,
        password: 'WerewolfPack123!',
      });

      const loginResponse = await request(app).post('/api/auth/login').send({
        email: nonHostUser.email,
        password: 'WerewolfPack123!',
      });

      const response = await request(app)
        .patch(`/api/games/${testGame.id}/start`)
        .set('Authorization', `Bearer ${loginResponse.body.token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('host');
    });

    it('should require minimum players for werewolf game', async () => {
      // Create game with insufficient players
      const smallGameResponse = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Small Game',
          max_players: 8,
        });

      const smallGame = smallGameResponse.body.game;

      const response = await request(app)
        .patch(`/api/games/${smallGame.id}/start`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('minimum');
    });
  });

  describe('POST /api/games/:id/actions/night - Werewolf Night Actions', () => {
    beforeEach(async () => {
      // Create and start a game
      const gameResponse = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Night Action Test Game',
          max_players: 6,
        });

      testGame = gameResponse.body.game;

      // Add players and start game
      for (let i = 0; i < 4; i++) {
        const player = WerewolfFactories.User.create();
        await request(app).post('/api/auth/register').send({
          username: player.username,
          email: player.email,
          password: 'WerewolfPack123!',
        });

        const loginResponse = await request(app).post('/api/auth/login').send({
          email: player.email,
          password: 'WerewolfPack123!',
        });

        await request(app)
          .post(`/api/games/${testGame.code}/join`)
          .set('Authorization', `Bearer ${loginResponse.body.token}`);
      }

      await request(app)
        .patch(`/api/games/${testGame.id}/start`)
        .set('Authorization', `Bearer ${authToken}`);

      // Advance to night phase
      await request(app)
        .patch(`/api/games/${testGame.id}/phase/advance`)
        .set('Authorization', `Bearer ${authToken}`);
    });

    it('should allow werewolf to submit kill action', async () => {
      // Get game state to find werewolf player
      const gameStateResponse = await request(app)
        .get(`/api/games/${testGame.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      const werewolfPlayer = gameStateResponse.body.players.find(
        (p: any) => p.role === 'werewolf' && p.user_id === testUser.id
      );

      const villagerPlayer = gameStateResponse.body.players.find(
        (p: any) => p.werewolf_team === 'villager'
      );

      if (werewolfPlayer) {
        const response = await request(app)
          .post(`/api/games/${testGame.id}/actions/night`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            action: 'werewolf_kill',
            target_id: villagerPlayer.id,
          });

        expect(response.status).toBe(200);
        expect(response.body.action_submitted).toBe(true);
        expect(response.body.target_id).toBe(villagerPlayer.id);
        expect(response.body.pack_coordination).toBeDefined();
      }
    });

    it('should validate night action targets', async () => {
      const response = await request(app)
        .post(`/api/games/${testGame.id}/actions/night`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          action: 'werewolf_kill',
          target_id: 'invalid-target-id',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('invalid target');
    });

    it('should not allow actions during wrong phase', async () => {
      // Advance to day phase
      await request(app)
        .patch(`/api/games/${testGame.id}/phase/advance`)
        .set('Authorization', `Bearer ${authToken}`);

      const response = await request(app)
        .post(`/api/games/${testGame.id}/actions/night`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          action: 'werewolf_kill',
          target_id: 'some-target-id',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('phase');
    });
  });

  describe('GET /api/games/:id/moon-phase - Moon Phase Information', () => {
    beforeEach(async () => {
      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Moon Phase Test Game',
          max_players: 8,
          settings: {
            moon_phase_effects: true,
          },
        });

      testGame = response.body.game;
    });

    it('should return current moon phase information', async () => {
      const response = await request(app)
        .get(`/api/games/${testGame.id}/moon-phase`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.current_phase).toBeDefined();
      expect(response.body.werewolf_bonuses).toBeDefined();
      expect(response.body.transformation_effects).toBeDefined();
      expect(response.body.next_phase_transition).toBeDefined();
    });

    it('should include pack territory information', async () => {
      const response = await request(app)
        .get(`/api/games/${testGame.id}/moon-phase`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.territory_bonuses).toBeDefined();
      expect(response.body.pack_advantages).toBeDefined();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle malformed werewolf game requests', async () => {
      const response = await request(app)
        .post('/api/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          invalid_field: 'invalid_value',
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should handle database connection issues gracefully', async () => {
      // This would require mocking database failures
      // Implementation depends on your database setup
    });

    it('should rate limit werewolf game creation', async () => {
      // Create multiple games quickly
      const promises = Array.from({ length: 10 }, () =>
        request(app).post('/api/games').set('Authorization', `Bearer ${authToken}`).send({
          name: 'Rate Limit Test',
          max_players: 8,
        })
      );

      const responses = await Promise.all(promises);

      // At least some should be rate limited
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });
  });
});
