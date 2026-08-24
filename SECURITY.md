# Security policy

## Supported version

The Hub is maintained as a continuously deployed personal site. Security fixes are applied to the current production version on `main`; older tags and prereleases do not receive backports.

## Reporting a vulnerability

Do **not** open a public issue containing vulnerability details, credentials, tokens, personal data or a working exploit.

Report security concerns privately by emailing [hello@sandovaldavid.com](mailto:hello@sandovaldavid.com) with the subject:

```text
[Security] Hub vulnerability
```

Include, when available:

- the affected URL, branch, workflow or component;
- the security impact and who could be affected;
- reproducible steps or a minimal proof of concept;
- whether the issue is already public;
- a suggested mitigation or fix.

I aim to acknowledge actionable reports within five business days when possible. Triage and remediation time depend on severity, reproducibility and maintainer availability; this is a best-effort target, not a service-level agreement.

## Scope

In scope:

- the production site at `https://hub.sandovaldavid.com`;
- source code and configuration in this repository;
- repository-owned CI/CD and deployment configuration.

Out of scope:

- vulnerabilities in LinkedIn, GitHub, Vercel, social networks or other third-party services themselves;
- availability incidents or rate limits controlled by those services;
- reports that only identify a dependency version without demonstrating relevant impact to this project;
- social engineering, denial-of-service testing or attempts to access data that does not belong to the reporter.

A third-party destination becomes relevant to this policy only when the Hub actively links to or integrates it. Removed or historical destinations are not part of the current runtime surface.

## Safe testing expectations

Good-faith security research should:

- use the minimum interaction necessary to demonstrate the issue;
- avoid collecting, modifying or deleting data that does not belong to you;
- avoid degrading production availability;
- avoid automated traffic volumes that could reasonably be interpreted as abuse;
- stop testing and report privately if credentials, tokens or personal data are exposed.

## Coordinated disclosure

Please allow reasonable time to investigate and deploy a fix before public disclosure. If a report is accepted, communication will focus on impact, remediation status and any information needed to reproduce or verify the fix.

Good-faith reports that follow this policy are welcome.
