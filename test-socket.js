const { io } = require('socket.io-client');

// Test Socket.IO connection
async function testSocketConnection() {
  console.log('🔄 Testing Socket.IO connection...');
  
  // Mock JWT token for testing
  const testToken = 'mock-jwt-token';
  
  const socket = io('http://localhost:3001', {
    auth: {
      token: testToken
    },
    autoConnect: false
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
    
    // Test connection test event
    socket.emit('connection:test', (response) => {
      console.log('✅ Connection test response:', response);
    });
  });

  socket.on('connect_error', (error) => {
    console.log('❌ Connection error:', error.message);
    // This is expected since we're using a mock token
    if (error.message.includes('Invalid or expired token')) {
      console.log('✅ Authentication middleware working correctly');
    }
    socket.disconnect();
  });

  socket.on('error', (error) => {
    console.log('⚠️  Socket error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('🔌 Socket disconnected:', reason);
  });

  // Connect and test
  socket.connect();
  
  // Give it time to connect/fail
  setTimeout(() => {
    if (!socket.connected) {
      console.log('🔄 Testing without authentication (should fail)...');
      socket.disconnect();
    }
  }, 2000);
}

// Test if server is running
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200 || res.statusCode === 404) {
    console.log('✅ Server is running on port 3001');
    testSocketConnection();
  }
});

req.on('error', (err) => {
  console.log('❌ Server not running. Start the server first with: npm run dev');
  console.log('Error:', err.message);
});

req.end();