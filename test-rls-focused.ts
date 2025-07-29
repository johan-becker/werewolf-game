import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

async function testRLSFocused() {
  console.log('🔒 Testing RLS Policies Specifically...\n');

  let userId: string;
  let gameId: string;

  try {
    // Setup: Create user and game with admin client
    console.log('📋 Setup: Creating test data...');
    const { data: authData } = await supabaseAdmin.auth.admin.createUser({
      email: 'rlstest@example.com',
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { username: 'rlstester' }
    });
    userId = authData.user!.id;

    const { data: game } = await supabaseAdmin
      .from('games')
      .insert({
        name: 'RLS Test Game',
        creator_id: userId,
        max_players: 6
      })
      .select()
      .single();
    gameId = game!.id;
    console.log('✅ Setup complete');

    // Test 1: Anonymous READ (should work - policy allows "Anyone can view games")
    console.log('\n1️⃣ Testing anonymous READ access...');
    const { data: anonRead, error: anonReadError } = await supabaseAnon
      .from('games')
      .select('*')
      .eq('id', gameId);

    if (anonReadError) {
      console.log('❌ Anonymous read blocked:', anonReadError.message);
    } else {
      console.log('✅ Anonymous read allowed:', anonRead?.length, 'games found');
    }

    // Test 2: Anonymous UPDATE (should fail - no policy allows this)
    console.log('\n2️⃣ Testing anonymous UPDATE access...');
    const { error: anonUpdateError } = await supabaseAnon
      .from('games')
      .update({ name: 'Hacked by Anon!' })
      .eq('id', gameId);

    if (anonUpdateError) {
      console.log('✅ Anonymous update blocked:', anonUpdateError.message);
    } else {
      console.log('❌ Anonymous update allowed - RLS FAILURE!');
    }

    // Test 3: Anonymous INSERT (should fail - requires auth.uid())
    console.log('\n3️⃣ Testing anonymous INSERT access...');
    const { error: anonInsertError } = await supabaseAnon
      .from('games')
      .insert({
        name: 'Anon Created Game',
        creator_id: userId, // Even with valid user ID
        max_players: 4
      });

    if (anonInsertError) {
      console.log('✅ Anonymous insert blocked:', anonInsertError.message);
    } else {
      console.log('❌ Anonymous insert allowed - RLS FAILURE!');
    }

    // Test 4: Sign in as the creator and test UPDATE (should work)
    console.log('\n4️⃣ Testing authenticated creator UPDATE...');
    await supabaseAnon.auth.signInWithPassword({
      email: 'rlstest@example.com',
      password: 'TestPassword123!'
    });

    const { error: creatorUpdateError } = await supabaseAnon
      .from('games')
      .update({ name: 'Updated by Creator' })
      .eq('id', gameId);

    if (creatorUpdateError) {
      console.log('❌ Creator update failed:', creatorUpdateError.message);
    } else {
      console.log('✅ Creator update allowed');
    }

    // Test 5: Create another user and test unauthorized UPDATE
    console.log('\n5️⃣ Testing unauthorized user UPDATE...');
    const { data: user2Data } = await supabaseAdmin.auth.admin.createUser({
      email: 'unauthorized@example.com',
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { username: 'unauthorized' }
    });

    // Sign in as the second user
    await supabaseAnon.auth.signInWithPassword({
      email: 'unauthorized@example.com',
      password: 'TestPassword123!'
    });

    const { error: unauthorizedUpdateError } = await supabaseAnon
      .from('games')
      .update({ name: 'Hacked by User2!' })
      .eq('id', gameId);

    if (unauthorizedUpdateError) {
      console.log('✅ Unauthorized update blocked:', unauthorizedUpdateError.message);
    } else {
      console.log('❌ Unauthorized update allowed - RLS FAILURE!');
    }

    // Cleanup
    console.log('\n🧹 Cleaning up...');
    await supabaseAdmin.from('games').delete().eq('id', gameId);
    await supabaseAdmin.auth.admin.deleteUser(userId);
    await supabaseAdmin.auth.admin.deleteUser(user2Data.user!.id);
    console.log('✅ Cleanup complete');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testRLSFocused();