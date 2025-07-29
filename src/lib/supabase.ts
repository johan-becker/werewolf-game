// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Für Server-Side (mit Admin-Rechten)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Für Client-Side (mit RLS)
export const supabase = createClient(
  supabaseUrl, 
  process.env.SUPABASE_ANON_KEY!
);