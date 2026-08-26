import type { Profile } from '@entities/profile/model/types';
import type { ConversionEvent } from '@shared/analytics/conversion';

export interface HeroMetadataItem {
	label: string;
	value: string;
}

export interface HeroPrimaryAction {
	label: string;
	href: string;
	external?: boolean;
	conversionEvent: ConversionEvent;
	conversionItem: string;
}

export interface HeroCardProps {
	profile: Profile;
	variant?: 'default' | 'compact';
	availability?: string;
	metadata?: HeroMetadataItem[];
	primaryAction?: HeroPrimaryAction;
}
