import type { Skill } from '@widgets/skills-section';

// Import SVG icons
import DotnetIcon from '@shared/assets/tech-icons/dotnet.svg?raw';
import CSharpIcon from '@shared/assets/tech-icons/csharp.svg?raw';
import AngularIcon from '@shared/assets/tech-icons/angular.svg?raw';
import TypeScriptIcon from '@shared/assets/tech-icons/typescript.svg?raw';
import NodeIcon from '@shared/assets/tech-icons/nodejs.svg?raw';
import AstroIcon from '@shared/assets/tech-icons/astro.svg?raw';
import TailwindIcon from '@shared/assets/tech-icons/tailwindcss.svg?raw';
import DockerIcon from '@shared/assets/tech-icons/docker.svg?raw';
import Figma from '@shared/assets/tech-icons/figma.svg?raw';
import ReactIcon from '@shared/assets/tech-icons/react.svg?raw';
import NextIcon from '@shared/assets/tech-icons/nextjs.svg?raw';
import PythonIcon from '@shared/assets/tech-icons/python.svg?raw';
import DjangoIcon from '@shared/assets/tech-icons/django.svg?raw';
import ClaudflareIcon from '@shared/assets/tech-icons/cloudflare.svg?raw';
import ClaudinaryIcon from '@shared/assets/tech-icons/cloudinary.svg?raw';
import N8nIcon from '@shared/assets/tech-icons/n8n.svg?raw';
import GeminiIcon from '@shared/assets/tech-icons/gemini.svg?raw';
import OpenAIIcon from '@shared/assets/tech-icons/openai.svg?raw';
import ClaudeIcon from '@shared/assets/tech-icons/claude.svg?raw';

export const skills: Skill[] = [
	// Verified current professional core (Professional Profile, EV-KIOKU-001, EV-YUKIDOKE-001).
	{
		id: 'dotnet',
		name: '.NET',
		icon: DotnetIcon,
		category: 'backend',
	},
	{
		id: 'csharp',
		name: 'C#',
		icon: CSharpIcon,
		category: 'backend',
	},
	{
		id: 'angular',
		name: 'Angular',
		icon: AngularIcon,
		category: 'frontend',
	},
	{
		id: 'typescript',
		name: 'TypeScript',
		icon: TypeScriptIcon,
		category: 'frontend',
	},
	{
		id: 'nodejs',
		name: 'Node.js',
		icon: NodeIcon,
		category: 'backend',
	},
	{
		id: 'astro',
		name: 'Astro',
		icon: AstroIcon,
		category: 'frontend',
	},
	{
		id: 'tailwindcss',
		name: 'Tailwind CSS',
		icon: TailwindIcon,
		category: 'frontend',
	},
	{
		id: 'docker',
		name: 'Docker',
		icon: DockerIcon,
		category: 'tools',
	},
	{
		id: 'figma',
		name: 'Figma',
		icon: Figma,
		category: 'tools',
	},
	// Supporting/exploratory tools — kept pending a follow-up evidence-trim decision
	// (see Cortex-L7 hub issue #60 plan, decision point 2).
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
		id: 'django',
		name: 'Django',
		icon: DjangoIcon,
		category: 'backend',
	},
	{
		id: 'cloudflare',
		name: 'Cloudflare',
		icon: ClaudflareIcon,
		category: 'cloud',
	},
	{
		id: 'cloudinary',
		name: 'Cloudinary',
		icon: ClaudinaryIcon,
		category: 'cloud',
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
		category: 'ai',
	},
	{
		id: 'openai',
		name: 'OpenAI',
		icon: OpenAIIcon,
		category: 'ai',
	},
	{
		id: 'claude',
		name: 'Claude',
		icon: ClaudeIcon,
		category: 'ai',
	},
];
