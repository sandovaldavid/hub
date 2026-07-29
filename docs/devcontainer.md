# DevContainer development environment

The DevContainer is the supported environment for running the complete validation suite from Fedora and other hosts that do not provide Playwright's Linux browser runtime directly.

## Runtime contract

- Debian Trixie from the official Node/TypeScript Dev Container image.
- Node.js 24 through the `24-trixie` image variant.
- Non-root `node` user for VS Code, terminals and lifecycle commands.
- Bun `1.3.14`, installed in `/home/node/.bun` during the image build.
- Playwright `1.61.0` with Chromium and WebKit installed in `/ms-playwright` during the image build.
- Zsh from the pinned `common-utils` Dev Container Feature.
- GitHub CLI from the pinned `github-cli` Feature.
- Starship `1.26.0`, eza `0.23.5` and pinned Zsh plugins installed by the repository lifecycle script.
- Repository mounted at `/workspace`.
- Linux `node_modules` stored in the named `hub-node-modules-v1` volume.
- Zsh history stored in a separate volume scoped to the workspace name.

The source tree remains visible on the host, while Linux dependencies and executable links stay inside Docker. This prevents Bun from reusing `.bin` links or package artifacts created by another operating system.

## File ownership and Fedora

The workspace is bind-mounted at `/workspace`. On Linux, `updateRemoteUserUID: true` aligns the container's `node` user with the host UID and GID so files normally remain editable from both environments.

The container also uses:

```text
--security-opt label=disable
--ipc=host
```

The SELinux option avoids mislabeled bind-mount access on Fedora. The shared IPC namespace follows Playwright's recommendation for Chromium stability.

`remoteUser: node` applies to VS Code and lifecycle commands. It does not change the user for an arbitrary `docker exec`; pass `-u node` when executing commands manually that way.

Files created as `root` are an exception. `post-start.sh` restores ownership of `playwright-report/` and `test-results/` before Playwright writes its output. It also fails when the bind-mounted workspace UID/GID no longer matches the remote user.

## File structure

```text
.devcontainer/
├── Dockerfile
├── devcontainer.json
├── devcontainer-lock.json
├── config/
│   ├── shell.bash
│   ├── shell.zsh
│   └── starship.toml
└── scripts/
    ├── configure-git-ssh-signing.sh
    ├── configure-shell.sh
    ├── post-create.sh
    ├── post-start.sh
    └── verify-env.sh
```

Responsibilities:

- `Dockerfile` installs Bun and the pinned Playwright browsers into the image.
- `devcontainer.json` defines users, mounts, ports, Features and lifecycle commands.
- `devcontainer-lock.json` records the resolved Feature digests.
- `config/` contains the repository-managed Bash, Zsh and Starship configuration.
- `configure-shell.sh` installs pinned shell tools and plugins with checksums.
- `configure-git-ssh-signing.sh` configures an allowed signers file from the forwarded SSH agent without copying a private key.
- `post-create.sh` prepares the shell and performs the frozen dependency installation.
- `post-start.sh` checks ownership, repairs report directories and verifies the toolchain.

## Lifecycle

| Command | When it runs | Responsibility |
| --- | --- | --- |
| `postCreateCommand` | Once after container creation | Configure shell/signing, clean caches and run `bun ci` |
| `postStartCommand` | Every container start | Verify ownership, report directories and pinned tooling |

`waitFor: postCreateCommand` prevents VS Code from activating Astro and workspace TypeScript before dependencies exist.

## Open or rebuild the container

1. Open the Hub repository root in VS Code.
2. Check out the branch you intend to validate.
3. Confirm `package.json` and `bun.lock` are committed and synchronized.
4. Run **Dev Containers: Rebuild Container Without Cache** after changing `.devcontainer/**`.
5. Wait for `.devcontainer/scripts/post-create.sh` to finish.
6. Confirm the terminal opens as `node` in `/workspace` using Zsh.
7. Run the complete local gate before approving the branch.

The first build downloads browser packages and shell tools, so it takes longer than later starts.

## Frozen dependency installation

`postCreateCommand` must never repair or rewrite `bun.lock`. It runs:

```bash
bun ci
```

A clean environment must fail when `package.json` and `bun.lock` disagree. After intentionally changing dependencies or overrides:

```bash
bun install --lockfile-only
git diff -- package.json bun.lock
bun ci
git add package.json bun.lock
git commit -m "chore(deps): update dependency lockfile"
```

Do not add a mutable-install fallback to `post-create.sh`.

## Shell tooling

`configure-shell.sh` installs these pinned tools for the non-root user:

- Starship `1.26.0`;
- eza `0.23.5`;
- zsh-autosuggestions `0.7.1`;
- zsh-syntax-highlighting `0.8.0`;
- zsh-completions `0.36.0`;
- zsh-history-substring-search `1.1.0`.

Downloaded archives are verified with SHA-256 checksums. The script replaces one managed block in `~/.zshrc` and `~/.bashrc`, so rerunning it does not duplicate configuration.

The Starship theme uses Nerd Font symbols. Missing icons affect presentation only; they do not change the validation or runtime contract. Select a Nerd Font in the host VS Code terminal settings when those symbols should render.

Check installed versions with:

```bash
zsh --version
starship --version
eza --version
bun --version
bun x playwright --version
```

## Git and SSH signing

The Dev Containers extension forwards the host SSH agent. `configure-git-ssh-signing.sh` reads the inherited inline SSH public signing key and writes only the matching public key to:

```text
~/.config/git/allowed_signers
```

The script never copies or stores a private key. If the agent or Git identity is unavailable, it emits a warning and leaves the rest of container setup usable.

Verify the inherited identity with:

```bash
git config --show-origin --get user.name
git config --show-origin --get user.email
git config --show-origin --get user.signingKey
ssh-add -L
```

## Browser and report ports

The container forwards:

- `4321` for Astro development and preview;
- `9323` for the Playwright HTML report.

Start the application with:

```bash
bun run dev
```

Expose an existing Playwright report with:

```bash
bun run test:e2e:show-report
```

Both commands bind to `0.0.0.0` inside the container. VS Code forwards them to the corresponding local ports.

## Environment verification

Every container start verifies:

- Bun matches the build argument;
- the installed Playwright package matches the image version;
- Chromium and WebKit exist under `/ms-playwright`;
- Starship and eza match their pinned versions;
- Zsh is the login shell;
- the workspace and generated report directories are writable by `node`.

Do not run a separate `playwright install` command inside the container. Browser installation belongs to the image build.

Use `bun x` for package executables. The standalone `bunx` alias is not part of the repository contract.

## Complete local validation

Run:

```bash
bun run validate:local 2>&1 | tee validation-local.log
```

This executes quality checks, the production build, Playwright functional/Axe coverage and Lighthouse mobile/desktop profiles.

When GitHub Actions is unavailable, attach the command output to the PR. A skipped, disabled or quota-blocked workflow is not successful validation.

## Recover from an interrupted setup

Clear only the contents of the mounted dependency directory:

```bash
find node_modules -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
bash .devcontainer/scripts/post-create.sh
```

For a genuinely clean test, close the DevContainer and remove both persistent volumes from the host:

```bash
docker volume rm hub-node-modules-v1
docker volume rm devcontainer-hub-zsh-history
```

The history volume name may differ when the local workspace folder has another name. List matching volumes first:

```bash
docker volume ls --filter name=devcontainer- --filter name=zsh-history
```

Then run **Dev Containers: Rebuild Container Without Cache**. Rebuilding without deleting the dependency volume does not prove installation from an empty state.

## Updating pinned tooling

### Bun

Update together:

1. `BUN_VERSION` in `.devcontainer/devcontainer.json`;
2. the Dockerfile default argument;
3. `packageManager` in `package.json`;
4. contract tests and documentation;
5. `bun.lock` when dependency resolution changes.

### Playwright

Update together:

1. `@playwright/test` and `bun.lock`;
2. `PLAYWRIGHT_VERSION` in `.devcontainer/devcontainer.json`;
3. the Dockerfile build argument;
4. Lighthouse/Chromium compatibility assumptions;
5. tests and documentation.

### Starship, eza and Zsh plugins

Update the pinned versions and checksums in `.devcontainer/scripts/configure-shell.sh`, then rebuild from an empty user tool cache or remove the corresponding `~/.local` directories inside the container before verifying.

### Dev Container Features

Run:

```bash
devcontainer upgrade --workspace-folder .
```

Alternatively use **Dev Containers: Upgrade Dev Container Features** in VS Code. Commit the updated `.devcontainer/devcontainer-lock.json`; do not edit resolved digests manually.
