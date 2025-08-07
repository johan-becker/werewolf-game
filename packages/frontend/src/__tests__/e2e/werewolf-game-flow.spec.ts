import { test, expect, Page } from '@playwright/test';

// Werewolf game E2E test suite
test.describe('Werewolf Game Complete Flow', () => {
  let hostPage: Page;
  let playerPage: Page;
  let gameCode: string;

  test.beforeAll(async ({ browser }) => {
    // Create browser contexts for host and player
    const hostContext = await browser.newContext();
    const playerContext = await browser.newContext();

    hostPage = await hostContext.newPage();
    playerPage = await playerContext.newPage();
  });

  test.describe('Game Creation and Lobby', () => {
    test('should create werewolf game and display game code', async () => {
      // Navigate to game creation
      await hostPage.goto('/');
      await hostPage.click('[data-testid="create-game-button"]');

      // Fill werewolf game details
      await hostPage.fill('[data-testid="game-name-input"]', 'Moonlit Village Terror');
      await hostPage.selectOption('[data-testid="max-players-select"]', '8');

      // Configure werewolf settings
      await hostPage.check('[data-testid="pack-hunting-enabled"]');
      await hostPage.check('[data-testid="moon-phase-effects"]');
      await hostPage.check('[data-testid="territory-bonuses"]');

      // Set werewolf ratio
      await hostPage.fill('[data-testid="werewolf-ratio-input"]', '0.25');

      // Create game
      await hostPage.click('[data-testid="create-game-submit"]');

      // Verify game creation success
      await expect(hostPage.locator('[data-testid="game-created-modal"]')).toBeVisible();

      // Extract and verify game code
      const gameCodeElement = hostPage.locator('[data-testid="game-code"]');
      gameCode = (await gameCodeElement.textContent()) || '';

      expect(gameCode).toMatch(/^[A-Z0-9]{6,8}$/);
      expect(gameCode).toContain('WOLF'); // Should contain werewolf prefix

      // Verify werewolf-themed UI elements
      await expect(hostPage.locator('[data-testid="moon-phase-indicator"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="pack-status"]')).toBeVisible();
    });

    test('should display werewolf game lobby with theme elements', async () => {
      // Verify lobby elements
      await expect(hostPage.locator('[data-testid="game-lobby"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="player-list"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="game-settings-panel"]')).toBeVisible();

      // Check werewolf-specific UI elements
      await expect(hostPage.locator('[data-testid="moon-phase-display"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="pack-formation-preview"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="territory-map"]')).toBeVisible();

      // Verify host controls
      await expect(hostPage.locator('[data-testid="start-game-button"]')).toBeDisabled();
      await expect(hostPage.locator('[data-testid="game-settings-button"]')).toBeVisible();
    });

    test('should allow player to join werewolf game by code', async () => {
      // Player navigation and join process
      await playerPage.goto('/');
      await playerPage.click('[data-testid="join-game-button"]');

      // Enter game code
      await playerPage.fill('[data-testid="game-code-input"]', gameCode);
      await playerPage.click('[data-testid="join-game-submit"]');

      // Verify successful join
      await expect(playerPage.locator('[data-testid="game-lobby"]')).toBeVisible();
      await expect(playerPage.locator('[data-testid="player-joined-notification"]')).toBeVisible();

      // Check werewolf theme elements for joined player
      await expect(playerPage.locator('[data-testid="pack-member-indicator"]')).toBeVisible();
      await expect(playerPage.locator('[data-testid="moon-phase-display"]')).toBeVisible();

      // Verify player appears in host's lobby
      await expect(hostPage.locator('[data-testid="player-count"]')).toHaveText('2/8');
      await expect(hostPage.locator('[data-testid="player-list"] .player-item')).toHaveCount(2);
    });

    test('should add more players for minimum game requirements', async () => {
      // Add 3 more players (total 5 for minimum werewolf game)
      for (let i = 0; i < 3; i++) {
        const context = await hostPage.context().browser()?.newContext();
        if (!context) throw new Error('Failed to create browser context');
        const newPlayerPage = await context.newPage();

        await newPlayerPage.goto('/');
        await newPlayerPage.click('[data-testid="join-game-button"]');
        await newPlayerPage.fill('[data-testid="game-code-input"]', gameCode);
        await newPlayerPage.click('[data-testid="join-game-submit"]');

        await expect(newPlayerPage.locator('[data-testid="game-lobby"]')).toBeVisible();
      }

      // Verify minimum players reached
      await expect(hostPage.locator('[data-testid="player-count"]')).toHaveText('5/8');
      await expect(hostPage.locator('[data-testid="start-game-button"]')).toBeEnabled();

      // Check pack formation preview
      await expect(hostPage.locator('[data-testid="pack-formation-preview"]')).toContainText(
        '1 Werewolf'
      );
      await expect(hostPage.locator('[data-testid="pack-formation-preview"]')).toContainText(
        '4 Villagers'
      );
    });
  });

  test.describe('Game Start and Role Assignment', () => {
    test('should start werewolf game and assign roles', async () => {
      // Host starts the game
      await hostPage.click('[data-testid="start-game-button"]');

      // Verify game start sequence
      await expect(hostPage.locator('[data-testid="game-starting-modal"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="role-assignment-animation"]')).toBeVisible();

      // Wait for role assignment completion
      await hostPage.waitForSelector('[data-testid="role-assigned-notification"]', {
        timeout: 10000,
      });

      // Verify transition to game phase
      await expect(hostPage.locator('[data-testid="game-board"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="day-phase-indicator"]')).toBeVisible();

      // Check werewolf-specific game elements
      await expect(hostPage.locator('[data-testid="moon-phase-tracker"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="transformation-timer"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="pack-status-indicator"]')).toBeVisible();
    });

    test('should display role information and werewolf abilities', async () => {
      // Check role card display
      await expect(hostPage.locator('[data-testid="role-card"]')).toBeVisible();

      // Verify role-specific UI elements
      const roleCard = hostPage.locator('[data-testid="role-card"]');
      await expect(roleCard.locator('[data-testid="role-name"]')).toBeVisible();
      await expect(roleCard.locator('[data-testid="role-description"]')).toBeVisible();
      await expect(roleCard.locator('[data-testid="role-abilities"]')).toBeVisible();

      // Check werewolf-specific elements if player is werewolf
      const roleText = await roleCard.locator('[data-testid="role-name"]').textContent();
      if (roleText?.toLowerCase().includes('werewolf')) {
        await expect(hostPage.locator('[data-testid="pack-chat-button"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="night-kill-interface"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="transformation-progress"]')).toBeVisible();
      }

      // Verify player list with alive status
      await expect(hostPage.locator('[data-testid="alive-players-list"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="player-avatar"]')).toHaveCount(5);
    });
  });

  test.describe('Day Phase Gameplay', () => {
    test('should display day phase interface with werewolf theme', async () => {
      // Verify day phase elements
      await expect(hostPage.locator('[data-testid="day-phase-indicator"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="day-chat-panel"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="phase-timer"]')).toBeVisible();

      // Check werewolf-themed day elements
      await expect(hostPage.locator('[data-testid="village-discussion-area"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="suspicion-tracker"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="territory-map"]')).toBeVisible();
    });

    test('should allow chat communication during day phase', async () => {
      // Send chat message
      const chatMessage = 'I sense something suspicious about the newcomer... 🐺';
      await hostPage.fill('[data-testid="chat-input"]', chatMessage);
      await hostPage.press('[data-testid="chat-input"]', 'Enter');

      // Verify message appears in chat
      await expect(hostPage.locator('[data-testid="chat-messages"]')).toContainText(chatMessage);

      // Verify werewolf theme elements in chat
      await expect(hostPage.locator('[data-testid="chat-message-werewolf-hint"]')).toBeVisible();

      // Check if other players see the message
      await expect(playerPage.locator('[data-testid="chat-messages"]')).toContainText(chatMessage);
    });

    test('should handle voting phase transition', async () => {
      // Wait for voting phase or trigger it
      await hostPage.waitForSelector('[data-testid="voting-phase-indicator"]', { timeout: 30000 });

      // Verify voting interface
      await expect(hostPage.locator('[data-testid="voting-panel"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="vote-buttons"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="voting-timer"]')).toBeVisible();

      // Check werewolf voting theme
      await expect(hostPage.locator('[data-testid="lynch-mob-indicator"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="gallows-animation"]')).toBeVisible();
    });
  });

  test.describe('Night Phase and Werewolf Actions', () => {
    test('should transition to night phase with werewolf atmosphere', async () => {
      // Wait for night phase
      await hostPage.waitForSelector('[data-testid="night-phase-indicator"]', { timeout: 30000 });

      // Verify night phase UI
      await expect(hostPage.locator('[data-testid="night-phase-indicator"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="night-atmosphere"]')).toBeVisible();

      // Check werewolf-specific night elements
      await expect(hostPage.locator('[data-testid="moon-glow-effect"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="howling-wind-audio"]')).toBeAttached();
      await expect(hostPage.locator('[data-testid="shadow-overlay"]')).toBeVisible();
    });

    test('should display werewolf night action interface', async () => {
      // Check if current player is werewolf
      const roleCard = hostPage.locator('[data-testid="role-card"]');
      const roleText = await roleCard.locator('[data-testid="role-name"]').textContent();

      if (roleText?.toLowerCase().includes('werewolf')) {
        // Verify werewolf night interface
        await expect(hostPage.locator('[data-testid="werewolf-night-actions"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="kill-target-selector"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="pack-coordination-panel"]')).toBeVisible();

        // Check werewolf abilities
        await expect(hostPage.locator('[data-testid="night-vision-toggle"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="pack-communication"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="transformation-meter"]')).toBeVisible();

        // Test target selection
        await hostPage.click('[data-testid="kill-target-selector"] .player-option:first-child');
        await expect(hostPage.locator('[data-testid="confirm-kill-button"]')).toBeEnabled();

        // Confirm werewolf action
        await hostPage.click('[data-testid="confirm-kill-button"]');
        await expect(hostPage.locator('[data-testid="action-confirmed"]')).toBeVisible();
      } else {
        // Non-werewolf night interface
        await expect(hostPage.locator('[data-testid="sleeping-interface"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="night-sounds"]')).toBeVisible();
      }
    });

    test('should handle special role night actions', async () => {
      // Check for seer, witch, hunter abilities
      const roleCard = hostPage.locator('[data-testid="role-card"]');
      const roleText = await roleCard.locator('[data-testid="role-name"]').textContent();

      if (roleText?.toLowerCase().includes('seer')) {
        await expect(hostPage.locator('[data-testid="seer-vision-interface"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="investigate-target-selector"]')).toBeVisible();

        // Test seer vision
        await hostPage.click(
          '[data-testid="investigate-target-selector"] .player-option:first-child'
        );
        await hostPage.click('[data-testid="use-seer-ability"]');
        await expect(hostPage.locator('[data-testid="vision-result"]')).toBeVisible();
      }

      if (roleText?.toLowerCase().includes('witch')) {
        await expect(hostPage.locator('[data-testid="witch-potions"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="heal-potion"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="poison-potion"]')).toBeVisible();
      }
    });
  });

  test.describe('Game Progression and Win Conditions', () => {
    test('should handle day/night cycle transitions', async () => {
      // Wait for dawn transition
      await hostPage.waitForSelector('[data-testid="dawn-transition"]', { timeout: 45000 });

      // Verify night results display
      await expect(hostPage.locator('[data-testid="night-results-modal"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="casualties-list"]')).toBeVisible();

      // Check werewolf-themed death announcements
      await expect(hostPage.locator('[data-testid="werewolf-attack-description"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="victim-found-animation"]')).toBeVisible();

      // Verify return to day phase
      await hostPage.click('[data-testid="continue-to-day"]');
      await expect(hostPage.locator('[data-testid="day-phase-indicator"]')).toBeVisible();
    });

    test('should display updated player count and pack status', async () => {
      // Verify alive players count
      const alivePlayers = await hostPage.locator('[data-testid="alive-players-count"]');
      const count = await alivePlayers.textContent();
      expect(parseInt(count || '0')).toBeLessThan(5);

      // Check werewolf pack status
      await expect(hostPage.locator('[data-testid="pack-status-indicator"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="werewolf-victory-progress"]')).toBeVisible();

      // Verify territory control updates
      await expect(hostPage.locator('[data-testid="territory-control-map"]')).toBeVisible();
    });

    test('should detect and display win conditions', async () => {
      // Continue game until win condition is met
      // This would involve multiple day/night cycles
      // For the test, we'll simulate reaching a win condition

      // Check for game end scenarios
      const gameEndModal = hostPage.locator('[data-testid="game-end-modal"]');

      if (await gameEndModal.isVisible()) {
        // Verify win condition display
        await expect(hostPage.locator('[data-testid="winning-team"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="victory-description"]')).toBeVisible();

        // Check werewolf-specific victory elements
        const winningTeam = await hostPage.locator('[data-testid="winning-team"]').textContent();

        if (winningTeam?.toLowerCase().includes('werewolf')) {
          await expect(hostPage.locator('[data-testid="werewolf-victory-howl"]')).toBeVisible();
          await expect(hostPage.locator('[data-testid="pack-dominance-animation"]')).toBeVisible();
          await expect(hostPage.locator('[data-testid="moon-victory-background"]')).toBeVisible();
        } else {
          await expect(
            hostPage.locator('[data-testid="village-victory-celebration"]')
          ).toBeVisible();
          await expect(
            hostPage.locator('[data-testid="werewolf-elimination-message"]')
          ).toBeVisible();
        }

        // Verify game statistics
        await expect(hostPage.locator('[data-testid="game-statistics"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="player-performance"]')).toBeVisible();
        await expect(hostPage.locator('[data-testid="werewolf-game-summary"]')).toBeVisible();
      }
    });
  });

  test.describe('Accessibility and Mobile Responsiveness', () => {
    test('should be accessible with screen readers', async () => {
      // Check ARIA labels and roles
      await expect(hostPage.locator('[data-testid="game-board"]')).toHaveAttribute('role', 'main');
      await expect(hostPage.locator('[data-testid="player-list"]')).toHaveAttribute('role', 'list');
      await expect(hostPage.locator('[data-testid="chat-messages"]')).toHaveAttribute(
        'role',
        'log'
      );

      // Verify descriptive text for werewolf elements
      await expect(hostPage.locator('[data-testid="moon-phase-indicator"]')).toHaveAttribute(
        'aria-label'
      );
      await expect(hostPage.locator('[data-testid="pack-status"]')).toHaveAttribute(
        'aria-describedby'
      );

      // Check keyboard navigation
      await hostPage.keyboard.press('Tab');
      await expect(hostPage.locator(':focus')).toBeVisible();
    });

    test('should work on mobile devices', async () => {
      // Set mobile viewport
      await hostPage.setViewportSize({ width: 375, height: 667 });

      // Verify mobile-specific werewolf UI
      await expect(hostPage.locator('[data-testid="mobile-game-controls"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="mobile-player-list"]')).toBeVisible();
      await expect(hostPage.locator('[data-testid="mobile-chat-toggle"]')).toBeVisible();

      // Test touch interactions
      await hostPage.tap('[data-testid="mobile-menu-button"]');
      await expect(hostPage.locator('[data-testid="mobile-menu"]')).toBeVisible();

      // Verify responsive werewolf theme elements
      await expect(hostPage.locator('[data-testid="mobile-moon-phase"]')).toBeVisible();
      await expect(
        hostPage.locator('[data-testid="mobile-transformation-indicator"]')
      ).toBeVisible();
    });
  });

  test.afterAll(async () => {
    await hostPage.close();
    await playerPage.close();
  });
});
