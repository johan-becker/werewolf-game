// Test if auth.uid() is working correctly in policies
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!; 
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthContext() {
  console.log('🔍 Testing Auth Context in RLS Policies\n');

  try {
    // Test 1: Check what auth.uid() returns for anonymous user
    console.log('1️⃣ Testing auth.uid() for anonymous user...');
    
    const { data: anonUID, error: anonError } = await supabaseClient
      .rpc('auth_uid_test');

    if (anonError) {
      console.log('❌ Cannot test auth.uid() directly:', anonError.message);
    } else {
      console.log('Anonymous auth.uid():', anonUID);
    }

    // Test 2: Create a user and test auth context
    console.log('\n2️⃣ Creating test user...');
    
    const { data: testUser } = await supabaseAdmin.auth.admin.createUser({
      email: 'authtest@example.com',
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { username: 'authtest' }
    });

    const userId = testUser.user!.id;
    console.log('✅ User created:', userId);

    // Test 3: Sign in and check auth context
    console.log('\n3️⃣ Signing in user...');
    
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: 'authtest@example.com', 
      password: 'TestPassword123!'
    });

    if (signInError) {
      console.log('❌ Sign in failed:', signInError.message);
    } else {
      console.log('✅ User signed in');
      console.log('Session user ID:', signInData.user?.id);
      console.log('Access token exists:', !!signInData.session?.access_token);
    }

    // Test 4: Create game with authenticated user
    console.log('\n4️⃣ Creating game as authenticated user...');
    
    const { data: gameData, error: gameError } = await supabaseClient
      .from('games')
      .insert({
        name: 'Auth Context Test Game',
        max_players: 6
      })
      .select()
      .single();

    if (gameError) {
      console.log('❌ Game creation failed:', gameError.message);
    } else {
      console.log('✅ Game created:', gameData.id);
      console.log('Creator ID:', gameData.creator_id);
      console.log('User ID matches:', gameData.creator_id === userId);

      // Test 5: Try to update own game
      console.log('\n5️⃣ Updating own game...');
      
      const { error: updateError } = await supabaseClient
        .from('games')
        .update({ name: 'Updated by Owner' })
        .eq('id', gameData.id);

      if (updateError) {
        console.log('❌ Own game update failed:', updateError.message);
      } else {
        console.log('✅ Own game updated successfully');
      }

      // Test 6: Check auth context after update
      console.log('\n6️⃣ Checking current auth state...');
      
      const { data: currentUser } = await supabaseClient.auth.getUser();
      console.log('Current user ID:', currentUser?.user?.id);
      console.log('Still authenticated:', !!currentUser?.user);

      // Cleanup
      await supabaseAdmin.from('games').delete().eq('id', gameData.id);
    }

    // Cleanup user
    await supabaseAdmin.auth.admin.deleteUser(userId);
    console.log('\n✅ Cleanup complete');

    // Test 7: Manual RLS test with raw SQL
    console.log('\n7️⃣ Suggestion for manual SQL test:');
    console.log('Run this in Supabase SQL Editor:');
    console.log(`
-- Test 1: Check auth.uid() returns null for unauthenticated 
SELECT auth.uid() as current_user_id;

-- Test 2: This should show the actual policy conditions
SELECT 
  policyname,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'games' AND cmd = 'UPDATE';

-- Test 3: Test the policy condition manually
SELECT 
  id, 
  name, 
  creator_id,
  (auth.uid() IS NOT NULL AND auth.uid() = creator_id) as policy_check
FROM games 
LIMIT 3;
    `);

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAuthContext();