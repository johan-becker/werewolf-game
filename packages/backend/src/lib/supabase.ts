// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const hasSupabaseConfig = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseServiceKey &&
  !supabaseUrl.includes('your-project') && 
  !supabaseAnonKey.includes('your-supabase') &&
  !supabaseServiceKey.includes('your-supabase')
);

// Create clients only if Supabase is configured
export let supabaseAdmin: any = null;
export let supabase: any = null;

if (hasSupabaseConfig) {
  // ❌ ADMIN CLIENT - Bypasses RLS (only for server admin operations)
  supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  // ✅ CLIENT - Respects RLS (use this for user operations)
  supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
} else {
  console.warn('Supabase not configured - running in development mode without Supabase');
}

// Helper function to create authenticated client
export const createAuthenticatedClient = (accessToken: string) => {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase not configured - cannot create authenticated client');
  }
  
  return createClient(supabaseUrl!, supabaseAnonKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
