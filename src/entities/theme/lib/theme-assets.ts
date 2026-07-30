import type { EffectiveTheme } from '../model/types';

export const THEME_FAVICON_PATHS: Record<EffectiveTheme, string> = {
	light: '/favicon.light.svg',
	dark: '/favicon.dark.svg',
};

export function getFaviconPath(effectiveTheme: EffectiveTheme): string {
	return THEME_FAVICON_PATHS[effectiveTheme];
}

export function updateFavicon(effectiveTheme: EffectiveTheme): void {
	if (typeof document === 'undefined') return;

	const favicon = document.getElementById('site-favicon');
	if (!favicon) return;

	favicon.setAttribute('href', getFaviconPath(effectiveTheme));
}
