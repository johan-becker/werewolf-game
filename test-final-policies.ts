import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

async function testFinalPolicies() {
  console.log('🔒 Testing Final RLS Policies - Should Have Exactly 4 Policies\n');

  let userId: string = '';
  let userId2: string = '';
  let gameId: string = '';

  try {
    // Setup
    console.log('📋 Setup: Creating test users and game...');
    
    // Create user 1 (game creator)
    const { data: user1Data } = await supabaseAdmin.auth.admin.createUser({
      email: 'creator@example.com',
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { username: 'creator' }
    });
    userId = user1Data.user!.id;

    // Create user 2 (unauthorized user)
    const { data: user2Data } = await supabaseAdmin.auth.admin.createUser({
      email: 'other@example.com', 
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { username: 'other' }
    });
    userId2 = user2Data.user!.id;

    // Create game with admin client
    const { data: game } = await supabaseAdmin
      .from('games')
      .insert({
        name: 'Policy Test Game',
        creator_id: userId,
        max_players: 6
      })
      .select()
      .single();
    gameId = game!.id;

    console.log('✅ Setup complete\n');

    // Test 1: Anonymous SELECT (should work - Policy 1)
    console.log('1️⃣ Testing Anonymous SELECT - Should ALLOW');
    const { data: anonSelect, error: selectError } = await supabaseAnon
      .from('games')
      .select('*')
      .eq('id', gameId);

    if (selectError) {
      console.log('❌ FAIL: SELECT blocked -', selectError.message);
    } else {
      console.log('✅ PASS: SELECT allowed -', anonSelect?.length, 'games found');
    }

    // Test 2: Anonymous UPDATE (should fail - no policy allows this)
    console.log('\n2️⃣ Testing Anonymous UPDATE - Should BLOCK');
    const { error: anonUpdateError } = await supabaseAnon
      .from('games')
      .update({ name: 'Hacked by Anonymous' })
      .eq('id', gameId);

    if (anonUpdateError) {
      console.log('✅ PASS: UPDATE blocked -', anonUpdateError.message);
    } else {
      console.log('❌ FAIL: UPDATE allowed - SECURITY BREACH!');
    }

    // Test 3: Anonymous INSERT (should fail - Policy 2 requires auth.uid())
    console.log('\n3️⃣ Testing Anonymous INSERT - Should BLOCK');
    const { error: anonInsertError } = await supabaseAnon
      .from('games')
      .insert({
        name: 'Anonymous Game',
        creator_id: userId,
        max_players: 4
      });

    if (anonInsertError) {
      console.log('✅ PASS: INSERT blocked -', anonInsertError.message);
    } else {
      console.log('❌ FAIL: INSERT allowed - SECURITY BREACH!');
    }

    // Test 4: Creator UPDATE (should work - Policy 3)
    console.log('\n4️⃣ Testing Creator UPDATE - Should ALLOW');
    await supabaseAnon.auth.signInWithPassword({
      email: 'creator@example.com',
      password: 'TestPassword123!'
    });

    const { error: creatorUpdateError } = await supabaseAnon
      .from('games')
      .update({ name: 'Updated by Creator' })
      .eq('id', gameId);

    if (creatorUpdateError) {
      console.log('❌ FAIL: Creator UPDATE blocked -', creatorUpdateError.message);
    } else {
      console.log('✅ PASS: Creator UPDATE allowed');
    }

    // Test 5: Creator INSERT (should work - Policy 2)
    console.log('\n5️⃣ Testing Creator INSERT - Should ALLOW');
    const { error: creatorInsertError } = await supabaseAnon
      .from('games')
      .insert({
        name: 'Creator New Game',
        creator_id: userId,
        max_players: 8
      });

    if (creatorInsertError) {
      console.log('❌ FAIL: Creator INSERT blocked -', creatorInsertError.message);
    } else {
      console.log('✅ PASS: Creator INSERT allowed');
    }

    // Test 6: Unauthorized user UPDATE (should fail - Policy 3)
    console.log('\n6️⃣ Testing Unauthorized User UPDATE - Should BLOCK');
    await supabaseAnon.auth.signInWithPassword({
      email: 'other@example.com',
      password: 'TestPassword123!'
    });

    const { error: unauthorizedError } = await supabaseAnon
      .from('games')
      .update({ name: 'Hacked by Other User' })
      .eq('id', gameId);

    if (unauthorizedError) {
      console.log('✅ PASS: Unauthorized UPDATE blocked -', unauthorizedError.message);
    } else {
      console.log('❌ FAIL: Unauthorized UPDATE allowed - SECURITY BREACH!');
    }

    // Test 7: Unauthorized user can still SELECT (Policy 1)
    console.log('\n7️⃣ Testing Unauthorized User SELECT - Should ALLOW');
    const { data: otherSelect, error: otherSelectError } = await supabaseAnon
      .from('games')
      .select('*')
      .eq('id', gameId);

    if (otherSelectError) {
      console.log('❌ FAIL: Other user SELECT blocked -', otherSelectError.message);
    } else {
      console.log('✅ PASS: Other user SELECT allowed -', otherSelect?.length, 'games found');
    }

    // Summary
    console.log('\n📊 FINAL RESULT:');
    console.log('If all tests show PASS, your 4 policies are working correctly!');  
    console.log('If any test shows FAIL, there are still policy issues.');

    console.log('\n🎯 Expected Policy Behavior:');
    console.log('✅ Anyone can SELECT (view games)');
    console.log('✅ Authenticated users can INSERT (create games) only with their own creator_id');
    console.log('✅ Only creators can UPDATE their own games');
    console.log('✅ Only creators can DELETE their own games');
    console.log('❌ Anonymous users cannot UPDATE/INSERT');
    console.log('❌ Non-creators cannot UPDATE/DELETE games');

    // Cleanup
    console.log('\n🧹 Cleaning up...');
    await supabaseAdmin.from('games').delete().eq('creator_id', userId);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    await supabaseAdmin.auth.admin.deleteUser(userId2);
    console.log('✅ Cleanup complete');

  } catch (error) {
    console.error('❌ Test error:', error);
    
    // Emergency cleanup
    if (userId) await supabaseAdmin.auth.admin.deleteUser(userId);
    if (userId2) await supabaseAdmin.auth.admin.deleteUser(userId2);
  }
}

testFinalPolicies();