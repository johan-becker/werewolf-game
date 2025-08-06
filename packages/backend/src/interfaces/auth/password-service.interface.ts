/**
 * Password Service Interface
 */

export interface IPasswordService {
  /**
   * Hash a password using Argon2id
   */
  hashPassword(password: string): Promise<string>;

  /**
   * Verify a password against its hash
   */
  verifyPassword(hashedPassword: string, plainPassword: string): Promise<boolean>;

  /**
   * Check if password needs rehashing
   */
  needsRehash(hashedPassword: string): Promise<boolean>;

  /**
   * Generate a secure random password
   */
  generateSecurePassword(length?: number): string;

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    score: number;
    feedback: string[];
  };
}
