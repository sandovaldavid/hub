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

Work from public repository evidence first: source, configuration, tests, workflows, documentation, issues and pull requests.

Do not assume access to private strategy systems, employer context, private repositories or unpublished design files. If an implementation requirement depends on unavailable context, surface that dependency instead of guessing. Maintainer-only sources may inform a task when their relevant requirements are explicitly supplied, but the repository must remain buildable and testable without them.

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

Scoped source rules are limited to:

- `.github/instructions/source.instructions.md`;
- `.github/instructions/app.instructions.md`;
- `.github/instructions/design-system.instructions.md`.

Do not add generic layer or segment templates. Every instruction must map to current source paths, implemented behavior and an executable validation contract.

## Identity, content and privacy

- David's real identity and Software Engineer positioning remain primary.
- The logo and visual theme are supporting assets.
- Preserve factual parity between English and Spanish.
- Keep project lifecycle, repository access and demo availability accurate.
- Do not invent seniority, leadership, adoption, scale, metrics, certifications or business outcomes.
- Do not expose confidential employer/client information, credentials, private contact data or maintainer-private strategy/planning content.

## Design implementation

Use this ownership path:

```text
Identity Core primitive -> semantic role -> Link Hub channel alias -> component role -> component
```

`src/app/styles/global.css` owns shared primitives and aliases. Preserve Light, Dark and System themes, keyboard operation, visible focus, contrast, reduced motion, high contrast and mobile-first layout. Do not introduce Portfolio Retro terminal, HUD, phosphor, pixel, glow, glitch or scanline expression.

When a task includes an approved external visual reference, implement only the requirements that are actually available from that reference or stated in the task. Otherwise preserve the existing public design contract.

## Validation

Use repository scripts:

```bash
bun install --frozen-lockfile
bun run validate:quality
```

Use the complete local gate for browser-, accessibility- or release-sensitive work:

```bash
bun run validate:local
```

Do not report a missing, skipped, disabled or quota-blocked GitHub Actions run as passed. Record exact commands and classify checks as `Passed`, `Failed`, `Not run`, `Blocked` or `Not applicable`.

## Documentation

Keep repository documentation focused on information contributors need to understand, build, test and maintain the public source.

Do not add private strategy, personal planning, confidential evidence or session-handoff documents to the repository. Maintainers may preserve durable private context elsewhere, but any constraint that affects a public implementation must also be represented by repository code/tests, documentation or the associated issue/pull request.
