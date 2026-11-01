import { track } from '@vercel/analytics';

export const conversionEvents = [
	'resume_downloaded',
	'portfolio_opened',
	'github_opened',
	'linkedin_opened',
	'project_opened',
	'contact_clicked',
	'language_changed',
] as const;

export const conversionPositions = [
	'hero',
	'primary-cta',
	'social',
	'project',
	'contact',
	'navigation',
] as const;

export type ConversionEvent = (typeof conversionEvents)[number];
export type ConversionLocale = 'en' | 'es';
export type ConversionPosition = (typeof conversionPositions)[number];
export type ConversionSource = 'direct' | 'search' | 'social' | 'referral' | 'internal';

export interface ConversionProperties {
	[key: string]: string | undefined;
	locale: ConversionLocale;
	position: ConversionPosition;
	source: ConversionSource;
	item?: string;
}

const allowedEvents = new Set<string>(conversionEvents);
const allowedPositions = new Set<string>(conversionPositions);

const searchHosts = ['bing.com', 'duckduckgo.com'];
const searchBrandPattern = /^(google|yahoo)\.[a-z]{2,3}(\.[a-z]{2})?$/;

const socialHosts = [
	'linkedin.com',
	'github.com',
	'twitter.com',
	'x.com',
	'youtube.com',
	'youtu.be',
	'tiktok.com',
	'facebook.com',
	'instagram.com',
];

function matchesHost(host: string, domain: string): boolean {
	return host === domain || host.endsWith(`.${domain}`);
}

function isSearchHost(host: string): boolean {
	const labels = host.split('.');
	const suffixes = [labels.slice(-2).join('.'), labels.slice(-3).join('.')];

	return (
		suffixes.some(suffix => searchBrandPattern.test(suffix)) ||
		searchHosts.some(domain => matchesHost(host, domain))
	);
}

export function normalizeSource(referrer: string, currentHost: string): ConversionSource {
	if (!referrer) return 'direct';

	try {
		const host = new URL(referrer).hostname.toLowerCase().replace(/\.$/, '');
		const normalizedCurrentHost = currentHost.toLowerCase().replace(/\.$/, '');
		if (host === normalizedCurrentHost) return 'internal';
		if (isSearchHost(host)) return 'search';
		if (socialHosts.some(domain => matchesHost(host, domain))) return 'social';
		return 'referral';
	} catch {
		return 'direct';
	}
}

function isConversionEvent(value: string | undefined): value is ConversionEvent {
	return Boolean(value && allowedEvents.has(value));
}

function isConversionPosition(value: string | undefined): value is ConversionPosition {
	return Boolean(value && allowedPositions.has(value));
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

		const position = element.dataset.conversionPosition;
		if (!isConversionPosition(position)) return;

		const properties: ConversionProperties = { locale, position, source };
		const item = element.dataset.conversionItem;
		if (item) properties.item = item.slice(0, 64);

		track(eventName, properties);
	});
}
