# Manual accessibility validation checklist

Use this checklist before merging changes that affect layout, navigation, content hierarchy, animation, color, or interactive controls.

## Keyboard navigation

- [ ] Load `/` and `/es/` without using a mouse.
- [ ] Press `Tab` and confirm the skip link is the first focusable element.
- [ ] Activate the skip link and confirm focus moves to `#main-content`.
- [ ] Continue tabbing through share, theme, resume, CTA, social, project, repository, demo, email, and consultation controls.
- [ ] Confirm the tab order follows the visual and semantic reading order.
- [ ] Confirm every interactive element can be activated with `Enter` or `Space` as appropriate.
- [ ] Confirm there are no keyboard traps.

## Focus visibility

- [ ] Verify focus indicators in light mode.
- [ ] Verify focus indicators in dark mode.
- [ ] Confirm focus is not hidden behind floating controls or viewport edges.
- [ ] Confirm focus remains visible at mobile, tablet, and desktop widths.

## Reduced motion

- [ ] Enable the operating system preference to reduce motion.
- [ ] Confirm all content is immediately visible.
- [ ] Confirm staggered entrance animations are disabled.
- [ ] Confirm hover, theme, and control transitions do not create unnecessary motion.
- [ ] Confirm navigation and scrolling remain usable.

## Screen readers and semantics

- [ ] Confirm there is one descriptive `h1` per route.
- [ ] Confirm heading levels follow a logical hierarchy without skipped levels.
- [ ] Confirm every section has a meaningful accessible name.
- [ ] Confirm share and theme controls announce their purpose and current state.
- [ ] Confirm external links communicate their destination from link text or accessible name.
- [ ] Confirm unavailable repository and demo states are announced as text, not only by color.
- [ ] Confirm images expose useful alternative text or are intentionally decorative.

## Contrast and themes

- [ ] Inspect text, icons, borders, badges, focus rings, and buttons in light mode.
- [ ] Repeat the inspection in dark mode.
- [ ] Verify hover, focus, active, disabled, and unavailable states meet contrast requirements.
- [ ] Verify content remains understandable with forced colors or high contrast enabled.

## Windows High Contrast / forced-colors (#92)

Automated coverage emulates `prefers-contrast: more` and `forced-colors: active` in Chromium (`tests/e2e/accessibility.spec.ts`), but no engine lets Playwright emulate real Windows High Contrast Mode. Confirm on actual Windows hardware or a Windows VM before release:

- [ ] Enable a Windows High Contrast theme (Settings → Accessibility → Contrast themes).
- [ ] Load `/` and `/es/` and confirm text, borders, focus rings, badges, and buttons remain distinguishable using system colors (`Canvas`, `CanvasText`, `Highlight`).
- [ ] Confirm no control disables forced colors globally (`forced-color-adjust: none` should not appear outside a narrowly justified, documented exception).
- [ ] Attach a screenshot or screen recording as evidence in the pull request or release notes.

## Release evidence (#98)

- [ ] Run `bun run validate:local` on the exact commit being promoted from `develop` to `main`.
- [ ] Confirm the `develop → main` pull request shows no unresolved conflicts and every required check passed on its own head.
- [ ] Record WebKit/Firefox local-run results explicitly as `Passed`, `Failed`, `Blocked`, or `Not run` — never assume from the CI-only Chromium result.
- [ ] After merge, verify the change on the deployed `main` result (GitHub + Vercel), not only the merged pull request.

## Automated validation

- [ ] Run `bun run format:check`.
- [ ] Run `bun run lint`.
- [ ] Run `bun run test:unit`.
- [ ] Run `bun run build`.
- [ ] Run `bun run test:e2e`.
- [ ] Confirm axe reports no critical or serious WCAG 2.1 A/AA violations.
- [ ] Confirm Lighthouse accessibility checks pass.

Record any exception in the pull request with its impact, reason, and follow-up issue.
