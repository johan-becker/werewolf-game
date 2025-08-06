import { faker } from '@faker-js/faker';
import { SignUpData, SignInData } from '../../types/auth';

/**
 * Mock AuthService for integration tests
 * Provides realistic responses without requiring Supabase connection
 */
export class MockAuthService {
  private static users: Map<string, any> = new Map();
  private static sessions: Map<string, any> = new Map();

  static async signup(data: SignUpData) {
    const userId = faker.string.uuid();
    const sessionId = faker.string.uuid();
    
    // Check if user already exists
    const existingUser = Array.from(this.users.values()).find(
      user => user.email === data.email || user.user_metadata?.username === data.username
    );
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = {
      id: userId,
      email: data.email,
      user_metadata: {
        username: data.username,
        full_name: data.full_name || data.username,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const session = {
      access_token: `test-access-token-${sessionId}`,
      refresh_token: `test-refresh-token-${sessionId}`,
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: user,
    };

    this.users.set(userId, user);
    this.sessions.set(sessionId, session);

    return {
      user,
      session,
      message: 'Registration successful',
    };
  }

  static async signin(data: SignInData) {
    const user = Array.from(this.users.values()).find(
      user => user.email === data.email
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const sessionId = faker.string.uuid();
    const session = {
      access_token: `test-access-token-${sessionId}`,
      refresh_token: `test-refresh-token-${sessionId}`,
      expires_in: 3600,
      expires_at: Date.now() + 3600000,
      token_type: 'bearer',
      user: user,
    };

    this.sessions.set(sessionId, session);

    return {
      user,
      session,
      message: 'Login successful',
    };
  }

  static async verifyToken(token: string) {
    // Extract session ID from token (simplified for testing)
    const sessionId = token.replace('test-access-token-', '');
    const session = this.sessions.get(sessionId);

    if (!session || session.expires_at < Date.now()) {
      throw new Error('Invalid or expired token');
    }

    return {
      user: session.user,
      session,
    };
  }

  static async refreshToken(refreshToken: string) {
    // Find session by refresh token
    const session = Array.from(this.sessions.values()).find(
      s => s.refresh_token === refreshToken
    );

    if (!session) {
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens
    const newSessionId = faker.string.uuid();
    const newSession = {
      ...session,
      access_token: `test-access-token-${newSessionId}`,
      refresh_token: `test-refresh-token-${newSessionId}`,
      expires_at: Date.now() + 3600000,
    };

    this.sessions.set(newSessionId, newSession);

    return {
      user: session.user,
      session: newSession,
    };
  }

  static async logout() {
    // In a real implementation, this would invalidate the session
    return { message: 'Logout successful' };
  }

  static async getProfile(userId: string) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      username: user.user_metadata.username,
      email: user.email,
      full_name: user.user_metadata.full_name,
      avatar_url: user.user_metadata.avatar_url || null,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  // Helper method to clear all test data between tests
  static clearAll() {
    this.users.clear();
    this.sessions.clear();
  }

  // Helper method to get all users (for testing)
  static getAllUsers() {
    return Array.from(this.users.values());
  }

  // Helper method to get all sessions (for testing)
  static getAllSessions() {
    return Array.from(this.sessions.values());
  }

  // Method to map errors similar to the real service
  static mapSupabaseError(error: any): Error {
    // Simplified error mapping for tests
    if (error.message.includes('already exists')) {
      return new Error('User already exists');
    }
    if (error.message.includes('invalid')) {
      return new Error('Invalid credentials');
    }
    return new Error(error.message || 'Authentication error');
  }
}