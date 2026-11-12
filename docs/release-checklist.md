# Production release checklist

Use this checklist when publishing a tagged production release from `main`. It is intentionally stricter than normal feature delivery because the Hub is both a production site and a public engineering surface.

Use these result states when recording evidence: `Passed`, `Failed`, `Not run`, `Blocked` or `Not applicable`. Do not treat a skipped, missing, cancelled, quota-blocked or superseded check as a pass.

## 1. Validate the release candidate on `main`

In the single-branch model, feature and fix pull requests merge into `main` and deploy to the development environment (`dev.hub.sandovaldavid.com`).

Before promoting a candidate to a production release:

- [ ] Stop merging features into `main`; only release-blocking corrections are allowed.
- [ ] Record the exact `main` commit SHA being released.
- [ ] Verify the development environment (`https://dev.hub.sandovaldavid.com`) displays the candidate changes correctly.
- [ ] Run the complete local gate from the exact candidate commit:

```bash
bun install --frozen-lockfile
bun run validate:local
```

Dependency advisories are intentionally evaluated outside `validate:quality`: advisory data comes from an external registry and changes over time, while the normal quality gate is intended to remain deterministic. Use the `Security Audit / Dependency audit` workflow result for the exact candidate SHA when available. If hosted audit evidence is unavailable, run the equivalent local command and record its output:

```bash
bun run audit:deps
```

Record:

- [ ] exact-SHA dependency audit result and any accepted exception with rationale;
- [ ] exact-SHA external link result (`bun run check:links:external`) with any accepted transient warning;
- [ ] Chromium result;
- [ ] WebKit / Mobile Safari result;
- [ ] Firefox result;
- [ ] Lighthouse mobile result for `/` and `/es/`;
- [ ] Lighthouse desktop result for `/` and `/es/`;
- [ ] manual responsive review of `/` and `/es/` at mobile, tablet and desktop widths;
- [ ] Light, Dark and System theme review;
- [ ] keyboard, focus, reduced-motion and high-contrast checks required by [`accessibility/manual-checklist.md`](accessibility/manual-checklist.md).

Do not infer cross-browser coverage from hosted Chromium CI. The complete local gate is the source of truth for the repository's Chromium, WebKit and Firefox release evidence.

## 2. Prepare the Release Please pull request

Release Please maintains an automated release pull request against `main`.

- [ ] Confirm the release PR is based on the current `main` state.
- [ ] Confirm `package.json` and `.release-please-manifest.json` contain the intended next version.
- [ ] Confirm no current dependencies, scripts, documentation or release-hardening changes are accidentally reverted by a stale release branch.
- [ ] Review the generated `CHANGELOG.md` for duplicate/noisy entries and make only factual editorial corrections that preserve traceability.
- [ ] Keep the release summary focused on meaningful public changes such as identity/positioning, accessibility/responsive UX, SEO/social metadata, engineering evidence, architecture, testing and delivery hardening.

### One-time `release-as` overrides

A one-time `release-as` override is allowed only while it is needed to force the next target version.

When the Release Please PR has already updated `package.json` and `.release-please-manifest.json` to that target version, remove the matching `release-as` entry **inside the same release PR before merging it**.

For example, when preparing a major version transition:

```text
package.json                    -> 2.0.0
.release-please-manifest.json   -> 2.0.0
release-please-config.json      -> no release-as: 2.0.0 override
```

This is intentional. `tests/unit/release-hardening.test.js` fails when a one-time override still matches the version already prepared by the release PR, preventing the pin from freezing future semantic releases.

- [ ] All required release-PR checks pass after the override cleanup and any changelog curation.
- [ ] The dependency-audit result for the exact release-PR head is explicit; a failed advisory check must be investigated rather than ignored because it is non-required.

## 3. Merge the Release Please PR and publish release

When the Release Please PR is merged into `main`:

- [ ] GitHub Release Please creates the semantic Git tag (e.g. `v2.0.0`) and publishes the GitHub Release.
- [ ] The `Deploy Production` workflow (`.github/workflows/cd.yml`) automatically triggers on `release: types: [published]`.
- [ ] Confirm the `Deploy Production` workflow completes successfully for the released tag and SHA.
- [ ] Confirm the exact-SHA required checks (`Quality`, `Browser`) are green on the release commit.

The production deploy workflow deploys directly to production (`hub.sandovaldavid.com`) with `--prod` and registers a GitHub deployment for traceability. If needed, production deployment can also be dispatched manually via `workflow_dispatch`.

## 4. Verify the deployed production result

Validate the deployed production result, not only repository configuration or a preview deployment.

- [ ] `https://hub.sandovaldavid.com/` returns the expected English Hub.
- [ ] `https://hub.sandovaldavid.com/es/` returns the expected Spanish Hub.
- [ ] an unknown route returns the branded 404 with an actual HTTP 404 response.
- [ ] portrait, logo, favicon and social-preview assets load from the canonical domain.
- [ ] résumé, portfolio, GitHub, LinkedIn, project-site and contact destinations resolve as intended.
- [ ] canonical URLs, reciprocal `hreflang`, `x-default`, Open Graph, Twitter metadata and `ProfilePage` / `Person` JSON-LD match the visible identity.
- [ ] `robots.txt` references the canonical sitemap and the sitemap excludes the 404 route.
- [ ] stable public identity assets remain revalidatable rather than receiving immutable caching.
- [ ] fingerprinted `/_astro/` assets receive long-lived immutable caching.
- [ ] the deployed response includes the intended security headers from `vercel.json`.
- [ ] the historical `https://linktree.sandovaldavid.com` destination redirects to the canonical Hub as intended.

Useful production probes include:

```bash
curl -I https://hub.sandovaldavid.com/
curl -I https://hub.sandovaldavid.com/es/
curl -I https://hub.sandovaldavid.com/this-route-must-not-exist
curl -sS https://hub.sandovaldavid.com/robots.txt
curl -I https://linktree.sandovaldavid.com/
```

Repository configuration is not proof of the final HTTP behavior. Record the observed production result.

## 5. Public repository surface

Before announcing a major release, review the repository itself as part of the product surface:

- [ ] repository description explains what the Hub is and keeps David's Software Engineer identity primary;
- [ ] homepage points to `https://hub.sandovaldavid.com`;
- [ ] topics are useful and restrained rather than keyword stuffing;
- [ ] README, CONTRIBUTING, SECURITY and operations documentation describe the released behavior;
- [ ] no private planning, employer/client information, credentials or unsupported professional claims are exposed.

A release is complete only when the code, deployed result, release metadata and public repository surface all agree.
