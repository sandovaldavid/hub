# Changelog

## [0.1.0-beta.0](https://github.com/sandovaldavid/linktree/compare/v0.0.1-beta.0...v0.1.0-beta.0) (2026-06-19)


### Features

* **devcontainer:** add devcontainer with Playwright, Bun, and gh CLI ([1dd5f31](https://github.com/sandovaldavid/linktree/commit/1dd5f314e2c7e56bedebeb4011e33f58a4f25fa9))
* **i18n:** add English/Spanish support with Astro routing and locale-aware SEO ([2af4f51](https://github.com/sandovaldavid/linktree/commit/2af4f51cd63787e7e63489011d3884a431282759))
* **lint:** add ESLint with Astro, TypeScript, and jsx-a11y plugins ([34cf570](https://github.com/sandovaldavid/linktree/commit/34cf570031aa8cad0ee3f030c6f7149040e255c9))


### Bug Fixes

* **a11y:** remove axe oklch workaround and fix real contrast violations ([1e7605f](https://github.com/sandovaldavid/linktree/commit/1e7605f530e829ab682f35538aad51835df03950))
* **ci:** add continue-on-error: true to gh-pages deployment steps to prevent PR write-token restriction failures ([5e96fa1](https://github.com/sandovaldavid/linktree/commit/5e96fa1b46f0f99026fccf8904808943432778fb))
* **ci:** resolve workflow failures for deploy, lighthouse, and webkit ([d1b01be](https://github.com/sandovaldavid/linktree/commit/d1b01be2cd31841e0b45b029f75f8f1042ab9ebc))
* **ci:** stabilize axe and Lighthouse tests in CI environment ([3155547](https://github.com/sandovaldavid/linktree/commit/3155547b4e3218b709151355d8ccc310d661e019))
* **layout:** remove base href which was breaking local testing and vercel previews ([c0ccf49](https://github.com/sandovaldavid/linktree/commit/c0ccf49f03f82bc4c50b5cb5ad4b5ea1361f960c))
* **lint:** resolve ESLint errors across widget and feature components ([11d54a5](https://github.com/sandovaldavid/linktree/commit/11d54a596633f4d59b22a17aece1ffcf53d2d666))
* **release:** separate config and manifest for develop (beta) and main (stable) versioning ([2939691](https://github.com/sandovaldavid/linktree/commit/2939691de566d4762c340bfa3a63da12f70593ca))
* **release:** use branch-specific release-please-config.json for prerelease versioning ([86d5feb](https://github.com/sandovaldavid/linktree/commit/86d5feb243489d4812f31b593ec0a95dce712d6b))
* rename React.svg to react.svg for case-sensitive filesystem compatibility ([9e6fb72](https://github.com/sandovaldavid/linktree/commit/9e6fb72cf1a97a0bd42201fb564fa6cf79feace5))
* **tests:** correct E2E test selectors and attribute assertions ([542188e](https://github.com/sandovaldavid/linktree/commit/542188ef1e71a6dfae6a817b95d29540ca4f4994))
* **types:** resolve pre-existing TypeScript errors blocking CI ([c2a6312](https://github.com/sandovaldavid/linktree/commit/c2a6312d2a4e5ec5f8f3f6d91f0f317c46a6ef0e))


### Refactoring

* **brand:** rename devsandoval to sandovaldavid with single source of truth ([2e1d2f6](https://github.com/sandovaldavid/linktree/commit/2e1d2f674bea245cdd922653bcea7e5da3716b59))
* **data:** centralize site config and remove hardcoded values ([3e3519e](https://github.com/sandovaldavid/linktree/commit/3e3519ec648281b3a0d3207a56ff6efea55c0551))


### CI/CD

* add devcontainer image build and push to GHCR ([40c6220](https://github.com/sandovaldavid/linktree/commit/40c6220e6c16bf21088235a608cadbff2f26a0f2))
* add GitHub Actions workflows for CI/CD, branch protection, and release automation ([a19fa6c](https://github.com/sandovaldavid/linktree/commit/a19fa6c8c04f1da1ee9e66d39d5fde68ede49a46))
* add vercel.json to disable auto-deploy and add security headers ([5aeea43](https://github.com/sandovaldavid/linktree/commit/5aeea435de51014b3551bb61b97f8a71afebedf5))
* deploy test reports to github pages and track vercel deployments ([03c7381](https://github.com/sandovaldavid/linktree/commit/03c73817c716f101cfc89e183c3f38791eff5d09))
* **release:** initialize prerelease chain and fix tag naming ([f068192](https://github.com/sandovaldavid/linktree/commit/f068192b7782fcdc3d7c246e35ba4af85461d4a8))
* **release:** remove release-type input to enable manifest mode ([54a007b](https://github.com/sandovaldavid/linktree/commit/54a007b155cc5c9a9cb4e319c9c586967e71a296))
* **release:** split stable/beta jobs and enforce conventional commits ([b77197a](https://github.com/sandovaldavid/linktree/commit/b77197a162a2308572302074214b1579b60d33ad))
* **release:** switch to node release-type for proper prerelease support ([8b13960](https://github.com/sandovaldavid/linktree/commit/8b1396040253f8d3e878b6c94f1fcf73cb8149fd))


### Documentation

* update README.md with comprehensive project documentation and FSD architecture details ([ca92794](https://github.com/sandovaldavid/linktree/commit/ca92794ea3eea5fd30f9d970e3c434813dc7785b))


### Styles

* apply Prettier formatting to devcontainer.json ([2555968](https://github.com/sandovaldavid/linktree/commit/255596823de85592cf56d4c7792c7e62c4107c5d))
* apply prettier formatting to github workflows ([eb0625f](https://github.com/sandovaldavid/linktree/commit/eb0625fcec61c7aee13afe8a86c0a0a426a18e52))
* apply Prettier formatting to pages and vercel.json ([87adb2c](https://github.com/sandovaldavid/linktree/commit/87adb2c31e5158bb8975c465457453a29221221d))
* apply Prettier formatting to playwright.config.ts ([ae37083](https://github.com/sandovaldavid/linktree/commit/ae37083db0f06d8a998108a3da0181a8cf9fac6d))

## Changelog

All notable changes to this project will be documented in this file.

Maintained automatically by [release-please](https://github.com/googleapis/release-please).
