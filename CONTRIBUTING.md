# Contributing

Thanks for taking the time to improve the Hub.

This is David Sandoval's personal professional hub, so the product scope is intentionally narrow. Contributions are most useful when they improve correctness, accessibility, maintainability, documentation, performance or the reliability of an existing user flow.

For a substantial new feature or product-direction change, open an issue first so the scope can be discussed before implementation begins.

## Before you start

Read:

- [`README.md`](README.md) for the project purpose and quick start;
- [`docs/architecture.md`](docs/architecture.md) for source placement and dependency rules;
- [`docs/operations.md`](docs/operations.md) for validation and delivery;
- [`docs/accessibility/manual-checklist.md`](docs/accessibility/manual-checklist.md) when the change affects UI, content hierarchy, interaction, motion or color.

`AGENTS.md` and `.github/**instructions*.md` contain additional repository constraints for coding agents. Human contributors do not need private maintainer systems to work on this repository.

## Development workflow

`develop` is the integration branch. `main` is the stable production branch.

```text
feature/*, fix/*, refactor/*, docs/* -> develop -> main
```

For an external contribution:

1. Fork the repository.
2. Create your branch from the latest `develop`.
3. Keep the change focused on one problem or cohesive improvement.
4. Run the relevant validation locally.
5. Open a pull request against `develop`.

Example:

```bash
git clone https://github.com/<your-user>/hub.git
cd hub
git remote add upstream https://github.com/sandovaldavid/hub.git
git fetch upstream
git switch -c fix/example upstream/develop
bun install --frozen-lockfile
```

## Commit style

Use Conventional Commits where practical:

```text
feat(scope): add behavior
fix(scope): correct behavior
docs(scope): clarify documentation
refactor(scope): simplify implementation
```

Avoid unrelated cleanup in the same pull request.

## Implementation expectations

Preserve the current product and architecture contracts:

- David's real identity and Software Engineer positioning remain primary;
- the Hub remains a compact recognition and routing surface rather than a portfolio duplicate;
- public content, URLs, metadata and structured data stay in their typed owners;
- English and Spanish preserve the same facts, lifecycle state, privacy boundary and CTA intent;
- shared Identity System primitives flow through semantic and channel/component roles rather than a second palette;
- Light, Dark and System themes remain supported;
- keyboard operation, visible focus, reduced motion, contrast and responsive behavior remain first-class requirements;
- source placement stays shallow and concrete instead of introducing speculative architecture;
- tests are updated when a behavior or repository contract changes.

Do not introduce unsupported claims about seniority, leadership, adoption, scale, metrics, certifications or business impact.

Do not expose private employer, client, financial, credential, phone, personal-contact or maintainer-strategy information.

## Validation

Run at least the fast quality gate for source changes:

```bash
bun run validate:quality
```

Run the complete local gate when the change affects browser behavior, accessibility, themes, responsive layout, SEO or release-sensitive behavior:

```bash
bun run validate:local
```

The full gate adds Playwright, Axe and Lighthouse coverage to the repository-quality checks.

When a platform, browser or hosted check could not be run, say so explicitly. Use one of these states in the pull request when useful:

- `Passed`;
- `Failed`;
- `Not run`;
- `Blocked`;
- `Not applicable`.

A missing, skipped, disabled, interrupted or quota-blocked GitHub Actions run is not a passing result.

For visual or content changes, also review `/` and `/es/` on relevant viewport sizes and themes. Follow the manual accessibility checklist when applicable.

## Pull requests

A good pull request explains:

- the problem being solved;
- what changed and what intentionally did not change;
- relevant issue or context;
- commands and checks actually run;
- screenshots or recordings for visible changes;
- accessibility, localization or privacy impact when relevant;
- known limitations or follow-up work.

The repository's pull request template mirrors these expectations.

## Public contributor boundary

Maintainers may use external design or private strategy systems for long-term brand governance and decision history. Contributors are **not** expected to have access to them.

Any requirement necessary to implement or review a public change must be represented in this repository, its tests, or the associated issue/pull request. If a request appears to depend on unavailable private context, ask for the requirement to be stated publicly rather than guessing.

## Licensing

This repository currently has no open-source `LICENSE` file. A contribution does not change that status. Do not assume that the repository or its visual assets may be reused or redistributed outside the permissions explicitly provided by the owner.
