# Maintenance and security operations

This document defines the preventive maintenance routine for the professional Link Hub. It complements the local quality gate and does not replace review of production content.

## Automated maintenance

### Dependency updates

`.github/dependabot.yml` targets `develop` and limits update noise:

- npm dependencies are checked weekly;
- minor and patch updates are grouped into one routine PR;
- major upgrades are grouped separately for explicit review;
- GitHub Actions and Dev Container Features are checked monthly;
- at most two npm PRs and one PR per infrastructure ecosystem remain open.

Dependabot uses the repository's text `bun.lock`. Every dependency PR must still pass the same frozen install, quality, browser, accessibility, link, and Lighthouse validation as any other change.

### Link health

The dependency-free checker in `scripts/check-links.mjs` validates:

- relative links and local assets referenced by `README.md`, `SECURITY.md`, and `docs/`;
- production, résumé, portfolio, project, contact, and social URLs declared in the user-facing content sources;
- redirects and servers that reject `HEAD` by falling back to a ranged `GET` request.

`CI / Quality` runs the checker on pull requests and pushes. `.github/workflows/maintenance.yml` also runs it every Monday at 14:00 UTC and can be started manually.

The checker retries requests before classifying them:

| Result | Examples | Outcome |
| --- | --- | --- |
| Healthy | HTTP 2xx or 3xx | Passed |
| Transient or access-controlled | timeout, DNS error, HTTP 401, 403, 408, 425, 429, or 5xx | Warning; the command does not fail |
| Definitively broken | persistent HTTP 4xx such as 404 or 410 | Failure |
| Repository-local target missing | missing document, image, or site route | Failure |

Ignored URL patterns must be documented with a reason in `config/link-check.json`. Do not add broad domain exclusions to make the check green.

## Manual routine

### Monthly content review

1. Open `/` and `/es/` in production on mobile and desktop.
2. Confirm the role, location, language, and availability statements are current.
3. Verify portfolio, résumé, email, Calendly, GitHub, LinkedIn, and social destinations.
4. Review the three featured projects for current status, repository visibility, demos, outcomes, and technologies.
5. Run:

   ```bash
   bun run check:links
   bun run validate:local
   ```

6. Review transient link warnings manually. Promote a warning to an explicit exception only when the destination is intentionally generated, access-controlled, or bot-protected.

### Quarterly engineering review

1. Review grouped major dependency upgrades and release notes.
2. Confirm Bun, Node, Playwright, Chromium, WebKit, Lighthouse, Dev Container Features, and the lockfile remain compatible.
3. Run `bun run rulesets:plan` and confirm the live rulesets have not drifted.
4. Review this CodeQL decision and the license posture below.
5. Check that `SECURITY.md` still points to a monitored private contact channel.

## CodeQL decision

CodeQL is intentionally not added in this issue.

Current risk profile:

- Astro emits a static site;
- there is no repository-owned server, database, authentication layer, upload endpoint, or user-generated content;
- TypeScript checking, ESLint, architecture tests, unit tests, Playwright/Axe, and dependency updates already cover the project's current attack surface;
- another hosted workflow would add maintenance and Actions-minute cost without a demonstrated gap for this repository today.

Re-evaluate CodeQL before adding any server endpoint, authentication, persistent storage, untrusted content processing, custom build plugin, or other runtime that handles user-controlled data. Document the expected query coverage and operational cost before enabling it.

## License and notice posture

This repository currently has no `LICENSE` file, so it grants no general permission to reuse the source code or visual assets. Do not add a license badge or describe the project as open source unless the owner deliberately selects and commits a license.

Third-party packages, Actions, Dev Container Features, fonts, icons, and external services remain subject to their own licenses and terms. Before vendoring third-party source or assets, record the source, version, license, modifications, and any required attribution in a notice file. Review dependency license changes when accepting major upgrades or before redistributing the project as a template or package.

A generated notice inventory is not committed because this repository is an application rather than a distributed package and no stable, reviewed attribution generator is currently configured. This decision must be revisited if distribution or vendoring changes.

## Evidence to record

For each maintenance PR, include:

- the exact commands executed;
- counts for unit, E2E, and Lighthouse runs;
- any transient link warnings and their manual verification;
- dependency or license decisions that were deferred;
- hosted workflows that were unavailable and the reason.
