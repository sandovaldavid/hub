# AI Coding Agent Instructions for Hub Links Project

## Project Overview

**Hub Links** is a personal brand hub for "DevSandoval" - a modern, professional landing page built with Astro and Tailwind CSS. The site uses a Bento Grid layout to showcase personal branding, social links, current projects, and contact information in an engaging, conversion-focused design.

**Key Business Goals:**

- Act as a "digital epicenter" for DevSandoval's online presence
- Guide visitors through a conversion funnel (awareness → interest → action)
- Demonstrate technical expertise through clean, modern design
- Provide clear calls-to-action for business inquiries and developer community engagement

## Architecture: Feature-Sliced Design (FSD)

This project follows **Feature-Sliced Design (FSD)** - a scalable architectural methodology that organizes code by business features rather than technical concerns.

### Layer Structure

```
src/
├── app/           # Application initialization, routing, global config
├── pages/         # Complete Astro pages (routes)
├── widgets/       # Large UI blocks composing features/entities
├── features/      # Reusable business features with user value
├── entities/      # Business entities and domain models
└── shared/        # Reusable utilities, UI components, configs
```

### Layer Import Rules

- **App**: Can import from all layers
- **Pages**: Can import from widgets, features, entities, shared
- **Widgets**: Can import from features, entities, shared
- **Features**: Can import from entities, shared only
- **Entities**: Can import from shared only
- **Shared**: Cannot import from any FSD layer

### Segment Structure (per layer/slice)

Each layer follows this internal structure:

```
{layer}/{slice}/
├── ui/           # Astro components, styles, presentation
├── model/        # Types, business logic, validation, state
├── lib/          # Utilities, helpers, business operations
├── api/          # External API calls, data fetching
└── index.ts      # Public API exports
```

## Key Patterns & Conventions

### 1. Component Architecture

**Widget Composition Pattern:**

```astro
---
// src/widgets/projects-section/ui/ProjectsSection.astro
import { ProjectFilter } from '../../../features/project-filter';
import { ProjectCard } from '../../../entities/project';
import { SectionTitle } from '../../../shared/ui';

interface Props {
	projects: Project[];
	showFilter?: boolean;
}

const { projects, showFilter = true } = Astro.props;
---

<section class="projects-section">
	<SectionTitle>Featured Projects</SectionTitle>
	{showFilter && <ProjectFilter />}
	<div class="grid">
		{projects.map(project => <ProjectCard project={project} />)}
	</div>
</section>
```

**Public API Pattern:**

```typescript
// src/widgets/projects-section/index.ts
export { default as ProjectsSection } from './ui/ProjectsSection.astro';
export type { ProjectsSectionProps } from './model/types';
```

### 2. TypeScript & Data Modeling

**Strong Typing with Domain Models:**

```typescript
// src/entities/project/model/types.ts
export interface Project {
	readonly id: string;
	title: string;
	description: string;
	technologies: Technology[];
	category: ProjectCategory;
	status: ProjectStatus;
	startDate: Date;
	endDate?: Date;
	featured: boolean;
}

export enum ProjectStatus {
	COMPLETED = 'completed',
	IN_PROGRESS = 'in-progress',
	PLANNED = 'planned',
}
```

**Utility Types for Different Contexts:**

```typescript
export type ProjectPreview = Pick<
	Project,
	'id' | 'title' | 'imageUrl' | 'technologies'
>;
export type CreateProjectDTO = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
```

### 3. Styling & UI Patterns

**Tailwind + BEM Naming:**

```astro
<div class="hero-card hero-card--featured">
	<h1 class="hero-card__title">DevSandoval</h1>
	<p class="hero-card__subtitle">Full-Stack Developer</p>
</div>

<style>
	.hero-card {
		@apply bg-white dark:bg-gray-800 rounded-lg p-6;
	}

	.hero-card--featured {
		@apply ring-2 ring-blue-500;
	}
</style>
```

**Responsive Bento Grid Layout:**

```astro
<div class="bento-grid">
	<div class="bento-item bento-item--large">Hero Section</div>
	<div class="bento-item bento-item--medium">CTA Buttons</div>
	<div class="bento-item bento-item--small">Social Links</div>
</div>

<style>
	.bento-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}

	@media (min-width: 768px) {
		.bento-grid {
			grid-template-areas:
				'hero hero cta'
				'social project contact';
		}
	}
</style>
```

### 4. State Management & Business Logic

**Feature State Management:**

```typescript
// src/features/theme-toggle/model/store.ts
import { writable } from 'svelte/store';

export const themeStore = writable<'light' | 'dark' | 'system'>('system');

export const themeActions = {
	setTheme: (theme: 'light' | 'dark' | 'system') => {
		themeStore.set(theme);
		// Persist and apply theme
	},
};
```

**Entity Business Operations:**

```typescript
// src/entities/project/model/operations.ts
export function filterProjectsByTechnology(
	projects: Project[],
	technologyId: string
): Project[] {
	return projects.filter(project =>
		project.technologies.some(tech => tech.id === technologyId)
	);
}
```

## Development Workflow

### Essential Commands

```bash
# Development
bun dev                    # Start dev server (localhost:4321)
bun build                  # Production build
bun preview               # Preview production build

# Code Quality (when configured)
bun lint                  # Lint code
bun format                # Format code
bun type-check           # TypeScript checking
```

### File Organization Rules

**Creating New Features:**

1. Start with entity (business logic)
2. Add feature (user interactions)
3. Create widget (UI composition)
4. Update pages to use widget

**Example: Adding a Contact Form**

```
src/
├── entities/contact/      # Contact data models
├── features/contact-form/ # Form logic & validation
├── widgets/contact-section/ # Contact UI composition
└── pages/index.astro      # Add to home page
```

### Import Path Aliases

```typescript
// tsconfig.json paths
"@/*": ["src/*"],
"@app/*": ["src/app/*"],
"@shared/*": ["src/shared/*"],
"@entities/*": ["src/entities/*"],
"@features/*": ["src/features/*"],
"@widgets/*": ["src/widgets/*"],
"@pages/*": ["src/pages/*"]
```

**Usage:**

```typescript
import { Button } from '@shared/ui';
import { ProjectCard } from '@entities/project';
import { ContactForm } from '@features/contact-form';
```

## Critical Developer Workflows

### 1. Adding New Content Sections

**Pattern:** Create entity → feature → widget → integrate

```typescript
// 1. Entity: Define data structure
// src/entities/experience/model/types.ts
export interface Experience {
	id: string;
	company: string;
	position: string;
	startDate: Date;
	endDate?: Date;
	technologies: string[];
}

// 2. Feature: Add interactions (if needed)
// src/features/experience-filter/...

// 3. Widget: Compose UI
// src/widgets/experience-section/ui/ExperienceSection.astro
import { ExperienceCard } from '../../../entities/experience';

export interface Props {
	experiences: Experience[];
}

// 4. Page Integration
// src/pages/index.astro
import { ExperienceSection } from '../widgets/experience-section';
```

### 2. Dynamic Content Management

**Current Approach:** Local JSON/TS data files for easy updates

```typescript
// src/data/projects.ts
export const projects: Project[] = [
	{
		id: 'hub-links',
		title: 'Personal Brand Hub',
		description: 'Modern portfolio with Bento Grid layout',
		status: 'in-progress',
		technologies: ['Astro', 'Tailwind CSS', 'TypeScript'],
		featured: true,
	},
];

// Usage in pages
import { projects } from '../data/projects';
```

**Future Enhancement:** Headless CMS integration for non-technical content updates.

### 3. Styling & Theming

**Design System Approach:**

- Tailwind CSS for utility classes
- CSS custom properties for theme variables
- Dark/light mode support
- Responsive-first design

**Theme Variables:**

```css
:root {
	--color-primary: #3b82f6;
	--color-surface: #ffffff;
	--color-text: #111827;
}

@media (prefers-color-scheme: dark) {
	:root {
		--color-surface: #1f2937;
		--color-text: #f9fafb;
	}
}
```

### 4. Performance Optimization

**Astro-Specific Patterns:**

- Static generation by default
- Island architecture for interactivity
- Image optimization with Astro's Image component
- Critical CSS inlining

**Example:**

```astro
---
// Static by default - fast loading
const projects = await getProjects(); // Build-time data fetching
---

<!-- Interactive islands only where needed -->
<ClientOnly>
	<ContactForm client:load />
</ClientOnly>
```

## Quality Standards

### Code Quality Requirements

- **TypeScript Strict Mode:** All code must pass strict TypeScript checking
- **Accessibility:** WCAG 2.1 AA compliance (semantic HTML, ARIA labels, keyboard navigation)
- **Performance:** Core Web Vitals optimization (Lighthouse scores >90)
- **Responsive:** Mobile-first design, works on all screen sizes
- **SEO:** Proper meta tags, semantic HTML, performance optimization

### Testing Strategy

- **Unit Tests:** Business logic in model/ segments
- **Integration Tests:** Feature interactions
- **E2E Tests:** Critical user journeys
- **Visual Regression:** UI consistency across browsers

### Commit Conventions

**Conventional Commits Required:**

```
feat(entities/project): add project filtering by technology
fix(ui): correct button alignment in mobile view
docs: update component usage examples
refactor: improve project data structure
```

## Common Pitfalls to Avoid

1. **Import Violations:** Never import "upward" in FSD layers
2. **Business Logic in UI:** Keep components focused on presentation
3. **Tight Coupling:** Use composition over inheritance
4. **Global State Overuse:** Prefer local state with clear boundaries
5. **Generic Components:** Build for specific use cases, not hypothetical reuse

## Getting Started

1. **Read the docs/idea.md** for business requirements
2. **Review .github/instructions/** for detailed layer guidelines
3. **Start with entities** when adding new business concepts
4. **Test frequently** - run `bun dev` and check browser
5. **Follow FSD rules** - architecture decisions have business impact

This architecture enables rapid feature development while maintaining code quality and scalability. Focus on delivering user value through clear, composable features.
