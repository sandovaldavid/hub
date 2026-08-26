import type { FeaturedProject } from '@entities/featured-project/model/types';
import type { Lang } from '@shared/i18n';

const projects: Record<Lang, FeaturedProject[]> = {
	en: [
		{
			id: 'kioku',
			title: 'Kioku · Persistent memory for AI agents',
			problem: 'Coding agents lose project context between sessions and repeat discovery work.',
			contribution:
				'Designed and maintain a .NET 10 MCP server that stores and retrieves structured project knowledge in Obsidian through MCP workflows.',
			outcome:
				'Published stable releases and public documentation while continuing branch-aware development without overstating adoption or production scale.',
			technologies: ['.NET 10', 'C#', 'MCP', 'Obsidian'],
			status: 'Stable release · active development',
			projectUrl: 'https://kioku.sandovaldavid.com',
			githubUrl: 'https://github.com/sandovaldavid/kioku',
			projectAvailability: 'public',
			repositoryAvailability: 'public',
			featured: true,
		},
		{
			id: 'yukidoke',
			title: 'Yukidoke · Household personal-finance product',
			problem:
				'Household finance software must combine shared and private data without moving financial authority into the browser.',
			contribution:
				'Design and maintain a .NET 10 modular-monolith API and Angular 22 client with Keycloak identity, PostgreSQL persistence and server-authoritative financial and privacy contracts.',
			outcome:
				'Privacy and network/bootstrap hardening are integrated; civil-time, member balances, settlements and final real-stack release evidence remain active work.',
			technologies: ['.NET 10', 'Angular 22', 'PostgreSQL', 'Keycloak'],
			status: 'Active V1 hardening · production unconfirmed',
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
				'Published a stable, documented operational workflow for repeatable setup and unattended capacity hunting without claiming guaranteed provisioning.',
			technologies: ['Bash', 'OCI CLI', 'systemd', 'Oracle Cloud'],
			status: 'Stable release',
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
				'Los agentes de programación pierden contexto entre sesiones y repiten trabajo de descubrimiento.',
			contribution:
				'Diseñé y mantengo un servidor MCP en .NET 10 que almacena y recupera conocimiento estructurado en Obsidian mediante flujos MCP.',
			outcome:
				'Publiqué releases estables y documentación pública mientras continúo el desarrollo por ramas sin exagerar adopción ni escala de producción.',
			technologies: ['.NET 10', 'C#', 'MCP', 'Obsidian'],
			status: 'Release estable · desarrollo activo',
			projectUrl: 'https://kioku.sandovaldavid.com',
			githubUrl: 'https://github.com/sandovaldavid/kioku',
			projectAvailability: 'public',
			repositoryAvailability: 'public',
			featured: true,
		},
		{
			id: 'yukidoke',
			title: 'Yukidoke · Producto de finanzas personales para hogares',
			problem:
				'El software financiero para hogares debe combinar datos compartidos y privados sin trasladar la autoridad financiera al navegador.',
			contribution:
				'Diseño y mantengo una API modular monolítica en .NET 10 y un cliente Angular 22 con identidad en Keycloak, persistencia PostgreSQL y contratos financieros y de privacidad autoritativos en el servidor.',
			outcome:
				'El hardening de privacidad y red/bootstrap está integrado; civil-time, balances entre miembros, settlements y la evidencia final real-stack siguen en desarrollo.',
			technologies: ['.NET 10', 'Angular 22', 'PostgreSQL', 'Keycloak'],
			status: 'Hardening V1 activo · producción no confirmada',
			projectAvailability: 'unavailable',
			repositoryAvailability: 'private',
			featured: true,
		},
		{
			id: 'oci-arm-hunter',
			title: 'OCI ARM Hunter · Automatización de capacidad en Oracle Cloud',
			problem:
				'La capacidad ARM Always Free puede no estar disponible al solicitar una instancia, haciendo que los reintentos manuales sean repetitivos y sensibles al tiempo.',
			contribution:
				'Construí una automatización en Bash sobre OCI CLI que reintenta solicitudes, rota Availability Domains, aplica cooldown con jitter, soporta ejecución desatendida con systemd y envía notificaciones de éxito.',
			outcome:
				'Publiqué un flujo operativo estable y documentado para configuración repetible y búsqueda desatendida de capacidad, sin afirmar aprovisionamiento garantizado.',
			technologies: ['Bash', 'OCI CLI', 'systemd', 'Oracle Cloud'],
			status: 'Release estable',
			projectUrl: 'https://oci.sandovaldavid.com',
			githubUrl: 'https://github.com/sandovaldavid/oci-arm-hunter',
			projectAvailability: 'public',
			repositoryAvailability: 'public',
			featured: true,
		},
	],
};

export const getFeaturedProjects = (lang: Lang): FeaturedProject[] => projects[lang].slice(0, 3);
