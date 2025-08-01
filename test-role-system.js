const io = require('socket.io-client');

class RoleSystemTester {
  constructor() {
    this.sockets = [];
    this.authTokens = [];
    this.gameId = '';
  }

  async authenticate() {
    console.log('🔐 Authenticating user...');
    
    try {
      // First try to create a test user
      const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: `testuser${Date.now()}@example.com`,
          password: 'password123',
          username: `testuser${Date.now()}`
        })
      });

      let authData;
      if (signupResponse.ok) {
        authData = await signupResponse.json();
        console.log('✅ Test user created and signed in');
      } else {
        // If signup fails, try signin with existing user
        const signinResponse = await fetch('http://localhost:3000/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        });

        if (signinResponse.ok) {
          authData = await signinResponse.json();
          console.log('✅ Signed in with existing user');
        } else {
          console.log('❌ Both signup and signin failed');
          return false;
        }
      }

      const token = authData.session?.access_token || authData.access_token;
      const userId = authData.user?.id;
      
      if (!token) {
        console.log('❌ No access token received');
        return false;
      }
      
      this.authTokens.push({ token, userId });
      this.authToken = token; // Keep primary token for host
      
      console.log('✅ Authentication successful');
      return true;
    } catch (error) {
      console.error('❌ Auth error:', error.message);
      return false;
    }
  }

  createSocket(name, tokenIndex = 0) {
    console.log(`🔌 Creating socket connection for ${name}...`);
    
    const token = this.authTokens[tokenIndex]?.token || this.authToken;
    
    const socket = io('http://localhost:3000', {
      auth: {
        token: token
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

    // Role system event listeners
    socket.on('game:roleAssigned', (data) => {
      console.log(`🎭 ${name} received role:`, {
        role: data.role,
        team: data.team,
        abilities: data.abilities || []
      });
    });

    socket.on('game:rolesConfigured', (data) => {
      console.log(`⚙️ ${name} sees role configuration:`, {
        config: data.config,
        configuredBy: data.configuredBy
      });
    });

    socket.on('game:phaseChanged', (data) => {
      console.log(`🌙 ${name} sees phase change:`, {
        phase: data.phase,
        dayNumber: data.dayNumber
      });
    });

    socket.on('game:playerEliminated', (data) => {
      console.log(`💀 ${name} sees elimination:`, {
        playerId: data.playerId,
        playerName: data.playerName,
        role: data.role
      });
    });

    socket.on('game:nightResolved', (data) => {
      console.log(`🌅 ${name} sees night resolved:`, {
        deaths: data.deaths,
        phase: data.phase
      });
    });

    socket.on('game:investigationResult', (data) => {
      console.log(`🔍 ${name} investigation result:`, {
        target: data.target,
        result: data.result
      });
    });

    socket.on('game:ended', (data) => {
      console.log(`🏆 ${name} sees game end:`, {
        winner: data.winner,
        endedBy: data.endedBy
      });
    });

    this.sockets.push({ name, socket });
    return socket;
  }

  async testGameCreationAndStart() {
    console.log('\\n🎮 Testing Game Creation and Role Assignment...');
    
    const hostSocket = this.createSocket('Host');
    
    return new Promise((resolve) => {
      hostSocket.on('connect', () => {
        // Create game
        hostSocket.emit('game:create', {
          maxPlayers: 6,
          isPrivate: false
        }, (createResponse) => {
          if (createResponse.success) {
            this.gameId = createResponse.game.id;
            console.log(`✅ Game created: ${this.gameId}`);
            
            // Create multiple users first, then add them to game
            this.createMultipleUsers().then(() => {
              return this.addTestPlayers();
            }).then(() => {
              // Test role configuration first
              setTimeout(() => {
                console.log('⚙️ Testing role configuration...');
                hostSocket.emit('game:getOptimalRoleConfig', {
                  gameId: this.gameId
                }, (configResponse) => {
                  console.log('✅ Optimal config:', configResponse);
                  
                  if (configResponse.success) {
                    // Configure roles
                    hostSocket.emit('game:configureRoles', {
                      gameId: this.gameId,
                      config: configResponse.config
                    }, (roleConfigResponse) => {
                      console.log('⚙️ Role configuration result:', roleConfigResponse);
                      
                      // Start game with roles
                      setTimeout(() => {
                        hostSocket.emit('game:start', {
                          gameId: this.gameId
                        }, (startResponse) => {
                          console.log('🚀 Game start response:', startResponse);
                          resolve(startResponse);
                        });
                      }, 1000);
                    });
                  } else {
                    // Start without role config
                    hostSocket.emit('game:start', {
                      gameId: this.gameId
                    }, (startResponse) => {
                      console.log('🚀 Game start response:', startResponse);
                      resolve(startResponse);
                    });
                  }
                });
              }, 2000);
            });
          } else {
            console.log('❌ Failed to create game:', createResponse.error);
            resolve(createResponse);
          }
        });
      });
    });
  }

  async createMultipleUsers() {
    console.log('👥 Creating multiple test users...');
    
    const playerNames = ['Player1', 'Player2', 'Player3', 'Player4'];
    
    for (const name of playerNames) {
      try {
        const signupResponse = await fetch('http://localhost:3000/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: `${name.toLowerCase()}${Date.now()}@example.com`,
            password: 'password123',
            username: `${name}${Date.now()}`
          })
        });

        if (signupResponse.ok) {
          const authData = await signupResponse.json();
          const token = authData.session?.access_token || authData.access_token;
          const userId = authData.user?.id;
          
          this.authTokens.push({ token, userId, name });
          console.log(`✅ Created user ${name}`);
        } else {
          console.log(`❌ Failed to create user ${name}`);
        }
      } catch (error) {
        console.log(`❌ Error creating user ${name}:`, error.message);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  async addTestPlayers() {
    console.log('👥 Adding test players to game...');
    
    // Skip first token (host)
    for (let i = 1; i < this.authTokens.length; i++) {
      const tokenData = this.authTokens[i];
      const socket = this.createSocket(tokenData.name, i);
      
      await new Promise((resolve) => {
        socket.on('connect', () => {
          // Try joining by ID directly since we have gameId
          socket.emit('game:join', {
            gameId: this.gameId
          }, (joinResponse) => {
            console.log(`${joinResponse.success ? '✅' : '❌'} ${tokenData.name} join result:`, joinResponse.success ? 'Joined successfully' : joinResponse.error);
            resolve();
          });
        });
      });
      
      // Small delay between joins
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  async testNightActions() {
    console.log('\\n🌙 Testing Night Actions...');
    
    // Wait for roles to be assigned
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const testActions = [
      {
        name: 'Werewolf Kill',
        actionType: 'WEREWOLF_KILL',
        targetId: 'target-player-id'
      },
      {
        name: 'Seer Investigation',
        actionType: 'SEER_INVESTIGATE', 
        targetId: 'target-player-id'
      },
      {
        name: 'Witch Heal',
        actionType: 'WITCH_HEAL',
        targetId: 'target-player-id'
      },
      {
        name: 'Cupid Link',
        actionType: 'CUPID_LINK',
        targetId: 'target1-id',
        secondTargetId: 'target2-id'
      }
    ];

    for (const action of testActions) {
      const socket = this.sockets[0].socket; // Use first socket for testing
      
      console.log(`🎯 Testing ${action.name}...`);
      
      socket.emit('game:nightAction', action, (response) => {
        console.log(`${response.success ? '✅' : '❌'} ${action.name}:`, response.message);
        if (response.revealedInfo) {
          console.log('🔍 Revealed info:', response.revealedInfo);
        }
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async testRoleQueries() {
    console.log('\\n🎭 Testing Role Queries...');
    
    for (const { name, socket } of this.sockets.slice(0, 3)) {
      console.log(`🔍 Checking role for ${name}...`);
      
      // Get role
      socket.emit('game:getRole', (response) => {
        console.log(`${response.success ? '✅' : '❌'} ${name} role:`, response.role || response.error);
      });
      
      // Get available actions
      socket.emit('game:getAvailableActions', (response) => {
        console.log(`${response.success ? '✅' : '❌'} ${name} actions:`, response.actions || response.error);
      });
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  async testPhaseTransitions() {
    console.log('\\n🔄 Testing Phase Transitions...');
    
    const hostSocket = this.sockets[0].socket;
    
    // Test night resolution
    console.log('🌅 Resolving night phase...');
    hostSocket.emit('game:resolveNight', (response) => {
      console.log('🌅 Night resolution result:', {
        success: response.success,
        message: response.message,
        deaths: response.deaths,
        gameEnded: response.gameEnded,
        winner: response.winner
      });
    });
  }

  async testWinConditions() {
    console.log('\\n🏆 Testing Win Conditions...');
    
    // This would require manipulating game state to trigger different win scenarios
    // For now, just log that we would test this
    console.log('🏆 Win condition testing would require game state manipulation');
    console.log('   - All werewolves eliminated (Village wins)');  
    console.log('   - Werewolves >= Villagers (Werewolves win)');
    console.log('   - Only lovers survive (Lovers win)');
  }

  async runAllTests() {
    console.log('🚀 Starting Role System Tests\\n');

    try {
      // Authenticate first
      const authSuccess = await this.authenticate();
      if (!authSuccess) {
        console.log('❌ Authentication failed, cannot proceed with tests');
        return;
      }

      // Test sequence
      await this.sleep(1000);
      await this.testGameCreationAndStart();
      
      await this.sleep(2000);
      await this.testRoleQueries();
      
      await this.sleep(1000);
      await this.testNightActions();
      
      await this.sleep(2000); 
      await this.testPhaseTransitions();
      
      await this.sleep(1000);
      await this.testWinConditions();

      console.log('\\n✅ All role system tests completed!');

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
    console.log('\\n🧹 Cleaning up connections...');
    
    this.sockets.forEach(({ name, socket }) => {
      console.log(`Disconnecting ${name}...`);
      socket.disconnect();
    });

    this.sockets = [];
    console.log('✅ Cleanup complete');
  }
}

// Run tests
const tester = new RoleSystemTester();
tester.runAllTests().catch(console.error);