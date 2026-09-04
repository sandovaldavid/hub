import type { FeaturedProject } from '@entities/featured-project/model/types';
import type { Lang } from '@shared/i18n';

const projects: Record<Lang, FeaturedProject[]> = {
	en: [
		{
			id: 'kioku',
			title: 'Kioku · Persistent memory for AI agents',
			summary:
				'A local-first .NET MCP server that keeps structured Obsidian knowledge available across AI-agent sessions.',
			projectUrl: 'https://kioku.sandovaldavid.com',
			githubUrl: 'https://github.com/sandovaldavid/kioku',
			projectAvailability: 'public',
			repositoryAvailability: 'public',
			featured: true,
		},
		{
			id: 'yukidoke',
			title: 'Yukidoke · Household finance platform',
			summary: 'A private household finance app with a .NET backend and Angular frontend.',
			caseStudyUrl: 'https://sandovaldavid.com/projects/yukidoke',
			projectAvailability: 'unavailable',
			repositoryAvailability: 'private',
			featured: true,
		},
		{
			id: 'oci-arm-hunter',
			title: 'OCI ARM Hunter · Oracle Cloud capacity automation',
			summary:
				'A Bash and OCI CLI tool that retries ARM instance creation across Oracle Cloud Availability Domains.',
			projectUrl: 'https://oci.sandovaldavid.com',
			githubUrl: 'https://github.com/sandovaldavid/oci-arm-hunter',
			projectAvailability: 'public',
			repositoryAvailability: 'public',
			featured: true,
		},
	],
	es: [
		{
			id: 'kioku',
			title: 'Kioku · Memoria persistente para agentes de IA',
			summary:
				'Un servidor MCP local-first en .NET que mantiene conocimiento estructurado de Obsidian disponible entre sesiones de agentes de IA.',
			projectUrl: 'https://kioku.sandovaldavid.com',
			githubUrl: 'https://github.com/sandovaldavid/kioku',
			projectAvailability: 'public',
			repositoryAvailability: 'public',
			featured: true,
		},
		{
			id: 'yukidoke',
			title: 'Yukidoke · Plataforma financiera para hogares',
			summary:
				'Una aplicación privada de finanzas para hogares con backend .NET y frontend Angular.',
			caseStudyUrl: 'https://sandovaldavid.com/es/projects/yukidoke',
			projectAvailability: 'unavailable',
			repositoryAvailability: 'private',
			featured: true,
		},
		{
			id: 'oci-arm-hunter',
			title: 'OCI ARM Hunter · Automatización de capacidad en Oracle Cloud',
			summary:
				'Una herramienta en Bash y OCI CLI que reintenta la creación de instancias ARM entre Availability Domains de Oracle Cloud.',
			projectUrl: 'https://oci.sandovaldavid.com',
			githubUrl: 'https://github.com/sandovaldavid/oci-arm-hunter',
			projectAvailability: 'public',
			repositoryAvailability: 'public',
			featured: true,
		},
	],
};

export const getFeaturedProjects = (lang: Lang): FeaturedProject[] =>
	projects[lang].filter(project => project.featured).slice(0, 3);
