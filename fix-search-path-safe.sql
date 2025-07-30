-- Fix Function Search Path Issues - SAFE VERSION
-- This handles trigger dependencies properly

-- 1. Drop functions that don't have dependencies first
DROP FUNCTION IF EXISTS public.join_game(uuid, uuid);
DROP FUNCTION IF EXISTS public.join_game_by_code(text, uuid);
DROP FUNCTION IF EXISTS public.is_user_in_game(uuid);
DROP FUNCTION IF EXISTS public.test_auth_context();

-- 2. For functions with triggers, use CREATE OR REPLACE (safer)
-- This preserves the trigger while updating the function

-- Join game function
CREATE FUNCTION public.join_game(
  game_id_param uuid,
  user_id_param uuid DEFAULT auth.uid()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_players_var integer;
  max_players_var integer;
  game_status_var text;
BEGIN
  SELECT status,
         (SELECT COUNT(*) FROM public.players p WHERE p.game_id = g.id),
         max_players
  INTO game_status_var, current_players_var, max_players_var
  FROM public.games g
  WHERE g.id = game_id_param;

  IF game_status_var IS NULL THEN
    RAISE EXCEPTION 'Game not found';
  END IF;

  IF game_status_var != 'waiting' THEN
    RAISE EXCEPTION 'Game already started or finished';
  END IF;

  IF current_players_var >= max_players_var THEN
    RAISE EXCEPTION 'Game is full';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.players 
    WHERE game_id = game_id_param 
    AND user_id = user_id_param
  ) THEN
    RAISE EXCEPTION 'Already in this game';
  END IF;

  INSERT INTO public.players (game_id, user_id, is_host, is_alive)
  VALUES (game_id_param, user_id_param, false, true);
END;
$$;

-- Join game by code function
CREATE FUNCTION public.join_game_by_code(
  code_param text,
  user_id_param uuid DEFAULT auth.uid()
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  game_id_var uuid;
  current_players_var integer;
  max_players_var integer;
BEGIN
  IF user_id_param IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated to join game';
  END IF;

  SELECT g.id, 
         COALESCE((SELECT COUNT(*) FROM public.players p WHERE p.game_id = g.id), 0),
         g.max_players
  INTO game_id_var, current_players_var, max_players_var
  FROM public.games g
  WHERE g.code = code_param
  AND g.status = 'waiting';

  IF game_id_var IS NULL THEN
    RAISE EXCEPTION 'Game not found or already started';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.players 
    WHERE game_id = game_id_var 
    AND user_id = user_id_param
  ) THEN
    RAISE EXCEPTION 'Already in this game';
  END IF;

  IF current_players_var >= max_players_var THEN
    RAISE EXCEPTION 'Game is full';
  END IF;

  INSERT INTO public.players (game_id, user_id, is_host, is_alive)
  VALUES (game_id_var, user_id_param, false, true);

  RETURN game_id_var;
END;
$$;

-- Is user in game function
CREATE FUNCTION public.is_user_in_game(game_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  user_id_current uuid;
BEGIN
  user_id_current := auth.uid();
  
  IF user_id_current IS NULL THEN
    RETURN false;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.players 
    WHERE game_id = game_id_param AND user_id = user_id_current
  );
END;
$$;

-- Test auth context function
CREATE FUNCTION public.test_auth_context()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  RETURN json_build_object(
    'auth_uid', auth.uid(),
    'current_user', current_user,
    'session_user', session_user
  );
END;
$$;

-- Handle new user trigger function (using CREATE OR REPLACE to preserve trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

-- Update timestamp trigger function (using CREATE OR REPLACE to preserve any triggers)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Set creator ID trigger function (using CREATE OR REPLACE to preserve any triggers)
CREATE OR REPLACE FUNCTION public.set_creator_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  NEW.creator_id := auth.uid();
  RETURN NEW;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.join_game(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.join_game_by_code(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_user_in_game(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.test_auth_context() TO authenticated;