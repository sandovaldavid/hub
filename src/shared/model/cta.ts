import type { ConversionEvent } from '@shared/analytics/conversion';

export type CtaId = 'portfolio' | 'projects' | 'github' | 'contact';
export type CtaIcon = 'briefcase' | 'rocket' | 'github' | 'email';
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
}
