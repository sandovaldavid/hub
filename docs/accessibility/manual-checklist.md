# Manual accessibility validation checklist

Use this checklist before merging changes that affect layout, navigation, content hierarchy, animation, color or interactive controls.

Automated tests are necessary but do not replace manual review of reading order, focus behavior, operating-system accessibility modes or the final deployed experience.

## Keyboard navigation

- [ ] Load `/` and `/es/` without using a mouse.
- [ ] Press `Tab` and confirm the skip link is the first focusable element.
- [ ] Activate the skip link and confirm focus moves to `#main-content`.
- [ ] Continue tabbing through share, theme, language, résumé, CTA, social, project, repository, demo, email, consultation, footer and scroll-to-top controls that are present on the route.
- [ ] Confirm the tab order follows the visual and semantic reading order.
- [ ] Confirm every interactive element can be activated with `Enter` or `Space` as appropriate.
- [ ] Confirm there are no keyboard traps.
- [ ] Confirm hover tooltips are not required to understand or operate the fixed corner controls.

## Focus visibility

- [ ] Verify focus indicators in light mode.
- [ ] Verify focus indicators in dark mode.
- [ ] Confirm focus is not hidden behind floating controls, the footer or viewport edges.
- [ ] Confirm focus remains visible at mobile, tablet and desktop widths.
- [ ] Confirm the scroll-to-top control receives a visible focus state whenever it is exposed to the user.

## Reduced motion

- [ ] Enable the operating-system preference to reduce motion.
- [ ] Confirm all content is immediately visible.
- [ ] Confirm staggered entrance animations are disabled.
- [ ] Confirm hover, theme and control transitions do not create unnecessary motion.
- [ ] Confirm smooth scrolling does not override the reduced-motion experience.
- [ ] Confirm navigation and scroll-to-top behavior remain usable.

## Screen readers and semantics

- [ ] Confirm there is one descriptive `h1` per route.
- [ ] Confirm heading levels follow a logical hierarchy without skipped levels.
- [ ] Confirm every section has a meaningful accessible name when one is required.
- [ ] Confirm share, theme, language and scroll-to-top controls announce their purpose and state where applicable.
- [ ] Confirm custom visual tooltips do not replace programmatic accessible names.
- [ ] Confirm external links communicate their destination from link text or accessible name.
- [ ] Confirm unavailable repository and demo states are announced as text, not only by color.
- [ ] Confirm images expose useful alternative text or are intentionally decorative.
- [ ] Confirm footer content has an appropriate landmark/semantic structure and does not duplicate the primary page heading hierarchy.

## Contrast and themes

- [ ] Inspect text, icons, borders, badges, focus rings, buttons and fixed controls in light mode.
- [ ] Repeat the inspection in dark mode.
- [ ] Verify hover, focus, active, disabled and unavailable states meet applicable contrast requirements.
- [ ] Verify interactive control boundaries remain distinguishable from their surrounding surfaces.
- [ ] Verify tooltip foreground/background combinations remain readable without obscuring nearby controls.
- [ ] Verify content remains understandable with forced colors or high contrast enabled.

## Responsive and zoom

- [ ] Check the page at a narrow mobile viewport without horizontal scrolling caused by content.
- [ ] Check tablet widths where hero, availability actions, social panels and footer layout may reflow.
- [ ] Verify 200% browser zoom and 200% text scaling do not hide controls or truncate essential content.
- [ ] Confirm fixed corner controls do not overlap primary content, footer links or each other.
- [ ] Confirm the scroll-to-top control appears only in the intended state and does not create an unreachable or obscured target.

## Windows High Contrast / forced colors

Automated coverage emulates `prefers-contrast: more` and `forced-colors: active` in Chromium (`tests/e2e/accessibility.spec.ts`), but browser emulation is not equivalent to real Windows High Contrast Mode. Confirm on actual Windows hardware or a Windows VM before release when the change affects visual states:

- [ ] Enable a Windows High Contrast theme (Settings → Accessibility → Contrast themes).
- [ ] Load `/` and `/es/` and confirm text, borders, focus rings, badges and buttons remain distinguishable using system colors such as `Canvas`, `CanvasText` and `Highlight`.
- [ ] Confirm no control disables forced colors globally (`forced-color-adjust: none` should not appear outside a narrowly justified, documented exception).
- [ ] Attach a screenshot or screen recording as evidence in the pull request or release notes when this check is relevant.

## Release evidence

- [ ] Run `bun run validate:local` on the exact commit being promoted from `develop` to `main` for release-sensitive changes.
- [ ] Confirm the `develop -> main` pull request shows no unresolved conflicts and every required hosted check has an explicit result.
- [ ] Record local browser results explicitly as `Passed`, `Failed`, `Blocked` or `Not run`; never assume one engine proves another.
- [ ] After merge, verify the change on the deployed `main` result (GitHub + Vercel), not only the merged pull request.

## Automated validation

- [ ] Run `bun run format:check`.
- [ ] Run `bun run lint`.
- [ ] Run `bun run test:unit`.
- [ ] Run `bun run build`.
- [ ] Run `bun run test:e2e` when browser behavior is affected.
- [ ] Confirm Axe reports no critical or serious WCAG 2.1 A/AA violations.
- [ ] Confirm Lighthouse accessibility checks pass when the Lighthouse gate is relevant.

Record any exception in the pull request with its impact, reason and follow-up issue when needed.
