const io = require('socket.io-client');

class SocketTester {
  constructor() {
    this.sockets = [];
    this.authToken = '';
    this.gameId = '';
  }

  async authenticate() {
    console.log('🔐 Authenticating user...');
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.authToken = data.session.access_token;
        console.log('✅ Authentication successful');
        return true;
      } else {
        console.log('❌ Authentication failed, trying signup...');
        return await this.signup();
      }
    } catch (error) {
      console.error('❌ Auth error:', error.message);
      return false;
    }
  }

  async signup() {
    try {
      const response = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          full_name: 'Test User'
        })
      });

      if (response.ok) {
        const data = await response.json();
        this.authToken = data.session.access_token;
        console.log('✅ Signup successful');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Signup error:', error.message);
      return false;
    }
  }

  createSocket(name) {
    console.log(`🔌 Creating socket connection for ${name}...`);
    
    const socket = io('http://localhost:3000', {
      auth: {
        token: this.authToken
      },
      transports: ['websocket']
    });

    socket.on('connect', () => {
      console.log(`✅ ${name} connected (${socket.id})`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ ${name} disconnected`);
    });

    socket.on('error', (error) => {
      console.log(`❌ ${name} error:`, error);
    });

    // Auth errors
    socket.on('connect_error', (error) => {
      console.log(`❌ ${name} connection error:`, error.message);
    });

    this.sockets.push({ name, socket });
    return socket;
  }

  async testLobbyList() {
    console.log('\n📋 Testing lobby:list event...');
    
    const socket = this.createSocket('LobbyTester');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log('🔄 Requesting game list...');
        
        socket.emit('lobby:list', (response) => {
          console.log('📋 Lobby list response:', JSON.stringify(response, null, 2));
          resolve(response);
        });
      });
    });
  }

  async testGameCreate() {
    console.log('\n🎮 Testing game:create event...');
    
    const socket = this.createSocket('GameCreator');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log('🔄 Creating new game...');
        
        socket.emit('game:create', {
          maxPlayers: 6,
          isPrivate: false
        }, (response) => {
          console.log('🎮 Game create response:', JSON.stringify(response, null, 2));
          
          if (response.success) {
            this.gameId = response.game.id;
            console.log(`✅ Game created with ID: ${this.gameId}`);
          }
          
          resolve(response);
        });
      });
    });
  }

  async testGameJoin() {
    console.log('\n👥 Testing game:join event...');
    
    if (!this.gameId) {
      console.log('❌ No game ID available, creating game first...');
      await this.testGameCreate();
    }

    const socket = this.createSocket('GameJoiner');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log(`🔄 Joining game ${this.gameId}...`);
        
        socket.emit('game:join', {
          gameId: this.gameId
        }, (response) => {
          console.log('👥 Game join response:', JSON.stringify(response, null, 2));
          resolve(response);
        });
      });

      // Listen for lobby updates
      socket.on('lobby:gameUpdated', (data) => {
        console.log('📢 Lobby update received:', data);
      });

      // Listen for game events
      socket.on('game:playerJoined', (data) => {
        console.log('📢 Player joined:', data);
      });
    });
  }

  async testGameLeave() {
    console.log('\n🚪 Testing game:leave event...');
    
    if (!this.gameId) {
      console.log('❌ No game ID available');
      return { success: false, error: 'No game to leave' };
    }

    const socket = this.createSocket('GameLeaver');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log(`🔄 Leaving game ${this.gameId}...`);
        
        socket.emit('game:leave', {
          gameId: this.gameId
        }, (response) => {
          console.log('🚪 Game leave response:', JSON.stringify(response, null, 2));
          resolve(response);
        });
      });

      // Listen for events
      socket.on('game:playerLeft', (data) => {
        console.log('📢 Player left:', data);
      });

      socket.on('lobby:gameUpdated', (data) => {
        console.log('📢 Lobby update after leave:', data);
      });
    });
  }

  async testLobbyJoin() {
    console.log('\n🏛️ Testing lobby:join event...');
    
    const socket = this.createSocket('LobbyJoiner');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log('🔄 Joining lobby...');
        
        socket.emit('lobby:join');
        
        // Listen for lobby events
        socket.on('lobby:gameList', (data) => {
          console.log('📋 Initial game list:', data);
          resolve({ success: true, data });
        });

        socket.on('lobby:gameCreated', (data) => {
          console.log('📢 New game created:', data);
        });

        socket.on('lobby:gameUpdated', (data) => {
          console.log('📢 Game updated:', data);
        });

        // Resolve after a short delay if no immediate response
        setTimeout(() => {
          resolve({ success: true, message: 'Lobby joined successfully' });
        }, 1000);
      });
    });
  }

  async testGameMessage() {
    console.log('\n💬 Testing game:message event...');
    
    if (!this.gameId) {
      console.log('❌ No game ID available');
      return { success: false, error: 'No game to send message to' };
    }

    const socket = this.createSocket('MessageSender');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        // First join the game, then send message
        socket.emit('game:join', {
          gameId: this.gameId
        }, (joinResponse) => {
          if (joinResponse.success) {
            console.log('🔄 Sending game message...');
            
            socket.emit('game:message', {
              message: 'Hello from socket test!',
              channel: 'general'
            });

            setTimeout(() => {
              resolve({ success: true, message: 'Message sent' });
            }, 500);
          } else {
            resolve(joinResponse);
          }
        });
      });

      // Listen for messages
      socket.on('game:message', (data) => {
        console.log('💬 Message received:', data);
      });
    });
  }

  async runAllTests() {
    console.log('🚀 Starting Socket Event Tests\n');

    try {
      // Authenticate first
      const authSuccess = await this.authenticate();
      if (!authSuccess) {
        console.log('❌ Authentication failed, cannot proceed with tests');
        return;
      }

      // Test sequence
      await this.sleep(1000);
      await this.testLobbyJoin();
      
      await this.sleep(1000);
      await this.testLobbyList();
      
      await this.sleep(1000);
      await this.testGameCreate();
      
      await this.sleep(1000);
      await this.testGameJoin();
      
      await this.sleep(1000);
      await this.testGameMessage();
      
      await this.sleep(1000);
      await this.testGameLeave();

      console.log('\n✅ All tests completed!');

    } catch (error) {
      console.error('❌ Test error:', error);
    } finally {
      await this.cleanup();
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up connections...');
    
    this.sockets.forEach(({ name, socket }) => {
      console.log(`Disconnecting ${name}...`);
      socket.disconnect();
    });

    this.sockets = [];
    console.log('✅ Cleanup complete');
  }
}

// Run tests
const tester = new SocketTester();
tester.runAllTests().catch(console.error);