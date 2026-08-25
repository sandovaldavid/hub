import type { Skill } from '@entities/skill/model/types';

export interface SkillsSectionProps {
	coreSkills: Skill[];
	toolingSkills: Skill[];
	title: string;
	coreTitle: string;
	toolsTitle: string;
}
