-- Fix Supabase RPC Functions

-- Fix join_game_by_code function
CREATE OR REPLACE FUNCTION join_game_by_code(code_param VARCHAR)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    game_id_found UUID;
    user_id_current UUID;
BEGIN
    -- Get current authenticated user
    user_id_current := auth.uid();
    
    -- Check if user is authenticated
    IF user_id_current IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated';
    END IF;
    
    -- Find game by code
    SELECT id INTO game_id_found 
    FROM games 
    WHERE code = code_param AND status = 'waiting';
    
    -- Check if game exists
    IF game_id_found IS NULL THEN
        RAISE EXCEPTION 'Game not found or not accepting players';
    END IF;
    
    -- Check if user is already in the game
    IF EXISTS (SELECT 1 FROM players WHERE game_id = game_id_found AND user_id = user_id_current) THEN
        RAISE EXCEPTION 'User already in this game';
    END IF;
    
    -- Check if game is full
    IF (SELECT COUNT(*) FROM players WHERE game_id = game_id_found) >= 
       (SELECT max_players FROM games WHERE id = game_id_found) THEN
        RAISE EXCEPTION 'Game is full';
    END IF;
    
    -- Join the game
    INSERT INTO players (user_id, game_id, is_host, is_alive)
    VALUES (user_id_current, game_id_found, false, true);
    
    RETURN game_id_found;
END;
$$;

-- Fix join_game function (by ID)
CREATE OR REPLACE FUNCTION join_game(game_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id_current UUID;
BEGIN
    -- Get current authenticated user
    user_id_current := auth.uid();
    
    -- Check if user is authenticated
    IF user_id_current IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated';
    END IF;
    
    -- Check if game exists and is waiting
    IF NOT EXISTS (SELECT 1 FROM games WHERE id = game_id_param AND status = 'waiting') THEN
        RAISE EXCEPTION 'Game not found or not accepting players';
    END IF;
    
    -- Check if user is already in the game
    IF EXISTS (SELECT 1 FROM players WHERE game_id = game_id_param AND user_id = user_id_current) THEN
        RAISE EXCEPTION 'User already in this game';
    END IF;
    
    -- Check if game is full
    IF (SELECT COUNT(*) FROM players WHERE game_id = game_id_param) >= 
       (SELECT max_players FROM games WHERE id = game_id_param) THEN
        RAISE EXCEPTION 'Game is full';
    END IF;
    
    -- Join the game
    INSERT INTO players (user_id, game_id, is_host, is_alive)
    VALUES (user_id_current, game_id_param, false, true);
END;
$$;

-- Add function to check if user is in a specific game
CREATE OR REPLACE FUNCTION is_user_in_game(game_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
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