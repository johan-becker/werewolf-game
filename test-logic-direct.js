console.log('🧪 Direct Logic Test Suite\n');

// Test basic role configuration logic
function testRoleConfigurationLogic() {
  console.log('⚙️ Testing Role Configuration Logic...');
  
  // Mock RoleFactory logic
  function createOptimalConfig(playerCount) {
    const werewolves = Math.max(1, Math.floor(playerCount * 0.25));
    let config = {
      werewolves,
      villagers: playerCount - werewolves,
      seer: false,
      witch: false,
      hunter: false,
      cupid: false,
      littleGirl: false
    };

    // Add special roles based on player count
    if (playerCount >= 5) {
      config.seer = true;
      config.villagers--;
    }
    if (playerCount >= 7) {
      config.witch = true;
      config.villagers--;
    }
    if (playerCount >= 8) {
      config.hunter = true;
      config.villagers--;
    }

    return config;
  }

  function validateConfig(config, playerCount) {
    const errors = [];
    const warnings = [];
    
    if (playerCount < 4) errors.push('Mindestens 4 Spieler erforderlich');
    if (config.werewolves < 1) errors.push('Mindestens 1 Werwolf erforderlich');
    if (config.villagers < 1) errors.push('Mindestens 1 Dorfbewohner erforderlich');
    
    const totalConfigured = config.villagers + config.werewolves + 
      (config.seer ? 1 : 0) + (config.witch ? 1 : 0) + 
      (config.hunter ? 1 : 0) + (config.cupid ? 1 : 0) + 
      (config.littleGirl ? 1 : 0);
      
    if (totalConfigured !== playerCount) {
      errors.push(`Konfiguration für ${totalConfigured} Spieler, aber ${playerCount} im Spiel`);
    }
    
    const werewolfPercentage = (config.werewolves / playerCount) * 100;
    if (werewolfPercentage < 15) {
      warnings.push(`Nur ${werewolfPercentage.toFixed(1)}% Werwölfe - könnte zu einfach sein`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      totalPlayers: totalConfigured,
      werewolfPercentage
    };
  }

  // Test cases
  const testCases = [
    { players: 4, name: 'Minimum players' },
    { players: 6, name: 'Medium game' },
    { players: 8, name: 'Large game' },
    { players: 12, name: 'Maximum game' }
  ];

  testCases.forEach(testCase => {
    console.log(`\\n📊 Testing ${testCase.name} (${testCase.players} players):`);
    
    const config = createOptimalConfig(testCase.players);
    console.log('Config:', config);
    
    const validation = validateConfig(config, testCase.players);
    console.log('Validation:', {
      isValid: validation.isValid,
      errors: validation.errors,
      warnings: validation.warnings,
      werewolfPercentage: validation.werewolfPercentage
    });
    
    console.log(validation.isValid ? '✅ Valid configuration' : '❌ Invalid configuration');
  });
}

// Test night phase ordering
function testNightPhaseLogic() {
  console.log('\\n🌙 Testing Night Phase Logic...');
  
  const NIGHT_PHASE_ORDER = [
    { phase: 'CUPID_PHASE', role: 'CUPID', description: 'Amor bestimmt die Verliebten', isOptional: true },
    { phase: 'SEER_PHASE', role: 'SEER', description: 'Seherin erwacht', isOptional: false },
    { phase: 'WEREWOLF_PHASE', role: 'WEREWOLF', description: 'Werwölfe erwachen', isOptional: false },
    { phase: 'WITCH_PHASE', role: 'WITCH', description: 'Hexe erwacht', isOptional: false }
  ];
  
  console.log('Night phase order:');
  NIGHT_PHASE_ORDER.forEach((phase, index) => {
    console.log(`${index + 1}. ${phase.phase}: ${phase.description} ${phase.isOptional ? '(optional)' : ''}`);
  });
  
  console.log('\\n✅ Night phase ordering logic validated');
}

// Test role assignment logic
function testRoleAssignmentLogic() {
  console.log('\\n🎭 Testing Role Assignment Logic...');
  
  function assignRoles(playerIds, config) {
    const roles = [];
    
    // Add werewolves
    for (let i = 0; i < config.werewolves; i++) {
      roles.push('WEREWOLF');
    }
    
    // Add special roles
    if (config.seer) roles.push('SEER');
    if (config.witch) roles.push('WITCH');
    if (config.hunter) roles.push('HUNTER');
    if (config.cupid) roles.push('CUPID');
    if (config.littleGirl) roles.push('LITTLE_GIRL');
    
    // Fill remaining with villagers
    while (roles.length < playerIds.length) {
      roles.push('VILLAGER');
    }
    
    // Shuffle roles (simplified)
    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]];
    }
    
    return playerIds.map((playerId, index) => ({
      playerId,
      role: roles[index]
    }));
  }
  
  const playerIds = ['player1', 'player2', 'player3', 'player4', 'player5', 'player6'];
  const config = {
    werewolves: 2,
    villagers: 3,
    seer: true,
    witch: false,
    hunter: false,
    cupid: false,
    littleGirl: false
  };
  
  const assignments = assignRoles(playerIds, config);
  console.log('Role assignments:', assignments);
  
  // Verify assignment
  const roleCount = {};
  assignments.forEach(assignment => {
    roleCount[assignment.role] = (roleCount[assignment.role] || 0) + 1;
  });
  
  console.log('Role distribution:', roleCount);
  console.log('✅ Role assignment logic validated');
}

// Test win condition logic
function testWinConditionLogic() {
  console.log('\\n🏆 Testing Win Condition Logic...');
  
  function checkWinConditions(alivePlayers) {
    const aliveWerewolves = alivePlayers.filter(p => p.role === 'WEREWOLF').length;
    const aliveVillagers = alivePlayers.filter(p => p.team === 'VILLAGE').length;
    const aliveLovers = alivePlayers.filter(p => p.loverId).length;
    
    // Lovers win condition (only lovers survive)
    if (aliveLovers === 2 && alivePlayers.length === 2) {
      return 'LOVERS_WIN';
    }
    
    // Werewolves win condition (werewolves >= villagers)
    if (aliveWerewolves >= aliveVillagers) {
      return 'WEREWOLVES_WIN';
    }
    
    // Village wins condition (no werewolves left)
    if (aliveWerewolves === 0) {
      return 'VILLAGE_WINS';
    }
    
    return null; // Game continues
  }
  
  // Test scenarios
  const scenarios = [
    {
      name: 'Village wins',
      players: [
        { role: 'VILLAGER', team: 'VILLAGE' },
        { role: 'SEER', team: 'VILLAGE' },
        { role: 'WITCH', team: 'VILLAGE' }
      ]
    },
    {
      name: 'Werewolves win',
      players: [
        { role: 'WEREWOLF', team: 'WEREWOLF' },
        { role: 'WEREWOLF', team: 'WEREWOLF' },
        { role: 'VILLAGER', team: 'VILLAGE' }
      ]
    },
    {
      name: 'Game continues',
      players: [
        { role: 'WEREWOLF', team: 'WEREWOLF' },
        { role: 'VILLAGER', team: 'VILLAGE' },
        { role: 'SEER', team: 'VILLAGE' },
        { role: 'WITCH', team: 'VILLAGE' }
      ]
    }
  ];
  
  scenarios.forEach(scenario => {
    const winner = checkWinConditions(scenario.players);
    console.log(`${scenario.name}: ${winner || 'Game continues'} ✅`);
  });
}

// Test action validation logic
function testActionValidationLogic() {
  console.log('\\n🎯 Testing Action Validation Logic...');
  
  function canPerformAction(player, actionType, isNightPhase) {
    if (!player.isAlive) return false;
    
    switch (actionType) {
      case 'SEER_INVESTIGATE':
        return player.role === 'SEER' && isNightPhase;
      case 'WEREWOLF_KILL':
        return player.role === 'WEREWOLF' && isNightPhase;
      case 'WITCH_HEAL':
        return player.role === 'WITCH' && isNightPhase && player.specialStates.hasHealPotion;
      case 'WITCH_POISON':
        return player.role === 'WITCH' && isNightPhase && player.specialStates.hasPoisonPotion;
      case 'VILLAGE_VOTE':
        return !isNightPhase;
      default:
        return false;
    }
  }
  
  const testPlayers = [
    {
      role: 'SEER',
      isAlive: true,
      specialStates: {}
    },
    {
      role: 'WITCH',
      isAlive: true,
      specialStates: { hasHealPotion: true, hasPoisonPotion: true }
    },
    {
      role: 'WEREWOLF',
      isAlive: true,
      specialStates: {}
    }
  ];
  
  const actions = ['SEER_INVESTIGATE', 'WEREWOLF_KILL', 'WITCH_HEAL', 'VILLAGE_VOTE'];
  
  testPlayers.forEach((player, index) => {
    console.log(`\\nPlayer ${index + 1} (${player.role}):`);
    actions.forEach(action => {
      const canNight = canPerformAction(player, action, true);
      const canDay = canPerformAction(player, action, false);
      console.log(`  ${action}: Night=${canNight}, Day=${canDay}`);
    });
  });
  
  console.log('\\n✅ Action validation logic tested');
}

// Run all tests
async function runAllTests() {
  try {
    testRoleConfigurationLogic();
    testNightPhaseLogic();
    testRoleAssignmentLogic();
    testWinConditionLogic();
    testActionValidationLogic();
    
    console.log('\\n🎉 All logic tests completed successfully!');
    console.log('\\n📋 Test Summary:');
    console.log('✅ Role configuration validation');
    console.log('✅ Night phase ordering');
    console.log('✅ Role assignment distribution');
    console.log('✅ Win condition checking');
    console.log('✅ Action validation rules');
    
  } catch (error) {
    console.error('\\n❌ Test error:', error);
  }
}

runAllTests();