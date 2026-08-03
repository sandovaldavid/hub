import type { Skill } from '@widgets/skills-section';

// Import SVG icons
import DotnetIcon from '@shared/assets/tech-icons/dotnet.svg?raw';
import CSharpIcon from '@shared/assets/tech-icons/csharp.svg?raw';
import AngularIcon from '@shared/assets/tech-icons/angular.svg?raw';
import TypeScriptIcon from '@shared/assets/tech-icons/typescript.svg?raw';
import PostgresIcon from '@shared/assets/tech-icons/postgresql.svg?raw';
import SqlServerIcon from '@shared/assets/tech-icons/sqlserver.svg?raw';
import MongoIcon from '@shared/assets/tech-icons/mongodb.svg?raw';
import AstroIcon from '@shared/assets/tech-icons/astro.svg?raw';
import GitHubActionsIcon from '@shared/assets/tech-icons/githubactions.svg?raw';
import DockerIcon from '@shared/assets/tech-icons/docker.svg?raw';
import NodeIcon from '@shared/assets/tech-icons/nodejs.svg?raw';
import TailwindIcon from '@shared/assets/tech-icons/tailwindcss.svg?raw';
import FigmaIcon from '@shared/assets/tech-icons/figma.svg?raw';

export const skills: Skill[] = [
	// Verified core engineering stack (#93)
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
		id: 'postgresql',
		name: 'PostgreSQL',
		icon: PostgresIcon,
		category: 'backend',
	},
	{
		id: 'sqlserver',
		name: 'SQL Server',
		icon: SqlServerIcon,
		category: 'backend',
	},
	{
		id: 'mongodb',
		name: 'MongoDB',
		icon: MongoIcon,
		category: 'backend',
	},
	{
		id: 'astro',
		name: 'Astro',
		icon: AstroIcon,
		category: 'frontend',
	},
	{
		id: 'githubactions',
		name: 'GitHub Actions',
		icon: GitHubActionsIcon,
		category: 'tools',
	},
	{
		id: 'docker',
		name: 'Docker',
		icon: DockerIcon,
		category: 'tools',
	},
	{
		id: 'nodejs',
		name: 'Node.js',
		icon: NodeIcon,
		category: 'backend',
	},
	{
		id: 'tailwindcss',
		name: 'Tailwind CSS',
		icon: TailwindIcon,
		category: 'frontend',
	},
	{
		id: 'figma',
		name: 'Figma',
		icon: FigmaIcon,
		category: 'tools',
	},
];
