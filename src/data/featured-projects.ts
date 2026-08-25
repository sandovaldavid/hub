import type { FeaturedProject } from '@entities/featured-project/model/types';
import type { Lang } from '@shared/i18n';

const projects: Record<Lang, FeaturedProject[]> = {
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
			status: 'Stable v3.0.1 · active development',
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
				'Designed a .NET API using DDD and Clean Architecture — v1 complete and release-ready — with an Angular client migrating toward server-authoritative financial rules.',
			outcome:
				'Produced a versioned API foundation with explicit domain boundaries and an incremental path for product growth.',
			technologies: ['.NET', 'Angular', 'PostgreSQL', 'DDD', 'Keycloak'],
			status: 'API v1 complete · Web in active beta',
			repositoryAvailability: 'private',
			demoAvailability: 'unavailable',
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
			status: 'Estable v3.0.1 · desarrollo activo',
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
				'Diseñé una API en .NET con DDD y Clean Architecture — v1 completa y lista para release — junto a un cliente Angular en migración hacia reglas financieras autoritativas en el servidor.',
			outcome:
				'Construí una base de API versionada con límites de dominio explícitos y una ruta incremental para el crecimiento del producto.',
			technologies: ['.NET', 'Angular', 'PostgreSQL', 'DDD', 'Keycloak'],
			status: 'API v1 completa · Web en beta activa',
			repositoryAvailability: 'private',
			demoAvailability: 'unavailable',
			featured: true,
		},
	],
};

export const getFeaturedProjects = (lang: Lang): FeaturedProject[] => projects[lang].slice(0, 3);
