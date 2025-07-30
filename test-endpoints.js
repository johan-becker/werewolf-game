const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testEndpoints() {
  console.log('Testing REST endpoints...\n');
  
  // Test health endpoint
  try {
    const health = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check:', health.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
  }
  
  // Test auth registration (should work once routes are loaded)
  try {
    const register = await axios.post(`${API_BASE}/auth/register`, {
      email: 'test@example.com',
      password: 'testpassword123',
      username: 'testuser'
    });
    console.log('✅ Registration:', register.data);
  } catch (error) {
    console.log('❌ Registration failed:', error.response?.status, error.response?.data?.error?.message || error.message);
  }
  
  // Test game endpoints (would require auth)
  try {
    const games = await axios.get(`${API_BASE}/games`);
    console.log('✅ Get games:', games.data);
  } catch (error) {
    console.log('❌ Get games failed:', error.response?.status, error.response?.data?.error?.message || error.message);
  }
}

testEndpoints().catch(console.error);