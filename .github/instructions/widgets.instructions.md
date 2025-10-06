# Widgets Layer Instructions

## Purpose
Widgets are large, self-contained UI blocks that deliver complete user experiences by composing features and entities. They represent major page sections or complex UI components that solve complete use cases.

## What belongs here:
- Large page sections that combine multiple features (Header, Footer, Hero, About)
- Complex UI blocks with complete user workflows
- Compositions that integrate features and entities together
- Self-contained functional blocks with clear boundaries
- Major user interface sections that can work independently
- Complete user experience blocks (e.g., contact section with form + info)

## Structure:
```
src/widgets/
├── header/
│   ├── ui/
│   │   └── Header.astro
│   ├── lib/
│   │   └── navigation.ts
│   └── index.ts
├── hero/
│   ├── ui/
│   │   └── Hero.astro
│   ├── model/
│   │   └── types.ts
│   └── index.ts
├── projects/
│   ├── ui/
│   │   ├── ProjectsSection.astro
│   │   └── ProjectGrid.astro
│   ├── model/
│   │   └── types.ts
│   ├── lib/
│   │   └── filtering.ts
│   └── index.ts
└── contact/
    ├── ui/
    │   └── ContactForm.astro
    ├── model/
    │   └── validation.ts
    ├── api/
    │   └── submit.ts
    └── index.ts
```

## Rules for this layer:
- ✅ Can import from: features, entities, shared
- ❌ Cannot import from: app, pages, other widgets
- ✅ Should combine features and entities into complete UI blocks
- ❌ Should not contain low-level utility functions

## Widget Examples:

### Header Widget
```astro
---
// src/widgets/header/ui/Header.astro
import { ThemeToggle } from '../../../features/theme-toggle';
import { LanguageSelect } from '../../../features/language-select';
import { Navigation } from '../lib/navigation';
import { Logo } from '../../../shared/ui';

interface Props {
  currentPath?: string;
}

const { currentPath } = Astro.props;
---

<header class="header">
  <div class="header__container">
    <Logo />
    <Navigation currentPath={currentPath} />
    <div class="header__actions">
      <LanguageSelect />
      <ThemeToggle />
    </div>
  </div>
</header>

<style>
  .header {
    /* Header-specific styles */
  }
</style>
```

### Projects Widget
```astro
---
// src/widgets/projects/ui/ProjectsSection.astro
import { ProjectCard } from '../../../entities/project';
import { ProjectFilter } from '../../../features/project-filter';
import type { Project } from '../../../entities/project';

interface Props {
  projects: Project[];
  showFilter?: boolean;
}

const { projects, showFilter = true } = Astro.props;
---

<section class="projects">
  <div class="projects__header">
    <h2>My Projects</h2>
    {showFilter && <ProjectFilter />}
  </div>
  
  <div class="projects__grid">
    {projects.map(project => (
      <ProjectCard key={project.id} project={project} />
    ))}
  </div>
</section>
```

### Public API Export
```typescript
// src/widgets/header/index.ts
export { default as Header } from './ui/Header.astro';
export type { HeaderProps } from './model/types';
```

## Widget Characteristics:
1. **Compositional**: Built by combining features and entities, not implementing from scratch
2. **Self-contained**: Can work independently and be dropped into any page
3. **Complete**: Provides a full user experience block, not partial functionality
4. **Reusable**: Can be used across different pages without modification
5. **Feature-rich**: Combines multiple features and entities into cohesive experiences
6. **Boundary-aware**: Has clear responsibilities and doesn't leak concerns to other widgets

## Examples of widgets for this portfolio:
- **Header**: Navigation + theme toggle + language selector + logo
- **Hero**: Introduction + avatar + social links + call-to-action
- **About**: Personal info + skills display + downloadable resume
- **Experience**: Work history timeline + experience details + technologies used
- **Projects**: Project grid + filtering + pagination + project cards
- **Contact**: Contact form + contact info + social media links + location
- **Footer**: Site links + copyright + social media + newsletter signup
- **Skills**: Skill categories + progress indicators + technology icons

## Best Practices:
1. Keep widgets focused on a single major use case or page section
2. Make widgets configurable through props but avoid over-configuration
3. Compose widgets from features and entities rather than implementing logic
4. Ensure widgets are responsive and accessible by default
5. Provide clear public APIs through index files for easy consumption
6. Handle widget-level state and coordination between features
7. Use proper TypeScript interfaces for all props and data contracts
8. Avoid business logic - delegate to features and entities
9. Make widgets independent - they shouldn't depend on other widgets
10. Document widget usage, props, and composition patterns

## What should NOT be widgets:
- Simple UI components without complete use cases (use shared/ui)
- Pure business logic without UI composition (use features or entities)
- Single-purpose components without feature composition (use features)
- Application-wide concerns like routing (use app layer)
- Data fetching without UI presentation (use entities or features)
- Utility functions without UI components (use shared/lib)

## Composition Pattern Example:
```astro
---
// src/widgets/projects-section/ui/ProjectsSection.astro
// Widget composes features and entities, doesn't implement them
import { ProjectFilter } from '../../../features/project-filter';
import { ProjectCard } from '../../../entities/project';
import { SectionTitle } from '../../../shared/ui';
import type { Project } from '../../../entities/project';

interface Props {
  projects: Project[];
  showFilter?: boolean;
  title?: string;
}

const { projects, showFilter = true, title = "My Projects" } = Astro.props;
---

<section class="projects-section">
  <div class="projects-section__header">
    <SectionTitle>{title}</SectionTitle>
    {showFilter && <ProjectFilter />}
  </div>
  
  <div class="projects-section__grid">
    {projects.map(project => (
      <ProjectCard key={project.id} project={project} />
    ))}
  </div>
</section>
```

Remember: Widgets are the main building blocks that pages compose to create complete user experiences. They should focus on composition and coordination, not implementation.