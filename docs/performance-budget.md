# Performance budget

This microsite uses a deliberately small performance envelope so regressions are detected before merge.

## Typography

- Use system font stacks only; no runtime requests to Google Fonts or other font CDNs.
- Maximum of two logical families: one sans-serif stack and one monospace stack.
- Avoid font preloads unless a self-hosted critical font is introduced with measured benefit.

## Images

- Visible images must use optimized SVG or WebP assets.
- Every rendered `<img>` must declare intrinsic `width` and `height`.
- The profile avatar is the only high-priority image because it appears above the fold.
- Decorative brand images use empty alt text and lower fetch priority.
- Open Graph images are metadata resources and must not be preloaded into the page.

## Lighthouse CI profiles and thresholds

Lighthouse audits `/` and `/es/` once with the default mobile profile and once with the desktop preset. Both profiles reuse the same production build in CI.

The current category policy is:

| Category | Threshold | Enforcement |
| --- | ---: | --- |
| Performance | ≥ 0.80 | Warning because shared CI runners are variable |
| Accessibility | ≥ 0.95 | Error |
| Best practices | ≥ 0.90 | Error |
| SEO | ≥ 0.90 | Error |

Lighthouse does not provide a stable lab INP measurement. Total Blocking Time should be reviewed as a lab proxy, while INP should be reviewed from production field analytics when enough traffic is available.

## Validation

Run both profiles locally after a production build:

```bash
bun run build
bun run test:lighthouse
```

For the complete CI-equivalent sequence, use `bun run validate:local` as documented in [`ci-validation.md`](ci-validation.md).

Any budget change must be justified with before/after measurements in the pull request rather than relaxing thresholds solely to make CI pass.
