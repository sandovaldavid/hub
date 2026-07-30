# AGENTS.md

## Purpose

This repository implements David Sandoval's compact bilingual professional Hub at `hub.sandovaldavid.com`.

David Sandoval is the identity. The Hub is a routing surface that helps recruiters, hiring managers, collaborators and selected potential clients recognize David, understand his current Software Engineer positioning and reach verified evidence or contact channels quickly.

The Hub is not:

- a separate company or product brand;
- a replacement for the portfolio or résumé;
- a complete technical case-study archive;
- a generic technology catalog;
- a place to publish private Cortex-L7 context.

## Source authority

Use the following ownership order.

| Source | Owns |
| --- | --- |
| Figma Identity System and related visual systems | Designed intent, approved assets, visual composition and channel-theme reference |
| This repository | Runtime behavior, routes, localized content implementation, metadata, architecture, commands, tests, deployment configuration and contributor contracts |
| Cortex-L7 | Durable strategy, rationale, alternatives, cross-channel decisions, claim classification, private evidence context, historical interpretation, plans and session handoffs |
| Portfolio, résumé and public project repositories | Verifiable professional and project evidence |
| Live Hub | Final published output that must be checked after deployment |

A source implementation must remain understandable and maintainable without access to the private vault. Do not copy private strategy, personal records, confidential evidence or internal planning into this repository merely to make an agent self-contained.

See [`docs/repository-vault-boundary.md`](docs/repository-vault-boundary.md).

## Branch workflow

Ordinary work starts from and targets `develop`:

```text
feature/*, fix/*, refactor/*, docs/* -> develop -> main
```

`main` represents the stable delivery branch. A change present only on `develop` is not a verified production outcome.

Before modifying source:

1. Read the complete issue and discussion.
2. Read `README.md`, `CONTRIBUTING.md` and the relevant documents under `docs/`.
3. Inspect existing tests, scripts, workflows and comparable implementations.
4. Compare `develop` with `main` when delivery or public alignment is part of the task.
5. Use Cortex-L7 only for durable context that the repository intentionally does not own.
6. Verify current claims against their actual source repositories or approved evidence records.

## Human-first identity contract

Preserve this hierarchy:

1. David's real identity and portrait.
2. Software Engineer positioning.
3. Relevant evidence and destinations.
4. Voice, method and current professional context.
5. Name, logo and visual system.
6. Secondary editorial expression.

Do not:

- make an illustrated portrait, avatar, mascot or logo the primary representation of David;
- present `hub`, `Link Hub Compact` or any visual theme as an independent brand;
- use terminal, HUD, phosphor, pixel, glitch, Matrix, gamer or cyberpunk expression;
- center the identity on a permanent junior narrative;
- use `Full-stack Developer` as the primary category;
- introduce unsupported seniority, leadership, authority, metrics, business outcomes or certifications.

## Content and evidence rules

Read [`docs/content-governance.md`](docs/content-governance.md) before changing profile copy, availability, skills, project cards, consulting language, SEO or calls to action.

The Hub should establish, in order:

1. current professional role;
2. audience relevance;
3. concise method or value line;
4. routes to evidence;
5. professional direction only when useful.

Project summaries must be bounded by evidence. Stable releases and active development must not be conflated. Private projects must state their access and demo limitations. A project card may summarize evidence, but the portfolio or source repository owns the full case study.

Technology lists must prioritize verified current relevance. Do not call a broad inventory a "core stack" when it omits David's actual professional core or includes technologies without sufficient evidence.

Consulting or services wording must match the current launch gate recorded by the relevant strategy and operational sources. Preparation is not the same as public availability.

## Public identity and privacy

Public URLs and contact values are implemented through `src/data/site.config.ts`. They must match the approved Canonical Contact Registry.

Never add:

- personal phone numbers;
- private WhatsApp endpoints;
- unapproved social profiles;
- credentials, secrets or internal endpoints;
- confidential Atena data, architecture, algorithms, customers, roadmaps or financial information;
- reconstructible private product details.

## Architecture and implementation

Follow [`docs/architecture.md`](docs/architecture.md).

- Keep route composition in `src/pages`.
- Keep typed content, URLs and metadata in `src/data` or localized catalogs.
- Import concrete modules directly when a barrel adds no useful public boundary.
- Preserve the current shallow architecture; do not introduce full Feature-Sliced Design ceremony without real complexity.
- Keep `src/app/styles/global.css` as the implementation boundary for shared primitives, channel aliases and component color roles.
- Keep structured data in `src/data/structured-data.ts`.

## Validation

Use repository commands rather than ad hoc substitutes:

```bash
bun install --frozen-lockfile
bun run validate:local
```

Record exact commands, commit SHA and results. Missing, skipped, disabled, quota-blocked or interrupted GitHub Actions are not successful validation.

Content or identity work also requires manual review of:

- English and Spanish meaning parity;
- Light and Dark Mode;
- desktop and mobile hierarchy;
- real portrait and social-preview composition;
- deployed canonical URLs and public destinations;
- claims against their evidence source;
- the final live output after promotion to `main`.

## Documentation placement

Put in this repository:

- current setup and commands;
- architecture and data ownership;
- runtime metadata and content contracts;
- test and validation procedures;
- deployment, maintenance, security and contributor instructions;
- implementation-specific design-system behavior.

Put in Cortex-L7:

- why a durable decision was made;
- alternatives and consequences;
- historical branch or incident interpretation;
- cross-channel alignment status;
- claim classification and private evidence context;
- future plans, dependencies and handoffs;
- information that should not be public.

Do not duplicate the same authoritative document in both places.