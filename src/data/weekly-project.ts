import type { WeeklyProject } from '@entities/weekly-project';

export const weeklyProject: WeeklyProject = {
	id: 'weekly-001',
	title: 'Generador de Ideas con IA',
	description:
		'Una micro-herramienta web que utiliza IA para generar ideas de contenido para redes sociales, ayudando a pymes y emprendedores a superar el bloqueo creativo.',
	image: {
		url: '/project/generador-ideas.webp',
		alt: 'Proyecto Generador de Ideas con IA',
	},
	technologies: ['React', 'Node.js', 'Elysia', 'Vite', 'IA'],
	demoUrl: 'https://generador-ideas-ai.devsandoval.me',
	githubUrl: 'https://github.com/sandovaldavid/generador-ideas-frontend',
	featured: true,
};
