import type { WeeklyProject } from '@entities/weekly-project';
import type { Lang } from '@shared/i18n';

const projects: Record<Lang, WeeklyProject[]> = {
	en: [
		{
			id: 'kioku',
			title: 'Kioku · Persistent memory for AI agents',
			problem: 'Coding agents lose project context between sessions and repeat discovery work.',
			contribution:
				'Designed a .NET 10 MCP server and Obsidian integration for storing and retrieving structured project knowledge.',
			outcome:
				'Established a reusable memory workflow for Claude Code, Codex and other MCP-compatible agents.',
			technologies: ['.NET 10', 'C#', 'MCP', 'Obsidian'],
			status: 'Active development',
			githubUrl: 'https://github.com/sandovaldavid/kioku',
			repositoryAvailability: 'public',
			demoAvailability: 'unavailable',
			featured: true,
		},
		{
			id: 'yukidoke',
			title: 'Yukidoke · Financial health platform',
			problem:
				'Households need one place to understand debt cycles, income, expenses and repayment progress.',
			contribution:
				'Defined a scalable DDD and Clean Architecture backend with PostgreSQL, Keycloak and UTC-safe financial cycles.',
			outcome:
				'Produced a versioned API foundation designed for gradual product growth and multi-user workloads.',
			technologies: ['.NET', 'PostgreSQL', 'DDD', 'Keycloak'],
			status: 'Private product in development',
			repositoryAvailability: 'private',
			demoAvailability: 'unavailable',
			featured: true,
		},
		{
			id: 'hub',
			title: 'Professional engineering hub',
			problem:
				'Recruiters need a fast, accessible overview of projects, professional profiles and contact paths.',
			contribution:
				'Built a bilingual Astro hub with typed content, automated accessibility, SEO and Playwright coverage.',
			outcome:
				'Created a maintainable public entry point connecting the portfolio, resume and engineering work.',
			technologies: ['Astro', 'TypeScript', 'Playwright', 'Tailwind CSS'],
			status: 'Live',
			demoUrl: 'https://hub.sandovaldavid.com',
			repositoryAvailability: 'private',
			demoAvailability: 'public',
			featured: true,
		},
	],
	es: [
		{
			id: 'kioku',
			title: 'Kioku · Memoria persistente para agentes de IA',
			problem:
				'Los agentes de programación pierden contexto entre sesiones y repiten trabajo de descubrimiento.',
			contribution:
				'Diseñé un servidor MCP en .NET 10 y una integración con Obsidian para guardar y recuperar conocimiento estructurado.',
			outcome:
				'Establecí un flujo de memoria reutilizable para Claude Code, Codex y otros agentes compatibles con MCP.',
			technologies: ['.NET 10', 'C#', 'MCP', 'Obsidian'],
			status: 'Desarrollo activo',
			githubUrl: 'https://github.com/sandovaldavid/kioku',
			repositoryAvailability: 'public',
			demoAvailability: 'unavailable',
			featured: true,
		},
		{
			id: 'yukidoke',
			title: 'Yukidoke · Plataforma de salud financiera',
			problem:
				'Los hogares necesitan comprender ciclos de deuda, ingresos, gastos y progreso de pago en un solo lugar.',
			contribution:
				'Definí un backend escalable con DDD, Clean Architecture, PostgreSQL, Keycloak y ciclos financieros en UTC.',
			outcome:
				'Construí una base de API versionada preparada para crecimiento gradual y cargas multiusuario.',
			technologies: ['.NET', 'PostgreSQL', 'DDD', 'Keycloak'],
			status: 'Producto privado en desarrollo',
			repositoryAvailability: 'private',
			demoAvailability: 'unavailable',
			featured: true,
		},
		{
			id: 'hub',
			title: 'Hub profesional de ingeniería',
			problem:
				'Los reclutadores necesitan una vista rápida y accesible de proyectos, perfiles y canales de contacto.',
			contribution:
				'Construí un hub bilingüe en Astro con contenido tipado, accesibilidad, SEO y pruebas Playwright.',
			outcome:
				'Creé un punto de entrada público y mantenible para conectar portafolio, CV y trabajo técnico.',
			technologies: ['Astro', 'TypeScript', 'Playwright', 'Tailwind CSS'],
			status: 'En producción',
			demoUrl: 'https://hub.sandovaldavid.com',
			repositoryAvailability: 'private',
			demoAvailability: 'public',
			featured: true,
		},
	],
};

export const getFeaturedProjects = (lang: Lang): WeeklyProject[] => projects[lang].slice(0, 3);
