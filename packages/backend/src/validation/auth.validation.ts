/**
 * Authentication Request Validation Schemas
 * Using Zod for comprehensive request validation
 */

import { z } from 'zod';

// Password validation with strength requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .refine((password) => {
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) return false;
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) return false;
    // Check for at least one number
    if (!/\d/.test(password)) return false;
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(password)) return false;
    return true;
  }, 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character');

// Username validation
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters long')
  .max(20, 'Username must not exceed 20 characters')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
  .refine((username) => {
    // Prevent common inappropriate usernames
    const forbiddenUsernames = ['admin', 'root', 'moderator', 'system', 'null', 'undefined'];
    return !forbiddenUsernames.includes(username.toLowerCase());
  }, 'Username is not allowed');

// Email validation
const emailSchema = z
  .string()
  .email('Invalid email format')
  .max(254, 'Email must not exceed 254 characters')
  .toLowerCase();

// Registration validation schema
export const registerSchema = z.object({
  body: z.object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    fullName: z.string()
      .min(2, 'Full name must be at least 2 characters long')
      .max(100, 'Full name must not exceed 100 characters')
      .optional(),
    preferredRole: z.nativeEnum(WerewolfRole).optional(),
    agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions')
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
});

// Login validation schema
export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false)
  })
});

// Alternative login with username
export const loginWithUsernameSchema = z.object({
  body: z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional().default(false)
  })
});

// Token refresh validation schema
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
});

// Password reset request validation schema
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema
  })
});

// Password reset validation schema
export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string()
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
});

// Change password validation schema
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string()
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword']
  }).refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword']
  })
});

// Update profile validation schema
export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string()
      .min(2, 'Full name must be at least 2 characters long')
      .max(100, 'Full name must not exceed 100 characters')
      .optional(),
    username: usernameSchema.optional(),
    email: emailSchema.optional(),
    preferredRole: z.nativeEnum(WerewolfRole).optional(),
    bio: z.string()
      .max(500, 'Bio must not exceed 500 characters')
      .optional(),
    timezone: z.string()
      .max(50, 'Timezone must not exceed 50 characters')
      .optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      gameInvites: z.boolean().optional(),
      packActivity: z.boolean().optional()
    }).optional()
  }).refine((data) => {
    // At least one field must be provided for update
    return Object.keys(data).length > 0;
  }, {
    message: 'At least one field must be provided for update'
  })
});

// Two-factor authentication setup validation schema
export const setupTwoFactorSchema = z.object({
  body: z.object({
    secret: z.string().min(1, 'Secret is required'),
    token: z.string().length(6, 'Token must be 6 digits').regex(/^\d+$/, 'Token must contain only numbers')
  })
});

// Two-factor authentication verification schema
export const verifyTwoFactorSchema = z.object({
  body: z.object({
    token: z.string().length(6, 'Token must be 6 digits').regex(/^\d+$/, 'Token must contain only numbers')
  })
});

// Account deletion validation schema
export const deleteAccountSchema = z.object({
  body: z.object({
    password: z.string().min(1, 'Password is required'),
    confirmDeletion: z.string().refine(val => val === 'DELETE', 'You must type "DELETE" to confirm account deletion'),
    reason: z.string()
      .max(500, 'Reason must not exceed 500 characters')
      .optional()
  })
});

// Session management validation schema
export const revokeSessionSchema = z.object({
  body: z.object({
    sessionId: z.string().min(1, 'Session ID is required')
  })
});

// Export types for TypeScript
export type RegisterRequest = z.infer<typeof registerSchema>['body'];
export type LoginRequest = z.infer<typeof loginSchema>['body'];
export type LoginWithUsernameRequest = z.infer<typeof loginWithUsernameSchema>['body'];
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>['body'];
export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>['body'];
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>['body'];
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>['body'];
export type SetupTwoFactorRequest = z.infer<typeof setupTwoFactorSchema>['body'];
export type VerifyTwoFactorRequest = z.infer<typeof verifyTwoFactorSchema>['body'];
export type DeleteAccountRequest = z.infer<typeof deleteAccountSchema>['body'];
export type RevokeSessionRequest = z.infer<typeof revokeSessionSchema>['body'];