import { createClient } from '@supabase/supabase-js';
import { generateGameCode } from '../utils/gameCode';
import { CreateGameDTO, GameResponse } from '../types/game.types';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export class GameService {
  /**
   * Creates a new game with auto-generated code
   */
  async createGame(data: { creatorId: string; maxPlayers: number; isPrivate: boolean; name?: string }): Promise<GameResponse> {
    const gameData: CreateGameDTO = {
      name: data.name || `Game ${Date.now()}`,
      maxPlayers: data.maxPlayers
    };
    
    return this.createGameInternal(data.creatorId, gameData, data.isPrivate);
  }

  /**
   * Internal method for creating games
   */
  private async createGameInternal(userId: string, data: CreateGameDTO, isPrivate: boolean = false): Promise<GameResponse> {
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

    // Create game
    const { data: game, error } = await supabase
      .from('games')
      .insert({
        name: data.name,
        code,
        max_players: data.maxPlayers,
        settings: data.settings || {},
        is_private: isPrivate,
        creator_id: userId
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create game: ${error.message}`);

    // Add creator as host player
    const { error: joinError } = await supabase
      .from('players')
      .insert({
        game_id: game.id,
        user_id: userId,
        is_host: true
      });

    if (joinError) {
      // Rollback game creation
      await supabase.from('games').delete().eq('id', game.id);
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
    // Get game info
    const { data: game, error: gameError } = await supabase
      .from('games')
      .select(`
        *,
        players!inner(
          user_id,
          is_host,
          is_alive,
          created_at,
          profiles!inner(
            username,
            avatar_url
          )
        )
      `)
      .eq('id', gameId)
      .single();

    if (gameError) throw new Error(`Game not found: ${gameError.message}`);

    return this.formatGameResponseWithPlayers(game);
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
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('id')
      .eq('game_id', gameId)
      .eq('user_id', userId)
      .single();

    if (existingPlayer) throw new Error('You are already in this game');

    // Add player to game
    const { error } = await supabase
      .from('players')
      .insert({
        game_id: gameId,
        user_id: userId,
        is_host: false
      });

    if (error) throw new Error(`Failed to join: ${error.message}`);

    return this.getGameDetails(gameId);
  }

  /**
   * Join game by code
   */
  async joinGameByCode(code: string, userId: string): Promise<GameResponse> {
    // Find game by code
    const { data: game } = await supabase
      .from('game_overview')
      .select('*')
      .eq('code', code)
      .eq('status', 'waiting')
      .single();

    if (!game) throw new Error('Game not found or already started');
    if (game.current_players >= game.max_players) throw new Error('Game is full');

    // Check if already in game
    const { data: existingPlayer } = await supabase
      .from('players')
      .select('id')
      .eq('game_id', game.id)
      .eq('user_id', userId)
      .single();

    if (existingPlayer) throw new Error('Already in this game');

    // Add player to game
    const { error } = await supabase
      .from('players')
      .insert({
        game_id: game.id,
        user_id: userId,
        is_host: false
      });

    if (error) throw new Error(`Failed to join: ${error.message}`);

    return this.getGameDetails(game.id);
  }

  /**
   * Leave game
   */
  async leaveGame(gameId: string, userId: string): Promise<{ gameDeleted: boolean; newHostId?: string }> {
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
    const { error } = await supabase
      .rpc('start_game', { game_id_param: gameId });

    if (error) throw new Error(`Failed to start: ${error.message}`);
  }

  /**
   * Handle host leaving - transfer or delete game
   */
  private async handleHostLeave(gameId: string): Promise<{ gameDeleted: boolean; newHostId?: string }> {
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
      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', gameId);

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
        ended_at: new Date().toISOString()
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
  private formatGameResponse(game: any): GameResponse {
    return {
      id: game.id,
      name: game.name,
      code: game.code,
      status: game.status,
      creatorId: game.creator_id,
      maxPlayers: game.max_players,
      currentPlayers: game.current_players || 0,
      createdAt: game.created_at,
      isPrivate: game.is_private
    };
  }

  /**
   * Format game response with players
   */
  private formatGameResponseWithPlayers(game: any): GameResponse {
    const response = this.formatGameResponse(game);
    
    response.players = game.players.map((p: any) => ({
      userId: p.user_id,
      username: p.profiles.username,
      avatarUrl: p.profiles.avatar_url,
      isHost: p.is_host,
      isAlive: p.is_alive,
      joinedAt: p.created_at,
      role: p.role
    }));

    return response;
  }
}