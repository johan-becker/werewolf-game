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
  async createGame(userId: string, data: CreateGameDTO): Promise<GameResponse> {
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

    // Create game
    const { data: game, error } = await supabase
      .from('games')
      .insert({
        name: data.name,
        code,
        max_players: data.maxPlayers,
        game_settings: data.settings || {},
        creator_id: userId
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create game: ${error.message}`);

    // Use RPC to join as host
    const { error: joinError } = await supabase
      .rpc('join_game', { 
        game_id_param: game.id,
        user_id_param: userId 
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
    if (game.status !== 'waiting') throw new Error('Game already started');
    if (game.current_players >= game.max_players) throw new Error('Game is full');

    // Use RPC to join
    const { error } = await supabase
      .rpc('join_game', { 
        game_id_param: gameId,
        user_id_param: userId 
      });

    if (error) throw new Error(`Failed to join: ${error.message}`);

    return this.getGameDetails(gameId);
  }

  /**
   * Join game by code
   */
  async joinGameByCode(code: string, userId: string): Promise<GameResponse> {
    const { data, error } = await supabase
      .rpc('join_game_by_code', { 
        code_param: code,
        user_id_param: userId 
      });

    if (error) throw new Error(`Failed to join: ${error.message}`);
    if (!data) throw new Error('Invalid game code');

    return this.getGameDetails(data);
  }

  /**
   * Leave game
   */
  async leaveGame(gameId: string, userId: string): Promise<void> {
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
      await this.handleHostLeave(gameId);
    }
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

    // Check player count
    const { data: game } = await supabase
      .from('game_overview')
      .select('current_players')
      .eq('id', gameId)
      .single();

    if (!game || game.current_players < 4) {
      throw new Error('Need at least 4 players to start');
    }

    // Update game status
    const { error } = await supabase
      .from('games')
      .update({ status: 'in_progress' })
      .eq('id', gameId);

    if (error) throw new Error(`Failed to start: ${error.message}`);

    // TODO: Assign roles and initialize game state
  }

  /**
   * Handle host leaving - transfer or delete game
   */
  private async handleHostLeave(gameId: string): Promise<void> {
    // Get remaining players
    const { data: players } = await supabase
      .from('players')
      .select('user_id')
      .eq('game_id', gameId)
      .order('created_at')
      .limit(1);

    if (players && players.length > 0) {
      // Transfer host to oldest player
      await supabase
        .from('players')
        .update({ is_host: true })
        .eq('game_id', gameId)
        .eq('user_id', players[0]!.user_id);
    } else {
      // Delete empty game
      await supabase
        .from('games')
        .delete()
        .eq('id', gameId);
    }
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
      createdAt: game.created_at
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
      joinedAt: p.created_at
    }));

    return response;
  }
}