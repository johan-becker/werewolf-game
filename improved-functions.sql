-- Improved join_game_by_code function (your version, completed)
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
  -- Find game by code
  SELECT id, 
         (SELECT COUNT(*) FROM players p WHERE p.game_id = g.id),
         max_players
  INTO game_id_var, current_players_var, max_players_var
  FROM games g
  WHERE g.code = code_param
  AND g.status = 'waiting';

  -- Check if game exists
  IF game_id_var IS NULL THEN
    RAISE EXCEPTION 'Game not found or already started';
  END IF;

  -- Check if game is full
  IF current_players_var >= max_players_var THEN
    RAISE EXCEPTION 'Game is full';
  END IF;

  -- Check if player already in game
  IF EXISTS (
    SELECT 1 FROM players 
    WHERE game_id = game_id_var 
    AND user_id = user_id_param
  ) THEN
    RAISE EXCEPTION 'Already in this game';
  END IF;

  -- Join the game
  INSERT INTO players (game_id, user_id, is_host, is_alive)
  VALUES (game_id_var, user_id_param, false, true);

  RETURN game_id_var;
END;
$$;

-- Also improve the join_game function to match
CREATE OR REPLACE FUNCTION join_game(
  game_id_param uuid,
  user_id_param uuid DEFAULT auth.uid()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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