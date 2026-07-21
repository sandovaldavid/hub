# 🔗 Linktree

A high-performance, accessible, and multilingual personal link tree website. Built with **Astro 6**, **Tailwind CSS v4**, and **Bun**, using a pragmatic component architecture sized for a small static product.

> [!IMPORTANT]
> This project is designed with accessibility (WCAG 2.1 AA compliance), speed, and developer experience in mind. It includes a complete CI/CD pipeline, automated testing, and a configured DevContainer.

---

## ✨ Core Features

* **🌐 Multilingual Support (i18n)**: English (default at `/`) and Spanish (at `/es/`) localization with zero component duplication, JSON translation files, and locale-aware SEO with `hreflang` tags.
* **🎯 Single Source of Truth**: Easy configuration via `src/data/site.config.ts` for social links, themes, Calendly integrations, and Vercel Analytics.
* **🌗 Advanced Theme System**: Interactive light, dark, and system theme toggle. Avoids Flash of Unstyled Content (FOUC) using a blocking head script.
* **♿ Accessibility First (A11y)**: Fully compliant with WCAG 2.1 AA standards, featuring keyboard navigation skip links, semantic HTML, and proper focus indicators.
* **📤 Native Web Share API**: Integration with fallback sharing mechanisms for browsers without native sharing support.
* **📊 Performance & Quality Assured**: Continuous testing for layout, accessibility, and speed.

---

## 🛠️ Technology Stack

* **Framework**: [Astro 6](https://astro.build/) (Static Site Generation)
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS
* **Runtime & Package Manager**: [Bun](https://bun.sh/)
* **Testing**: [Playwright](https://playwright.dev/) & [@axe-core/playwright](https://github.com/dequelabs/axe-core)
* **Lighthouse CI**: [@lhci/cli](https://github.com/GoogleChrome/lighthouse-ci)
* **Linting & Formatting**: [ESLint Flat Config](https://eslint.org/) & [Prettier](https://prettier.io/)
* **Deployment**: [Vercel](https://vercel.com/) & [GitHub Pages](https://pages.github.com/)

---

## 📐 Project Architecture

The repository uses shallow, explicit boundaries instead of a full Feature-Sliced Design public API for every folder. Concrete modules are imported directly so contributors can find implementations without traversing single-export barrels.

```text
src/
├── app/                  # Global layout, application styles and page-level models
├── data/                 # Typed content, URLs and configuration
├── entities/             # Reusable product concepts with multiple consumers
├── features/             # Interactive user actions
├── pages/                # Astro routes and page composition
├── shared/               # Reusable UI, assets, utilities, i18n and analytics
└── widgets/              # Page sections that compose multiple modules
scripts/                  # Repository validation and maintenance commands
```

Architecture rules, dependency direction, placement criteria and trade-offs are documented in [`docs/architecture.md`](docs/architecture.md). Run `bun run check:architecture` to reject circular imports and unnecessary FSD barrel imports.

---

## 🚀 Getting Started

### Prerequisites

* [Bun 1.3.14](https://bun.sh/), matching the `packageManager` declaration
* [Docker](https://www.docker.com/) (Optional, for DevContainer / Local E2E verification)

### Option A: Local Development

1. **Install dependencies**:
   ```bash
   bun install --frozen-lockfile
   ```
2. **Run local dev server**:
   ```bash
   bun run dev
   ```
   Open `http://localhost:4321` in your browser.

### Option B: DevContainer (Recommended for Fedora / Linux)

Since WebKit tests require specific OS-level dependencies, a **DevContainer** configuration is provided:
1. Open this project in VS Code.
2. Install the *Dev Containers* extension.
3. Click `Reopen in Container` (uses a Playwright-compatible Ubuntu Noble image with Bun and gh CLI pre-configured).

---

## 🧞 Available Commands

All commands are executed from the project root:

| Command | Action |
| :--- | :--- |
| `bun run dev` | Starts the Astro development server at `localhost:4321` |
| `bun run build` | Builds the static website to the `./dist/` directory |
| `bun run preview` | Previews the production build locally at `localhost:4321` |
| `bun run format` | Formats all workspace files using Prettier |
| `bun run format:check` | Verifies formatting rules without modifying files |
| `bun run lint` | Runs ESLint analysis for code quality |
| `bun run check:architecture` | Rejects circular imports and unnecessary layer barrels |
| `bun run test:unit` | Runs Bun unit tests |
| `bun run test:e2e` | Runs the local Playwright browser matrix |
| `bun run test:lighthouse` | Runs mobile and desktop Lighthouse CI audits on built files |
| `bun run validate:quality` | Runs the complete quality and build gate |
| `bun run validate:local` | Runs the CI-equivalent quality, E2E and Lighthouse sequence |

---

## ⚡ Performance Budget

The production pages use system font stacks, optimized SVG/WebP assets, explicit image dimensions, and automated Lighthouse budgets for `/` and `/es/`.

The mobile and desktop profiles enforce accessibility ≥ 0.95, best practices ≥ 0.90 and SEO ≥ 0.90. Performance ≥ 0.80 remains advisory because shared CI runners are variable. The complete rationale and update policy are documented in [`docs/performance-budget.md`](docs/performance-budget.md).

---

## 🧪 Testing & CI/CD Pipeline

We enforce high standards of code quality and performance via automated pipelines.

### Automated Testing

* **Architecture Validation**: Detects circular imports and direct dependencies on unnecessary barrels.
* **E2E Testing**: Verified using Playwright. Checks routes, localization links, responsiveness, and dark-mode toggling.
* **Accessibility Auditing**: Integrated with `@axe-core/playwright` to scan for WCAG 2.1 AA violations on every test run.
* **Performance Auditing**: Automated via Lighthouse CI for both mobile and desktop profiles.

### CI/CD Workflow

On every pull request to `develop` or `main`:

1. **`CI / Quality`**: Runs type checking, architecture validation, Prettier, ESLint, unit tests and one Astro production build.
2. **`CI / E2E`**: Reuses the production build for Playwright and Axe coverage, preserving generated reports on failures.
3. **`CI / Lighthouse`**: Reuses the production build for mobile and desktop audits.
4. **`CI / Playwright report availability`**: Publishes the HTML report when it exists; this is informational and does not represent the E2E outcome.
5. **Vercel Preview**: Deploys the `develop` branch through the dedicated CD workflow.
6. **Release-Please**: Tracks semantic commits and generates release PRs and changelogs on merges.

The stable check contract, artifact flow and exact local fallback are documented in [`docs/ci-validation.md`](docs/ci-validation.md).
