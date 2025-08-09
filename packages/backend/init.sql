-- Create extensions needed for the game
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;

-- Create a basic users table structure for development
-- In production, this would be managed by Supabase auth
CREATE TABLE IF NOT EXISTS auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant permissions for the werewolf_user
GRANT ALL PRIVILEGES ON DATABASE werewolf_game TO werewolf_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO werewolf_user;
GRANT ALL PRIVILEGES ON SCHEMA auth TO werewolf_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO werewolf_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO werewolf_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO werewolf_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO werewolf_user;