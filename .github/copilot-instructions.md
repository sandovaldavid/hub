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

## Architecture

Use the existing shallow structure rather than imposing full Feature-Sliced Design:

```text
src/app       global layout, styles and page models
src/pages     route composition
src/data      typed content, URLs, SEO and structured data
src/shared    reusable UI, utilities, i18n and analytics
src/entities  reusable product concepts
src/features  interactive user actions
src/widgets   composed page sections
```

Import concrete files when a barrel adds no useful public boundary. Keep content and external URLs out of visual components. Run `bun run check:architecture` after changing imports or placement.

## Identity, content and privacy

- David's real identity and Software Engineer positioning remain primary.
- The logo and visual theme are supporting assets.
- Preserve factual parity between English and Spanish.
- Keep project lifecycle, repository access and demo availability accurate.
- Do not invent seniority, leadership, adoption, scale, metrics, certifications or business outcomes.
- Do not expose private Cortex-L7, Atena, client, credential, phone or personal-contact data.
- Figma owns approved visual intent; Cortex-L7 owns rationale, evidence interpretation, plans and history.

## Design implementation

Use this ownership path:

```text
Identity Core primitive -> semantic role -> Link Hub channel alias -> component role -> component
```

`src/app/styles/global.css` owns shared primitives and aliases. Preserve Light, Dark and System themes, keyboard operation, visible focus, contrast, reduced motion, high contrast and mobile-first layout. Do not introduce Portfolio Retro terminal, HUD, phosphor, pixel, glow, glitch or scanline expression.

## Validation

Use repository scripts:

```bash
bun install --frozen-lockfile
bun run validate:local
```

Do not report a missing, skipped, disabled or quota-blocked GitHub Actions run as passed. Record exact commands and classify checks as `Passed`, `Failed`, `Not run`, `Blocked` or `Not applicable`.

## Documentation

Do not create strategy, decision, audit, plan, note or handoff documents in this repository. Update current operational facts in `README.md`, `docs/architecture.md`, `docs/operations.md`, `AGENTS.md`, `CONTRIBUTING.md` or `SECURITY.md` only when contributors need them to build, test, deploy or maintain the source. Put durable context in Cortex-L7.
