-- Migration: Add Werewolf User Roles and Pack System
-- Created: 2025-07-31T00:00:01.000Z
-- ID: 20250731000001_werewolf_user_roles

-- Create werewolf user role enum
CREATE TYPE werewolf_role AS ENUM (
  'ALPHA',
  'BETA', 
  'OMEGA',
  'HUNTER',
  'HEALER',
  'SCOUT',
  'GUARDIAN',
  'PACK_MEMBER',
  'LONE_WOLF',
  'CUB',
  'ELDER',
  'HUMAN',
  'HUNTER_HUMAN'
);

-- Create pack status enum
CREATE TYPE pack_status AS ENUM (
  'ALPHA',
  'MEMBER',
  'BETA',
  'OMEGA',
  'LONE',
  'EXILE',
  'CHALLENGER'
);

-- Create transformation state enum
CREATE TYPE transformation_state AS ENUM (
  'HUMAN',
  'PARTIAL',
  'WOLF',
  'HYBRID',
  'LOCKED_HUMAN',
  'LOCKED_WOLF'
);

-- Create werewolf packs table
CREATE TABLE werewolf_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  alpha_id UUID NOT NULL,
  is_private BOOLEAN DEFAULT false,
  max_members INTEGER DEFAULT 12,
  territory_count INTEGER DEFAULT 0,
  pack_level INTEGER DEFAULT 1,
  reputation INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create werewolf territories table
CREATE TABLE werewolf_territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  pack_id UUID NOT NULL REFERENCES werewolf_packs(id) ON DELETE CASCADE,
  boundaries JSONB NOT NULL, -- Array of lat/lng coordinates
  center_lat DECIMAL(10, 8) NOT NULL,
  center_lng DECIMAL(11, 8) NOT NULL,
  radius_km DECIMAL(5, 2) NOT NULL,
  marker_type VARCHAR(20) DEFAULT 'scent',
  is_public BOOLEAN DEFAULT false,
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  last_patrol TIMESTAMPTZ,
  threat_level INTEGER DEFAULT 0,
  resource_quality INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add werewolf-specific columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS werewolf_role werewolf_role DEFAULT 'HUMAN';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS transformation_state transformation_state DEFAULT 'HUMAN';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pack_id UUID REFERENCES werewolf_packs(id) ON DELETE SET NULL;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pack_status pack_status DEFAULT 'LONE';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS experience_points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reputation INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_transformation TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS next_forced_transformation TIMESTAMPTZ;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS transformation_cooldown_until TIMESTAMPTZ;

-- Add werewolf abilities as JSONB
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS abilities JSONB DEFAULT '{
  "strength": 1,
  "speed": 1,
  "endurance": 1,
  "senses": 1,
  "leadership": 1,
  "intimidation": 1,
  "diplomacy": 1,
  "tracking": 1,
  "healing": 1,
  "stealth": 1,
  "territory_knowledge": 1,
  "transformation_control": 1,
  "moon_resistance": 1,
  "silver_tolerance": 1,
  "pack_bond_strength": 1
}';

-- Add relationship arrays
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS allies UUID[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS enemies UUID[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mentors UUID[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS apprentices UUID[] DEFAULT '{}';

-- Add game statistics
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_eliminations INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS survival_rate DECIMAL(5, 2) DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_activity TIMESTAMPTZ;

-- Create werewolf pack members table (for detailed pack relationships)
CREATE TABLE werewolf_pack_members (
  pack_id UUID NOT NULL REFERENCES werewolf_packs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_in_pack pack_status DEFAULT 'MEMBER',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  loyalty_score INTEGER DEFAULT 50,
  challenges_won INTEGER DEFAULT 0,
  challenges_lost INTEGER DEFAULT 0,
  last_challenge TIMESTAMPTZ,
  contributions INTEGER DEFAULT 0,
  PRIMARY KEY (pack_id, user_id)
);

-- Create territory patrols table
CREATE TABLE territory_patrols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_id UUID NOT NULL REFERENCES werewolf_territories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  route JSONB NOT NULL, -- Array of lat/lng points with timestamps
  observations TEXT,
  threats TEXT[],
  scent_markers_refreshed BOOLEAN DEFAULT false,
  patrol_date TIMESTAMPTZ DEFAULT NOW(),
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create territory disputes table
CREATE TABLE territory_disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  territory_id UUID NOT NULL REFERENCES werewolf_territories(id) ON DELETE CASCADE,
  challenger_pack_id UUID NOT NULL REFERENCES werewolf_packs(id) ON DELETE CASCADE,
  defender_pack_id UUID NOT NULL REFERENCES werewolf_packs(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  evidence_type VARCHAR(50) NOT NULL,
  proposed_resolution TEXT,
  status VARCHAR(20) DEFAULT 'OPEN', -- OPEN, RESOLVED, ESCALATED
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolution TEXT
);

-- Create moon phases table
CREATE TABLE moon_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_name VARCHAR(20) NOT NULL, -- NEW, WAXING_CRESCENT, FIRST_QUARTER, etc.
  phase_date DATE NOT NULL UNIQUE,
  illumination_percentage DECIMAL(5, 2) NOT NULL,
  is_full_moon BOOLEAN DEFAULT false,
  is_new_moon BOOLEAN DEFAULT false,
  transformation_intensity INTEGER DEFAULT 1, -- 1-10 scale
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transformation logs table
CREATE TABLE transformation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  transformation_type VARCHAR(20) NOT NULL, -- voluntary, forced, partial, failed
  from_state transformation_state NOT NULL,
  to_state transformation_state NOT NULL,
  moon_phase_id UUID REFERENCES moon_phases(id) ON DELETE SET NULL,
  duration_minutes INTEGER,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  difficulty INTEGER, -- 1-10 scale
  complications TEXT,
  witnesses UUID[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create moon phase events table
CREATE TABLE moon_phase_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(100) NOT NULL,
  description TEXT,
  event_type VARCHAR(20) NOT NULL, -- hunt, ritual, gathering, training, ceremony
  organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  pack_id UUID REFERENCES werewolf_packs(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_name VARCHAR(100),
  max_participants INTEGER,
  required_roles werewolf_role[],
  is_private BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'SCHEDULED', -- SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event participants table
CREATE TABLE moon_event_participants (
  event_id UUID NOT NULL REFERENCES moon_phase_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'CONFIRMED', -- CONFIRMED, DECLINED, MAYBE
  PRIMARY KEY (event_id, user_id)
);

-- Create refresh tokens table for JWT rotation
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token_family VARCHAR(64) NOT NULL,
  version INTEGER NOT NULL,
  token_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ,
  UNIQUE(token_family, version)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_werewolf_role ON profiles(werewolf_role);
CREATE INDEX IF NOT EXISTS idx_profiles_pack_id ON profiles(pack_id);
CREATE INDEX IF NOT EXISTS idx_profiles_transformation_state ON profiles(transformation_state);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON profiles(level);
CREATE INDEX IF NOT EXISTS idx_profiles_reputation ON profiles(reputation);
CREATE INDEX IF NOT EXISTS idx_profiles_last_activity ON profiles(last_activity);

CREATE INDEX IF NOT EXISTS idx_werewolf_packs_alpha_id ON werewolf_packs(alpha_id);
CREATE INDEX IF NOT EXISTS idx_werewolf_packs_reputation ON werewolf_packs(reputation);
CREATE INDEX IF NOT EXISTS idx_werewolf_packs_created_at ON werewolf_packs(created_at);

CREATE INDEX IF NOT EXISTS idx_werewolf_territories_pack_id ON werewolf_territories(pack_id);
CREATE INDEX IF NOT EXISTS idx_werewolf_territories_location ON werewolf_territories(center_lat, center_lng);
CREATE INDEX IF NOT EXISTS idx_werewolf_territories_claimed_at ON werewolf_territories(claimed_at);

CREATE INDEX IF NOT EXISTS idx_territory_patrols_territory_id ON territory_patrols(territory_id);
CREATE INDEX IF NOT EXISTS idx_territory_patrols_user_id ON territory_patrols(user_id);
CREATE INDEX IF NOT EXISTS idx_territory_patrols_patrol_date ON territory_patrols(patrol_date);

CREATE INDEX IF NOT EXISTS idx_territory_disputes_territory_id ON territory_disputes(territory_id);
CREATE INDEX IF NOT EXISTS idx_territory_disputes_status ON territory_disputes(status);
CREATE INDEX IF NOT EXISTS idx_territory_disputes_created_at ON territory_disputes(created_at);

CREATE INDEX IF NOT EXISTS idx_moon_phases_phase_date ON moon_phases(phase_date);
CREATE INDEX IF NOT EXISTS idx_moon_phases_is_full_moon ON moon_phases(is_full_moon);

CREATE INDEX IF NOT EXISTS idx_transformation_logs_user_id ON transformation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_transformation_logs_moon_phase_id ON transformation_logs(moon_phase_id);
CREATE INDEX IF NOT EXISTS idx_transformation_logs_created_at ON transformation_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_moon_phase_events_scheduled_for ON moon_phase_events(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_moon_phase_events_organizer_id ON moon_phase_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_moon_phase_events_pack_id ON moon_phase_events(pack_id);
CREATE INDEX IF NOT EXISTS idx_moon_phase_events_status ON moon_phase_events(status);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token_family ON refresh_tokens(token_family);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Add constraints
ALTER TABLE werewolf_packs ADD CONSTRAINT fk_werewolf_packs_alpha 
  FOREIGN KEY (alpha_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update the pack alpha when alpha leaves pack
CREATE OR REPLACE FUNCTION update_pack_alpha_on_leave()
RETURNS TRIGGER AS $$
BEGIN
  -- If the leaving member was the alpha, assign new alpha
  IF OLD.pack_status = 'ALPHA' THEN
    UPDATE werewolf_packs 
    SET alpha_id = (
      SELECT user_id 
      FROM werewolf_pack_members 
      WHERE pack_id = OLD.pack_id 
        AND role_in_pack = 'BETA' 
      ORDER BY loyalty_score DESC, joined_at ASC 
      LIMIT 1
    )
    WHERE id = OLD.pack_id;
    
    -- If no beta exists, promote highest loyalty member
    IF NOT FOUND THEN
      UPDATE werewolf_packs 
      SET alpha_id = (
        SELECT user_id 
        FROM werewolf_pack_members 
        WHERE pack_id = OLD.pack_id 
        ORDER BY loyalty_score DESC, joined_at ASC 
        LIMIT 1
      )
      WHERE id = OLD.pack_id;
    END IF;
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_pack_alpha_on_leave
  BEFORE DELETE ON werewolf_pack_members
  FOR EACH ROW
  EXECUTE FUNCTION update_pack_alpha_on_leave();

-- Function to calculate moon phase transformation intensity
CREATE OR REPLACE FUNCTION calculate_transformation_intensity(phase_name VARCHAR, illumination DECIMAL)
RETURNS INTEGER AS $$
BEGIN
  CASE phase_name
    WHEN 'FULL' THEN RETURN 10;
    WHEN 'WANING_GIBBOUS' THEN RETURN 8;
    WHEN 'WAXING_GIBBOUS' THEN RETURN 8;
    WHEN 'FIRST_QUARTER' THEN RETURN 6;
    WHEN 'LAST_QUARTER' THEN RETURN 6;
    WHEN 'WANING_CRESCENT' THEN RETURN 3;
    WHEN 'WAXING_CRESCENT' THEN RETURN 3;
    WHEN 'NEW' THEN RETURN 1;
    ELSE RETURN FLOOR(illumination / 10);
  END CASE;
END;
$$ LANGUAGE plpgsql;