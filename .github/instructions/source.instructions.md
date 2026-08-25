---
applyTo: "src/**/*.{astro,css,ts,js,json}"
---

# Hub source instructions

Follow [`AGENTS.md`](../../AGENTS.md) and [`docs/architecture.md`](../../docs/architecture.md). The Hub uses a shallow Astro structure with explicit ownership; directory names do not imply full Feature-Sliced Design ceremony.

## Current application shape

- Routes are limited to English `/` and Spanish `/es/` unless a product requirement explicitly changes the routing contract.
- Astro owns static rendering. Browser JavaScript is limited to theme behavior, sharing, privacy-safe analytics and small progressive-enhancement interactions.
- Do not invent portfolio pages, dynamic project routes, contact forms, APIs, stores or framework islands that the current product does not require.

## Source ownership

- `src/pages` owns route entry points and route-level composition.
- `src/app` owns the global document shell and application composition.
- `src/widgets` owns page sections.
- `src/features` owns bounded user actions.
- `src/data` owns public identity, destinations, typed content, calls to action, SEO and structured data.
- `src/entities` owns reusable product concepts and their models/UI.
- `src/shared` owns reusable UI, assets, utilities, localization, analytics, cross-cutting models and design-system styles.

## Placement and dependency rules

Use the executable dependency matrix documented in `docs/architecture.md`:

```text
pages -> app/widgets/features/data/entities/shared
app -> widgets/features/data/entities/shared
widgets -> features/data/entities/shared
features -> data/entities/shared
data -> entities/shared
entities -> shared
shared -> shared
```

The same direction applies to CSS `@import` and `@reference` dependencies. Keep lower-level modules independent from application/page composition, keep localized UI copy in the locale catalogs, and import concrete modules directly when a barrel adds no useful public boundary.

## Product and accessibility constraints

- Keep David Sandoval and Software Engineer positioning primary.
- Preserve English and Spanish factual parity.
- Maintain mobile-first hierarchy, semantic headings, keyboard access, visible focus, contrast, Light/Dark/System themes and reduced motion.
- Do not introduce unsupported claims, private contact data or a second visual identity.

## Validation

After changing source placement, imports or contracts, run:

```bash
bun run check:architecture
bun x astro check
bun run test:unit
bun run build
```

Run `bun run validate:local` before approval when the change affects browser behavior, accessibility, themes or release readiness.
