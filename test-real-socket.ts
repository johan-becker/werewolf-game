import { io } from 'socket.io-client';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

async function testSocketWithRealAuth() {
  console.log('🔄 Testing Socket.IO with real authentication...');
  
  try {
    // Create a test user for Socket.IO testing
    const testEmail = `sockettest${Date.now()}@example.com`;
    const testPassword = 'testpass123';
    
    console.log('1️⃣ Creating test user...');
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: `sockettest${Date.now()}`,
          full_name: 'Socket Test User'
        }
      }
    });

    if (authError || !authData.session) {
      console.log('❌ Failed to create test user:', authError?.message);
      return;
    }

    console.log('✅ Test user created with token');
    
    // Test Socket.IO connection with real token
    const socket = io('http://localhost:3001', {
      auth: {
        token: authData.session.access_token
      },
      autoConnect: false
    });

    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log('✅ Socket connected with real auth:', socket.id);
        
        // Test connection test event
        socket.emit('connection:test', (response: any) => {
          console.log('✅ Connection test response:', response);
          
          // Test lobby join
          socket.emit('lobby:join');
          console.log('✅ Joined lobby');
          
          // Test lobby list
          socket.emit('lobby:list', (response: any) => {
            console.log('✅ Lobby list response:', response);
            
            // Test game creation
            socket.emit('game:create', {
              maxPlayers: 6,
              isPrivate: false
            }, (response: any) => {
              console.log('✅ Game creation response:', response);
              
              // Cleanup and disconnect
              setTimeout(() => {
                socket.disconnect();
                cleanup(authData.user!.id);
                resolve(true);
              }, 1000);
            });
          });
        });
      });

      socket.on('connect_error', (error: any) => {
        console.log('❌ Connection error:', error.message);
        socket.disconnect();
        cleanup(authData.user!.id);
        resolve(false);
      });

      socket.on('error', (error: any) => {
        console.log('⚠️  Socket error:', error);
      });

      socket.on('disconnect', (reason: string) => {
        console.log('🔌 Socket disconnected:', reason);
      });

      // Connect
      socket.connect();
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (socket.connected) {
          socket.disconnect();
        }
        cleanup(authData.user!.id);
        resolve(false);
      }, 10000);
    });

  } catch (error) {
    console.log('❌ Test failed:', error);
  }
}

async function cleanup(userId: string) {
  try {
    // Clean up test user
    await supabase.auth.admin.deleteUser(userId);
    console.log('🧹 Test user cleaned up');
  } catch (error) {
    console.log('⚠️  Cleanup error:', error);
  }
}

// Check if server is running first
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res: any) => {
  if (res.statusCode === 200 || res.statusCode === 404) {
    console.log('✅ Server is running on port 3001');
    testSocketWithRealAuth().then(() => {
      process.exit(0);
    });
  }
});

req.on('error', (err: any) => {
  console.log('❌ Server not running. Start the server first with: npm run dev');
  console.log('Error:', err.message);
  process.exit(1);
});

req.end();