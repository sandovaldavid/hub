/**
 * Profile Entity - FSD Layer: entities/profile
 * Personal profile information and branding
 */

export interface Profile {
	name: string;
	tagline?: string;
	bio?: string;
	avatar: {
		url: string;
		alt: string;
	};
	logo: {
		url: string;
	};
	contact: {
		email: string;
	};
}
