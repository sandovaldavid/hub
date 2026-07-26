---
applyTo: "src/**/*.{astro,css,ts,js}"
---

# Link Hub design-system instructions

Treat [`docs/design-system.md`](../../docs/design-system.md) and [`CONTRIBUTING.md`](../../CONTRIBUTING.md) as the current visual implementation contract. Generic examples in older instruction files do not override this channel-specific contract.

## Required ownership order

```text
Identity Core primitive -> semantic role -> Link Hub channel alias -> component role -> component
```

- `src/app/styles/global.css` is the only owner of Identity Core primitives, Light/Dark aliases and shared component roles.
- Canonical web primitives use the exact OKLCH values documented in Figma `03 — Color System`.
- HEX is an interoperability reference only; do not reconvert it or generate a local ramp.
- Components consume `--channel-*` or component-specific variables such as `--button-*`, `--badge-*`, `--control-*`, `--card-*`, `--avatar-*` and `--status-*`.
- Do not add primitive ramp utilities to components.
- Do not create a second palette or use raw color literals for identity-critical behavior.
- The only style-literal exception is the documented external-platform identity block in `src/entities/social-link/ui/SocialButton.css`.
- Static browser metadata in `src/data/site.config.ts` must remain synchronized with the HEX reference for `color/primary/500-light`.

## Channel expression

- Keep David's portrait, name, professional context and verified destinations primary.
- Use JetBrains Mono for display, headings and technical labels; use Inter for reading.
- Permit only `Retro XS–SM` hard-offset shadows.
- Do not introduce pixel fonts, terminal/HUD framing, phosphor green, glow, glitch or scanlines.
- Resolve online status through the approved success primitives, never the Portfolio Retro phosphor primitive.

## Accessibility and tests

- Preserve visible focus through `--focus-ring`.
- Maintain WCAG AA contrast in Light and Dark Mode.
- Preserve reduced-motion, high-contrast and keyboard behavior.
- Validate both `/` and `/es/` at desktop and mobile widths.
- Update `tests/unit/design-system.test.js` and `tests/e2e/channel-theme.spec.ts` whenever the token contract or interactive states change.
