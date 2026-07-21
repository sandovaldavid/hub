#!/usr/bin/env bash
set -Eeuo pipefail

readonly workspace="${CONTAINER_WORKSPACE_FOLDER:-/workspace}"
cd "${workspace}"

if [[ ! -f package.json || ! -f bun.lock ]]; then
	echo "[error] Expected package.json and bun.lock in ${workspace}" >&2
	exit 1
fi

# The named volume is created as root. Give the non-root DevContainer user ownership,
# then remove stale executable links left by an interrupted Bun installation.
sudo mkdir -p node_modules
sudo chown -R "$(id -u):$(id -g)" node_modules
rm -rf node_modules/.bin

bun install --frozen-lockfile

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

bun x playwright install --list

echo "[info] DevContainer ready with Bun ${installed_bun_version} and Playwright ${installed_playwright_version}"