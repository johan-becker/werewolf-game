/**
 * Password Service using Argon2
 * Secure password hashing and verification
 */

import { injectable, inject } from 'inversify';
import * as argon2 from 'argon2';
import { IPasswordService } from '../../interfaces/auth/password-service.interface';
import { IAppConfig } from '../../interfaces/config/app-config.interface';
import { TYPES } from '../../container/types';

@injectable()
export class PasswordService implements IPasswordService {
  constructor(@inject(TYPES.AppConfig) private readonly config: IAppConfig) {}

  /**
   * Hash a password using Argon2id
   */
  async hashPassword(password: string): Promise<string> {
    try {
      return await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: this.config.argon2Memory,
        timeCost: this.config.argon2Time,
        parallelism: this.config.argon2Parallelism,
        hashLength: 32, // 32-byte hash
        saltLength: 16, // 16-byte salt
      });
    } catch (error) {
      throw new Error(
        `Failed to hash password: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Verify a password against its hash
   */
  async verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (error) {
      // Log the error but don't expose it to prevent timing attacks
      console.error('Password verification error:', error);
      return false;
    }
  }

  /**
   * Check if password needs rehashing (for security upgrades)
   */
  async needsRehash(hashedPassword: string): Promise<boolean> {
    try {
      return argon2.needsRehash(hashedPassword, {
        type: argon2.argon2id,
        memoryCost: this.config.argon2Memory,
        timeCost: this.config.argon2Time,
        parallelism: this.config.argon2Parallelism,
      });
    } catch (error) {
      // If we can't determine, assume it needs rehashing for safety
      return true;
    }
  }

  /**
   * Generate a secure random password
   */
  generateSecurePassword(length: number = 16): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';

    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password;
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;

    // Check length
    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
    } else if (password.length >= 12) {
      score += 2;
    } else {
      score += 1;
    }

    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain lowercase letters');
    }

    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain uppercase letters');
    }

    // Check for numbers
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain numbers');
    }

    // Check for special characters
    if (/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('Password should contain special characters');
    }

    // Check for common patterns
    if (this.hasCommonPatterns(password)) {
      score -= 2;
      feedback.push('Password contains common patterns');
    }

    // Check for repeated characters
    if (this.hasRepeatedCharacters(password)) {
      score -= 1;
      feedback.push('Password has too many repeated characters');
    }

    const isValid = score >= 4 && password.length >= 8;

    return {
      isValid,
      score: Math.max(0, Math.min(10, score)),
      feedback,
    };
  }

  /**
   * Check for common password patterns
   */
  private hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i,
      /login/i,
      /welcome/i,
      /letmein/i,
    ];

    return commonPatterns.some(pattern => pattern.test(password));
  }

  /**
   * Check for repeated characters
   */
  private hasRepeatedCharacters(password: string): boolean {
    const threshold = Math.floor(password.length / 3);
    const charCounts: { [key: string]: number } = {};

    for (const char of password.toLowerCase()) {
      charCounts[char] = (charCounts[char] || 0) + 1;
      if (charCounts[char] > threshold) {
        return true;
      }
    }

    return false;
  }
}
