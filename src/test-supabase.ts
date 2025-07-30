import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSupabase() {
  console.log('🔄 Testing Supabase connection...\n');

  try {
    // 1. Test Auth - User erstellen
    console.log('1️⃣ Testing Auth - Creating user...');
    const timestamp = Date.now();
    const testEmail = `testplayer${timestamp}@example.com`;
    let userId: string | undefined;
    
    // First try to create user with admin client
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'TestPassword123!',
      email_confirm: true,
      user_metadata: { username: 'testplayer' }
    });

    if (authError) {
      console.error('❌ Auth Error:', authError.message);
      // Try alternative: regular signup
      console.log('Trying alternative signup method...');
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: {
          data: { username: 'testplayer' }
        }
      });
      
      if (signupError) {
        console.error('❌ Signup Error:', signupError.message);
        return;
      }
      console.log('✅ User created via signup:', testEmail);
      userId = signupData.user?.id;
    } else {
      console.log('✅ User created:', testEmail);
      userId = authData.user?.id;
    }

    // 2. Test Profile - Sollte automatisch erstellt sein
    console.log('\n2️⃣ Testing Profile - Checking auto-created profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('❌ Profile Error:', profileError.message);
    } else {
      console.log('✅ Profile found:', profile);
    }

    // 3. Test Game Creation
    console.log('\n3️⃣ Testing Game - Creating game...');
    const { data: game, error: gameError } = await supabase
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

    // 4. Test Join Game
    console.log('\n4️⃣ Testing Players - Joining game...');
    const { data: player, error: playerError } = await supabase
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

    // 5. Test Game Overview
    console.log('\n5️⃣ Testing View - Game overview...');
    const { data: overview, error: overviewError } = await supabase
      .from('game_overview')
      .select('*')
      .eq('id', game.id)
      .single();

    if (overviewError) {
      console.error('❌ Overview Error:', overviewError.message);
    } else {
      console.log('✅ Game overview:', overview);
    }

    // 6. Test RLS - Versuche als anderer User
    console.log('\n6️⃣ Testing RLS - Trying unauthorized update...');
    const { error: rlsError } = await supabase
      .from('games')
      .update({ name: 'Hacked!' })
      .eq('id', game.id);

    if (rlsError) {
      console.log('✅ RLS working - Update blocked:', rlsError.message);
    } else {
      console.log('❌ RLS not working - Update should have failed!');
    }

    // 7. Test Helper Functions
    console.log('\n7️⃣ Testing Functions - Join by code...');
    const { data: joinResult, error: joinError } = await supabase
      .rpc('join_game_by_code', { code_param: game.code });

    if (joinError) {
      console.error('❌ Function Error:', joinError.message);
    } else {
      console.log('✅ Function result:', joinResult);
    }

    console.log('\n🎉 All tests completed!');

    // Cleanup
    console.log('\n🧹 Cleaning up test data...');
    await supabase.from('players').delete().eq('game_id', game.id);
    await supabase.from('games').delete().eq('id', game.id);
    await supabase.auth.admin.deleteUser(userId!);
    console.log('✅ Cleanup complete');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run tests
testSupabase();