/**
 * Theme Entity - FSD Layer: entities/theme
 * Domain model for theme management
 */

export type Theme = 'light' | 'dark' | 'system';
export type EffectiveTheme = Exclude<Theme, 'system'>;

export interface ThemeState {
	current: Theme;
	effective: EffectiveTheme; // The actual applied theme (resolves 'system')
	systemPreference: EffectiveTheme;
}
