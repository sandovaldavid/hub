# Pages Layer Instructions

## Purpose
The Pages layer contains complete pages and large page components. In Astro, these are the actual `.astro` files that represent different routes.

## What belongs here:
- Individual page files (Astro pages)
- Page-specific compositions and layouts
- Large page sections that combine multiple widgets
- Page-level data fetching and logic
- Route-specific functionality

## Structure:
```
src/pages/
├── index.astro           # Home page
├── about.astro           # About page
├── projects/             # Projects section
│   ├── index.astro
│   └── [slug].astro
└── contact.astro         # Contact page
```

## Rules for this layer:
- ✅ Can import from: widgets, features, entities, shared
- ❌ Cannot import from: app, other pages
- ✅ Should compose widgets and features into full pages
- ❌ Should not contain low-level UI components

## Astro-specific guidelines:

### Page Structure
```astro
---
// Page frontmatter - data fetching, logic
import Layout from '../layouts/Layout.astro';
import { Hero } from '../widgets/hero';
import { About } from '../widgets/about';
import { Projects } from '../widgets/projects';
import { Contact } from '../widgets/contact';

// Page-specific data or logic
const pageData = await fetchPageData();
---

<Layout title="David Sandoval - Portfolio">
  <Hero />
  <About />
  <Projects data={pageData.projects} />
  <Contact />
</Layout>
```

### Dynamic Pages
```astro
---
// src/pages/projects/[slug].astro
import Layout from '../../layouts/Layout.astro';
import { ProjectDetail } from '../../widgets/project-detail';
import { getProject } from '../../entities/project';

export async function getStaticPaths() {
  // Generate static paths for projects
  const projects = await getAllProjects();
  return projects.map(project => ({
    params: { slug: project.slug },
    props: { project }
  }));
}

const { project } = Astro.props;
---

<Layout title={`${project.title} - David Sandoval`}>
  <ProjectDetail project={project} />
</Layout>
```

## Page Responsibilities:
1. **Composition**: Combine widgets and features into complete pages
2. **Data Fetching**: Fetch page-specific data in frontmatter
3. **SEO**: Set appropriate meta tags and titles
4. **Layout**: Apply appropriate layouts to pages
5. **Routing**: Handle URL parameters and query strings

## Examples of what belongs here:
- Home page (`index.astro`)
- About page (`about.astro`)
- Projects listing (`projects/index.astro`)
- Individual project pages (`projects/[slug].astro`)
- Contact page (`contact.astro`)
- Blog posts (`blog/[slug].astro`)

## What should NOT be here:
- Reusable UI components (use widgets or shared)
- Business logic (use features or entities)
- API calls (use entities or features)
- Utility functions (use shared)

## Best Practices:
1. Keep pages as composition layers
2. Move complex logic to widgets or features
3. Use TypeScript for props and data types
4. Implement proper SEO meta tags
5. Handle loading and error states appropriately
6. Ensure responsive design across all pages

Remember: Pages should orchestrate widgets and features, not implement them.