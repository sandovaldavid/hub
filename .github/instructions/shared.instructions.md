# Shared Layer Instructions

## Purpose
The Shared layer contains reusable utilities and components that are technology-focused and business-agnostic. This layer provides the foundation for all other layers and should not depend on any business logic.

## What belongs here:
- Reusable UI components (design system)
- Utility functions and helpers
- API clients and HTTP utilities
- Configuration files and constants
- Static assets (images, icons, fonts)
- Type definitions and interfaces
- Common libraries and abstractions

## Structure:
```
src/shared/
├── ui/
│   ├── button/
│   │   ├── Button.astro
│   │   └── button.css
│   ├── card/
│   │   └── Card.astro
│   ├── input/
│   │   └── Input.astro
│   └── index.ts
├── lib/
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── date.ts
│   │   └── string.ts
│   ├── api/
│   │   ├── client.ts
│   │   └── types.ts
│   └── index.ts
├── config/
│   ├── constants.ts
│   ├── env.ts
│   └── index.ts
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

## Rules for this layer:
- ❌ Cannot import from any FSD layer above (app, pages, widgets, features, entities)
- ✅ Can import from external libraries and npm packages
- ✅ Should be completely business-agnostic
- ❌ Should not contain business logic or domain-specific code

## UI Components Examples:

### Button Component
```astro
---
// src/shared/ui/button/Button.astro
import { cn } from '../../lib/utils/cn';

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: '_blank' | '_self';
  class?: string;
  [key: string]: any;
}

const { 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  type = 'button',
  href,
  target,
  class: className,
  ...props 
} = Astro.props;

const Tag = href ? 'a' : 'button';
const baseClasses = 'btn';
const variantClasses = `btn--${variant}`;
const sizeClasses = `btn--${size}`;
const disabledClasses = disabled ? 'btn--disabled' : '';

const classes = cn(
  baseClasses,
  variantClasses,
  sizeClasses,
  disabledClasses,
  className
);
---

<Tag 
  class={classes}
  type={href ? undefined : type}
  href={href}
  target={target}
  disabled={disabled}
  {...props}
>
  <slot />
</Tag>

<style>
  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50;
  }
  
  /* Variants */
  .btn--primary {
    @apply bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
  }
  
  .btn--secondary {
    @apply bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500;
  }
  
  .btn--outline {
    @apply border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 focus:ring-gray-500;
  }
  
  .btn--ghost {
    @apply bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500;
  }
  
  /* Sizes */
  .btn--xs {
    @apply px-2 py-1 text-xs;
  }
  
  .btn--sm {
    @apply px-3 py-1.5 text-sm;
  }
  
  .btn--md {
    @apply px-4 py-2 text-base;
  }
  
  .btn--lg {
    @apply px-6 py-3 text-lg;
  }
  
  .btn--xl {
    @apply px-8 py-4 text-xl;
  }
</style>
```

### Input Component
```astro
---
// src/shared/ui/input/Input.astro
import { cn } from '../../lib/utils/cn';

interface Props {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  class?: string;
  [key: string]: any;
}

const {
  type = 'text',
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  class: className,
  ...props
} = Astro.props;

const inputId = `input-${name}`;
const inputClasses = cn(
  'input',
  error && 'input--error',
  disabled && 'input--disabled',
  className
);
---

<div class="input-group">
  {label && (
    <label for={inputId} class="input-label">
      {label}
      {required && <span class="input-required">*</span>}
    </label>
  )}
  
  <input
    id={inputId}
    type={type}
    name={name}
    class={inputClasses}
    placeholder={placeholder}
    required={required}
    disabled={disabled}
    aria-invalid={error ? 'true' : 'false'}
    aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
    {...props}
  />
  
  {error && (
    <span id={`${inputId}-error`} class="input-error">
      {error}
    </span>
  )}
  
  {helperText && !error && (
    <span id={`${inputId}-helper`} class="input-helper">
      {helperText}
    </span>
  )}
</div>

<style>
  .input-group {
    @apply flex flex-col gap-1;
  }
  
  .input-label {
    @apply text-sm font-medium text-gray-700;
  }
  
  .input-required {
    @apply text-red-500;
  }
  
  .input {
    @apply block w-full rounded-lg border border-gray-300 px-3 py-2 text-base placeholder-gray-400 transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20;
  }
  
  .input--error {
    @apply border-red-500 focus:border-red-500 focus:ring-red-500/20;
  }
  
  .input--disabled {
    @apply cursor-not-allowed bg-gray-50 text-gray-500;
  }
  
  .input-error {
    @apply text-sm text-red-600;
  }
  
  .input-helper {
    @apply text-sm text-gray-500;
  }
</style>
```

### Card Component
```astro
---
// src/shared/ui/card/Card.astro
import { cn } from '../../lib/utils/cn';

interface Props {
  variant?: 'default' | 'outline' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  class?: string;
  [key: string]: any;
}

const {
  variant = 'default',
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  hover = false,
  class: className,
  ...props
} = Astro.props;

const classes = cn(
  'card',
  `card--${variant}`,
  `card--padding-${padding}`,
  `card--shadow-${shadow}`,
  `card--rounded-${rounded}`,
  hover && 'card--hover',
  className
);
---

<div class={classes} {...props}>
  <slot />
</div>

<style>
  .card {
    @apply bg-white transition-all duration-200;
  }
  
  /* Variants */
  .card--outline {
    @apply border border-gray-200;
  }
  
  .card--filled {
    @apply bg-gray-50;
  }
  
  /* Padding */
  .card--padding-sm { @apply p-3; }
  .card--padding-md { @apply p-4; }
  .card--padding-lg { @apply p-6; }
  
  /* Shadow */
  .card--shadow-sm { @apply shadow-sm; }
  .card--shadow-md { @apply shadow-md; }
  .card--shadow-lg { @apply shadow-lg; }
  
  /* Rounded */
  .card--rounded-sm { @apply rounded-sm; }
  .card--rounded-md { @apply rounded-md; }
  .card--rounded-lg { @apply rounded-lg; }
  .card--rounded-xl { @apply rounded-xl; }
  
  /* Hover effect */
  .card--hover {
    @apply cursor-pointer hover:shadow-lg;
  }
</style>
```

## Utility Functions Examples:

### Class Name Utility
```typescript
// src/shared/lib/utils/cn.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Date Utilities
```typescript
// src/shared/lib/utils/date.ts
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }).format(dateObj);
}

export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  }
}

export function isValidDate(date: any): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}
```

### String Utilities
```typescript
// src/shared/lib/utils/string.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function kebabToTitle(kebabCase: string): string {
  return kebabCase
    .split('-')
    .map(word => capitalize(word))
    .join(' ');
}
```

### Configuration
```typescript
// src/shared/config/constants.ts
export const SITE_CONFIG = {
  NAME: 'David Sandoval Portfolio',
  DESCRIPTION: 'Full-stack developer portfolio showcasing projects and skills',
  URL: 'https://devsandoval.me',
  AUTHOR: {
    NAME: 'Juan David Sandoval Salvador',
    EMAIL: 'contact@devsandoval.me',
    GITHUB: 'sandovaldavid',
    LINKEDIN: 'sandovaldavid'
  }
} as const;

export const UI_CONFIG = {
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536
  },
  ANIMATION: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500
    }
  }
} as const;
```

### Public API Exports
```typescript
// src/shared/ui/index.ts
export { default as Button } from './button/Button.astro';
export { default as Input } from './input/Input.astro';
export { default as Card } from './card/Card.astro';
export { default as Badge } from './badge/Badge.astro';
export { default as Textarea } from './textarea/Textarea.astro';

// src/shared/lib/index.ts
export { cn } from './utils/cn';
export * from './utils/date';
export * from './utils/string';

// src/shared/config/index.ts
export * from './constants';
export * from './env';
```

## Best Practices:

1. **Keep components generic and configurable**
2. **Use TypeScript for all utilities and components**
3. **Follow consistent naming conventions**
4. **Provide comprehensive prop interfaces**
5. **Include proper accessibility attributes**
6. **Make components responsive by default**
7. **Use Tailwind CSS for consistent styling**
8. **Export clean public APIs**
9. **Document component usage and props**
10. **Test components across different use cases**

## What should NOT be in shared:
- Business logic or domain-specific code
- Components tied to specific features
- API endpoints or business rules
- Feature-specific utilities
- Application-specific configuration

Remember: The Shared layer is the foundation. Keep it stable, well-tested, and completely independent of business concerns.