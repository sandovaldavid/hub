# Hub content governance

## Channel job

The Hub is David Sandoval's compact recognition and routing surface.

Its job is to help a visitor answer quickly:

1. Who is David?
2. What kind of Software Engineer is he now?
3. What evidence is most relevant?
4. Where should the visitor go next?
5. How can the visitor contact him?

The Hub must not reproduce the portfolio, résumé or project documentation. Detailed project evidence, chronology and case studies belong in those sources.

## Message survival order

When space is limited, preserve this order:

1. David Sandoval.
2. Software Engineer / Ingeniero de Software.
3. Backend orientation with relevant frontend experience.
4. Concise method: maintainability, validation, product and business awareness, documented decisions.
5. Prioritized evidence routes.
6. International direction or secondary services only when useful and truthful.

Technologies support the message; they do not define the person.

## Source ownership

| Content | Runtime owner | Canonical decision or evidence |
| --- | --- | --- |
| Public identity, contact and destinations | `src/data/site.config.ts` | Cortex-L7 Canonical Contact Registry |
| Name, portrait and availability state | `src/data/profile.ts` and localized catalogs | Professional Profile and Identity System |
| EN/ES visible copy | `src/shared/i18n/locales/*.json` | Messaging and Voice governance |
| CTA destinations and behavior | `src/data/cta.ts` | Channel job and approved contact routes |
| Project summaries | `src/data/weekly-project.ts` | Project repositories and Evidence Registry |
| Technology presentation | `src/data/skills.ts` | Verified professional/project relevance |
| SEO copy and route metadata | localized catalogs, `src/data/seo.ts` | Human-first SEO contract |
| Structured data | `src/data/structured-data.ts` | One canonical Person and approved profiles |
| OG resource contract | `src/data/site.config.ts` and public asset | Search & Social Preview System |

A value may be implemented in the repository while its meaning remains governed elsewhere. Tests should enforce the implemented copy and relationships without turning mutable strategic text into duplicated strategy documents.

## Portrait and human presence

David's approved real portrait must lead the profile and people-facing surfaces.

Illustrations may be used only when all of these conditions hold:

- the illustration is explicitly secondary;
- it cannot be mistaken for the primary identity or profile photograph;
- the real portrait remains the dominant representation;
- Figma has an approved use case for the illustration;
- accessibility text describes the asset honestly.

An illustrated or stylized portrait must not be labeled generically as a "profile photo" when it is not a photograph.

## Role and positioning

Approved durable public category:

```text
Software Engineer
Ingeniero de Software
```

Current professional context may support:

- backend orientation;
- .NET, C#, Angular and TypeScript;
- fintech domain experience;
- maintainable systems and products;
- testing, validation, documentation and reproducible workflows.

Do not introduce:

- `Full-stack Developer` as the primary category;
- permanent `Junior` branding;
- architect, expert, senior, leader, mentor or founder titles without evidence;
- universal claims about quality, scalability, reliability or business impact.

## Availability wording

Availability statements are current-state claims and require review when circumstances change.

A compact Hub may state interest in relevant remote roles or international opportunities when that matches the current Professional Profile. It must not imply:

- guaranteed relocation;
- unrestricted availability by region or timezone;
- fluency or language levels that are not independently verified;
- employment status or notice periods that have not been approved for publication.

## Technology presentation

A section labeled **core engineering stack** must reflect David's actual current professional and strongest evidenced project context.

Priority order:

1. current professional core;
2. technologies demonstrated by selected evidence;
3. supporting tools that clarify execution capability.

Avoid a broad logo wall that treats every explored framework, provider or AI product as equivalent expertise. A technology should appear only when at least one of these is true:

- current professional use is verified;
- a featured project demonstrates meaningful use;
- the portfolio or résumé uses it with bounded evidence;
- it is necessary to explain the Hub implementation itself.

The section title must match its scope. Use a narrower label such as "Selected technologies" when the list intentionally includes exploratory or supporting tools.

## Project evidence contract

Each featured project requires these conceptual fields, whether represented directly in code or documented through tests:

- project identity;
- problem or user need;
- David's bounded contribution;
- current lifecycle state;
- repository access: public, private or unavailable;
- demo access: public, private or unavailable;
- stable release versus active-development boundary;
- limitation or claim boundary when necessary;
- evidence source or Evidence Registry ID.

### Kioku

- Public project and strongest public backend/developer-tooling evidence.
- Stable release claims must be tied to the audited stable branch/release.
- Active `develop` capabilities require a development label.
- Prefer the durable cross-session/process handoff problem over tool counts.
- Do not claim adoption, production scale, enterprise readiness, SLA or commercial impact.

### Yukidoke

- Private product evidence.
- API and Web state must remain separate.
- The API may be described as V1 feature-complete by backend criteria when the audited branch supports that wording.
- The Web remains an active beta and architecture migration until verified otherwise.
- Public source, demo, production use, users, revenue and financial impact must not be implied.
- Scalability wording must describe architecture intent or design constraints rather than proven production scale.

### Hub

The Hub may appear as implementation evidence for Astro, accessibility, SEO, testing and channel governance. It should not consume a featured slot merely to describe the page the visitor is already using when stronger external evidence is available.

## Consulting and client-services wording

Client services are secondary to David's Software Engineer positioning.

The Hub may present consulting as publicly available only after the operational launch gate is approved, including the required offer, copy, demo, delivery process, payment route and capacity constraints.

Before that gate, use truthful language such as:

- "Preparing a focused web-service offer";
- "Selected collaboration inquiries" when explicitly approved;
- or omit the dedicated consulting card.

Do not present product discovery or consulting as an active service merely because the internal system is being prepared.

## CTA hierarchy

Recommended priority:

1. Portfolio or selected evidence.
2. Résumé for recruiter contexts.
3. GitHub or public project.
4. Professional contact.
5. Secondary social profiles.
6. Consulting only when launch-ready.

Do not duplicate the same destination so heavily that the Hub stops helping the visitor choose a next action.

## Bilingual contract

English and Spanish must preserve:

- the same facts;
- the same claim status;
- the same project lifecycle and access state;
- the same confidentiality boundary;
- the same CTA intent;
- equivalent emphasis and hierarchy.

Natural adaptation is preferred over literal translation. High-stakes English copy should receive independent review when possible.

## Analytics boundary

Analytics may measure route effectiveness but must not strengthen a claim or drive invasive collection.

- Track only allow-listed actions and coarse source categories.
- Do not send names, email addresses, phone numbers, query strings, full referrers or free-form text.
- Remove obsolete events when their UI destination no longer exists, or mark them explicitly as legacy during a bounded migration.
- A conversion event proves interaction, not recruiter quality, hiring outcome or business impact.

## Review checklist

Before merging a content change:

- [ ] David remains the primary subject.
- [ ] The role is accurate and durable.
- [ ] The Hub routes rather than duplicates long-form evidence.
- [ ] Every project statement is traceable and lifecycle-aware.
- [ ] Technology emphasis matches current evidence.
- [ ] Consulting wording matches actual launch status.
- [ ] EN and ES preserve meaning and claim boundaries.
- [ ] Contact values match the canonical registry.
- [ ] No private or confidential context is exposed.
- [ ] Tests cover changed metadata, structured data, links or visible hierarchy.
- [ ] The deployed output is reviewed before cross-channel status becomes Aligned.