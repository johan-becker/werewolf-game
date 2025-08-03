/**
 * Enhanced JWT Service with Refresh Token Rotation
 * Secure JWT token management with automatic refresh token rotation
 */

import { injectable, inject } from 'inversify';
import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'crypto';
import { IJwtService } from '../../interfaces/auth/jwt-service.interface';
import { IAppConfig } from '../../interfaces/config/app-config.interface';
import { IRedis } from '../../interfaces/core/redis.interface';
import { TYPES } from '../../container/types';

export interface JwtPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
  jti?: string; // JWT ID for token tracking
}

export interface RefreshTokenPayload {
  userId: string;
  tokenFamily: string; // Token family for refresh token detection
  version: number;     // Token version for rotation
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

@injectable()
export class JwtService implements IJwtService {
  private readonly TOKEN_BLACKLIST_PREFIX = 'jwt:blacklist:';
  private readonly REFRESH_TOKEN_PREFIX = 'jwt:refresh:';
  private readonly TOKEN_FAMILY_PREFIX = 'jwt:family:';

  constructor(
    @inject(TYPES.AppConfig) private readonly config: IAppConfig,
    @inject(TYPES.Redis) private readonly redis: IRedis
  ) {}

  /**
   * Generate access and refresh token pair
   */
  async generateTokenPair(payload: Omit<JwtPayload, 'iat' | 'exp' | 'jti'>): Promise<TokenPair> {
    const tokenFamily = this.generateTokenFamily();
    const jti = this.generateTokenId();
    const refreshJti = this.generateTokenId();

    // Create access token
    const accessTokenPayload: JwtPayload = {
      ...payload,
      jti
    };

    const accessToken = jwt.sign(
      accessTokenPayload,
      this.config.jwtSecret as string,
      {
        expiresIn: this.config.jwtExpiresIn as string,
        issuer: 'werewolf-game',
        audience: 'werewolf-players'
      }
    );

    // Create refresh token
    const refreshTokenPayload: RefreshTokenPayload = {
      userId: payload.userId,
      tokenFamily,
      version: 1,
      jti: refreshJti
    };

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      this.config.jwtRefreshSecret as string,
      {
        expiresIn: this.config.jwtRefreshExpiresIn as string,
        issuer: 'werewolf-game',
        audience: 'werewolf-players'
      }
    );

    // Store refresh token family information
    await this.storeRefreshTokenFamily(tokenFamily, payload.userId, 1);

    // Calculate expiration times
    const expiresIn = this.parseExpirationTime(this.config.jwtExpiresIn);
    const refreshExpiresIn = this.parseExpirationTime(this.config.jwtRefreshExpiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      refreshExpiresIn
    };
  }

  /**
   * Validate access token
   */
  async validateAccessToken(token: string): Promise<TokenValidationResult> {
    try {
      // Check if token is blacklisted
      const isBlacklisted = await this.isTokenBlacklisted(token);
      if (isBlacklisted) {
        return {
          isValid: false,
          error: 'Token is blacklisted',
          expired: false
        };
      }

      // Verify token
      const payload = jwt.verify(token, this.config.jwtSecret, {
        issuer: 'werewolf-game',
        audience: 'werewolf-players'
      }) as JwtPayload;

      return {
        isValid: true,
        payload,
        expired: false
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          isValid: false,
          error: 'Token expired',
          expired: true
        };
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return {
          isValid: false,
          error: error.message,
          expired: false
        };
      }

      return {
        isValid: false,
        error: 'Token validation failed',
        expired: false
      };
    }
  }

  /**
   * Refresh tokens with rotation
   */
  async refreshTokens(refreshToken: string, userPayload: Omit<JwtPayload, 'iat' | 'exp' | 'jti'>): Promise<TokenPair> {
    try {
      // Verify refresh token
      const payload = jwt.verify(refreshToken, this.config.jwtRefreshSecret, {
        issuer: 'werewolf-game',
        audience: 'werewolf-players'
      }) as RefreshTokenPayload;

      // Check if refresh token family is valid
      const familyVersion = await this.getRefreshTokenFamilyVersion(payload.tokenFamily);
      if (familyVersion === null || familyVersion !== payload.version) {
        // Potential token theft - invalidate entire family
        await this.invalidateTokenFamily(payload.tokenFamily);
        throw new Error('Invalid refresh token - possible theft detected');
      }

      // Check if this specific refresh token was already used
      const wasUsed = await this.wasRefreshTokenUsed(payload.jti!);
      if (wasUsed) {
        // Refresh token reuse detected - invalidate family
        await this.invalidateTokenFamily(payload.tokenFamily);
        throw new Error('Refresh token reuse detected - invalidating all tokens');
      }

      // Mark current refresh token as used
      await this.markRefreshTokenAsUsed(payload.jti!);

      // Generate new token pair with incremented version
      const newVersion = payload.version + 1;
      const newJti = this.generateTokenId();
      const newRefreshJti = this.generateTokenId();

      // Create new access token
      const accessTokenPayload: JwtPayload = {
        ...userPayload,
        jti: newJti
      };

      const accessToken = jwt.sign(
        accessTokenPayload,
        this.config.jwtSecret as string,
        {
          expiresIn: this.config.jwtExpiresIn as string,
          issuer: 'werewolf-game',
          audience: 'werewolf-players'
        }
      );

      // Create new refresh token
      const newRefreshTokenPayload: RefreshTokenPayload = {
        userId: payload.userId,
        tokenFamily: payload.tokenFamily,
        version: newVersion,
        jti: newRefreshJti
      };

      const newRefreshToken = jwt.sign(
        newRefreshTokenPayload,
        this.config.jwtRefreshSecret as string,
        {
          expiresIn: this.config.jwtRefreshExpiresIn as string,
          issuer: 'werewolf-game',
          audience: 'werewolf-players'
        }
      );

      // Update token family version
      await this.updateRefreshTokenFamilyVersion(payload.tokenFamily, newVersion);

      const expiresIn = this.parseExpirationTime(this.config.jwtExpiresIn);
      const refreshExpiresIn = this.parseExpirationTime(this.config.jwtRefreshExpiresIn);

      return {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn,
        refreshExpiresIn
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Blacklist a token (for logout)
   */
  async blacklistToken(token: string): Promise<void> {
    try {
      const decoded = jwt.decode(token) as JwtPayload;
      if (!decoded || !decoded.exp) {
        throw new Error('Invalid token format');
      }

      const tokenHash = this.hashToken(token);
      const ttl = decoded.exp - Math.floor(Date.now() / 1000);
      
      if (ttl > 0) {
        await this.redis.setex(`${this.TOKEN_BLACKLIST_PREFIX}${tokenHash}`, ttl, '1');
      }
    } catch (error) {
      throw new Error(`Failed to blacklist token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Invalidate all tokens for a user
   */
  async invalidateAllUserTokens(userId: string): Promise<void> {
    try {
      // Get all token families for this user
      const familyKeys = await this.redis.keys(`${this.TOKEN_FAMILY_PREFIX}*`);
      
      for (const key of familyKeys) {
        const familyData = await this.redis.get(key);
        if (familyData) {
          const data = JSON.parse(familyData);
          if (data.userId === userId) {
            await this.redis.del(key);
          }
        }
      }
    } catch (error) {
      throw new Error(`Failed to invalidate user tokens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if token is blacklisted
   */
  private async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const tokenHash = this.hashToken(token);
      const result = await this.redis.get(`${this.TOKEN_BLACKLIST_PREFIX}${tokenHash}`);
      return result !== null;
    } catch (error) {
      // If we can't check, assume it's not blacklisted to avoid blocking valid tokens
      return false;
    }
  }

  /**
   * Store refresh token family information
   */
  private async storeRefreshTokenFamily(tokenFamily: string, userId: string, version: number): Promise<void> {
    const familyData = {
      userId,
      version,
      createdAt: new Date().toISOString()
    };

    await this.redis.setex(
      `${this.TOKEN_FAMILY_PREFIX}${tokenFamily}`,
      this.parseExpirationTime(this.config.jwtRefreshExpiresIn),
      JSON.stringify(familyData)
    );
  }

  /**
   * Get refresh token family version
   */
  private async getRefreshTokenFamilyVersion(tokenFamily: string): Promise<number | null> {
    try {
      const familyData = await this.redis.get(`${this.TOKEN_FAMILY_PREFIX}${tokenFamily}`);
      if (!familyData) return null;

      const data = JSON.parse(familyData);
      return data.version;
    } catch (error) {
      return null;
    }
  }

  /**
   * Update refresh token family version
   */
  private async updateRefreshTokenFamilyVersion(tokenFamily: string, version: number): Promise<void> {
    const familyData = await this.redis.get(`${this.TOKEN_FAMILY_PREFIX}${tokenFamily}`);
    if (familyData) {
      const data = JSON.parse(familyData);
      data.version = version;
      data.updatedAt = new Date().toISOString();

      await this.redis.setex(
        `${this.TOKEN_FAMILY_PREFIX}${tokenFamily}`,
        this.parseExpirationTime(this.config.jwtRefreshExpiresIn),
        JSON.stringify(data)
      );
    }
  }

  /**
   * Invalidate entire token family
   */
  private async invalidateTokenFamily(tokenFamily: string): Promise<void> {
    await this.redis.del(`${this.TOKEN_FAMILY_PREFIX}${tokenFamily}`);
  }

  /**
   * Check if refresh token was already used
   */
  private async wasRefreshTokenUsed(jti: string): Promise<boolean> {
    const result = await this.redis.get(`${this.REFRESH_TOKEN_PREFIX}used:${jti}`);
    return result !== null;
  }

  /**
   * Mark refresh token as used
   */
  private async markRefreshTokenAsUsed(jti: string): Promise<void> {
    // Store for the duration of the refresh token expiry
    await this.redis.setex(
      `${this.REFRESH_TOKEN_PREFIX}used:${jti}`,
      this.parseExpirationTime(this.config.jwtRefreshExpiresIn),
      '1'
    );
  }

  /**
   * Generate unique token family identifier
   */
  private generateTokenFamily(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Generate unique token identifier
   */
  private generateTokenId(): string {
    return randomBytes(16).toString('hex');
  }

  /**
   * Hash token for blacklist storage
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Parse expiration time string to seconds
   */
  private parseExpirationTime(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match || !match[1] || !match[2]) throw new Error(`Invalid expiration format: ${expiresIn}`);

    const value = parseInt(match[1]);
    const unit = match[2];

    const multipliers = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400
    };

    return value * multipliers[unit as keyof typeof multipliers];
  }
}