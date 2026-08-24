---
applyTo: "src/**/*.{astro,css,ts,js,json}"
---

# Hub source instructions

Follow [`AGENTS.md`](../../AGENTS.md) and [`docs/architecture.md`](../../docs/architecture.md). The Hub uses a shallow Astro structure with explicit ownership; directory names do not imply full Feature-Sliced Design ceremony.

## Current application shape

- Routes are limited to English `/` and Spanish `/es/` unless a product requirement explicitly changes the routing contract.
- Astro owns static rendering. Browser JavaScript is limited to theme behavior, sharing, privacy-safe analytics and small progressive-enhancement interactions such as scroll-to-top behavior.
- Do not invent portfolio pages, dynamic project routes, contact forms, APIs, stores or framework islands that the current product does not require.

## Source ownership

- `src/pages` composes route entry points only.
- `src/data` owns public identity, destinations, typed content, calls to action, SEO and structured data.
- `src/shared` owns reusable UI, assets, utilities, localization and analytics infrastructure.
- `src/entities` owns reusable product concepts with multiple consumers.
- `src/features` owns bounded user actions such as theme selection and sharing.
- `src/widgets` owns page sections composed from current data and reusable modules.
- `src/app` follows the dedicated [`app.instructions.md`](app.instructions.md).
- Visual token and accessibility changes follow [`design-system.instructions.md`](design-system.instructions.md).

## Placement and dependency rules

Use this dependency direction:

```text
pages/layouts
  -> widgets
  -> features/entities
  -> shared/data
```

- Keep lower-level modules independent from page composition.
- Keep content constants, public URLs and metadata out of visual components.
- Import concrete modules directly when an `index.ts` file would only re-export one implementation.
- Add a new slice, segment or abstraction only when it has a distinct responsibility and real consumers.
- Preserve the existing localized catalogs rather than creating a second translation source.
- Preserve the single SEO and structured-data builders in `src/data`.
- Prefer progressive enhancement over a persistent client runtime when the interaction can be expressed with static HTML/CSS plus a small isolated script.

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
