import en from './locales/en.json';
import es from './locales/es.json';

export type Lang = 'en' | 'es';
type TranslationDict = typeof en;

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

export function useTranslations(lang: Lang) {
	return function t(key: string): string {
		const value = resolvePath(translations[lang] as Record<string, unknown>, key);
		if (value === key) {
			return resolvePath(translations['en'] as Record<string, unknown>, key);
		}
		return value;
	};
}

export function getAlternateUrls(url: URL): { en: string; es: string } {
	const path = url.pathname.replace(/^\/es(\/|$)/, '/');
	return {
		en: path,
		es: path === '/' ? '/es/' : `/es${path}`,
	};
}
