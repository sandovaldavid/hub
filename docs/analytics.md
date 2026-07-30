# Conversion analytics

The Hub uses Vercel Analytics custom events to measure whether visitors reach the professional destinations the site is designed to promote.

## Primary metric

**Qualified conversion rate** is the percentage of visits that produce at least one active destination event:

- `resume_downloaded`
- `portfolio_opened`
- `github_opened`
- `linkedin_opened`
- `project_opened`
- `contact_clicked`

`featured_projects_viewed` is a supporting evidence-navigation event. `language_changed` is a supporting navigation event. Neither is counted as a qualified destination conversion by itself.

`calendly_opened` remains in the typed event catalog as a legacy compatibility value from the former scheduling flow. No current Hub UI should emit it. Remove the legacy value and its tests in a focused source change after confirming that no historical dashboard, consumer or migration contract requires it.

## Interpretation boundary

A conversion event proves that a visitor interacted with a route. It does not prove:

- recruiter quality or hiring intent;
- a completed application or contact outcome;
- project adoption;
- consulting demand;
- revenue or business impact.

Use analytics to improve route clarity, ordering and copy. Do not use event counts to strengthen public professional claims without a separately defined measurement method and evidence review.

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

Review conversion by locale, source category and UI position. Prefer improving copy, ordering and evidence when qualified conversion is weak. Do not add invasive tracking, broaden the property set or introduce a new business metric without a documented need, privacy review and evidence definition.