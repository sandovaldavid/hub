export type ProjectAvailability = 'public' | 'private' | 'unavailable';

export interface FeaturedProject {
	readonly id: string;
	title: string;
	summary: string;
	projectUrl?: string;
	githubUrl?: string;
	caseStudyUrl?: string;
	projectAvailability: ProjectAvailability;
	repositoryAvailability: ProjectAvailability;
	featured: boolean;
}
