/**
 * Werewolf Game Design Tokens - Spacing System
 * 8px base grid methodology for consistent spacing
 */

export const spacing = {
  // Base spacing scale (8px grid)
  0: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px  - Base unit
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px - 2x base
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px - 3x base
  7: '1.75rem', // 28px
  8: '2rem', // 32px - 4x base
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px - 5x base
  11: '2.75rem', // 44px
  12: '3rem', // 48px - 6x base
  14: '3.5rem', // 56px - 7x base
  16: '4rem', // 64px - 8x base
  20: '5rem', // 80px - 10x base
  24: '6rem', // 96px - 12x base
  28: '7rem', // 112px - 14x base
  32: '8rem', // 128px - 16x base
  36: '9rem', // 144px - 18x base
  40: '10rem', // 160px - 20x base
  44: '11rem', // 176px
  48: '12rem', // 192px - 24x base
  52: '13rem', // 208px
  56: '14rem', // 224px - 28x base
  60: '15rem', // 240px
  64: '16rem', // 256px - 32x base
  72: '18rem', // 288px - 36x base
  80: '20rem', // 320px - 40x base
  96: '24rem', // 384px - 48x base
} as const;

// Semantic spacing tokens for consistent usage
export const semanticSpacing = {
  // Component spacing
  component: {
    xs: spacing[1], // 4px
    sm: spacing[2], // 8px
    md: spacing[4], // 16px
    lg: spacing[6], // 24px
    xl: spacing[8], // 32px
    '2xl': spacing[12], // 48px
  },

  // Layout spacing
  layout: {
    xs: spacing[4], // 16px
    sm: spacing[6], // 24px
    md: spacing[8], // 32px
    lg: spacing[12], // 48px
    xl: spacing[16], // 64px
    '2xl': spacing[24], // 96px
    '3xl': spacing[32], // 128px
  },

  // Content spacing
  content: {
    xs: spacing[2], // 8px
    sm: spacing[3], // 12px
    md: spacing[4], // 16px
    lg: spacing[6], // 24px
    xl: spacing[8], // 32px
  },

  // Game-specific spacing
  game: {
    cardGap: spacing[4], // 16px - Gap between game cards
    playerGap: spacing[3], // 12px - Gap between player items
    chatMessage: spacing[2], // 8px - Gap between chat messages
    actionButton: spacing[4], // 16px - Padding for action buttons
    gameBoard: spacing[8], // 32px - Padding around game board
    modal: spacing[6], // 24px - Modal content padding
    notification: spacing[4], // 16px - Notification padding
    tooltip: spacing[2], // 8px - Tooltip padding
  },
} as const;

// Container max widths for responsive design
export const containers = {
  xs: '20rem', // 320px
  sm: '24rem', // 384px
  md: '28rem', // 448px
  lg: '32rem', // 512px
  xl: '36rem', // 576px
  '2xl': '42rem', // 672px
  '3xl': '48rem', // 768px
  '4xl': '56rem', // 896px
  '5xl': '64rem', // 1024px
  '6xl': '72rem', // 1152px
  '7xl': '80rem', // 1280px
  full: '100%',
  screen: '100vw',
} as const;

// Border radius scale
export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  base: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// Z-index scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
  toast: 1700,
  max: 2147483647,
} as const;

// CSS Custom Properties for spacing
export const spacingCssVariables = {
  // Base spacing
  '--spacing-0': spacing[0],
  '--spacing-px': spacing.px,
  '--spacing-0-5': spacing[0.5],
  '--spacing-1': spacing[1],
  '--spacing-1-5': spacing[1.5],
  '--spacing-2': spacing[2],
  '--spacing-2-5': spacing[2.5],
  '--spacing-3': spacing[3],
  '--spacing-3-5': spacing[3.5],
  '--spacing-4': spacing[4],
  '--spacing-5': spacing[5],
  '--spacing-6': spacing[6],
  '--spacing-7': spacing[7],
  '--spacing-8': spacing[8],
  '--spacing-9': spacing[9],
  '--spacing-10': spacing[10],
  '--spacing-12': spacing[12],
  '--spacing-16': spacing[16],
  '--spacing-20': spacing[20],
  '--spacing-24': spacing[24],
  '--spacing-32': spacing[32],
  '--spacing-40': spacing[40],
  '--spacing-48': spacing[48],
  '--spacing-64': spacing[64],
  '--spacing-80': spacing[80],
  '--spacing-96': spacing[96],

  // Semantic spacing
  '--spacing-component-xs': semanticSpacing.component.xs,
  '--spacing-component-sm': semanticSpacing.component.sm,
  '--spacing-component-md': semanticSpacing.component.md,
  '--spacing-component-lg': semanticSpacing.component.lg,
  '--spacing-component-xl': semanticSpacing.component.xl,
  '--spacing-component-2xl': semanticSpacing.component['2xl'],

  '--spacing-layout-xs': semanticSpacing.layout.xs,
  '--spacing-layout-sm': semanticSpacing.layout.sm,
  '--spacing-layout-md': semanticSpacing.layout.md,
  '--spacing-layout-lg': semanticSpacing.layout.lg,
  '--spacing-layout-xl': semanticSpacing.layout.xl,
  '--spacing-layout-2xl': semanticSpacing.layout['2xl'],
  '--spacing-layout-3xl': semanticSpacing.layout['3xl'],

  // Border radius
  '--border-radius-none': borderRadius.none,
  '--border-radius-sm': borderRadius.sm,
  '--border-radius-base': borderRadius.base,
  '--border-radius-md': borderRadius.md,
  '--border-radius-lg': borderRadius.lg,
  '--border-radius-xl': borderRadius.xl,
  '--border-radius-2xl': borderRadius['2xl'],
  '--border-radius-3xl': borderRadius['3xl'],
  '--border-radius-full': borderRadius.full,

  // Z-index
  '--z-index-dropdown': zIndex.dropdown.toString(),
  '--z-index-sticky': zIndex.sticky.toString(),
  '--z-index-modal': zIndex.modal.toString(),
  '--z-index-popover': zIndex.popover.toString(),
  '--z-index-tooltip': zIndex.tooltip.toString(),
  '--z-index-toast': zIndex.toast.toString(),
} as const;

export type Spacing = keyof typeof spacing;
export type SemanticSpacing = keyof typeof semanticSpacing.component;
export type Container = keyof typeof containers;
export type BorderRadius = keyof typeof borderRadius;
export type ZIndex = keyof typeof zIndex;
