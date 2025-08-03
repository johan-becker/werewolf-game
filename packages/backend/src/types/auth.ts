import { Request } from 'express';
// import { User } from './database';

// Supabase Auth types
export interface SupabaseUser {
  id: string;
  email: string;
  username?: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
  };
}

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseAuthResponse {
  user: SupabaseUser;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  username: string;
  full_name?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  username?: string;
  full_name?: string;
  bio?: string;
  avatar_url?: string;
}

export interface SupabaseError {
  message: string;
  status?: number;
  code?: string;
}

// JWT Payload interfaces
export interface JWTPayload {
  userId: string;
  username: string;
  iat?: number;
  exp?: number;
}

export interface AccessTokenPayload extends JWTPayload {
  type: 'access';
}

export interface RefreshTokenPayload extends JWTPayload {
  type: 'refresh';
  tokenVersion: number;
}

// Authentication request/response interfaces
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfileResponse;
}

export interface UserProfileResponse {
  id: string;
  username: string;
  email: string;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  createdAt: Date;
  lastLogin: Date | null;
}

export interface UpdateProfileRequest {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

// Extended Express Request with authenticated user
export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    username: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

// Token storage interfaces
export interface RefreshTokenData {
  id: string;
  userId: string;
  token: string;
  tokenVersion: number;
  expiresAt: Date;
  createdAt: Date;
  isRevoked: boolean;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// Authentication service interfaces
export interface AuthServiceInterface {
  register(data: RegisterRequest): Promise<TokenResponse>;
  login(data: LoginRequest): Promise<TokenResponse>;
  refreshTokens(refreshToken: string): Promise<TokenResponse>;
  logout(refreshToken: string): Promise<void>;
  validateAccessToken(token: string): Promise<JWTPayload>;
  getUserProfile(userId: string): Promise<UserProfileResponse>;
}

// Validation interfaces
export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
}

export interface UsernameRequirements {
  minLength: number;
  maxLength: number;
  allowedChars: RegExp;
}

// Error types
export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class TokenExpiredError extends Error {
  constructor(message: string = 'Token has expired') {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

export class InvalidTokenError extends Error {
  constructor(message: string = 'Invalid token') {
    super(message);
    this.name = 'InvalidTokenError';
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class AccountExistsError extends Error {
  constructor(message: string = 'Account already exists') {
    super(message);
    this.name = 'AccountExistsError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Rate limiting types
export interface RateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

// Cookie configuration
export interface CookieConfig {
  name: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
}

// Authentication configuration
export interface AuthConfig {
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
  };
  cookies: {
    accessToken: CookieConfig;
    refreshToken: CookieConfig;
  };
  rateLimits: {
    auth: RateLimitConfig;
    general: RateLimitConfig;
  };
  password: PasswordRequirements;
  username: UsernameRequirements;
}