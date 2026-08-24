# Operations

This is the public runbook for setting up, validating and maintaining the Hub. Configuration files, scripts and GitHub workflows are the executable source of truth; this document explains how to use them.

## Supported environment

The recommended environment is the repository DevContainer, especially when Playwright and Lighthouse must run in a reproducible Linux browser environment.

Current toolchain constraints are declared in `package.json` and `.devcontainer/`:

- Bun `1.3.14`;
- Node.js `>=22.19.0` for the native Lighthouse toolchain;
- Astro static generation;
- Playwright browser dependencies installed by the DevContainer image.

## Local setup

For a read-only or exploratory local run, cloning the default branch is enough:

```bash
git clone https://github.com/sandovaldavid/hub.git
cd hub
bun install --frozen-lockfile
bun run dev
```

The development server is available at `http://localhost:4321`.

For contribution work, branch from the latest `develop` as described in [`../CONTRIBUTING.md`](../CONTRIBUTING.md).

Basic development does not require private credentials. The optional public metadata field is documented in [`.env.example`](../.env.example).

## DevContainer setup

1. Open the repository root in VS Code.
2. Run **Dev Containers: Rebuild Container Without Cache** after changing `.devcontainer/**` or when testing a clean environment.
3. Wait for the configured `postCreateCommand` to finish dependency setup.
4. Confirm the terminal uses the non-root `node` user in `/workspace`.
5. Run `bun run validate:quality` or the complete `bun run validate:local` gate as appropriate.

The container forwards:

- `4321` — Astro development/preview;
- `9323` — Playwright HTML report.

Serve an existing Playwright report with:

```bash
bun run test:e2e:show-report
```

A frozen install must fail when `package.json` and `bun.lock` differ. Regenerate and review the lockfile intentionally; do not introduce a mutable fallback in lifecycle scripts.

## Validation model

Validation is split into tiers so fast changes do not pay the cost of every browser and accessibility permutation while release-sensitive changes still receive deeper coverage.

### Fast quality gate

```bash
bun run validate:quality
```

This runs:

1. Astro type checking;
2. architecture validation;
3. Prettier verification;
4. ESLint;
5. internal and external link validation;
6. unit and repository-contract tests;
7. the production build.

Use this as the minimum local gate for normal source changes.

### Complete local gate

```bash
bun run validate:local 2>&1 | tee validation-local.log
```

This adds to the fast gate:

- Playwright functional, SEO and accessibility tests;
- System-theme resolution;
- additional contrast and forced-colors scenarios;
- narrow-viewport/reflow and text-scaling checks;
- local browser projects beyond the CI baseline when available;
- Lighthouse mobile and desktop audits for `/` and `/es/`.

Use this for changes that affect browser behavior, themes, layout, accessibility, SEO, performance or release readiness.

### Manual release-oriented checks

Before promoting UI- or accessibility-sensitive work to production, also use [`accessibility/manual-checklist.md`](accessibility/manual-checklist.md).

Some operating-system behavior, such as real Windows High Contrast Mode, cannot be fully proven by browser emulation. Record those checks separately rather than treating automation as equivalent evidence.

## Result classification

When documenting validation in a pull request, classify relevant checks as:

- `Passed`;
- `Failed`;
- `Not run`;
- `Blocked`;
- `Not applicable`.

A disabled, skipped, interrupted, missing or quota-blocked GitHub Actions run is `Not run` or `Blocked`; it is never a passing result.

## CI

The primary workflow lives in `.github/workflows/ci.yml` and exposes stable functional check names including:

- `CI / Quality`;
- `CI / E2E`;
- `CI / Lighthouse`.

The exact job matrix, artifacts and commands are defined by the workflow itself. Lighthouse thresholds and profiles live in `.lighthouserc.cjs`.

Do not infer that a local pass guarantees the hosted workflow will pass, or vice versa. Record both when they are relevant.

## Browser coverage

Chromium is the primary hosted browser baseline. Additional browser projects may be available in the DevContainer/local toolchain even when they are not installed on a particular CI runner.

When a browser was not executed on the exact commit under review, mark it `Not run` rather than assuming coverage from another engine.

Axe's browser-engine limitations are supplemented by project-specific computed-style assertions where required; see `tests/e2e/accessibility.spec.ts` for the executable contract.

## Branch and delivery flow

```text
feature/*, fix/*, refactor/*, docs/* -> develop -> main
```

- `develop` is the integration branch.
- Normal feature/fix/documentation pull requests target `develop`.
- `main` is the stable production branch.
- A change present only on `develop` is not yet a verified production outcome.
- Production behavior must be confirmed from the deployed result, not inferred solely from a merge.

The repository versions desired branch/ruleset intent under `.github/rulesets/`.

Read-only verification commands include:

```bash
bun run rulesets:plan
bun run rulesets:verify
```

Administrative ruleset writes are maintainer operations and require the explicit safeguards implemented by `scripts/manage-rulesets.mjs`.

## Release automation

release-please configuration lives in:

- `release-please-config.json`;
- `.release-please-manifest.json`;
- `.github/workflows/release-please.yml`.

Do not manually describe a release as published until the tag/release exists and the production deployment has been verified.

## Link and dependency maintenance

- `.github/dependabot.yml` targets `develop` and groups routine dependency updates.
- `scripts/check-links.mjs` validates local targets and public destinations.
- `.github/workflows/maintenance.yml` schedules recurring link checks.
- `config/link-check.json` contains link-check inputs and retry settings.

Run:

```bash
bun run check:links
```

Persistent definitive failures such as HTTP `404` or `410` fail the check. Access controls, rate limits, anti-bot responses, timeouts and upstream incidents remain visible warnings after retries and require manual review.

Periodically review the production Hub in English and Spanish on mobile and desktop, including role copy, project lifecycle states, résumé/portfolio/contact destinations, themes and social previews.

## Security

Security reports use the private channel documented in [`../SECURITY.md`](../SECURITY.md). Do not open a public issue containing vulnerability details, credentials, tokens or personal data.

CodeQL is not currently part of the project checks. Re-evaluate the static-site threat model before adding server endpoints, authentication, storage, uploads, user-generated content, untrusted build processing or another runtime that handles user-controlled input.

## Licensing

The repository currently has no open-source `LICENSE` file. Public visibility allows inspection but does not itself grant reuse, modification or redistribution rights.

Adding or changing a license is an explicit maintainer decision and should not be bundled into unrelated implementation work.

## Updating the environment

When changing Bun, Playwright, Lighthouse, Node, Dev Container Features or shell tooling:

1. update every affected version declaration and lockfile;
2. rebuild the DevContainer without cache;
3. verify the non-root environment and browser installation;
4. run the relevant complete validation on the exact head;
5. record unavailable hosted or browser checks explicitly.

Commit `.devcontainer/devcontainer-lock.json` after upgrading Features; it is generated state and must not be edited manually.

## Documentation ownership

Keep repository documentation focused on current public behavior: setup, architecture, commands, tests, delivery, security, maintenance and troubleshooting.

Private strategy, unpublished evidence, personal planning and historical session handoffs are not prerequisites for contributing. Any requirement that affects a public change must be represented in repository documentation, code/tests, or the associated issue/pull request.
