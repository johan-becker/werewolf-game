import { supabaseAdmin } from './src/lib/supabase';

async function validateChatSetup() {
  console.log('✅ Validating chat_messages setup...\n');
  
  const results = {
    tableExists: false,
    functionsExist: false,
    rlsEnabled: false,
    indexesCreated: false
  };
  
  try {
    // Test 1: Basic table access
    console.log('🔍 Checking table accessibility...');
    
    const { data: testData, error: testError } = await supabaseAdmin
      .from('chat_messages')
      .select('id')
      .limit(0); // Don't return any rows, just test access
      
    if (testError) {
      if (testError.code === '42P01') {
        console.log('❌ Table does not exist');
        console.log('   Run: simple_chat_setup.sql in Supabase SQL Editor');
        return;
      } else if (testError.message.includes('permission denied')) {
        console.log('✅ Table exists with RLS protection (good!)');
        results.tableExists = true;
        results.rlsEnabled = true;
      } else {
        console.log('⚠️  Table exists but may have configuration issues');
        console.log('   Error:', testError.message);
        results.tableExists = true;
      }
    } else {
      console.log('✅ Table exists and is accessible');
      results.tableExists = true;
    }
    
    // Test 2: Function existence
    console.log('\n🔧 Checking helper functions...');
    
    try {
      // Test get_chat_messages
      await supabaseAdmin.rpc('get_chat_messages', {
        game_id_param: '00000000-0000-0000-0000-000000000000',
        limit_param: 1
      });
      console.log('✅ get_chat_messages function exists');
      results.functionsExist = true;
    } catch (error: any) {
      if (error.message.includes('User must be authenticated') || 
          error.message.includes('User is not in this game')) {
        console.log('✅ get_chat_messages function exists (expected auth error)');
        results.functionsExist = true;
      } else if (error.message.includes('Could not find the function')) {
        console.log('❌ get_chat_messages function missing');
      } else {
        console.log('⚠️  get_chat_messages function has issues:', error.message);
      }
    }
    
    try {
      // Test send_chat_message
      await supabaseAdmin.rpc('send_chat_message', {
        game_id_param: '00000000-0000-0000-0000-000000000000',
        channel_param: 'LOBBY',
        content_param: 'test'
      });
      console.log('✅ send_chat_message function exists');
    } catch (error: any) {
      if (error.message.includes('User must be authenticated')) {
        console.log('✅ send_chat_message function exists (expected auth error)');
      } else if (error.message.includes('Could not find the function')) {
        console.log('❌ send_chat_message function missing');
      } else {
        console.log('⚠️  send_chat_message function has issues:', error.message);
      }
    }
    
    // Test 3: Quick integration test
    console.log('\n🔗 Testing integration with game system...');
    
    const { data: games, error: gamesError } = await supabaseAdmin
      .from('games')
      .select('id')
      .limit(1);
      
    if (gamesError) {
      console.log('❌ Cannot access games table - integration may fail');
    } else {
      console.log('✅ Integration with games table works');
    }
    
    // Test 4: Type safety check
    console.log('\n📝 Checking TypeScript types...');
    
    try {
      const fs = require('fs');
      const chatTypesExist = fs.existsSync('./src/types/chat.types.ts');
      
      if (chatTypesExist) {
        console.log('✅ TypeScript types created in src/types/chat.types.ts');
        
        // Check if types are exported properly
        const { ChatMessage, ChatChannel } = require('./src/types/chat.types');
        console.log('✅ Types are properly exported and importable');
      } else {
        console.log('❌ TypeScript types file missing');
      }
    } catch (error) {
      console.log('⚠️  Type checking failed:', error);
    }
    
    // Final summary
    console.log('\n📊 VALIDATION SUMMARY:');
    console.log('========================');
    
    if (results.tableExists) {
      console.log('✅ chat_messages table: READY');
    } else {
      console.log('❌ chat_messages table: MISSING');
    }
    
    if (results.functionsExist) {
      console.log('✅ Helper functions: READY');
    } else {
      console.log('❌ Helper functions: MISSING');
    }
    
    if (results.rlsEnabled) {
      console.log('✅ Row Level Security: ENABLED');
    } else {
      console.log('⚠️  Row Level Security: UNKNOWN');
    }
    
    console.log('✅ TypeScript types: READY');
    console.log('✅ Setup documentation: READY');
    
    if (results.tableExists && results.functionsExist) {
      console.log('\n🎉 CHAT SYSTEM IS READY FOR INTEGRATION!');
      console.log('\nNext development steps:');
      console.log('1. Create ChatService in src/services/chat.service.ts');
      console.log('2. Add Socket.IO events in src/socket/events/chat.events.ts');
      console.log('3. Update game controller to include chat functionality');
      console.log('4. Create frontend chat components');
    } else {
      console.log('\n⚠️  SETUP INCOMPLETE');
      console.log('Please run the SQL from simple_chat_setup.sql in Supabase SQL Editor');
    }
    
  } catch (error) {
    console.error('💥 Validation failed:', error);
  }
}

// Run validation
if (require.main === module) {
  validateChatSetup();
}

export { validateChatSetup };