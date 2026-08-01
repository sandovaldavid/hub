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
| `quality` | `contents: read` | Checkout, install, typecheck, format, lint, unit tests, build |
| `e2e` | `contents: read` | Checkout, build, Playwright execution, artifact upload |
| `lighthouse` | `contents: read` | Checkout, build, Lighthouse CI |

The CI workflow does not require repository secrets. Each job uses the
ephemeral `GITHUB_TOKEN` supplied by GitHub Actions with read-only repository
contents access.

## Third-party actions

Actions are pinned to immutable commit SHAs rather than floating major tags. Updating an action requires:

1. Reviewing the upstream release notes.
2. Replacing the SHA with the verified release commit.
3. Opening a pull request and validating the complete CI workflow.

## Playwright reports

The `e2e` job uploads the Playwright HTML report as an immutable workflow artifact.
The `CI / E2E` check is the authoritative functional test result.
