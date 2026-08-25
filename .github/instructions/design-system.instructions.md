---
applyTo: "src/**/*.{astro,css,ts,js}"
---

# Link Hub design-system instructions

Use [`AGENTS.md`](../../AGENTS.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md) and [`docs/architecture.md`](../../docs/architecture.md) as the public implementation contract.

## Required ownership order

```text
Identity Core primitive -> semantic role -> Link Hub channel alias -> component role -> component
```

- `src/shared/styles/global.css` is the only owner of shared Identity Core primitives, Light/Dark aliases and reusable component roles.
- `src/app/layouts/Layout.astro` loads the global stylesheet once.
- Component CSS that needs Tailwind utilities references the shared stylesheet with `@reference`; lower layers must not import `src/app` styles.
- Components consume `--channel-*` or component-specific roles such as `--button-*`, `--badge-*`, `--control-*`, `--card-*`, `--avatar-*` and `--status-*`.
- Do not add a second palette, primitive ramp utilities or raw identity colors inside components.
- The style-literal exception is limited to external-platform identity colors in `src/entities/social-link/ui/SocialButton.css`.
- Static browser metadata in `src/data/site.config.ts` must remain synchronized with the implemented sRGB interoperability values.

## Channel expression

- Keep David's real portrait, name, Software Engineer positioning and verified destinations primary.
- Use JetBrains Mono for display, headings and technical labels; use Inter for reading.
- Permit only restrained Link Hub shadows and effects.
- Do not introduce pixel fonts, terminal/HUD framing, phosphor green, glow, glitch or scanlines.

## Accessibility and tests

- Preserve visible focus through `--focus-ring`.
- Maintain required contrast in Light and Dark modes.
- Preserve System theme, reduced motion, high contrast and keyboard behavior.
- Validate `/` and `/es/` at desktop and mobile widths.
- Preserve non-text contrast for interactive control boundaries and states.
- Update `tests/unit/design-system.test.js` and `tests/e2e/channel-theme.spec.ts` whenever token ownership or interactive states change.

Use [`../../docs/accessibility/manual-checklist.md`](../../docs/accessibility/manual-checklist.md) for manual release-oriented checks when a change affects color, focus, motion, layout or interactive controls.
