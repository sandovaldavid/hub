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

export interface ThemeConfig {
	defaultTheme: Theme;
	storageKey: string;
	attribute: string;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
	defaultTheme: 'system',
	storageKey: 'sandovaldavid-theme',
	attribute: 'data-theme',
};
