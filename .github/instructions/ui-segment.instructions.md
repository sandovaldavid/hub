# UI Segment Instructions

## Purpose
The UI segment contains all visual components, Astro components, styles, and presentation logic for a specific slice. This segment is focused on the visual and interactive aspects.

## What belongs in ui/ segments:
- Astro components (.astro files)
- React components (if using hybrid mode)
- Component-specific styles
- Visual presentation logic
- User interface elements
- Interactive components
- Component compositions

## Structure patterns:
```
{layer}/{slice}/ui/
├── ComponentName.astro     # Main component
├── SubComponent.astro      # Related sub-components
├── ComponentName.css      # Component styles (if not scoped)
└── index.ts               # Public API exports
```

## Astro Component Best Practices:

### Component Structure
```astro
---
// 1. Imports (from lower layers only)
import { Button } from '../../../shared/ui';
import { formatDate } from '../lib/utils';
import type { ComponentProps } from '../model/types';

// 2. Interface definition
interface Props {
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

// 3. Props destructuring with defaults
const { 
  title, 
  description, 
  variant = 'primary',
  onClick 
} = Astro.props;

// 4. Component logic (keep minimal)
const handleClick = onClick || (() => {});
---

<!-- 5. Template (semantic HTML) -->
<div class={`component component--${variant}`}>
  <h2 class="component__title">{title}</h2>
  {description && (
    <p class="component__description">{description}</p>
  )}
  <Button onClick={handleClick}>Action</Button>
</div>

<!-- 6. Scoped styles -->
<style>
  .component {
    /* Component styles using Tailwind or CSS */
  }
  
  .component__title {
    /* BEM naming convention */
  }
</style>

<!-- 7. Client-side scripts (when necessary) -->
<script>
  // Minimal client-side interactivity
  document.addEventListener('DOMContentLoaded', () => {
    // Component initialization
  });
</script>
```

### Component Guidelines:

## Component Guidelines:

#### Props and TypeScript
```typescript
// Always define proper interfaces with clear naming
interface Props {
  // Required props - be explicit about what's needed
  title: string;
  data: DataType[];
  
  // Optional props with sensible defaults
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  
  // Event handlers with proper typing
  onClick?: (event: MouseEvent) => void;
  onSubmit?: (data: FormData) => Promise<void>;
  onError?: (error: Error) => void;
  
  // HTML attributes and styling
  class?: string;
  id?: string;
  'data-testid'?: string;
  [key: string]: any; // For additional HTML attributes
}

// Use const assertions for better type inference
const BUTTON_VARIANTS = ['primary', 'secondary', 'accent'] as const;
type ButtonVariant = typeof BUTTON_VARIANTS[number];
```

#### Responsive Design
```astro
<!-- Always implement responsive design -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Mobile-first approach -->
</div>

<style>
  .component {
    /* Base styles for mobile */
    @apply p-4;
  }
  
  @media (min-width: 768px) {
    .component {
      /* Tablet styles */
      @apply p-6;
    }
  }
  
  @media (min-width: 1024px) {
    .component {
      /* Desktop styles */
      @apply p-8;
    }
  }
</style>
```

#### Accessibility
```astro
<!-- Always include proper ARIA attributes -->
<button 
  type="button"
  aria-label="Close modal"
  aria-expanded={isOpen}
  aria-controls="modal-content"
  tabindex="0"
>
  Close
</button>

<!-- Semantic HTML -->
<article class="post">
  <header>
    <h1>Post Title</h1>
    <time datetime="2025-01-01">January 1, 2025</time>
  </header>
  <main>
    <p>Post content...</p>
  </main>
</article>
```

#### Theme Support
```astro
<!-- Support both light and dark themes -->
<div class="card">
  <h2 class="card__title">Title</h2>
</div>

<style>
  .card {
    @apply bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700;
  }
  
  .card__title {
    @apply text-gray-900 dark:text-gray-100;
  }
  
  /* Alternative using CSS custom properties */
  .card {
    background-color: var(--color-surface);
    color: var(--color-text);
    border-color: var(--color-border);
  }
</style>
```

#### Performance Optimization
```astro
---
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent.astro'));
---

<!-- Optimize images -->
<img 
  src={imageUrl}
  alt={imageAlt}
  loading="lazy"
  width={400}
  height={300}
  decoding="async"
/>

<!-- Use proper heading hierarchy -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
```

#### Client-Side Interactivity
```astro
<!-- Minimal JavaScript for interactivity -->
<button id="toggle-button" type="button">
  Toggle Content
</button>

<div id="content" class="hidden">
  Toggleable content
</div>

<script>
  // Keep client-side code minimal and focused
  const button = document.getElementById('toggle-button');
  const content = document.getElementById('content');
  
  button?.addEventListener('click', () => {
    content?.classList.toggle('hidden');
    
    // Update ARIA attributes
    const isHidden = content?.classList.contains('hidden');
    button?.setAttribute('aria-expanded', (!isHidden).toString());
  });
  
  // Initialize ARIA attributes
  button?.setAttribute('aria-expanded', 'false');
  button?.setAttribute('aria-controls', 'content');
</script>
```

## Styling Guidelines:

### CSS Organization
```css
/* 1. Component base styles */
.component {
  /* Layout */
  display: flex;
  flex-direction: column;
  
  /* Spacing */
  padding: 1rem;
  margin: 0;
  
  /* Colors */
  background-color: var(--color-surface);
  color: var(--color-text);
  
  /* Typography */
  font-family: var(--font-family-body);
  font-size: 1rem;
  line-height: 1.5;
  
  /* Borders and shadows */
  border-radius: 0.5rem;
  box-shadow: var(--shadow-sm);
  
  /* Transitions */
  transition: all 0.2s ease-in-out;
}

/* 2. Component modifiers */
.component--large {
  padding: 2rem;
  font-size: 1.125rem;
}

.component--primary {
  background-color: var(--color-primary);
  color: white;
}

/* 3. Component elements */
.component__title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.component__content {
  flex: 1;
}

/* 4. Component states */
.component:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.component:focus-within {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

/* 5. Responsive styles */
@media (min-width: 768px) {
  .component {
    flex-direction: row;
    align-items: center;
  }
}
```

### Tailwind CSS Usage
```astro
<!-- Prefer Tailwind utility classes -->
<div class="flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
  <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
    Component Title
  </h2>
  
  <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
    Component description text.
  </p>
  
  <div class="flex gap-2 mt-4">
    <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
      Primary Action
    </button>
    
    <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
      Secondary Action
    </button>
  </div>
</div>
```

## Component Testing:

### Manual Testing Checklist
- [ ] Component renders correctly in all supported browsers (Chrome, Firefox, Safari, Edge)
- [ ] Responsive design works properly on mobile (320px+), tablet (768px+), and desktop (1024px+)
- [ ] Light and dark themes are properly supported with correct contrast ratios
- [ ] All interactive elements are accessible via keyboard navigation (Tab, Enter, Space, Arrow keys)
- [ ] Screen readers can properly navigate and announce all content
- [ ] Component works gracefully with and without JavaScript enabled
- [ ] All prop variations render correctly and handle edge cases
- [ ] Error states are handled gracefully with proper user feedback
- [ ] Loading states provide appropriate visual feedback
- [ ] Component follows WCAG 2.1 AA accessibility guidelines

### Automated Testing Patterns
```typescript
// Component unit test example
import { render, screen, fireEvent } from '@testing-library/astro';
import { Button } from './Button.astro';

describe('Button Component', () => {
  it('renders with correct variant styles', () => {
    render(Button, { props: { variant: 'primary' } });
    expect(screen.getByRole('button')).toHaveClass('btn--primary');
  });
  
  it('handles click events properly', async () => {
    const handleClick = vi.fn();
    render(Button, { props: { onClick: handleClick } });
    
    await fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
  
  it('supports keyboard navigation', async () => {
    render(Button, { props: { onClick: vi.fn() } });
    const button = screen.getByRole('button');
    
    button.focus();
    expect(button).toHaveFocus();
    
    await fireEvent.keyDown(button, { key: 'Enter' });
    // Assert expected behavior
  });
});
```

## Common Patterns:

### Conditional Rendering
```astro
<!-- Show/hide based on props -->
{showHeader && (
  <header class="component__header">
    <h2>{title}</h2>
  </header>
)}

<!-- List rendering -->
<ul class="component__list">
  {items.map(item => (
    <li key={item.id} class="component__item">
      {item.name}
    </li>
  ))}
</ul>

<!-- Fallback content -->
{items.length > 0 ? (
  <div class="component__content">
    <!-- Content when items exist -->
  </div>
) : (
  <div class="component__empty">
    <p>No items found</p>
  </div>
)}
```

### Error Boundaries
```astro
---
interface Props {
  data?: DataType[];
  error?: string;
  loading?: boolean;
}

const { data = [], error, loading = false } = Astro.props;
---

{loading && (
  <div class="component__loading">
    <p>Loading...</p>
  </div>
)}

{error && (
  <div class="component__error">
    <p class="text-red-600">{error}</p>
  </div>
)}

{!loading && !error && (
  <div class="component__content">
    <!-- Regular content -->
  </div>
)}
```

Remember: UI components should be focused on presentation and user interaction, while keeping business logic in model segments and utility functions in lib segments.