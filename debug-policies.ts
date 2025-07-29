import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function debugPolicies() {
  console.log('🔍 Debugging Current Policies...\n');

  try {
    // Query current policies on games table
    const { data, error } = await supabaseAdmin
      .rpc('sql', {
        query: `
          SELECT 
            policyname,
            cmd,
            permissive,
            roles,
            qual,
            with_check
          FROM pg_policies 
          WHERE tablename = 'games' AND schemaname = 'public'
          ORDER BY policyname;
        `
      });

    if (error) {
      console.error('❌ Error querying policies:', error);
      return;
    }

    console.log('📋 Current Policies on GAMES table:\n');

    if (!data || data.length === 0) {
      console.log('❌ No policies found on games table!');
      console.log('This means RLS is not protecting the table properly.\n');
      
      console.log('🛠️  You need to create basic policies:');
      console.log(`
CREATE POLICY "Anyone can view games" 
  ON games FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create games" 
  ON games FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = creator_id);

CREATE POLICY "Only creator can update game" 
  ON games FOR UPDATE 
  USING (auth.uid() IS NOT NULL AND auth.uid() = creator_id);

CREATE POLICY "Only creator can delete game" 
  ON games FOR DELETE 
  USING (auth.uid() IS NOT NULL AND auth.uid() = creator_id);
      `);
      return;
    }

    // Display each policy
    data.forEach((policy: any, index: number) => {
      console.log(`${index + 1}. Policy: ${policy.policyname}`);
      console.log(`   Command: ${policy.cmd || 'ALL'}`);
      console.log(`   Type: ${policy.permissive || 'PERMISSIVE'}`);
      console.log(`   Roles: ${policy.roles ? policy.roles.join(', ') : 'All roles'}`);
      console.log(`   Using: ${policy.qual || 'true'}`);
      if (policy.with_check) {
        console.log(`   With Check: ${policy.with_check}`);
      }
      console.log('');
    });

    // Check if RLS is enabled
    const { data: rlsStatus } = await supabaseAdmin
      .rpc('sql', {
        query: `
          SELECT 
            tablename,
            rowsecurity
          FROM pg_tables 
          WHERE tablename = 'games' AND schemaname = 'public';
        `
      });

    console.log('🔒 RLS Status:');
    if (rlsStatus && rlsStatus.length > 0) {
      console.log(`Games table RLS enabled: ${rlsStatus[0].rowsecurity ? 'YES' : 'NO'}`);
    }

    // Analyze potential issues
    console.log('\n🔍 Analysis:');
    
    const hasSelectPolicy = data.some((p: any) => p.cmd === 'SELECT' || p.cmd === 'ALL');
    const hasUpdatePolicy = data.some((p: any) => p.cmd === 'UPDATE' || p.cmd === 'ALL');
    const hasInsertPolicy = data.some((p: any) => p.cmd === 'INSERT' || p.cmd === 'ALL');
    
    console.log(`Select policies: ${hasSelectPolicy ? '✅' : '❌'}`);
    console.log(`Update policies: ${hasUpdatePolicy ? '✅' : '❌'}`);
    console.log(`Insert policies: ${hasInsertPolicy ? '✅' : '❌'}`);

    // Look for problematic policies
    const problematicPolicies = data.filter((p: any) => 
      (p.cmd === 'UPDATE' || p.cmd === 'ALL') && 
      (p.qual === 'true' || p.qual === null || p.qual?.includes('true'))
    );

    if (problematicPolicies.length > 0) {
      console.log('\n⚠️  Problematic Policies Found:');
      problematicPolicies.forEach((p: any) => {
        console.log(`- "${p.policyname}" allows UPDATE with condition: ${p.qual || 'true'}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugPolicies();