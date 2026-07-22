# Branch governance and required checks

The repository uses two protected integration branches:

```text
feature/* or fix/* -> develop -> main
```

`develop` is the integration branch for normal work. `main` receives promoted, release-ready changes from `develop`, with documented exceptions for `hotfix/*`, `release/*`, and Release Please branches.

## Desired rulesets

The versioned source of truth is:

- `.github/rulesets/develop.json`
- `.github/rulesets/main.json`

Both rulesets:

- require changes through pull requests;
- require all review conversations to be resolved;
- require the pull-request head to be tested against the latest target branch;
- allow squash merges only;
- require a linear history;
- block branch deletion;
- block force pushes;
- require zero approvals so the sole maintainer is not forced to approve their own work.

The repository owner has an emergency bypass restricted to pull requests. It does not allow direct pushes, force pushes, or branch deletion. The bypass is reserved for external incidents such as an account-wide Actions outage and must retain the pull-request audit trail. It is not a substitute for local or hosted validation.

## Required check contract

### `develop`

The following functional contexts are required:

- `CI / Quality`
- `CI / E2E`
- `CI / Lighthouse`

### `main`

The following contexts are required:

- `CI / Quality`
- `CI / E2E`
- `CI / Lighthouse`
- `Check PR Branch / check-source-branch`

`CI / Playwright report availability` is informational and must never be required. A published report does not mean the E2E suite passed.

The workflow and job names above form a public repository contract. Renaming the workflow or jobs requires updating both ruleset files, this document, and the ruleset contract tests in the same pull request.

## Applying the rulesets

The management script requires GitHub CLI authentication with repository **Administration: write** permission.

Confirm authentication and inspect the current plan:

```bash
gh auth status
bun run rulesets:plan
```

While GitHub Actions is disabled or unable to emit checks, the rulesets can be created in a disabled state for inspection:

```bash
bun run rulesets:stage -- --confirm
```

Staging does not protect either branch. It only creates or updates the rulesets with `enforcement: disabled`.

After Actions is enabled and the required contexts have been emitted at least once, activate the desired state:

```bash
bun run rulesets:apply -- --confirm-active
bun run rulesets:verify
```

The script is idempotent. It creates missing rulesets, updates drifted rulesets by exact name, and leaves matching rulesets unchanged.

## Hosted enforcement test

Do not mark issue #32 completed until both negative tests are observed on GitHub.

### Failing check against `develop`

1. Create a temporary branch from the latest `develop`.
2. Introduce a deliberate, reversible failure covered by `CI / Quality`.
3. Open a pull request to `develop`.
4. Confirm the failing required check blocks the normal merge action.
5. Fix the failure and push again.
6. Confirm all required checks pass and the merge action becomes available.
7. Close the test PR without merging if it contains no product change.

### Invalid source branch against `main`

1. Open a temporary pull request to `main` from a branch that is not `develop`, `hotfix/*`, `release/*`, or `release-please--branches--*`.
2. Confirm `Check PR Branch / check-source-branch` fails.
3. Confirm the ruleset blocks the normal merge action.
4. Close the test PR without merging.

Record the PR numbers and observed check conclusions in issue #32.

## Local validation during an Actions outage

A skipped, disabled, quota-blocked, or interrupted workflow is not successful validation. Run the complete equivalent gate inside the DevContainer:

```bash
bun run validate:local 2>&1 | tee validation-issue-32.log
```

The emergency PR-only bypass may be used only after the full local gate passes and the pull request documents why hosted checks could not run. The missing hosted enforcement test remains pending and must be completed when Actions returns.

## Drift review

After changing CI, branch flow, merge methods, or repository ownership:

```bash
bun run rulesets:plan
bun run rulesets:verify
```

A failed verification indicates that the active GitHub configuration differs from the versioned desired state. Review the diff before applying changes; do not overwrite an intentional administrative change without documenting it.
