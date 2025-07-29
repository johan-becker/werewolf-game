// Simple test for Supabase authentication
import axios from 'axios';

const baseURL = 'http://localhost:3000/api';

async function testAuth() {
  console.log('🧪 Testing Supabase Authentication System...\n');

  try {
    // Test server health
    console.log('1. Testing server health...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Server is running:', healthResponse.data.message);

    // Test user registration
    console.log('\n2. Testing user registration...');
    const registerData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'TestPassword123'
    };

    try {
      const registerResponse = await axios.post(`${baseURL}/auth/register`, registerData);
      console.log('✅ User registered successfully:', registerResponse.data.user.username);
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.log('⚠️  Registration failed (expected if user exists):', error.response.data.error);
      } else {
        console.log('❌ Registration error:', error.response?.data || error.message);
      }
    }

    // Test user login
    console.log('\n3. Testing user login...');
    const loginData = {
      username: 'test@example.com', // Using email as username for Supabase
      password: 'TestPassword123'
    };

    try {
      const loginResponse = await axios.post(`${baseURL}/auth/login`, loginData);
      console.log('✅ User logged in successfully');
      
      const accessToken = loginResponse.data.accessToken;
      
      // Test protected route
      console.log('\n4. Testing protected route...');
      const meResponse = await axios.get(`${baseURL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      console.log('✅ Protected route access successful:', meResponse.data.user.username);
      
    } catch (error: any) {
      console.log('❌ Login error:', error.response?.data || error.message);
    }

    // Test unauthorized access
    console.log('\n5. Testing unauthorized access...');
    try {
      await axios.get(`${baseURL}/auth/me`);
      console.log('❌ Should have blocked unauthorized access');
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('✅ Unauthorized access properly blocked');
      } else {
        console.log('❌ Unexpected error:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 Authentication tests completed!');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testAuth();