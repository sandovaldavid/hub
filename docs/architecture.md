# Architecture

This document describes the current public architecture contract of the Hub: where responsibilities live, how dependencies flow and which browser behaviors are intentionally allowed.

The repository must remain understandable without access to private planning systems. Code, configuration, tests and workflows are the executable source of truth for contributors.

## Application shape

The Hub is a statically generated Astro application with two localized routes:

- `/` — English;
- `/es/` — Spanish.

Astro renders the page shell as static HTML. Browser JavaScript is intentionally limited to theme management, native sharing/copy behavior, privacy-safe navigation analytics, Vercel Analytics and small progressive-enhancement interactions. There is no hydrated SPA shell.

## Architectural principles

1. **Keep the product small.** Add abstraction only when an implemented responsibility has real consumers.
2. **Keep content out of visual components.** Public destinations, profile data, metadata and localized copy have typed owners.
3. **Prefer static output.** Client JavaScript must justify its runtime cost.
4. **Preserve one public identity model.** Visible content, metadata and structured data must not maintain conflicting identity catalogs.
5. **Keep boundaries executable.** Architecture rules are represented by imports, scripts and tests.
6. **Do not require private context.** Public contributors must be able to understand implementation constraints from this repository.

## Source directories

| Directory | Current responsibility |
| --- | --- |
| `src/pages` | Route entry points and route-level composition. |
| `src/app` | Global document layout and application composition. |
| `src/widgets` | Page sections composed from features, entities and typed data. |
| `src/features` | Interactive user actions such as sharing and theme/language selection. |
| `src/data` | Typed profile, destinations, calls to action, projects, skills, SEO and structured-data configuration. |
| `src/entities` | Reusable product concepts and domain-shaped UI/models. |
| `src/shared` | Reusable UI, assets, utilities, localization, analytics, cross-cutting models and shared design-system styles. |
| `scripts` | Architecture, link and repository-governance automation. |
| `tests` | Unit, browser, accessibility, SEO and performance contracts. |

The directory names communicate useful boundaries; the repository does not implement full Feature-Sliced Design ceremony or require a barrel for every module.

## Placement rules

1. Keep route composition in `src/pages`; route entry points own `Layout` + page-widget composition.
2. Keep the global document shell in `src/app`.
3. Keep public URLs, metadata and typed content in `src/data` or localized catalogs.
4. Keep reusable low-level UI, utilities, cross-cutting models and design-system CSS in `src/shared`.
5. Keep reusable product models/UI in `src/entities`.
6. Use `features` and `widgets` only when the name represents a real user action or page section.
7. Import concrete modules directly when an `index.ts` file would only add indirection.
8. Do not place content constants or external destinations inside visual components.

## Dependency direction

Dependencies may point only to the same layer or a lower layer in this matrix:

```text
pages  -> app, widgets, features, data, entities, shared
app    -> widgets, features, data, entities, shared
widgets -> features, data, entities, shared
features -> data, entities, shared
data   -> entities, shared
entities -> shared
shared -> shared
```

In particular:

- `widgets` must not import `app` or `pages`;
- `data` must not import `widgets`, `features`, `app` or `pages`;
- `entities`, `features` and `widgets` must not import application-owned styles;
- circular imports are forbidden.

These rules apply to TypeScript/JavaScript/Astro imports **and** CSS `@import`/`@reference` dependencies. They are enforced by:

```bash
bun run check:architecture
```

## Runtime ownership

| Concern | Canonical implementation |
| --- | --- |
| Public identity, canonical origin and approved destinations | `src/data/site.config.ts` |
| Portrait, brand logo references and contact email | `src/data/profile.ts` |
| Calls to action | `src/data/cta.ts` |
| Featured project summaries | `src/data/featured-projects.ts` |
| Technology presentation | `src/data/skills.ts` |
| English and Spanish copy, including localized profile facts (location, languages, work mode) | `src/shared/i18n/locales/*.json` |
| Localized metadata assembly | `src/data/seo.ts` |
| Schema.org graph | `src/data/structured-data.ts` |
| Identity Core, semantic roles and Link Hub tokens | `src/shared/styles/global.css` |
| Theme behavior | `src/entities/theme` and `src/features/theme-toggle` |
| Conversion event catalog and privacy-safe properties | `src/shared/analytics/conversion.ts` |

Tests enforce these implementation contracts.

## Identity and design implementation

David Sandoval is the primary identity represented by the Hub. The logo, typography, color system and other visual assets are supporting implementation layers, not a separate product identity.

The implemented token path is:

```text
Identity Core primitive
  -> semantic role
  -> Link Hub channel alias
  -> component role
  -> component
```

`src/shared/styles/global.css` owns shared primitives, Light/Dark aliases and reusable component roles. `Layout.astro` loads that stylesheet once. Component styles that require Tailwind utilities use `@reference` so they can consume the shared design-system context without creating a runtime stylesheet dependency or duplicating the global CSS.

The scoped external-platform color exception remains in `src/entities/social-link/ui/SocialButton.css`.

Changes must preserve keyboard operation, visible focus, Light/Dark/System themes, reduced motion, high-contrast behavior, bilingual parity and responsive layout.

## Content and localization

English and Spanish should express the same facts, claim status, lifecycle state, privacy boundary and CTA intent. Natural phrasing is preferred over literal translation.

Localized interface copy belongs in `src/shared/i18n/locales/*.json`. Typed data can contain locale-specific evidence records when the entire record is domain content, as with featured project summaries, but visual components must not maintain ad hoc EN/ES ternaries for shared interface labels.

## SEO and structured data

The layout renders metadata produced by `src/data/seo.ts`; it must not maintain a second title, description, public-profile or social-preview catalog.

`src/data/structured-data.ts` is the only builder for the localized `ProfilePage` graph around the canonical `Person`.

Canonical URLs, alternate locale URLs, Open Graph data and visible identity content should remain aligned.

## Analytics boundary

Analytics events measure navigation interactions only. Event names and positions are allow-listed by `src/shared/analytics/conversion.ts`; DOM instrumentation must use those canonical values and must not contain personal data, complete URLs, query strings or free-form input.

Adding broader analytics collection requires an explicit privacy review.

## Verification

Run the architecture check directly while iterating:

```bash
bun run check:architecture
```

Run the fast repository-quality gate for source changes:

```bash
bun run validate:quality
```

Run the complete repository gate for browser-, accessibility- or release-sensitive changes:

```bash
bun run validate:local
```

Operational setup, CI, branch, deployment and maintenance procedures are consolidated in [`operations.md`](operations.md).
