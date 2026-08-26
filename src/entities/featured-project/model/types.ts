export type ProjectAvailability = 'public' | 'private' | 'unavailable';

export interface FeaturedProject {
	readonly id: string;
	title: string;
	problem: string;
	contribution: string;
	outcome: string;
	technologies: string[];
	status: string;
	projectUrl?: string;
	githubUrl?: string;
	projectAvailability: ProjectAvailability;
	repositoryAvailability: ProjectAvailability;
	featured: boolean;
}
