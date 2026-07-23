# CI checks and local validation

The `CI` workflow is the source of truth for pull-request validation on `develop` and `main`.

## Stable check names

The following check contexts are intentionally stable because branch rulesets depend on them:

- `CI / Quality`: type checking, architecture validation, formatting, linting, resilient internal/external link validation, unit tests and the production build.
- `CI / E2E`: Playwright functional and accessibility coverage.
- `CI / Lighthouse`: mobile and desktop Lighthouse audits.

`CI / Playwright report availability` is informational. It only confirms that the generated HTML report was published; it never represents the E2E result and must not be configured as a functional required check.

## Ruleset mapping

The versioned branch policies are stored under `.github/rulesets/` and documented in [`docs/branch-governance.md`](branch-governance.md).

| Target branch | Required contexts |
| :--- | :--- |
| `develop` | `CI / Quality`, `CI / E2E`, `CI / Lighthouse` |
| `main` | `CI / Quality`, `CI / E2E`, `CI / Lighthouse`, `Check PR Branch / check-source-branch` |

The workflow name and job names form the complete check context. Renaming either side changes the context consumed by GitHub rulesets and must be treated as a breaking governance change.

Rulesets must not be activated until Actions has emitted every required context at least once. Use `bun run rulesets:stage -- --confirm` to create disabled rulesets for inspection, then `bun run rulesets:apply -- --confirm-active` and `bun run rulesets:verify` after hosted checks are available.

## Artifact flow

`CI / Quality` creates the production `dist/` output once and uploads it as `astro-dist`. The E2E and Lighthouse jobs download that artifact instead of rebuilding the application.

Each job still performs `bun install --frozen-lockfile`. GitHub-hosted jobs run on isolated clean machines, and transferring `node_modules` would create a large, platform-coupled artifact with little reliability benefit. The duplicated installation is therefore intentional; the expensive and deterministic build output is the artifact that is reused.

The E2E job detects `playwright-report/index.html` after the test command, including failure paths. When the report exists, it is uploaded with seven-day retention and the publication job runs. A failing `CI / E2E` check can therefore coexist with a successful `CI / Playwright report availability` check.

## Link validation behavior

`CI / Quality` runs `bun run check:links` after linting. The checker fails for missing repository-local targets and persistent definitive HTTP failures such as 404 or 410. Timeouts, DNS failures, access-controlled destinations, rate limits and 5xx responses remain visible warnings after retries and do not fail the quality context.

The same checker runs weekly through `.github/workflows/maintenance.yml`, allowing external link degradation to be detected even when no pull request is open. Classification rules and the exception policy are documented in [`docs/maintenance.md`](maintenance.md).

## Equivalent local validation

### Fedora or another non-Ubuntu host

Use the repository DevContainer. It isolates Linux `node_modules` from the host bind mount and installs the Chromium and WebKit runtimes during the image build.

1. Run **Dev Containers: Rebuild Container Without Cache**.
2. Wait for `.devcontainer/scripts/post-create.sh` to complete. VS Code is configured to wait before activating workspace tooling.
3. Confirm the terminal uses `node` in `/workspace`.
4. Run:

```bash
bun run validate:local 2>&1 | tee validation-local.log
```

See [`docs/devcontainer.md`](devcontainer.md) for setup and recovery instructions.

### Native Ubuntu or an ephemeral CI-compatible environment

Use the pinned Bun version declared in `package.json` and install dependencies reproducibly:

```bash
bun install --frozen-lockfile
bun x playwright install --with-deps chromium
bun run validate:local
```

`bun run validate:local` executes, in order:

1. Astro type checking.
2. Architecture validation.
3. Prettier format checking.
4. ESLint.
5. Internal and external link validation.
6. Bun unit tests.
7. The Astro production build.
8. Playwright in CI-equivalent Chromium mode.
9. Lighthouse for the default mobile profile.
10. Lighthouse with the desktop preset.

The command stops at the first definitive failure. Transient external link warnings are printed but do not stop the gate. Fix the root cause of any failure and rerun the complete command before publishing changes.

## GitHub Actions quota limitation

A workflow that is disabled, skipped, interrupted before executing its steps or prevented from starting by account quota is not a successful validation. While Actions is unavailable, record the exact local commands and outputs in the pull request.

A local pass validates the repository behavior but does not prove hosted ruleset enforcement. Issue #32 remains incomplete until active rulesets are verified with a deliberately failing pull request after Actions becomes available.
