# Operations

This is the repository runbook for setup, validation, delivery and maintenance. Configuration files, scripts and workflows are the executable source of truth; this document explains how to use them.

## Supported environment

The recommended environment is the repository DevContainer, especially on Fedora or when Playwright and Lighthouse must run in a reproducible Linux browser environment.

Current toolchain constraints are declared in `package.json` and `.devcontainer/`:

- Bun `1.3.14`;
- Node.js `>=22.19.0` for the native Lighthouse toolchain;
- Astro static generation;
- Playwright Chromium and WebKit installed by the DevContainer image.

### Native setup

```bash
git clone git@github.com:sandovaldavid/hub.git
cd hub
git switch develop
bun install --frozen-lockfile
bun run dev
```

The development server is available on port `4321`.

### DevContainer setup

1. Open the repository root in VS Code.
2. Run **Dev Containers: Rebuild Container Without Cache** after changing `.devcontainer/**` or when testing a clean environment.
3. Wait for `postCreateCommand` to complete `bun ci`.
4. Confirm the terminal uses the non-root `node` user in `/workspace`.
5. Run `bun run validate:local`.

The container stores Linux dependencies in `hub-node-modules-v1` and forwards:

- `4321` — Astro development/preview;
- `9323` — Playwright HTML report.

Serve an existing report with:

```bash
bun run test:e2e:show-report
```

A frozen install must fail when `package.json` and `bun.lock` differ. Regenerate and review the lockfile intentionally; do not add a mutable fallback to lifecycle scripts.

## Validation contract

### Complete local gate

```bash
bun run validate:local 2>&1 | tee validation-local.log
```

The command runs, in order:

1. Astro type checking;
2. architecture validation;
3. Prettier verification;
4. ESLint;
5. internal and external link validation;
6. unit and repository-contract tests;
7. the production build;
8. Playwright functional, SEO and accessibility tests;
9. Lighthouse mobile and desktop audits for `/` and `/es/`.

The command is fail-fast. After correcting a failure, rerun the complete gate on the exact branch head.

### Result classification

Record every relevant check as one of:

- `Passed`;
- `Failed`;
- `Not run`;
- `Blocked`;
- `Not applicable`.

A disabled, skipped, interrupted, missing or quota-blocked GitHub Actions run is `Not run` or `Blocked`; it is never `Passed`.

### Stable hosted contexts

The CI workflow defines these functional check names:

- `CI / Quality`;
- `CI / E2E`;
- `CI / Lighthouse`.

`CI / E2E` is the authoritative functional test result.

The exact workflow, artifact flow and commands live in `.github/workflows/ci.yml`. Lighthouse thresholds and profiles live in `.lighthouserc.cjs`. Renaming a required context requires synchronized ruleset and contract-test changes.

## Branch and delivery flow

```text
feature/*, fix/*, refactor/*, docs/* -> develop -> main
```

- Normal work targets `develop`.
- Feature and fix pull requests into `develop` use squash merge.
- Promotions from `develop` to `main`, and reconciliations from `main` back into `develop`, use a merge commit so both branch histories remain connected.
- `main` is the stable deployment branch.
- A change present only on `develop` is not a verified production outcome.

Versioned desired rulesets live in:

- `.github/rulesets/develop.json`;
- `.github/rulesets/main.json`.

Inspect and compare them with live GitHub settings through:

```bash
bun run rulesets:plan
bun run rulesets:verify
```

Administrative writes require the explicit confirmation flags implemented by `scripts/manage-rulesets.mjs`. Do not activate required contexts that GitHub Actions cannot emit. An emergency owner bypass must retain a pull request and documented local validation; it is not a replacement for testing.

Production deployment is configured for `main`. Verify the corresponding GitHub and Vercel result directly; configuration or a merged pull request does not prove a successful live deployment.

## Link and dependency maintenance

- `.github/dependabot.yml` targets `develop` and groups routine dependency updates.
- `scripts/check-links.mjs` validates local targets and public destinations.
- `.github/workflows/maintenance.yml` schedules recurring link checks.
- `config/link-check.json` contains link-check inputs and retry settings.

Run:

```bash
bun run check:links
```

Persistent definitive failures such as HTTP `404` or `410` fail the check. Access controls, rate limits, anti-bot responses, timeouts and server incidents remain visible warnings after retries and require manual review.

Review the production Hub periodically in English and Spanish, on mobile and desktop, checking current role copy, project lifecycle states, résumé, portfolio, contact destinations, themes and social previews.

## Security and licensing

Security reports use the private channel documented in `SECURITY.md`; do not open a public vulnerability issue.

CodeQL is intentionally not configured for the current static-site risk profile. Re-evaluate that decision before adding server endpoints, authentication, storage, uploads, user-generated content, untrusted build processing or another runtime that handles user-controlled input.

The repository currently has no `LICENSE` file. Do not describe it as open source or assume reuse permission unless the owner deliberately adds a license.

## Updating the environment

When changing Bun, Playwright, Lighthouse, Node, Dev Container Features or shell tooling:

1. update every version declaration and lockfile affected by the change;
2. rebuild the DevContainer without cache;
3. verify the non-root environment and browser installation;
4. run `bun run validate:local` on the exact head;
5. record unavailable hosted checks explicitly.

Commit `.devcontainer/devcontainer-lock.json` after upgrading Features; it is generated state and must not be edited manually.

## Documentation ownership

Keep repository documentation limited to current setup, architecture, commands, tests, delivery and troubleshooting. Put rationale, alternatives, audits, decisions, plans, incidents, cross-channel status and session handoffs in Cortex-L7. Historical `linktree` references may remain only where they describe dated evidence or permanent redirects; new operational references use `hub`.
