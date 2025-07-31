const io = require('socket.io-client');

class RoleSystemTester {
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

    // Role system event listeners
    socket.on('game:roleAssigned', (data) => {
      console.log(`🎭 ${name} received role:`, {
        role: data.role,
        team: data.team,
        abilities: data.abilities?.map(a => a.name) || []
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
            
            // Add more players
            this.addTestPlayers().then(() => {
              // Start game with roles
              setTimeout(() => {
                hostSocket.emit('game:start', {
                  gameId: this.gameId
                }, (startResponse) => {
                  console.log('🚀 Game start response:', startResponse);
                  resolve(startResponse);
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

  async addTestPlayers() {
    console.log('👥 Adding test players...');
    
    // Create 4 more players (total 5 for good role distribution)
    const playerNames = ['Player1', 'Player2', 'Player3', 'Player4'];
    
    for (const name of playerNames) {
      const socket = this.createSocket(name);
      
      await new Promise((resolve) => {
        socket.on('connect', () => {
          socket.emit('game:joinByCode', {
            code: 'TESTCODE' // In reality we'd use the actual game code
          }, (response) => {
            if (response.success) {
              console.log(`✅ ${name} joined game`);
            } else {
              // Try joining by ID instead
              socket.emit('game:join', {
                gameId: this.gameId
              }, (joinResponse) => {
                console.log(`${joinResponse.success ? '✅' : '❌'} ${name} join result:`, joinResponse.message);
              });
            }
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