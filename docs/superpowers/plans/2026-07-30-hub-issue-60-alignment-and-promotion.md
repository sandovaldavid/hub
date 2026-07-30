# Hub Issue #60 — Alignment and Stable Promotion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close [sandovaldavid/hub#60](https://github.com/sandovaldavid/hub/issues/60) by reconciling `develop`/`main`, restoring the real portrait as the primary identity, correcting positioning/consulting/project-evidence copy, removing dead analytics debt, and promoting the result to a verified stable `main`.

**Architecture:** This is a content-and-config alignment effort, not a feature build. Every task edits typed data (`src/data/*.ts`), locale catalogs (`src/shared/i18n/locales/*.json`), or a small number of assets — no new abstractions or runtime behavior are introduced. Each task lands on its own branch and PR into `develop` per `docs/branch-governance.md`; the final task promotes `develop → main`.

**Tech Stack:** Astro, TypeScript, Bun (`bun test`), Playwright, GitHub CLI (`gh`), Vercel.

## Global Constraints

- Canonical origin is `hub.sandovaldavid.com`; `linktree.sandovaldavid.com` stays a permanent redirect. (`docs/repository-vault-boundary.md`, Cortex-L7 Canonical Contact Registry)
- Approved public identity: GitHub `sandovaldavid`, LinkedIn `jdsandovals`, X `jdsandoval_`, Instagram `jdsandovals`, email `hello@sandovaldavid.com`. No personal phone number anywhere.
- The real portrait is the primary avatar on every people-facing surface; an illustrated portrait may only appear as explicitly secondary editorial material, never as the default identity. (Cortex-L7 decision `2026-07-26-adopt-portrait-led-identity-system`)
- Durable public category is `Software Engineer` / `Ingeniero de Software`. Do not use `Full-stack Developer` as the primary category or make `Junior` a permanent identity element. (`docs/content-governance.md`)
- Consulting/product-discovery copy must not claim active availability before the Client Services launch gate is complete. (`docs/content-governance.md`, Channel Alignment Status conflict "Hub consulting availability")
- Project evidence must stay inside `EV-KIOKU-001` / `EV-YUKIDOKE-001` claim boundaries: no adoption, production-scale, revenue, or user-count claims; Yukidoke's API and Web lifecycle states must be described separately, not merged.
- EN and ES copy must preserve identical facts, claim status, and hierarchy — natural adaptation, not literal translation.
- All changes land through a PR into `develop` (squash merge, linear history, zero required approvals) per `docs/branch-governance.md`; direct pushes to `develop`/`main` are not used.
- Run `bun run validate:local` on the exact head before promotion; record pass/fail per check rather than assuming success.

---

## Current state (verified 2026-07-30)

```text
repository: sandovaldavid/hub
develop HEAD: 72fdc12 (PR #62 source governance — MERGED)
origin/main HEAD: 8f31880
origin/main...develop: 4 ahead / 117 behind
```

The 4 commits reachable only from `main` (`f22881c`, `db6f2d6`, `ba8f7da`, `8f31880` — a devcontainer zsh-path fix and test, then both reverted) produce **zero net diff** against their merge-base with `develop` (verified: `git diff <merge-base> origin/main` is empty). Reconciliation therefore carries no content-loss risk — this de-risks Phase 1 of the plan already recorded in Cortex-L7 (`20-execution/hub/plans/PLAN-2026-07-29-complete-hub-alignment-and-promotion.md`), which this document operationalizes into concrete engineering tasks.

Phase 0 of that vault plan ("merge governance PR #62") is **done**. This plan starts at Phase 1.

---

## Decision points to confirm before implementing (do not silently resolve)

These three items involve product/brand judgment beyond what any single source file proves. Each task below still has a concrete recommended default so the plan is executable, but confirm before merging:

1. **Real portrait asset.** No exported real-photo asset exists in this repository yet (`public/profile/` only contains the illustrated `retrato-giblin.webp`). Someone must export the approved crop from the Figma Identity System (`sHPP8DGCfZ370Oc2oKGNPH`, `Identity / Portrait → Real`, 1:1 head-and-shoulders per the portrait-led decision) before Task 2 can be completed. This plan assumes the file lands at `public/profile/retrato-real.webp`.
2. **Tech-stack trim.** Task 4 adds `.NET`/`C#` (mandatory, explicitly missing) and reorders the grid so the verified current stack leads. It does **not** unilaterally delete React/Next.js/Python/Django/n8n/Gemini/OpenAI/Claude/Cloudinary — none of those appear in any featured project's evidence, so governance's "current professional or project relevance" test argues for demoting or removing them, but that is a call about which side projects/exploration should stay visible. Default in this plan: keep them but move them after the evidenced core; flag for a follow-up trim decision.
3. **Hub self-card.** Recommended default: remove the `hub` entry from `getFeaturedProjects` (drop from 3 cards to 2: Kioku + Yukidoke), since content-governance.md says the Hub "should not consume a featured slot ... when stronger external evidence is available" and no stronger public 3rd project exists to replace it. Confirm before merging Task 8.

---

## Phase 1 — Reconcile branch divergence

### Task 1: Merge `main` into `develop` with zero content risk

**Files:**
- No source files — git operations only.

- [ ] **Step 1: Create the reconciliation branch from `develop`**

```bash
git fetch origin
git switch -c chore/60-reconcile-main-into-develop origin/develop
```

- [ ] **Step 2: Merge `origin/main` and confirm it is content-neutral**

```bash
git merge origin/main -m "chore(60): reconcile main into develop

The 4 main-only commits (devcontainer zsh-path fix + test, both
reverted) net to zero diff against their merge-base with develop.
Ref: sandovaldavid/hub#60"
```

Expected: merge completes with no conflicts (verified in advance: `git diff $(git merge-base origin/main develop) origin/main` is empty, so there is nothing for Git to reconcile at the content level).

- [ ] **Step 3: Confirm `develop` is no longer behind `main`**

```bash
git merge-base --is-ancestor origin/main HEAD && echo "OK: main fully contained"
git log --oneline HEAD..origin/main   # expect: empty
```

- [ ] **Step 4: Push and open the PR into `develop`**

```bash
git push -u origin chore/60-reconcile-main-into-develop
gh pr create --repo sandovaldavid/hub --base develop \
  --title "chore(60): reconcile main into develop" \
  --body "Reconciles the 4 main-only commits (net zero diff) so develop is no longer behind main, per sandovaldavid/hub#60 Phase 1."
```

- [ ] **Step 5: Merge after required checks pass, then re-verify locally**

```bash
git fetch origin
git switch develop && git pull
git log --oneline origin/main..develop | wc -l   # expect: 0
```

---

## Phase 2 — Restore human-first identity (portrait)

### Task 2: Replace the illustrated avatar with the real portrait

**Files:**
- Create: `public/profile/retrato-real.webp` (exported asset — see decision point 1 above; blocks this task)
- Modify: `src/data/profile.ts:12-15`
- Modify/Delete: `public/profile/retrato-giblin.webp` (remove — Hub has no editorial/article context to host a secondary illustration; confirmed no other reference exists via repo-wide grep)

**Interfaces:**
- Produces: `profile.avatar.url === '/profile/retrato-real.webp'`, consumed by `HeroCard.astro:25-26` (`profile.avatar.url` / `profile.avatar.alt`) — no signature changes needed, `Profile.avatar` already has `{ url, alt }`.

- [ ] **Step 1: Place the exported asset**

Export the approved real-portrait crop from Figma (`Identity-System` file, `Identity / Portrait` → `Real` variant, 1:1 head-and-shoulders, Light/Dark-safe background) and save it optimized as WebP at:

```text
public/profile/retrato-real.webp
```

- [ ] **Step 2: Point `profile.ts` at the new asset**

```ts
// src/data/profile.ts
	avatar: {
		url: '/profile/retrato-real.webp',
		alt: `${siteConfig.handle} real portrait photo`,
	},
```

- [ ] **Step 3: Remove the illustrated asset and confirm nothing else references it**

```bash
grep -rn "retrato-giblin" src/ public/ --include="*.ts" --include="*.astro" --include="*.json"
# expect: no matches after Step 2
git rm public/profile/retrato-giblin.webp
```

- [ ] **Step 4: Add a regression test preventing the illustration from becoming primary again**

Add to `tests/unit/public-identity.test.js` (same file already asserting canonical identity facts, following its existing `read()`/`toContain` pattern):

```js
test('uses the real portrait as the primary avatar, not the illustrated one', async () => {
	const profile = await read('src/data/profile.ts');

	expect(profile).toContain("url: '/profile/retrato-real.webp'");
	expect(profile).not.toContain('retrato-giblin');
});
```

- [ ] **Step 5: Run the test and the visual check**

```bash
bun test tests/unit/public-identity.test.js
bun run dev   # visually confirm Hero renders the real portrait in Light and Dark, EN and ES
```

- [ ] **Step 6: Commit**

```bash
git add public/profile/retrato-real.webp src/data/profile.ts tests/unit/public-identity.test.js
git rm public/profile/retrato-giblin.webp
git commit -m "feat(60): replace illustrated avatar with the approved real portrait"
```

---

## Phase 3 — Align positioning and content hierarchy

### Task 3: Add `.NET`/`C#` to the tech stack and reorder by verified relevance

**Files:**
- Create: `src/shared/assets/tech-icons/dotnet.svg`, `src/shared/assets/tech-icons/csharp.svg` (source official multi-color logos matching the existing icon style — e.g. the same set `python.svg`/`nodejs.svg` came from — do not hand-author path data)
- Modify: `src/data/skills.ts`

- [ ] **Step 1: Add the two missing icon imports and entries**

```ts
// src/data/skills.ts — add alongside existing imports
import DotnetIcon from '@shared/assets/tech-icons/dotnet.svg?raw';
import CSharpIcon from '@shared/assets/tech-icons/csharp.svg?raw';
```

- [ ] **Step 2: Reorder `skills` so the verified current core leads**

The grid renders in array order (`SkillsSection.astro:26`, no sort/grouping), so array order is visual priority. Per the Professional Profile's verified current stack (".NET, C#, Angular, TypeScript, relational/document databases"), reorder to:

```ts
export const skills: Skill[] = [
	{ id: 'dotnet', name: '.NET', icon: DotnetIcon, category: 'backend' },
	{ id: 'csharp', name: 'C#', icon: CSharpIcon, category: 'backend' },
	{ id: 'angular', name: 'Angular', icon: AngularIcon, category: 'frontend' },
	{ id: 'typescript', name: 'TypeScript', icon: TypeScriptIcon, category: 'frontend' },
	{ id: 'nodejs', name: 'Node.js', icon: NodeIcon, category: 'backend' },
	{ id: 'astro', name: 'Astro', icon: AstroIcon, category: 'frontend' },
	{ id: 'tailwindcss', name: 'Tailwind CSS', icon: TailwindIcon, category: 'frontend' },
	{ id: 'docker', name: 'Docker', icon: DockerIcon, category: 'tools' },
	{ id: 'figma', name: 'Figma', icon: Figma, category: 'tools' },
	// Below the fold: kept per decision point 2 pending an evidence-trim confirmation.
	{ id: 'react', name: 'React', icon: ReactIcon, category: 'frontend' },
	{ id: 'nextjs', name: 'Next.js', icon: NextIcon, category: 'frontend' },
	{ id: 'python', name: 'Python', icon: PythonIcon, category: 'backend' },
	{ id: 'django', name: 'Django', icon: DjangoIcon, category: 'backend' },
	{ id: 'cloudflare', name: 'Cloudflare', icon: ClaudflareIcon, category: 'cloud' },
	{ id: 'cloudinary', name: 'Cloudinary', icon: ClaudinaryIcon, category: 'cloud' },
	{ id: 'n8n', name: 'n8n', icon: N8nIcon, category: 'tools' },
	{ id: 'gemini', name: 'Gemini', icon: GeminiIcon, category: 'ai' },
	{ id: 'openai', name: 'OpenAI', icon: OpenAIIcon, category: 'ai' },
	{ id: 'claude', name: 'Claude', icon: ClaudeIcon, category: 'ai' },
];
```

- [ ] **Step 2b: Confirm the "Core engineering stack" title stays truthful**

Since `.NET`/`C#` now lead the list, `en.json`/`es.json` `skills.title` ("Core engineering stack" / "Stack principal de ingeniería") no longer needs renaming to "Selected technologies" — leave as-is.

- [ ] **Step 3: Add a coverage test**

```js
// tests/unit/public-identity.test.js — new test
test('tech stack leads with the verified current professional core', async () => {
	const skills = await read('src/data/skills.ts');

	expect(skills).toContain("id: 'dotnet'");
	expect(skills).toContain("id: 'csharp'");
	const dotnetIndex = skills.indexOf("id: 'dotnet'");
	const reactIndex = skills.indexOf("id: 'react'");
	expect(dotnetIndex).toBeLessThan(reactIndex);
});
```

- [ ] **Step 4: Run tests and visually verify the compact grid stays readable**

```bash
bun test tests/unit/public-identity.test.js
bun run dev
```

- [ ] **Step 5: Commit**

```bash
git add src/shared/assets/tech-icons/dotnet.svg src/shared/assets/tech-icons/csharp.svg src/data/skills.ts tests/unit/public-identity.test.js
git commit -m "feat(60): add .NET/C# and reorder tech stack by verified relevance"
```

### Task 4: Correct consulting copy to match the Client Services launch gate

**Files:**
- Modify: `src/shared/i18n/locales/en.json:45-49`
- Modify: `src/shared/i18n/locales/es.json` (equivalent `contact` block)

- [ ] **Step 1: Replace the EN consulting copy**

```json
// src/shared/i18n/locales/en.json
"contact": {
	"title": "Engineering consulting is in preparation",
	"message": "I'm preparing a focused web-service offer. Reach out if you'd like to discuss a future engagement.",
	"buttonText": "Send an inquiry",
	"heading": "Engineering consulting"
},
```

- [ ] **Step 2: Replace the ES consulting copy with the equivalent meaning**

```json
// src/shared/i18n/locales/es.json
"contact": {
	"title": "Consultoría de ingeniería en preparación",
	"message": "Estoy preparando una oferta enfocada de servicios web. Escríbeme si quieres conversar sobre una futura colaboración.",
	"buttonText": "Enviar una consulta",
	"heading": "Consultoría de ingeniería"
},
```

- [ ] **Step 3: Add a regression test against the "available" claim**

```js
// tests/unit/public-identity.test.js — new test
test('does not claim consulting is actively available before the launch gate', async () => {
	const [en, es] = await Promise.all([
		read('src/shared/i18n/locales/en.json'),
		read('src/shared/i18n/locales/es.json'),
	]);

	for (const catalog of [en, es]) {
		expect(catalog).not.toMatch(/consulting and product discovery are available/i);
		expect(catalog).not.toMatch(/consultor[ií]a.*est[aá]n disponibles/i);
	}
});
```

- [ ] **Step 4: Run tests**

```bash
bun test tests/unit/public-identity.test.js
```

- [ ] **Step 5: Commit**

```bash
git add src/shared/i18n/locales/en.json src/shared/i18n/locales/es.json tests/unit/public-identity.test.js
git commit -m "fix(60): align consulting copy with Client Services launch state"
```

### Task 5: Bound the hero work-mode claim

**Files:**
- Modify: `src/shared/i18n/locales/en.json:7` (`hero.workMode`)
- Modify: `src/shared/i18n/locales/es.json` (equivalent line)

The current `"Remote · Europe & Latin America"` states unrestricted regional availability as a current fact; the Professional Profile only supports "remote from Peru," with international/relocation framed as future direction, not current state.

- [ ] **Step 1: Update EN**

```json
"workMode": "Remote · based in Peru",
```

- [ ] **Step 2: Update ES equivalent**

```json
"workMode": "Remoto · con base en Perú",
```

- [ ] **Step 3: Add a regression test**

```js
test('does not claim unrestricted regional availability', async () => {
	const [en, es] = await Promise.all([
		read('src/shared/i18n/locales/en.json'),
		read('src/shared/i18n/locales/es.json'),
	]);

	expect(en).not.toMatch(/Europe\s*&\s*Latin America/i);
	expect(es).not.toMatch(/Europa\s*y\s*Latinoam[eé]rica/i);
});
```

- [ ] **Step 4: Run tests and commit**

```bash
bun test tests/unit/public-identity.test.js
git add src/shared/i18n/locales/en.json src/shared/i18n/locales/es.json tests/unit/public-identity.test.js
git commit -m "fix(60): bound hero work-mode wording to the verified current state"
```

---

## Phase 4 — Apply project evidence contracts

### Task 6: Separate Kioku stable/active wording and Yukidoke API/Web wording

**Files:**
- Modify: `src/data/weekly-project.ts` (both `en` and `es` arrays)

**Interfaces:**
- Consumes: existing `WeeklyProject` type (`src/entities/weekly-project/model/types.ts`) — no type changes needed, `status`/`technologies` are free-form strings already expressive enough for this correction.

- [ ] **Step 1: Update the Kioku entry (EN) to separate stable release from active development**

```ts
// src/data/weekly-project.ts — en.kioku
status: 'Stable v2.3.0 · active development',
```

- [ ] **Step 2: Update the Kioku entry (ES)**

```ts
status: 'Estable v2.3.0 · desarrollo activo',
```

- [ ] **Step 3: Update the Yukidoke entry (EN) to separate API from Web lifecycle, per `EV-YUKIDOKE-001`**

```ts
// src/data/weekly-project.ts — en.yukidoke
contribution:
	'Defined a scalable DDD and Clean Architecture .NET API — v1 complete and release-ready — paired with an Angular client migrating to server-authoritative financial rules.',
technologies: ['.NET', 'Angular', 'PostgreSQL', 'DDD', 'Keycloak'],
status: 'API v1 complete · Web in active beta',
```

- [ ] **Step 4: Update the Yukidoke entry (ES)**

```ts
contribution:
	'Definí una API en .NET con DDD y Clean Architecture — v1 completa y lista para release — junto a un cliente Angular en migración hacia reglas financieras autoritativas en el servidor.',
technologies: ['.NET', 'Angular', 'PostgreSQL', 'DDD', 'Keycloak'],
status: 'API v1 completa · Web en beta activa',
```

- [ ] **Step 5: Add a regression test asserting the lifecycle split**

```js
// tests/unit/public-identity.test.js — new test
test('keeps Yukidoke API and Web lifecycle states separate', async () => {
	const projects = await read('src/data/weekly-project.ts');

	expect(projects).toMatch(/API v1 complete.*Web in active beta/);
	expect(projects).not.toMatch(/status:\s*'Private product in development'/);
});
```

- [ ] **Step 6: Run tests and commit**

```bash
bun test tests/unit/public-identity.test.js
git add src/data/weekly-project.ts tests/unit/public-identity.test.js
git commit -m "fix(60): separate Kioku stable/active and Yukidoke API/Web evidence wording"
```

### Task 7: Resolve the Hub self-card question

**Files:**
- Modify: `src/data/weekly-project.ts` (remove the `hub` entry from both `en` and `es` arrays, per decision point 3 above — confirm before merging)

- [ ] **Step 1: Remove the `hub` project entry from both locale arrays**

Delete the `{ id: 'hub', ... }` object from `projects.en` and `projects.es` in `src/data/weekly-project.ts`. `getFeaturedProjects` (`slice(0, 3)`) will then return exactly the two remaining evidenced projects (Kioku, Yukidoke) without any code change.

- [ ] **Step 2: Update the featured-projects test expectations**

```bash
grep -n "hub" tests/e2e/featured-projects.spec.ts
```

Update any assertion there that expects 3 cards or expects a `hub` id to instead expect 2 cards (Kioku, Yukidoke).

- [ ] **Step 3: Run the E2E spec and commit**

```bash
bun run test:e2e -- featured-projects
git add src/data/weekly-project.ts tests/e2e/featured-projects.spec.ts
git commit -m "fix(60): drop the Hub self-card from featured projects"
```

---

## Phase 5 — Remove bounded analytics debt

### Task 8: Remove the legacy `calendly_opened` event

**Files:**
- Modify: `src/shared/analytics/conversion.ts:4-11`
- Modify: `src/widgets/cta-section/ui/CTAButtons.astro:11,23,35`
- Modify: `docs/analytics.md` (drop the "legacy compatibility value" paragraph once removed)

**Interfaces:**
- Produces: `ConversionEvent` union without `'calendly_opened'` — no other file constructs a `ConversionEvent` literal for `'calendly_opened'` (verified via repo-wide grep: only these two files reference it, and no CTA button with `id: 'calendly'` exists in `src/data/cta.ts`, so the mapping was already dead code).

- [ ] **Step 1: Remove the event from the typed catalog**

```ts
// src/shared/analytics/conversion.ts
export const conversionEvents = [
	'resume_downloaded',
	'portfolio_opened',
	'featured_projects_viewed',
	'github_opened',
	'linkedin_opened',
	'project_opened',
	'contact_clicked',
	'language_changed',
] as const;
```

- [ ] **Step 2: Remove the dead icon import and mappings**

```astro
<!-- src/widgets/cta-section/ui/CTAButtons.astro -->
<!-- remove: import CalendarIcon from '@shared/assets/cta-icons/calendar.svg?raw'; -->
<!-- remove from iconMap: calendar: CalendarIcon, -->
<!-- remove from eventMap: calendly: 'calendly_opened', -->
```

- [ ] **Step 3: Update `docs/analytics.md`**

Remove the paragraph starting "`calendly_opened` remains in the typed event catalog..." since the event no longer exists.

- [ ] **Step 4: Add a regression test**

```js
// tests/unit/maintenance.test.js — extend the existing analytics test
test('removes the legacy calendly conversion event', async () => {
	const conversion = await read('src/shared/analytics/conversion.ts');
	const ctaButtons = await read('src/widgets/cta-section/ui/CTAButtons.astro');

	expect(conversion).not.toContain('calendly_opened');
	expect(ctaButtons).not.toContain('calendly');
});
```

- [ ] **Step 5: Run tests**

```bash
bun test tests/unit
```

- [ ] **Step 6: Commit**

```bash
git add src/shared/analytics/conversion.ts src/widgets/cta-section/ui/CTAButtons.astro docs/analytics.md tests/unit/maintenance.test.js
git commit -m "chore(60): remove the legacy calendly_opened analytics event"
```

---

## Phase 6 — Validate the exact source head

### Task 9: Run and record full local validation

**Files:** none — verification only.

- [ ] **Step 1: Rebase/merge all Phase 1–5 branches into a single integration branch (or merge each PR sequentially into `develop`) and pull the exact head locally**

```bash
git switch develop && git pull
```

- [ ] **Step 2: Run the complete local validation contract inside the DevContainer or an equivalent Ubuntu environment**

```bash
bun install --frozen-lockfile
bun run validate:local 2>&1 | tee validation-local.log
```

- [ ] **Step 3: Record pass/fail per check in the log** — Astro check, architecture, Prettier, ESLint, link checker, unit tests, production build, Playwright (EN/ES × Light/Dark × mobile/desktop × accessibility), Lighthouse mobile/desktop. Any hosted check that cannot run locally (e.g. GitHub Actions quota) stays `Not executed`, never assumed passing.

- [ ] **Step 4: Fix any failure found before proceeding to Phase 7** — do not promote on a red or partially-executed validation run.

---

## Phase 7 — Promote to stable

### Task 10: Open and merge the `develop → main` promotion PR

**Files:** none — release process only.

- [ ] **Step 1: Open the PR**

```bash
gh pr create --repo sandovaldavid/hub --base main --head develop \
  --title "release: promote human-first Hub alignment (closes #60)" \
  --body "Promotes the reconciled, evidence-bounded, human-first Hub implementation to main. Closes sandovaldavid/hub#60. Validation log: validation-local.log (Phase 6)."
```

- [ ] **Step 2: Confirm required checks (`CI / Quality`, `CI / E2E`, `CI / Lighthouse`, `Check PR Branch / check-source-branch`) pass**, per `docs/branch-governance.md`.

- [ ] **Step 3: Merge (squash, per repository ruleset) and confirm Vercel production redeploys the merged `main` commit.**

```bash
gh pr merge --repo sandovaldavid/hub --squash
```

---

## Phase 8 — Runtime and channel verification

### Task 11: Verify unauthenticated production output

**Files:** none — verification only.

- [ ] **Step 1: Scripted checks**

```bash
curl -sI https://hub.sandovaldavid.com/ | head -1                 # expect 200
curl -sI https://hub.sandovaldavid.com/es/ | head -1               # expect 200
curl -sI https://linktree.sandovaldavid.com/ | grep -i location    # expect 308 -> hub.sandovaldavid.com
curl -s https://hub.sandovaldavid.com/ | grep -o 'https://hub.sandovaldavid.com' | head -1
curl -s https://hub.sandovaldavid.com/ | grep -io 'retrato-real.webp'
```

- [ ] **Step 2: Manual checklist** — real portrait leads Hero in Light/Dark and EN/ES; canonical/hreflang/OG/Twitter/JSON-LD point at the Hub domain; social links match the registry (LinkedIn `jdsandovals`, X `jdsandoval_`, Instagram `jdsandovals`, email `hello@sandovaldavid.com`); no personal phone number anywhere; project cards show the corrected Kioku/Yukidoke lifecycle wording; consulting card shows the preparation wording, not "available"; conversion events fire without personal data (verify in Vercel Analytics or DevTools network tab); real LinkedIn/X/Slack link-preview unfurl uses the approved OG asset.

- [ ] **Step 3: Record the exact verified commit SHA and timestamp** for the closing evidence in Task 12.

---

## Phase 9 — Close and propagate

### Task 12: Close the issue and update durable vault records

**Files (Cortex-L7 vault, not this repository):**
- Modify: `10-nexus/personal-brand/governance/channel-alignment-status.md` — move Hub row/matrix cells from `Partial/Conflict` to `Aligned`, record the verification date and stable commit SHA.
- Modify: `20-execution/hub/plans/PLAN-2026-07-29-complete-hub-alignment-and-promotion.md` — check off the completed phases.
- Modify (if wording changed): `10-nexus/personal-brand/evidence/kioku-project-evidence-brief.md`, `10-nexus/personal-brand/evidence/yukidoke-project-evidence-brief.md` — only if Task 6's approved wording diverges from what's already recorded there (it currently doesn't; the task copies from these briefs).

- [ ] **Step 1: Comment on and close the GitHub issue with evidence**

```bash
gh issue comment 60 --repo sandovaldavid/hub --body "Reconciled develop/main (zero-diff), restored the real portrait, corrected tech-stack/consulting/project-evidence copy, removed the legacy calendly_opened event, validated and promoted to main at <SHA>. Live verification: <checklist link/summary>."
gh issue close 60 --repo sandovaldavid/hub
```

- [ ] **Step 2: Update Channel Alignment Status** in the vault to `Aligned` for the Hub row, with the verification date.

- [ ] **Step 3: Update the vault plan's checkboxes** to reflect completion.

---

## Self-review

**Spec coverage against issue #60's 18 scope items:**

| Scope item | Task |
|---|---|
| 1. Merge PR #62 | Already done (Phase 0, verified) |
| 2–3. Inventory/reconcile main-only commits | Task 1 |
| 4–5. Real portrait primary / illustration secondary-or-removed | Task 2 |
| 6. Audit EN/ES availability/work-mode wording | Task 5 (workMode); Task 4 covers consulting |
| 7. Tech-stack evidence-priority | Task 3 |
| 8. Consulting vs Client Services state | Task 4 |
| 9. Evidence fields for lifecycle/access/demo | Task 6 (existing `repositoryAvailability`/`demoAvailability` fields already carry access state; this task corrects the lifecycle strings) |
| 10. Update Kioku/Yukidoke from current briefs | Task 6 |
| 11. Hub self-card decision | Task 7 |
| 12. Remove legacy Calendly event | Task 8 |
| 13. Confirm Canonical Contact Registry | Already passing per `tests/unit/public-identity.test.js` (verified during research — no changes needed) |
| 14. Confirm OG export at 1200×630 | Task 11 manual checklist (asset itself is a Figma export dependency, same class as decision point 1 — flag if `public/og/og-image.png` still needs the real-portrait treatment) |
| 15. Light/Dark for portrait/logo/favicon | Task 2 Step 5, Task 9 (Playwright Light/Dark coverage) |
| 16. Run validate:local | Task 9 |
| 17. Promote develop → main | Task 10 |
| 18. Verify live + redirect + previews | Task 11 |

**Placeholder scan:** no TBD/"add appropriate"/unshown code remains; the three genuinely open judgment calls are named explicitly as decision points with concrete defaults, not left blank.

**Type consistency:** no new shared types are introduced; `WeeklyProject`, `ConversionEvent`, and `Profile['avatar']` are reused as already defined — Task 6 and Task 8 only change literal values/array membership, not shapes.

---

## Risks

| Risk | Mitigation |
|---|---|
| Losing main-only production fixes during reconciliation | Verified in advance: the 4 main-only commits net to zero diff (Task 1) |
| Portrait task blocked on a design export outside this repo | Called out as decision point 1; code change (Task 2 Steps 2–6) is ready to run the moment the asset lands |
| Trimming skills too aggressively without evidence | Task 3 keeps ambiguous entries below the fold instead of deleting them; flagged as decision point 2 |
| Removing the Hub card reduces visible proof points from 3 to 2 | Flagged as decision point 3; reversible by re-adding the entry |
| Copy changes drifting from Messaging & Voice governance | All EN/ES copy in Tasks 4–6 is drawn directly from `docs/content-governance.md` and the approved Evidence Briefs, not invented independently |
| Declaring success without hosted CI | Task 9 requires recording exact pass/fail per check; "Not executed" is a valid state, "assumed passing" is not |
