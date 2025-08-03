// src/services/authService.ts
import { supabaseAdmin, supabase, createAuthenticatedClient } from '../lib/supabase';
import { logger } from '../utils/logger';
import { SignUpData, SignInData, UpdateProfileData, Profile } from '../types/auth';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export class AuthService {
  // Register a new user with Supabase
  static async signup(data: SignUpData) {
    try {
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            full_name: data.full_name || data.username
          }
        }
      });

      if (authError) {
        logger.error('Supabase signup error:', authError);
        throw this.mapSupabaseError(authError);
      }

      if (!authData.user) {
        throw new Error('Failed to create user');
      }

      // Profile creation is handled by database trigger (handle_new_user)

      logger.info(`User signed up: ${data.username} (${authData.user.id})`);

      return {
        user: authData.user,
        session: authData.session,
        message: 'Registration successful'
      };

    } catch (error: any) {
      logger.error('Signup error:', error);
      throw error;
    }
  }

  // Login user with Supabase
  static async signin(data: SignInData) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (authError || !authData.user || !authData.session) {
        logger.warn(`Failed login attempt for email: ${data.email}`);
        throw this.mapSupabaseError(authError || new Error('Invalid credentials'));
      }

      logger.info(`User logged in: ${data.email} (${authData.user.id})`);

      return {
        user: authData.user,
        session: authData.session,
        accessToken: authData.session.access_token,
        refreshToken: authData.session.refresh_token
      };

    } catch (error: any) {
      logger.error('Signin error:', error);
      throw error;
    }
  }

  // Refresh tokens with Supabase
  static async refreshTokens(refreshToken: string) {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error || !data.session || !data.user) {
        throw this.mapSupabaseError(error || new Error('Invalid or expired refresh token'));
      }

      logger.debug(`Tokens refreshed for user: ${data.user.id})`);

      return {
        user: data.user,
        session: data.session,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token
      };

    } catch (error: any) {
      logger.error('Token refresh error:', error);
      throw error;
    }
  }

  // Logout user with Supabase
  static async logout(accessToken?: string) {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        logger.error('Logout error:', error);
        throw this.mapSupabaseError(error);
      }

      logger.info('User logged out successfully');

    } catch (error: any) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  // Get user profile with merged auth and profile data
  static async getUserProfile(userId: string) {
    try {
      const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (userError || !user.user) {
        throw this.mapSupabaseError(userError || new Error('User not found'));
      }

      // Get profile from profiles table
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      return {
        id: user.user.id,
        email: user.user.email,
        username: profile?.username || user.user.user_metadata?.username || user.user.email,
        full_name: profile?.full_name || user.user.user_metadata?.full_name,
        avatar_url: profile?.avatar_url || user.user.user_metadata?.avatar_url,
        bio: profile?.bio,
        createdAt: user.user.created_at,
        lastSignIn: user.user.last_sign_in_at
      };

    } catch (error: any) {
      logger.error('Get profile error:', error);
      throw error;
    }
  }

  // Create profile in profiles table (use admin for setup operations)
  static async createProfile(profileData: Partial<Profile>) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        logger.error('Create profile error:', error);
        throw this.mapSupabaseError(error);
      }

      return data;
    } catch (error: any) {
      logger.error('Create profile error:', error);
      throw error;
    }
  }

  // Update user profile (use authenticated client to respect RLS)
  static async updateProfile(userId: string, updates: UpdateProfileData, accessToken: string) {
    try {
      const authenticatedClient = createAuthenticatedClient(accessToken);
      
      const { data, error } = await authenticatedClient
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        logger.error('Update profile error:', error);
        throw this.mapSupabaseError(error);
      }

      logger.info(`Profile updated for user: ${userId}`);
      return data;
    } catch (error: any) {
      logger.error('Update profile error:', error);
      throw error;
    }
  }

  // Get public profile by ID (use regular client to respect RLS)
  static async getPublicProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, bio, created_at')
        .eq('id', userId)
        .single();

      if (error) {
        throw this.mapSupabaseError(error);
      }

      return data;
    } catch (error: any) {
      logger.error('Get public profile error:', error);
      throw error;
    }
  }

  // OAuth provider signin
  static async signInWithProvider(provider: 'google' | 'github' | 'discord') {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.FRONTEND_URL}/auth/callback`
        }
      });

      if (error) {
        logger.error(`OAuth ${provider} error:`, error);
        throw this.mapSupabaseError(error);
      }

      return data;
    } catch (error: any) {
      logger.error(`OAuth ${provider} error:`, error);
      throw error;
    }
  }

  // Map Supabase errors to meaningful messages
  static mapSupabaseError(error: any): Error {
    const message = error?.message || 'Unknown error';
    
    switch (error?.message) {
      case 'Invalid login credentials':
        return new Error('Invalid email or password');
      case 'User already registered':
        return new Error('An account with this email already exists');
      case 'Email not confirmed':
        return new Error('Please check your email and click the confirmation link');
      case 'Invalid refresh token':
        return new Error('Session expired. Please log in again');
      case 'Signup disabled':
        return new Error('Account registration is currently disabled');
      default:
        return new Error(message);
    }
  }
}