# Repository and Cortex-L7 documentation boundary

## Purpose

The Hub has two documentation environments with different responsibilities:

- this source repository, which must explain and validate the implementation;
- Cortex-L7, which preserves durable private context, strategy and history.

They must complement each other without becoming competing sources of truth.

## Ownership model

| Information | Source repository | Cortex-L7 |
| --- | --- | --- |
| Current runtime behavior | Canonical | Reference or handoff only |
| Routes, locale behavior and public URLs | Canonical | Cross-channel status only |
| Setup, dependencies and commands | Canonical | Do not duplicate |
| Architecture and placement rules | Canonical | Durable rationale only when needed |
| Test suites and validation commands | Canonical | Record exact historical evidence and limitations |
| CI/CD, Vercel and branch configuration | Canonical | Historical incidents, decisions and external verification state |
| Implemented design tokens and component states | Canonical | Decision rationale and cross-channel implications |
| Approved designed intent | Link to Figma and implement | Interpret decisions; do not replace Figma |
| Positioning and messaging strategy | Consume bounded decisions | Canonical |
| Claim status and evidence boundaries | Enforce in public copy | Canonical |
| Public contact values | Implement from approved registry | Canonical registry and privacy status |
| Private evidence or professional records | Never store | Canonical when appropriate and access-controlled |
| Current issue execution | Issue, branch and PR | Plan or handoff when durable context is useful |
| Historical branch incidents | Operational remediation | Canonical interpretation and lessons |
| Future strategy and alternatives | Only approved implementation scope | Canonical |

## What belongs in this repository

The repository must remain usable by a contributor without Cortex-L7 access. It owns:

- `README.md` product purpose, local setup, commands and technical overview;
- `AGENTS.md` repository workflow, safety and ownership rules;
- `CONTRIBUTING.md` contributor expectations;
- `docs/architecture.md` current module responsibilities and dependency direction;
- `docs/design-system.md` implemented Link Hub token and component contracts;
- `docs/content-governance.md` public content implementation rules;
- `docs/seo.md` generated metadata, structured-data and route contracts;
- `docs/analytics.md` event implementation and privacy constraints;
- `docs/ci-validation.md`, `docs/branch-governance.md` and `docs/devcontainer.md` operational procedures;
- `SECURITY.md` public reporting instructions;
- source code, configuration, tests and workflows that enforce these contracts.

Repository documentation should describe what the checked-out branch implements. It may link to an issue or decision, but it must not depend on private vault text to explain required commands or architecture.

## What belongs in Cortex-L7

Cortex-L7 owns context whose value survives implementation details or should remain private:

- David's positioning, audience hierarchy, Messaging and Voice decisions;
- Canonical Contact Registry and privacy classifications;
- claim taxonomy and Evidence Registry;
- why `hub` replaced the former `linktree` technical name;
- why the Hub routes while the portfolio proves;
- alternatives considered for portrait, content hierarchy, channel expression and delivery;
- cross-channel alignment status;
- branch-divergence interpretation and promotion plan;
- historical validation evidence tied to exact commits;
- future work, dependencies, risks and session handoffs;
- private evidence or professional context that cannot enter a public channel.

The vault must not copy current setup instructions, complete runbooks, source architecture or mutable command inventories from the repository.

## Figma boundary

Figma defines designed intent and visual QA references. It does not own:

- runtime CSS behavior;
- branch status;
- tests or deployment;
- claim classification;
- the operational roadmap.

The repository implements Figma intent through executable contracts. Cortex-L7 records rationale and cross-channel implications. A value in Figma that differs from production is a discrepancy to resolve, not permission for silent local redesign.

## Public evidence boundary

The Hub may summarize a project but should not become the source of project truth.

```text
Project repository or verified record
→ technical evidence

Cortex-L7 Evidence Registry
→ bounded interpretation and approved wording

Hub
→ concise summary and route

Portfolio
→ selected long-form evidence and case study
```

A public card must not claim adoption, scale, production impact, leadership, authority or results that the evidence source does not support.

## Change protocol

When a change affects only implementation:

1. update source and repository documentation;
2. add or update tests;
3. validate the branch;
4. update Cortex-L7 only when the change creates durable context or alters alignment status.

When a change affects positioning, contact, evidence or channel strategy:

1. resolve the canonical decision in Cortex-L7;
2. update Figma when designed representation changes;
3. implement the approved result in this repository;
4. validate the deployed output;
5. update the cross-channel status after runtime verification.

When an incident or branch divergence occurs:

1. keep remediation commands and current operational behavior in the repository;
2. record cause, consequences, prevention and historical handoff in Cortex-L7.

## Anti-duplication rule

Before adding a document, ask:

> Would a contributor need this to build, test, deploy or understand the current implementation?

- **Yes:** it belongs in the repository.
- **No, but it explains durable strategy, evidence, history or a private decision:** it belongs in Cortex-L7.
- **Both:** split responsibilities and link the two sources; do not copy the full document.