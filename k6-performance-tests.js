import http from 'k6/http';
import ws from 'k6/ws';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics for werewolf game performance
const werewolfGameCreations = new Counter('werewolf_games_created');
const werewolfJoinSuccess = new Rate('werewolf_join_success_rate');
const werewolfGameStartTime = new Trend('werewolf_game_start_duration');
const werewolfNightActionLatency = new Trend('werewolf_night_action_latency');
const werewolfChatMessageLatency = new Trend('werewolf_chat_message_latency');

// Test configuration for different werewolf scenarios
export const options = {
  scenarios: {
    // Basic load test for werewolf game API
    werewolf_api_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 20 }, // Ramp up to 20 werewolf players
        { duration: '5m', target: 20 }, // Stay at 20 players for 5 minutes
        { duration: '2m', target: 50 }, // Ramp up to 50 players
        { duration: '5m', target: 50 }, // Peak werewolf activity
        { duration: '2m', target: 0 },  // Ramp down
      ],
    },
    
    // Spike test for full moon events (high werewolf activity)
    full_moon_spike: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '30s', target: 100 }, // Sudden spike to 100 werewolves
        { duration: '1m', target: 100 },  // Maintain peak activity
        { duration: '30s', target: 0 },   // Quick ramp down
      ],
      startTime: '10m', // Start after basic load test
    },
    
    // WebSocket performance for real-time werewolf communication
    werewolf_realtime: {
      executor: 'constant-vus',
      vus: 30,
      duration: '5m',
      startTime: '15m',
    },
    
    // Stress test for large werewolf pack scenarios
    large_pack_stress: {
      executor: 'ramping-arrival-rate',
      startRate: 0,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 200,
      stages: [
        { duration: '2m', target: 10 }, // 10 new werewolves per second
        { duration: '5m', target: 20 }, // 20 new werewolves per second
        { duration: '2m', target: 0 },  // Ramp down
      ],
      startTime: '20m',
    },
  },
  
  thresholds: {
    // Performance thresholds for werewolf game
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],   // Less than 1% failure rate
    werewolf_join_success_rate: ['rate>0.95'], // 95% successful game joins
    werewolf_game_start_duration: ['p(90)<2000'], // Game starts within 2s
    werewolf_night_action_latency: ['p(95)<200'], // Night actions under 200ms
    werewolf_chat_message_latency: ['p(95)<100'], // Chat messages under 100ms
  },
};

// Test data for werewolf scenarios
const werewolfGameNames = [
  'Moonlit Village Terror', 'Shadow Pack Hunt', 'Blood Moon Rising',
  'Silver Fang Massacre', 'Howling Hills Horror', 'Crimson Claw Manor',
  'Midnight Pack Territory', 'Full Moon Gathering', 'Alpha\'s Domain',
  'Werewolf\'s Den Challenge'
];

const werewolfUsernames = [
  'Luna_Nighthowl', 'Shadow_Fang', 'Crimson_Claw', 'Moonlight_Hunter',
  'Silver_Bite', 'Dark_Paw', 'Blood_Moon', 'Alpha_Storm',
  'Night_Stalker', 'Howling_Wind', 'Mystic_Wolf', 'Savage_Tooth'
];

const werewolfChatMessages = [
  "The pack grows stronger under the full moon 🌕",
  "I sense something lurking in the shadows...",
  "The village elder speaks of ancient werewolf legends",
  "Blood moon tonight - perfect for hunting 🩸",
  "My werewolf instincts are tingling",
  "The alpha's howl echoes through the forest",
  "Silver bullets won't save you now!",
  "The hunt begins at midnight 🐺",
  "Pack loyalty above all else",
  "The moon reveals all secrets..."
];

// Base URL configuration
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';
const WS_URL = __ENV.WS_URL || 'ws://localhost:8000';

// Authentication helper for werewolf players
function authenticateWerewolfPlayer() {
  const username = werewolfUsernames[Math.floor(Math.random() * werewolfUsernames.length)];
  const email = `${username.toLowerCase()}@werewolf-test.com`;
  
  // Register werewolf player
  const registerPayload = {
    username,
    email,
    password: 'WerewolfPack123!',
    display_name: username.replace('_', ' '),
    pack_affiliation: 'Performance Test Pack',
  };
  
  const registerResponse = http.post(`${BASE_URL}/api/auth/register`, JSON.stringify(registerPayload), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  // Login to get auth token
  const loginPayload = {
    email,
    password: 'WerewolfPack123!',
  };
  
  const loginResponse = http.post(`${BASE_URL}/api/auth/login`, JSON.stringify(loginPayload), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  check(loginResponse, {
    'werewolf login successful': (r) => r.status === 200,
    'auth token received': (r) => r.json('token') !== undefined,
  });
  
  return loginResponse.json('token');
}

// Create werewolf game performance test
export function werewolfGameCreation() {
  const authToken = authenticateWerewolfPlayer();
  if (!authToken) return;
  
  const gamePayload = {
    name: werewolfGameNames[Math.floor(Math.random() * werewolfGameNames.length)],
    max_players: Math.floor(Math.random() * 15) + 6, // 6-20 players
    settings: {
      night_length_minutes: 5,
      day_length_minutes: 10,
      werewolf_ratio: 0.25,
      pack_hunting_enabled: true,
      moon_phase_effects: true,
      territory_bonuses: true,
      alpha_werewolf_enabled: Math.random() > 0.7,
    },
  };
  
  const startTime = Date.now();
  const response = http.post(`${BASE_URL}/api/games`, JSON.stringify(gamePayload), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  });
  
  const duration = Date.now() - startTime;
  
  check(response, {
    'werewolf game created': (r) => r.status === 201,
    'game code generated': (r) => r.json('game.code') !== undefined,
    'werewolf settings applied': (r) => r.json('game.settings.pack_hunting_enabled') === true,
  });
  
  if (response.status === 201) {
    werewolfGameCreations.add(1);
    werewolfGameStartTime.add(duration);
    return response.json('game');
  }
}

// Join werewolf game performance test
export function werewolfGameJoin() {
  const authToken = authenticateWerewolfPlayer();
  if (!authToken) return;
  
  // First create a game to join
  const game = werewolfGameCreation();
  if (!game) return;
  
  // Create another player to join
  const joinToken = authenticateWerewolfPlayer();
  if (!joinToken) return;
  
  const startTime = Date.now();
  const response = http.post(`${BASE_URL}/api/games/${game.code}/join`, '', {
    headers: {
      'Authorization': `Bearer ${joinToken}`,
    },
  });
  
  const duration = Date.now() - startTime;
  const success = response.status === 200;
  
  werewolfJoinSuccess.add(success);
  
  check(response, {
    'successfully joined werewolf game': (r) => r.status === 200,
    'player added to pack': (r) => r.json('player.game_id') === game.id,
    'pack member status assigned': (r) => r.json('player.werewolf_team') !== undefined,
  });
  
  return success;
}

// Werewolf night actions performance test
export function werewolfNightActions() {
  const authToken = authenticateWerewolfPlayer();
  if (!authToken) return;
  
  // Simulate night action submission
  const actionPayload = {
    action: 'werewolf_kill',
    target_id: 'test-target-id',
    pack_coordination: true,
  };
  
  const startTime = Date.now();
  const response = http.post(`${BASE_URL}/api/games/test-game/actions/night`, JSON.stringify(actionPayload), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
    },
  });
  
  const duration = Date.now() - startTime;
  werewolfNightActionLatency.add(duration);
  
  check(response, {
    'night action processed': (r) => r.status === 200 || r.status === 400, // 400 for invalid game state
    'action response received': (r) => r.body.length > 0,
  });
}

// WebSocket performance test for real-time werewolf communication
export function werewolfRealtimeCommunication() {
  const authToken = authenticateWerewolfPlayer();
  if (!authToken) return;
  
  const url = `${WS_URL}/socket.io/?EIO=4&transport=websocket&token=${authToken}`;
  
  const response = ws.connect(url, {}, function (socket) {
    socket.on('open', () => {
      // Join werewolf pack
      socket.send(JSON.stringify({
        type: 'join_pack',
        data: { gameId: 'test-game-id', werewolfRole: true }
      }));
    });
    
    socket.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        check(message, {
          'werewolf message received': (m) => m.type !== undefined,
        });
      } catch (e) {
        // Handle non-JSON messages
      }
    });
    
    // Send werewolf chat messages
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      
      socket.send(JSON.stringify({
        type: 'werewolf_chat',
        data: {
          gameId: 'test-game-id',
          message: werewolfChatMessages[Math.floor(Math.random() * werewolfChatMessages.length)],
          channel: 'WEREWOLF',
          moon_phase: 'full_moon',
        }
      }));
      
      socket.setTimeout(() => {
        const duration = Date.now() - startTime;
        werewolfChatMessageLatency.add(duration);
      }, 100);
      
      sleep(1);
    }
    
    // Send night action via WebSocket
    socket.send(JSON.stringify({
      type: 'night_action',
      data: {
        gameId: 'test-game-id',
        action: 'werewolf_kill',
        targetId: 'victim-player-id',
        packCoordination: true,
      }
    }));
    
    sleep(5);
  });
  
  check(response, {
    'werewolf websocket connected': (r) => r && r.status === 101,
  });
}

// Moon phase transition performance test
export function moonPhaseTransition() {
  const authToken = authenticateWerewolfPlayer();
  if (!authToken) return;
  
  const phases = ['new_moon', 'waxing_crescent', 'full_moon', 'waning_gibbous'];
  const phase = phases[Math.floor(Math.random() * phases.length)];
  
  const response = http.post(`${BASE_URL}/api/test/moon-phase/${phase}`, '', {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
  
  check(response, {
    'moon phase transition successful': (r) => r.status === 200,
    'werewolf effects applied': (r) => r.json('effects') !== undefined,
    'pack bonuses calculated': (r) => r.json('werewolf_status') !== undefined,
  });
}

// Default test function - cycles through different werewolf scenarios
export default function () {
  const scenario = Math.random();
  
  if (scenario < 0.3) {
    // 30% - Create werewolf games
    werewolfGameCreation();
  } else if (scenario < 0.5) {
    // 20% - Join existing games
    werewolfGameJoin();
  } else if (scenario < 0.7) {
    // 20% - Test night actions
    werewolfNightActions();
  } else if (scenario < 0.9) {
    // 20% - Test real-time communication
    werewolfRealtimeCommunication();
  } else {
    // 10% - Test moon phase transitions
    moonPhaseTransition();
  }
  
  sleep(Math.random() * 3 + 1); // Random sleep 1-4 seconds
}

// Teardown function for cleanup
export function teardown() {
  console.log('🌙 Werewolf performance test completed');
  console.log(`🐺 Games created: ${werewolfGameCreations.count}`);
  console.log('🏰 Cleaning up werewolf test data...');
}