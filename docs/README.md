# Hub documentation

This directory contains the public, contributor-facing documentation required to understand, run, test and maintain the Hub.

The code, configuration, tests and workflows remain the executable source of truth. These documents explain the contracts around them without requiring access to private planning or strategy systems.

## Documentation map

| Document | Use it when you need to understand... |
| --- | --- |
| [`../README.md`](../README.md) | What the Hub is, why it exists, the stack and the fastest way to run it locally. |
| [`architecture.md`](architecture.md) | Source boundaries, dependency direction, content ownership and browser-runtime responsibilities. |
| [`operations.md`](operations.md) | Local setup, DevContainer usage, validation tiers, CI, delivery and maintenance. |
| [`accessibility/manual-checklist.md`](accessibility/manual-checklist.md) | Manual keyboard, focus, theme, reduced-motion, high-contrast and release checks. |
| [`../CONTRIBUTING.md`](../CONTRIBUTING.md) | How to propose and validate changes. |
| [`../SECURITY.md`](../SECURITY.md) | How to report a vulnerability privately. |
| [`../AGENTS.md`](../AGENTS.md) | Repository constraints for coding agents and maintainer automation. |

## Documentation principles

Repository documentation should be:

- **publicly actionable** — a contributor must not need a private vault or unpublished design file to build and test the project;
- **current** — describe the implementation that exists now, not speculative architecture;
- **non-duplicative** — prefer links to the canonical file, script, test or workflow over maintaining a second copy of the same contract;
- **evidence-based** — do not claim test results, accessibility certification, performance scores or production behavior that has not been verified;
- **privacy-safe** — do not copy confidential employer, client, financial, credential or personal-contact information into the repository.

## What does not belong here

Avoid adding repository documents for private strategy, personal career planning, historical session handoffs, unpublished evidence, or cross-channel brand governance. Maintainers may preserve that context elsewhere, but public contributors should receive every requirement needed for a change through issues, pull requests, code, tests or the documentation listed above.
