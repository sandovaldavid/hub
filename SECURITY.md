# Security policy

## Supported version

This personal site is maintained as a continuously deployed application. Security fixes are applied to the current production version on `main`; older tags and prereleases do not receive backports.

## Reporting a vulnerability

Do not open a public issue containing vulnerability details, credentials, tokens, personal data, or a working exploit.

Report security concerns privately by emailing [hello@sandovaldavid.com](mailto:hello@sandovaldavid.com) with the subject:

```text
[Security] Link Hub vulnerability
```

Include, when available:

- the affected URL, branch, workflow, or component;
- the security impact and who could be affected;
- reproducible steps or a minimal proof of concept;
- whether the issue is already public;
- a suggested mitigation or fix.

You should receive an acknowledgement target within five business days. Triage and remediation time depend on severity and reproducibility; this target is not a service-level agreement.

## Scope

In scope:

- the production site at `https://hub.sandovaldavid.com`;
- source code and configuration in this repository;
- repository-owned CI/CD and deployment configuration.

Out of scope:

- vulnerabilities in LinkedIn, GitHub, Vercel, Calendly, social networks, or other third-party services;
- availability incidents or rate limits controlled by those services;
- reports that only identify a dependency version without demonstrating relevant impact to this project.

## Coordinated disclosure

Please allow reasonable time to investigate and deploy a fix before public disclosure. Do not access data that does not belong to you, degrade the service, or use social engineering. Good-faith reports that follow this policy are welcome.
