# App Layer Instructions

## Purpose
The App layer is the highest level in FSD architecture. It initializes the application, connects pages to routes, and contains only the application's initialization and routing logic.

## What belongs here:
- Application initialization and entry points
- Routing configuration and page connections
- Global providers (theme, i18n, auth context)
- Application-wide HOCs and wrappers
- Root error boundaries
- Application shell and layout configuration

## Structure:
```
src/app/
├── providers/       # Application-wide providers and contexts
├── styles/          # Global application styles only
├── routes/          # Route definitions and page connections (framework-specific)
├── layouts/         # Application-wide layouts
└── index.html       # Application entry point (for frameworks like Astro)
```

## Rules for this layer:
- ✅ Can import from: pages, widgets, features, entities, shared
- ❌ Cannot import from: other app slices (no cross-imports within app)
- ✅ Should only contain application initialization and composition
- ❌ Should not contain business logic, UI components, or feature-specific code
- ✅ Should connect pages to routes but not implement page logic

## Examples of components that belong here:
- Route configuration connecting pages to URLs
- Global theme provider setup
- Application-wide context providers (auth, i18n)
- Root error boundary
- Application shell and main layout structure
- Global CSS reset and theme variables

## Code examples:

### Astro App Entry Point
```astro
---
// src/app/index.html or app layout
// Application initialization and global setup
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Technical Portfolio</title>
</head>
<body>
  <!-- Global app shell -->
  <slot />
</body>
</html>
```

### Theme Provider Setup
```astro
---
// src/app/providers/ThemeProvider.astro
// Global theme provider - application-wide concern
---
<script>
  // Initialize theme system
  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', theme);
</script>

<slot />
```

### Route Configuration (Framework-specific)
```typescript
// src/app/routes/index.ts (example for SPA frameworks)
import { HomePage } from "../../pages/home";
import { AboutPage } from "../../pages/about";
import { ProjectsPage } from "../../pages/projects";

export const routes = [
  { path: '/', component: HomePage },
  { path: '/about', component: AboutPage },
  { path: '/projects', component: ProjectsPage }
];
```

### Global Configuration
```typescript
// src/app/config/constants.ts
export const APP_CONFIG = {
  SITE_URL: 'https://devsandoval.me',
  SITE_NAME: 'David Sandoval Portfolio',
  DEFAULT_LOCALE: 'en',
  SUPPORTED_LOCALES: ['en', 'es']
} as const;
```

## What should NOT be in App layer:
- Business logic (belongs in features/entities)
- UI components (belongs in widgets/features/shared)
- Data fetching logic (belongs in entities/features)
- Feature-specific configurations (belongs in features)
- Complex state management (belongs in features/entities)

Remember: Keep the App layer minimal and focused only on application initialization, composition, and routing. It should orchestrate the application but not implement business functionality.