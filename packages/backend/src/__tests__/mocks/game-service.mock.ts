import { faker } from '@faker-js/faker';
import { generateGameCode } from '../../utils/gameCode';

/**
 * Mock Game Service for integration tests
 * Provides realistic responses without requiring Supabase connection
 */
export class MockGameService {
  private static games: Map<string, any> = new Map();
  private static players: Map<string, any> = new Map();
  private static gamesByCode: Map<string, string> = new Map(); // code -> gameId

  static async createGame(userId: string, data: any) {
    const gameId = faker.string.uuid();
    const code = generateGameCode();
    
    // Ensure unique code (simplified for tests)
    while (this.gamesByCode.has(code)) {
      // In reality this would be rare, but for tests we'll just try again
    }

    const game = {
      id: gameId,
      name: data.name,
      code,
      max_players: data.maxPlayers || 8,
      status: 'waiting',
      current_phase: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      creator_id: userId,
      game_settings: data.settings || {},
      player_count: 1, // Creator joins automatically
    };

    // Create host player
    const playerId = faker.string.uuid();
    const hostPlayer = {
      id: playerId,
      game_id: gameId,
      user_id: userId,
      is_host: true,
      role: null,
      status: 'alive',
      joined_at: new Date().toISOString(),
    };

    this.games.set(gameId, game);
    this.players.set(playerId, hostPlayer);
    this.gamesByCode.set(code, gameId);

    return {
      success: true,
      message: 'Game created successfully',
      game: {
        ...game,
        settings: game.game_settings, // Map game_settings to settings for API response
      },
      player: hostPlayer,
    };
  }

  static async getGame(gameId: string, userId?: string | undefined) {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    // Get players for this game
    const gamePlayers = Array.from(this.players.values()).filter(
      player => player.game_id === gameId
    );

    return {
      success: true,
      game: {
        ...game,
        settings: game.game_settings, // Map game_settings to settings for API response
        players: gamePlayers,
      },
    };
  }

  static async getGameByCode(code: string) {
    const gameId = this.gamesByCode.get(code);
    if (!gameId) {
      throw new Error('Game not found');
    }
    return this.getGame(gameId);
  }

  static async joinGame(gameId: string, userId: string | undefined) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    if (game.status !== 'waiting') {
      throw new Error('Game has already started');
    }

    const currentPlayers = Array.from(this.players.values()).filter(
      player => player.game_id === gameId
    );

    if (currentPlayers.length >= game.max_players) {
      throw new Error('Game is full');
    }

    // Check if user already in game
    const existingPlayer = currentPlayers.find(player => player.user_id === userId);
    if (existingPlayer) {
      throw new Error('You are already in this game');
    }

    const playerId = faker.string.uuid();
    const player = {
      id: playerId,
      game_id: gameId,
      user_id: userId,
      is_host: false,
      role: null,
      status: 'alive',
      joined_at: new Date().toISOString(),
    };

    this.players.set(playerId, player);

    // Update game player count
    game.player_count = currentPlayers.length + 1;
    game.updated_at = new Date().toISOString();
    this.games.set(gameId, game);

    return {
      success: true,
      message: 'Joined game successfully',
      player,
      game,
    };
  }

  static async joinGameByCode(code: string, userId: string | undefined) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const gameId = this.gamesByCode.get(code);
    if (!gameId) {
      throw new Error('Game not found');
    }
    return this.joinGame(gameId, userId);
  }

  static async leaveGame(gameId: string, userId: string | undefined) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const playerToRemove = Array.from(this.players.values()).find(
      player => player.game_id === gameId && player.user_id === userId
    );

    if (!playerToRemove) {
      throw new Error('You are not in this game');
    }

    // Remove player
    const playerKey = Array.from(this.players.entries()).find(
      ([_, player]) => player.id === playerToRemove.id
    )?.[0];
    
    if (playerKey) {
      this.players.delete(playerKey);
    }

    // Update game player count
    const remainingPlayers = Array.from(this.players.values()).filter(
      player => player.game_id === gameId
    );
    
    game.player_count = remainingPlayers.length;

    // If the leaving player was the host, transfer to another player
    if (playerToRemove.is_host && remainingPlayers.length > 0) {
      const newHost = remainingPlayers[0];
      newHost.is_host = true;
      const newHostKey = Array.from(this.players.entries()).find(
        ([_, player]) => player.id === newHost.id
      )?.[0];
      if (newHostKey) {
        this.players.set(newHostKey, newHost);
      }
    }

    // If no players left, delete the game
    if (remainingPlayers.length === 0) {
      this.games.delete(gameId);
      this.gamesByCode.delete(game.code);
    } else {
      game.updated_at = new Date().toISOString();
      this.games.set(gameId, game);
    }

    return {
      success: true,
      message: 'Left game successfully',
    };
  }

  static async startGame(gameId: string, userId: string | undefined) {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const hostPlayer = Array.from(this.players.values()).find(
      player => player.game_id === gameId && player.user_id === userId && player.is_host
    );

    if (!hostPlayer) {
      throw new Error('Only the host can start the game');
    }

    const gamePlayers = Array.from(this.players.values()).filter(
      player => player.game_id === gameId
    );

    if (gamePlayers.length < 4) {
      throw new Error('minimum 4 players required to start the game');
    }

    // Update game status
    game.status = 'in_progress';
    game.current_phase = 'day';
    game.updated_at = new Date().toISOString();
    this.games.set(gameId, game);

    // Assign roles (simplified for testing)
    const werewolfCount = Math.max(1, Math.floor(gamePlayers.length * 0.25));
    const roles = ['werewolf', ...Array(werewolfCount - 1).fill('werewolf'), ...Array(gamePlayers.length - werewolfCount).fill('villager')];
    
    // Shuffle roles
    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    gamePlayers.forEach((player, index) => {
      player.role = roles[index];
      const playerKey = Array.from(this.players.entries()).find(
        ([_, p]) => p.id === player.id
      )?.[0];
      if (playerKey) {
        this.players.set(playerKey, player);
      }
    });

    return {
      success: true,
      message: 'Game started successfully',
      game,
      role_distribution: {
        werewolf_count: werewolfCount,
        villager_count: gamePlayers.length - werewolfCount,
      },
      moon_phase: 'full_moon',
    };
  }

  static async listGames(userId?: string | undefined) {
    const allGames = Array.from(this.games.values());
    
    // For simplicity, return all games in test environment
    return {
      success: true,
      games: allGames.map(game => ({
        ...game,
        players: Array.from(this.players.values()).filter(
          player => player.game_id === game.id
        ),
      })),
    };
  }

  // Helper methods for testing
  static clearAll() {
    this.games.clear();
    this.players.clear();
    this.gamesByCode.clear();
  }

  static getAllGames() {
    return Array.from(this.games.values());
  }

  static getAllPlayers() {
    return Array.from(this.players.values());
  }

  static getGameById(gameId: string) {
    return this.games.get(gameId);
  }

  static getPlayersByGameId(gameId: string) {
    return Array.from(this.players.values()).filter(
      player => player.game_id === gameId
    );
  }

  static async performNightAction(gameId: string, userId: string, actionData: any) {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const gamePlayers = Array.from(this.players.values()).filter(
      player => player.game_id === gameId
    );

    const player = gamePlayers.find(p => p.user_id === userId);
    if (!player) {
      throw new Error('Player not in this game');
    }

    // Check if game is in night phase
    if (game.current_phase !== 'night') {
      throw new Error('Night actions can only be performed during night phase');
    }

    // Validate target
    const targetPlayer = gamePlayers.find(p => p.id === actionData.target_id);
    if (actionData.target_id && !targetPlayer) {
      throw new Error('Invalid target for night action');
    }

    // For testing purposes, always allow the action
    return {
      success: true,
      action_submitted: true,
      target_id: actionData.target_id,
      pack_coordination: true,
      revealed_info: {
        pack_coordination: true,
      },
      can_proceed: true,
    };
  }

  static async advancePhase(gameId: string, userId: string) {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    const gamePlayers = Array.from(this.players.values()).filter(
      player => player.game_id === gameId
    );

    const player = gamePlayers.find(p => p.user_id === userId);
    if (!player || !player.is_host) {
      throw new Error('Only the host can advance the game phase');
    }

    // Toggle between day and night
    const newPhase = game.current_phase === 'day' ? 'night' : 'day';
    game.current_phase = newPhase;
    game.updated_at = new Date().toISOString();

    this.games.set(gameId, game);

    return {
      success: true,
      message: 'Phase advanced successfully',
      game_state: {
        phase: newPhase,
        game_id: gameId,
        players: gamePlayers,
      },
    };
  }

  static async getMoonPhase(gameId: string) {
    const game = this.games.get(gameId);
    if (!game) {
      throw new Error('Game not found');
    }

    return {
      success: true,
      current_phase: 'full_moon',
      werewolf_bonuses: {
        strength_multiplier: 1.2,
        stealth_bonus: 0.15,
      },
      transformation_effects: {
        intensity: 'high',
        duration_bonus: 10,
      },
      next_phase_transition: '2024-01-15T02:30:00Z',
      territory_bonuses: {
        pack_territory_advantage: true,
        hunting_efficiency: 1.3,
      },
      pack_advantages: {
        communication_range: 'extended',
        coordination_bonus: 0.2,
      },
    };
  }
}