# Architecture

This document describes the current public architecture contract of the Hub: where responsibilities live, how dependencies flow and which browser behaviors are intentionally allowed.

The repository must remain understandable without access to private planning systems. Code, configuration, tests and workflows are the executable source of truth for contributors.

## Application shape

The Hub is a statically generated Astro application with two localized routes:

- `/` — English;
- `/es/` — Spanish.

Astro renders the page shell as static HTML. Browser JavaScript is intentionally limited to behavior that requires a client runtime:

- theme management;
- native sharing/copy behavior;
- privacy-safe navigation analytics;
- Vercel Analytics;
- small progressive-enhancement interactions such as scroll-to-top behavior.

There is no hydrated SPA shell.

## Architectural principles

1. **Keep the product small.** Add abstraction only when an implemented responsibility has multiple real consumers.
2. **Keep content out of visual components.** Public destinations, profile data, metadata and localized copy have typed owners.
3. **Prefer static output.** Client JavaScript must justify its runtime cost and remain progressively enhanced where practical.
4. **Preserve one public identity model.** Visible content, metadata and structured data must not maintain conflicting identity catalogs.
5. **Keep boundaries executable.** Architecture rules should be represented by imports, scripts, tests or clearly named source ownership.
6. **Do not require private context.** Public contributors must be able to understand implementation constraints from the repository and the associated issue or pull request.

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

`src/app/styles/global.css` owns shared primitives, Light/Dark aliases and reusable component roles. Components consume aliases or component roles and must not introduce a second brand palette. The scoped external-platform color exception remains in `src/entities/social-link/ui/SocialButton.css`.

Maintainers may use external design references to approve visual intent, but contributors should not need unpublished files to understand the implemented contract. If a visual requirement is not represented by existing tokens, source, tests or the change request, it must be clarified before implementation rather than inferred.

Changes must preserve keyboard operation, visible focus, Light/Dark/System themes, reduced motion, high-contrast behavior, bilingual parity and responsive layout.

## Content and localization

English and Spanish should express the same facts, claim status, lifecycle state, privacy boundary and CTA intent. Natural phrasing is preferred over literal translation, but one locale must not introduce stronger claims than the other.

Public professional claims must be supported by the visible project/repository state or another approved public source. Private evidence should not be copied into this repository merely to justify copy.

## SEO and structured data

The layout renders metadata produced by `src/data/seo.ts`; it must not maintain a second title, description, public-profile or social-preview catalog.

`src/data/structured-data.ts` is the only builder for the localized `ProfilePage` graph around the canonical `Person`.

Canonical URLs, alternate locale URLs, Open Graph data and visible identity content should remain aligned.

## Analytics boundary

Analytics events measure navigation interactions only. They must use the allow-listed properties implemented in `src/shared/analytics/conversion.ts` and must not contain personal data, complete URLs, query strings or free-form input.

Adding broader analytics collection requires an explicit privacy review rather than silently expanding the current event payload.

## Agent instruction ownership

Repository-specific coding instructions are intentionally limited to:

| File | Scope |
| --- | --- |
| `AGENTS.md` | Repository-wide agent behavior, privacy and validation rules. |
| `.github/copilot-instructions.md` | GitHub Copilot project guidance. |
| `.github/instructions/source.instructions.md` | Source placement, real consumers and dependency direction. |
| `.github/instructions/app.instructions.md` | Application shell, layout, global styles and app-level ownership. |
| `.github/instructions/design-system.instructions.md` | Implemented tokens, channel expression, accessibility and visual tests. |

Do not add generic per-layer or per-segment templates. A new instruction file must reference actual paths, describe implemented behavior, have a clear consumer and align with executable checks.

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
