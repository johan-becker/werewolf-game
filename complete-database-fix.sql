-- Complete Database Security and Function Fix

-- 1. Fix the Security Definer View (removes SECURITY DEFINER)
DROP VIEW IF EXISTS public.game_overview;

CREATE VIEW public.game_overview AS
SELECT 
    g.id,
    g.name,
    g.code,
    g.status,
    g.max_players,
    g.created_at,
    g.creator_id,
    p.username as creator_name,
    COALESCE(player_count.current_players, 0) as current_players
FROM games g
LEFT JOIN profiles p ON g.creator_id = p.id
LEFT JOIN (
    SELECT 
        game_id, 
        COUNT(*) as current_players
    FROM players 
    GROUP BY game_id
) player_count ON g.id = player_count.game_id;

-- Grant permissions
GRANT SELECT ON public.game_overview TO authenticated;
GRANT SELECT ON public.game_overview TO anon;

-- 2. Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_logs ENABLE ROW LEVEL SECURITY;

-- 3. Fix RLS Policies (critical for security)
-- Drop existing policies first
DROP POLICY IF EXISTS "games_select_policy" ON games;
DROP POLICY IF EXISTS "games_insert_policy" ON games;
DROP POLICY IF EXISTS "games_update_policy" ON games;
DROP POLICY IF EXISTS "games_delete_policy" ON games;

-- Games policies
CREATE POLICY "games_select_policy" ON games FOR SELECT USING (true);
CREATE POLICY "games_insert_policy" ON games FOR INSERT WITH CHECK (auth.uid() = creator_id);
CREATE POLICY "games_update_policy" ON games FOR UPDATE USING (auth.uid() = creator_id);
CREATE POLICY "games_delete_policy" ON games FOR DELETE USING (auth.uid() = creator_id);

-- 4. Improved RPC Functions with better error handling
DROP FUNCTION IF EXISTS join_game_by_code(text, uuid);
DROP FUNCTION IF EXISTS join_game_by_code(text);

CREATE OR REPLACE FUNCTION join_game_by_code(
  code_param text,
  user_id_param uuid DEFAULT auth.uid()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  game_id_var uuid;
  current_players_var integer;
  max_players_var integer;
BEGIN
  -- Ensure we have a valid user_id
  IF user_id_param IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to join game';
  END IF;

  -- Find game by code with all needed info in one query
  SELECT g.id, 
         COALESCE((SELECT COUNT(*) FROM players p WHERE p.game_id = g.id), 0),
         g.max_players
  INTO game_id_var, current_players_var, max_players_var
  FROM games g
  WHERE g.code = code_param
  AND g.status = 'waiting';

  -- Check if game exists
  IF game_id_var IS NULL THEN
    RAISE EXCEPTION 'Game not found or already started';
  END IF;

  -- Check if player already in game
  IF EXISTS (
    SELECT 1 FROM players 
    WHERE game_id = game_id_var 
    AND user_id = user_id_param
  ) THEN
    RAISE EXCEPTION 'Already in this game';
  END IF;

  -- Check if game is full
  IF current_players_var >= max_players_var THEN
    RAISE EXCEPTION 'Game is full';
  END IF;

  -- Join the game
  INSERT INTO players (game_id, user_id, is_host, is_alive)
  VALUES (game_id_var, user_id_param, false, true);

  RETURN game_id_var;
END;
$$;

-- Test function for debugging
CREATE OR REPLACE FUNCTION test_auth_context()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN json_build_object(
    'auth_uid', auth.uid(),
    'current_user', current_user,
    'session_user', session_user
  );
END;
$$;