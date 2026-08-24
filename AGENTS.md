# AGENTS.md

## Purpose

This repository implements David Sandoval's compact bilingual professional Hub at `hub.sandovaldavid.com`.

David is the identity. The Hub helps recruiters, hiring managers, collaborators and selected potential clients recognize him as a Software Engineer and reach verified evidence or contact channels quickly. It is not a separate brand, a second portfolio, a complete case-study archive or a generic technology catalog.

The repository was historically named `linktree`. Use `hub` for current operational references; preserve the former name only in dated history or permanent redirects.

## Public repository boundary

The repository is public and must remain understandable, buildable and testable without private maintainer systems.

Do not assume access to Figma, Cortex-L7, employer systems, private repositories or unpublished planning documents. If a requirement needed to implement or review a public change is not represented by source, tests, repository documentation, an issue or a pull request, surface the gap instead of inventing the missing context.

Maintainer-only systems may still exist for long-term visual governance, strategy and historical decision records. They are not prerequisites for contributor work.

## Source authority

| Source | Owns |
| --- | --- |
| This repository | Current behavior, routes, content implementation, metadata, architecture, commands, tests and delivery configuration |
| Live Hub | Final deployed output requiring direct verification |
| Maintainer design references | Approved visual intent and source assets when explicitly supplied for a task |
| Maintainer strategy/history systems | Durable rationale, private evidence interpretation, plans and cross-channel history; never required to build or test the public repository |
| Portfolio, résumé and project repositories | Detailed professional and technical evidence when public and explicitly referenced |

Never copy private strategy, personal records, internal plans or confidential evidence into source documentation merely to make them available to an agent.

## Branch workflow

Normal work starts from and targets `develop`:

```text
feature/*, fix/*, refactor/*, docs/* -> develop -> main
```

`main` is the stable delivery branch. A change present only on `develop` is not a verified production result.

Before modifying source:

1. Read the issue or pull request and its discussion.
2. Read `README.md`, `CONTRIBUTING.md`, `docs/architecture.md` and `docs/operations.md`.
3. Inspect relevant source, tests, scripts, workflows and configuration.
4. Compare `develop` with `main` when delivery or public alignment is part of the task.
5. Verify public claims against their actual public source or evidence supplied in the task.
6. Keep the implementation self-contained for contributors who do not have maintainer-private context.

## Human-first identity and content

Preserve this hierarchy:

1. David's real identity and portrait;
2. Software Engineer positioning;
3. relevant evidence and destinations;
4. concise professional context and method;
5. logo and visual system as supporting assets.

Do not:

- make an illustration, avatar, mascot or logo David's primary representation;
- present `hub` or `Link Hub Compact` as an independent brand;
- turn the Hub into a portfolio duplicate or technology catalog;
- use terminal, HUD, phosphor, pixel, glitch, gamer or cyberpunk expression;
- center the identity on permanent junior branding;
- use `Full-stack Developer` as the primary category;
- introduce unsupported seniority, leadership, scale, adoption, metrics, certifications or business outcomes.

Project summaries must state lifecycle and access boundaries accurately. Stable releases and active development must remain distinct. Private repositories and unavailable demos must be explicit. Technology emphasis must reflect current professional or evidenced project relevance. Consulting language must match the current operational launch state.

English and Spanish must preserve the same facts, claim status, lifecycle state, privacy boundary and CTA intent, using natural adaptation rather than literal translation.

## Public identity and privacy

Public URLs and contact values are implemented through `src/data/site.config.ts`.

Never add:

- personal phone numbers or private WhatsApp endpoints;
- unapproved social profiles;
- credentials, secrets or internal endpoints;
- confidential employer, client or financial information;
- private strategy/planning content;
- reconstructible private product details.

## Architecture and design

Follow [`docs/architecture.md`](docs/architecture.md).

- Keep route composition in `src/pages`.
- Keep typed content, URLs and metadata in `src/data` or localized catalogs.
- Import concrete modules directly when a barrel adds no useful boundary.
- Preserve the shallow architecture; do not impose full Feature-Sliced Design ceremony.
- Keep shared Identity Core primitives, Link Hub aliases and component roles in `src/app/styles/global.css`.
- Keep structured data in `src/data/structured-data.ts`.
- Preserve mobile-first layout, keyboard operation, contrast, Light/Dark/System themes, reduced motion and social metadata.

When a visual request references an external design source that is not available, preserve the implemented public contract and ask the task owner to provide the relevant requirement in the issue/PR rather than guessing.

## Validation

Use repository commands rather than ad hoc substitutes:

```bash
bun install --frozen-lockfile
bun run validate:quality
```

Use the complete gate for browser-, accessibility- or release-sensitive work:

```bash
bun run validate:local
```

Record exact commands, the commit SHA and one of `Passed`, `Failed`, `Not run`, `Blocked` or `Not applicable` for each relevant check. Missing, skipped, disabled, quota-blocked or interrupted GitHub Actions are not successful validation.

Identity or content work also requires manual review of:

- English and Spanish meaning parity;
- Light, Dark and System themes;
- desktop and mobile hierarchy;
- keyboard, focus, contrast and reduced motion;
- portrait and social-preview composition;
- canonical URLs and public destinations;
- claims against their evidence source;
- the final live output after promotion to `main`.

See [`docs/operations.md`](docs/operations.md) for setup, CI, branch, deployment and maintenance procedures.

## Documentation placement

Keep in this repository the current public information required to understand, build, test and maintain the source:

- setup and commands;
- architecture and ownership;
- tests and validation;
- delivery and maintenance;
- security and privacy boundaries;
- contributor guidance and troubleshooting.

Do not add documents containing private strategy, personal career planning, confidential evidence, unpublished business context or session handoffs.

If a durable maintainer decision is stored elsewhere, ensure any implementation constraint it creates is also represented publicly through code, tests, repository documentation or the associated change request.

Do not duplicate an authoritative repository contract in multiple documents when a link is sufficient.
