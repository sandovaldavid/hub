#!/usr/bin/env bash
set -Eeuo pipefail

readonly workspace="${CONTAINER_WORKSPACE_FOLDER:-/workspace}"
readonly deps="${workspace}/node_modules"
readonly owner="$(id -u):$(id -g)"
readonly expected_bun_version="${BUN_VERSION:-1.3.14}"

export REPOSITORY_ROOT="${workspace}"
cd "${workspace}"

if [[ ! -f package.json || ! -f bun.lock ]]; then
	echo "[error] Expected package.json and bun.lock in ${workspace}" >&2
	exit 1
fi

actual_bun_version="$(bun --version)"
if [[ "${actual_bun_version}" != "${expected_bun_version}" ]]; then
	echo "[error] Unsupported Bun version: ${actual_bun_version}. Expected ${expected_bun_version}." >&2
	exit 1
fi

sudo mkdir -p "${deps}"
sudo chown -R "${owner}" "${deps}"

rm -rf "${deps}/.bin" "${deps}/.vite" "${deps}/.vite-temp" "${workspace}/.astro"

bash .devcontainer/scripts/configure-shell.sh
bash .devcontainer/scripts/configure-git-ssh-signing.sh
bun ci

printf '[info] Linktree DevContainer ready with Bun %s\n' "${actual_bun_version}"
