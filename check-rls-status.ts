import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkRLSStatus() {
  console.log('🔍 Checking RLS Status for All Tables...\n');

  try {
    // Query to check RLS status and policy count for all tables
    const { data: rlsStatus, error } = await supabaseAdmin
      .from('information_schema')
      .select(`
        table_name,
        row_security
      `)
      .eq('table_schema', 'public')
      .order('table_name');

    if (error) {
      console.error('❌ Error fetching RLS status:', error);
      return;
    }

    // Get policy counts for each table
    const { data: policies, error: policyError } = await supabaseAdmin.rpc('sql', {
      query: `
        SELECT 
          schemaname,
          tablename,
          policyname,
          permissive,
          roles,
          cmd,
          qual,
          with_check
        FROM pg_policies 
        WHERE schemaname = 'public'
        ORDER BY tablename, policyname;
      `
    });

    if (policyError) {
      console.error('❌ Error fetching policies:', policyError);
      
      // Alternative approach using a direct query
      const { data: policyCount, error: countError } = await supabaseAdmin.rpc('sql', {
        query: `
          SELECT 
            t.table_name,
            t.row_security,
            COALESCE(p.policy_count, 0) as policy_count
          FROM information_schema.tables t
          LEFT JOIN (
            SELECT 
              tablename, 
              COUNT(*) as policy_count
            FROM pg_policies 
            WHERE schemaname = 'public'
            GROUP BY tablename
          ) p ON t.table_name = p.tablename
          WHERE t.table_schema = 'public'
          AND t.table_type = 'BASE TABLE'
          ORDER BY t.table_name;
        `
      });

      if (countError) {
        console.error('❌ Alternative query failed:', countError);
        return;
      }

      console.log('📊 RLS Status Summary:\n');
      console.log('Table Name'.padEnd(20) + 'RLS Enabled'.padEnd(15) + 'Policy Count'.padEnd(15) + 'Status');
      console.log('─'.repeat(65));

      policyCount?.forEach((table: any) => {
        const rlsEnabled = table.row_security === 'YES' || table.row_security === true;
        const policyCount = table.policy_count || 0;
        const status = rlsEnabled && policyCount > 0 ? '✅ Good' : 
                      rlsEnabled && policyCount === 0 ? '⚠️  No Policies' :
                      !rlsEnabled && policyCount > 0 ? '⚠️  RLS Disabled' :
                      '❌ Missing Both';

        console.log(
          table.table_name.padEnd(20) + 
          (rlsEnabled ? 'YES' : 'NO').padEnd(15) + 
          policyCount.toString().padEnd(15) + 
          status
        );
      });

      return;
    }

    // Group policies by table
    const policyByTable: { [key: string]: any[] } = {};
    policies?.forEach((policy: any) => {
      if (!policyByTable[policy.tablename]) {
        policyByTable[policy.tablename] = [];
      }
      policyByTable[policy.tablename]?.push(policy);
    });

    console.log('📊 RLS Status Summary:\n');
    console.log('Table Name'.padEnd(20) + 'RLS Enabled'.padEnd(15) + 'Policy Count'.padEnd(15) + 'Status');
    console.log('─'.repeat(65));

    // Check each table
    const gameRelatedTables = ['users', 'profiles', 'games', 'players', 'game_logs', 'game_roles'];
    
    for (const tableName of gameRelatedTables) {
      const tableRLS = rlsStatus?.find(t => t.table_name === tableName);
      const tablePolicies = policyByTable[tableName] || [];
      
      const rlsEnabled = tableRLS?.row_security === 'YES' || tableRLS?.row_security === true;
      const policyCount = tablePolicies.length;
      
      const status = rlsEnabled && policyCount > 0 ? '✅ Good' : 
                    rlsEnabled && policyCount === 0 ? '⚠️  No Policies' :
                    !rlsEnabled && policyCount > 0 ? '⚠️  RLS Disabled' :
                    '❌ Missing Both';

      console.log(
        tableName.padEnd(20) + 
        (rlsEnabled ? 'YES' : 'NO').padEnd(15) + 
        policyCount.toString().padEnd(15) + 
        status
      );
    }

    // Show detailed policy information
    console.log('\n📋 Detailed Policy Information:\n');
    
    for (const tableName of gameRelatedTables) {
      const tablePolicies = policyByTable[tableName] || [];
      
      if (tablePolicies.length > 0) {
        console.log(`🔒 ${tableName.toUpperCase()} Table Policies:`);
        tablePolicies.forEach((policy: any) => {
          console.log(`  ├─ ${policy.policyname}`);
          console.log(`  │  Command: ${policy.cmd || 'ALL'}`);
          console.log(`  │  Type: ${policy.permissive || 'PERMISSIVE'}`);
          console.log(`  │  Using: ${policy.qual || 'true'}`);
          if (policy.with_check) {
            console.log(`  │  With Check: ${policy.with_check}`);
          }
          console.log('  │');
        });
        console.log('');
      } else {
        console.log(`❌ ${tableName.toUpperCase()}: No policies found\n`);
      }
    }

    // Generate SQL to fix missing RLS/policies
    console.log('🛠️  SQL Commands to Fix Issues:\n');
    
    for (const tableName of gameRelatedTables) {
      const tableRLS = rlsStatus?.find(t => t.table_name === tableName);
      const tablePolicies = policyByTable[tableName] || [];
      
      const rlsEnabled = tableRLS?.row_security === 'YES' || tableRLS?.row_security === true;
      const policyCount = tablePolicies.length;
      
      if (!rlsEnabled) {
        console.log(`-- Enable RLS for ${tableName}`);
        console.log(`ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;\n`);
      }
      
      if (policyCount === 0) {
        console.log(`-- Add basic policies for ${tableName}`);
        console.log(`-- TODO: Add appropriate policies for ${tableName} table\n`);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkRLSStatus();