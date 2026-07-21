import type { Profile } from '../../../entities/profile/model/types';

export interface HeroMetadataItem {
	label: string;
	value: string;
}

export interface HeroPrimaryAction {
	label: string;
	href: string;
	external?: boolean;
}

export interface HeroCardProps {
	profile: Profile;
	variant?: 'default' | 'compact';
	availability?: string;
	metadata?: HeroMetadataItem[];
	primaryAction?: HeroPrimaryAction;
}