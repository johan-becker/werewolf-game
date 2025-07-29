// Test script for Supabase authentication system
import axios from 'axios';

const baseURL = 'http://localhost:3000/api';

async function testSupabaseAuth() {
  console.log('🧪 Testing Supabase Authentication System...\n');

  let accessToken = '';
  let refreshToken = '';
  let userId = '';

  try {
    // Test server health
    console.log('1. Testing server health...');
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('✅ Server is running:', healthResponse.data.message);

    // Test user signup
    console.log('\n2. Testing user signup...');
    const signupData = {
      username: 'testuser_' + Date.now(),
      email: `test_${Date.now()}@example.com`,
      password: 'TestPassword123!',
      full_name: 'Test User'
    };

    try {
      const signupResponse = await axios.post(`${baseURL}/auth/signup`, signupData);
      console.log('✅ User signed up successfully:', signupResponse.data.user.username);
      
      if (signupResponse.data.session) {
        accessToken = signupResponse.data.session.access_token;
        refreshToken = signupResponse.data.session.refresh_token;
        userId = signupResponse.data.user.id;
        console.log('✅ Got session tokens');
      }
    } catch (error: any) {
      if (error.response?.status === 400) {
        console.log('⚠️  Signup failed (expected if user exists):', error.response.data.error);
      } else {
        console.log('❌ Signup error:', error.response?.data || error.message);
      }
    }

    // Test user signin (if signup failed)
    if (!accessToken) {
      console.log('\n3. Testing user signin...');
      const signinData = {
        email: signupData.email,
        password: signupData.password
      };

      try {
        const signinResponse = await axios.post(`${baseURL}/auth/signin`, signinData);
        console.log('✅ User signed in successfully');
        
        accessToken = signinResponse.data.session.access_token;
        refreshToken = signinResponse.data.session.refresh_token;
        userId = signinResponse.data.user.id;
      } catch (error: any) {
        console.log('❌ Signin error:', error.response?.data || error.message);
        return;
      }
    }

    // Test protected route (auth/me)
    console.log('\n4. Testing protected auth route...');
    try {
      const meResponse = await axios.get(`${baseURL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      console.log('✅ Auth /me route successful:', meResponse.data.user.username);
      
    } catch (error: any) {
      console.log('❌ Auth me error:', error.response?.data || error.message);
    }

    // Test user profile route
    console.log('\n5. Testing user profile route...');
    try {
      const profileResponse = await axios.get(`${baseURL}/users/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      console.log('✅ User profile route successful:', profileResponse.data.user.username);
      
    } catch (error: any) {
      console.log('❌ User profile error:', error.response?.data || error.message);
    }

    // Test profile update
    console.log('\n6. Testing profile update...');
    try {
      const updateData = {
        bio: 'Updated bio from test script',
        full_name: 'Updated Test User'
      };

      const updateResponse = await axios.patch(`${baseURL}/users/me`, updateData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      console.log('✅ Profile update successful');
      
    } catch (error: any) {
      console.log('❌ Profile update error:', error.response?.data || error.message);
    }

    // Test public profile
    console.log('\n7. Testing public profile...');
    try {
      const publicProfileResponse = await axios.get(`${baseURL}/users/${userId}`);
      
      console.log('✅ Public profile route successful:', publicProfileResponse.data.user.username);
      
    } catch (error: any) {
      console.log('❌ Public profile error:', error.response?.data || error.message);
    }

    // Test token refresh
    console.log('\n8. Testing token refresh...');
    try {
      const refreshResponse = await axios.post(`${baseURL}/auth/refresh`, {
        refreshToken: refreshToken
      });
      
      console.log('✅ Token refresh successful');
      accessToken = refreshResponse.data.accessToken;
      
    } catch (error: any) {
      console.log('❌ Token refresh error:', error.response?.data || error.message);
    }

    // Test unauthorized access
    console.log('\n9. Testing unauthorized access...');
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

    // Test logout
    console.log('\n10. Testing logout...');
    try {
      await axios.post(`${baseURL}/auth/logout`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.log('❌ Logout error:', error.response?.data || error.message);
    }

    console.log('\n🎉 Supabase authentication tests completed!');

  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests
testSupabaseAuth();