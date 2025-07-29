import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkRLSSimple() {
  console.log('🔍 Checking RLS Status for All Tables...\n');

  const gameRelatedTables = ['profiles', 'games', 'players', 'game_logs', 'game_roles'];

  try {
    console.log('📊 RLS Status Summary:\n');
    console.log('Table Name'.padEnd(20) + 'RLS Check'.padEnd(15) + 'Status');
    console.log('─'.repeat(50));

    for (const tableName of gameRelatedTables) {
      try {
        // Try to query the table without authentication
        // If RLS is properly configured, this should either:
        // 1. Return empty results (policies block access)
        // 2. Return an error (no policies allow access)
        
        const { data, error } = await supabaseAdmin
          .from(tableName)
          .select('*')
          .limit(1);

        if (error) {
          // Check if error is RLS-related
          if (error.message.includes('row-level security') || 
              error.message.includes('policy') ||
              error.message.includes('permission denied')) {
            console.log(tableName.padEnd(20) + '✅ RLS Active'.padEnd(15) + 'Policies Working');
          } else {
            console.log(tableName.padEnd(20) + '❓ Unknown'.padEnd(15) + `Error: ${error.message}`);
          }
        } else {
          // No error means either:
          // 1. No RLS enabled
          // 2. RLS enabled but permissive policies
          console.log(tableName.padEnd(20) + '⚠️  Check Needed'.padEnd(15) + 'Access Allowed - Review Policies');
        }

        // Additional check: Try to insert test data (this should definitely fail for most tables)
        const testInsert = await supabaseAdmin
          .from(tableName)
          .insert({})
          .select();

        if (testInsert.error) {
          if (testInsert.error.message.includes('row-level security') ||
              testInsert.error.message.includes('policy')) {
            console.log(''.padEnd(20) + ''.padEnd(15) + '├─ Insert: RLS Protected');
          } else {
            console.log(''.padEnd(20) + ''.padEnd(15) + `├─ Insert Error: ${testInsert.error.message.substring(0, 30)}...`);
          }
        } else {
          console.log(''.padEnd(20) + ''.padEnd(15) + '├─ Insert: ❌ ALLOWED (BAD!)');
        }

      } catch (err: any) {
        console.log(tableName.padEnd(20) + '❌ Error'.padEnd(15) + `Failed: ${err.message}`);
      }

      console.log(''); // Empty line for readability
    }

    // Manual verification suggestions
    console.log('🛠️  Manual Verification Commands:\n');
    console.log('Run these SQL commands in Supabase SQL Editor to check RLS status:\n');
    
    gameRelatedTables.forEach(table => {
      console.log(`-- Check ${table} RLS status`);
      console.log(`SELECT 
  schemaname, 
  tablename, 
  rowsecurity,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = '${table}') as policy_count
FROM pg_tables 
WHERE tablename = '${table}' AND schemaname = 'public';\n`);
    });

    console.log('-- List all policies');
    console.log(`SELECT tablename, policyname, cmd, permissive, roles
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname;\n`);

    console.log('🎯 Requirements:');
    console.log('Each table should have:');
    console.log('• rowsecurity = true');
    console.log('• policy_count > 0');
    console.log('• Policies that properly restrict access based on auth.uid()');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkRLSSimple();