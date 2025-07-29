import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function listCurrentPolicies() {
  console.log('📋 Current RLS Policies...\n');

  try {
    // Test approach: Try operations that should reveal policy behavior
    console.log('🔍 Testing Policy Behavior on GAMES table:\n');

    // Create test user
    const { data: testUser } = await supabaseAdmin.auth.admin.createUser({
      email: 'policytest@example.com',
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { username: 'policytest' }
    });

    const userId = testUser?.user?.id;
    console.log('✅ Created test user:', userId);

    // Create test game with admin client (should work)
    const { data: testGame, error: createError } = await supabaseAdmin
      .from('games')
      .insert({
        name: 'Policy Test Game',
        creator_id: userId,
        max_players: 6
      })
      .select()
      .single();

    if (createError) {
      console.log('❌ Admin create failed:', createError.message);
      return;
    }

    console.log('✅ Created test game:', testGame?.id);

    // Now test with anon client (respects RLS)
    const supabaseAnon = createClient(supabaseUrl, process.env.SUPABASE_ANON_KEY!);

    // Test 1: Anonymous SELECT
    console.log('\n1️⃣ Anonymous SELECT test:');
    const { data: anonSelect, error: selectError } = await supabaseAnon
      .from('games')
      .select('*')
      .eq('id', testGame.id);

    if (selectError) {
      console.log('❌ SELECT blocked:', selectError.message);
    } else {
      console.log('✅ SELECT allowed:', anonSelect?.length, 'records');
    }

    // Test 2: Anonymous UPDATE
    console.log('\n2️⃣ Anonymous UPDATE test:');
    const { error: updateError } = await supabaseAnon
      .from('games')
      .update({ name: 'Hacked by Anonymous' })
      .eq('id', testGame.id);

    if (updateError) {
      console.log('✅ UPDATE blocked:', updateError.message);
    } else {
      console.log('❌ UPDATE allowed - SECURITY ISSUE!');
    }

    // Test 3: Anonymous INSERT
    console.log('\n3️⃣ Anonymous INSERT test:');
    const { error: insertError } = await supabaseAnon
      .from('games')
      .insert({
        name: 'Anonymous Game',
        creator_id: userId,
        max_players: 4
      });

    if (insertError) {
      console.log('✅ INSERT blocked:', insertError.message);
    } else {
      console.log('❌ INSERT allowed - SECURITY ISSUE!');
    }

    // Test 4: Sign in as creator and test UPDATE
    console.log('\n4️⃣ Creator UPDATE test:');
    await supabaseAnon.auth.signInWithPassword({
      email: 'policytest@example.com',
      password: 'TestPassword123!'
    });

    const { error: creatorUpdateError } = await supabaseAnon
      .from('games')
      .update({ name: 'Updated by Creator' })
      .eq('id', testGame.id);

    if (creatorUpdateError) {
      console.log('❌ Creator UPDATE blocked:', creatorUpdateError.message);
    } else {
      console.log('✅ Creator UPDATE allowed');
    }

    // Test 5: Create second user and test unauthorized UPDATE
    console.log('\n5️⃣ Unauthorized user UPDATE test:');
    const { data: user2 } = await supabaseAdmin.auth.admin.createUser({
      email: 'unauthorized@example.com',
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { username: 'unauthorized' }
    });

    await supabaseAnon.auth.signInWithPassword({
      email: 'unauthorized@example.com',
      password: 'TestPassword123!'
    });

    const { error: unauthorizedError } = await supabaseAnon
      .from('games')
      .update({ name: 'Hacked by User2' })
      .eq('id', testGame.id);

    if (unauthorizedError) {
      console.log('✅ Unauthorized UPDATE blocked:', unauthorizedError.message);
    } else {
      console.log('❌ Unauthorized UPDATE allowed - SECURITY ISSUE!');
    }

    // Summary
    console.log('\n📊 Policy Summary:');
    console.log('If UPDATE operations are being allowed when they should be blocked,');
    console.log('it means there are policies with:');
    console.log('• FOR UPDATE or FOR ALL');
    console.log('• USING clause that evaluates to true for anonymous/unauthorized users');
    console.log('\nCheck Supabase Dashboard > Authentication > Policies for the games table');

    // Cleanup
    console.log('\n🧹 Cleaning up...');
    await supabaseAdmin.from('games').delete().eq('id', testGame.id);
    await supabaseAdmin.auth.admin.deleteUser(userId!);
    await supabaseAdmin.auth.admin.deleteUser(user2?.user?.id!);
    console.log('✅ Cleanup complete');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

listCurrentPolicies();