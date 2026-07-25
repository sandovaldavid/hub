#!/usr/bin/env bash
set -Eeuo pipefail

readonly workspace="${CONTAINER_WORKSPACE_FOLDER:-/workspace}"
readonly expected_starship_version="1.26.0"
readonly expected_eza_version="0.23.5"

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

for browser in chromium webkit; do
	if ! find "${PLAYWRIGHT_BROWSERS_PATH}" -maxdepth 1 -type d -name "${browser}-*" -print -quit | grep -q .; then
		echo "[error] The DevContainer image does not contain ${browser} under ${PLAYWRIGHT_BROWSERS_PATH}" >&2
		exit 1
	fi
done

installed_starship_version="$(starship --version | awk 'NR == 1 {print $2}')"
if [[ "${installed_starship_version}" != "${expected_starship_version}" ]]; then
	echo "[error] Starship ${installed_starship_version} does not match ${expected_starship_version}" >&2
	exit 1
fi

installed_eza_version="$(eza --version | awk '/^v?[0-9]+\./ {sub(/^v/, "", $1); print $1; exit}')"
if [[ "${installed_eza_version}" != "${expected_eza_version}" ]]; then
	echo "[error] eza ${installed_eza_version} does not match ${expected_eza_version}" >&2
	exit 1
fi

bash .devcontainer/scripts/verify-login-shell.sh

bun x playwright install --list

bun -e "const { chromium, webkit } = require('@playwright/test'); console.log('[diag] Chromium executablePath:', chromium.executablePath()); console.log('[diag] WebKit executablePath:', webkit.executablePath());"

printf '[info] Environment verified: Bun %s, Playwright %s, Zsh %s, Starship %s, eza %s\n' \
	"${installed_bun_version}" \
	"${installed_playwright_version}" \
	"$(zsh --version | awk '{print $2}')" \
	"${installed_starship_version}" \
	"${installed_eza_version}"
