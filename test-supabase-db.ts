import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Service role client (bypasses RLS) - for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Anonymous client (respects RLS) - for testing RLS policies
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
  console.log('🔄 Testing Supabase connection...\n');

  try {
    // 1. Test Auth - User erstellen (with admin client)
    console.log('1️⃣ Testing Auth - Creating user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: 'testplayer@example.com',
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { username: 'testplayer' }
    });

    if (authError) {
      console.error('❌ Auth Error:', authError.message);
      return;
    }
    console.log('✅ User created:', authData.user?.email);
    const userId = authData.user?.id;

    // 2. Test Profile - Sollte automatisch erstellt sein (with admin client)
    console.log('\n2️⃣ Testing Profile - Checking auto-created profile...');
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('❌ Profile Error:', profileError.message);
    } else {
      console.log('✅ Profile found:', profile);
    }

    // 3. Test Game Creation (with admin client)
    console.log('\n3️⃣ Testing Game - Creating game...');
    const { data: game, error: gameError } = await supabaseAdmin
      .from('games')
      .insert({
        name: 'Test Werwolf Game',
        creator_id: userId,
        max_players: 8
      })
      .select()
      .single();

    if (gameError) {
      console.error('❌ Game Error:', gameError.message);
      return;
    }
    console.log('✅ Game created:', {
      id: game.id,
      name: game.name,
      code: game.code
    });

    // 4. Test Join Game (with admin client)
    console.log('\n4️⃣ Testing Players - Joining game...');
    const { data: player, error: playerError } = await supabaseAdmin
      .from('players')
      .insert({
        game_id: game.id,
        user_id: userId,
        is_host: true
      })
      .select()
      .single();

    if (playerError) {
      console.error('❌ Player Error:', playerError.message);
    } else {
      console.log('✅ Joined game as host');
    }

    // 5. Test Game Overview (with admin client)
    console.log('\n5️⃣ Testing View - Game overview...');
    const { data: overview, error: overviewError } = await supabaseAdmin
      .from('game_overview')
      .select('*')
      .eq('id', game.id)
      .single();

    if (overviewError) {
      console.error('❌ Overview Error:', overviewError.message);
    } else {
      console.log('✅ Game overview:', overview);
    }

    // 6. Test RLS - Versuche als anonymer User (RICHTIG mit anon client!)
    console.log('\n6️⃣ Testing RLS - Trying unauthorized update with anon client...');
    const { error: rlsError } = await supabaseAnon
      .from('games')
      .update({ name: 'Hacked!' })
      .eq('id', game.id);

    if (rlsError) {
      console.log('✅ RLS working - Update blocked:', rlsError.message);
    } else {
      console.log('❌ RLS not working - Update should have failed!');
    }

    // 6b. Test RLS - Try to read as anonymous user
    console.log('\n6b️⃣ Testing RLS - Reading games as anonymous user...');
    const { data: anonGames, error: anonReadError } = await supabaseAnon
      .from('games')
      .select('*')
      .eq('id', game.id);

    if (anonReadError) {
      console.log('✅ RLS working - Read blocked for anon user:', anonReadError.message);
    } else if (anonGames && anonGames.length === 0) {
      console.log('✅ RLS working - No games returned for anon user');
    } else {
      console.log('⚠️  RLS allowing read access for anon user:', anonGames);
    }

    // 6c. Test RLS - Try authenticated user access
    console.log('\n6c️⃣ Testing RLS - Accessing as authenticated user...');
    
    // First sign in the user
    const { data: signInData, error: signInError } = await supabaseAnon.auth.signInWithPassword({
      email: 'testplayer@example.com',
      password: 'TestPassword123!'
    });

    if (signInError) {
      console.log('❌ Sign in failed:', signInError.message);
    } else {
      console.log('✅ User signed in successfully');
      
      // Now try to access games as authenticated user
      const { data: authGames, error: authReadError } = await supabaseAnon
        .from('games')
        .select('*')
        .eq('creator_id', userId);

      if (authReadError) {
        console.log('❌ Authenticated read failed:', authReadError.message);
      } else {
        console.log('✅ Authenticated user can read their games:', authGames?.length || 0, 'games');
      }

      // Try to update own game
      const { error: authUpdateError } = await supabaseAnon
        .from('games')
        .update({ name: 'Updated by Owner' })
        .eq('id', game.id);

      if (authUpdateError) {
        console.log('❌ Owner update failed:', authUpdateError.message);
      } else {
        console.log('✅ Owner can update their own game');
      }
    }

    // 7. Test Helper Functions (with admin client)
    console.log('\n7️⃣ Testing Functions - Join by code...');
    const { data: joinResult, error: joinError } = await supabaseAdmin
      .rpc('join_game_by_code', { code_param: game.code });

    if (joinError) {
      console.error('❌ Function Error:', joinError.message);
    } else {
      console.log('✅ Function result:', joinResult);
    }

    console.log('\n🎉 All tests completed!');

    // Cleanup (with admin client)
    console.log('\n🧹 Cleaning up test data...');
    await supabaseAdmin.from('players').delete().eq('game_id', game.id);
    await supabaseAdmin.from('games').delete().eq('id', game.id);
    await supabaseAdmin.auth.admin.deleteUser(userId!);
    console.log('✅ Cleanup complete');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run tests
testSupabase();