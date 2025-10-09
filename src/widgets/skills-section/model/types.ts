export interface Skill {
	id: string;
	name: string;
	icon?: string;
	category: 'frontend' | 'backend' | 'tools' | 'cloud' | 'ai';
}

export interface SkillsSectionProps {
	skills: Skill[];
	title?: string;
	variant?: 'compact' | 'default';
}
