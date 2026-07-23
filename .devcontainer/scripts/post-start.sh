#!/usr/bin/env bash
set -Eeuo pipefail

if [[ "${DEVCONTAINER:-}" != "true" ]]; then
	exit 0
fi

readonly workspace="${CONTAINER_WORKSPACE_FOLDER:-/workspace}"
readonly owner_uid="$(id -u)"
readonly owner_gid="$(id -g)"
readonly owner="${owner_uid}:${owner_gid}"
readonly report_directories=(
	"${workspace}/playwright-report"
	"${workspace}/test-results"
)

cd "${workspace}"

workspace_uid="$(stat -c '%u' "${workspace}")"
workspace_gid="$(stat -c '%g' "${workspace}")"
if [[ "${workspace_uid}" != "${owner_uid}" || "${workspace_gid}" != "${owner_gid}" ]]; then
	cat >&2 <<EOF_MISMATCH
Development container identity mismatch.
- container UID:GID: ${owner_uid}:${owner_gid}
- workspace UID:GID: ${workspace_uid}:${workspace_gid}
Rebuild the container without cache.
EOF_MISMATCH
	exit 1
fi

if [[ ! -w "${workspace}" ]]; then
	echo "[error] Repository root is not writable by $(id -un): ${workspace}" >&2
	exit 1
fi

sudo mkdir -p "${report_directories[@]}"
sudo chown -R "${owner}" "${report_directories[@]}"

bash .devcontainer/scripts/configure-git-ssh-signing.sh
bash .devcontainer/scripts/verify-env.sh

printf '[info] Workspace is writable by %s (%s:%s).\n' "$(id -un)" "${owner_uid}" "${owner_gid}"
