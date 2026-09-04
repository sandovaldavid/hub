import type { ConversionEvent } from '@shared/analytics/conversion';

export type CtaId = 'portfolio' | 'resume';
export type CtaIcon = 'portfolio' | 'briefcase';
export type CtaVariant = 'primary' | 'secondary';

export interface CtaDefinition {
	id: CtaId;
	icon: CtaIcon;
	href: string;
	variant: CtaVariant;
	external: boolean;
	conversionEvent: ConversionEvent;
}

export interface LocalizedCtaButton extends CtaDefinition {
	title: string;
	description?: string;
	label: string;
}
