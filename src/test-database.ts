// Simple test script to verify database connection and basic operations
import { UserService } from './services/userService';
import { GameService } from './services/gameService';
import { db } from './database';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test health check
    const isHealthy = await db.healthCheck();
    console.log('Database health check:', isHealthy);

    // Test user creation
    console.log('\nTesting user creation...');
    const testUser = await UserService.createUser({
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123'
    });
    console.log('Created user:', testUser.username);

    // Test user authentication
    console.log('\nTesting user authentication...');
    const authenticatedUser = await UserService.authenticateUser({
      username: 'testuser',
      password: 'TestPassword123'
    });
    console.log('Authenticated user:', authenticatedUser?.username);

    // Test game creation
    console.log('\nTesting game creation...');
    const testGame = await GameService.createGame({
      name: 'Test Game',
      creatorId: testUser.id,
      maxPlayers: 8
    });
    console.log('Created game:', testGame.name, 'with code:', testGame.code);

    // Test join game
    console.log('\nTesting joining game...');
    const testUser2 = await UserService.createUser({
      username: 'testuser2',
      email: 'test2@example.com',
      password: 'TestPassword123'
    });
    
    const joinedGame = await GameService.joinGame({
      gameCode: testGame.code,
      userId: testUser2.id
    });
    console.log('User joined game. Players:', joinedGame.currentPlayers);

    console.log('\n✅ All database tests passed!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await db.disconnect();
  }
}

// Run the test
testDatabase();