# Contributing

Read [`AGENTS.md`](AGENTS.md) before starting work. It defines the Hub's human-first identity, privacy rules, source ownership and validation expectations.

## Workflow

Normal implementation work starts from and targets `develop`:

```text
feature/*, fix/*, refactor/*, docs/* -> develop -> main
```

Use Conventional Commits, keep each pull request cohesive and avoid unrelated cleanup. A change on `develop` is not a verified production result until it is promoted and reviewed live.

## Source documentation

The repository intentionally keeps only the operational documentation contributors need:

- [`docs/architecture.md`](docs/architecture.md) — source placement, dependency direction and runtime ownership;
- [`docs/operations.md`](docs/operations.md) — setup, validation, branches, delivery, maintenance and troubleshooting.

Decisions, alternatives, audits, plans, historical notes, evidence interpretation and session handoffs belong in Cortex-L7. Do not add another repository document when the information is already expressed by code, configuration, tests or one of the two documents above.

## Implementation rules

Contributors must:

- keep David's real identity and Software Engineer positioning primary;
- preserve the Hub as a compact routing surface rather than a portfolio duplicate;
- keep content, URLs, metadata and structured data in their current typed owners;
- verify project claims and distinguish stable, active, private and unavailable states;
- preserve factual and hierarchical parity between English and Spanish;
- use concrete imports and the current shallow architecture;
- consume shared Identity Core primitives through semantic, channel and component roles;
- preserve Light, Dark and System themes, keyboard operation, focus, contrast, reduced motion and responsive behavior;
- update tests with every behavior or contract change.

Contributors must not:

- make an illustration, mascot, logo or theme David's primary identity;
- introduce full Feature-Sliced Design ceremony, speculative abstractions or single-module barrels;
- create a second palette or copy Portfolio Retro terminal/HUD/phosphor expression;
- present unsupported seniority, leadership, adoption, scale, metrics, certifications or business impact;
- expose private Cortex-L7, Atena, client or personal-contact information.

The visual implementation path is:

```text
Identity Core primitive -> semantic role -> Link Hub channel alias -> component role -> component
```

`src/app/styles/global.css` owns shared primitives and aliases. The external-platform color exception is scoped to `src/entities/social-link/ui/SocialButton.css`.

## Validation

Use a compatible Ubuntu environment or the repository DevContainer:

```bash
bun install --frozen-lockfile
bun run validate:local
```

Record the exact head SHA and classify every relevant check as `Passed`, `Failed`, `Not run`, `Blocked` or `Not applicable`. A disabled, skipped, missing or quota-blocked GitHub Actions run is not a pass.

For identity, copy, SEO or design changes, also inspect `/` and `/es/` on mobile and desktop in Light, Dark and System themes, including keyboard focus, reduced motion and deployed social previews where applicable.
