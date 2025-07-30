import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { io, Socket } from 'socket.io-client';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE = 'http://localhost:3000/api';
const SOCKET_URL = 'http://localhost:3000';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

let testUsers: Array<{ id: string; email: string; token?: string }> = [];
let testSockets: Socket[] = [];

async function setupTestUsers() {
  console.log('🔧 Setting up test users...');
  
  for (let i = 1; i <= 3; i++) {
    const timestamp = Date.now();
    const email = `testuser${i}_${timestamp}@example.com`;
    
    // Create user
    const { data: authData, error } = await supabase.auth.admin.createUser({
      email,
      password: 'TestPassword123!',
      email_confirm: true
    });

    if (error) throw new Error(`Failed to create user ${i}: ${error.message}`);
    
    testUsers.push({
      id: authData.user.id,
      email
    });
  }
  
  console.log('✅ Test users created');
}

async function loginUsers() {
  console.log('🔐 Logging in test users...');
  
  for (const user of testUsers) {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        password: 'TestPassword123!'
      })
    });
    
    const data = await response.json() as any;
    if (!data.success) throw new Error(`Login failed for ${user.email}: ${data.error}`);
    
    user.token = data.data.accessToken;
  }
  
  console.log('✅ Users logged in');
}

async function testAPIEndpoints() {
  console.log('\n📡 Testing API Endpoints...');
  
  const user1 = testUsers[0]!;
  const user2 = testUsers[1]!;
  
  // Test: List empty games
  console.log('1️⃣ Testing GET /api/games (empty)');
  let response = await fetch(`${API_BASE}/games`, {
    headers: { 'Authorization': `Bearer ${user1.token}` }
  });
  let data = await response.json() as any;
  if (!data.success || data.data.length !== 0) {
    throw new Error('Expected empty games list');
  }
  console.log('✅ Empty games list returned');
  
  // Test: Create game
  console.log('2️⃣ Testing POST /api/games');
  response = await fetch(`${API_BASE}/games`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${user1.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Test Lobby Game',
      maxPlayers: 6
    })
  });
  data = await response.json() as any;
  if (!data.success) throw new Error(`Game creation failed: ${data.error}`);
  
  const gameId = data.data.id;
  const gameCode = data.data.code;
  console.log(`✅ Game created: ${gameId} (code: ${gameCode})`);
  
  // Test: Get game details
  console.log('3️⃣ Testing GET /api/games/:id');
  response = await fetch(`${API_BASE}/games/${gameId}`, {
    headers: { 'Authorization': `Bearer ${user1.token}` }
  });
  data = await response.json() as any;
  if (!data.success || data.data.currentPlayers !== 1) {
    throw new Error('Expected 1 player in game');
  }
  console.log('✅ Game details retrieved');
  
  // Test: Join game by ID
  console.log('4️⃣ Testing POST /api/games/:id/join');
  response = await fetch(`${API_BASE}/games/${gameId}/join`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${user2.token}` }
  });
  data = await response.json() as any;
  if (!data.success || data.data.currentPlayers !== 2) {
    throw new Error('Expected 2 players after join');
  }
  console.log('✅ User joined game by ID');
  
  // Test: Join by code
  console.log('5️⃣ Testing POST /api/games/join/:code');
  const user3 = testUsers[2]!;
  response = await fetch(`${API_BASE}/games/join/${gameCode}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${user3.token}` }
  });
  data = await response.json() as any;
  if (!data.success || data.data.currentPlayers !== 3) {
    throw new Error('Expected 3 players after join by code');
  }
  console.log('✅ User joined game by code');
  
  // Test: Leave game
  console.log('6️⃣ Testing DELETE /api/games/:id/leave');
  response = await fetch(`${API_BASE}/games/${gameId}/leave`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${user3.token}` }
  });
  data = await response.json() as any;
  if (!data.success) throw new Error('Leave game failed');
  console.log('✅ User left game');
  
  // Test: List games with content
  console.log('7️⃣ Testing GET /api/games (with content)');
  response = await fetch(`${API_BASE}/games`, {
    headers: { 'Authorization': `Bearer ${user1.token}` }
  });
  data = await response.json() as any;
  if (!data.success || data.data.length !== 1) {
    throw new Error('Expected 1 game in list');
  }
  console.log('✅ Games list with content returned');
  
  return { gameId, gameCode };
}

async function testSocketIO(gameId: string) {
  console.log('\n🔌 Testing Socket.IO Events...');
  
  const user1 = testUsers[0]!;
  const user2 = testUsers[1]!;
  
  // Connect sockets
  const socket1 = io(SOCKET_URL, {
    auth: { token: user1.token }
  });
  
  const socket2 = io(SOCKET_URL, {
    auth: { token: user2.token }
  });
  
  testSockets = [socket1, socket2];
  
  // Wait for connections
  await Promise.all([
    new Promise(resolve => socket1.on('connect', resolve)),
    new Promise(resolve => socket2.on('connect', resolve))
  ]);
  
  console.log('✅ Sockets connected');
  
  // Test: Join lobby
  console.log('1️⃣ Testing lobby:join');
  socket1.emit('lobby:join');
  socket2.emit('lobby:join');
  
  // Test: List games via socket
  console.log('2️⃣ Testing lobby:list');
  const games = await new Promise<any>((resolve, reject) => {
    socket1.emit('lobby:list', (response: any) => {
      if (response.success) {
        resolve(response.games);
      } else {
        reject(new Error(response.error));
      }
    });
  });
  
  if (games.length !== 1) throw new Error('Expected 1 game via socket');
  console.log('✅ Games list retrieved via socket');
  
  // Test: Real-time updates
  console.log('3️⃣ Testing real-time lobby updates');
  let lobbyUpdate: any = null;
  
  socket2.on('lobby:gameUpdated', (data) => {
    lobbyUpdate = data;
  });
  
  // User 3 joins via REST API, should trigger socket update
  const user3 = testUsers[2]!;
  const response = await fetch(`${API_BASE}/games/${gameId}/join`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${user3.token}` }
  });
  
  // Wait for socket update
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (!lobbyUpdate || lobbyUpdate.currentPlayers !== 3) {
    throw new Error('Expected lobby update with 3 players');
  }
  console.log('✅ Real-time lobby update received');
  
  // Test: Socket game operations
  console.log('4️⃣ Testing socket game operations');
  
  let playerJoinedEvent: any = null;
  socket1.on('game:playerJoined', (data) => {
    playerJoinedEvent = data;
  });
  
  // Socket2 joins game via socket
  const joinResult = await new Promise<any>((resolve, reject) => {
    socket2.emit('game:join', { gameId }, (response: any) => {
      if (response.success) {
        resolve(response.game);
      } else {
        reject(new Error(response.error));
      }
    });
  });
  
  if (joinResult.currentPlayers !== 4) {
    throw new Error('Expected 4 players after socket join');
  }
  
  await new Promise(resolve => setTimeout(resolve, 200));
  
  if (!playerJoinedEvent) {
    throw new Error('Expected playerJoined event');
  }
  console.log('✅ Socket game join successful');
  
  return gameId;
}

async function testGameStart(gameId: string) {
  console.log('\n🎮 Testing Game Start...');
  
  const user1 = testUsers[0]!; // Host
  
  // Test: Start game via API
  const response = await fetch(`${API_BASE}/games/${gameId}/start`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${user1.token}` }
  });
  
  const data = await response.json() as any;
  if (!data.success) throw new Error(`Game start failed: ${data.error}`);
  
  console.log('✅ Game started successfully');
  
  // Wait for socket events
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Verify game is no longer in lobby
  const listResponse = await fetch(`${API_BASE}/games`, {
    headers: { 'Authorization': `Bearer ${user1.token}` }
  });
  const listData = await listResponse.json() as any;
  
  if (listData.data.length !== 0) {
    throw new Error('Expected no games in lobby after start');
  }
  console.log('✅ Game removed from lobby after start');
}

async function cleanup() {
  console.log('\n🧹 Cleaning up...');
  
  // Close sockets
  for (const socket of testSockets) {
    socket.close();
  }
  
  // Delete test users
  for (const user of testUsers) {
    await supabase.auth.admin.deleteUser(user.id);
  }
  
  console.log('✅ Cleanup complete');
}

async function runLobbySystemTest() {
  try {
    console.log('🚀 Starting Lobby System Integration Test\n');
    
    await setupTestUsers();
    await loginUsers();
    
    const { gameId } = await testAPIEndpoints();
    await testSocketIO(gameId);
    await testGameStart(gameId);
    
    console.log('\n🎉 All tests passed! Lobby system is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  } finally {
    await cleanup();
  }
}

// Run if called directly
if (require.main === module) {
  runLobbySystemTest();
}

export { runLobbySystemTest };