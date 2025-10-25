import type { WeeklyProject } from '@entities/weekly-project';

export const weeklyProject: WeeklyProject = {
	id: 'weekly-002',
	title: 'Dashboard de Análisis de Sentimiento con IA',
	description:
		'Una herramienta de negocio que permite a las pymes cargar un archivo CSV o JSON con comentarios de clientes, analizar el sentimiento en lote (positivo, neutral, negativo) y visualizar los resultados en un dashboard interactivo.',
	image: {
		url: '/project/dashboard-sentimiento.webp',
		alt: 'Proyecto Dashboard de Análisis de Sentimiento con IA',
	},
	technologies: [
		'React',
		'Vite',
		'Django',
		'Python',
		'TextBlob',
		'pysentimiento',
		'Chart.js',
		'Tailwind CSS',
	],
	demoUrl: 'https://analizador-sentimientos.devsandoval.me',
	githubUrl: 'https://github.com/sandovaldavid/analizador-sentimientos-frontend',
	featured: true,
};
