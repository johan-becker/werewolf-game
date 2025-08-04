/**
 * Production-ready authentication types for multiplayer game system
 * Zero-tolerance policy for authentication bypass vulnerabilities
 */

import { Request } from 'express';
// import { User } from '@supabase/supabase-js';

// Strict authentication result types
export interface AuthenticationResult {
  success: boolean;
  user?: AuthenticatedUser;
  error?: AuthenticationError;
  metadata?: AuthMetadata;
}

export interface AuthenticatedUser {
  readonly id: string; // Alias for userId for compatibility
  readonly userId: string;
  readonly username: string;
  readonly email: string;
  readonly role: string;
  readonly permissions: string[];
  readonly isVerified: boolean;
  readonly createdAt: Date;
  readonly lastActiveAt: Date;
}

export interface AuthenticationError {
  readonly code: AuthErrorCode;
  readonly message: string;
  readonly details?: Record<string, any>;
  readonly timestamp: Date;
  readonly retryAfter?: number; // seconds
}

export interface AuthMetadata {
  readonly tokenType: 'bearer' | 'session';
  readonly expiresAt: Date;
  readonly issuer: string;
  readonly audience: string;
  readonly deviceId?: string;
}

// Authentication error codes for precise error handling
export enum AuthErrorCode {
  NO_TOKEN = 'NO_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  MALFORMED_TOKEN = 'MALFORMED_TOKEN',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_SUSPENDED = 'USER_SUSPENDED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  INVALID_SESSION = 'INVALID_SESSION',
}

// Role-based authorization system
export enum UserRole {
  PLAYER = 'PLAYER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SYSTEM = 'SYSTEM',
}

export enum Permission {
  PLAY_GAME = 'PLAY_GAME',
  CREATE_GAME = 'CREATE_GAME',
  MODERATE_CHAT = 'MODERATE_CHAT',
  BAN_USER = 'BAN_USER',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  MANAGE_SYSTEM = 'MANAGE_SYSTEM',
}

// Secure request interface - user is ALWAYS present after authentication
export interface AuthenticatedRequest extends Request {
  readonly user: AuthenticatedUser;
  readonly authMetadata: AuthMetadata;
}

// Optional request interface for endpoints that support both auth states
export interface OptionalAuthRequest extends Request {
  readonly user?: AuthenticatedUser;
  readonly authMetadata?: AuthMetadata;
}

// WebSocket authentication context
export interface SocketAuthContext {
  readonly user: AuthenticatedUser;
  readonly sessionId: string;
  readonly connectedAt: Date;
  readonly lastActivityAt: Date;
}

// Authentication configuration
export interface AuthConfig {
  readonly tokenValidationTimeoutMs: number;
  readonly maxConcurrentSessions: number;
  readonly sessionTimeoutMs: number;
  readonly enableDeviceTracking: boolean;
  readonly strictModeEnabled: boolean;
}

// Rate limiting configuration per endpoint type
export interface RateLimitConfig {
  readonly auth: {
    windowMs: number;
    max: number;
    blockDuration: number;
  };
  readonly gameplay: {
    windowMs: number;
    max: number;
    burstMax: number;
  };
  readonly chat: {
    windowMs: number;
    max: number;
    burstMax: number;
  };
}

// Security audit logging
export interface SecurityEvent {
  readonly type: SecurityEventType;
  readonly userId?: string;
  readonly ip: string;
  readonly userAgent: string;
  readonly details: Record<string, any>;
  readonly timestamp: Date;
  readonly severity: SecuritySeverity;
}

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  TOKEN_REFRESH = 'TOKEN_REFRESH',
  INVALID_TOKEN_ATTEMPT = 'INVALID_TOKEN_ATTEMPT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  PRIVILEGE_ESCALATION_ATTEMPT = 'PRIVILEGE_ESCALATION_ATTEMPT',
  SESSION_HIJACK_ATTEMPT = 'SESSION_HIJACK_ATTEMPT',
}

export enum SecuritySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Performance metrics for monitoring
export interface AuthPerformanceMetrics {
  authenticationLatencyMs: number;
  cacheHitRate: number;
  activeSessionsCount: number;
  tokenValidationsPerSecond: number;
}
