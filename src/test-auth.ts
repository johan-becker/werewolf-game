// Comprehensive test script for the authentication system
import axios, { AxiosResponse } from 'axios';
import { logger } from '@utils/logger';

interface TestUser {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: any;
    accessToken: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

class AuthTester {
  private baseUrl: string;
  private testUser: TestUser;
  private accessToken: string = '';
  private refreshToken: string = '';

  constructor() {
    this.baseUrl = 'http://localhost:3000/api';
    this.testUser = {
      username: 'testuser123',
      email: 'test@example.com',
      password: 'TestPassword123!'
    };
  }

  private async makeRequest(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    endpoint: string,
    data?: any,
    useAuth: boolean = false
  ): Promise<AxiosResponse> {
    const config: any = {
      method,
      url: `${this.baseUrl}${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      config.data = data;
    }

    if (useAuth && this.accessToken) {
      config.headers.Authorization = `Bearer ${this.accessToken}`;
    }

    try {
      return await axios(config);
    } catch (error: any) {
      return error.response;
    }
  }

  private logTest(testName: string, success: boolean, message?: string): void {
    const status = success ? '✅' : '❌';
    console.log(`${status} ${testName}${message ? `: ${message}` : ''}`);
  }

  // Test user registration
  async testRegistration(): Promise<boolean> {
    try {
      const response = await this.makeRequest('POST', '/auth/register', this.testUser);
      
      if (response.status === 201 && response.data.success) {
        this.accessToken = response.data.data.accessToken;
        this.logTest('User Registration', true);
        return true;
      } else {
        this.logTest('User Registration', false, response.data?.error?.message);
        return false;
      }
    } catch (error) {
      this.logTest('User Registration', false, 'Request failed');
      return false;
    }
  }

  // Test duplicate registration prevention
  async testDuplicateRegistration(): Promise<boolean> {
    try {
      const response = await this.makeRequest('POST', '/auth/register', this.testUser);
      
      if (response.status === 409) {
        this.logTest('Duplicate Registration Prevention', true);
        return true;
      } else {
        this.logTest('Duplicate Registration Prevention', false, 'Should have prevented duplicate');
        return false;
      }
    } catch (error) {
      this.logTest('Duplicate Registration Prevention', false, 'Request failed');
      return false;
    }
  }

  // Test user login
  async testLogin(): Promise<boolean> {
    try {
      const loginData = {
        username: this.testUser.username,
        password: this.testUser.password
      };

      const response = await this.makeRequest('POST', '/auth/login', loginData);
      
      if (response.status === 200 && response.data.success) {
        this.accessToken = response.data.data.accessToken;
        this.logTest('User Login', true);
        return true;
      } else {
        this.logTest('User Login', false, response.data?.error?.message);
        return false;
      }
    } catch (error) {
      this.logTest('User Login', false, 'Request failed');
      return false;
    }
  }

  // Test invalid login
  async testInvalidLogin(): Promise<boolean> {
    try {
      const invalidData = {
        username: this.testUser.username,
        password: 'wrongpassword'
      };

      const response = await this.makeRequest('POST', '/auth/login', invalidData);
      
      if (response.status === 401) {
        this.logTest('Invalid Login Prevention', true);
        return true;
      } else {
        this.logTest('Invalid Login Prevention', false, 'Should have rejected invalid credentials');
        return false;
      }
    } catch (error) {
      this.logTest('Invalid Login Prevention', false, 'Request failed');
      return false;
    }
  }

  // Test protected route access
  async testProtectedRoute(): Promise<boolean> {
    try {
      const response = await this.makeRequest('GET', '/auth/me', undefined, true);
      
      if (response.status === 200 && response.data.success) {
        this.logTest('Protected Route Access', true);
        return true;
      } else {
        this.logTest('Protected Route Access', false, response.data?.error?.message);
        return false;
      }
    } catch (error) {
      this.logTest('Protected Route Access', false, 'Request failed');
      return false;
    }
  }

  // Test protected route without token
  async testUnauthorizedAccess(): Promise<boolean> {
    try {
      const response = await this.makeRequest('GET', '/auth/me', undefined, false);
      
      if (response.status === 401) {
        this.logTest('Unauthorized Access Prevention', true);
        return true;
      } else {
        this.logTest('Unauthorized Access Prevention', false, 'Should have rejected unauthorized access');
        return false;
      }
    } catch (error) {
      this.logTest('Unauthorized Access Prevention', false, 'Request failed');
      return false;
    }
  }

  // Test profile update
  async testProfileUpdate(): Promise<boolean> {
    try {
      const updateData = {
        email: 'newemail@example.com'
      };

      const response = await this.makeRequest('PATCH', '/auth/me', updateData, true);
      
      if (response.status === 200 && response.data.success) {
        this.logTest('Profile Update', true);
        return true;
      } else {
        this.logTest('Profile Update', false, response.data?.error?.message);
        return false;
      }
    } catch (error) {
      this.logTest('Profile Update', false, 'Request failed');
      return false;
    }
  }

  // Test input validation
  async testInputValidation(): Promise<boolean> {
    try {
      const invalidData = {
        username: 'ab', // too short
        email: 'invalid-email',
        password: '123' // too weak
      };

      const response = await this.makeRequest('POST', '/auth/register', invalidData);
      
      if (response.status === 400) {
        this.logTest('Input Validation', true);
        return true;
      } else {
        this.logTest('Input Validation', false, 'Should have rejected invalid input');
        return false;
      }
    } catch (error) {
      this.logTest('Input Validation', false, 'Request failed');
      return false;
    }
  }

  // Test user logout
  async testLogout(): Promise<boolean> {
    try {
      const response = await this.makeRequest('POST', '/auth/logout', undefined, true);
      
      if (response.status === 200 && response.data.success) {
        this.logTest('User Logout', true);
        return true;
      } else {
        this.logTest('User Logout', false, response.data?.error?.message);
        return false;
      }
    } catch (error) {
      this.logTest('User Logout', false, 'Request failed');
      return false;
    }
  }

  // Test rate limiting
  async testRateLimiting(): Promise<boolean> {
    try {
      const promises = [];
      // Make 10 rapid requests to trigger rate limiting
      for (let i = 0; i < 10; i++) {
        promises.push(this.makeRequest('POST', '/auth/login', {
          username: 'nonexistent',
          password: 'wrongpassword'
        }));
      }

      const responses = await Promise.all(promises);
      const rateLimited = responses.some(response => response.status === 429);
      
      if (rateLimited) {
        this.logTest('Rate Limiting', true);
        return true;
      } else {
        this.logTest('Rate Limiting', false, 'Should have triggered rate limiting');
        return false;
      }
    } catch (error) {
      this.logTest('Rate Limiting', false, 'Request failed');
      return false;
    }
  }

  // Run all tests
  async runAllTests(): Promise<void> {
    console.log('\n🧪 Starting Authentication System Tests...\n');

    const tests = [
      { name: 'Input Validation', test: () => this.testInputValidation() },
      { name: 'User Registration', test: () => this.testRegistration() },
      { name: 'Duplicate Registration Prevention', test: () => this.testDuplicateRegistration() },
      { name: 'User Login', test: () => this.testLogin() },
      { name: 'Invalid Login Prevention', test: () => this.testInvalidLogin() },
      { name: 'Unauthorized Access Prevention', test: () => this.testUnauthorizedAccess() },
      { name: 'Protected Route Access', test: () => this.testProtectedRoute() },
      { name: 'Profile Update', test: () => this.testProfileUpdate() },
      { name: 'User Logout', test: () => this.testLogout() },
      { name: 'Rate Limiting', test: () => this.testRateLimiting() }
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (const { name, test } of tests) {
      try {
        const result = await test();
        if (result) passedTests++;
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        this.logTest(name, false, 'Test execution failed');
      }
    }

    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
      console.log('🎉 All authentication tests passed!');
    } else {
      console.log(`⚠️  ${totalTests - passedTests} tests failed. Check implementation.`);
    }
  }

  // Health check
  async testServerHealth(): Promise<boolean> {
    try {
      const response = await this.makeRequest('GET', '../health');
      
      if (response.status === 200) {
        this.logTest('Server Health Check', true);
        return true;
      } else {
        this.logTest('Server Health Check', false);
        return false;
      }
    } catch (error) {
      this.logTest('Server Health Check', false, 'Server not accessible');
      return false;
    }
  }
}

// Run the tests
async function runTests() {
  const tester = new AuthTester();
  
  console.log('🏥 Checking server health...');
  const serverHealthy = await tester.testServerHealth();
  
  if (serverHealthy) {
    await tester.runAllTests();
  } else {
    console.log('❌ Server is not accessible. Make sure the server is running on http://localhost:3000');
    process.exit(1);
  }
}

// Export for potential use in other test files
export { AuthTester };

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}