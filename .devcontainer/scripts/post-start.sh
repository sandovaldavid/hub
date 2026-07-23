#!/usr/bin/env bash
set -euo pipefail

if [[ "${DEVCONTAINER:-}" != "true" ]]; then
  exit 0
fi

REPOSITORY_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPOSITORY_ROOT"

owner_uid="$(id -u)"
owner_gid="$(id -g)"
workspace_uid="$(stat -c '%u' "$REPOSITORY_ROOT")"
workspace_gid="$(stat -c '%g' "$REPOSITORY_ROOT")"

if [[ "$workspace_uid" != "$owner_uid" || "$workspace_gid" != "$owner_gid" ]]; then
  cat >&2 <<EOF_MISMATCH
Development container identity mismatch.
- container UID:GID: ${owner_uid}:${owner_gid}
- workspace UID:GID: ${workspace_uid}:${workspace_gid}
Rebuild the container without cache.
EOF_MISMATCH
  exit 1
fi

if [[ ! -w "$REPOSITORY_ROOT" ]]; then
  echo "Repository root is not writable by $(id -un): $REPOSITORY_ROOT" >&2
  exit 1
fi

# The forwarded agent may become available after the first container creation.
bash .devcontainer/scripts/configure-git-ssh-signing.sh

printf 'Workspace is writable by %s (%s:%s).\n' "$(id -un)" "$owner_uid" "$owner_gid"
