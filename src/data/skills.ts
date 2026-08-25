import type { Skill } from '@entities/skill/model/types';

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

export const coreSkills: Skill[] = [
	{ id: 'dotnet', name: '.NET', icon: DotnetIcon, category: 'backend', tier: 'core' },
	{ id: 'csharp', name: 'C#', icon: CSharpIcon, category: 'backend', tier: 'core' },
	{ id: 'angular', name: 'Angular', icon: AngularIcon, category: 'frontend', tier: 'core' },
	{
		id: 'typescript',
		name: 'TypeScript',
		icon: TypeScriptIcon,
		category: 'frontend',
		tier: 'core',
	},
	{ id: 'postgresql', name: 'PostgreSQL', icon: PostgresIcon, category: 'backend', tier: 'core' },
	{ id: 'sqlserver', name: 'SQL Server', icon: SqlServerIcon, category: 'backend', tier: 'core' },
	{ id: 'mongodb', name: 'MongoDB', icon: MongoIcon, category: 'backend', tier: 'core' },
];

export const toolingSkills: Skill[] = [
	{ id: 'astro', name: 'Astro', icon: AstroIcon, category: 'frontend', tier: 'tooling' },
	{
		id: 'githubactions',
		name: 'GitHub Actions',
		icon: GitHubActionsIcon,
		category: 'tools',
		tier: 'tooling',
	},
	{ id: 'docker', name: 'Docker', icon: DockerIcon, category: 'tools', tier: 'tooling' },
	{ id: 'nodejs', name: 'Node.js', icon: NodeIcon, category: 'backend', tier: 'tooling' },
	{
		id: 'tailwindcss',
		name: 'Tailwind CSS',
		icon: TailwindIcon,
		category: 'frontend',
		tier: 'tooling',
	},
	{ id: 'figma', name: 'Figma', icon: FigmaIcon, category: 'tools', tier: 'tooling' },
];

export const skills: Skill[] = [...coreSkills, ...toolingSkills];
