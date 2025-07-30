-- =============================================
-- WEREWOLF GAME - SUPABASE FUNCTIONS
-- =============================================

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Generate unique game code
CREATE OR REPLACE FUNCTION generate_game_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  code TEXT;
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  i INTEGER;
BEGIN
  LOOP
    code := '';
    FOR i IN 1..6 LOOP
      code := code || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Check if code already exists
    IF NOT EXISTS (SELECT 1 FROM games WHERE games.code = code) THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$;

-- Auto-generate game code on insert
CREATE OR REPLACE FUNCTION set_game_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF NEW.code IS NULL OR NEW.code = '' THEN
    NEW.code := generate_game_code();
  END IF;
  RETURN NEW;
END;
$$;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS games_set_code ON games;
CREATE TRIGGER games_set_code
  BEFORE INSERT ON games
  FOR EACH ROW EXECUTE FUNCTION set_game_code();

-- =============================================
-- GAME MANAGEMENT FUNCTIONS
-- =============================================

-- Join game by code
CREATE OR REPLACE FUNCTION join_game_by_code(code_param TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  game_record RECORD;
  player_count INTEGER;
  result JSON;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User must be authenticated to join game');
  END IF;

  -- Find game by code
  SELECT * INTO game_record FROM games WHERE code = code_param;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Game not found');
  END IF;
  
  -- Check if game is still accepting players
  IF game_record.status != 'waiting' THEN
    RETURN json_build_object('success', false, 'error', 'Game is not accepting new players');
  END IF;
  
  -- Check if user is already in the game
  IF EXISTS (SELECT 1 FROM players WHERE game_id = game_record.id AND user_id = auth.uid()) THEN
    RETURN json_build_object('success', false, 'error', 'You are already in this game');
  END IF;
  
  -- Check if game is full
  SELECT COUNT(*) INTO player_count FROM players WHERE game_id = game_record.id;
  
  IF player_count >= game_record.max_players THEN
    RETURN json_build_object('success', false, 'error', 'Game is full');
  END IF;
  
  -- Add player to game
  INSERT INTO players (game_id, user_id, is_host)
  VALUES (game_record.id, auth.uid(), false);
  
  -- Log the join action
  INSERT INTO game_logs (game_id, user_id, action, details)
  VALUES (game_record.id, auth.uid(), 'player_joined', json_build_object('code', code_param));
  
  RETURN json_build_object(
    'success', true, 
    'game_id', game_record.id,
    'game_name', game_record.name
  );
END;
$$;

-- Join game directly by ID
CREATE OR REPLACE FUNCTION join_game(game_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  game_record RECORD;
  player_count INTEGER;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User must be authenticated');
  END IF;

  -- Find game
  SELECT * INTO game_record FROM games WHERE id = game_id_param;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Game not found');
  END IF;
  
  -- Check if game is still accepting players
  IF game_record.status != 'waiting' THEN
    RETURN json_build_object('success', false, 'error', 'Game is not accepting new players');
  END IF;
  
  -- Check if user is already in the game
  IF EXISTS (SELECT 1 FROM players WHERE game_id = game_record.id AND user_id = auth.uid()) THEN
    RETURN json_build_object('success', false, 'error', 'You are already in this game');
  END IF;
  
  -- Check if game is full
  SELECT COUNT(*) INTO player_count FROM players WHERE game_id = game_record.id;
  
  IF player_count >= game_record.max_players THEN
    RETURN json_build_object('success', false, 'error', 'Game is full');
  END IF;
  
  -- Add player to game
  INSERT INTO players (game_id, user_id, is_host)
  VALUES (game_record.id, auth.uid(), false);
  
  -- Log the join action
  INSERT INTO game_logs (game_id, user_id, action)
  VALUES (game_record.id, auth.uid(), 'player_joined');
  
  RETURN json_build_object('success', true, 'game_id', game_record.id);
END;
$$;

-- Check if user is in a specific game
CREATE OR REPLACE FUNCTION is_user_in_game(game_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 FROM players 
    WHERE game_id = game_id_param 
    AND user_id = auth.uid()
  );
END;
$$;

-- Leave game function
CREATE OR REPLACE FUNCTION leave_game(game_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  player_record RECORD;
  new_host_id UUID;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User must be authenticated');
  END IF;

  -- Find player record
  SELECT * INTO player_record FROM players 
  WHERE game_id = game_id_param AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'You are not in this game');
  END IF;
  
  -- If player is host, transfer host to another player
  IF player_record.is_host THEN
    SELECT user_id INTO new_host_id FROM players 
    WHERE game_id = game_id_param AND user_id != auth.uid()
    ORDER BY joined_at ASC
    LIMIT 1;
    
    IF new_host_id IS NOT NULL THEN
      UPDATE players SET is_host = true WHERE game_id = game_id_param AND user_id = new_host_id;
      
      -- Log host transfer
      INSERT INTO game_logs (game_id, user_id, action, details)
      VALUES (game_id_param, new_host_id, 'host_transferred', json_build_object('from_user', auth.uid()));
    END IF;
  END IF;
  
  -- Remove player from game
  DELETE FROM players WHERE game_id = game_id_param AND user_id = auth.uid();
  
  -- Log the leave action
  INSERT INTO game_logs (game_id, user_id, action)
  VALUES (game_id_param, auth.uid(), 'player_left');
  
  -- If no players left, delete the game
  IF NOT EXISTS (SELECT 1 FROM players WHERE game_id = game_id_param) THEN
    DELETE FROM games WHERE id = game_id_param;
  END IF;
  
  RETURN json_build_object('success', true);
END;
$$;

-- Start game function
CREATE OR REPLACE FUNCTION start_game(game_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  game_record RECORD;
  player_count INTEGER;
  werewolf_count INTEGER;
  i INTEGER;
  player_ids UUID[];
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'User must be authenticated');
  END IF;

  -- Get game and verify user is host
  SELECT g.*, p.is_host INTO game_record 
  FROM games g
  JOIN players p ON g.id = p.game_id
  WHERE g.id = game_id_param AND p.user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Game not found or you are not the host');
  END IF;
  
  IF NOT game_record.is_host THEN
    RETURN json_build_object('success', false, 'error', 'Only the host can start the game');
  END IF;
  
  -- Check if game is in waiting status
  IF game_record.status != 'waiting' THEN
    RETURN json_build_object('success', false, 'error', 'Game has already started');
  END IF;
  
  -- Check minimum players
  SELECT COUNT(*) INTO player_count FROM players WHERE game_id = game_id_param;
  
  IF player_count < game_record.min_players THEN
    RETURN json_build_object('success', false, 'error', 'Not enough players to start');
  END IF;
  
  -- Assign roles
  SELECT array_agg(user_id ORDER BY random()) INTO player_ids 
  FROM players WHERE game_id = game_id_param;
  
  -- Calculate role distribution
  werewolf_count := GREATEST(1, player_count / 4);
  
  -- Assign werewolf roles
  FOR i IN 1..werewolf_count LOOP
    UPDATE players SET role = 'werewolf' 
    WHERE game_id = game_id_param AND user_id = player_ids[i];
  END LOOP;
  
  -- Assign special roles
  UPDATE players SET role = 'seer' 
  WHERE game_id = game_id_param AND user_id = player_ids[werewolf_count + 1];
  
  UPDATE players SET role = 'doctor' 
  WHERE game_id = game_id_param AND user_id = player_ids[werewolf_count + 2];
  
  -- Remaining players are villagers (default role)
  
  -- Update game status
  UPDATE games SET 
    status = 'in_progress',
    current_phase = 'day',
    phase_end_time = NOW() + INTERVAL '5 minutes'
  WHERE id = game_id_param;
  
  -- Log game start
  INSERT INTO game_logs (game_id, user_id, action, details)
  VALUES (game_id_param, auth.uid(), 'game_started', 
    json_build_object('player_count', player_count, 'werewolf_count', werewolf_count)
  );
  
  RETURN json_build_object('success', true, 'message', 'Game started successfully');
END;
$$;

-- =============================================
-- PERMISSION GRANTS
-- =============================================

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION join_game_by_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION join_game(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_user_in_game(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION leave_game(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION start_game(UUID) TO authenticated;