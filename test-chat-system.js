const io = require('socket.io-client');

class ChatSystemTester {
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
        console.log('❌ Authentication failed');
        return false;
      }
    } catch (error) {
      console.error('❌ Auth error:', error.message);
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

    // Chat event listeners
    socket.on('chat:message', (message) => {
      console.log(`💬 ${name} received message:`, {
        from: message.username,
        channel: message.channel,
        content: message.content,
        type: message.type
      });
    });

    socket.on('chat:typing', (data) => {
      console.log(`⌨️ ${name} sees typing:`, {
        user: data.username,
        channel: data.channel,
        isTyping: data.isTyping
      });
    });

    socket.on('chat:messageEdited', (data) => {
      console.log(`✏️ ${name} sees edit:`, data);
    });

    socket.on('chat:messageDeleted', (data) => {
      console.log(`🗑️ ${name} sees deletion:`, data);
    });

    this.sockets.push({ name, socket });
    return socket;
  }

  async testLobbyChat() {
    console.log('\n💬 Testing Lobby Chat...');
    
    const socket = this.createSocket('LobbyChatTester');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log('🔄 Sending lobby chat message...');
        
        socket.emit('chat:send', {
          content: 'Hello lobby! 👋',
          channel: 'LOBBY'
        }, (response) => {
          console.log('📋 Lobby chat response:', response);
          
          // Test typing indicator
          setTimeout(() => {
            console.log('⌨️ Testing typing indicator...');
            socket.emit('chat:typing:start', { channel: 'LOBBY' });
            
            setTimeout(() => {
              socket.emit('chat:typing:stop', { channel: 'LOBBY' });
              resolve(response);
            }, 2000);
          }, 1000);
        });
      });
    });
  }

  async testChatHistory() {
    console.log('\n📜 Testing Chat History...');
    
    const socket = this.createSocket('HistoryTester');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log('🔄 Requesting chat history...');
        
        socket.emit('chat:history', {
          channel: 'LOBBY',
          limit: 10
        }, (response) => {
          console.log('📜 Chat history response:', {
            success: response.success,
            messageCount: response.messages?.length || 0,
            hasMore: response.hasMore,
            firstMessage: response.messages?.[0]?.content
          });
          resolve(response);
        });
      });
    });
  }

  async testMentions() {
    console.log('\n📨 Testing Mentions...');
    
    const socket = this.createSocket('MentionTester');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log('🔄 Sending message with mentions...');
        
        socket.emit('chat:send', {
          content: 'Hey @testuser and @admin, this is a mention test!',
          channel: 'LOBBY'
        }, (response) => {
          console.log('📨 Mention test response:', response);
          if (response.success && response.message) {
            console.log('📨 Extracted mentions:', response.message.mentions);
          }
          resolve(response);
        });
      });
    });
  }

  async testSpamProtection() {
    console.log('\n🛡️ Testing Spam Protection...');
    
    const socket = this.createSocket('SpamTester');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log('🔄 Sending multiple messages rapidly...');
        
        let responses = [];
        let completed = 0;
        const totalMessages = 8; // Should trigger spam protection
        
        for (let i = 0; i < totalMessages; i++) {
          socket.emit('chat:send', {
            content: `Spam message ${i + 1}`,
            channel: 'LOBBY'
          }, (response) => {
            responses.push({
              message: i + 1,
              success: response.success,
              error: response.error
            });
            
            completed++;
            if (completed === totalMessages) {
              console.log('🛡️ Spam protection results:');
              responses.forEach(r => {
                console.log(`   Message ${r.message}: ${r.success ? '✅' : '❌'} ${r.error || ''}`);
              });
              resolve(responses);
            }
          });
        }
      });
    });
  }

  async testGameChat() {
    console.log('\n🎮 Testing Game Chat...');
    
    // First create a game
    const creatorSocket = this.createSocket('GameChatCreator');
    
    return new Promise((resolve) => {
      creatorSocket.on('connect', () => {
        // Create a game first
        creatorSocket.emit('game:create', {
          maxPlayers: 4,
          isPrivate: false
        }, (createResponse) => {
          if (createResponse.success) {
            this.gameId = createResponse.game.id;
            console.log(`✅ Game created: ${this.gameId}`);
            
            // Try to send a game chat message
            creatorSocket.emit('chat:send', {
              content: 'Hello game chat! 🎮',
              channel: 'DAY',
              gameId: this.gameId
            }, (chatResponse) => {
              console.log('🎮 Game chat response:', chatResponse);
              resolve(chatResponse);
            });
          } else {
            console.log('❌ Failed to create game:', createResponse.error);
            resolve(createResponse);
          }
        });
      });
    });
  }

  async testWordFilter() {
    console.log('\n🚫 Testing Word Filter...');
    
    const socket = this.createSocket('FilterTester');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        console.log('🔄 Sending message with filtered words...');
        
        socket.emit('chat:send', {
          content: 'This contains spam and hack words!',
          channel: 'LOBBY'
        }, (response) => {
          console.log('🚫 Word filter response:', response);
          if (response.success && response.message) {
            console.log('🚫 Filtered content:', response.message.content);
          }
          resolve(response);
        });
      });
    });
  }

  async testMessageEdit() {
    console.log('\n✏️ Testing Message Edit...');
    
    const socket = this.createSocket('EditTester');
    
    return new Promise((resolve) => {
      socket.on('connect', () => {
        // First send a message
        socket.emit('chat:send', {
          content: 'Original message',
          channel: 'LOBBY'
        }, (sendResponse) => {
          if (sendResponse.success && sendResponse.message) {
            const messageId = sendResponse.message.id;
            console.log(`📝 Message sent: ${messageId}`);
            
            // Wait a bit, then edit it
            setTimeout(() => {
              socket.emit('chat:edit', {
                messageId: messageId,
                content: 'Edited message! ✏️'
              }, (editResponse) => {
                console.log('✏️ Edit response:', editResponse);
                resolve(editResponse);
              });
            }, 1000);
          } else {
            resolve(sendResponse);
          }
        });
      });
    });
  }

  async runAllTests() {
    console.log('🚀 Starting Chat System Tests\n');

    try {
      // Authenticate first
      const authSuccess = await this.authenticate();
      if (!authSuccess) {
        console.log('❌ Authentication failed, cannot proceed with tests');
        return;
      }

      // Test sequence
      await this.sleep(1000);
      await this.testLobbyChat();
      
      await this.sleep(1000);
      await this.testChatHistory();
      
      await this.sleep(1000);
      await this.testMentions();
      
      await this.sleep(1000);
      await this.testWordFilter();
      
      await this.sleep(1000);
      await this.testMessageEdit();
      
      await this.sleep(1000);
      await this.testGameChat();
      
      await this.sleep(2000);
      await this.testSpamProtection();

      console.log('\n✅ All chat system tests completed!');

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
const tester = new ChatSystemTester();
tester.runAllTests().catch(console.error);