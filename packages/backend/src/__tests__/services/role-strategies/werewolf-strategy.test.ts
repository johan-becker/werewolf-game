import { WerewolfStrategy } from '../../../services/role-strategies/werewolf-strategy';
import { WerewolfFactories } from '../../factories/werewolf-factories';

describe('WerewolfStrategy', () => {
  let werewolfStrategy: WerewolfStrategy;
  let mockGameData: any;
  let mockWerewolfPlayer: any;
  let mockVillagerPlayer: any;
  let mockGameState: any;

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

    // Create mock game state compatible with WerewolfGameState interface
    mockGameState = {
      gameId: mockGameData.game.id,
      phase: 'NIGHT' as const,
      dayNumber: 1,
      nightNumber: 1,
      currentNightPhase: 'WEREWOLF_PHASE' as any,
      pendingActions: [],
      completedActions: [],
      votingInProgress: false,
      votes: [],
      lastNightResults: {
        deaths: [],
        protections: [],
        investigations: [],
      },
    };
  });

  describe('canUseNightAbility', () => {
    it('should allow werewolf to use night ability during night phase', () => {
      const result = werewolfStrategy.canUseNightAbility(mockWerewolfPlayer, mockGameState);

      expect(result).toBe(true);
    });

    it('should not allow werewolf to use ability during day phase', () => {
      mockGameState.phase = 'DAY';

      const result = werewolfStrategy.canUseNightAbility(mockWerewolfPlayer, mockGameState);

      expect(result).toBe(false);
    });

    it('should not allow dead werewolf to use ability', () => {
      mockWerewolfPlayer.is_alive = false;
      mockWerewolfPlayer.isAlive = false; // Also set the camelCase version

      const result = werewolfStrategy.canUseNightAbility(mockWerewolfPlayer, mockGameState);

      expect(result).toBe(false);
    });
  });

  describe('executeNightAction', () => {
    it('should successfully execute werewolf kill action', async () => {
      const targetId = mockVillagerPlayer.id;

      const nightAction = {
        id: 'test-action-1',
        gameId: mockGameData.game.id,
        playerId: mockWerewolfPlayer.id,
        actionType: 'WEREWOLF_KILL' as any,
        actorId: mockWerewolfPlayer.id,
        targetId: targetId,
        phase: 'WEREWOLF_PHASE' as any,
        dayNumber: 1,
        timestamp: new Date(),
        resolved: false,
      };

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        nightAction,
        [mockWerewolfPlayer, mockVillagerPlayer],
        mockGameState
      );

      expect(result.success).toBe(true);
      expect(result.message).toContain('angegriffen');
      expect(result.effects?.deaths).toContain(targetId);
    });

    it('should not allow werewolf to target another werewolf', async () => {
      const anotherWerewolf = WerewolfFactories.Player.createWerewolf({
        game_id: mockGameData.game.id,
      });

      const nightAction = {
        id: 'test-action-2',
        gameId: mockGameData.game.id,
        playerId: mockWerewolfPlayer.id,
        actionType: 'WEREWOLF_KILL' as any,
        actorId: mockWerewolfPlayer.id,
        targetId: anotherWerewolf.id,
        phase: 'WEREWOLF_PHASE' as any,
        dayNumber: 1,
        timestamp: new Date(),
        resolved: false,
      };

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        nightAction,
        [mockWerewolfPlayer, mockVillagerPlayer, anotherWerewolf],
        mockGameState
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain('Werwölfe');
    });

    it('should not allow targeting dead players', async () => {
      mockVillagerPlayer.isAlive = false;

      const nightAction = {
        id: 'test-action-3',
        gameId: mockGameData.game.id,
        playerId: mockWerewolfPlayer.id,
        actionType: 'WEREWOLF_KILL' as any,
        actorId: mockWerewolfPlayer.id,
        targetId: mockVillagerPlayer.id,
        phase: 'WEREWOLF_PHASE' as any,
        dayNumber: 1,
        timestamp: new Date(),
        resolved: false,
      };

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        nightAction,
        [mockWerewolfPlayer, mockVillagerPlayer],
        mockGameState
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain('toten');
    });

    it('should handle missing target gracefully', async () => {
      const nightAction = {
        id: 'test-action-missing',
        gameId: mockGameData.game.id,
        playerId: mockWerewolfPlayer.id,
        actionType: 'WEREWOLF_KILL' as any,
        actorId: mockWerewolfPlayer.id,
        targetId: 'non-existent-id',
        phase: 'WEREWOLF_PHASE' as any,
        dayNumber: 1,
        timestamp: new Date(),
        resolved: false,
      };

      const result = await werewolfStrategy.executeNightAction(
        mockWerewolfPlayer,
        nightAction,
        [mockWerewolfPlayer, mockVillagerPlayer],
        mockGameState
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain('nicht gefunden');
    });
  });

  describe('getWinCondition', () => {
    it('should return null as documented', () => {
      const condition = werewolfStrategy.getWinCondition(mockGameState);
      expect(condition).toBeNull();
    });
  });

  describe('validateTarget', () => {
    it('should validate during werewolf phase', () => {
      const nightAction = {
        id: 'test-validate',
        gameId: mockGameData.game.id,
        playerId: mockWerewolfPlayer.id,
        actionType: 'WEREWOLF_KILL' as any,
        actorId: mockWerewolfPlayer.id,
        targetId: mockVillagerPlayer.id,
        phase: 'WEREWOLF_PHASE' as any,
        dayNumber: 1,
        timestamp: new Date(),
        resolved: false,
      };

      const isValid = werewolfStrategy.validateTarget(nightAction, mockGameState);
      expect(isValid).toBe(true);
    });

    it('should reject during day phase', () => {
      mockGameState.phase = 'DAY';
      mockGameState.currentNightPhase = undefined;

      const nightAction = {
        id: 'test-validate-day',
        gameId: mockGameData.game.id,
        playerId: mockWerewolfPlayer.id,
        actionType: 'WEREWOLF_KILL' as any,
        actorId: mockWerewolfPlayer.id,
        targetId: mockVillagerPlayer.id,
        phase: 'WEREWOLF_PHASE' as any,
        dayNumber: 1,
        timestamp: new Date(),
        resolved: false,
      };

      const isValid = werewolfStrategy.validateTarget(nightAction, mockGameState);
      expect(isValid).toBe(false);
    });
  });
});
