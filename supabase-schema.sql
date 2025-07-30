-- =============================================
-- WEREWOLF GAME - SUPABASE SCHEMA
-- =============================================

-- Enable Row Level Security on all tables
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS games ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS players ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS game_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- TABLES
-- =============================================

-- Profiles table (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Games table
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'in_progress', 'finished')),
  max_players INTEGER DEFAULT 8 CHECK (max_players >= 4 AND max_players <= 12),
  min_players INTEGER DEFAULT 5 CHECK (min_players >= 4),
  current_phase TEXT DEFAULT 'lobby' CHECK (current_phase IN ('lobby', 'day', 'night', 'voting', 'finished')),
  phase_end_time TIMESTAMPTZ,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'villager' CHECK (role IN ('villager', 'werewolf', 'seer', 'doctor', 'mayor')),
  is_host BOOLEAN DEFAULT FALSE,
  is_alive BOOLEAN DEFAULT TRUE,
  votes_remaining INTEGER DEFAULT 0,
  last_action TIMESTAMPTZ,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(game_id, user_id)
);

-- Game logs table for audit trail
CREATE TABLE IF NOT EXISTS game_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES games(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  phase TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_games_code ON games(code);
CREATE INDEX IF NOT EXISTS idx_games_creator ON games(creator_id);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_players_game ON players(game_id);
CREATE INDEX IF NOT EXISTS idx_players_user ON players(user_id);
CREATE INDEX IF NOT EXISTS idx_game_logs_game ON game_logs(game_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Games policies
DROP POLICY IF EXISTS "Users can view games they're in or public games" ON games;
CREATE POLICY "Users can view games they're in or public games" ON games
  FOR SELECT USING (
    creator_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM players 
      WHERE players.game_id = games.id 
      AND players.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create games" ON games;
CREATE POLICY "Users can create games" ON games
  FOR INSERT WITH CHECK (creator_id = auth.uid());

DROP POLICY IF EXISTS "Only game creators can update games" ON games;
CREATE POLICY "Only game creators can update games" ON games
  FOR UPDATE USING (creator_id = auth.uid());

DROP POLICY IF EXISTS "Only game creators can delete games" ON games;
CREATE POLICY "Only game creators can delete games" ON games
  FOR DELETE USING (creator_id = auth.uid());

-- Players policies
DROP POLICY IF EXISTS "Users can view players in their games" ON players;
CREATE POLICY "Users can view players in their games" ON players
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM players p2 
      WHERE p2.game_id = players.game_id 
      AND p2.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can join games" ON players;
CREATE POLICY "Users can join games" ON players
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own player record" ON players;
CREATE POLICY "Users can update own player record" ON players
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can leave games" ON players;
CREATE POLICY "Users can leave games" ON players
  FOR DELETE USING (user_id = auth.uid());

-- Game logs policies
DROP POLICY IF EXISTS "Users can view logs from their games" ON game_logs;
CREATE POLICY "Users can view logs from their games" ON game_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM players 
      WHERE players.game_id = game_logs.game_id 
      AND players.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "System can insert game logs" ON game_logs;
CREATE POLICY "System can insert game logs" ON game_logs
  FOR INSERT WITH CHECK (true);

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO profiles (id, username)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      NEW.raw_user_meta_data->>'full_name',
      SPLIT_PART(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at trigger to tables
DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS games_updated_at ON games;
CREATE TRIGGER games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- VIEWS
-- =============================================

-- Drop existing view if it has SECURITY DEFINER
DROP VIEW IF EXISTS game_overview;

-- Game overview view with player count (without SECURITY DEFINER)
CREATE VIEW game_overview AS
SELECT 
  g.id,
  g.name,
  g.code,
  g.status,
  g.max_players,
  g.created_at,
  g.creator_id,
  p.username as creator_name,
  COALESCE(player_count.count, 0) as current_players
FROM games g
LEFT JOIN profiles p ON g.creator_id = p.id
LEFT JOIN (
  SELECT game_id, COUNT(*) as count
  FROM players
  GROUP BY game_id
) player_count ON g.id = player_count.game_id;