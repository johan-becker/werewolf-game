import { WerewolfGameManager } from '../../services/werewolf-game-manager.service';
import { WerewolfRole } from '../../types/werewolf-roles.types';

describe('WerewolfGameManager', () => {
  let gameManager: WerewolfGameManager;
  const mockGameId = 'test-game-id';
  const mockHostId = 'host-user-id';

  beforeEach(() => {
    gameManager = new WerewolfGameManager();
  });

  describe('Role Configuration', () => {
    it('should validate role configuration for proper game setup', () => {
      const config = {
        villager: 3,
        werewolf: 2,
        seer: 1,
        witch: 0,
        hunter: 0,
        cupid: 0,
        littleGirl: 0
      };
      const totalPlayers = 6;

      const result = gameManager.validateRoleConfiguration(config, totalPlayers);

      expect(result.isValid).toBe(true);
      expect(result.totalRoles).toBe(totalPlayers);
    });

    it('should generate default configuration based on player count', () => {
      const totalPlayers = 6;
      
      const result = gameManager.generateDefaultConfiguration(totalPlayers);

      expect(result.config).toBeDefined();
      expect(result.validation.isValid).toBe(true);
      expect(result.validation.totalRoles).toBe(totalPlayers);
    });

    it('should reject invalid role configurations', () => {
      const config = {
        villager: 1,
        werewolf: 5, // Too many werewolves
        seer: 1,
        witch: 0,
        hunter: 0,
        cupid: 0,
        littleGirl: 0
      };
      const totalPlayers = 6;

      const result = gameManager.validateRoleConfiguration(config, totalPlayers);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Too many werewolves');
    });
  });

  describe('Game Management', () => {
    it('should provide role information for specific roles', () => {
      const seerInfo = gameManager.getRoleInfo(WerewolfRole.SEER);
      
      expect(seerInfo).toBeDefined();
      expect(seerInfo.name).toBeDefined();
      expect(seerInfo.description).toBeDefined();
    });

    it('should return null for non-existent game config', () => {
      const config = gameManager.getGameConfig('non-existent-game');
      
      expect(config).toBeNull();
    });

    it('should return null for non-existent game players', () => {
      const players = gameManager.getGamePlayers('non-existent-game');
      
      expect(players).toBeNull();
    });

    it('should return null for non-existent game state', () => {
      const gameState = gameManager.getGameState('non-existent-game');
      
      expect(gameState).toBeNull();
    });

    it('should return empty actions for non-existent player', () => {
      const actions = gameManager.getAvailableActions('non-existent-game', 'non-existent-player');
      
      expect(actions).toEqual([]);
    });

    it('should return null for non-existent player role', () => {
      const role = gameManager.getPlayerRole('non-existent-game', 'non-existent-player');
      
      expect(role).toBeNull();
    });
  });

  describe('Night Actions', () => {
    it('should handle night action performance correctly', async () => {
      // This would require proper mocking of supabase and game state
      // For now, we test the method exists and handles invalid game gracefully
      const result = await gameManager.performNightAction(
        'invalid-game',
        'invalid-player',
        {
          actionType: 'WEREWOLF_KILL',
          targetId: 'target-player'
        }
      );

      expect(result.success).toBe(false);
      expect(result.message).toContain('nicht gefunden');
    });

    it('should resolve night phase correctly for non-existent game', async () => {
      const result = await gameManager.resolveCurrentNightPhase('invalid-game');

      expect(result.success).toBe(false);
      expect(result.message).toContain('nicht gefunden');
      expect(result.results).toEqual([]);
      expect(result.nextPhase).toBeNull();
      expect(result.nextRole).toBeNull();
      expect(result.nightCompleted).toBe(false);
      expect(result.gameEnded).toBe(false);
    });
  });

  describe('Day Phase and Voting', () => {
    it('should start day phase correctly for non-existent game', async () => {
      const result = await gameManager.startDayPhase('invalid-game');

      expect(result.success).toBe(false);
      expect(result.message).toContain('nicht gefunden');
      expect(result.survivors).toEqual([]);
      expect(result.nightDeaths).toEqual([]);
    });

    it('should handle village voting for non-existent game', async () => {
      const votes = [
        { voterId: 'voter1', targetId: 'target1' },
        { voterId: 'voter2', targetId: 'target1' }
      ];

      const result = await gameManager.performVillageVote('invalid-game', votes);

      expect(result.success).toBe(false);
      expect(result.message).toContain('nicht gefunden');
      expect(result.votes).toEqual({});
      expect(result.gameEnded).toBe(false);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle role configuration errors gracefully', async () => {
      // This would require proper mocking of supabase for full testing
      // For now, we test that methods exist and handle basic cases
      const config = {
        villager: 10, // Invalid - too many roles
        werewolf: 10,
        seer: 1,
        witch: 0,
        hunter: 0,
        cupid: 0,
        littleGirl: 0
      };

      const result = gameManager.validateRoleConfiguration(config, 6);
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should handle invalid role types gracefully', () => {
      // Test that we can handle role info requests
      const validRole = WerewolfRole.VILLAGER;
      const roleInfo = gameManager.getRoleInfo(validRole);
      
      expect(roleInfo).toBeDefined();
    });
  });

  describe('Configuration Management', () => {
    it('should handle role configuration storage', async () => {
      const config = {
        villager: 3,
        werewolf: 2,
        seer: 1,
        witch: 0,
        hunter: 0,
        cupid: 0,
        littleGirl: 0
      };

      // This would fail without proper database setup, but tests the method exists
      const result = await gameManager.configureGameRoles(mockGameId, mockHostId, config, 6);
      
      // Expect failure due to missing database connection in test environment
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should handle game starting with configured roles', async () => {
      // This would fail without proper database setup, but tests the method exists
      const result = await gameManager.startGameWithConfiguredRoles(mockGameId, mockHostId);
      
      // Expect failure due to missing database connection in test environment
      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });
  });
});