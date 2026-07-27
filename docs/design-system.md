# Link Hub Compact design system

## Source authority

The visual contract uses three sources with distinct responsibilities:

1. **Figma `sandovaldavid / Identity System`** defines designed intent. The canonical pages are `03 — Color System` and `05B — Channel Themes`.
2. **This repository** defines implemented behavior, generated Tailwind utilities, component state ownership and executable regression coverage.
3. **Cortex-L7** stores rationale, alternatives, durable decisions and implementation handoffs.

A code value that diverges from Figma must be treated as an implementation discrepancy, not as a silent redesign. A Figma proposal that is not present in the repository is not production behavior.

## Channel purpose

`Link Hub Compact` is a human-first profile and navigation surface. David's portrait, name, professional context and verified destinations remain the primary hierarchy. The channel may use Inter for reading, JetBrains Mono selectively and only `Retro XS–SM` as a limited interaction accent.

The following Portfolio Retro expressions are prohibited here:

- pixel display typography;
- terminal or HUD composition;
- phosphor green;
- glow, glitch or scanline effects;
- `Retro MD` or larger hard-offset shadows.

## Color authoring policy

The Identity Core uses this contract:

```text
Canonical web authoring: OKLCH
Figma working representation: native sRGB
Export and interoperability reference: HEX / sRGB
Target gamut: sRGB
Semantic, channel and component consumption: aliases
```

`src/app/styles/global.css` copies the approved OKLCH values recorded in the Figma primitive descriptions. Do not convert the HEX references again in this repository and do not generate a visually similar local ramp.

The approved synchronization flow is:

```text
Figma Identity Core primitive
  ↓ exact documented OKLCH value
Shared semantic role
  ↓
Link Hub Light/Dark channel alias
  ↓
Component role
  ↓
Component
```

## Token ownership

### Identity Core primitives

The implementation uses the same names and source split documented in Figma:

```text
color/primary/50…950
color/primary/400-light
color/primary/400-dark
color/primary/500-light
color/primary/500-dark
color/primary/600-light
color/primary/600-dark
color/neutral/50…950
color/success/500, 900
color/warning/500, 900
color/error/500, 900
color/base/*
alpha/*
```

Primary steps `400`, `500` and `600` also expose `light-dark()` semantic values. Link Hub channel modes alias the explicit Light or Dark primitive, matching the Figma `Channel / Theme` collection.

The Link Hub must not create another primary, accent, neutral or status ramp. OKLCH is the canonical serialization of the shared primitives; it is not a repository-owned palette.

### Channel aliases

The Light and Dark contracts expose:

```text
channel/background/canvas
channel/surface/default
channel/surface/highlight
channel/content/strong
channel/content/default
channel/content/muted
channel/edge/default
channel/accent/primary
channel/accent/secondary
channel/status/online
channel/font/display
channel/font/heading
channel/font/body
channel/font/technical
```

CSS uses the equivalent `--channel-*` names. Tailwind utilities are generated through `--color-channel-*` and `--font-*` theme entries.

For Link Hub:

```text
accent/primary    → primary/500-light | primary/500-dark
accent/secondary  → primary/400-light | primary/400-dark
display/heading   → JetBrains Mono
body              → Inter
```

### Online status precedence

The Figma `Link Hub Compact` profile explicitly says **no phosphor**. The current generic `Channel / Theme` variable for Dark online status still points to the Portfolio Retro phosphor primitive.

The repository follows the more specific Link Hub guardrail:

```text
Light online → color/base/status-success-text-light
Dark online  → color/base/status-success-text-dark
```

This is a documented Figma inconsistency, not permission to introduce a repository-specific green. The Figma `channel/status/online` Dark alias should be corrected separately so design and code resolve to the same success primitive.

### Component roles

Interactive behavior must not encode palette steps. Buttons, badges, focus rings, controls, cards, avatar fallbacks and online states use explicit roles such as:

```text
--button-primary-background
--button-primary-background-hover
--button-primary-content
--focus-ring
--badge-brand-background
--badge-brand-content
--control-background
--control-edge
--card-background
--card-edge
```

Use a channel alias when meaning is shared across the Link Hub. Add a component role when a state has component-specific behavior. Do not add a primitive to solve a component state.

When Figma does not define a dedicated alpha primitive, component roles derive translucency with `color-mix(in oklch, var(--approved-primitive), transparent)` instead of duplicating OKLCH coordinates or creating another ramp.

## Scoped literal exceptions

Raw style color literals outside `global.css` are rejected by unit tests except for official external-platform colors in:

```text
src/entities/social-link/ui/SocialButton.css
```

Those values represent Instagram, Facebook, LinkedIn, YouTube and TikTok identities. They must not be reused for David's brand, general surfaces, typography, focus or status behavior. GitHub, X and Medium monochrome treatments reuse the shared neutral primitives instead of duplicating them.

`src/data/site.config.ts` also contains the static browser `themeColor` metadata value. HTML metadata cannot consume a runtime CSS custom property, so the value is intentionally duplicated as the approved sRGB/HEX reference for `color/primary/500-light`. This is a synchronization exception, not a second design token.

## Browser chrome assets

The browser favicon follows the effective Light or Dark theme, including a
manual preference that overrides the system preference. The two public favicon
files mirror the approved logo files byte-for-byte because browsers require
standalone public resources:

```text
public/logo/sandovaldavid.svg       → public/favicon.dark.svg
public/logo/sandovaldavid.light.svg → public/favicon.light.svg
```

The unit contract in `tests/unit/theme.test.js` rejects drift between each logo
and its favicon. Update the matching favicon whenever an approved logo changes.
`Layout.astro` renders one stable `#site-favicon` link with the Dark asset as a
no-JavaScript fallback. The early theme script selects the effective asset
before interaction, and `ThemeManager` plus the `theme-change` event keep it
synchronized after toggles and system preference changes.

The static `theme-color` metadata remains a separate contract. HTML metadata
cannot consume the runtime CSS custom property, so it continues to use the
approved Light primary color rather than duplicating favicon behavior.

## Accessibility contract

- Normal text and primary action states must meet WCAG AA `4.5:1` contrast in Light and Dark Mode.
- Focus indicators resolve through `--focus-ring` and remain visible in both modes.
- `prefers-reduced-motion: reduce` behavior remains global and unchanged.
- High-contrast mode strengthens focus and edge visibility.
- English `/` and Spanish `/es/` must preserve the same hierarchy and token behavior.

The unit suite calculates contrast for canvas content, muted content, accents, focus and primary button default/hover states. It compares canonical OKLCH values numerically so formatter removal of insignificant trailing zeros cannot invalidate the design contract. Playwright validates computed tokens, visible identity hierarchy, focus, primary button contrast, overflow and representative desktop/mobile screenshots.

## Visual evidence

The Playwright test `tests/e2e/channel-theme.spec.ts` attaches `after-*` screenshots for:

- English and Spanish;
- Light and Dark Mode;
- `1440×1000` desktop and `390×844` mobile viewports.

To capture the deployed pre-migration surface in the same report, provide a baseline origin:

```bash
BASELINE_URL=https://<deployed-link-hub-origin> CI=1 bun run test:e2e --grep "Link Hub Compact channel theme"
```

The report then includes matching `before-*` and `after-*` attachments. A missing baseline URL does not fabricate before evidence; it only captures the local implementation.

## Validation

Run the repository commands, not ad hoc substitutes:

```bash
bun x astro check
bun run check:architecture
bun run format:check
bun run lint
bun run check:links
bun run test:unit
bun run build
CI=1 bun run test:e2e
bun run test:lighthouse
bun run validate:local
```

A missing, skipped, quota-blocked or disabled GitHub Actions run is not a successful validation. Record exact local results when hosted checks cannot execute.
