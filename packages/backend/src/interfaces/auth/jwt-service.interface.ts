/**
 * JWT Service Interface
 */

export interface JwtPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
  jti?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface TokenValidationResult {
  isValid: boolean;
  payload?: JwtPayload;
  error?: string;
  expired: boolean;
}

export interface IJwtService {
  /**
   * Generate access and refresh token pair
   */
  generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp' | 'jti'>): Promise<TokenPair>;

  /**
   * Validate access token
   */
  validateAccessToken(token: string): Promise<TokenValidationResult>;

  /**
   * Refresh tokens with rotation
   */
  refreshTokens(refreshToken: string, userPayload: Omit<JwtPayload, 'iat' | 'exp' | 'jti'>): Promise<TokenPair>;

  /**
   * Blacklist a token (for logout)
   */
  blacklistToken(token: string): Promise<void>;

  /**
   * Invalidate all tokens for a user
   */
  invalidateAllUserTokens(userId: string): Promise<void>;
}