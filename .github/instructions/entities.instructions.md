# Entities Layer Instructions

## Purpose
Entities represent business entities and domain models. They contain the core business logic, data structures, and operations related to specific business concepts in your portfolio application.

## What belongs here:
- Business entities and domain models
- Data types and interfaces
- Business logic and rules
- Entity-specific operations
- Data validation and transformation
- Entity-related UI components

## Structure:
```
src/entities/
├── user/
│   ├── ui/
│   │   ├── UserCard.astro
│   │   └── Avatar.astro
│   ├── model/
│   │   ├── types.ts
│   │   └── validation.ts
│   ├── api/
│   │   └── user-api.ts
│   ├── lib/
│   │   └── user-utils.ts
│   └── index.ts
├── project/
│   ├── ui/
│   │   ├── ProjectCard.astro
│   │   └── ProjectDetail.astro
│   ├── model/
│   │   ├── types.ts
│   │   └── schema.ts
│   ├── api/
│   │   └── projects-api.ts
│   ├── lib/
│   │   └── project-utils.ts
│   └── index.ts
└── experience/
    ├── ui/
    │   └── ExperienceCard.astro
    ├── model/
    │   └── types.ts
    └── index.ts
```

## Rules for this layer:
- ✅ Can import from: shared only
- ❌ Cannot import from: app, pages, widgets, features, other entities (except via @x notation)
- ✅ Should contain domain-specific logic and business rules
- ❌ Should not contain UI logic, feature-specific code, or application concerns
- ✅ May use @x notation for necessary cross-entity references (e.g., entities/song/@x/artist)

## Entity Examples:

### Project Entity
```typescript
// src/entities/project/model/types.ts
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: Technology[];
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  imageUrl?: string;
  demoUrl?: string;
  codeUrl?: string;
  featured: boolean;
  tags: string[];
}

export interface Technology {
  id: string;
  name: string;
  iconUrl?: string;
  color?: string;
  category: TechCategory;
}

export enum ProjectCategory {
  WEB = 'web',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
  API = 'api',
  LIBRARY = 'library'
}

export enum ProjectStatus {
  COMPLETED = 'completed',
  IN_PROGRESS = 'in-progress',
  PLANNED = 'planned',
  ON_HOLD = 'on-hold'
}

export enum TechCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  DEVOPS = 'devops',
  MOBILE = 'mobile'
}
```

### Project Card Component
```astro
---
// src/entities/project/ui/ProjectCard.astro
import { Card, Badge, Button } from '../../../shared/ui';
import type { Project } from '../model/types';
import { formatDate, getStatusColor } from '../lib/project-utils';

interface Props {
  project: Project;
  compact?: boolean;
}

const { project, compact = false } = Astro.props;
const statusColor = getStatusColor(project.status);
---

<Card className={`project-card ${compact ? 'project-card--compact' : ''}`}>
  {project.imageUrl && (
    <div class="project-card__image">
      <img src={project.imageUrl} alt={project.title} loading="lazy" />
    </div>
  )}
  
  <div class="project-card__content">
    <div class="project-card__header">
      <h3 class="project-card__title">{project.title}</h3>
      <Badge variant={statusColor} size="sm">
        {project.status}
      </Badge>
    </div>
    
    <p class="project-card__description">
      {project.description}
    </p>
    
    <div class="project-card__technologies">
      {project.technologies.slice(0, 4).map(tech => (
        <Badge key={tech.id} variant="outline" size="xs">
          {tech.name}
        </Badge>
      ))}
      {project.technologies.length > 4 && (
        <span class="project-card__tech-more">
          +{project.technologies.length - 4} more
        </span>
      )}
    </div>
    
    {!compact && (
      <div class="project-card__meta">
        <span class="project-card__date">
          {formatDate(project.startDate)}
        </span>
        <span class="project-card__category">
          {project.category}
        </span>
      </div>
    )}
    
    <div class="project-card__actions">
      {project.demoUrl && (
        <Button size="sm" variant="outline" href={project.demoUrl}>
          Live Demo
        </Button>
      )}
      {project.codeUrl && (
        <Button size="sm" variant="ghost" href={project.codeUrl}>
          View Code
        </Button>
      )}
    </div>
  </div>
</Card>

<style>
  .project-card {
    /* Project card specific styles */
  }
</style>
```

### Project Utilities
```typescript
// src/entities/project/lib/project-utils.ts
import type { Project, ProjectStatus } from '../model/types';

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short'
  }).format(date);
}

export function getStatusColor(status: ProjectStatus): string {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in-progress':
      return 'warning';
    case 'planned':
      return 'info';
    case 'on-hold':
      return 'muted';
    default:
      return 'default';
  }
}

export function filterProjectsByTechnology(
  projects: Project[],
  technologyId: string
): Project[] {
  return projects.filter(project => 
    project.technologies.some(tech => tech.id === technologyId)
  );
}

export function getProjectsByCategory(
  projects: Project[],
  category: string
): Project[] {
  return projects.filter(project => project.category === category);
}

export function sortProjectsByDate(
  projects: Project[],
  order: 'asc' | 'desc' = 'desc'
): Project[] {
  return [...projects].sort((a, b) => {
    const dateA = a.startDate.getTime();
    const dateB = b.startDate.getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}
```

### Experience Entity
```typescript
// src/entities/experience/model/types.ts
export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  technologies: Technology[];
  achievements: string[];
  type: ExperienceType;
  companyUrl?: string;
  logoUrl?: string;
}

export enum ExperienceType {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship'
}
```

### User Entity
```typescript
// src/entities/user/model/types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  location: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks: SocialLink[];
  skills: Skill[];
  languages: Language[];
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  username: string;
}

export enum SocialPlatform {
  GITHUB = 'github',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  EMAIL = 'email',
  WEBSITE = 'website'
}

export interface Skill {
  id: string;
  name: string;
  level: SkillLevel;
  category: SkillCategory;
  iconUrl?: string;
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}
```

### Cross-Entity References with @x Notation
When entities need to reference each other (e.g., Artist has Songs), use the @x notation:

```typescript
// src/entities/artist/model/types.ts
import type { Song } from "entities/song/@x/artist";

export interface Artist {
  id: string;
  name: string;
  songs: Array<Song>;
  biography?: string;
}
```

```typescript
// src/entities/song/@x/artist.ts
export type { Song } from "../model/types";
```

This pattern makes cross-references explicit and helps with refactoring.

### Public API Export
```typescript
// src/entities/project/index.ts
export { default as ProjectCard } from './ui/ProjectCard.astro';
export { default as ProjectDetail } from './ui/ProjectDetail.astro';
export type { Project, Technology, ProjectCategory, ProjectStatus } from './model/types';
export {
  formatDate,
  getStatusColor,
  filterProjectsByTechnology,
  sortProjectsByDate
} from './lib/project-utils';
```

## Entity Characteristics:
1. **Domain-focused**: Represents core business concepts and domain models
2. **Self-contained**: Contains all entity-related logic, data, and operations
3. **Reusable**: Used across features and widgets without modification
4. **Data-centric**: Manages entity data, validation, and business rules
5. **Layer-independent**: Can only depend on shared layer, never on higher layers
6. **Cross-reference capable**: Can reference other entities using @x notation when necessary

## Examples of entities for this portfolio:
- **User**: Personal information, contact details, and profile data
- **Project**: Portfolio projects with metadata, technologies, and status
- **Experience**: Work history, professional experience, and job details
- **Skill**: Technical skills, competency levels, and categories
- **Education**: Academic background, certifications, and achievements
- **Technology**: Tech stack items with categories, levels, and descriptions

## Best Practices:
1. Keep entities focused on single business concepts (Single Responsibility)
2. Use TypeScript interfaces and strict typing for all data models
3. Separate UI components from business logic and domain rules
4. Provide utility functions for common entity operations
5. Use enums for controlled vocabularies and status values
6. Include proper data validation and business rule enforcement
7. Create reusable entity UI components for consistent presentation
8. Document entity APIs, relationships, and business rules clearly
9. Use @x notation for necessary cross-entity references
10. Follow the Public API pattern - export only what's needed

## What should NOT be entities:
- UI-only components without business logic (use shared/ui)
- Feature-specific interactive logic (use features)
- General utility functions (use shared/lib)
- Application configuration or app-wide concerns (use app)
- Widget-level compositions (use widgets)

Remember: Entities are the foundation of your business domain. They should be stable, well-designed, and provide clear APIs for other layers to use. They represent the core concepts that your application revolves around.