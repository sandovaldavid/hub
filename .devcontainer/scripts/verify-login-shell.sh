#!/usr/bin/env bash
set -Eeuo pipefail

canonicalize_path() {
	local path="$1"
	local canonical=""

	if canonical="$(readlink -f -- "${path}" 2>/dev/null)" && [[ -n "${canonical}" ]]; then
		printf '%s\n' "${canonical}"
		return 0
	fi

	printf '%s\n' "${path}"
}

login_shell="${1:-$(getent passwd "$(id -un)" | cut -d: -f7)}"
zsh_path="${2:-$(command -v zsh || true)}"

if [[ -z "${login_shell}" ]]; then
	echo "[error] Could not determine the DevContainer user's login shell" >&2
	exit 1
fi

if [[ -z "${zsh_path}" ]]; then
	echo "[error] Zsh is not available in PATH" >&2
	exit 1
fi

canonical_login_shell="$(canonicalize_path "${login_shell}")"
canonical_zsh_path="$(canonicalize_path "${zsh_path}")"

if [[ "${canonical_login_shell}" != "${canonical_zsh_path}" ]]; then
	cat >&2 <<EOF_MISMATCH
[error] The DevContainer user does not use Zsh as its login shell
- observed login shell: ${login_shell} -> ${canonical_login_shell}
- expected Zsh binary: ${zsh_path} -> ${canonical_zsh_path}
EOF_MISMATCH
	exit 1
fi

printf '[info] Login shell verified: %s -> %s\n' "${login_shell}" "${canonical_login_shell}"
