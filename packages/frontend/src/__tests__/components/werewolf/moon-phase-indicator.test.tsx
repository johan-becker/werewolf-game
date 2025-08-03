import React from 'react';
import { render, screen, waitFor, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoonPhaseIndicator, type MoonPhase } from '@/components/werewolf/moon-phase-indicator';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Moon: ({ className, ...props }: any) => <div data-testid="moon-icon" className={className} {...props} />,
  MoonIcon: ({ className, ...props }: any) => <div data-testid="moon-icon" className={className} {...props} />,
}));

describe('MoonPhaseIndicator', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('renders with default props', () => {
    render(<MoonPhaseIndicator />);
    
    // Should show a moon phase indicator with some moon emoji
    const moonEmoji = document.querySelector('.select-none');
    expect(moonEmoji).toBeInTheDocument();
    
    // Should have a label by default
    const labelContainer = document.querySelector('.text-center');
    expect(labelContainer).toBeInTheDocument();
  });

  it('displays the correct moon phase when specified', () => {
    const { rerender } = render(<MoonPhaseIndicator phase="full" />);
    
    // Should show full moon emoji
    expect(screen.getByText('🌕')).toBeInTheDocument();
    expect(screen.getByText('Full Moon')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();

    // Test different phases
    rerender(<MoonPhaseIndicator phase="new" />);
    expect(screen.getByText('🌑')).toBeInTheDocument();
    expect(screen.getByText('New Moon')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();

    rerender(<MoonPhaseIndicator phase="first-quarter" />);
    expect(screen.getByText('🌓')).toBeInTheDocument();
    expect(screen.getByText('First Quarter')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<MoonPhaseIndicator phase="new" size="small" />);
    
    let moonContainer = screen.getByText('🌑').parentElement;
    expect(moonContainer).toHaveClass('w-8', 'h-8', 'text-lg');

    rerender(<MoonPhaseIndicator phase="new" size="medium" />);
    moonContainer = screen.getByText('🌑').parentElement;
    expect(moonContainer).toHaveClass('w-16', 'h-16', 'text-3xl');

    rerender(<MoonPhaseIndicator phase="new" size="large" />);
    moonContainer = screen.getByText('🌑').parentElement;
    expect(moonContainer).toHaveClass('w-24', 'h-24', 'text-5xl');
  });

  it('shows/hides label based on showLabel prop', () => {
    const { rerender } = render(<MoonPhaseIndicator phase="full" showLabel={true} />);
    
    expect(screen.getByText('Full Moon')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();

    rerender(<MoonPhaseIndicator phase="full" showLabel={false} />);
    expect(screen.queryByText('Full Moon')).not.toBeInTheDocument();
    expect(screen.queryByText('100%')).not.toBeInTheDocument();
  });

  it('displays full moon danger indicator', () => {
    render(<MoonPhaseIndicator phase="full" />);
    
    // Should have the red danger indicator
    const dangerIndicator = document.querySelector('.bg-red-500.animate-pulse');
    expect(dangerIndicator).toBeInTheDocument();
  });

  it('does not display danger indicator for non-full moon phases', () => {
    render(<MoonPhaseIndicator phase="new" />);
    
    const dangerIndicator = document.querySelector('.bg-red-500.animate-pulse');
    expect(dangerIndicator).not.toBeInTheDocument();
  });

  it('applies full moon styling correctly', () => {
    const { rerender } = render(<MoonPhaseIndicator phase="full" />);
    
    const moonContainer = screen.getByText('🌕').parentElement;
    expect(moonContainer).toHaveClass('border-red-400');
    
    const label = screen.getByText('Full Moon');
    expect(label).toHaveClass('text-red-600');

    // Test non-full moon styling
    rerender(<MoonPhaseIndicator phase="new" />);
    const newMoonContainer = screen.getByText('🌑').parentElement;
    expect(newMoonContainer).toHaveClass('border-gray-600');
  });

  it('animates glow effect for full moon when animated is true', async () => {
    render(<MoonPhaseIndicator phase="full" animated={true} />);
    
    const moonContainer = screen.getByText('🌕').parentElement;
    
    // Initially should not have glow
    expect(moonContainer).not.toHaveClass('shadow-lg', 'shadow-red-400/50', 'scale-105');
    
    // Fast-forward the timer to trigger glow
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(moonContainer).toHaveClass('shadow-lg', 'shadow-red-400/50', 'scale-105');
    });
    
    // Fast-forward again to toggle glow off
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(moonContainer).not.toHaveClass('shadow-lg', 'shadow-red-400/50', 'scale-105');
    });
  });

  it('does not animate when animated is false', () => {
    render(<MoonPhaseIndicator phase="full" animated={false} />);
    
    const moonContainer = screen.getByText('🌕').parentElement;
    
    // Fast-forward timers
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    // Should never have glow effect
    expect(moonContainer).not.toHaveClass('shadow-lg', 'shadow-red-400/50', 'scale-105');
  });

  it('displays correct luminosity progress bar', () => {
    const { rerender } = render(<MoonPhaseIndicator phase="first-quarter" />);
    
    // First quarter should be 50%
    const progressBar = document.querySelector('[style*="width: 50%"]');
    expect(progressBar).toBeInTheDocument();
    
    // Test full moon (100%)
    rerender(<MoonPhaseIndicator phase="full" />);
    const fullProgressBar = document.querySelector('[style*="width: 100%"]');
    expect(fullProgressBar).toBeInTheDocument();
    
    // Test new moon (0%)
    rerender(<MoonPhaseIndicator phase="new" />);
    const newProgressBar = document.querySelector('[style*="width: 0%"]');
    expect(newProgressBar).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<MoonPhaseIndicator className="custom-class" />);
    
    const container = document.querySelector('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('calculates moon phase from current date when phase prop is not provided', () => {
    // Mock a specific date to get predictable results
    const originalDate = global.Date;
    const mockDate = new Date('2023-06-01T12:00:00Z');
    global.Date = jest.fn(() => mockDate) as any;
    global.Date.now = jest.fn(() => mockDate.getTime());
    
    render(<MoonPhaseIndicator />);
    
    // The component should render some moon phase (we don't test the exact calculation here)
    const moonEmoji = document.querySelector('.select-none');
    expect(moonEmoji).toBeInTheDocument();
    
    // Restore original Date
    global.Date = originalDate;
  });

  it('handles all moon phases correctly', () => {
    const phases: MoonPhase[] = [
      'new', 'waxing-crescent', 'first-quarter', 'waxing-gibbous',
      'full', 'waning-gibbous', 'last-quarter', 'waning-crescent'
    ];

    const expectedEmojis = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'];
    const expectedNames = [
      'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
      'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
    ];
    const expectedLuminosity = [0, 25, 50, 75, 100, 75, 50, 25];

    phases.forEach((phase, index) => {
      cleanup();
      render(<MoonPhaseIndicator phase={phase} />);
      
      expect(screen.getByText(expectedEmojis[index])).toBeInTheDocument();
      expect(screen.getByText(expectedNames[index])).toBeInTheDocument();
      expect(screen.getByText(`${expectedLuminosity[index]}%`)).toBeInTheDocument();
    });
  });

  it('supports hover effects when animated', () => {
    render(<MoonPhaseIndicator phase="new" animated={true} />);
    
    const moonContainer = screen.getByText('🌑').parentElement;
    expect(moonContainer).toHaveClass('hover:scale-110');
  });

  it('has proper accessibility attributes', () => {
    render(<MoonPhaseIndicator phase="full" />);
    
    // Moon emoji should be non-selectable
    const moonEmoji = screen.getByText('🌕');
    expect(moonEmoji).toHaveClass('select-none');
    
    // Should have proper text content for screen readers
    expect(screen.getByText('Full Moon')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});