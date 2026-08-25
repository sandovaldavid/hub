/** Theme management business logic. */
import type { EffectiveTheme, Theme, ThemeState } from '../model/types';
import { THEME_FAVICON_PATHS, updateFavicon } from './theme-assets';

export const THEME_STORAGE_KEY = 'sandovaldavid-theme';

export class ThemeManager {
	getSystemPreference(): 'light' | 'dark' {
		if (typeof window === 'undefined') return 'light';
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	getStoredTheme(): Theme | null {
		if (typeof window === 'undefined') return null;
		try {
			const stored = localStorage.getItem(THEME_STORAGE_KEY);
			return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : null;
		} catch {
			return null;
		}
	}

	setStoredTheme(theme: Theme): void {
		if (typeof window === 'undefined') return;
		try {
			localStorage.setItem(THEME_STORAGE_KEY, theme);
		} catch {
			// Persistence is an enhancement; applying the selected theme must still work.
		}
	}

	resolveEffectiveTheme(theme: Theme): 'light' | 'dark' {
		return theme === 'system' ? this.getSystemPreference() : theme;
	}

	applyTheme(theme: Theme): void {
		if (typeof document === 'undefined') return;
		const effectiveTheme = this.resolveEffectiveTheme(theme);
		document.documentElement.setAttribute('data-theme', effectiveTheme);
		updateFavicon(effectiveTheme);
	}

	getThemeState(): ThemeState {
		const stored = this.getStoredTheme();
		const current = stored || 'system';
		const systemPreference = this.getSystemPreference();
		return { current, effective: this.resolveEffectiveTheme(current), systemPreference };
	}

	setTheme(theme: Theme): ThemeState {
		this.setStoredTheme(theme);
		this.applyTheme(theme);
		return this.getThemeState();
	}

	cycleTheme(): ThemeState {
		const current = this.getThemeState().current;
		const nextTheme: Theme = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
		return this.setTheme(nextTheme);
	}

	initialize(): void {
		this.applyTheme(this.getStoredTheme() || 'system');
	}

	/** Re-applies the resolved theme when the OS preference changes while in `system` mode. */
	watchSystemPreference(callback?: (theme: EffectiveTheme) => void): () => void {
		if (typeof window === 'undefined') return () => {};
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = (event: MediaQueryListEvent) => {
			const newPreference = event.matches ? 'dark' : 'light';
			if ((this.getStoredTheme() || 'system') === 'system') this.applyTheme('system');
			callback?.(newPreference);
		};
		mediaQuery.addEventListener('change', handler);
		return () => mediaQuery.removeEventListener('change', handler);
	}
}

export function getThemeInitScript(): string {
	const faviconPaths = JSON.stringify(THEME_FAVICON_PATHS);
	return `
    (function() {
      const storageKey = ${JSON.stringify(THEME_STORAGE_KEY)};
      const attribute = 'data-theme';
      const defaultTheme = 'system';
      const faviconPaths = ${faviconPaths};
      function getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      function resolveTheme(theme) {
        return theme === 'system' ? getSystemPreference() : theme;
      }
      let stored = null;
      try { stored = localStorage.getItem(storageKey); } catch {}
      const theme = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : defaultTheme;
      const effective = resolveTheme(theme);
      document.documentElement.setAttribute(attribute, effective);
      const favicon = document.getElementById('site-favicon');
      if (favicon && faviconPaths[effective]) favicon.setAttribute('href', faviconPaths[effective]);
    })();
  `;
}
