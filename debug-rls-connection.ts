import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

console.log('🔍 Debugging RLS Connection Keys...\n');

console.log('Supabase URL:', supabaseUrl);
console.log('Service Key (first 20 chars):', supabaseServiceKey.substring(0, 20) + '...');
console.log('Anon Key (first 20 chars):', supabaseAnonKey.substring(0, 20) + '...');

// Create both clients
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

async function debugConnections() {
  try {
    // Test 1: Create test data with admin
    console.log('\n1️⃣ Creating test data with ADMIN client...');
    const { data: testUser } = await supabaseAdmin.auth.admin.createUser({
      email: 'debug@example.com',
      password: 'TestPassword123!',
      email_confirm: true
    });
    const userId = testUser?.user?.id;

    const { data: testGame } = await supabaseAdmin
      .from('games')
      .insert({
        name: 'Debug Game',
        creator_id: userId,
        max_players: 6
      })
      .select()
      .single();
    const gameId = testGame?.id;

    console.log('✅ Test data created');

    // Test 2: Anonymous client WITHOUT auth
    console.log('\n2️⃣ Testing ANONYMOUS client (should respect RLS)...');
    
    const { data: anonRead, error: anonReadError } = await supabaseAnon
      .from('games')
      .select('*')
      .eq('id', gameId);

    console.log('Anonymous READ:', anonReadError ? `❌ ${anonReadError.message}` : `✅ Success (${anonRead?.length} records)`);

    const { error: anonUpdateError } = await supabaseAnon
      .from('games')
      .update({ name: 'Hacked!' })
      .eq('id', gameId);

    console.log('Anonymous UPDATE:', anonUpdateError ? `✅ Blocked: ${anonUpdateError.message}` : '❌ ALLOWED - BUG!');

    // Test 3: Admin client (bypasses RLS)
    console.log('\n3️⃣ Testing ADMIN client (bypasses RLS)...');
    
    const { data: adminRead, error: adminReadError } = await supabaseAdmin
      .from('games')
      .select('*')
      .eq('id', gameId);

    console.log('Admin READ:', adminReadError ? `❌ ${adminReadError.message}` : `✅ Success (${adminRead?.length} records)`);

    const { error: adminUpdateError } = await supabaseAdmin
      .from('games')
      .update({ name: 'Admin Updated' })
      .eq('id', gameId);

    console.log('Admin UPDATE:', adminUpdateError ? `❌ ${adminUpdateError.message}` : '✅ Success (bypasses RLS)');

    // Test 4: Check auth context
    console.log('\n4️⃣ Checking auth context...');
    
    // Try to get current user with anon client
    const { data: anonUser } = await supabaseAnon.auth.getUser();
    console.log('Anonymous client user:', anonUser?.user ? `Authenticated: ${anonUser.user.id}` : 'Not authenticated');

    const { data: adminUser } = await supabaseAdmin.auth.getUser();  
    console.log('Admin client user:', adminUser?.user ? `Authenticated: ${adminUser.user.id}` : 'Not authenticated');

    // Clean up
    console.log('\n🧹 Cleaning up...');
    await supabaseAdmin.from('games').delete().eq('id', gameId);
    await supabaseAdmin.auth.admin.deleteUser(userId!);
    console.log('✅ Cleanup complete');

    // Diagnosis
    console.log('\n🩺 DIAGNOSIS:');
    console.log('If anonymous UPDATE is ALLOWED, then either:');
    console.log('1. The anonymous client is somehow authenticated');
    console.log('2. There\'s a bug in our test setup');
    console.log('3. RLS policies are not being applied correctly');

  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

debugConnections();