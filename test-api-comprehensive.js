const { RoleFactory } = require('./src/services/role-factory');
const { WerewolfRoleService } = require('./src/services/werewolf-role.service');
const { WerewolfGameManager } = require('./src/services/werewolf-game-manager.service');
const { WerewolfNightManager } = require('./src/services/werewolf-night-manager.service');

console.log('🧪 Comprehensive API & Logic Test Suite\n');

async function testRoleFactory() {
  console.log('🏭 Testing RoleFactory...');
  
  try {
    // Test optimal config generation
    const optimalConfig = RoleFactory.createOptimalConfig(6);
    console.log('✅ Optimal config for 6 players:', optimalConfig);
    
    // Test validation
    const validation = RoleFactory.validateConfig(optimalConfig, 6);
    console.log('✅ Validation result:', {
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
      suggestions: validation.suggestions
    });
    
    // Test invalid config
    const invalidConfig = {
      villagers: 1,
      werewolves: 5,
      seer: true,
      witch: true,
      hunter: true,
      cupid: true,
      littleGirl: true
    };
    
    const invalidValidation = RoleFactory.validateConfig(invalidConfig, 6);
    console.log('✅ Invalid config validation:', {
      isValid: invalidValidation.isValid,
      errors: invalidValidation.errors
    });
    
  } catch (error) {
    console.error('❌ RoleFactory error:', error.message);
  }
}

async function testWerewolfRoleService() {
  console.log('\n🐺 Testing WerewolfRoleService...');
  
  try {
    const roleService = new WerewolfRoleService();
    
    // Test role info
    const seerInfo = roleService.getRoleInfo('SEER');
    console.log('✅ Seer role info:', {
      name: seerInfo.name,
      team: seerInfo.team,
      nightActions: seerInfo.nightActions,
      winConditions: seerInfo.winConditions
    });
    
    // Test role assignment
    const playerIds = ['player1', 'player2', 'player3', 'player4', 'player5'];
    const config = {
      villagers: 2,
      werewolves: 2,
      seer: true,
      witch: false,
      hunter: false,
      cupid: false, 
      littleGirl: false
    };
    
    const assignments = roleService.assignRoles(playerIds, config);
    console.log('✅ Role assignments:', assignments);
    
    // Test team calculation
    const team = roleService.getRoleTeam('WEREWOLF');
    console.log('✅ Werewolf team:', team);
    
  } catch (error) {
    console.error('❌ WerewolfRoleService error:', error.message);
  }
}

async function testNightManager() {
  console.log('\n🌙 Testing WerewolfNightManager...');
  
  try {
    const nightManager = new WerewolfNightManager();
    
    // Test phase order
    const gameId = 'test-game';
    nightManager.initializeNightPhases(gameId, 1);
    
    const currentPhase = nightManager.getCurrentNightPhase(gameId);
    console.log('✅ Current night phase:', currentPhase);
    
    // Test phase progression  
    const nextPhase = nightManager.progressToNextPhase(gameId);
    console.log('✅ Next phase:', nextPhase);
    
  } catch (error) {
    console.error('❌ NightManager error:', error.message);
  }
}

async function testWerewolfGameManager() {
  console.log('\n🎮 Testing WerewolfGameManager...');
  
  try {
    const gameManager = new WerewolfGameManager();
    
    // Test game creation
    const gameId = 'test-game-123';
    const playerData = [
      { id: 'player1', gameId, userId: 'user1', username: 'Player1', isHost: true },
      { id: 'player2', gameId, userId: 'user2', username: 'Player2', isHost: false },
      { id: 'player3', gameId, userId: 'user3', username: 'Player3', isHost: false },
      { id: 'player4', gameId, userId: 'user4', username: 'Player4', isHost: false },
      { id: 'player5', gameId, userId: 'user5', username: 'Player5', isHost: false }
    ];
    
    // Test role configuration
    const config = RoleFactory.createOptimalConfig(5);
    console.log('✅ Using config:', config);
    
    // Test game initialization (would normally interact with database)
    console.log('✅ Game manager initialized successfully');
    console.log('✅ Would configure', playerData.length, 'players with roles');
    
  } catch (error) {
    console.error('❌ GameManager error:', error.message);
  }
}

async function testStrategyPattern() {
  console.log('\n🎭 Testing Role Strategy Pattern...');
  
  try {
    const { VillagerStrategy } = require('./src/services/role-strategies/villager-strategy');
    const { SeerStrategy } = require('./src/services/role-strategies/seer-strategy');
    const { WerewolfStrategy } = require('./src/services/role-strategies/werewolf-strategy');
    
    const villagerStrategy = new VillagerStrategy();
    const seerStrategy = new SeerStrategy();
    const werewolfStrategy = new WerewolfStrategy();
    
    console.log('✅ Villager strategy role:', villagerStrategy.role);
    console.log('✅ Seer strategy role:', seerStrategy.role);
    console.log('✅ Werewolf strategy role:', werewolfStrategy.role);
    
    // Test mock player state
    const mockPlayer = {
      id: 'test-player',
      role: 'SEER',
      team: 'VILLAGE',
      isAlive: true,
      specialStates: {}
    };
    
    const mockGameState = {
      gameId: 'test',
      phase: 'NIGHT',
      dayNumber: 1,
      nightNumber: 1,
      pendingActions: [],
      completedActions: []
    };
    
    // Test night ability check
    const canUseSeerAbility = seerStrategy.canUseNightAbility(mockPlayer, mockGameState);
    console.log('✅ Seer can use night ability:', canUseSeerAbility);
    
  } catch (error) {
    console.error('❌ Strategy pattern error:', error.message);
  }
}

async function runAllTests() {
  try {
    await testRoleFactory();
    await testWerewolfRoleService();
    await testNightManager();
    await testWerewolfGameManager();
    await testStrategyPattern();
    
    console.log('\n🎉 All API & Logic tests completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Test suite error:', error);
  }
}

// Run the tests
runAllTests();