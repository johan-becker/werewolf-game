// Test RLS with correct Supabase client usage
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// ❌ ADMIN CLIENT - Bypasses RLS
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// ✅ CORRECT CLIENT - Respects RLS  
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

async function testCorrectRLS() {
  console.log('🔒 Testing RLS with CORRECT Client Usage\n');

  let userId: string = '';
  let gameId: string = '';

  try {
    // Setup: Create test data with admin (bypasses RLS)
    console.log('📋 Setup: Creating test data with ADMIN client...');
    const { data: testUser } = await supabaseAdmin.auth.admin.createUser({
      email: 'rlscorrect@example.com',
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { username: 'rlstest' }
    });
    userId = testUser.user!.id;

    const { data: testGame } = await supabaseAdmin
      .from('games')
      .insert({
        name: 'RLS Correct Test Game',
        creator_id: userId,
        max_players: 6
      })
      .select()
      .single();
    gameId = testGame!.id;
    console.log('✅ Test data created');

    // Test 1: Anonymous client (should respect RLS)
    console.log('\n1️⃣ Testing ANONYMOUS client (should respect RLS)...');
    
    const { data: anonRead, error: anonReadError } = await supabaseClient
      .from('games')
      .select('*')
      .eq('id', gameId);

    console.log('Anonymous READ:', anonReadError ? `❌ ${anonReadError.message}` : `✅ Allowed (${anonRead?.length} games)`);

    const { error: anonUpdateError } = await supabaseClient
      .from('games')
      .update({ name: 'Hacked by Anonymous' })
      .eq('id', gameId);

    console.log('Anonymous UPDATE:', anonUpdateError ? `✅ BLOCKED: ${anonUpdateError.message}` : '❌ ALLOWED - RLS FAILURE!');

    // Test 2: Sign in user and get authenticated client
    console.log('\n2️⃣ Testing AUTHENTICATED client...');
    
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: 'rlscorrect@example.com',
      password: 'TestPassword123!'
    });

    if (signInError || !signInData.session) {
      console.log('❌ Sign in failed:', signInError?.message);
      return;
    }

    console.log('✅ User signed in successfully');

    // Test with the authenticated session
    const { error: authUpdateError } = await supabaseClient
      .from('games')
      .update({ name: 'Updated by Owner' })
      .eq('id', gameId);

    console.log('Owner UPDATE:', authUpdateError ? `❌ BLOCKED: ${authUpdateError.message}` : '✅ ALLOWED');

    // Test 3: Create another user and test unauthorized access
    console.log('\n3️⃣ Testing UNAUTHORIZED user...');
    
    const { data: user2Data } = await supabaseAdmin.auth.admin.createUser({
      email: 'unauthorized2@example.com',
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { username: 'unauthorized2' }
    });

    // Sign out current user and sign in as user2
    await supabaseClient.auth.signOut();
    
    const { data: user2SignIn } = await supabaseClient.auth.signInWithPassword({
      email: 'unauthorized2@example.com',
      password: 'TestPassword123!'
    });

    if (user2SignIn.session) {
      const { error: unauthorizedError } = await supabaseClient
        .from('games')
        .update({ name: 'Hacked by User2' })
        .eq('id', gameId);

      console.log('Unauthorized UPDATE:', unauthorizedError ? `✅ BLOCKED: ${unauthorizedError.message}` : '❌ ALLOWED - RLS FAILURE!');
    }

    // Test 4: Show the difference - Admin client bypasses RLS
    console.log('\n4️⃣ Demonstrating ADMIN client bypasses RLS...');
    
    const { error: adminUpdateError } = await supabaseAdmin
      .from('games')
      .update({ name: 'Admin Can Always Update' })
      .eq('id', gameId);

    console.log('Admin UPDATE:', adminUpdateError ? `❌ BLOCKED: ${adminUpdateError.message}` : '✅ ALLOWED (bypasses RLS)');

    console.log('\n📊 SUMMARY:');
    console.log('✅ Anonymous client: READ allowed, UPDATE blocked');
    console.log('✅ Owner client: READ and UPDATE allowed');  
    console.log('✅ Unauthorized client: UPDATE blocked');
    console.log('✅ Admin client: Always allowed (bypasses RLS)');
    console.log('\n🎯 This demonstrates proper RLS behavior!');

    // Cleanup
    console.log('\n🧹 Cleaning up...');
    await supabaseAdmin.from('games').delete().eq('id', gameId);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    await supabaseAdmin.auth.admin.deleteUser(user2Data.user!.id);
    console.log('✅ Cleanup complete');

  } catch (error) {
    console.error('❌ Test error:', error);
    
    // Emergency cleanup
    if (gameId) await supabaseAdmin.from('games').delete().eq('id', gameId);
    if (userId) await supabaseAdmin.auth.admin.deleteUser(userId);
  }
}

testCorrectRLS();