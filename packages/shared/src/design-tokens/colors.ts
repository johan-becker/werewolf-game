/**
 * Werewolf Game Design Tokens - Color System
 * Gothic/Medieval themed color palette
 */

export const colors = {
  // Primary werewolf theme colors
  moonlight: {
    50: '#f8fafc',   // Pale moonlight
    100: '#f1f5f9',  // Light moon glow
    200: '#e2e8f0',  // Soft moonbeam
    300: '#cbd5e1',  // Moon silver
    400: '#94a3b8',  // Moon shadow
    500: '#64748b',  // Deep moonlight
    600: '#475569',  // Dark moon
    700: '#334155',  // Night shadow
    800: '#1e293b',  // Deep night
    900: '#0f172a'   // Midnight black
  },
  
  blood: {
    50: '#fef2f2',   // Faint blood mist
    100: '#fee2e2',  // Light blood
    200: '#fecaca',  // Pale crimson
    300: '#fca5a5',  // Soft red
    400: '#f87171',  // Blood red
    500: '#ef4444',  // Fresh blood
    600: '#dc2626',  // Dark blood
    700: '#b91c1c',  // Deep crimson
    800: '#991b1b',  // Dark crimson
    900: '#7f1d1d'   // Dried blood
  },
  
  forest: {
    50: '#f0fdf4',   // Morning mist
    100: '#dcfce7',  // Light forest
    200: '#bbf7d0',  // Soft green
    300: '#86efac',  // Forest light
    400: '#4ade80',  // Vibrant green
    500: '#22c55e',  // Forest green
    600: '#16a34a',  // Deep forest
    700: '#15803d',  // Dark forest
    800: '#166534',  // Forest shadow
    900: '#14532d'   // Deep woods
  },
  
  shadow: {
    50: '#fafafa',   // Ghost white
    100: '#f4f4f5',  // Pale gray
    200: '#e4e4e7',  // Light shadow
    300: '#d4d4d8',  // Soft shadow
    400: '#a1a1aa',  // Medium shadow
    500: '#71717a',  // Shadow gray
    600: '#52525b',  // Dark shadow
    700: '#3f3f46',  // Deep shadow
    800: '#27272a',  // Abyss
    900: '#18181b'   // Void black
  },
  
  // Semantic colors
  primary: {
    light: '#64748b',  // moonlight.500
    main: '#334155',   // moonlight.700
    dark: '#0f172a'    // moonlight.900
  },
  
  secondary: {
    light: '#f87171',  // blood.400
    main: '#dc2626',   // blood.600
    dark: '#7f1d1d'    // blood.900
  },
  
  success: {
    light: '#4ade80',  // forest.400
    main: '#16a34a',   // forest.600
    dark: '#14532d'    // forest.900
  },
  
  warning: {
    light: '#fbbf24',
    main: '#f59e0b',
    dark: '#d97706'
  },
  
  error: {
    light: '#f87171',  // blood.400
    main: '#dc2626',   // blood.600
    dark: '#7f1d1d'    // blood.900
  },
  
  // Background colors
  background: {
    default: '#0f172a',    // moonlight.900
    paper: '#1e293b',      // moonlight.800
    elevated: '#334155'    // moonlight.700
  },
  
  // Text colors
  text: {
    primary: '#f8fafc',    // moonlight.50
    secondary: '#cbd5e1',  // moonlight.300
    disabled: '#64748b'    // moonlight.500
  },
  
  // Game-specific colors
  game: {
    werewolf: '#dc2626',   // blood.600
    villager: '#16a34a',   // forest.600
    seer: '#3b82f6',       // Blue for wisdom
    witch: '#8b5cf6',      // Purple for magic
    hunter: '#f59e0b',     // Orange for strength
    cupid: '#ec4899',      // Pink for love
    mayor: '#eab308'       // Gold for authority
  }
} as const;

// CSS Custom Properties export
export const cssVariables = {
  // Moonlight theme
  '--color-moonlight-50': colors.moonlight[50],
  '--color-moonlight-100': colors.moonlight[100],
  '--color-moonlight-200': colors.moonlight[200],
  '--color-moonlight-300': colors.moonlight[300],
  '--color-moonlight-400': colors.moonlight[400],
  '--color-moonlight-500': colors.moonlight[500],
  '--color-moonlight-600': colors.moonlight[600],
  '--color-moonlight-700': colors.moonlight[700],
  '--color-moonlight-800': colors.moonlight[800],
  '--color-moonlight-900': colors.moonlight[900],
  
  // Blood theme
  '--color-blood-50': colors.blood[50],
  '--color-blood-100': colors.blood[100],
  '--color-blood-200': colors.blood[200],
  '--color-blood-300': colors.blood[300],
  '--color-blood-400': colors.blood[400],
  '--color-blood-500': colors.blood[500],
  '--color-blood-600': colors.blood[600],
  '--color-blood-700': colors.blood[700],
  '--color-blood-800': colors.blood[800],
  '--color-blood-900': colors.blood[900],
  
  // Forest theme
  '--color-forest-50': colors.forest[50],
  '--color-forest-100': colors.forest[100],
  '--color-forest-200': colors.forest[200],
  '--color-forest-300': colors.forest[300],
  '--color-forest-400': colors.forest[400],
  '--color-forest-500': colors.forest[500],
  '--color-forest-600': colors.forest[600],
  '--color-forest-700': colors.forest[700],
  '--color-forest-800': colors.forest[800],
  '--color-forest-900': colors.forest[900],
  
  // Shadow theme
  '--color-shadow-50': colors.shadow[50],
  '--color-shadow-100': colors.shadow[100],
  '--color-shadow-200': colors.shadow[200],
  '--color-shadow-300': colors.shadow[300],
  '--color-shadow-400': colors.shadow[400],
  '--color-shadow-500': colors.shadow[500],
  '--color-shadow-600': colors.shadow[600],
  '--color-shadow-700': colors.shadow[700],
  '--color-shadow-800': colors.shadow[800],
  '--color-shadow-900': colors.shadow[900],
  
  // Semantic colors
  '--color-primary-light': colors.primary.light,
  '--color-primary-main': colors.primary.main,
  '--color-primary-dark': colors.primary.dark,
  '--color-secondary-light': colors.secondary.light,
  '--color-secondary-main': colors.secondary.main,
  '--color-secondary-dark': colors.secondary.dark,
  '--color-success-light': colors.success.light,
  '--color-success-main': colors.success.main,
  '--color-success-dark': colors.success.dark,
  '--color-error-light': colors.error.light,
  '--color-error-main': colors.error.main,
  '--color-error-dark': colors.error.dark,
  
  // Background colors
  '--color-background-default': colors.background.default,
  '--color-background-paper': colors.background.paper,
  '--color-background-elevated': colors.background.elevated,
  
  // Text colors
  '--color-text-primary': colors.text.primary,
  '--color-text-secondary': colors.text.secondary,
  '--color-text-disabled': colors.text.disabled
} as const;

export type ColorScale = typeof colors.moonlight;
export type SemanticColor = typeof colors.primary;
export type GameColor = keyof typeof colors.game;