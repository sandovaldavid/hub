/**
 * ThemeToggle Feature - FSD Layer: features/theme-toggle
 * Types and interfaces
 */

import type { Theme } from '../../../entities/theme';

export interface ThemeToggleProps {
  /**
   * Size of the toggle button
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Show label next to icon
   */
  showLabel?: boolean;
  
  /**
   * Custom class name
   */
  class?: string;
  
  /**
   * Position variant
   */
  variant?: 'floating' | 'inline';
}

export const THEME_LABELS: Record<Theme, string> = {
  light: 'Modo Claro',
  dark: 'Modo Oscuro',
  system: 'Sistema'
};
