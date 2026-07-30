# Architecture

This repository uses a pragmatic, shallow structure for a small static Astro application. It deliberately avoids applying full Feature-Sliced Design ceremony where the product does not have enough domain complexity to justify it.

## Top-level responsibilities

| Directory | Responsibility |
| --- | --- |
| `src/app` | Global layout, styles, channel tokens and page-level models. |
| `src/pages` | Astro routes only. Pages compose sections and load localized data. |
| `src/data` | Typed content, external URLs, SEO metadata, structured data and configuration used by routes and components. |
| `src/shared` | Reusable UI primitives, assets, utilities, i18n and analytics infrastructure. |
| `src/entities` | Reusable domain-shaped UI and logic that has more than one consumer. |
| `src/features` | Interactive user actions with their own behavior, such as sharing or theme selection. |
| `src/widgets` | Page sections that compose multiple components and data sources. |
| `tests` | Unit, E2E, accessibility and performance regression coverage. |
| `scripts` | Repository validation and maintenance scripts. |

## Placement rules

1. Put route composition in `src/pages`; do not hide routes behind barrels.
2. Put static content and external URLs in `src/data`, not inside visual components.
3. Add a component to `shared` only when it is genuinely reusable across unrelated sections.
4. Keep a module in `entities`, `features` or `widgets` only when the name communicates a meaningful product concept.
5. Import concrete files directly. Do not add `index.ts` files that only re-export a single implementation.
6. Prefer one model file and one implementation over nested `model`, `lib` and `ui` folders when a module remains small.
7. A new top-level directory requires a documented responsibility and at least two clear consumers or a strong technical boundary.

## Dependency direction

Routes and layouts may depend on widgets, features, entities, shared modules and data. Widgets may depend on features, entities, shared modules and data. Features and entities may depend on shared modules and data. Shared modules must not depend on higher-level layers.

Circular imports are prohibited. Run:

```bash
bun run check:architecture
```

The command scans TypeScript, JavaScript and Astro imports, rejects circular dependencies and prevents imports through single-module FSD barrels such as `@features/theme-toggle`.

## Visual token boundary

`src/app/styles/global.css` is the single implementation boundary for Identity Core primitives, Link Hub Light/Dark aliases and component color roles. Components may consume channel aliases or component roles, but they must not define a second primitive brand palette or choose independent Light/Dark ramp steps.

External platform colors are a narrow exception owned by `src/entities/social-link/ui/SocialButton.css`. They remain local `--platform-*` values and must not flow into general Link Hub surfaces, text, focus or status behavior.

The complete contract, source authority and validation rules are documented in [`design-system.md`](design-system.md).

## SEO data boundary

Localized metadata is owned by `src/shared/i18n/locales/en.json` and `es.json`, assembled through `src/data/seo.ts` and rendered by `src/app/layouts/Layout.astro`. The layout must not own a second copy of titles, descriptions, social-preview values or public profiles.

`src/data/site.config.ts` owns the runtime copy of the approved public identity registry and the social-preview asset contract. `src/data/structured-data.ts` is the only builder for the schema.org graph. It models each localized Hub route as a `ProfilePage` around one canonical `Person` whose long-form website is the portfolio.

The complete search intent, schema rationale, localization contract and manual social-preview procedure are documented in [`seo.md`](seo.md).

## Trade-offs

The remaining `entities`, `features` and `widgets` directories are retained because they still communicate useful boundaries for profile UI, interactive controls and page sections. The repository does not pursue a large-scale FSD public API for every folder. Direct imports are preferred because this site has few routes and contributors benefit more from discoverability than from indirection.

Future migrations should be incremental. Moving files is justified only when it reduces navigation cost without changing routes, localization, accessibility or analytics behavior.
