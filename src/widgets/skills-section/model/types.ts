export interface Skill {
	id: string;
	name: string;
	icon?: string;
	category: 'frontend' | 'backend' | 'tools' | 'cloud' | 'ai';
	tier?: 'core' | 'tooling';
}

export interface SkillsSectionProps {
	skills?: Skill[];
	coreSkills?: Skill[];
	toolingSkills?: Skill[];
	title?: string;
	coreTitle?: string;
	toolsTitle?: string;
}
