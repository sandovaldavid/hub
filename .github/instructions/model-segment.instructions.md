# Model Segment Instructions

## Purpose
The Model segment contains business logic, data types, interfaces, state management, and domain-specific operations for a specific slice. This is where the "brain" of your slice lives.

## What belongs in model/ segments:
- TypeScript interfaces and types
- Business logic and rules
- Data validation functions
- State management (stores, reactive state)
- Domain-specific operations
- Data transformation functions
- Business calculations
- Validation schemas

## Structure patterns:
```
{layer}/{slice}/model/
├── types.ts               # TypeScript interfaces and types
├── schema.ts              # Validation schemas
├── store.ts               # State management
├── validation.ts          # Validation functions
├── operations.ts          # Business operations
├── constants.ts           # Domain constants
└── index.ts               # Public API exports
```

## TypeScript Types and Interfaces:

### Entity Types
```typescript
// src/entities/project/model/types.ts

// Main entity interface
export interface Project {
  readonly id: string;
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
  metrics?: ProjectMetrics;
  createdAt: Date;
  updatedAt: Date;
}

// Related interfaces
export interface Technology {
  readonly id: string;
  name: string;
  iconUrl?: string;
  color?: string;
  category: TechCategory;
  level?: SkillLevel;
}

export interface ProjectMetrics {
  stars?: number;
  forks?: number;
  downloads?: number;
  visitors?: number;
  lastUpdated: Date;
}

// Enums for controlled vocabularies
export enum ProjectCategory {
  WEB_APPLICATION = 'web-application',
  MOBILE_APP = 'mobile-app',
  DESKTOP_APP = 'desktop-app',
  API_SERVICE = 'api-service',
  LIBRARY = 'library',
  TOOL = 'tool',
  GAME = 'game'
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  MAINTAINED = 'maintained',
  ARCHIVED = 'archived',
  ON_HOLD = 'on-hold'
}

export enum TechCategory {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  DATABASE = 'database',
  DEVOPS = 'devops',
  MOBILE = 'mobile',
  DESIGN = 'design',
  TESTING = 'testing'
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

// Utility types
export type ProjectPreview = Pick<Project, 'id' | 'title' | 'description' | 'imageUrl' | 'technologies' | 'status'>;
export type ProjectSummary = Omit<Project, 'longDescription' | 'metrics'>;
export type CreateProjectDTO = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProjectDTO = Partial<CreateProjectDTO>;

// Filter and sort types
export interface ProjectFilters {
  category?: ProjectCategory[];
  technologies?: string[];
  status?: ProjectStatus[];
  featured?: boolean;
  search?: string;
}

export interface ProjectSortOptions {
  field: 'title' | 'startDate' | 'updatedAt' | 'status';
  direction: 'asc' | 'desc';
}

// Result types
export interface ProjectsResult {
  projects: Project[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}
```

### Feature Model Example
```typescript
// src/features/theme-toggle/model/types.ts

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export interface ThemeState {
  current: Theme;
  system: Theme;
  preference: Theme;
}

export interface ThemeConfig {
  enableSystemDetection: boolean;
  enableTransitions: boolean;
  transitionDuration: number;
  storageKey: string;
}

// src/features/theme-toggle/model/store.ts
import { writable, derived, type Writable } from 'svelte/store';
import type { Theme, ThemeState } from './types';

// Create reactive store for theme state
export const themeStore: Writable<ThemeState> = writable({
  current: Theme.LIGHT,
  system: Theme.LIGHT,
  preference: Theme.SYSTEM
});

// Derived store for computed values
export const effectiveTheme = derived(
  themeStore,
  ($theme) => {
    if ($theme.preference === Theme.SYSTEM) {
      return $theme.system;
    }
    return $theme.preference;
  }
);

// Actions for theme management
export const themeActions = {
  setTheme: (theme: Theme) => {
    themeStore.update(state => ({
      ...state,
      preference: theme,
      current: theme === Theme.SYSTEM ? state.system : theme
    }));
    
    // Persist to localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme-preference', theme);
    }
  },
  
  detectSystemTheme: () => {
    if (typeof window === 'undefined') return;
    
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? Theme.DARK 
      : Theme.LIGHT;
    
    themeStore.update(state => ({
      ...state,
      system: systemTheme,
      current: state.preference === Theme.SYSTEM ? systemTheme : state.current
    }));
  },
  
  initializeTheme: () => {
    // Detect system theme
    themeActions.detectSystemTheme();
    
    // Load saved preference
    if (typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme-preference') as Theme;
      if (savedTheme && Object.values(Theme).includes(savedTheme)) {
        themeActions.setTheme(savedTheme);
      }
    }
    
    // Listen for system theme changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', themeActions.detectSystemTheme);
    }
  }
};
```

## Business Logic and Operations:

### Data Validation
```typescript
// src/entities/project/model/validation.ts
import type { Project, CreateProjectDTO } from './types';

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validation functions
export function validateProject(data: Partial<CreateProjectDTO>): ValidationResult {
  const errors: ValidationError[] = [];
  
  // Required fields
  if (!data.title?.trim()) {
    errors.push({
      field: 'title',
      message: 'Project title is required',
      code: 'REQUIRED'
    });
  } else if (data.title.length > 100) {
    errors.push({
      field: 'title',
      message: 'Project title must be less than 100 characters',
      code: 'MAX_LENGTH'
    });
  }
  
  if (!data.description?.trim()) {
    errors.push({
      field: 'description',
      message: 'Project description is required',
      code: 'REQUIRED'
    });
  }
  
  if (!data.category) {
    errors.push({
      field: 'category',
      message: 'Project category is required',
      code: 'REQUIRED'
    });
  }
  
  if (!data.technologies || data.technologies.length === 0) {
    errors.push({
      field: 'technologies',
      message: 'At least one technology is required',
      code: 'MIN_ITEMS'
    });
  }
  
  // Date validation
  if (data.startDate && data.endDate) {
    if (data.endDate <= data.startDate) {
      errors.push({
        field: 'endDate',
        message: 'End date must be after start date',
        code: 'INVALID_DATE_RANGE'
      });
    }
  }
  
  // URL validation
  if (data.demoUrl && !isValidUrl(data.demoUrl)) {
    errors.push({
      field: 'demoUrl',
      message: 'Demo URL must be a valid URL',
      code: 'INVALID_URL'
    });
  }
  
  if (data.codeUrl && !isValidUrl(data.codeUrl)) {
    errors.push({
      field: 'codeUrl',
      message: 'Code URL must be a valid URL',
      code: 'INVALID_URL'
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Sanitization functions
export function sanitizeProjectData(data: Partial<CreateProjectDTO>): Partial<CreateProjectDTO> {
  return {
    ...data,
    title: data.title?.trim(),
    description: data.description?.trim(),
    longDescription: data.longDescription?.trim(),
    tags: data.tags?.map(tag => tag.trim().toLowerCase()).filter(Boolean)
  };
}
```

### Business Operations
```typescript
// src/entities/project/model/operations.ts
import type { Project, ProjectFilters, ProjectSortOptions, ProjectsResult } from './types';

// Filtering operations with clear business rules
export function filterProjects(
  projects: Project[],
  filters: ProjectFilters
): Project[] {
  let filtered = [...projects];

  // Apply technology filter
  if (filters.technologies?.length) {
    filtered = filtered.filter(project =>
      project.technologies.some(tech =>
        filters.technologies!.includes(tech.id)
      )
    );
  }

  // Apply category filter
  if (filters.category) {
    filtered = filtered.filter(project =>
      project.category === filters.category
    );
  }

  // Apply status filter
  if (filters.status) {
    filtered = filtered.filter(project =>
      project.status === filters.status
    );
  }

  // Apply featured filter
  if (filters.featured !== undefined) {
    filtered = filtered.filter(project =>
      project.featured === filters.featured
    );
  }

  // Apply date range filter
  if (filters.startDate) {
    filtered = filtered.filter(project =>
      project.startDate >= filters.startDate!
    );
  }

  if (filters.endDate) {
    filtered = filtered.filter(project =>
      project.endDate && project.endDate <= filters.endDate!
    );
  }

  return filtered;
}

// Sorting operations with business logic
export function sortProjects(
  projects: Project[],
  options: ProjectSortOptions
): Project[] {
  const sorted = [...projects];

  return sorted.sort((a, b) => {
    let comparison = 0;

    switch (options.field) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'startDate':
        comparison = a.startDate.getTime() - b.startDate.getTime();
        break;
      case 'endDate':
        const aDate = a.endDate || new Date();
        const bDate = b.endDate || new Date();
        comparison = aDate.getTime() - bDate.getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        return 0;
    }

    return options.direction === 'desc' ? -comparison : comparison;
  });
}

// Aggregation operations for business intelligence
export function getProjectStats(projects: Project[]) {
  const stats = {
    total: projects.length,
    completed: projects.filter(p => p.status === ProjectStatus.COMPLETED).length,
    inProgress: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
    planned: projects.filter(p => p.status === ProjectStatus.PLANNED).length,
    featured: projects.filter(p => p.featured).length,
    technologiesUsed: new Set<string>(),
    categoriesUsed: new Set<ProjectCategory>(),
    dateRange: {
      earliest: null as Date | null,
      latest: null as Date | null
    }
  };

  projects.forEach(project => {
    // Collect technologies
    project.technologies.forEach(tech => stats.technologiesUsed.add(tech.name));
    
    // Collect categories
    stats.categoriesUsed.add(project.category);

    // Track date range
    if (!stats.dateRange.earliest || project.startDate < stats.dateRange.earliest) {
      stats.dateRange.earliest = project.startDate;
    }

    const endDate = project.endDate || new Date();
    if (!stats.dateRange.latest || endDate > stats.dateRange.latest) {
      stats.dateRange.latest = endDate;
    }
  });

  return {
    ...stats,
    technologiesUsed: Array.from(stats.technologiesUsed),
    categoriesUsed: Array.from(stats.categoriesUsed)
  };
}

// Search operations with business-relevant scoring
export function searchProjects(
  projects: Project[],
  query: string,
  limit = 10
): Project[] {
  if (!query.trim()) return projects.slice(0, limit);

  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
  
  const scored = projects.map(project => {
    let score = 0;

    searchTerms.forEach(term => {
      // Title matches get highest score
      if (project.title.toLowerCase().includes(term)) {
        score += 10;
      }

      // Description matches get medium score
      if (project.description.toLowerCase().includes(term)) {
        score += 5;
      }

      // Technology matches get medium score
      project.technologies.forEach(tech => {
        if (tech.name.toLowerCase().includes(term)) {
          score += 5;
        }
      });

      // Tag matches get lower score
      project.tags.forEach(tag => {
        if (tag.toLowerCase().includes(term)) {
          score += 2;
        }
      });

      // Long description matches get lowest score
      if (project.longDescription?.toLowerCase().includes(term)) {
        score += 1;
      }
    });

    return { project, score };
  }).filter(item => item.score > 0);

  // Sort by score descending and return projects
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.project);
}
```typescript
// src/entities/project/model/operations.ts
import type { Project, ProjectFilters, ProjectSortOptions, ProjectsResult } from './types';

// Filtering operations
export function filterProjects(
  projects: Project[],
  filters: ProjectFilters
): Project[] {
  return projects.filter(project => {
    // Category filter
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(project.category)) {
        return false;
      }
    }
    
    // Technology filter
    if (filters.technologies && filters.technologies.length > 0) {
      const projectTechIds = project.technologies.map(tech => tech.id);
      const hasRequiredTech = filters.technologies.some(techId => 
        projectTechIds.includes(techId)
      );
      if (!hasRequiredTech) {
        return false;
      }
    }
    
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(project.status)) {
        return false;
      }
    }
    
    // Featured filter
    if (filters.featured !== undefined) {
      if (project.featured !== filters.featured) {
        return false;
      }
    }
    
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        project.title,
        project.description,
        project.longDescription,
        ...project.tags,
        ...project.technologies.map(tech => tech.name)
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
}

// Sorting operations
export function sortProjects(
  projects: Project[],
  options: ProjectSortOptions
): Project[] {
  return [...projects].sort((a, b) => {
    let comparison = 0;
    
    switch (options.field) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'startDate':
        comparison = a.startDate.getTime() - b.startDate.getTime();
        break;
      case 'updatedAt':
        comparison = a.updatedAt.getTime() - b.updatedAt.getTime();
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
    }
    
    return options.direction === 'desc' ? -comparison : comparison;
  });
}

// Aggregation operations
export function getProjectStats(projects: Project[]) {
  const stats = {
    total: projects.length,
    byCategory: {} as Record<string, number>,
    byStatus: {} as Record<string, number>,
    byYear: {} as Record<number, number>,
    featuredCount: 0,
    technologyUsage: {} as Record<string, number>
  };
  
  projects.forEach(project => {
    // Category stats
    stats.byCategory[project.category] = (stats.byCategory[project.category] || 0) + 1;
    
    // Status stats
    stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1;
    
    // Year stats
    const year = project.startDate.getFullYear();
    stats.byYear[year] = (stats.byYear[year] || 0) + 1;
    
    // Featured count
    if (project.featured) {
      stats.featuredCount++;
    }
    
    // Technology usage
    project.technologies.forEach(tech => {
      stats.technologyUsage[tech.name] = (stats.technologyUsage[tech.name] || 0) + 1;
    });
  });
  
  return stats;
}

// Search operations
export function searchProjects(
  projects: Project[],
  query: string,
  limit = 10
): Project[] {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase();
  
  // Score projects based on search relevance
  const scoredProjects = projects.map(project => {
    let score = 0;
    
    // Title match (highest weight)
    if (project.title.toLowerCase().includes(searchTerm)) {
      score += 10;
      if (project.title.toLowerCase().startsWith(searchTerm)) {
        score += 5; // Bonus for prefix match
      }
    }
    
    // Description match
    if (project.description.toLowerCase().includes(searchTerm)) {
      score += 5;
    }
    
    // Technology match
    if (project.technologies.some(tech => tech.name.toLowerCase().includes(searchTerm))) {
      score += 3;
    }
    
    // Tag match
    if (project.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
      score += 2;
    }
    
    // Featured boost
    if (project.featured) {
      score += 1;
    }
    
    return { project, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .slice(0, limit)
  .map(item => item.project);
  
  return scoredProjects;
}
```

### Constants and Configuration
```typescript
// src/features/contact-form/model/constants.ts

export const CONTACT_FORM_CONFIG = {
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 2000,
  RATE_LIMIT: {
    MAX_ATTEMPTS: 3,
    WINDOW_MS: 60000, // 1 minute
  },
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[+]?[1-9][\d\s\-()]{7,15}$/
  }
} as const;

export const FORM_MESSAGES = {
  SUCCESS: 'Message sent successfully! I\'ll get back to you soon.',
  ERROR: 'Failed to send message. Please try again later.',
  VALIDATION: {
    REQUIRED: 'This field is required',
    EMAIL_INVALID: 'Please enter a valid email address',
    MESSAGE_TOO_SHORT: `Message must be at least ${CONTACT_FORM_CONFIG.MIN_MESSAGE_LENGTH} characters`,
    MESSAGE_TOO_LONG: `Message must be less than ${CONTACT_FORM_CONFIG.MAX_MESSAGE_LENGTH} characters`,
    RATE_LIMITED: 'Too many attempts. Please wait before trying again.'
  }
} as const;
```

## Best Practices:

### 1. Strong Typing and Type Safety
- Always define comprehensive TypeScript interfaces
- Use const assertions for better type inference
- Leverage utility types (Pick, Omit, Partial, Required)
- Create specific types for different use cases (DTOs, domain objects, view models)
- Use branded types for IDs and other critical values

### 2. Immutability and Pure Functions
- Prefer readonly properties where appropriate
- Use immutable update patterns (spread operators, library helpers)
- Avoid mutating input parameters - always return new objects
- Design functions to be pure (same input = same output, no side effects)
- Use functional programming patterns for data transformations

### 3. Single Responsibility and Modularity
- Keep each function focused on one specific task
- Separate validation, transformation, and business logic concerns
- Create small, composable functions that can be easily tested
- Group related functions into focused modules
- Avoid large, monolithic operations that do everything

### 4. Comprehensive Error Handling
- Define clear error types with specific error codes and messages
- Provide meaningful, user-friendly error messages
- Handle edge cases gracefully (empty arrays, null values, etc.)
- Use Result types or similar patterns for operations that can fail
- Log errors appropriately for debugging while protecting user data

### 5. Performance and Optimization
- Avoid expensive operations in frequently called functions
- Use memoization for computed values that don't change often
- Implement proper caching strategies for data that doesn't change frequently
- Consider lazy evaluation for expensive operations
- Profile and optimize bottlenecks based on actual usage patterns

### 6. Testing and Documentation
- Write comprehensive unit tests for all business logic
- Document complex business rules with inline comments
- Provide clear JSDoc comments for public APIs
- Include examples in documentation for complex functions
- Test edge cases and error conditions thoroughly

Remember: The model segment is the core of your business logic. Keep it pure, testable, and independent of UI concerns. It should be the most stable and well-tested part of your application.