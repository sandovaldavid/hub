# DevContainer development environment

The DevContainer is the supported environment for running the complete validation suite from Fedora and other hosts that do not provide Playwright's Ubuntu runtime directly.

## Runtime contract

- Debian Bookworm from the official `javascript-node` Dev Container image.
- Non-root `node` user for VS Code, terminals and container processes.
- Zsh from the `common-utils` Dev Container Feature as the login and VS Code integrated terminal shell.
- Oh My Posh `29.34.0` with a repository-local prompt configuration, installed via Dockerfile.
- Bun `1.3.14`, installed via Dockerfile.
- GitHub CLI from the `github-cli` Dev Container Feature.
- Playwright `1.61.0` with Chromium installed during image build.
- Repository mounted at `/workspace`.
- `node_modules` stored in the versioned `linktree-node-modules-v1` Docker volume instead of the Fedora bind mount.

The source tree remains visible on the host, but Linux dependencies and executable links stay inside Docker. This prevents Bun from reusing `.bin` links or package artifacts created by another operating system.

## File structure

```
.devcontainer/
├── devcontainer.json           Orquestación, usuario, Features, lifecycle
├── Dockerfile                  Herramientas permanentes (Oh My Posh, Bun)
├── devcontainer-lock.json      Versiones resueltas de Features (generado)
├── scripts/
│   ├── post-create.sh          Dependencias del repositorio en primera creación
│   ├── post-start.sh           Verificaciones en cada inicio del contenedor
│   └── verify-env.sh           Validación compartida de toolchain
├── oh-my-posh.omp.json         Configuración del prompt
└── zshrc                       Configuración del shell interactivo
```

## Lifecycle

| Comando              | Cuándo se ejecuta                         | Responsabilidad                        |
| -------------------- | ----------------------------------------- | -------------------------------------- |
| `postCreateCommand`  | Una vez, después de crear el contenedor   | Instalar dependencias, preparar shell  |
| `postStartCommand`   | Cada vez que el contenedor inicia         | Verificar toolchain, reportar estado   |

## Open or rebuild the container

1. Open the Linktree repository root in VS Code.
2. Check out the branch you want to validate.
3. Confirm that `package.json` and `bun.lock` are committed and synchronized.
4. Run **Dev Containers: Rebuild Container Without Cache** after changing `.devcontainer/**`.
5. Wait for `.devcontainer/scripts/post-create.sh` to finish.
6. Confirm the terminal starts as `vscode` in `/workspace` using Zsh.

The DevContainer declares `waitFor: postCreateCommand`, so VS Code waits for the dependency installation before activating workspace TypeScript and Astro tooling. This prevents the temporary invalid `typescript.tsdk` warning that occurs when `node_modules/typescript/lib` is inspected before installation finishes.

The Dockerfile does not create or manage the development user. The `common-utils` Feature configures the existing `node` user with Zsh and sudo access. Bun and Oh My Posh are installed system-wide (`/usr/local/bin`). Chromium is installed during image build via `npx playwright install --with-deps chromium`, which eliminates the Ubuntu bind-mount incompatibility that the previous Playwright base image introduced.

## Lifecycle scripts

### post-create.sh — primera creación

- gives the non-root user ownership of the `node_modules` volume and Bun home directory;
- removes stale executable, Vite and Astro caches without deleting the volume mount point;
- runs `bun ci`, the frozen-lockfile installation command;
- adds one idempotent source line to `~/.zshrc` for the repository-managed shell configuration;
- renders the local Oh My Posh theme once to fail early on invalid configuration.

### post-start.sh — cada inicio

Executes `.devcontainer/scripts/verify-env.sh` to validate the toolchain on every container start.

### verify-env.sh — validación en cada inicio

- verifies the Bun, Playwright and Oh My Posh versions match the image;
- verifies that Chromium is available from `/ms-playwright`;
- verifies that `/usr/bin/zsh` is the login shell;
- lists Playwright browsers as a dry-run check.

The Playwright Docker image already includes the browser binaries and Ubuntu system dependencies. Do not run `bun x playwright install chromium` inside this DevContainer.

Use `bun x` for package executables. Although Bun documents `bunx` as an alias, the version installed as a single executable in this image may not expose a separate `bunx` command on `PATH`.

## Dev Container Features

Zsh and GitHub CLI are installed via Dev Container Features instead of the Dockerfile:

- `ghcr.io/devcontainers/features/common-utils:2` — installs Zsh, configures the `vscode` user, sets the login shell.
- `ghcr.io/devcontainers/features/github-cli:1` — installs the GitHub CLI.

Feature versions are pinned in `.devcontainer/devcontainer-lock.json`, which is auto-generated by VS Code and must be versioned in Git. Do not edit this file manually; update Features through the Dev Container CLI or VS Code UI.

The lockfile is excluded from Prettier formatting via `.prettierignore`.

## Lockfile synchronization

`postCreateCommand` must never repair or rewrite a lockfile. A clean environment should fail when `package.json` and `bun.lock` disagree, because silently regenerating the lockfile would make the resulting dependency graph depend on when the container was created.

After intentionally changing dependencies or overrides, regenerate and review the lockfile before rebuilding:

```bash
bun install --lockfile-only
git diff -- package.json bun.lock
bun ci
git add package.json bun.lock
git commit -m "chore(deps): update dependency lockfile"
```

When `package.json` was already committed separately, add and commit only the resulting `bun.lock`. Do not change `post-create.sh` to fall back from `bun ci` to a mutable install.

A failed `postCreateCommand` can leave partial packages in the persistent volume, and reopening the same container may skip creation lifecycle work. Therefore, a second successful attach is not evidence that a clean rebuild works. The source of truth is a synchronized committed lockfile followed by a rebuild with a fresh dependency volume.

## Zsh and Oh My Posh

Zsh is installed by the `common-utils` Dev Container Feature. Oh My Posh is pinned to the version declared in `.devcontainer/devcontainer.json` and installed in the Dockerfile. VS Code explicitly selects `/usr/bin/zsh` as its Linux terminal profile.

Interactive shell behavior is split into two repository-managed files:

- `.devcontainer/zshrc` configures history, completion and Oh My Posh initialization.
- `.devcontainer/oh-my-posh.omp.json` defines the prompt shown inside the container.

The default prompt displays the container user and host, current folder, and Git branch. It intentionally avoids private-use Nerd Font glyphs, so it renders correctly with the standard VS Code monospace fallback. A developer can still use a Nerd Font and customize the local theme later without changing the container runtime contract.

Check the installed shell and prompt versions with:

```bash
printf 'shell=%s\n' "$SHELL"
zsh --version
oh-my-posh version
oh-my-posh get shell
```

## Run the complete validation

```bash
bun run validate:local 2>&1 | tee validation-issue-27.log
```

This covers quality checks, the production build, Chromium E2E/accessibility tests, and Lighthouse mobile and desktop profiles.

## Recover from an interrupted installation

Keep the `node_modules` mount point and clear only its contents:

```bash
find node_modules -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
bash .devcontainer/scripts/post-create.sh
```

For a genuinely clean test, close the DevContainer and remove the dependency volume from the host:

```bash
docker volume rm linktree-node-modules-v1
```

Then run **Dev Containers: Rebuild Container Without Cache**. Docker volumes survive ordinary rebuilds, so rebuilding without deleting the volume does not prove installation from an empty dependency state.

If the terminal still opens Bash after pulling a DevContainer change, close the VS Code remote window and rebuild. Reopening an existing container is not enough when the Dockerfile, user, mounts or login shell change.

If the container reports the previous user or workspace, rebuild from the Linktree repository root. The expected prompt uses `vscode` and `/workspace`; a prompt such as `pwuser@...:/workspaces/portfolio-v1` belongs to a different or stale DevContainer.

## Updating pinned tooling

### Playwright

The following versions must move together:

1. `@playwright/test` and `bun.lock`.
2. `PLAYWRIGHT_VERSION` in `.devcontainer/devcontainer.json`.
3. The Playwright image tag generated by `.devcontainer/Dockerfile`.

The post-start script fails explicitly when the installed Playwright package does not match the browser image version.

### Lighthouse

The direct Lighthouse dependency, its override, the Node runtime and Playwright Chromium version must remain compatible. Any change to these fields must regenerate `bun.lock` before `bun ci` or the DevContainer lifecycle can pass.

### Oh My Posh

Update `OH_MY_POSH_VERSION` in `.devcontainer/devcontainer.json` and the matching default argument in `.devcontainer/Dockerfile`. The image build and verify-env script both check the installed version, so an incomplete update fails instead of silently using a different prompt binary.

### Features

Update Feature versions through the Dev Container CLI:

```bash
devcontainer upgrade --workspace-folder .
```

Or use the VS Code command palette: **Dev Containers: Upgrade Dev Container Features**. Then commit the updated `.devcontainer/devcontainer-lock.json`.
