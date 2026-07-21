import { track } from '@vercel/analytics';

export const conversionEvents = [
	'resume_downloaded',
	'portfolio_opened',
	'github_opened',
	'linkedin_opened',
	'project_opened',
	'contact_clicked',
	'calendly_opened',
	'language_changed',
] as const;

export type ConversionEvent = (typeof conversionEvents)[number];
export type ConversionLocale = 'en' | 'es';
export type ConversionPosition = 'hero' | 'primary-cta' | 'social' | 'project' | 'contact' | 'navigation';
export type ConversionSource = 'direct' | 'search' | 'social' | 'referral' | 'internal';

export interface ConversionProperties {
	[key: string]: string | undefined;
	locale: ConversionLocale;
	position: ConversionPosition;
	source: ConversionSource;
	item?: string;
}

const allowedEvents = new Set<string>(conversionEvents);

function normalizeSource(referrer: string, currentHost: string): ConversionSource {
	if (!referrer) return 'direct';

	try {
		const host = new URL(referrer).hostname.toLowerCase();
		if (host === currentHost) return 'internal';
		if (/google\.|bing\.|duckduckgo\.|yahoo\./.test(host)) return 'search';
		if (/linkedin\.|github\.|twitter\.|x\.com|youtube\.|facebook\.|instagram\./.test(host)) {
			return 'social';
		}
		return 'referral';
	} catch {
		return 'direct';
	}
}

function isConversionEvent(value: string | undefined): value is ConversionEvent {
	return Boolean(value && allowedEvents.has(value));
}

export function initConversionAnalytics(): void {
	const locale: ConversionLocale = document.documentElement.lang === 'es' ? 'es' : 'en';
	const source = normalizeSource(document.referrer, window.location.hostname);

	document.addEventListener('click', event => {
		const target = event.target;
		if (!(target instanceof Element)) return;

		const element = target.closest<HTMLElement>('[data-conversion-event]');
		if (!element) return;

		const eventName = element.dataset.conversionEvent;
		if (!isConversionEvent(eventName)) return;

		const position = element.dataset.conversionPosition as ConversionPosition | undefined;
		if (!position) return;

		const properties: ConversionProperties = {
			locale,
			position,
			source,
		};

		const item = element.dataset.conversionItem;
		if (item) properties.item = item.slice(0, 64);

		track(eventName, properties);
	});
}
