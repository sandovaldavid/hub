import type { Skill } from '@widgets/skills-section';

// Import SVG icons
import ReactIcon from '@shared/assets/tech-icons/react.svg?raw';
import NextIcon from '@shared/assets/tech-icons/nextjs.svg?raw';
import PythonIcon from '@shared/assets/tech-icons/python.svg?raw';
import AstroIcon from '@shared/assets/tech-icons/astro.svg?raw';
import NodeIcon from '@shared/assets/tech-icons/nodejs.svg?raw';
import AngularIcon from '@shared/assets/tech-icons/angular.svg?raw';
import N8nIcon from '@shared/assets/tech-icons/n8n.svg?raw';
import GeminiIcon from '@shared/assets/tech-icons/gemini.svg?raw';
import OpenAIIcon from '@shared/assets/tech-icons/openai.svg?raw';
import ClaudeIcon from '@shared/assets/tech-icons/claude.svg?raw';

export const skills: Skill[] = [
	{
		id: 'react',
		name: 'React',
		icon: ReactIcon,
		category: 'frontend',
	},
	{
		id: 'nextjs',
		name: 'Next.js',
		icon: NextIcon,
		category: 'frontend',
	},
	{
		id: 'python',
		name: 'Python',
		icon: PythonIcon,
		category: 'backend',
	},
	{
		id: 'astro',
		name: 'Astro',
		icon: AstroIcon,
		category: 'frontend',
	},
	{
		id: 'nodejs',
		name: 'Node.js',
		icon: NodeIcon,
		category: 'backend',
	},
	{
		id: 'angular',
		name: 'Angular',
		icon: AngularIcon,
		category: 'frontend',
	},
	{
		id: 'n8n',
		name: 'n8n',
		icon: N8nIcon,
		category: 'tools',
	},
	{
		id: 'gemini',
		name: 'Gemini',
		icon: GeminiIcon,
		category: 'cloud',
	},
	{
		id: 'openai',
		name: 'OpenAI',
		icon: OpenAIIcon,
		category: 'cloud',
	},
	{
		id: 'claude',
		name: 'Claude',
		icon: ClaudeIcon,
		category: 'cloud',
	},
];
