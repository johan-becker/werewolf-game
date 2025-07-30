import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function simpleTest() {
  console.log('🔄 Simple Supabase test...\n');

  try {
    // Test 1: Connection and basic query
    console.log('1️⃣ Testing basic connection...');
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('*')
      .limit(1);
    
    if (gamesError) {
      console.log('❌ Games query error:', gamesError.message);
    } else {
      console.log('✅ Connection working, games table accessible');
    }

    // Test 2: Test the auth context function we created
    console.log('\n2️⃣ Testing auth context function...');
    const { data: authContext, error: contextError } = await supabase
      .rpc('test_auth_context');
    
    if (contextError) {
      console.log('❌ Auth context error:', contextError.message);
    } else {
      console.log('✅ Auth context:', authContext);
    }

    // Test 3: Test join_game_by_code function with invalid code
    console.log('\n3️⃣ Testing join_game_by_code function...');
    const { data: joinResult, error: joinError } = await supabase
      .rpc('join_game_by_code', { code_param: 'INVALID' });
    
    if (joinError) {
      console.log('✅ Function working - Expected error:', joinError.message);
    } else {
      console.log('❌ Function should have failed with invalid code');
    }

    console.log('\n🎉 Simple tests completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run tests
simpleTest();