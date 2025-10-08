/**
 * Theme Entity - FSD Layer: entities/theme
 * Domain model for theme management
 */

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeState {
  current: Theme;
  effective: 'light' | 'dark'; // The actual applied theme (resolves 'system')
  systemPreference: 'light' | 'dark';
}

export interface ThemeConfig {
  defaultTheme: Theme;
  storageKey: string;
  attribute: string;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  defaultTheme: 'system',
  storageKey: 'devsandoval-theme',
  attribute: 'data-theme'
};
