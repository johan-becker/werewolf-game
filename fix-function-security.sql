-- Fix Function Security Issues
-- Set search_path to prevent SQL injection attacks

-- Fix join_game function
CREATE OR REPLACE FUNCTION join_game(
  game_id_param uuid,
  user_id_param uuid DEFAULT auth.uid()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_players_var integer;
  max_players_var integer;
  game_status_var text;
BEGIN
  -- Get game info
  SELECT status,
         (SELECT COUNT(*) FROM players p WHERE p.game_id = g.id),
         max_players
  INTO game_status_var, current_players_var, max_players_var
  FROM games g
  WHERE g.id = game_id_param;

  -- Check if game exists
  IF game_status_var IS NULL THEN
    RAISE EXCEPTION 'Game not found';
  END IF;

  -- Check if game is accepting players
  IF game_status_var != 'waiting' THEN
    RAISE EXCEPTION 'Game already started or finished';
  END IF;

  -- Check if game is full
  IF current_players_var >= max_players_var THEN
    RAISE EXCEPTION 'Game is full';
  END IF;

  -- Check if player already in game
  IF EXISTS (
    SELECT 1 FROM players 
    WHERE game_id = game_id_param 
    AND user_id = user_id_param
  ) THEN
    RAISE EXCEPTION 'Already in this game';
  END IF;

  -- Join the game
  INSERT INTO players (game_id, user_id, is_host, is_alive)
  VALUES (game_id_param, user_id_param, false, true);
END;
$$;

-- Fix join_game_by_code function
CREATE OR REPLACE FUNCTION join_game_by_code(
  code_param text,
  user_id_param uuid DEFAULT auth.uid()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix is_user_in_game function
CREATE OR REPLACE FUNCTION is_user_in_game(game_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id_current UUID;
BEGIN
  user_id_current := auth.uid();
  
  IF user_id_current IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM players 
    WHERE game_id = game_id_param AND user_id = user_id_current
  );
END;
$$;

-- Fix test_auth_context function
CREATE OR REPLACE FUNCTION test_auth_context()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN json_build_object(
    'auth_uid', auth.uid(),
    'current_user', current_user,
    'session_user', session_user
  );
END;
$$;

-- Fix handle_new_user function (if it exists)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function (if it exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix set_creator_id function (if it exists)
CREATE OR REPLACE FUNCTION set_creator_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.creator_id := auth.uid();
  RETURN NEW;
END;
$$;