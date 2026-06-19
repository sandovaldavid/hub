# 🔗 Linktree

A high-performance, accessible, and multilingual personal link tree website. Built with **Astro 6**, **Tailwind CSS v4**, **Bun**, and designed using the **Feature-Sliced Design (FSD)** architectural methodology.

> [!IMPORTANT]
> This project is designed with accessibility (WCAG 2.1 AA compliance), speed, and developer experience in mind. It includes a complete CI/CD pipeline, automated testing, and a configured DevContainer.

---

## ✨ Core Features

*   **🌐 Multilingual Support (i18n)**: English (default at `/`) and Spanish (at `/es/`) localization with zero component duplication, JSON translation files, and locale-aware SEO with `hreflang` tags.
*   **🎯 Single Source of Truth**: Easy configuration via `src/data/site.config.ts` for social links, themes, Calendly integrations, and Vercel Analytics.
*   **🌗 Advanced Theme System**: Interactive light, dark, and system theme toggle. Avoids Flash of Unstyled Content (FOUC) using a blocking head script.
*   **♿ Accessibility First (A11y)**: Fully compliant with WCAG 2.1 AA standards, featuring keyboard navigation skip links, semantic HTML, and proper focus indicators.
*   **📤 Native Web Share API**: Integration with fallback sharing mechanisms for browsers without native sharing support.
*   **📊 Performance & Quality Assured**: Continuous testing for layout, accessibility, and speed.

---

## 🛠️ Technology Stack

*   **Framework**: [Astro 6](https://astro.build/) (Static Site Generation)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS
*   **Runtime & Package Manager**: [Bun](https://bun.sh/)
*   **Testing**: [Playwright](https://playwright.dev/) & [@axe-core/playwright](https://github.com/dequelabs/axe-core)
*   **Lighthouse CI**: [@lhci/cli](https://github.com/GoogleChrome/lighthouse-ci)
*   **Linting & Formatting**: [ESLint Flat Config](https://eslint.org/) & [Prettier](https://prettier.io/)
*   **Deployment**: [Vercel](https://vercel.com/) & [GitHub Pages](https://pages.github.com/)

---

## 📐 Project Architecture

The project follows the **Feature-Sliced Design (FSD)** architectural methodology to keep components modular, scaleable, and easy to maintain.

```text
src/
├── app/                  # Application initialization (global styles, Layout)
├── data/                 # Configuration and single source of truth data files
├── entities/             # Business concepts (profile, social-link, theme, weekly-project)
├── features/             # Interactive user actions (share-button, theme-toggle)
├── pages/                # File-based routing structure (index.astro, es/index.astro)
├── shared/               # Reusable utilities, icons, and base UI components (Button, Card, Badge)
└── widgets/              # Page sections combining entities/features (social-grid, hero-section)
```

---

## 🚀 Getting Started

### Prerequisites

*   [Bun](https://bun.sh/) (latest version)
*   [Docker](https://www.docker.com/) (Optional, for DevContainer / Local E2E verification)

### Option A: Local Development

1.  **Install dependencies**:
    ```bash
    bun install
    ```
2.  **Run local dev server**:
    ```bash
    bun run dev
    ```
    Open `http://localhost:4321` in your browser.

### Option B: DevContainer (Recommended for Fedora / Linux)

Since WebKit tests require specific OS-level dependencies, a **DevContainer** configuration is provided:
1.  Open this project in VS Code.
2.  Install the *Dev Containers* extension.
3.  Click `Reopen in Container` (uses a Playwright-compatible Ubuntu Noble image with Bun and gh CLI pre-configured).

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
| `bun run test:e2e` | Runs Playwright E2E tests locally |
| `bun run test:lighthouse` | Runs Lighthouse CI audits on built files |

---

## 🧪 Testing & CI/CD Pipeline

We enforce high standards of code quality and performance via automated pipelines.

### Automated Testing

*   **E2E Testing**: Verified using Playwright. Checks routes, localization links, responsiveness, and dark-mode toggling.
*   **Accessibility Auditing**: Integrated with `@axe-core/playwright` to scan for WCAG 2.1 AA violations on every test run.
*   **Performance Auditing**: Automated via Lighthouse CI, asserting target minimum scores for SEO, Best Practices, Accessibility, and Performance.

### CI/CD Workflow

On every Pull Request to `develop` or `main`:
1.  **Check**: Runs TypeScript compilation, Prettier verification, ESLint, and Astro builds.
2.  **Test**: Runs Playwright E2E and Axe audits. Deploys the HTML test report to **GitHub Pages** and registers a PR check.
3.  **Lighthouse**: Runs audits to assert performance scores remain high.
4.  **Vercel Preview**: CLI-driven deployment to Vercel (bypassing native hooks to wait for tests). Registers a **Vercel Preview** check linked to the live preview.
5.  **Release-Please**: Automatically tracks semantic commits and generates release PRs / changelogs on merges.
