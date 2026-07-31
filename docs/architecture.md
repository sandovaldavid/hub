# Architecture

This document describes the current source structure and ownership boundaries of the Hub. Durable rationale, rejected alternatives, historical audits and cross-channel decisions belong in Cortex-L7.

## Application shape

The Hub is a statically generated Astro application with two localized routes:

- `/` — English;
- `/es/` — Spanish.

Astro renders the page shell as static HTML. Browser JavaScript is limited to theme management, sharing, conversion analytics and Vercel Analytics.

## Source directories

| Directory | Current responsibility |
| --- | --- |
| `src/app` | Global layout, shared styles, channel tokens and page-level models. |
| `src/pages` | Route entry points and route-specific composition. |
| `src/data` | Typed profile, destinations, calls to action, projects, skills, SEO and structured-data configuration. |
| `src/shared` | Reusable UI, assets, utilities, localization and analytics infrastructure. |
| `src/entities` | Reusable product concepts with multiple consumers. |
| `src/features` | Interactive user actions such as sharing and theme selection. |
| `src/widgets` | Page sections composed from data and reusable modules. |
| `scripts` | Architecture, link and repository-governance automation. |
| `tests` | Unit, browser, accessibility, SEO and performance contracts. |

The directory names communicate useful boundaries; the repository does not implement full Feature-Sliced Design ceremony or require a barrel for every module.

## Placement rules

1. Keep route composition in `src/pages`.
2. Keep public URLs, metadata and typed content in `src/data` or the localized catalogs.
3. Keep reusable low-level UI and utilities in `src/shared`.
4. Use `entities`, `features` and `widgets` only when the name represents a real reusable product concept or page section.
5. Import concrete modules directly when an `index.ts` file would only add indirection.
6. Do not place content constants or external destinations inside visual components.
7. Add a top-level source directory only when it has a distinct responsibility and clear consumers.

## Dependency direction

```text
pages/layouts
  -> widgets
  -> features/entities
  -> shared/data
```

Lower-level modules must not depend on higher-level page composition. Circular imports and single-module re-export barrels are rejected by:

```bash
bun run check:architecture
```

## Runtime ownership

| Concern | Canonical implementation |
| --- | --- |
| Public identity, canonical origin and approved destinations | `src/data/site.config.ts` |
| Profile and primary portrait reference | `src/data/profile.ts` |
| Calls to action | `src/data/cta.ts` |
| Featured project summaries | `src/data/weekly-project.ts` |
| Technology presentation | `src/data/skills.ts` |
| English and Spanish copy | `src/shared/i18n/locales/*.json` |
| Localized metadata assembly | `src/data/seo.ts` |
| Schema.org graph | `src/data/structured-data.ts` |
| Global Identity Core and Link Hub token implementation | `src/app/styles/global.css` |
| Theme behavior | `src/entities/theme` and `src/features/theme-toggle` |
| Conversion event catalog and privacy-safe properties | `src/shared/analytics/conversion.ts` |

Tests enforce these implementation contracts. Figma remains the authority for approved visual intent. Cortex-L7 remains the authority for positioning, evidence interpretation, decision rationale and cross-channel history.

## Design implementation boundary

The token path is:

```text
Identity Core primitive
  -> semantic role
  -> Link Hub channel alias
  -> component role
  -> component
```

`src/app/styles/global.css` owns shared primitives, Light/Dark aliases and reusable component roles. Components consume aliases or component roles and must not introduce a second brand palette. The scoped external-platform color exception remains in `src/entities/social-link/ui/SocialButton.css`.

Changes must preserve keyboard operation, visible focus, Light/Dark/System themes, reduced motion, high-contrast behavior, bilingual parity and responsive layout.

## SEO and analytics boundaries

The layout renders metadata produced by `src/data/seo.ts`; it must not maintain a second title, description, public-profile or social-preview catalog. `src/data/structured-data.ts` is the only builder for the localized `ProfilePage` graph around the canonical `Person`.

Analytics events measure navigation interactions only. They must use the allow-listed properties implemented in `src/shared/analytics/conversion.ts` and must not contain personal data, complete URLs, query strings or free-form input.

## Agent instruction ownership

Repository-specific coding instructions are intentionally limited to:

| File | Scope |
| --- | --- |
| `.github/copilot-instructions.md` | Global project, identity, privacy, validation and documentation rules. |
| `.github/instructions/source.instructions.md` | Source placement, real consumers and dependency direction. |
| `.github/instructions/app.instructions.md` | Application shell, layout, global styles and app-level ownership. |
| `.github/instructions/design-system.instructions.md` | Implemented tokens, channel expression, accessibility and visual tests. |

Do not add generic per-layer or per-segment templates. A new instruction file must reference actual paths, describe implemented behavior, have a clear consumer and align with executable checks. Examples for hypothetical portfolio routes, forms, APIs, stores, barrels or framework integrations are not Hub documentation.

## Verification

Run the architecture check directly while iterating:

```bash
bun run check:architecture
```

Run the complete repository gate before approving a source change:

```bash
bun run validate:local
```

Operational setup, CI, branch, deployment and maintenance procedures are consolidated in [`operations.md`](operations.md).
