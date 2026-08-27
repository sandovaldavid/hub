import type { FeaturedProject } from '@entities/featured-project/model/types';
import type { Lang } from '@shared/i18n';

const projects: Record<Lang, FeaturedProject[]> = {
	en: [
		{
			id: 'kioku',
			title: 'Kioku · Persistent memory for AI agents',
			problem: 'Coding agents lose project context between sessions and repeat discovery work.',
			contribution:
				'Designed and maintain a local-first .NET 10 MCP server that preserves structured project knowledge in Obsidian and retrieves it across AI-agent sessions.',
			outcome:
				'Released with versioned packages and public documentation covering installation, security, and engineering workflows.',
			technologies: ['.NET 10', 'C#', 'MCP', 'Obsidian'],
			status: 'Released · active development',
			projectUrl: 'https://kioku.sandovaldavid.com',
			githubUrl: 'https://github.com/sandovaldavid/kioku',
			projectAvailability: 'public',
			repositoryAvailability: 'public',
			featured: true,
		},
		{
			id: 'yukidoke',
			title: 'Yukidoke · Household finance platform',
			problem:
				'Households need one place to track money, debt, planning, and financial health while keeping each member’s access consistent.',
			contribution:
				'Design and maintain the .NET 10 modular-monolith backend and Angular 22 client, using Keycloak and PostgreSQL to keep authorization, calculations, and financial rules server-authoritative.',
			outcome:
				'The current V1 baseline covers household identity, accounting, debt, planning, notifications, and financial-health workflows; development continues on privacy and cross-service reliability.',
			technologies: ['.NET 10', 'Angular 22', 'PostgreSQL', 'Keycloak'],
			status: 'Active development',
			caseStudyUrl: 'https://sandovaldavid.com/projects/yukidoke',
			projectAvailability: 'unavailable',
			repositoryAvailability: 'private',
			featured: true,
		},
		{
			id: 'oci-arm-hunter',
			title: 'OCI ARM Hunter · Oracle Cloud capacity automation',
			problem:
				'ARM Always Free capacity can be unavailable when an instance request is made, making manual retries repetitive and time-sensitive.',
			contribution:
				'Built a Bash automation around OCI CLI that retries requests, rotates Availability Domains, applies cooldown jitter, supports unattended systemd execution and sends success notifications.',
			outcome:
				'Released as a documented MIT-licensed tool with guided setup, unattended systemd execution, and success notifications.',
			technologies: ['Bash', 'OCI CLI', 'systemd', 'Oracle Cloud'],
			status: 'Released',
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
			problem:
				'Los agentes de programación pierden contexto entre sesiones y terminan repitiendo trabajo de descubrimiento.',
			contribution:
				'Diseñé y mantengo un servidor MCP local-first en .NET 10 que conserva conocimiento estructurado en Obsidian y lo recupera entre sesiones de agentes de IA.',
			outcome:
				'Publicado con paquetes versionados y documentación pública sobre instalación, seguridad y flujos de ingeniería.',
			technologies: ['.NET 10', 'C#', 'MCP', 'Obsidian'],
			status: 'Publicado · desarrollo activo',
			projectUrl: 'https://kioku.sandovaldavid.com',
			githubUrl: 'https://github.com/sandovaldavid/kioku',
			projectAvailability: 'public',
			repositoryAvailability: 'public',
			featured: true,
		},
		{
			id: 'yukidoke',
			title: 'Yukidoke · Plataforma financiera para hogares',
			problem:
				'Una plataforma financiera compartida debe centralizar dinero, deudas y planificación sin perder el control de acceso de cada miembro del hogar.',
			contribution:
				'Diseño y mantengo el backend .NET 10 como monolito modular y el cliente Angular 22; Keycloak y PostgreSQL sostienen la autorización, los cálculos y las reglas financieras del lado del servidor.',
			outcome:
				'La base V1 actual cubre identidad del hogar, contabilidad, deudas, planificación, notificaciones y salud financiera; el desarrollo continúa en privacidad y confiabilidad entre componentes.',
			technologies: ['.NET 10', 'Angular 22', 'PostgreSQL', 'Keycloak'],
			status: 'Desarrollo activo',
			caseStudyUrl: 'https://sandovaldavid.com/es/projects/yukidoke',
			projectAvailability: 'unavailable',
			repositoryAvailability: 'private',
			featured: true,
		},
		{
			id: 'oci-arm-hunter',
			title: 'OCI ARM Hunter · Automatización de capacidad en Oracle Cloud',
			problem:
				'La capacidad ARM Always Free puede agotarse al solicitar una instancia, convirtiendo los reintentos manuales en una tarea repetitiva y sensible al tiempo.',
			contribution:
				'Construí una automatización en Bash sobre OCI CLI que reintenta solicitudes, rota Availability Domains, aplica cooldown con jitter, ejecuta de forma desatendida con systemd y envía notificaciones de éxito.',
			outcome:
				'Publicado como herramienta MIT documentada, con configuración guiada, ejecución desatendida mediante systemd y notificaciones de éxito.',
			technologies: ['Bash', 'OCI CLI', 'systemd', 'Oracle Cloud'],
			status: 'Publicado',
			projectUrl: 'https://oci.sandovaldavid.com',
			githubUrl: 'https://github.com/sandovaldavid/oci-arm-hunter',
			projectAvailability: 'public',
			repositoryAvailability: 'public',
			featured: true,
		},
	],
};

export const getFeaturedProjects = (lang: Lang): FeaturedProject[] => projects[lang].slice(0, 3);
