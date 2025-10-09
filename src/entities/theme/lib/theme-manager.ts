/**
 * Theme Entity - FSD Layer: entities/theme
 * Theme management business logic
 */

import type { Theme, ThemeState, ThemeConfig } from '../model/types';
import { DEFAULT_THEME_CONFIG } from '../model/types';

export class ThemeManager {
	private config: ThemeConfig;

	constructor(config: Partial<ThemeConfig> = {}) {
		this.config = { ...DEFAULT_THEME_CONFIG, ...config };
	}

	/**
	 * Get system color scheme preference
	 */
	getSystemPreference(): 'light' | 'dark' {
		if (typeof window === 'undefined') return 'light';

		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	/**
	 * Get stored theme from localStorage
	 */
	getStoredTheme(): Theme | null {
		if (typeof window === 'undefined') return null;

		const stored = localStorage.getItem(this.config.storageKey);

		if (stored === 'light' || stored === 'dark' || stored === 'system') {
			return stored;
		}

		return null;
	}

	/**
	 * Store theme in localStorage
	 */
	setStoredTheme(theme: Theme): void {
		if (typeof window === 'undefined') return;

		localStorage.setItem(this.config.storageKey, theme);
	}

	/**
	 * Resolve effective theme (convert 'system' to 'light' or 'dark')
	 */
	resolveEffectiveTheme(theme: Theme): 'light' | 'dark' {
		if (theme === 'system') {
			return this.getSystemPreference();
		}
		return theme;
	}

	/**
	 * Apply theme to document
	 */
	applyTheme(theme: Theme): void {
		if (typeof document === 'undefined') return;

		const effectiveTheme = this.resolveEffectiveTheme(theme);
		document.documentElement.setAttribute(this.config.attribute, effectiveTheme);
	}

	/**
	 * Get current theme state
	 */
	getThemeState(): ThemeState {
		const stored = this.getStoredTheme();
		const current = stored || this.config.defaultTheme;
		const systemPreference = this.getSystemPreference();
		const effective = this.resolveEffectiveTheme(current);

		return {
			current,
			effective,
			systemPreference,
		};
	}

	/**
	 * Set and apply new theme
	 */
	setTheme(theme: Theme): ThemeState {
		this.setStoredTheme(theme);
		this.applyTheme(theme);
		return this.getThemeState();
	}

	/**
	 * Cycle through themes: light → dark → system → light
	 */
	cycleTheme(): ThemeState {
		const current = this.getThemeState().current;

		let nextTheme: Theme;
		switch (current) {
			case 'light':
				nextTheme = 'dark';
				break;
			case 'dark':
				nextTheme = 'system';
				break;
			case 'system':
				nextTheme = 'light';
				break;
		}

		return this.setTheme(nextTheme);
	}

	/**
	 * Initialize theme on page load (prevent flash)
	 */
	initialize(): void {
		const stored = this.getStoredTheme();
		const theme = stored || this.config.defaultTheme;
		this.applyTheme(theme);
	}

	/**
	 * Listen to system preference changes
	 */
	watchSystemPreference(callback: (theme: 'light' | 'dark') => void): () => void {
		if (typeof window === 'undefined') return () => {};

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handler = (e: MediaQueryListEvent) => {
			const newPreference = e.matches ? 'dark' : 'light';
			callback(newPreference);

			// If current theme is 'system', update automatically
			const currentTheme = this.getStoredTheme() || this.config.defaultTheme;
			if (currentTheme === 'system') {
				this.applyTheme('system');
			}
		};

		mediaQuery.addEventListener('change', handler);

		// Return cleanup function
		return () => mediaQuery.removeEventListener('change', handler);
	}
}

/**
 * Get inline script to prevent flash of unstyled content (FOUC)
 * This should be inlined in <head> before any content renders
 */
export function getThemeInitScript(config: Partial<ThemeConfig> = {}): string {
	const cfg = { ...DEFAULT_THEME_CONFIG, ...config };

	return `
    (function() {
      const storageKey = '${cfg.storageKey}';
      const attribute = '${cfg.attribute}';
      const defaultTheme = '${cfg.defaultTheme}';
      
      function getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      function resolveTheme(theme) {
        return theme === 'system' ? getSystemPreference() : theme;
      }
      
      const stored = localStorage.getItem(storageKey);
      const theme = stored || defaultTheme;
      const effective = resolveTheme(theme);
      
      document.documentElement.setAttribute(attribute, effective);
    })();
  `;
}
