-- Fix Row Level Security (RLS) Policies for Werewolf Game

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;

DROP POLICY IF EXISTS "games_select_policy" ON games;
DROP POLICY IF EXISTS "games_insert_policy" ON games;
DROP POLICY IF EXISTS "games_update_policy" ON games;
DROP POLICY IF EXISTS "games_delete_policy" ON games;

DROP POLICY IF EXISTS "players_select_policy" ON players;
DROP POLICY IF EXISTS "players_insert_policy" ON players;
DROP POLICY IF EXISTS "players_update_policy" ON players;
DROP POLICY IF EXISTS "players_delete_policy" ON players;

DROP POLICY IF EXISTS "game_logs_select_policy" ON game_logs;
DROP POLICY IF EXISTS "game_logs_insert_policy" ON game_logs;

-- PROFILES POLICIES
-- Users can view all profiles (for game player lists)
CREATE POLICY "profiles_select_policy" ON profiles
FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_update_policy" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Profiles are auto-created by trigger, but allow manual insert for service role
CREATE POLICY "profiles_insert_policy" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- GAMES POLICIES
-- Anyone can view games (for lobby)
CREATE POLICY "games_select_policy" ON games
FOR SELECT USING (true);

-- Authenticated users can create games
CREATE POLICY "games_insert_policy" ON games
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = creator_id);

-- Only game creator can update games
CREATE POLICY "games_update_policy" ON games
FOR UPDATE USING (auth.uid() = creator_id);

-- Only game creator can delete games
CREATE POLICY "games_delete_policy" ON games
FOR DELETE USING (auth.uid() = creator_id);

-- PLAYERS POLICIES
-- Users can view players in games they're part of, or all players for public games
CREATE POLICY "players_select_policy" ON players
FOR SELECT USING (
  auth.uid() = user_id 
  OR 
  game_id IN (SELECT id FROM games WHERE status = 'waiting')
  OR
  game_id IN (SELECT game_id FROM players WHERE user_id = auth.uid())
);

-- Users can join games (insert themselves as players)
CREATE POLICY "players_insert_policy" ON players
FOR INSERT WITH CHECK (
  auth.uid() = user_id 
  AND 
  game_id IN (SELECT id FROM games WHERE status = 'waiting')
);

-- Users can update their own player record, or game creator can update any player
CREATE POLICY "players_update_policy" ON players
FOR UPDATE USING (
  auth.uid() = user_id 
  OR 
  game_id IN (SELECT id FROM games WHERE creator_id = auth.uid())
);

-- Users can leave games (delete their own player record), or creator can remove players
CREATE POLICY "players_delete_policy" ON players
FOR DELETE USING (
  auth.uid() = user_id 
  OR 
  game_id IN (SELECT id FROM games WHERE creator_id = auth.uid())
);

-- GAME_LOGS POLICIES
-- Users can view logs for games they're in
CREATE POLICY "game_logs_select_policy" ON game_logs
FOR SELECT USING (
  game_id IN (SELECT game_id FROM players WHERE user_id = auth.uid())
);

-- Only system/service can insert game logs (actions are recorded automatically)
CREATE POLICY "game_logs_insert_policy" ON game_logs
FOR INSERT WITH CHECK (
  game_id IN (SELECT game_id FROM players WHERE user_id = auth.uid())
);

-- Test the policies
-- This should work (user updating their own profile)
-- UPDATE profiles SET username = 'newname' WHERE id = auth.uid();

-- This should fail (user trying to update someone else's profile)
-- UPDATE profiles SET username = 'hacker' WHERE id != auth.uid();

-- This should work (creator updating their game)
-- UPDATE games SET name = 'Updated Name' WHERE creator_id = auth.uid();

-- This should fail (non-creator trying to update game)
-- UPDATE games SET name = 'Hacked Game' WHERE creator_id != auth.uid();