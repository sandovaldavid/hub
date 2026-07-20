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

## Lighthouse CI thresholds

Lighthouse runs three times against `/` and `/es/` using the desktop preset. The median result must satisfy:

| Metric | Budget |
| --- | ---: |
| Performance | ≥ 0.90 |
| Accessibility | ≥ 0.95 |
| Best practices | ≥ 0.95 |
| SEO | ≥ 0.95 |
| First Contentful Paint | ≤ 2,000 ms |
| Largest Contentful Paint | ≤ 2,500 ms |
| Cumulative Layout Shift | ≤ 0.10 |
| Total Blocking Time | ≤ 200 ms |
| Speed Index | ≤ 3,000 ms |
| Total page weight | ≤ 500 KB |

Lighthouse does not provide a stable lab INP measurement. Total Blocking Time is used as the CI proxy, while INP should be reviewed from production field analytics when enough traffic is available.

## Validation

Run locally after a production build:

```bash
bun run build
bun run test:lighthouse
```

Any budget change must be justified with before/after measurements in the pull request rather than relaxing thresholds solely to make CI pass.
