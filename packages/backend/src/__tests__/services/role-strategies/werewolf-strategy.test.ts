import { WerewolfStrategy } from '../../../services/role-strategies/werewolf-strategy';
import { WerewolfFactories } from '../../factories/werewolf-factories';
import { testDb } from '../../test-database';

describe('WerewolfStrategy', () => {
  let werewolfStrategy: WerewolfStrategy;
  let mockGameData: any;
  let mockWerewolfPlayer: any;
  let mockVillagerPlayer: any;

  beforeEach(async () => {
    werewolfStrategy = new WerewolfStrategy();
    
    // Create test game data
    mockGameData = {
      game: WerewolfFactories.Game.createActiveGame({
        current_phase: 'night',
        moon_phase: 'full_moon',
      }),
      players: [],
    };

    mockWerewolfPlayer = WerewolfFactories.Player.createWerewolf({
      game_id: mockGameData.game.id,
      is_alive: true,
    });

    mockVillagerPlayer = WerewolfFactories.Player.createVillager({
      game_id: mockGameData.game.id,
      is_alive: true,
    });

    mockGameData.players = [mockWerewolfPlayer, mockVillagerPlayer];
  });

  describe('canUseNightAbility', () => {
    it('should allow werewolf to use night ability during night phase', () => {
      const result = werewolfStrategy.canUseNightAbility(
        mockWerewolfPlayer,
        mockGameData
      );

      expect(result).toBe(true);
    });

    it('should not allow werewolf to use ability during day phase', () => {
      mockGameData.game.current_phase = 'day';

      const result = werewolfStrategy.canUseNightAbility(
        mockWerewolfPlayer,
        mockGameData
      );

      expect(result).toBe(false);
    });

    it('should not allow dead werewolf to use ability', () => {
      mockWerewolfPlayer.is_alive = false;

      const result = werewolfStrategy.canUseNightAbility(
        mockWerewolfPlayer,
        mockGameData
      );

      expect(result).toBe(false);
    });

    it('should provide pack hunting bonus during full moon', () => {
      mockGameData.game.moon_phase = 'full_moon';
      mockGameData.game.settings = { pack_hunting_enabled: true };

      const result = werewolfStrategy.canUseNightAbility(
        mockWerewolfPlayer,
        mockGameData
      );

      expect(result).toBe(true);
      // Additional checks for pack bonus could be added here
    });
  });

  describe('executeNightAction', () => {
    it('should successfully execute werewolf kill action', async () => {
      const targetId = mockVillagerPlayer.id;

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        targetId,
        mockGameData
      );

      expect(result.success).toBe(true);
      expect(result.action).toBe('werewolf_kill');
      expect(result.target_id).toBe(targetId);
      expect(result.details.victim_role).toBeDefined();
      expect(result.details.moon_phase_bonus).toBeDefined();
    });

    it('should not allow werewolf to target another werewolf', async () => {
      const anotherWerewolf = WerewolfFactories.Player.createWerewolf({
        game_id: mockGameData.game.id,
      });
      mockGameData.players.push(anotherWerewolf);

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        anotherWerewolf.id,
        mockGameData
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('werewolf');
    });

    it('should not allow targeting dead players', async () => {
      mockVillagerPlayer.is_alive = false;

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        mockVillagerPlayer.id,
        mockGameData
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('dead');
    });

    it('should apply full moon bonus when conditions are met', async () => {
      mockGameData.game.moon_phase = 'full_moon';
      mockGameData.game.settings = { 
        pack_hunting_enabled: true,
        moon_phase_effects: true,
      };

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        mockVillagerPlayer.id,
        mockGameData
      );

      expect(result.success).toBe(true);
      expect(result.details.moon_phase_bonus).toBe(true);
      expect(result.details.pack_coordination).toBeDefined();
    });

    it('should handle pack coordination with multiple werewolves', async () => {
      const packMember = WerewolfFactories.Player.createWerewolf({
        game_id: mockGameData.game.id,
        pack_rank: 'beta',
      });
      mockWerewolfPlayer.pack_rank = 'alpha';
      mockGameData.players.push(packMember);

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        mockVillagerPlayer.id,
        mockGameData
      );

      expect(result.success).toBe(true);
      expect(result.details.pack_coordination).toBe(true);
      expect(result.details.pack_size).toBe(2);
    });
  });

  describe('getWinCondition', () => {
    it('should return werewolf win condition', () => {
      const condition = werewolfStrategy.getWinCondition();

      expect(condition.team).toBe('werewolf');
      expect(condition.description).toContain('werewolves');
      expect(condition.check_function).toBeDefined();
    });

    it('should correctly identify werewolf victory scenario', () => {
      // Create scenario where werewolves equal or outnumber villagers
      const werewolves = [
        WerewolfFactories.Player.createWerewolf({ is_alive: true }),
        WerewolfFactories.Player.createWerewolf({ is_alive: true }),
      ];
      const villagers = [
        WerewolfFactories.Player.createVillager({ is_alive: true }),
      ];

      const allPlayers = [...werewolves, ...villagers];
      const condition = werewolfStrategy.getWinCondition();
      
      const hasWon = condition.check_function(allPlayers);
      expect(hasWon).toBe(true);
    });

    it('should correctly identify ongoing game scenario', () => {
      // Create scenario where villagers outnumber werewolves
      const werewolves = [
        WerewolfFactories.Player.createWerewolf({ is_alive: true }),
      ];
      const villagers = [
        WerewolfFactories.Player.createVillager({ is_alive: true }),
        WerewolfFactories.Player.createVillager({ is_alive: true }),
        WerewolfFactories.Player.createVillager({ is_alive: true }),
      ];

      const allPlayers = [...werewolves, ...villagers];
      const condition = werewolfStrategy.getWinCondition();
      
      const hasWon = condition.check_function(allPlayers);
      expect(hasWon).toBe(false);
    });
  });

  describe('validateTarget', () => {
    it('should validate legitimate target', () => {
      const isValid = werewolfStrategy.validateTarget(
        mockWerewolfPlayer,
        mockVillagerPlayer.id,
        mockGameData
      );

      expect(isValid).toBe(true);
    });

    it('should reject invalid target (werewolf)', () => {
      const anotherWerewolf = WerewolfFactories.Player.createWerewolf({
        game_id: mockGameData.game.id,
      });
      mockGameData.players.push(anotherWerewolf);

      const isValid = werewolfStrategy.validateTarget(
        mockWerewolfPlayer,
        anotherWerewolf.id,
        mockGameData
      );

      expect(isValid).toBe(false);
    });

    it('should reject self-targeting', () => {
      const isValid = werewolfStrategy.validateTarget(
        mockWerewolfPlayer,
        mockWerewolfPlayer.id,
        mockGameData
      );

      expect(isValid).toBe(false);
    });

    it('should reject dead player targets', () => {
      mockVillagerPlayer.is_alive = false;

      const isValid = werewolfStrategy.validateTarget(
        mockWerewolfPlayer,
        mockVillagerPlayer.id,
        mockGameData
      );

      expect(isValid).toBe(false);
    });
  });

  describe('werewolf-specific abilities', () => {
    it('should handle alpha werewolf special abilities', async () => {
      const alphaWerewolf = WerewolfFactories.Player.createAlphaWerewolf({
        game_id: mockGameData.game.id,
      });

      const result = await werewolfStrategy.executeNightAction(
        alphaWerewolf,
        mockVillagerPlayer.id,
        mockGameData
      );

      expect(result.success).toBe(true);
      expect(result.details.alpha_bonus).toBe(true);
      expect(result.details.pack_leadership).toBeDefined();
    });

    it('should handle territory bonuses for werewolves', async () => {
      mockWerewolfPlayer.territory_bonus_active = true;
      mockGameData.game.settings = { territory_bonuses: true };

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        mockVillagerPlayer.id,
        mockGameData
      );

      expect(result.success).toBe(true);
      expect(result.details.territory_advantage).toBe(true);
    });

    it('should track werewolf transformation progress', async () => {
      mockWerewolfPlayer.transformation_progress = 0.5;

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        mockVillagerPlayer.id,
        mockGameData
      );

      expect(result.success).toBe(true);
      expect(result.details.transformation_complete).toBeDefined();
      expect(typeof result.details.transformation_progress).toBe('number');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle missing target gracefully', async () => {
      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        'non-existent-id',
        mockGameData
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should handle corrupted game data', async () => {
      const corruptedGameData = { ...mockGameData, players: null };

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        mockVillagerPlayer.id,
        corruptedGameData
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should validate moon phase effects correctly', () => {
      mockGameData.game.moon_phase = 'new_moon';
      mockGameData.game.settings = { moon_phase_effects: true };

      const canAct = werewolfStrategy.canUseNightAbility(
        mockWerewolfPlayer,
        mockGameData
      );

      // New moon should provide different abilities than full moon
      expect(typeof canAct).toBe('boolean');
    });
  });
});