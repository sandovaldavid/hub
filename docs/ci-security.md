# CI security and reproducibility

## Runtime version

The project uses Bun `1.3.14` consistently across:

- `package.json` via `packageManager`
- `.github/workflows/ci.yml` via `BUN_VERSION`
- `.devcontainer/Dockerfile` via `BUN_VERSION`

Dependency installation must use:

```bash
bun install --frozen-lockfile
```

This prevents the lockfile from changing during CI or DevContainer creation.

## GitHub Actions permissions

The workflow follows least privilege:

| Job | Permissions | Reason |
| --- | --- | --- |
| `check` | `contents: read` | Checkout, install, typecheck, format, lint, unit tests, build |
| `test` | `contents: read` | Checkout, build, Playwright execution, artifact upload |
| `lighthouse` | `contents: read` | Checkout, build, Lighthouse CI |
| `publish-playwright-report` | `contents: write`, `statuses: write` | Publish the HTML report to GitHub Pages and attach its URL to the commit |

No repository secrets are required. The workflow uses the ephemeral `GITHUB_TOKEN` supplied by GitHub Actions. Write access is scoped only to the report publishing job.

## Third-party actions

Actions are pinned to immutable commit SHAs rather than floating major tags. Updating an action requires:

1. Reviewing the upstream release notes.
2. Replacing the SHA with the verified release commit.
3. Opening a pull request and validating the complete CI workflow.

## Playwright reports

The `test` job uploads the Playwright HTML report as an immutable workflow artifact. A separate job downloads and publishes it. The publishing job does not run when the test job is skipped or cancelled.

The `Playwright Report` commit status indicates report availability only; the authoritative test result is the `CI / test` check.
