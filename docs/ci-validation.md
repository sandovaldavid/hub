# CI checks and local validation

The `CI` workflow is the source of truth for pull-request validation on `develop` and `main`.

## Stable check names

The following check contexts are intentionally stable because branch rulesets depend on them:

- `CI / Quality`: type checking, architecture validation, formatting, linting, unit tests and the production build.
- `CI / E2E`: Playwright functional and accessibility coverage.
- `CI / Lighthouse`: mobile and desktop Lighthouse audits.

`CI / Playwright report availability` is informational. It only confirms that the generated HTML report was published; it never represents the E2E result and must not be configured as a functional required check.

## Artifact flow

`CI / Quality` creates the production `dist/` output once and uploads it as `astro-dist`. The E2E and Lighthouse jobs download that artifact instead of rebuilding the application.

Each job still performs `bun install --frozen-lockfile`. GitHub-hosted jobs run on isolated clean machines, and transferring `node_modules` would create a large, platform-coupled artifact with little reliability benefit. The duplicated installation is therefore intentional; the expensive and deterministic build output is the artifact that is reused.

The E2E job detects `playwright-report/index.html` after the test command, including failure paths. When the report exists, it is uploaded with seven-day retention and the publication job runs. A failing `CI / E2E` check can therefore coexist with a successful `CI / Playwright report availability` check.

## Equivalent local validation

### Fedora or another non-Ubuntu host

Use the repository DevContainer. It isolates Ubuntu `node_modules` from the host bind mount and reuses the browser binaries included in the version-matched Playwright image.

1. Run **Dev Containers: Rebuild Container Without Cache**.
2. Wait for `.devcontainer/post-create.sh` to complete.
3. Confirm the terminal uses `vscode` in `/workspace`.
4. Run:

```bash
bun run validate:local 2>&1 | tee validation-issue-27.log
```

Do not run `bunx playwright install chromium` inside the DevContainer. See [`docs/devcontainer.md`](devcontainer.md) for setup and recovery instructions.

### Native Ubuntu or an ephemeral CI-compatible environment

Use the pinned Bun version declared in `package.json` and install dependencies reproducibly:

```bash
bun install --frozen-lockfile
bunx playwright install --with-deps chromium
bun run validate:local
```

`bun run validate:local` executes, in order:

1. Astro type checking.
2. Architecture validation.
3. Prettier format checking.
4. ESLint.
5. Bun unit tests.
6. The Astro production build.
7. Playwright in CI-equivalent Chromium mode.
8. Lighthouse for the default mobile profile.
9. Lighthouse with the desktop preset.

The command stops at the first failure. Fix the root cause and rerun the complete command before publishing changes.

## GitHub Actions quota limitation

A workflow that is skipped, interrupted before executing its steps or prevented from starting by account quota is not a successful validation. While Actions is unavailable, record the exact local commands and outputs in the pull request. Required checks can only be finalized in the repository rulesets after Actions emits the stable contexts at least once.
