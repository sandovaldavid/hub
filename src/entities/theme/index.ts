/**
 * Theme Entity - FSD Layer: entities/theme
 * Public API exports
 */

export type { Theme, ThemeState, ThemeConfig } from './model/types';
export { DEFAULT_THEME_CONFIG } from './model/types';
export { ThemeManager, getThemeInitScript } from './lib/theme-manager';
