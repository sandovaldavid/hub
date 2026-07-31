# David Sandoval — Professional Link Hub

A static, bilingual hub that helps recruiters, clients and collaborators recognize David Sandoval, understand his current Software Engineer positioning and reach the right destination quickly.

[View production](https://hub.sandovaldavid.com) · [Open the portfolio](https://sandovaldavid.com) · [View the résumé](https://sandovaldavid.com/resume/david-sandoval-resume.pdf)

[![Current production preview](public/og/og-image.png)](https://hub.sandovaldavid.com)

## Product responsibility

The Hub is a compact recognition and routing surface. It does not replace the portfolio, résumé or project repositories.

- **Figma** owns approved visual intent and assets.
- **This repository** owns current routes, content implementation, metadata, tests, commands and delivery configuration.
- **Cortex-L7** owns durable rationale, alternatives, evidence interpretation, plans, history and cross-channel status.
- **Portfolio, résumé and project repositories** own detailed professional evidence.

The repository was historically named `linktree`. New operational references use `hub`; old references remain only where they describe dated history or a permanent redirect.

## Implementation

- Astro pre-renders `/` in English and `/es/` in Spanish.
- Typed content and public destinations live under `src/data`.
- English and Spanish catalogs live under `src/shared/i18n/locales`.
- Browser JavaScript is limited to theme management, native sharing, conversion analytics and Vercel Analytics.
- Light, Dark and System themes consume the shared Identity System through Link Hub channel aliases.
- Localized metadata and `ProfilePage` structured data identify one canonical `Person`.

## Why Astro

This product has two content-heavy routes and a small interaction boundary. Astro emits static HTML without hydrating React, Vue or Svelte islands for the page shell.

The browser behavior is implemented by:

| Behavior | Source |
| --- | --- |
| Apply and change Light/Dark/System theme | `src/entities/theme` and `src/features/theme-toggle` |
| Share or copy the current URL | `src/features/share-button` |
| Record privacy-safe navigation events | `src/shared/analytics/conversion.ts` |
| Collect deployment analytics | `@vercel/analytics/astro` in `src/app/layouts/Layout.astro` |

## Source structure

```text
src/
├── app/       # layout, global styles and page-level models
├── data/      # typed content, URLs, SEO and structured data
├── entities/  # reusable product concepts
├── features/  # interactive user actions
├── pages/     # English and Spanish route composition
├── shared/    # reusable UI, assets, utilities, i18n and analytics
└── widgets/   # composed page sections
```

See [`docs/architecture.md`](docs/architecture.md) for placement, dependency and runtime ownership rules.

## Run locally

Prerequisites:

- Bun `1.3.14`;
- Node.js `22.19` or newer when running the native Lighthouse toolchain.

```bash
git clone git@github.com:sandovaldavid/hub.git
cd hub
git switch develop
bun install --frozen-lockfile
bun run dev
```

Open `http://localhost:4321`.

The DevContainer is the recommended environment on Fedora or for reproducible Playwright and Lighthouse execution. Setup and recovery instructions are in [`docs/operations.md`](docs/operations.md).

## Validation

Run the complete CI-equivalent gate:

```bash
bun run validate:local 2>&1 | tee validation-local.log
```

It covers type checking, architecture, formatting, lint, link health, unit tests, build, Playwright, Axe and Lighthouse mobile/desktop audits.

The accessibility implementation targets WCAG 2.1 AA practices and is regression-tested with Axe; it does not claim formal conformance certification. A disabled, skipped, interrupted, missing or quota-blocked GitHub Actions run is **not** treated as successful validation.

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start Astro on port `4321` |
| `bun run build` | Validate removed barrels and build the static site |
| `bun run check:architecture` | Detect circular dependencies and forbidden barrels |
| `bun run check:links` | Validate repository and public destinations |
| `bun run format:check` | Verify Prettier formatting |
| `bun run lint` | Run ESLint |
| `bun run test:unit` | Run unit and repository-contract tests |
| `bun run test:e2e` | Run Playwright functional, SEO and accessibility coverage |
| `bun run test:e2e:show-report` | Serve the Playwright report on port `9323` |
| `bun run test:lighthouse` | Run mobile and desktop Lighthouse profiles |
| `bun run validate:quality` | Run type, architecture, format, lint, link, unit and build checks |
| `bun run validate:local` | Run the complete local validation gate |
| `bun run rulesets:plan` | Inspect missing or drifted GitHub rulesets |
| `bun run rulesets:verify` | Compare live rulesets with versioned desired state |

## Delivery

```text
feature/*, fix/*, refactor/*, docs/* -> develop -> main
```

`develop` is the integration branch. `main` is the stable deployment branch. Desired rulesets are versioned under `.github/rulesets/`; their live enforcement must be verified in GitHub rather than inferred from repository files.

## Documentation

The repository intentionally keeps a small documentation surface:

- [`AGENTS.md`](AGENTS.md) — agent workflow, identity, privacy and ownership rules;
- [`docs/architecture.md`](docs/architecture.md) — current source boundaries and runtime ownership;
- [`docs/operations.md`](docs/operations.md) — setup, validation, delivery, maintenance and troubleshooting;
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution expectations;
- [`SECURITY.md`](SECURITY.md) — private vulnerability reporting.

Decisions, alternatives, audits, notes, plans and historical handoffs belong in Cortex-L7.

## Reuse

This repository does not currently include a `LICENSE` file. Do not assume permission to reuse source code or visual assets unless a license is added.
