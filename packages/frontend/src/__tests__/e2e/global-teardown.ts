import { FullConfig } from '@playwright/test';

/**
 * Global teardown for Werewolf Game E2E tests
 * Cleans up test environment and data
 */
async function globalTeardown(config: FullConfig) {
  // eslint-disable-next-line no-console
  console.log('🌑 Tearing down Werewolf Game E2E test environment...');

  try {
    // Clean up test data
    // This could include:
    // - Removing test users
    // - Cleaning up test games
    // - Resetting database state
    // - Clearing any temporary files
    
    // For now, just log completion
    // eslint-disable-next-line no-console
    console.log('✅ Werewolf Game E2E environment cleaned up');
    
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Error during E2E teardown:', error);
    // Don't throw here as we don't want to fail tests due to cleanup issues
  }
}

export default globalTeardown;