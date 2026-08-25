export type ProjectAvailability = 'public' | 'private' | 'unavailable';

export interface FeaturedProject {
	readonly id: string;
	title: string;
	problem: string;
	contribution: string;
	outcome: string;
	technologies: string[];
	status: string;
	demoUrl?: string;
	githubUrl?: string;
	repositoryAvailability: ProjectAvailability;
	demoAvailability: ProjectAvailability;
	featured: boolean;
}
