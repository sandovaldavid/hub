import type { ConversionEvent } from '@shared/analytics/conversion';

export type CtaId = 'portfolio' | 'resume';
export type CtaIcon = 'portfolio' | 'briefcase';

export interface CtaDefinition {
	id: CtaId;
	icon: CtaIcon;
	href: string;
	external: boolean;
	conversionEvent: ConversionEvent;
}

export interface LocalizedCtaButton extends CtaDefinition {
	title: string;
	description?: string;
	label: string;
}
