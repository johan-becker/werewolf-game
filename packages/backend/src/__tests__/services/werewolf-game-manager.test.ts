import { WerewolfGameManager } from '../../services/werewolf-game-manager.service';
import { WerewolfFactories } from '../factories/werewolf-factories';

// Type definitions for test responses
interface GameInitializationResult {
  success: boolean;
  werewolf_count: number;
  villager_count: number;
  special_roles: unknown[];
  moon_phase: string;
  pack_structure: {
    alpha: unknown;
    members: unknown[];
  };
  moon_phase_bonuses?: unknown;
  transformation_schedule?: unknown;
  error?: string;
}

interface PhaseAdvancementResult {
  success: boolean;
  new_phase: string;
  phase_duration: number;
  night_results: {
    werewolf_kills: string[];
    casualties: string[];
    pack_bonus_applied: boolean;
    territory_bonuses: {
      forest_advantage?: boolean;
    };
  };
}

interface NightActionSubmission {
  action?: string;
  target_id?: string;
  pack_coordination?: boolean;
}

interface NightResults {
  werewolf_kills: string[];
  casualties: string[];
  pack_bonus_applied: boolean;
  territory_bonuses: {
    forest_advantage?: boolean;
  };
}

interface PackStructure {
  alpha: unknown;
  members: unknown[];
}

interface AlphaAbilityData {
  type: string;
  targets?: string[];
}

interface NightActionData {
  action?: string;
  target_id?: string;
}

interface WinConditionResult {
  game_ended: boolean;
  winning_team: string | null;
  victory_type?: string;
}

interface TransformationResult {
  success: boolean;
  transformation_progress: number;
  abilities_unlocked: unknown;
}

interface PackCommunicationResult {
  success: boolean;
  werewolf_chat_enabled: boolean;
  pack_members: unknown[];
}

interface MoonPhaseEffectsResult {
  phase: string;
  werewolf_bonuses: unknown;
  transformation_modifiers: unknown;
}

interface AlphaAbilityResult {
  success: boolean;
  pack_bonuses_applied: boolean;
  affected_werewolves: number;
}

interface DisconnectionResult {
  success: boolean;
  game_continues: boolean;
  replacement_needed: boolean;
}

interface BatchActionResult {
  success: boolean;
  processed_count: number;
}

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

      expect((result as any).success).toBe(true);
      expect((result as any).werewolf_count).toBeGreaterThan(0);
      expect((result as any).villager_count).toBeGreaterThan(0);
      expect((result as any).special_roles).toBeDefined();
      expect((result as any).moon_phase).toBe(mockGame.moon_phase);
    });

    it('should assign werewolf roles according to ratio settings', async () => {
      const result = await gameManager.initializeGame(mockGame.id, mockPlayers);
      const expectedWerewolves = Math.floor(mockPlayers.length * mockGame.settings.werewolf_ratio);

      expect((result as any).werewolf_count).toBeGreaterThanOrEqual(1);
      expect((result as any).werewolf_count).toBeLessThanOrEqual(expectedWerewolves + 1);
    });

    it('should create proper pack hierarchy for werewolves', async () => {
      const result = await gameManager.initializeGame(mockGame.id, mockPlayers);

      expect((result as any).pack_structure).toBeDefined();
      expect((result as any).pack_structure.alpha).toBeDefined();
      expect((result as any).pack_structure.members).toBeInstanceOf(Array);
    });

    it('should apply moon phase effects during initialization', async () => {
      mockGame.settings.moon_phase_effects = true;

      const result = await gameManager.initializeGame(mockGame.id, mockPlayers);

      expect((result as any).moon_phase_bonuses).toBeDefined();
      expect((result as any).transformation_schedule).toBeDefined();
    });
  });

  describe('Phase Management', () => {
    beforeEach(async () => {
      await gameManager.initializeGame(mockGame.id, mockPlayers);
    });

    it('should transition from night to day phase correctly', async () => {
      const result = await gameManager.advancePhase(mockGame.id) as unknown as PhaseAdvancementResult;

      expect(result.success).toBe(true);
      expect(result.new_phase).toBe('day');
      expect(result.phase_duration).toBe(mockGame.settings.day_length_minutes);
      expect(result.night_results).toBeDefined();
    });

    it('should process werewolf night actions during phase transition', async () => {
      // Simulate werewolf actions
      const actionData: NightActionSubmission = {
        action: 'werewolf_kill',
        target_id: mockPlayers[2].id,
      };
      await gameManager.submitNightAction(mockGame.id, mockPlayers[0].id, actionData);

      const result = await gameManager.advancePhase(mockGame.id) as unknown as PhaseAdvancementResult;

      expect(result.success).toBe(true);
      expect((result.night_results as NightResults).werewolf_kills).toBeDefined();
      expect((result.night_results as NightResults).casualties).toBeInstanceOf(Array);
    });

    it('should handle pack coordination during night phase', async () => {
      // Multiple werewolves coordinate
      const coordinatedAction: NightActionSubmission = {
        action: 'werewolf_kill',
        target_id: mockPlayers[2].id,
        pack_coordination: true,
      };
      await gameManager.submitNightAction(mockGame.id, mockPlayers[0].id, coordinatedAction);

      const supportAction: NightActionSubmission = {
        action: 'werewolf_support',
        target_id: mockPlayers[2].id,
      };
      await gameManager.submitNightAction(mockGame.id, mockPlayers[1].id, supportAction);

      const result = await gameManager.advancePhase(mockGame.id) as unknown as PhaseAdvancementResult;

      expect(result.success).toBe(true);
      expect((result.night_results as NightResults).pack_bonus_applied).toBe(true);
    });

    it('should apply territory bonuses when enabled', async () => {
      mockGame.settings.territory_bonuses = true;
      mockPlayers[0].territory_bonus_active = true;

      const territoryAction: NightActionSubmission = {
        action: 'werewolf_kill',
        target_id: mockPlayers[2].id,
      };
      await gameManager.submitNightAction(mockGame.id, mockPlayers[0].id, territoryAction);

      const result = await gameManager.advancePhase(mockGame.id) as unknown as PhaseAdvancementResult;

      expect(result.success).toBe(true);
      expect((result.night_results as NightResults).territory_bonuses).toBeDefined();
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

      const abilityData: AlphaAbilityData = {
        type: 'pack_rally',
        targets: mockPlayers.filter(p => p.werewolf_team === 'werewolf').map(p => p.id),
      };
      const result = await gameManager.executeAlphaAbility(mockGame.id, alphaPlayer.id, abilityData) as unknown as AlphaAbilityResult;

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

      const invalidAction: NightActionData = {
        action: 'invalid_action',
        target_id: mockPlayers[1].id,
      };
      const result = await gameManager.submitNightAction(mockGame.id, mockPlayers[0].id, invalidAction);

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
