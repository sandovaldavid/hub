#!/usr/bin/env bash
set -Eeuo pipefail

readonly workspace="${CONTAINER_WORKSPACE_FOLDER:-/workspace}"
readonly deps="${workspace}/node_modules"
readonly bun_home="${HOME}/.bun"
readonly owner="$(id -u):$(id -g)"
readonly managed_zsh_line='[[ -r /workspace/.devcontainer/zshrc ]] && source /workspace/.devcontainer/zshrc'

cd "${workspace}"

if [[ ! -f package.json || ! -f bun.lock ]]; then
	echo "[error] Expected package.json and bun.lock in ${workspace}" >&2
	exit 1
fi

# Named volumes are initially mounted as root. Repair only the generated dependency/cache
# directories and never broaden permissions on the bind-mounted repository.
sudo mkdir -p "${deps}" "${bun_home}"
sudo chown -R "${owner}" "${deps}" "${bun_home}"

# Preserve the volume mount itself while removing generated state that can become stale
# across interrupted installs or toolchain upgrades.
rm -rf "${deps}/.bin" "${deps}/.vite" "${deps}/.vite-temp" "${workspace}/.astro"

# bun ci is equivalent to bun install --frozen-lockfile and intentionally fails when
# package.json and bun.lock disagree. Update and commit bun.lock outside this lifecycle.
bun ci

installed_bun_version="$(bun --version)"
if [[ "${installed_bun_version}" != "${BUN_VERSION}" ]]; then
	echo "[error] Bun ${installed_bun_version} does not match the container version ${BUN_VERSION}" >&2
	exit 1
fi

installed_playwright_version="$(bun x playwright --version | awk '{print $2}')"
if [[ "${installed_playwright_version}" != "${PLAYWRIGHT_VERSION}" ]]; then
	echo "[error] Playwright ${installed_playwright_version} does not match the image version ${PLAYWRIGHT_VERSION}" >&2
	exit 1
fi

if ! find "${PLAYWRIGHT_BROWSERS_PATH}" -maxdepth 1 -type d -name 'chromium-*' -print -quit | grep -q .; then
	echo "[error] The Playwright image does not contain Chromium under ${PLAYWRIGHT_BROWSERS_PATH}" >&2
	exit 1
fi

installed_posh_version="$(oh-my-posh version)"
if [[ "${installed_posh_version}" != "${OH_MY_POSH_VERSION}" ]]; then
	echo "[error] Oh My Posh ${installed_posh_version} does not match the container version ${OH_MY_POSH_VERSION}" >&2
	exit 1
fi

if [[ "$(getent passwd "$(id -un)" | cut -d: -f7)" != "/usr/bin/zsh" ]]; then
	echo "[error] The DevContainer user does not use /usr/bin/zsh as its login shell" >&2
	exit 1
fi

if [[ ! -f "${HOME}/.zshrc" ]]; then
	touch "${HOME}/.zshrc"
fi

if ! grep -Fqx "${managed_zsh_line}" "${HOME}/.zshrc"; then
	{
		echo
		echo '# Linktree DevContainer shell configuration'
		echo "${managed_zsh_line}"
	} >> "${HOME}/.zshrc"
fi

bun x playwright install --list
oh-my-posh print primary --config "${workspace}/.devcontainer/oh-my-posh.omp.json" --shell uni >/dev/null

printf '[info] DevContainer ready with Bun %s, Playwright %s, Zsh %s and Oh My Posh %s\n' \
	"${installed_bun_version}" \
	"${installed_playwright_version}" \
	"$(zsh --version | awk '{print $2}')" \
	"${installed_posh_version}"
