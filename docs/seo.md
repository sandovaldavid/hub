# Human-first SEO contract

## Purpose

The Link Hub is David Sandoval Salvador's compact, bilingual professional profile and routing surface. Its SEO must identify David, establish his durable role as a Software Engineer and direct visitors toward verified evidence and contact channels without duplicating the portfolio.

This document records the audit and implementation decision for issue #55. Figma defines visual intent, Cortex-L7 owns durable brand and contact decisions, and this repository owns generated metadata, routes, assets and executable contracts.

## Search responsibility

### Link Hub

The Hub is responsible for:

- branded searches for David Sandoval;
- searches that combine David's name and durable professional role;
- a concise explanation of how he works: continuous learning, systems and product building, documented decisions and evidence;
- verified routing to the portfolio, résumé, GitHub, professional profiles and contact channel;
- localized English and Spanish discovery with equivalent meaning.

### Portfolio

The portfolio remains responsible for:

- detailed experience and project evidence;
- case studies, architecture decisions, outcomes and deeper technical context;
- role-specific and project-specific search intent;
- the canonical long-form professional website at `https://sandovaldavid.com`.

The Hub must not reproduce portfolio pages, create thin keyword routes or compete for stack-specific queries. Technologies may remain visible evidence in the product, but they are not David's primary SEO identity.

## Audit findings

| Classification | Finding | Resolution or status |
| --- | --- | --- |
| Critical | No confirmed critical indexing defect was found. | Canonical, robots, sitemap integration and public routes already existed. |
| High | EN and ES titles, descriptions and social copy defined David through Angular, .NET and TypeScript. | Replaced with name-first, durable Software Engineer copy that describes learning, systems, products, decisions and evidence. |
| High | Structured data exposed a root `Person` while leaving the localized profile page relationship implicit. | Replaced with a `ProfilePage` whose `mainEntity` is one canonical `Person`. |
| Medium | `sameAs` profiles were assembled directly inside the layout, duplicating the public identity registry. | Centralized the approved profile list in `siteConfig.sameAs`; the schema builder consumes only that list. |
| Medium | Social metadata omitted intrinsic image dimensions. | Added the existing PNG contract: `1200 × 630`, `image/png`, absolute Hub URL and localized alt text. |
| Medium | SEO browser tests used broad role regexes and did not verify exact descriptions, `x-default`, image metadata, application naming or graph relationships. | Added exact EN/ES contracts and source-level regression tests. |
| Low | The public application name was generic and the Apple title used only the handle. | Uses `David Sandoval — Professional Link Hub` and `David Sandoval`; `Linktree` is not presented as a public brand. |
| Strength | Astro already used `site`, `@astrojs/sitemap`, localized routes, self-referential canonicals, reciprocal `hreflang`, robots directives, Open Graph and Twitter Cards. | Preserved and covered more strictly. |
| Strength | The visible page already renders one descriptive `h1` for David and keeps the portrait, name and professional context primary. | Preserved by E2E coverage. |
| Unconfirmed | Real LinkedIn, X, Slack and messaging crops, cache refresh behavior and the current OG image's human-first composition were not validated from this execution environment. | Validate the deployed URL with platform preview tools before closing the issue. Do not infer success from metadata alone. |

## Localized metadata decision

### English title alternatives

1. **Recommended:** `David Sandoval | Software Engineer`
2. `David Sandoval — Software Engineer`
3. `David Sandoval | Software Engineering Profile`

### Spanish title alternatives

1. **Recommended:** `David Sandoval | Ingeniero de Software`
2. `David Sandoval — Ingeniero de Software`
3. `David Sandoval | Perfil de Ingeniería de Software`

The recommended versions are direct, name-first and durable. They preserve the professional role without adding unsupported seniority, specialization or leadership claims.

### English description alternatives

1. **Recommended:** `David Sandoval is a Software Engineer who learns continuously, builds maintainable systems and products, documents decisions, and shares evidence through his work.`
2. `Meet David Sandoval, a Software Engineer building maintainable systems and products while documenting decisions and continuous professional growth.`
3. `David Sandoval's professional Link Hub connects his software engineering work, documented decisions, portfolio, repositories and verified contact channels.`

### Spanish description alternatives

1. **Recommended:** `David Sandoval es Ingeniero de Software: aprende continuamente, construye sistemas y productos mantenibles, documenta decisiones y comparte evidencia mediante su trabajo.`
2. `Conoce a David Sandoval, Ingeniero de Software que construye sistemas y productos mantenibles mientras documenta decisiones y su evolución profesional.`
3. `El Hub profesional de David Sandoval conecta su trabajo de ingeniería de software, decisiones documentadas, portafolio, repositorios y canales verificados.`

The selected descriptions are semantically equivalent rather than literal translations. Neither version invents metrics, authority, leadership, certifications, specialization or business outcomes.

## Structured-data architecture

### Decision

Use one JSON-LD graph containing:

```text
ProfilePage (localized Hub URL)
  ├── mainEntity ───────→ Person (canonical professional identity)
  └── primaryImageOfPage → ImageObject (social preview asset)
```

### Canonical relationships

- `ProfilePage.url`: self-referential Hub canonical (`/` or `/es/`).
- `ProfilePage.inLanguage`: `en-US` or `es-PE`.
- `ProfilePage.mainEntity`: the same `Person` identifier on both routes.
- `Person.@id`: `https://sandovaldavid.com/#person`.
- `Person.url`: `https://sandovaldavid.com`, the long-form canonical professional website.
- `Person.mainEntityOfPage`: the current localized Hub page.
- `Person.sameAs`: only approved public profiles from the Canonical Contact Registry.
- `ImageObject.url` and `contentUrl`: the absolute Hub social-preview URL.

### Alternatives considered

1. **Root `Person`:** rejected because it does not explicitly model the localized page as a profile document.
2. **`ProfilePage` + `Person`:** selected because it separates page identity from person identity while keeping one canonical person across languages.
3. **`WebSite` + `Person`:** not selected because it adds no useful relationship for this two-route profile surface. Reconsider only if the Hub gains meaningful site-level functionality or additional content architecture.

## Canonical Contact Registry contract

The repository consumes these approved values:

| Purpose | Canonical value |
| --- | --- |
| Hub origin | `https://hub.sandovaldavid.com` |
| Person website | `https://sandovaldavid.com` |
| Email | `hello@sandovaldavid.com` |
| GitHub | `https://github.com/sandovaldavid` |
| LinkedIn | `https://www.linkedin.com/in/jdsandovals` |
| X | `https://x.com/jdsandoval_` |
| Instagram | `https://www.instagram.com/jdsandovals` |

The portfolio URL identifies the person's canonical website and is therefore not duplicated in `sameAs`. Personal phone data, personal WhatsApp and unapproved social destinations must not appear in metadata or structured data.

## Route inventory

| Contract | `/` | `/es/` |
| --- | --- | --- |
| `html[lang]` | `en` | `es` |
| Canonical | `https://hub.sandovaldavid.com/` | `https://hub.sandovaldavid.com/es/` |
| `hreflang=en` | English route | English route |
| `hreflang=es` | Spanish route | Spanish route |
| `hreflang=x-default` | English route | English route |
| Open Graph locale | `en_US` | `es_PE` |
| Alternate locale | `es_PE` | `en_US` |
| JSON-LD language | `en-US` | `es-PE` |
| JSON-LD person | Shared canonical person | Shared canonical person |

Both routes use the Hub origin for canonical, Open Graph, Twitter, `hreflang`, image, sitemap and robots contracts.

## Social-preview contract

The current metadata resource is:

```text
/og/og-image.png
image/png
1200 × 630
```

Code and tests require:

- an absolute HTTPS URL on the Hub domain;
- `og:image`, `og:image:secure_url`, MIME type, width, height and localized alt text;
- the same absolute resource in Twitter metadata;
- a successful image response with a PNG content type;
- PNG intrinsic dimensions matching the declared metadata.

The visual system must keep David as the subject, make name and role legible, and keep the logo secondary. A single language-neutral asset is acceptable only when it does not mix route-specific copy. Real platform crops and cache behavior remain manual evidence and are currently **Unconfirmed**.

## Indexing infrastructure

- Astro `site` is `https://hub.sandovaldavid.com`.
- `@astrojs/sitemap` generates the sitemap from public routes.
- `robots.txt` allows crawling and points to the absolute sitemap index.
- Every route is self-canonical.
- English is `x-default`.
- Metadata uses `index, follow` for general robots and Googlebot.

## Validation

Repository contracts:

```bash
bun run test:unit
bun run build
CI=1 bun run test:e2e
bun run validate:local
```

Manual deployment evidence required before issue closure:

1. Deploy the branch or merged `develop` state to a preview or production URL.
2. Refresh the social-preview cache where the platform provides that control.
3. Inspect LinkedIn, X, Slack and at least one messaging crop.
4. Confirm David remains the subject, the name and role are legible, and no mixed-language copy appears.
5. Record screenshots or preview links in the issue or pull request.

A missing, skipped, disabled or quota-blocked GitHub Actions run is not a pass. Record unavailable commands and hosted checks explicitly.
