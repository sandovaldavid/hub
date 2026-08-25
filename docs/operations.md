# Operations

This is the public runbook for setting up, validating and maintaining the Hub. Configuration files, scripts and GitHub workflows are the executable source of truth; this document explains how to use them.

## Supported environment

The recommended browser-validation environment is the repository DevContainer. Complete local Playwright and Lighthouse validation is intentionally delegated to it so contributors do not depend on host-distribution browser support.

Current toolchain constraints are declared in `package.json`, `.devcontainer/`, `.vscode/mcp.json` and the delivery workflows:

- Bun `1.3.14`;
- Node.js `>=22.19.0` for the native Lighthouse and Vercel toolchains;
- Astro static generation;
- Playwright browser dependencies installed by the DevContainer image;
- Vercel CLI explicitly versioned by `.github/workflows/cd.yml`;
- workspace Chrome DevTools MCP pinned to an explicit package version rather than `latest`.

When `bun run validate:local` is started outside the DevContainer, the host needs a working container runtime and the `devcontainer` CLI. The command brings up the repository DevContainer and executes the complete gate there. When already inside the DevContainer, it executes the gate directly without nesting another container.

## Local setup

```bash
git clone https://github.com/sandovaldavid/hub.git
cd hub
bun install --frozen-lockfile
bun run dev
```

The development server is available at `http://localhost:4321`. For contribution work, branch from the latest `develop` as described in [`../CONTRIBUTING.md`](../CONTRIBUTING.md).

A frozen install must fail when `package.json` and `bun.lock` differ. Regenerate and review the lockfile intentionally; do not introduce a mutable fallback in lifecycle scripts.

## Validation model

### Fast quality gate

```bash
bun run validate:quality
```

This runs Astro type checking, architecture validation, Prettier, ESLint, link validation, unit/repository-contract tests and the production build. It does not require browser execution and can run directly on the host.

`check:architecture` validates the documented layer matrix for Astro/TypeScript/JavaScript imports and CSS `@import`/`@reference` dependencies, as well as circular imports.

### Complete local gate

```bash
bun run validate:local 2>&1 | tee validation-local.log
```

From the host, this command uses the Dev Containers CLI to start/reuse the repository DevContainer and runs the complete validation there. From inside the DevContainer it runs directly. The browser-sensitive path therefore uses the pinned Playwright browsers and Linux dependencies from `.devcontainer/` instead of whatever happens to be installed on the host.

The complete gate adds Playwright functional/SEO/accessibility coverage and Lighthouse mobile/desktop audits for `/` and `/es/`. Production-preview E2E uses port `4322`, leaving the normal Astro development server on `4321` available during validation.

Local Playwright workers use Playwright's automatic default (half of the logical CPU cores visible to the container). Override the worker count for benchmarking or constrained machines with:

```bash
PLAYWRIGHT_WORKERS=4 bun run validate:local
```

The override must be a positive integer. More workers are not automatically faster: each Playwright worker launches its own browser process, so CPU and memory contention should be measured before raising the value.

If `devcontainer` is unavailable, `validate:local` fails closed with an actionable message rather than silently running Playwright against an unsupported host environment. You can alternatively open the repository in its DevContainer first and rerun the same command there.

Use [`accessibility/manual-checklist.md`](accessibility/manual-checklist.md) for manual release-oriented checks. Some operating-system behavior, such as real Windows High Contrast Mode, cannot be fully proven by browser emulation; record those checks separately.

## Result classification

When documenting validation, classify relevant checks as `Passed`, `Failed`, `Not run`, `Blocked` or `Not applicable`. A disabled, skipped, interrupted, missing or quota-blocked GitHub Actions run is never a pass.

## CI

The primary workflow lives in `.github/workflows/ci.yml` and exposes stable required contexts including `CI / Quality`, `CI / E2E` and `CI / Lighthouse`.

Chromium is the hosted browser baseline. The E2E job currently runs with `PLAYWRIGHT_WORKERS=2` and two retries per failing test. The worker count is deliberately explicit in the workflow so CI parallelism can be benchmarked independently of local machines. Additional browser projects run locally inside the DevContainer, where Chromium, WebKit and Firefox are installed and verified.

Playwright's `CI` flag still controls production-preview behavior and `forbidOnly`; GitHub-specific worker/retry policy is keyed from `GITHUB_ACTIONS` instead. This prevents `validate:local` from being serialized merely because it sets `CI=1` to test the production preview.

Do not infer browser coverage that was not executed on the exact commit under review. If two workers introduce resource contention or flakiness on the hosted runner, reduce the explicit workflow value and record the observed evidence rather than masking failures with additional retries.

## Branch and delivery flow

```text
feature/*, fix/*, refactor/*, docs/* -> develop -> main
```

- `develop` is the integration branch.
- `main` is the stable production branch.
- Production behavior must be confirmed from the deployed result, not inferred solely from a merge.
- The repository versions desired branch/ruleset intent under `.github/rulesets/`.

Read-only ruleset verification:

```bash
bun run rulesets:plan
bun run rulesets:verify
```

## Reproducible delivery and supply-chain policy

CI and CD must use the same declared Bun and Node versions. The Vercel CLI must be pinned to an explicit version instead of `latest`.

Third-party GitHub Actions in delivery, release and DevContainer workflows are pinned to full commit SHAs. The adjacent version comment documents the human-readable release. Dependabot remains responsible for proposing Action updates.

`cd.yml` runs the repository quality gate before producing the Vercel build so the deployed source is validated with the same executable contracts as normal development. GitHub Deployment and commit-status evidence is published through authenticated GitHub API calls that fail the workflow when the API call or returned deployment identifier is invalid.

GitHub Deployment registration must use `auto_merge: false`. Deployment evidence records the exact commit already validated and deployed; it must not merge or otherwise reconcile `main` with `develop`. Branch integration remains an explicit repository workflow concern, separate from deployment registration.

## Cache policy

Long-lived `immutable` browser caching is reserved for fingerprinted Astro build assets under `/_astro/`, where a content change produces a new URL. Public identity assets with stable URLs, including the profile portrait, social preview, logo and favicons, must remain revalidatable so a same-path replacement cannot leave stale brand evidence in browser caches.

When changing cache rules, keep that URL-versioning boundary explicit and validate the deployed response headers instead of inferring them from `vercel.json` alone.

## Release automation

Release Please configuration lives in:

- `release-please-config.json`;
- `.release-please-manifest.json`;
- `.github/workflows/release-please.yml`.

The pre-v2 configuration currently contains the one-time `release-as: 2.0.0` override required to prepare the major release. Remove that exceptional override after `v2.0.0` is actually published so future releases return to normal semantic version calculation.

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

## Security

Security reports use the private channel documented in [`../SECURITY.md`](../SECURITY.md). CodeQL is not currently part of the project checks. Re-evaluate the static-site threat model before adding server endpoints, authentication, storage, uploads, user-generated content or another runtime handling user-controlled input.

## Licensing

The repository currently has no open-source `LICENSE` file. Public visibility allows inspection but does not itself grant reuse, modification or redistribution rights.

## Updating the environment

When changing Bun, Playwright, Lighthouse, Node, Vercel CLI, Chrome DevTools MCP, Dev Container Features or workflow Actions:

1. update every affected version declaration and lockfile/configuration;
2. rebuild the DevContainer without cache when relevant;
3. verify the non-root environment and browser installation;
4. run the complete validation on the exact head;
5. record unavailable hosted or browser checks explicitly;
6. preserve immutable Action pinning and the CI/CD toolchain alignment.

Commit `.devcontainer/devcontainer-lock.json` after upgrading Features; it is generated state and must not be edited manually.

## Documentation ownership

Keep repository documentation focused on current public behavior: setup, architecture, commands, tests, delivery, security, maintenance and troubleshooting. Private strategy, unpublished evidence, personal planning and historical session handoffs are not prerequisites for contributing.
