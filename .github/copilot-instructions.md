# AI coding instructions for Hub

Follow [`AGENTS.md`](../AGENTS.md) first. Use [`README.md`](../README.md), [`docs/architecture.md`](../docs/architecture.md) and [`docs/operations.md`](../docs/operations.md) for current repository behavior and commands.

## Project

- Repository: `sandovaldavid/hub`.
- Integration branch: `develop`.
- Stable branch: `main`.
- Public origin: `https://hub.sandovaldavid.com`.
- Historical repository name: `linktree`; use `hub` for new operational references.
- Stack: Astro, TypeScript, Tailwind CSS, Bun and Playwright.
- Routes: English `/` and Spanish `/es/`.

The Hub is David Sandoval's compact professional recognition and routing surface. It is not a second portfolio, an independent brand or a generic technology catalog.

## Public repository boundary

Work from public repository evidence first: source, configuration, tests, workflows, documentation, issues and pull requests. Do not assume access to private strategy systems, employer context, private repositories or unpublished design files.

## Architecture

Use the existing shallow structure rather than imposing full Feature-Sliced Design:

```text
src/pages     route composition
src/app       global document shell and app composition
src/widgets   composed page sections
src/features  interactive user actions
src/data      typed content, URLs, SEO and structured data
src/entities  reusable product concepts and models
src/shared    reusable UI, utilities, styles, i18n and analytics
```

The dependency direction is executable through `bun run check:architecture`, including CSS references. Import concrete files when a barrel adds no useful public boundary. Keep content and external URLs out of visual components.

## Identity, content and privacy

- David's real identity and Software Engineer positioning remain primary.
- The logo and visual theme are supporting assets.
- Preserve factual parity between English and Spanish.
- Keep project lifecycle, repository access and demo availability accurate.
- Do not invent unsupported professional claims or expose private data.

## Design implementation

Use this ownership path:

```text
Identity Core primitive -> semantic role -> Link Hub channel alias -> component role -> component
```

`src/shared/styles/global.css` owns shared primitives and aliases. `Layout.astro` loads it once and component styles use `@reference` when they need Tailwind utility context. Preserve Light, Dark and System themes, keyboard operation, visible focus, contrast, reduced motion, high contrast and mobile-first layout.

## Validation

Use repository scripts:

```bash
bun install --frozen-lockfile
bun run validate:quality
bun run validate:local
```

Do not report a missing, skipped, disabled or quota-blocked GitHub Actions run as passed. Record exact commands and classify checks as `Passed`, `Failed`, `Not run`, `Blocked` or `Not applicable`.
