/**
 * Generates a unique 6-character game code
 * Uses uppercase letters and numbers, excluding ambiguous characters
 */
export function generateGameCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excludes I,O,0,1
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/**
 * Validates game code format
 */
export function isValidGameCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(code) && !/[IO01]/.test(code);
}