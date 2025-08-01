/**
 * Werewolf Game Design Tokens
 * Centralized design system tokens for consistent theming
 */

export * from './colors';
export * from './typography';
export * from './spacing';

import { colors, cssVariables as colorCssVariables } from './colors';
import { typography, typographyCssVariables } from './typography';
import { spacing, semanticSpacing, containers, borderRadius, zIndex, spacingCssVariables } from './spacing';

// Combined design tokens
export const designTokens = {
  colors,
  typography,
  spacing,
  semanticSpacing,
  containers,
  borderRadius,
  zIndex
} as const;

// All CSS custom properties for easy integration
export const allCssVariables = {
  ...colorCssVariables,
  ...typographyCssVariables,
  ...spacingCssVariables
} as const;

// Helper function to generate CSS custom properties string
export function generateCssVariables(): string {
  return Object.entries(allCssVariables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
}

// Helper function to generate CSS variables for a specific theme
export function generateThemeCss(rootSelector = ':root'): string {
  return `${rootSelector} {
${generateCssVariables()}
}`;
}

export default designTokens;