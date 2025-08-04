import { chromium, FullConfig } from '@playwright/test';

/**
 * Global setup for Werewolf Game E2E tests
 * Initializes test environment and prepares test data
 */
async function globalSetup(config: FullConfig) {
  // eslint-disable-next-line no-console
  console.log('🌕 Setting up Werewolf Game E2E test environment...');

  // Create a browser instance for setup operations
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Wait for the application to be ready
    const baseURL = config.projects[0]?.use?.baseURL || 'http://localhost:3000';

    // Check if the application is running
    await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Verify the werewolf game is accessible
    await page.waitForSelector('body', { timeout: 10000 });

    // Set up test data or authentication if needed
    // This could include creating test users, games, etc.

    // eslint-disable-next-line no-console
    console.log('✅ Werewolf Game E2E environment ready');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to set up Werewolf Game E2E environment:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
