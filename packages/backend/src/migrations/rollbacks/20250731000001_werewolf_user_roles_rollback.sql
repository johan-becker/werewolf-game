-- Rollback for migration: Add Werewolf User Roles and Pack System
-- Created: 2025-07-31T00:00:01.000Z
-- ID: 20250731000001_werewolf_user_roles

-- Drop triggers first
DROP TRIGGER IF EXISTS trigger_update_pack_alpha_on_leave ON werewolf_pack_members;

-- Drop functions
DROP FUNCTION IF EXISTS update_pack_alpha_on_leave();
DROP FUNCTION IF EXISTS calculate_transformation_intensity(VARCHAR, DECIMAL);

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS moon_event_participants;
DROP TABLE IF EXISTS moon_phase_events;
DROP TABLE IF EXISTS transformation_logs;
DROP TABLE IF EXISTS moon_phases;
DROP TABLE IF EXISTS territory_disputes;
DROP TABLE IF EXISTS territory_patrols;
DROP TABLE IF EXISTS werewolf_pack_members;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS werewolf_territories;
DROP TABLE IF EXISTS werewolf_packs;

-- Remove werewolf-specific columns from profiles table
ALTER TABLE profiles DROP COLUMN IF EXISTS werewolf_role;
ALTER TABLE profiles DROP COLUMN IF EXISTS transformation_state;
ALTER TABLE profiles DROP COLUMN IF EXISTS pack_id;
ALTER TABLE profiles DROP COLUMN IF EXISTS pack_status;
ALTER TABLE profiles DROP COLUMN IF EXISTS level;
ALTER TABLE profiles DROP COLUMN IF EXISTS experience_points;
ALTER TABLE profiles DROP COLUMN IF EXISTS reputation;
ALTER TABLE profiles DROP COLUMN IF EXISTS last_transformation;
ALTER TABLE profiles DROP COLUMN IF EXISTS next_forced_transformation;
ALTER TABLE profiles DROP COLUMN IF EXISTS transformation_cooldown_until;
ALTER TABLE profiles DROP COLUMN IF EXISTS abilities;
ALTER TABLE profiles DROP COLUMN IF EXISTS allies;
ALTER TABLE profiles DROP COLUMN IF EXISTS enemies;
ALTER TABLE profiles DROP COLUMN IF EXISTS mentors;
ALTER TABLE profiles DROP COLUMN IF EXISTS apprentices;
ALTER TABLE profiles DROP COLUMN IF EXISTS total_eliminations;
ALTER TABLE profiles DROP COLUMN IF EXISTS survival_rate;
ALTER TABLE profiles DROP COLUMN IF EXISTS last_activity;

-- Drop custom types
DROP TYPE IF EXISTS werewolf_role;
DROP TYPE IF EXISTS pack_status;
DROP TYPE IF EXISTS transformation_state;