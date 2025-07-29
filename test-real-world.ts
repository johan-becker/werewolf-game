import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Use ONLY anon key (like real frontend would)
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRealWorld() {
  console.log('🌍 Real-World Test: Frontend-like behavior\n');

  try {
    // Test 1: Try to update without authentication (like a hacker would)
    console.log('1️⃣ Hacker attempt: Update random game without auth...');
    
    const { error: hackError } = await supabase
      .from('games')
      .update({ name: 'HACKED!' })
      .eq('name', 'Test Werwolf Game'); // Try to update any game

    if (hackError) {
      console.log('✅ SECURE: Hack attempt blocked -', hackError.message);
    } else {
      console.log('❌ VULNERABLE: Hack attempt succeeded!');
    }

    // Test 2: Sign up a real user
    console.log('\n2️⃣ Real user signup...');
    
    const userEmail = `realuser_${Date.now()}@example.com`;
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: userEmail,
      password: 'RealUser123!',
      options: {
        data: { username: 'realuser' }
      }
    });

    if (signupError) {
      console.log('❌ Signup failed:', signupError.message);
      return;
    }

    console.log('✅ User signed up:', signupData.user?.email);

    if (!signupData.session) {
      console.log('⚠️  No session created, trying manual signin...');
      
      const { data: signinData, error: signinError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: 'RealUser123!'
      });

      if (signinError) {
        console.log('❌ Signin failed:', signinError.message);
        return;
      }
      
      console.log('✅ Manual signin successful');
    }

    // Test 3: Authenticated user creates game
    console.log('\n3️⃣ Authenticated user creates game...');
    
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .insert({
        name: 'Real User Game',
        max_players: 8
      })
      .select()
      .single();

    if (gameError) {
      console.log('❌ Game creation failed:', gameError.message);
    } else {
      console.log('✅ Game created:', gameData.name);

      // Test 4: User updates their own game
      console.log('\n4️⃣ User updates their own game...');
      
      const { error: updateError } = await supabase
        .from('games')
        .update({ name: 'Updated Real User Game' })
        .eq('id', gameData.id);

      if (updateError) {
        console.log('❌ Own game update failed:', updateError.message);
      } else {
        console.log('✅ Own game updated successfully');
      }

      // Test 5: Sign out and try to update (should fail)
      console.log('\n5️⃣ Sign out and try to update...');
      
      await supabase.auth.signOut();
      
      const { error: signedOutError } = await supabase
        .from('games')
        .update({ name: 'Signed Out Hack Attempt' })
        .eq('id', gameData.id);

      if (signedOutError) {
        console.log('✅ SECURE: Signed out update blocked -', signedOutError.message);
      } else {
        console.log('❌ VULNERABLE: Signed out update succeeded!');
      }

      // Cleanup (sign back in as admin to clean up)
      console.log('\n🧹 Manual cleanup...');
      console.log('Game ID to delete manually:', gameData.id);
      console.log('User email to delete manually:', userEmail);
    }

    console.log('\n🎯 REAL WORLD TEST RESULTS:');
    console.log('This simulates actual frontend behavior.');
    console.log('If hacker attempts are blocked and legitimate users can operate normally,');
    console.log('then your RLS is working correctly in production!');

  } catch (error) {
    console.error('❌ Real world test error:', error);
  }
}

testRealWorld();