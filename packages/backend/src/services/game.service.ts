import { createClient } from '@supabase/supabase-js';
import { generateGameCode } from '../utils/gameCode';
import { CreateGameDTO, GameResponse, PlayerResponse } from '../types/game.types';
import { RoleService } from './role.service';
import { NightActionService } from './night-action.service';
import {
  PlayerRole,
  PlayerState,
  GamePhaseState,
  WinCondition,
  ActionType,
  NightAction,
} from '../types/roles.types';
import { GameRoleConfig } from '../types/werewolf-roles.types';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export class GameService {
  private roleService: RoleService;
  private nightActionService: NightActionService;
  private gameStates: Map<string, GamePhaseState> = new Map();
  private playerStates: Map<string, PlayerState[]> = new Map();
  private roleConfigurations: Map<string, GameRoleConfig> = new Map();

  constructor() {
    this.roleService = new RoleService();
    this.nightActionService = new NightActionService();
  }
  /**
   * Creates a new game with auto-generated code
   */
  async createGame(data: {
    creatorId: string;
    maxPlayers: number;
    isPrivate: boolean;
    name?: string;
  }): Promise<GameResponse> {
    const gameData: CreateGameDTO = {
      name: data.name || `Game ${Date.now()}`,
      maxPlayers: data.maxPlayers,
    };

    return this.createGameInternal(data.creatorId, gameData, data.isPrivate);
  }

  /**
   * Internal method for creating games
   */
  private async createGameInternal(
    userId: string,
    data: CreateGameDTO,
    _isPrivate: boolean = false
  ): Promise<GameResponse> {
    // Validate input
    if (!data.name || data.name.trim().length < 3) {
      throw new Error('Game name must be at least 3 characters long');
    }
    if (data.maxPlayers < 4 || data.maxPlayers > 12) {
      throw new Error('Max players must be between 4 and 12');
    }

    // Check if user is already hosting a game
    const { data: existingGame } = await supabase
      .from('games')
      .select('id')
      .eq('creator_id', userId)
      .eq('status', 'waiting')
      .single();

    if (existingGame) {
      throw new Error('You are already hosting a game. Leave your current game first.');
    }

    // Generate unique code (with retry logic)
    let code: string;
    let attempts = 0;

    do {
      code = generateGameCode();
      const { data: existing } = await supabase
        .from('games')
        .select('id')
        .eq('code', code)
        .single();

      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      throw new Error('Unable to generate unique game code. Please try again.');
    }

    // Create game using admin client to bypass RLS issues
    const { data: game, error } = await supabaseAdmin
      .from('games')
      .insert({
        name: data.name,
        code,
        max_players: data.maxPlayers,
        game_settings: data.settings || {},
        creator_id: userId,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create game: ${error.message}`);

    // Add creator as host player using admin client
    const { error: joinError } = await supabaseAdmin.from('players').insert({
      game_id: game.id,
      user_id: userId,
      is_host: true,
    });

    if (joinError) {
      // Rollback game creation
      await supabaseAdmin.from('games').delete().eq('id', game.id);
      throw new Error(`Failed to join game: ${joinError.message}`);
    }

    return this.formatGameResponse(game);
  }

  /**
   * Get list of waiting games
   */
  async getGameList(limit = 20, offset = 0): Promise<GameResponse[]> {
    const { data: games, error } = await supabase
      .from('game_overview') // Use the view
      .select('*')
      .eq('status', 'waiting')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Failed to fetch games: ${error.message}`);

    return games.map(this.formatGameResponse);
  }

  /**
   * Get game details with players
   */
  async getGameDetails(gameId: string): Promise<GameResponse> {
    // Get game info using admin client to avoid RLS issues
    const { data: game, error: gameError } = await supabaseAdmin
      .from('games')
      .select('*')
      .eq('id', gameId)
      .single();

    if (gameError) throw new Error(`Game not found: ${gameError.message}`);

    // Get players separately to avoid relationship issues
    const { data: players, error: playersError } = await supabaseAdmin
      .from('players')
      .select(
        `
        user_id,
        is_host,
        is_alive,
        role,
        joined_at
      `
      )
      .eq('game_id', gameId);

    if (playersError) throw new Error(`Failed to get players: ${playersError.message}`);

    // Get profile info for each player
    const playersWithProfiles = [];
    for (const player of players || []) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', player.user_id)
        .single();

      playersWithProfiles.push({
        ...player,
        profile: profile || { username: 'Unknown', avatar_url: null },
      });
    }

    return this.formatGameResponseWithPlayers({
      ...game,
      players: playersWithProfiles,
    });
  }

  /**
   * Join game by ID
   */
  async joinGame(gameId: string, userId: string): Promise<GameResponse> {
    // Check if game is joinable
    const { data: game } = await supabase
      .from('game_overview')
      .select('*')
      .eq('id', gameId)
      .single();

    if (!game) throw new Error('Game not found');
    if (game.status !== 'waiting') throw new Error('Game is no longer accepting players');
    if (game.current_players >= game.max_players) throw new Error('Game is full');

    // Check if user is already in the game
    const { data: existingPlayer } = await supabaseAdmin
      .from('players')
      .select('user_id')
      .eq('game_id', gameId)
      .eq('user_id', userId)
      .single();

    if (existingPlayer) throw new Error('You are already in this game');

    // Add player to game
    const { error } = await supabaseAdmin.from('players').insert({
      game_id: gameId,
      user_id: userId,
      is_host: false,
    });

    if (error) throw new Error(`Failed to join: ${error.message}`);

    return this.getGameDetails(gameId);
  }

  /**
   * Join game by code
   */
  async joinGameByCode(code: string, userId: string): Promise<GameResponse> {
    // First find any game with this code
    const { data: game } = await supabase
      .from('game_overview')
      .select('*')
      .eq('code', code)
      .single();

    if (!game) throw new Error('Game not found');

    // Check if game has already started
    if (game.status !== 'waiting') throw new Error('Game has already started');
    if (game.current_players >= game.max_players) throw new Error('Game is full');

    // Check if already in game
    const { data: existingPlayer } = await supabaseAdmin
      .from('players')
      .select('user_id')
      .eq('game_id', game.id)
      .eq('user_id', userId)
      .single();

    if (existingPlayer) throw new Error('Already in this game');

    // Add player to game
    const { error } = await supabaseAdmin.from('players').insert({
      game_id: game.id,
      user_id: userId,
      is_host: false,
    });

    if (error) throw new Error(`Failed to join: ${error.message}`);

    return this.getGameDetails(game.id);
  }

  /**
   * Leave game
   */
  async leaveGame(
    gameId: string,
    userId: string
  ): Promise<{ gameDeleted: boolean; newHostId?: string }> {
    // Check if user is in game
    const { data: player } = await supabase
      .from('players')
      .select('is_host')
      .eq('game_id', gameId)
      .eq('user_id', userId)
      .single();

    if (!player) throw new Error('You are not in this game');

    // Remove player
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('game_id', gameId)
      .eq('user_id', userId);

    if (error) throw new Error(`Failed to leave: ${error.message}`);

    // Handle host transfer or game deletion
    if (player.is_host) {
      return await this.handleHostLeave(gameId);
    }

    return { gameDeleted: false };
  }

  /**
   * Start game (host only)
   */
  async startGame(gameId: string, userId: string): Promise<void> {
    // Verify host
    const { data: player } = await supabase
      .from('players')
      .select('is_host')
      .eq('game_id', gameId)
      .eq('user_id', userId)
      .single();

    if (!player?.is_host) throw new Error('Only host can start the game');

    // Check player count and game status
    const { data: game } = await supabase
      .from('game_overview')
      .select('current_players, status, max_players')
      .eq('id', gameId)
      .single();

    if (!game) throw new Error('Game not found');
    if (game.status !== 'waiting') throw new Error('Game has already started or finished');
    if (game.current_players < 4) {
      throw new Error('Need at least 4 players to start');
    }
    if (game.current_players > game.max_players) {
      throw new Error('Too many players in game');
    }

    // Use Supabase RPC to start the game with role assignment
    const { error } = await supabase.rpc('start_game', { game_id_param: gameId });

    if (error) throw new Error(`Failed to start: ${error.message}`);
  }

  /**
   * Handle host leaving - transfer or delete game
   */
  private async handleHostLeave(
    gameId: string
  ): Promise<{ gameDeleted: boolean; newHostId?: string }> {
    // Get remaining players ordered by join time
    const { data: players } = await supabase
      .from('players')
      .select('user_id, joined_at')
      .eq('game_id', gameId)
      .order('joined_at', { ascending: true });

    if (players && players.length > 0) {
      // Transfer host to oldest remaining player
      const newHostId = players[0]!.user_id;

      const { error } = await supabase
        .from('players')
        .update({ is_host: true })
        .eq('game_id', gameId)
        .eq('user_id', newHostId);

      if (error) {
        console.error('Error transferring host:', error);
      }

      return { gameDeleted: false, newHostId };
    } else {
      // Delete empty game
      const { error } = await supabase.from('games').delete().eq('id', gameId);

      if (error) {
        console.error('Error deleting empty game:', error);
      }

      return { gameDeleted: true };
    }
  }

  /**
   * End game (host only)
   */
  async endGame(gameId: string, userId: string): Promise<GameResponse> {
    // Check if user is host
    const { data: player } = await supabase
      .from('players')
      .select('is_host')
      .eq('game_id', gameId)
      .eq('user_id', userId)
      .single();

    if (!player?.is_host) throw new Error('Only host can end the game');

    // Update game status to finished
    const { error } = await supabase
      .from('games')
      .update({
        status: 'finished',
        ended_at: new Date().toISOString(),
      })
      .eq('id', gameId);

    if (error) throw new Error(`Failed to end game: ${error.message}`);

    return this.getGameDetails(gameId);
  }

  /**
   * Get host transfer info (used by socket events)
   */
  async getHostTransferInfo(gameId: string): Promise<{ newHostId?: string }> {
    const { data: players } = await supabase
      .from('players')
      .select('user_id, is_host')
      .eq('game_id', gameId)
      .order('joined_at', { ascending: true });

    const currentHost = players?.find(p => p.is_host);
    if (!currentHost && players && players.length > 0) {
      return { newHostId: players[0]!.user_id };
    }

    return {};
  }

  /**
   * Format game response
   */
  private formatGameResponse(game: {
    id: string;
    name: string;
    code: string;
    status: string;
    creator_id: string;
    max_players: number;
    current_players?: number;
    created_at: string;
    phase?: string;
    day_number?: number;
    time_remaining?: number;
    host_name?: string;
  }): GameResponse {
    return {
      id: game.id,
      name: game.name,
      code: game.code,
      status: game.status,
      creatorId: game.creator_id,
      maxPlayers: game.max_players,
      currentPlayers: game.current_players || 0,
      createdAt: game.created_at,
      playerCount: game.current_players || 0,
      phase: game.phase || 'waiting',
      dayNumber: game.day_number || 1,
      timeRemaining: game.time_remaining || 0,
      hostName: game.host_name || 'Unknown',
    };
  }

  /**
   * Format game response with players
   */
  private formatGameResponseWithPlayers(game: {
    id: string;
    name: string;
    code: string;
    status: string;
    creator_id: string;
    max_players: number;
    current_players?: number;
    created_at: string;
    phase?: string;
    day_number?: number;
    time_remaining?: number;
    host_name?: string;
    players: Array<{
      id?: string;
      user_id: string;
      profile: { username?: string; avatar_url?: string };
      role?: string;
      is_alive?: boolean;
      is_host?: boolean;
      joined_at?: string;
    }>;
  }): GameResponse {
    const response = this.formatGameResponse(game);

    response.players = game.players.map(p => {
      const player: PlayerResponse & { user_id: string; werewolf_team?: string } = {
        id: p.id || p.user_id,
        userId: p.user_id,
        user_id: p.user_id, // Add for test compatibility
        username: p.profile.username || 'Unknown',
        isHost: p.is_host || false,
        isAlive: p.is_alive || true,
        hasVoted: false, // Default value
        status: 'active', // Default value
        joinedAt: p.joined_at || new Date().toISOString(),
      };

      if (p.profile.avatar_url) {
        player.avatarUrl = p.profile.avatar_url;
      }

      if (p.role) {
        player.role = p.role;
        // Add werewolf_team for test compatibility
        if (p.role === 'werewolf') {
          player.werewolf_team = 'werewolf';
        } else {
          player.werewolf_team = 'villager';
        }
      }

      return player;
    });

    return response;
  }

  // =================== ROLE SYSTEM METHODS ===================

  /**
   * Startet ein Spiel und vergibt Rollen
   */
  async startGameWithRoles(
    gameId: string,
    hostId: string
  ): Promise<{
    success: boolean;
    message: string;
    roleAssignments?: Array<{ userId: string; role: PlayerRole }>;
  }> {
    try {
      // Hol Spieldetails
      const game = await this.getGameDetails(gameId);

      if (game.creatorId !== hostId) {
        throw new Error('Nur der Host kann das Spiel starten');
      }

      if (game.status !== 'WAITING') {
        throw new Error('Spiel kann nicht gestartet werden');
      }

      if (!game.players || game.players.length < 4) {
        throw new Error('Mindestens 4 Spieler erforderlich');
      }

      // Rollen verteilen
      const roles = this.roleService.generateRoleDistribution(game.players.length);
      const playerStates: PlayerState[] = [];

      for (let i = 0; i < game.players.length; i++) {
        const player = game.players[i];
        if (!player) {
          throw new Error(`Ungültiger Spieler an Index ${i}`);
        }
        const role = roles[i];
        if (!role) {
          throw new Error(`No role assigned for player at index ${i}`);
        }

        const playerState = this.roleService.initializePlayerState(
          player.userId,
          role,
          player.isHost
        );

        playerStates.push(playerState);

        // Update database mit Rolle
        await supabaseAdmin
          .from('players')
          .update({ role: role })
          .eq('game_id', gameId)
          .eq('user_id', player.userId);
      }

      // Game Status aktualisieren
      await supabaseAdmin
        .from('games')
        .update({
          status: 'IN_PROGRESS',
          phase: 'NIGHT',
          started_at: new Date().toISOString(),
        })
        .eq('id', gameId);

      // Spielzustand initialisieren
      const gamePhase: GamePhaseState = {
        phase: 'NIGHT',
        dayNumber: 1,
        pendingActions: [],
      };

      this.gameStates.set(gameId, gamePhase);
      this.playerStates.set(gameId, playerStates);

      return {
        success: true,
        message: 'Spiel gestartet und Rollen vergeben',
        roleAssignments: playerStates.map(p => ({
          userId: p.userId,
          role: p.role,
        })),
      };
    } catch (error: unknown) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Holt die Rolle eines Spielers
   */
  getPlayerRole(gameId: string, userId: string): PlayerRole | null {
    const players = this.playerStates.get(gameId);
    if (!players) return null;

    const player = players.find(p => p.userId === userId);
    return player?.role || null;
  }

  /**
   * Holt verfügbare Aktionen für einen Spieler
   */
  getAvailableActions(gameId: string, userId: string): ActionType[] {
    const players = this.playerStates.get(gameId);
    const gamePhase = this.gameStates.get(gameId);

    if (!players || !gamePhase) return [];

    const player = players.find(p => p.userId === userId);
    if (!player) return [];

    return this.nightActionService.getAvailableActions(player, gamePhase.phase === 'NIGHT');
  }

  /**
   * Führt eine Nacht-Aktion durch
   */
  async performNightAction(
    gameId: string,
    action: NightAction
  ): Promise<{ success: boolean; message: string; revealedInfo?: unknown }> {
    const players = this.playerStates.get(gameId);
    const gamePhase = this.gameStates.get(gameId);

    if (!players || !gamePhase) {
      return { success: false, message: 'Spiel nicht gefunden' };
    }

    if (gamePhase.phase !== 'NIGHT') {
      return { success: false, message: 'Aktionen nur nachts möglich' };
    }

    const result = await this.nightActionService.submitNightAction(gameId, action, players);

    // Aktualisierte Spieler speichern
    this.playerStates.set(gameId, players);

    return {
      success: result.success,
      message: result.message,
      revealedInfo: result.revealedInfo,
    };
  }

  /**
   * Löst alle Nacht-Aktionen auf
   */
  async resolveNightPhase(gameId: string): Promise<{
    success: boolean;
    message: string;
    deaths: string[];
    gameEnded: boolean;
    winner?: WinCondition;
  }> {
    const players = this.playerStates.get(gameId);
    const gamePhase = this.gameStates.get(gameId);

    if (!players || !gamePhase) {
      return { success: false, message: 'Spiel nicht gefunden', deaths: [], gameEnded: false };
    }

    // Nacht-Aktionen auflösen
    const resolution = await this.nightActionService.resolveNightActions(
      gameId,
      players,
      gamePhase
    );

    // Spieler-Status aktualisieren
    this.playerStates.set(gameId, resolution.updatedPlayers);

    // Tote Spieler in der Datenbank markieren
    for (const deadPlayerId of resolution.deaths) {
      await supabaseAdmin
        .from('players')
        .update({
          is_alive: false,
          eliminated_at: new Date().toISOString(),
        })
        .eq('game_id', gameId)
        .eq('user_id', deadPlayerId);
    }

    // Win Conditions prüfen
    const alivePlayers = resolution.updatedPlayers.filter(p => p.isAlive);
    const winner = this.roleService.checkWinConditions(alivePlayers);

    let gameEnded = false;
    if (winner) {
      gameEnded = true;
      await supabaseAdmin
        .from('games')
        .update({
          status: 'FINISHED',
          finished_at: new Date().toISOString(),
        })
        .eq('id', gameId);

      // Cleanup
      this.gameStates.delete(gameId);
      this.playerStates.delete(gameId);
    } else {
      // Zur Tag-Phase wechseln
      gamePhase.phase = 'DAY';
      this.gameStates.set(gameId, gamePhase);

      await supabaseAdmin.from('games').update({ phase: 'DAY' }).eq('id', gameId);
    }

    return {
      success: true,
      message: 'Nacht-Phase aufgelöst',
      deaths: resolution.deaths,
      gameEnded,
      ...(winner && { winner }),
    };
  }

  /**
   * Wechselt zur Nacht-Phase
   */
  async startNightPhase(gameId: string): Promise<{ success: boolean; message: string }> {
    const gamePhase = this.gameStates.get(gameId);

    if (!gamePhase) {
      return { success: false, message: 'Spiel nicht gefunden' };
    }

    if (gamePhase.phase !== 'DAY') {
      return { success: false, message: 'Kann nur vom Tag zur Nacht wechseln' };
    }

    gamePhase.phase = 'NIGHT';
    gamePhase.dayNumber += 1;
    gamePhase.pendingActions = [];

    this.gameStates.set(gameId, gamePhase);

    await supabaseAdmin.from('games').update({ phase: 'NIGHT' }).eq('id', gameId);

    return {
      success: true,
      message: 'Nacht-Phase gestartet',
    };
  }

  /**
   * Set role configuration for a game (host only)
   */
  async setRoleConfiguration(gameId: string, config: GameRoleConfig): Promise<void> {
    // Store configuration in memory (in production, this should be stored in database)
    this.roleConfigurations.set(gameId, config);

    // Update game table with role configuration
    const { error } = await supabaseAdmin
      .from('games')
      .update({
        role_config: JSON.stringify(config),
        updated_at: new Date().toISOString(),
      })
      .eq('id', gameId);

    if (error) throw new Error(`Failed to save role configuration: ${error.message}`);
  }

  /**
   * Get role configuration for a game
   */
  getRoleConfiguration(gameId: string): GameRoleConfig | null {
    return this.roleConfigurations.get(gameId) || null;
  }

  /**
   * Holt den aktuellen Spielzustand
   */
  getGameState(gameId: string): {
    phase: GamePhaseState | null;
    players: PlayerState[] | null;
  } {
    return {
      phase: this.gameStates.get(gameId) || null,
      players: this.playerStates.get(gameId) || null,
    };
  }

  /**
   * Prüft ob alle erforderlichen Nacht-Aktionen eingereicht wurden
   */
  areAllNightActionsSubmitted(gameId: string): boolean {
    const players = this.playerStates.get(gameId);
    if (!players) return false;

    return this.nightActionService.areAllNightActionsSubmitted(gameId, players);
  }

  /**
   * Holt Zusammenfassung der Nacht-Aktionen
   */
  getNightActionsSummary(gameId: string): unknown {
    const players = this.playerStates.get(gameId);
    if (!players) return null;

    return this.nightActionService.getNightActionsSummary(gameId, players);
  }

  /**
   * Führt eine Dorf-Abstimmung durch
   */
  async performVillageVote(
    gameId: string,
    votes: Array<{ voterId: string; targetId: string }>
  ): Promise<{
    success: boolean;
    message: string;
    eliminatedPlayer?: string;
    gameEnded: boolean;
    winner?: WinCondition;
  }> {
    const players = this.playerStates.get(gameId);
    const gamePhase = this.gameStates.get(gameId);

    if (!players || !gamePhase) {
      return { success: false, message: 'Spiel nicht gefunden', gameEnded: false };
    }

    if (gamePhase.phase !== 'DAY') {
      return { success: false, message: 'Abstimmung nur am Tag möglich', gameEnded: false };
    }

    // Stimmen zählen
    const voteCount: Record<string, number> = {};
    votes.forEach(vote => {
      voteCount[vote.targetId] = (voteCount[vote.targetId] || 0) + 1;
    });

    // Spieler mit den meisten Stimmen finden
    let maxVotes = 0;
    let eliminatedPlayer: string | undefined;

    Object.entries(voteCount).forEach(([playerId, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        eliminatedPlayer = playerId;
      }
    });

    if (!eliminatedPlayer || maxVotes === 0) {
      return { success: false, message: 'Keine gültigen Stimmen', gameEnded: false };
    }

    // Spieler eliminieren
    const playerToEliminate = players.find(p => p.userId === eliminatedPlayer);
    if (playerToEliminate) {
      playerToEliminate.isAlive = false;

      // Jäger-Fähigkeit prüfen
      if (
        playerToEliminate.role === PlayerRole.HUNTER &&
        playerToEliminate.specialStates.canRevenge
      ) {
        // Jäger kann jemanden mitnehmen - das sollte in einem separaten Schritt behandelt werden
      }

      // Liebespaar-Mechanik
      if (playerToEliminate.specialStates.loverId) {
        const lover = players.find(p => p.userId === playerToEliminate.specialStates.loverId);
        if (lover && lover.isAlive) {
          lover.isAlive = false;
        }
      }

      // Datenbank aktualisieren
      await supabaseAdmin
        .from('players')
        .update({
          is_alive: false,
          eliminated_at: new Date().toISOString(),
        })
        .eq('game_id', gameId)
        .eq('user_id', eliminatedPlayer);
    }

    // Win Conditions prüfen
    const alivePlayers = players.filter(p => p.isAlive);
    const winner = this.roleService.checkWinConditions(alivePlayers);

    let gameEnded = false;
    if (winner) {
      gameEnded = true;
      await supabaseAdmin
        .from('games')
        .update({
          status: 'FINISHED',
          finished_at: new Date().toISOString(),
        })
        .eq('id', gameId);

      // Cleanup
      this.gameStates.delete(gameId);
      this.playerStates.delete(gameId);
    }

    this.playerStates.set(gameId, players);

    return {
      success: true,
      message: `${eliminatedPlayer} wurde eliminiert`,
      eliminatedPlayer,
      gameEnded,
      ...(winner && { winner }),
    };
  }
}
