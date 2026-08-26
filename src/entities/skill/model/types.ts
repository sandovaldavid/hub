export interface Skill {
	id: string;
	name: string;
	icon?: string;
	category: 'frontend' | 'backend' | 'tools' | 'cloud' | 'ai';
	tier: 'core' | 'tooling';
}
