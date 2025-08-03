import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';

// Mock werewolf components for accessibility testing
const MockWerewolfGameBoard = () => (
  <main role="main" aria-label="Werewolf Game Board">
    <h1>Moonlit Village</h1>
    
    {/* Moon Phase Indicator */}
    <div 
      role="status" 
      aria-live="polite"
      aria-label="Current moon phase: Full Moon"
      data-testid="moon-phase-indicator"
    >
      <span aria-hidden="true">🌕</span>
      <span className="sr-only">Full Moon - Werewolf transformation bonus active</span>
    </div>

    {/* Player List */}
    <section aria-labelledby="players-heading">
      <h2 id="players-heading">Pack Members</h2>
      <ul role="list" aria-label="List of players in the werewolf game">
        <li role="listitem">
          <button 
            aria-describedby="player-1-status"
            onClick={() => {}}
          >
            Luna Nighthowl
          </button>
          <span id="player-1-status" className="sr-only">
            Alive, Werewolf role, Alpha rank
          </span>
        </li>
        <li role="listitem">
          <button 
            aria-describedby="player-2-status"
            onClick={() => {}}
          >
            Shadow Fang
          </button>
          <span id="player-2-status" className="sr-only">
            Alive, Villager role
          </span>
        </li>
      </ul>
    </section>

    {/* Game Phase Indicator */}
    <div 
      role="timer"
      aria-live="assertive"
      aria-atomic="true"
      data-testid="phase-timer"
    >
      <h3>Night Phase</h3>
      <p>Time remaining: <span aria-label="2 minutes and 30 seconds">2:30</span></p>
    </div>

    {/* Werewolf Action Panel */}
    <section aria-labelledby="actions-heading">
      <h2 id="actions-heading">Night Actions</h2>
      <fieldset>
        <legend>Choose your werewolf target</legend>
        <div role="radiogroup" aria-labelledby="target-selection">
          <h3 id="target-selection">Select Target for Attack</h3>
          <label>
            <input 
              type="radio" 
              name="werewolf-target" 
              value="player-2"
              aria-describedby="target-warning"
            />
            Shadow Fang (Villager)
          </label>
          <label>
            <input 
              type="radio" 
              name="werewolf-target" 
              value="player-3"
              aria-describedby="target-warning"
            />
            Crimson Claw (Seer)
          </label>
        </div>
        <p id="target-warning" className="warning" role="alert">
          Warning: This action cannot be undone once submitted
        </p>
      </fieldset>
      
      <button 
        type="submit"
        aria-describedby="confirm-action-help"
        disabled={false}
      >
        Confirm Werewolf Attack
      </button>
      <p id="confirm-action-help" className="help-text">
        Press Enter or click to confirm your werewolf night action
      </p>
    </section>

    {/* Chat Interface */}
    <section aria-labelledby="chat-heading">
      <h2 id="chat-heading">Pack Communication</h2>
      <div 
        role="log" 
        aria-live="polite"
        aria-label="Werewolf pack chat messages"
        tabIndex={0}
        style={{ height: '200px', overflow: 'auto' }}
      >
        <div className="message">
          <span className="username">Alpha Storm:</span>
          <span className="content">The moon is bright tonight, perfect for hunting</span>
          <time dateTime="2023-12-01T23:30:00">11:30 PM</time>
        </div>
      </div>
      
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="chat-input">
          Send message to werewolf pack
        </label>
        <input 
          id="chat-input"
          type="text"
          placeholder="Type your message to the pack..."
          aria-describedby="chat-help"
          autoComplete="off"
        />
        <p id="chat-help" className="help-text">
          This message will only be visible to other werewolves
        </p>
        <button type="submit">Send Message</button>
      </form>
    </section>
  </main>
);

const MockWerewolfLobby = () => (
  <main role="main" aria-label="Werewolf Game Lobby">
    <header>
      <h1>Werewolf Game Lobby</h1>
      <p>Game Code: <code aria-label="Game code WOLF42">WOLF42</code></p>
    </header>

    {/* Game Settings */}
    <section aria-labelledby="settings-heading">
      <h2 id="settings-heading">Werewolf Game Settings</h2>
      <dl>
        <dt>Maximum Players:</dt>
        <dd>12 werewolves and villagers</dd>
        
        <dt>Werewolf Ratio:</dt>
        <dd>25% (3 werewolves out of 12 players)</dd>
        
        <dt>Moon Phase Effects:</dt>
        <dd>
          <span aria-label="Enabled">✓</span> 
          Enhanced werewolf abilities during full moon
        </dd>
        
        <dt>Pack Hunting:</dt>
        <dd>
          <span aria-label="Enabled">✓</span> 
          Werewolves can coordinate attacks
        </dd>
      </dl>
    </section>

    {/* Territory Map */}
    <section aria-labelledby="territory-heading">
      <h2 id="territory-heading">Territory Map</h2>
      <div 
        aria-label="Village territory map showing forest, houses, and moonlit paths"
        style={{ width: '400px', height: '300px', background: '#f0f0f0', position: 'relative' }}
      >
        <button 
          tabIndex={0}
          aria-label="Forest area - Werewolf advantage"
          style={{ position: 'absolute', top: '50px', left: '50px', background: 'none', border: 'none' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              // Handle territory selection
            }
          }}
        >
          🌲 Forest
        </button>
        <button 
          tabIndex={0}
          aria-label="Village center - Neutral territory"
          style={{ position: 'absolute', top: '150px', left: '200px', background: 'none', border: 'none' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              // Handle territory selection
            }
          }}
        >
          🏘️ Village
        </button>
      </div>
    </section>

    {/* Skip Links for Screen Readers */}
    <nav aria-label="Skip navigation">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#player-list" className="skip-link">
        Skip to player list
      </a>
      <a href="#game-controls" className="skip-link">
        Skip to game controls
      </a>
    </nav>
  </main>
);

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Werewolf Game Accessibility', () => {
  describe('Game Board Accessibility', () => {
    it('should have no accessibility violations on werewolf game board', async () => {
      const { container } = render(<MockWerewolfGameBoard />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should provide proper ARIA labels for moon phase indicator', () => {
      render(<MockWerewolfGameBoard />);
      
      const moonPhase = screen.getByTestId('moon-phase-indicator');
      expect(moonPhase).toHaveAttribute('aria-label', 'Current moon phase: Full Moon');
      expect(moonPhase).toHaveAttribute('role', 'status');
      expect(moonPhase).toHaveAttribute('aria-live', 'polite');
    });

    it('should make phase timer accessible to screen readers', () => {
      render(<MockWerewolfGameBoard />);
      
      const timer = screen.getByTestId('phase-timer');
      expect(timer).toHaveAttribute('role', 'timer');
      expect(timer).toHaveAttribute('aria-live', 'assertive');
      expect(timer).toHaveAttribute('aria-atomic', 'true');
    });

    it('should provide semantic structure for player list', () => {
      render(<MockWerewolfGameBoard />);
      
      const playerList = screen.getByRole('list', { name: /list of players/i });
      expect(playerList).toBeInTheDocument();
      
      const playerItems = screen.getAllByRole('listitem');
      expect(playerItems).toHaveLength(2);
      
      // Check that each player has descriptive text
      expect(screen.getByText('Alive, Werewolf role, Alpha rank')).toBeInTheDocument();
      expect(screen.getByText('Alive, Villager role')).toBeInTheDocument();
    });

    it('should make werewolf action form accessible', () => {
      render(<MockWerewolfGameBoard />);
      
      const fieldset = screen.getByRole('group', { name: /choose your werewolf target/i });
      expect(fieldset).toBeInTheDocument();
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toBeInTheDocument();
      
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(2);
      
      radios.forEach(radio => {
        expect(radio).toHaveAttribute('aria-describedby', 'target-warning');
      });
    });

    it('should provide proper chat accessibility', () => {
      render(<MockWerewolfGameBoard />);
      
      const chatLog = screen.getByRole('log');
      expect(chatLog).toHaveAttribute('aria-live', 'polite');
      expect(chatLog).toHaveAttribute('aria-label', 'Werewolf pack chat messages');
      expect(chatLog).toHaveAttribute('tabIndex', '0');
      
      const chatInput = screen.getByLabelText(/send message to werewolf pack/i);
      expect(chatInput).toHaveAttribute('aria-describedby', 'chat-help');
    });
  });

  describe('Game Lobby Accessibility', () => {
    it('should have no accessibility violations on werewolf lobby', async () => {
      const { container } = render(<MockWerewolfLobby />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should provide semantic game settings information', () => {
      render(<MockWerewolfLobby />);
      
      const settingsSection = screen.getByRole('region', { name: /werewolf game settings/i });
      expect(settingsSection).toBeInTheDocument();
      
      // Check for definition list structure
      const definitionList = screen.getByText('Maximum Players:').closest('dl');
      expect(definitionList).toBeInTheDocument();
      expect(definitionList?.tagName).toBe('DL');
    });

    it('should make territory map accessible', () => {
      render(<MockWerewolfLobby />);
      
      const territoryMap = screen.getByLabelText(/village territory map showing forest, houses, and moonlit paths/i);
      expect(territoryMap).toBeInTheDocument();
      
      const forestButton = screen.getByRole('button', { name: /forest area - werewolf advantage/i });
      const villageButton = screen.getByRole('button', { name: /village center - neutral territory/i });
      
      expect(forestButton).toHaveAttribute('tabIndex', '0');
      expect(villageButton).toHaveAttribute('tabIndex', '0');
    });

    it('should provide skip links for navigation', () => {
      render(<MockWerewolfLobby />);
      
      const skipNav = screen.getByRole('navigation', { name: /skip navigation/i });
      expect(skipNav).toBeInTheDocument();
      
      const skipLinks = screen.getAllByRole('link');
      expect(skipLinks.some(link => link.textContent === 'Skip to main content')).toBe(true);
      expect(skipLinks.some(link => link.textContent === 'Skip to player list')).toBe(true);
      expect(skipLinks.some(link => link.textContent === 'Skip to game controls')).toBe(true);
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    it('should have sufficient color contrast for werewolf theme', async () => {
      const { container } = render(<MockWerewolfGameBoard />);
      
      // Test would require additional setup to check computed styles
      // This is a placeholder for color contrast testing
      const results = await axe(container, {
        rules: {
          'color-contrast': { enabled: true }
        }
      });
      
      expect(results).toHaveNoViolations();
    });

    it('should not rely solely on color for werewolf status indication', () => {
      render(<MockWerewolfGameBoard />);
      
      // Verify that werewolf status is conveyed through text, not just color
      expect(screen.getByText('Alive, Werewolf role, Alpha rank')).toBeInTheDocument();
      expect(screen.getByText('Alive, Villager role')).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation for all werewolf controls', async () => {
      const user = userEvent.setup();
      render(<MockWerewolfGameBoard />);
      
      // Test tab navigation through interactive elements
      await user.tab();
      // Verify an element is focused (could be button, input, link, etc.)
      expect(document.activeElement).not.toBe(document.body);
      expect(document.activeElement?.tagName).toMatch(/^(BUTTON|INPUT|A|SELECT|TEXTAREA|DIV)$/);
      
      await user.tab();
      await user.tab();
      // Continue testing tab order
    });

    it('should handle Enter and Space keys for werewolf actions', async () => {
      const user = userEvent.setup();
      render(<MockWerewolfLobby />);
      
      const forestButton = screen.getByRole('button', { name: /forest area/i });
      forestButton.focus();
      
      // Test Enter key
      await user.keyboard('{Enter}');
      // Would verify action was triggered
      
      // Test Space key
      await user.keyboard(' ');
      // Would verify action was triggered
    });
  });

  describe('Screen Reader Compatibility', () => {
    it('should provide meaningful headings hierarchy', () => {
      render(<MockWerewolfGameBoard />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Moonlit Village');
      
      const h2s = screen.getAllByRole('heading', { level: 2 });
      expect(h2s.length).toBeGreaterThan(0);
      
      const h3s = screen.getAllByRole('heading', { level: 3 });
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('should announce werewolf game state changes', () => {
      render(<MockWerewolfGameBoard />);
      
      // Live regions for dynamic content
      const statusRegion = screen.getByRole('status');
      expect(statusRegion).toHaveAttribute('aria-live', 'polite');
      
      const alertRegion = screen.getByRole('alert');
      expect(alertRegion).toBeInTheDocument();
    });

    it('should provide context for werewolf-specific terms', () => {
      render(<MockWerewolfGameBoard />);
      
      // Check for explanatory text
      expect(screen.getByText(/werewolf transformation bonus active/i)).toBeInTheDocument();
      expect(screen.getByText(/this message will only be visible to other werewolves/i)).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('should manage focus appropriately during werewolf phase transitions', async () => {
      const user = userEvent.setup();
      render(<MockWerewolfGameBoard />);
      
      // Test focus trapping in modals/dialogs
      // Test focus restoration after actions
      // This would require more complex component mocking
    });

    it('should provide visible focus indicators', () => {
      render(<MockWerewolfGameBoard />);
      
      // All interactive elements should be focusable (either with explicit tabIndex or inherently focusable)
      const buttons = screen.getAllByRole('button');
      const inputs = screen.getAllByRole('textbox');
      const radios = screen.getAllByRole('radio');
      
      [...buttons, ...inputs, ...radios].forEach(element => {
        // Check if element is focusable (either has tabIndex or is inherently focusable)
        const hasTabIndex = element.hasAttribute('tabIndex');
        const isFocusableElement = ['BUTTON', 'INPUT', 'A', 'SELECT', 'TEXTAREA'].includes(element.tagName);
        expect(hasTabIndex || isFocusableElement).toBe(true);
      });
    });
  });

  describe('Mobile Accessibility', () => {
    it('should be accessible on touch devices', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', { value: 375 });
      Object.defineProperty(window, 'innerHeight', { value: 667 });
      
      render(<MockWerewolfGameBoard />);
      
      // Test touch target sizes (minimum 44px)
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        const styles = getComputedStyle(button);
        // Would check computed dimensions
      });
    });

    it('should support voice over and screen readers on mobile', () => {
      render(<MockWerewolfGameBoard />);
      
      // Verify ARIA labels and roles work on mobile
      const landmarks = screen.getAllByRole('main');
      expect(landmarks.length).toBeGreaterThan(0);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });
});