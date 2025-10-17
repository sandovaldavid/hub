export interface WeeklyProject {
	readonly id: string;
	title: string;
	description: string;
	image: {
		url: string;
		alt: string;
	};
	technologies: string[];
	demoUrl?: string;
	githubUrl?: string;
	featured: boolean;
}

export type WeeklyProjectCardProps = {
	project: WeeklyProject;
	variant?: 'default' | 'compact';
};
