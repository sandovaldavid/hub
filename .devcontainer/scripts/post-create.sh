#!/usr/bin/env bash
set -Eeuo pipefail

readonly workspace="${CONTAINER_WORKSPACE_FOLDER:-/workspace}"
readonly deps="${workspace}/node_modules"
readonly owner="$(id -u):$(id -g)"
readonly managed_zsh_line='[[ -r /workspace/.devcontainer/zshrc ]] && source /workspace/.devcontainer/zshrc'

cd "${workspace}"

if [[ ! -f package.json || ! -f bun.lock ]]; then
	echo "[error] Expected package.json and bun.lock in ${workspace}" >&2
	exit 1
fi

sudo mkdir -p "${deps}"
sudo chown -R "${owner}" "${deps}"

rm -rf "${deps}/.bin" "${deps}/.vite" "${deps}/.vite-temp" "${workspace}/.astro"

bun ci

sudo chsh -s /usr/bin/zsh "$(id -un)"

mkdir -p "$HOME/.config/git"
if ssh-add -L >/dev/null 2>&1; then
    email="$(git config --global --get user.email || echo 'dev@example.com')"
    ssh-add -L 2>/dev/null | while read -r key; do
        echo "$email namespaces=\"git\" $key"
    done > "$HOME/.config/git/allowed_signers"
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

oh-my-posh print primary --config "${workspace}/.devcontainer/oh-my-posh.omp.json" --shell uni >/dev/null

printf '[info] DevContainer ready\n'
