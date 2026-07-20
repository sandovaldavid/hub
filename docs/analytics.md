# Conversion analytics

The hub uses Vercel Analytics custom events to measure whether visitors reach the professional destinations the site is designed to promote.

## Primary metric

**Qualified conversion rate** is the percentage of visits that produce at least one of these events:

- `resume_downloaded`
- `portfolio_opened`
- `github_opened`
- `linkedin_opened`
- `project_opened`
- `contact_clicked`
- `calendly_opened`

`language_changed` is a supporting navigation event and is not counted as a qualified conversion.

## Event properties

Only allow-listed, non-personal properties are sent:

- `locale`: `en` or `es`.
- `position`: the UI area where the action occurred.
- `source`: normalized to `direct`, `search`, `social`, `referral`, or `internal`.
- `item`: a stable internal identifier such as `resume`, `github`, or a project ID.

The implementation must never send names, email addresses, phone numbers, complete referrer URLs, query parameters, free-form text, secrets, or user identifiers.

## Testing

Run the application locally or use a Vercel preview and inspect the clickable elements in DevTools. Primary links expose `data-conversion-event`, `data-conversion-position`, and optional `data-conversion-item` attributes. Automated Playwright tests verify that the required events exist and that analytics attributes do not contain personal data or complete URLs.

Custom events are visible in the Vercel project Analytics dashboard after interacting with a preview or production deployment where Analytics is enabled. Event delivery is asynchronous and must not delay or prevent navigation.

## Evaluation

Review conversion by locale, source category, and UI position. Prefer improving copy, ordering, and evidence when qualified conversion is weak; do not add invasive tracking or broaden the property set without a documented need and privacy review.
