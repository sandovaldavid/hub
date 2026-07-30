# Contributing

Read [`AGENTS.md`](AGENTS.md) before starting work. It defines the repository workflow, human-first identity rules, validation expectations and the boundary between this repository, Figma and Cortex-L7.

## Branch and pull-request flow

Ordinary implementation work starts from and targets `develop`:

```text
feature/*, fix/*, refactor/*, docs/* -> develop -> main
```

Use Conventional Commits. Keep changes cohesive and avoid unrelated cleanup in issue-resolution pull requests.

A change present on `develop` is not a verified production result. Promotion and live validation remain separate delivery gates.

## Documentation ownership

Read [`docs/repository-vault-boundary.md`](docs/repository-vault-boundary.md) before adding architecture, strategy, history or decision documentation.

The source repository owns current behavior, setup, commands, tests, deployment and contributor contracts. Cortex-L7 owns durable strategy, rationale, alternatives, claim classification, private evidence context, cross-channel status, historical interpretation, plans and handoffs.

Do not duplicate private vault content in this repository. The checked-out project must remain usable without Cortex-L7 access.

## Architecture

Follow [`docs/architecture.md`](docs/architecture.md). Import concrete modules directly, preserve dependency direction and run `bun run check:architecture` before publishing.

## Content and evidence

Read [`docs/content-governance.md`](docs/content-governance.md) before changing profile copy, portrait, availability, skills, project cards, consulting language, calls to action or evidence wording.

Contributors must:

- keep David's name, real identity and Software Engineer positioning primary;
- preserve the Hub's role as a compact recognition and routing surface;
- verify project summaries against the relevant source repository or approved evidence record;
- separate stable releases from active development;
- expose private repository and demo limitations explicitly;
- keep English and Spanish facts, lifecycle state and claim boundaries equivalent;
- make technology emphasis reflect verified professional and project relevance;
- ensure consulting wording matches the current operational launch state.

Contributors must not:

- make an illustration, mascot, logo or channel theme David's primary identity;
- duplicate portfolio case studies or résumé paragraphs mechanically;
- present a broad technology inventory as a core stack without evidence;
- imply project adoption, production scale, users, revenue, leadership or business impact without verification;
- expose private Cortex-L7, Atena, client or personal-contact information.

## Link Hub design-system rules

Read [`docs/design-system.md`](docs/design-system.md) before changing colors, typography, effects, focus, cards, badges, buttons or theme behavior.

The required ownership order is:

```text
Identity Core primitive -> semantic role -> Link Hub channel alias -> component role -> component
```

Contributors must:

- copy the exact approved OKLCH Identity Core values from Figma descriptions;
- preserve HEX only as the documented sRGB/interoperability reference;
- define Light and Dark behavior at the semantic, channel or component-role layer;
- use JetBrains Mono for display/headings and Inter for reading;
- preserve David's real portrait, name and professional evidence as the primary hierarchy;
- add or update tests when introducing a token or component state;
- document any unavoidable raw color literal as a narrowly scoped exception.

Contributors must not:

- convert the HEX references independently or generate a visually similar local ramp;
- add another primary, accent, neutral or status palette;
- encode Light/Dark behavior through raw ramp utilities in components;
- copy Portfolio Retro terminal, HUD, pixel, phosphor, glow, glitch or scanline language;
- use `Retro MD` or larger hard-offset shadows;
- reuse social-platform colors as David's brand colors;
- weaken contrast, reduced-motion, keyboard or high-contrast behavior.

## SEO and public identity

Read [`docs/seo.md`](docs/seo.md) before changing titles, descriptions, Open Graph, Twitter Cards, canonicals, `hreflang`, robots, sitemap behavior or JSON-LD.

Contributors must:

- keep David's name and durable Software Engineer role primary;
- treat stacks, tools and technologies as supporting evidence rather than the identity definition;
- keep English and Spanish metadata semantically equivalent;
- build JSON-LD through `src/data/structured-data.ts` instead of embedding a second schema graph in the layout;
- source public profiles from `siteConfig.sameAs` and the approved contact registry;
- update unit and E2E contracts when metadata, schema relationships or social-preview assets change;
- mark real platform previews as unconfirmed until the deployed result is inspected.

Contributors must not introduce unsupported seniority, leadership, specialization, certification, authority, metrics or business-outcome claims.

## Validation

Use the repository commands from a compatible Ubuntu environment or the DevContainer:

```bash
bun install --frozen-lockfile
bun run validate:local
```

For a focused design-system change, inspect the Playwright report attachments produced by `tests/e2e/channel-theme.spec.ts`. To capture matching deployed baseline screenshots, set `BASELINE_URL` as documented in [`docs/design-system.md`](docs/design-system.md).

For an SEO change, verify the exact EN/ES metadata and JSON-LD through `tests/e2e/seo.spec.ts`, then inspect deployed social previews as documented in [`docs/seo.md`](docs/seo.md).

A disabled, missing, skipped or quota-blocked GitHub Actions run is not a pass. Record every command that was not executed and the reason in the pull request.