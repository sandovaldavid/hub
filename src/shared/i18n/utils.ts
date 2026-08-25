import en from './locales/en.json';
import es from './locales/es.json';

export type Lang = 'en' | 'es';
type TranslationDict = typeof en;
type TranslationParams = Record<string, string | number>;

const translations: Record<Lang, TranslationDict> = { en, es };

function resolvePath(obj: Record<string, unknown>, path: string): string {
	const result = path.split('.').reduce<unknown>((acc, key) => {
		if (acc && typeof acc === 'object') {
			return (acc as Record<string, unknown>)[key];
		}
		return undefined;
	}, obj);
	return typeof result === 'string' ? result : path;
}

function interpolate(value: string, params: TranslationParams): string {
	return value.replace(/\{(\w+)\}/g, (placeholder, key: string) => {
		const replacement = params[key];
		return replacement === undefined ? placeholder : String(replacement);
	});
}

export function useTranslations(lang: Lang) {
	return function t(key: string, params: TranslationParams = {}): string {
		const localized = resolvePath(translations[lang] as Record<string, unknown>, key);
		const value =
			localized === key ? resolvePath(translations.en as Record<string, unknown>, key) : localized;
		return interpolate(value, params);
	};
}

export function getAlternateUrls(url: URL): { en: string; es: string } {
	const path = url.pathname.replace(/^\/es(\/|$)/, '/');
	return {
		en: path,
		es: path === '/' ? '/es/' : `/es${path}`,
	};
}
