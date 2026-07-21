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

sudo mkdir -p "${deps}" "${bun_home}"
sudo chown -R "${owner}" "${deps}" "${bun_home}"

rm -rf "${deps}/.bin" "${deps}/.vite" "${deps}/.vite-temp" "${workspace}/.astro"

bun ci

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
