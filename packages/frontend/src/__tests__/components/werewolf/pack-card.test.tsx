import React from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PackCard, type WerewolfRole, type PackStatus } from '@/components/werewolf/pack-card';

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Users: ({ className, ...props }: any) => <div data-testid="users-icon" className={className} {...props} />,
  Crown: ({ className, ...props }: any) => <div data-testid="crown-icon" className={className} {...props} />,
  Shield: ({ className, ...props }: any) => <div data-testid="shield-icon" className={className} {...props} />,
  Sword: ({ className, ...props }: any) => <div data-testid="sword-icon" className={className} {...props} />,
  Heart: ({ className, ...props }: any) => <div data-testid="heart-icon" className={className} {...props} />,
  Eye: ({ className, ...props }: any) => <div data-testid="eye-icon" className={className} {...props} />,
  MapPin: ({ className, ...props }: any) => <div data-testid="mappin-icon" className={className} {...props} />,
  Star: ({ className, ...props }: any) => <div data-testid="star-icon" className={className} {...props} />,
}));

describe('PackCard', () => {
  const mockAlpha = {
    id: 'alpha-1',
    name: 'John Alpha',
    role: 'ALPHA' as WerewolfRole,
    avatar: 'https://example.com/alpha.jpg',
    isOnline: true,
    transformationCount: 15
  };

  const mockMembers = [
    {
      id: 'member-1',
      name: 'Jane Beta',
      role: 'BETA' as WerewolfRole,
      avatar: 'https://example.com/beta.jpg',
      isOnline: true,
      transformationCount: 8
    },
    {
      id: 'member-2',
      name: 'Bob Hunter',
      role: 'HUNTER' as WerewolfRole,
      isOnline: false,
      transformationCount: 12
    }
  ];

  const mockTerritories = [
    {
      id: 'territory-1',
      name: 'Dark Forest',
      size: 50,
      isControlled: true
    },
    {
      id: 'territory-2',
      name: 'Mountain Ridge',
      size: 30,
      isControlled: false
    }
  ];

  const defaultProps = {
    id: 'pack-1',
    name: 'Shadow Wolves',
    alpha: mockAlpha,
    members: mockMembers,
    territories: mockTerritories,
    status: 'ACTIVE' as PackStatus,
    description: 'A fierce pack that controls the northern territories',
    memberLimit: 12,
    reputation: 85
  };

  afterEach(() => {
    cleanup();
  });

  it('renders pack basic information correctly', () => {
    render(<PackCard {...defaultProps} />);
    
    expect(screen.getByText('Shadow Wolves')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('A fierce pack that controls the northern territories')).toBeInTheDocument();
    expect(screen.getByText('3/12')).toBeInTheDocument(); // totalMembers/memberLimit
  });

  it('displays alpha information correctly', () => {
    render(<PackCard {...defaultProps} />);
    
    expect(screen.getByText('John Alpha')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('15 transformations')).toBeInTheDocument();
    
    // Alpha should have online indicator
    const onlineIndicator = document.querySelector('.bg-forest-500');
    expect(onlineIndicator).toBeInTheDocument();
  });

  it('shows correct online member count', () => {
    render(<PackCard {...defaultProps} />);
    
    // Alpha (online) + 1 member (online) = 2 online
    expect(screen.getByText('2 online')).toBeInTheDocument();
    expect(screen.getByText('of 3 members')).toBeInTheDocument();
  });

  it('displays territory information correctly', () => {
    render(<PackCard {...defaultProps} />);
    
    // Should show 1 controlled territory (only Dark Forest is controlled)
    expect(screen.getByText('1 territory')).toBeInTheDocument();
    // Total size is 50 + 30 = 80
    expect(screen.getByText('80 km²')).toBeInTheDocument();
  });

  it('handles plural territories correctly', () => {
    const propsWithMultipleTerritories = {
      ...defaultProps,
      territories: [
        ...mockTerritories,
        { id: 'territory-3', name: 'Valley', size: 20, isControlled: true }
      ]
    };
    
    render(<PackCard {...propsWithMultipleTerritories} />);
    
    // Should show 2 controlled territories (Dark Forest + Valley, both controlled)
    expect(screen.getByText('2 territories')).toBeInTheDocument();
    expect(screen.getByText('100 km²')).toBeInTheDocument(); // 50 + 30 + 20 = 100 (total size of all territories)
  });

  it('displays reputation stars correctly', () => {
    render(<PackCard {...defaultProps} />);
    
    // Reputation 85 should show 4 stars (85 / 20 = 4.25, floored to 4)
    const stars = screen.getAllByTestId('star-icon');
    expect(stars).toHaveLength(5); // Always shows 5 stars total
    expect(screen.getByText('(85)')).toBeInTheDocument();
  });

  it('shows "Your Pack" badge when isUserPack is true', () => {
    render(<PackCard {...defaultProps} isUserPack={true} />);
    
    expect(screen.getByText('Your Pack')).toBeInTheDocument();
  });

  it('does not show "Your Pack" badge when isUserPack is false', () => {
    render(<PackCard {...defaultProps} isUserPack={false} />);
    
    expect(screen.queryByText('Your Pack')).not.toBeInTheDocument();
  });

  it('expands and collapses member list', async () => {
    const user = userEvent.setup();
    render(<PackCard {...defaultProps} />);
    
    // Initially members should be hidden
    expect(screen.queryByText('Jane Beta')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Hunter')).not.toBeInTheDocument();
    
    // Click to expand
    const expandButton = screen.getByText('Show Members (2)');
    await act(async () => {
      await user.click(expandButton);
    });
    
    // Members should now be visible
    expect(screen.getByText('Jane Beta')).toBeInTheDocument();
    expect(screen.getByText('Bob Hunter')).toBeInTheDocument();
    
    // Button text should change
    expect(screen.getByText('Hide Members (2)')).toBeInTheDocument();
    
    // Click to collapse
    await act(async () => {
      await user.click(screen.getByText('Hide Members (2)'));
    });
    
    // Members should be hidden again
    expect(screen.queryByText('Jane Beta')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob Hunter')).not.toBeInTheDocument();
  });

  it('shows member roles and online status correctly when expanded', async () => {
    const user = userEvent.setup();
    render(<PackCard {...defaultProps} />);
    
    // Expand member list
    await act(async () => {
      await user.click(screen.getByText('Show Members (2)'));
    });
    
    // Check member roles
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Hunter')).toBeInTheDocument();
    
    // Check online status indicators - one online (green), one offline (gray)
    const onlineIndicators = document.querySelectorAll('.bg-forest-500');
    const offlineIndicators = document.querySelectorAll('.bg-shadow-400');
    
    // Should have 2 online (alpha + beta member) and 1 offline (hunter member)
    expect(onlineIndicators).toHaveLength(2);
    expect(offlineIndicators).toHaveLength(1);
  });

  it('does not show member expansion when there are no members besides alpha', () => {
    const propsWithNoMembers = {
      ...defaultProps,
      members: []
    };
    
    render(<PackCard {...propsWithNoMembers} />);
    
    expect(screen.queryByText(/Show Members/)).not.toBeInTheDocument();
    expect(screen.getByText('1/12')).toBeInTheDocument(); // Only alpha
  });

  it('shows View Details button and calls onViewDetails when clicked', async () => {
    const user = userEvent.setup();
    const mockOnViewDetails = jest.fn();
    
    render(<PackCard {...defaultProps} onViewDetails={mockOnViewDetails} />);
    
    const viewDetailsButton = screen.getByText('View Details');
    expect(viewDetailsButton).toBeInTheDocument();
    
    await act(async () => {
      await user.click(viewDetailsButton);
    });
    expect(mockOnViewDetails).toHaveBeenCalledWith('pack-1');
  });

  it('shows Join Pack button for recruiting packs when not user pack', async () => {
    const user = userEvent.setup();
    const mockOnJoinPack = jest.fn();
    
    const recruitingProps = {
      ...defaultProps,
      status: 'RECRUITING' as PackStatus,
      isUserPack: false
    };
    
    render(<PackCard {...recruitingProps} onJoinPack={mockOnJoinPack} />);
    
    const joinButton = screen.getByText('Join Pack');
    expect(joinButton).toBeInTheDocument();
    
    await act(async () => {
      await user.click(joinButton);
    });
    expect(mockOnJoinPack).toHaveBeenCalledWith('pack-1');
  });

  it('does not show Join Pack button for user pack', () => {
    const recruitingProps = {
      ...defaultProps,
      status: 'RECRUITING' as PackStatus,
      isUserPack: true
    };
    
    render(<PackCard {...recruitingProps} />);
    
    expect(screen.queryByText('Join Pack')).not.toBeInTheDocument();
  });

  it('does not show Join Pack button for non-recruiting packs', () => {
    const activeProps = {
      ...defaultProps,
      status: 'ACTIVE' as PackStatus,
      isUserPack: false
    };
    
    render(<PackCard {...activeProps} />);
    
    expect(screen.queryByText('Join Pack')).not.toBeInTheDocument();
  });

  it('does not show Join Pack button when pack is full', () => {
    const fullPackProps = {
      ...defaultProps,
      status: 'RECRUITING' as PackStatus,
      isUserPack: false,
      memberLimit: 3, // Current members = 3 (alpha + 2 members)
    };
    
    render(<PackCard {...fullPackProps} />);
    
    expect(screen.queryByText('Join Pack')).not.toBeInTheDocument();
  });

  it('applies different status colors correctly', () => {
    const { rerender } = render(<PackCard {...defaultProps} status="ACTIVE" />);
    expect(screen.getByText('active')).toBeInTheDocument();
    
    rerender(<PackCard {...defaultProps} status="DORMANT" />);
    expect(screen.getByText('dormant')).toBeInTheDocument();
    
    rerender(<PackCard {...defaultProps} status="DISBANDED" />);
    expect(screen.getByText('disbanded')).toBeInTheDocument();
    
    rerender(<PackCard {...defaultProps} status="RECRUITING" />);
    expect(screen.getByText('recruiting')).toBeInTheDocument();
  });

  it('handles different werewolf roles correctly', () => {
    const membersWithDifferentRoles = [
      { ...mockMembers[0], role: 'BETA' as WerewolfRole },
      { ...mockMembers[1], role: 'OMEGA' as WerewolfRole },
      { id: 'member-3', name: 'Alice Healer', role: 'HEALER' as WerewolfRole, isOnline: true, transformationCount: 5 },
      { id: 'member-4', name: 'Dave Scout', role: 'SCOUT' as WerewolfRole, isOnline: false, transformationCount: 3 },
      { id: 'member-5', name: 'Eve Guardian', role: 'GUARDIAN' as WerewolfRole, isOnline: true, transformationCount: 7 }
    ];
    
    const propsWithAllRoles = {
      ...defaultProps,
      members: membersWithDifferentRoles
    };
    
    render(<PackCard {...propsWithAllRoles} />);
    
    // Alpha should always be shown
    expect(screen.getByText('Alpha')).toBeInTheDocument();
  });

  it('calculates reputation stars correctly for different values', () => {
    const testCases = [
      { reputation: 0, expectedStars: 0 },
      { reputation: 19, expectedStars: 0 },
      { reputation: 20, expectedStars: 1 },
      { reputation: 39, expectedStars: 1 },
      { reputation: 40, expectedStars: 2 },
      { reputation: 60, expectedStars: 3 },
      { reputation: 80, expectedStars: 4 },
      { reputation: 100, expectedStars: 5 },
      { reputation: 150, expectedStars: 5 }, // Max 5 stars
    ];

    testCases.forEach(({ reputation, expectedStars }) => {
      cleanup();
      render(<PackCard {...defaultProps} reputation={reputation} />);
      
      const stars = screen.getAllByTestId('star-icon');
      expect(stars).toHaveLength(5); // Always 5 total stars
      expect(screen.getByText(`(${reputation})`)).toBeInTheDocument();
    });
  });

  it('handles missing description gracefully', () => {
    const propsWithoutDescription = {
      ...defaultProps,
      description: undefined
    };
    
    render(<PackCard {...propsWithoutDescription} />);
    
    expect(screen.getByText('Shadow Wolves')).toBeInTheDocument();
    // Should not crash or show undefined
  });

  it('applies custom className', () => {
    render(<PackCard {...defaultProps} className="custom-pack-class" />);
    
    const cardElement = document.querySelector('.custom-pack-class');
    expect(cardElement).toBeInTheDocument();
  });

  it('handles offline alpha correctly', () => {
    const propsWithOfflineAlpha = {
      ...defaultProps,
      alpha: { ...mockAlpha, isOnline: false }
    };
    
    render(<PackCard {...propsWithOfflineAlpha} />);
    
    // Should show 1 online member (only Jane Beta)
    expect(screen.getByText('1 online')).toBeInTheDocument();
    
    // Alpha should have offline indicator
    const offlineIndicators = document.querySelectorAll('.bg-shadow-400');
    expect(offlineIndicators.length).toBeGreaterThan(0);
  });

  it('displays avatar fallbacks correctly', () => {
    const propsWithoutAvatars = {
      ...defaultProps,
      alpha: { ...mockAlpha, avatar: undefined },
      members: mockMembers.map(m => ({ ...m, avatar: undefined }))
    };
    
    render(<PackCard {...propsWithoutAvatars} />);
    
    // Alpha fallback should be first 2 characters of name
    expect(screen.getByText('JO')).toBeInTheDocument(); // "John Alpha" -> "JO"
  });
});