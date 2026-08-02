/**
 * Theme Entity - FSD Layer: entities/theme
 * Theme management business logic
 */

import type { EffectiveTheme, Theme, ThemeState } from '../model/types';
import { THEME_FAVICON_PATHS, updateFavicon } from './theme-assets';

export class ThemeManager {
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

		const stored = localStorage.getItem('sandovaldavid-theme');

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

		localStorage.setItem('sandovaldavid-theme', theme);
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
		document.documentElement.setAttribute('data-theme', effectiveTheme);
		updateFavicon(effectiveTheme);
	}

	/**
	 * Get current theme state
	 */
	getThemeState(): ThemeState {
		const stored = this.getStoredTheme();
		const current = stored || 'system';
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
		const theme = stored || 'system';
		this.applyTheme(theme);
	}

	/**
	 * Listen to system preference changes
	 */
	watchSystemPreference(callback: (theme: EffectiveTheme) => void): () => void {
		if (typeof window === 'undefined') return () => {};

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handler = (e: MediaQueryListEvent) => {
			const newPreference = e.matches ? 'dark' : 'light';

			// If current theme is 'system', update automatically
			const currentTheme = this.getStoredTheme() || 'system';
			if (currentTheme === 'system') {
				this.applyTheme('system');
			}

			callback(newPreference);
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
export function getThemeInitScript(): string {
	const faviconPaths = JSON.stringify(THEME_FAVICON_PATHS);

	return `
    (function() {
      const storageKey = 'sandovaldavid-theme';
      const attribute = 'data-theme';
      const defaultTheme = 'system';
      const faviconPaths = ${faviconPaths};
      
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

      const favicon = document.getElementById('site-favicon');
      if (favicon && faviconPaths[effective]) {
        favicon.setAttribute('href', faviconPaths[effective]);
      }
    })();
  `;
}
