/**
 * Werewolf Game Design Tokens - Typography System
 * Gothic/Medieval inspired typography scale
 */

export const typography = {
  // Font families
  fontFamily: {
    // Primary font for headings and important text
    display: '"Cinzel", "Trajan Pro", serif', // Gothic/Medieval display font
    // Body text font
    body: '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
    // Monospace for code/technical content
    mono: '"JetBrains Mono", "Fira Code", "Courier New", monospace'
  },
  
  // Font weights
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  
  // Font sizes (using 8px base scale)
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem'     // 128px
  },
  
  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  },
  
  // Text styles for consistent usage
  textStyles: {
    // Display styles
    'display-large': {
      fontFamily: '"Cinzel", serif',
      fontSize: '4.5rem',   // 72px
      fontWeight: 700,
      lineHeight: '1.25',
      letterSpacing: '-0.025em'
    },
    'display-medium': {
      fontFamily: '"Cinzel", serif',
      fontSize: '3.75rem',  // 60px
      fontWeight: 700,
      lineHeight: '1.25',
      letterSpacing: '-0.025em'
    },
    'display-small': {
      fontFamily: '"Cinzel", serif',
      fontSize: '3rem',     // 48px
      fontWeight: 600,
      lineHeight: '1.25',
      letterSpacing: 'normal'
    },
    
    // Heading styles
    'heading-large': {
      fontFamily: '"Cinzel", serif',
      fontSize: '2.25rem',  // 36px
      fontWeight: 600,
      lineHeight: '1.375',
      letterSpacing: 'normal'
    },
    'heading-medium': {
      fontFamily: '"Cinzel", serif',
      fontSize: '1.875rem', // 30px
      fontWeight: 600,
      lineHeight: '1.375',
      letterSpacing: 'normal'
    },
    'heading-small': {
      fontFamily: '"Cinzel", serif',
      fontSize: '1.5rem',   // 24px
      fontWeight: 600,
      lineHeight: '1.375',
      letterSpacing: 'normal'
    },
    
    // Title styles
    'title-large': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1.25rem',  // 20px
      fontWeight: 600,
      lineHeight: '1.5',
      letterSpacing: 'normal'
    },
    'title-medium': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1.125rem', // 18px
      fontWeight: 600,
      lineHeight: '1.5',
      letterSpacing: 'normal'
    },
    'title-small': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',     // 16px
      fontWeight: 600,
      lineHeight: '1.5',
      letterSpacing: 'normal'
    },
    
    // Body styles
    'body-large': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1.125rem', // 18px
      fontWeight: 400,
      lineHeight: '1.625',
      letterSpacing: 'normal'
    },
    'body-medium': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',     // 16px
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: 'normal'
    },
    'body-small': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem', // 14px
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: 'normal'
    },
    
    // Label styles
    'label-large': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',     // 16px
      fontWeight: 500,
      lineHeight: '1.5',
      letterSpacing: 'normal'
    },
    'label-medium': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem', // 14px
      fontWeight: 500,
      lineHeight: '1.5',
      letterSpacing: 'normal'
    },
    'label-small': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',  // 12px
      fontWeight: 500,
      lineHeight: '1.5',
      letterSpacing: 'wide'
    },
    
    // Caption and utility
    'caption': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',  // 12px
      fontWeight: 400,
      lineHeight: '1.5',
      letterSpacing: 'normal'
    },
    'overline': {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',  // 12px
      fontWeight: 500,
      lineHeight: '1.5',
      letterSpacing: 'widest',
      textTransform: 'uppercase'
    }
  }
} as const;

// CSS Custom Properties for typography
export const typographyCssVariables = {
  // Font families
  '--font-family-display': typography.fontFamily.display,
  '--font-family-body': typography.fontFamily.body,
  '--font-family-mono': typography.fontFamily.mono,
  
  // Font weights
  '--font-weight-light': typography.fontWeight.light.toString(),
  '--font-weight-regular': typography.fontWeight.regular.toString(),
  '--font-weight-medium': typography.fontWeight.medium.toString(),
  '--font-weight-semibold': typography.fontWeight.semibold.toString(),
  '--font-weight-bold': typography.fontWeight.bold.toString(),
  '--font-weight-extrabold': typography.fontWeight.extrabold.toString(),
  
  // Font sizes
  '--font-size-xs': typography.fontSize.xs,
  '--font-size-sm': typography.fontSize.sm,
  '--font-size-base': typography.fontSize.base,
  '--font-size-lg': typography.fontSize.lg,
  '--font-size-xl': typography.fontSize.xl,
  '--font-size-2xl': typography.fontSize['2xl'],
  '--font-size-3xl': typography.fontSize['3xl'],
  '--font-size-4xl': typography.fontSize['4xl'],
  '--font-size-5xl': typography.fontSize['5xl'],
  '--font-size-6xl': typography.fontSize['6xl'],
  '--font-size-7xl': typography.fontSize['7xl'],
  '--font-size-8xl': typography.fontSize['8xl'],
  '--font-size-9xl': typography.fontSize['9xl'],
  
  // Line heights
  '--line-height-none': typography.lineHeight.none,
  '--line-height-tight': typography.lineHeight.tight,
  '--line-height-snug': typography.lineHeight.snug,
  '--line-height-normal': typography.lineHeight.normal,
  '--line-height-relaxed': typography.lineHeight.relaxed,
  '--line-height-loose': typography.lineHeight.loose,
  
  // Letter spacing
  '--letter-spacing-tighter': typography.letterSpacing.tighter,
  '--letter-spacing-tight': typography.letterSpacing.tight,
  '--letter-spacing-normal': typography.letterSpacing.normal,
  '--letter-spacing-wide': typography.letterSpacing.wide,
  '--letter-spacing-wider': typography.letterSpacing.wider,
  '--letter-spacing-widest': typography.letterSpacing.widest
} as const;

export type FontFamily = keyof typeof typography.fontFamily;
export type FontWeight = keyof typeof typography.fontWeight;
export type FontSize = keyof typeof typography.fontSize;
export type LineHeight = keyof typeof typography.lineHeight;
export type LetterSpacing = keyof typeof typography.letterSpacing;
export type TextStyle = keyof typeof typography.textStyles;