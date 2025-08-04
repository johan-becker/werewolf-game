// Environment setup for tests
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '../../.env.test') });

// Set required environment variables if not set
process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://test.supabase.co';
process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'test-anon-key';
process.env.SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'test-service-key';
process.env.DATABASE_URL =
  process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/werewolf_game_test';
process.env.JWT_SECRET =
  process.env.JWT_SECRET || 'test-jwt-secret-that-is-at-least-32-characters-long-for-testing';
process.env.JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  'test-jwt-refresh-secret-that-is-at-least-32-characters-long-for-testing';
process.env.SESSION_SECRET =
  process.env.SESSION_SECRET ||
  'test-session-secret-that-is-at-least-32-characters-long-for-testing';
process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
