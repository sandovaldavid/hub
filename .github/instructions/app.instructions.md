---
applyTo: "src/app/**/*.{astro,css,ts,js}"
---

# App layer instructions

Follow [`docs/architecture.md`](../../docs/architecture.md). The Hub uses a shallow Astro structure, not full Feature-Sliced Design ceremony.

`src/app` owns application-wide composition only:

- `layouts/` — the global document shell, metadata rendering, controls and analytics integration;
- page-level models only when they are genuinely shared by application composition.

Rules:

- Keep route entry points and `Layout` + page-widget composition in `src/pages`.
- Keep shared Identity Core primitives, channel aliases and global accessibility styles in `src/shared/styles/global.css`.
- Keep content, public URLs, localized metadata and structured data in `src/data` or localized catalogs.
- Keep reusable UI and utilities in `src/shared`.
- Do not add SPA routing, framework providers, stores or speculative application abstractions without a concrete product requirement.
- Do not create `index.ts` barrels that only re-export one implementation.
- The layout may render SEO and structured data, but it must consume the canonical builders rather than maintaining duplicate values.

After changing app composition or imports, run:

```bash
bun run check:architecture
bun x astro check
bun run test:unit
bun run build
```

Use `bun run validate:local` before approval.
