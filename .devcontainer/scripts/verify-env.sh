#!/usr/bin/env bash
set -Eeuo pipefail

readonly workspace="${CONTAINER_WORKSPACE_FOLDER:-/workspace}"

cd "${workspace}"

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

bun x playwright install --list

bun -e "const { chromium } = require('@playwright/test'); console.log('[diag] Chromium executablePath:', chromium.executablePath());"

printf '[info] Environment verified: Bun %s, Playwright %s, Zsh %s, Oh My Posh %s\n' \
	"${installed_bun_version}" \
	"${installed_playwright_version}" \
	"$(zsh --version | awk '{print $2}')" \
	"${installed_posh_version}"
