#!/usr/bin/env bash
set -euo pipefail

REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPOSITORY_ROOT"

required_bun_version="1.3.14"
actual_bun_version="$(bun --version)"
if [[ "$actual_bun_version" != "$required_bun_version" ]]; then
  echo "Unsupported Bun version: ${actual_bun_version}. Expected ${required_bun_version}." >&2
  exit 1
fi

bash .devcontainer/scripts/configure-shell.sh
bash .devcontainer/scripts/configure-git-ssh-signing.sh

bun install --frozen-lockfile

printf '\nLinktree development container ready with Bun %s.\n' "$actual_bun_version"
