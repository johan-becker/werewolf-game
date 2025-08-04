import { WerewolfGameManager } from '../../services/werewolf-game-manager.service';
import { WerewolfFactories } from '../factories/werewolf-factories';

describe('WerewolfGameManager', () => {
  let gameManager: WerewolfGameManager;
  let mockGame: any;
  let mockPlayers: any[];

  beforeEach(async () => {
    gameManager = new WerewolfGameManager();

    // Create test game with werewolf theme
    mockGame = WerewolfFactories.Game.createActiveGame({
      current_phase: 'night',
      moon_phase: 'full_moon',
      settings: {
        night_length_minutes: 5,
        day_length_minutes: 10,
        werewolf_ratio: 0.25,
        pack_hunting_enabled: true,
        moon_phase_effects: true,
        territory_bonuses: true,
      },
    });

    // Create diverse werewolf players
    mockPlayers = [
      WerewolfFactories.Player.createAlphaWerewolf({
        game_id: mockGame.id,
        position: 0,
        is_host: true,
      }),
      WerewolfFactories.Player.createWerewolf({
        game_id: mockGame.id,
        position: 1,
        pack_rank: 'beta',
      }),
      WerewolfFactories.Player.createVillager({
        game_id: mockGame.id,
        position: 2,
        role: 'seer',
      }),
      WerewolfFactories.Player.createVillager({
        game_id: mockGame.id,
        position: 3,
        role: 'witch',
      }),
      WerewolfFactories.Player.createVillager({
        game_id: mockGame.id,
        position: 4,
      }),
      WerewolfFactories.Player.createVillager({
        game_id: mockGame.id,
        position: 5,
      }),
    ];
  });

  describe('Game Initialization', () => {
    it('should initialize werewolf game with proper role distribution', async () => {
      const result = await gameManager.initializeGame(mockGame.id, mockPlayers);

      expect(result.success).toBe(true);
      expect(result.werewolf_count).toBeGreaterThan(0);
      expect(result.villager_count).toBeGreaterThan(0);
      expect(result.special_roles).toBeDefined();
      expect(result.moon_phase).toBe(mockGame.moon_phase);
    });

    it('should assign werewolf roles according to ratio settings', async () => {
      const result = await gameManager.initializeGame(mockGame.id, mockPlayers);
      const expectedWerewolves = Math.floor(mockPlayers.length * mockGame.settings.werewolf_ratio);

      expect(result.werewolf_count).toBeGreaterThanOrEqual(1);
      expect(result.werewolf_count).toBeLessThanOrEqual(expectedWerewolves + 1);
    });

    it('should create proper pack hierarchy for werewolves', async () => {
      const result = await gameManager.initializeGame(mockGame.id, mockPlayers);

      expect(result.pack_structure).toBeDefined();
      expect(result.pack_structure.alpha).toBeDefined();
      expect(result.pack_structure.members).toBeInstanceOf(Array);
    });

    it('should apply moon phase effects during initialization', async () => {
      mockGame.settings.moon_phase_effects = true;

      const result = await gameManager.initializeGame(mockGame.id, mockPlayers);

      expect(result.moon_phase_bonuses).toBeDefined();
      expect(result.transformation_schedule).toBeDefined();
    });
  });

  describe('Phase Management', () => {
    beforeEach(async () => {
      await gameManager.initializeGame(mockGame.id, mockPlayers);
    });

    it('should transition from night to day phase correctly', async () => {
      const result = await gameManager.advancePhase(mockGame.id);

      expect(result.success).toBe(true);
      expect(result.new_phase).toBe('day');
      expect(result.phase_duration).toBe(mockGame.settings.day_length_minutes);
      expect(result.night_results).toBeDefined();
    });

    it('should process werewolf night actions during phase transition', async () => {
      // Simulate werewolf actions
      await gameManager.submitNightAction(mockGame.id, mockPlayers[0].id, {
        action: 'werewolf_kill',
        target_id: mockPlayers[2].id,
      });

      const result = await gameManager.advancePhase(mockGame.id);

      expect(result.success).toBe(true);
      expect(result.night_results.werewolf_kills).toBeDefined();
      expect(result.night_results.casualties).toBeInstanceOf(Array);
    });

    it('should handle pack coordination during night phase', async () => {
      // Multiple werewolves coordinate
      await gameManager.submitNightAction(mockGame.id, mockPlayers[0].id, {
        action: 'werewolf_kill',
        target_id: mockPlayers[2].id,
        pack_coordination: true,
      });

      await gameManager.submitNightAction(mockGame.id, mockPlayers[1].id, {
        action: 'werewolf_support',
        target_id: mockPlayers[2].id,
      });

      const result = await gameManager.advancePhase(mockGame.id);

      expect(result.success).toBe(true);
      expect(result.night_results.pack_bonus_applied).toBe(true);
    });

    it('should apply territory bonuses when enabled', async () => {
      mockGame.settings.territory_bonuses = true;
      mockPlayers[0].territory_bonus_active = true;

      await gameManager.submitNightAction(mockGame.id, mockPlayers[0].id, {
        action: 'werewolf_kill',
        target_id: mockPlayers[2].id,
      });

      const result = await gameManager.advancePhase(mockGame.id);

      expect(result.success).toBe(true);
      expect(result.night_results.territory_bonuses).toBeDefined();
    });
  });

  describe('Win Condition Checking', () => {
    beforeEach(async () => {
      await gameManager.initializeGame(mockGame.id, mockPlayers);
    });

    it('should detect werewolf victory when they equal villagers', async () => {
      // Simulate eliminating villagers
      mockPlayers[2].is_alive = false;
      mockPlayers[3].is_alive = false;
      mockPlayers[4].is_alive = false;
      mockPlayers[5].is_alive = false;

      const result = await gameManager.checkWinConditions(mockGame.id, mockPlayers);

      expect(result.game_ended).toBe(true);
      expect(result.winning_team).toBe('werewolf');
      expect(result.victory_type).toBe('elimination');
    });

    it('should detect villager victory when all werewolves eliminated', async () => {
      // Eliminate all werewolves
      mockPlayers[0].is_alive = false;
      mockPlayers[1].is_alive = false;

      const result = await gameManager.checkWinConditions(mockGame.id, mockPlayers);

      expect(result.game_ended).toBe(true);
      expect(result.winning_team).toBe('villager');
      expect(result.victory_type).toBe('elimination');
    });

    it('should handle special role victory conditions', async () => {
      // Test cupid lovers victory scenario
      const cupidPlayer = WerewolfFactories.Player.create({
        game_id: mockGame.id,
        role: 'cupid',
        is_alive: true,
      });
      mockPlayers.push(cupidPlayer);

      // Simulate lovers scenario
      const result = await gameManager.checkWinConditions(mockGame.id, mockPlayers, {
        special_conditions: { lovers_alive: true, others_eliminated: true },
      });

      expect(result.game_ended).toBe(true);
      expect(result.winning_team).toBe('lovers');
    });

    it('should continue game when no win conditions met', async () => {
      const result = await gameManager.checkWinConditions(mockGame.id, mockPlayers);

      expect(result.game_ended).toBe(false);
      expect(result.winning_team).toBeNull();
    });
  });

  describe('Werewolf-Specific Mechanics', () => {
    beforeEach(async () => {
      await gameManager.initializeGame(mockGame.id, mockPlayers);
    });

    it('should handle transformation progression', async () => {
      const result = await gameManager.processTransformation(mockGame.id, mockPlayers[0].id);

      expect(result.success).toBe(true);
      expect(result.transformation_progress).toBeGreaterThan(0);
      expect(result.abilities_unlocked).toBeDefined();
    });

    it('should manage pack communication channels', async () => {
      const result = await gameManager.enablePackCommunication(mockGame.id);

      expect(result.success).toBe(true);
      expect(result.werewolf_chat_enabled).toBe(true);
      expect(result.pack_members).toBeInstanceOf(Array);
    });

    it('should calculate moon phase effects on gameplay', async () => {
      const phases = ['new_moon', 'full_moon', 'waxing_crescent', 'waning_gibbous'];

      for (const phase of phases) {
        mockGame.moon_phase = phase;
        const result = await gameManager.calculateMoonPhaseEffects(mockGame);

        expect(result.phase).toBe(phase);
        expect(result.werewolf_bonuses).toBeDefined();
        expect(result.transformation_modifiers).toBeDefined();
      }
    });

    it('should handle alpha werewolf special privileges', async () => {
      const alphaPlayer = mockPlayers.find(p => p.pack_rank === 'alpha');

      const result = await gameManager.executeAlphaAbility(mockGame.id, alphaPlayer.id, {
        ability: 'pack_rally',
        targets: mockPlayers.filter(p => p.werewolf_team === 'werewolf').map(p => p.id),
      });

      expect(result.success).toBe(true);
      expect(result.pack_bonuses_applied).toBe(true);
      expect(result.affected_werewolves).toBeGreaterThan(0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle invalid game state gracefully', async () => {
      const result = await gameManager.initializeGame('invalid-game-id', mockPlayers);

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should prevent invalid night actions', async () => {
      await gameManager.initializeGame(mockGame.id, mockPlayers);

      const result = await gameManager.submitNightAction(mockGame.id, mockPlayers[0].id, {
        action: 'invalid_action',
        target_id: mockPlayers[1].id,
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('invalid');
    });

    it('should handle disconnected players during critical phases', async () => {
      await gameManager.initializeGame(mockGame.id, mockPlayers);

      const result = await gameManager.handlePlayerDisconnection(mockGame.id, mockPlayers[0].id);

      expect(result.success).toBe(true);
      expect(result.game_continues).toBeDefined();
      expect(result.replacement_needed).toBeDefined();
    });

    it('should maintain game integrity with corrupted player data', async () => {
      const corruptedPlayers = [...mockPlayers];
      corruptedPlayers[0] = { ...corruptedPlayers[0], role: null };

      const result = await gameManager.initializeGame(mockGame.id, corruptedPlayers);

      expect(result.success).toBe(false);
      expect(result.error).toContain('corrupted');
    });
  });

  describe('Performance and Scalability', () => {
    it('should handle large werewolf games efficiently', async () => {
      const largePlayers = WerewolfFactories.Player.createGamePlayers(mockGame.id, 20);

      const startTime = Date.now();
      const result = await gameManager.initializeGame(mockGame.id, largePlayers);
      const endTime = Date.now();

      expect(result.success).toBe(true);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
    });

    it('should batch process multiple night actions efficiently', async () => {
      await gameManager.initializeGame(mockGame.id, mockPlayers);

      const actions = mockPlayers
        .filter(p => p.werewolf_team === 'werewolf')
        .map(p => ({
          player_id: p.id,
          action: 'werewolf_kill',
          target_id: mockPlayers.find(t => t.werewolf_team === 'villager').id,
        }));

      const result = await gameManager.batchProcessNightActions(mockGame.id, actions);

      expect(result.success).toBe(true);
      expect(result.processed_count).toBe(actions.length);
    });
  });
});
