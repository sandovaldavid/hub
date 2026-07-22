#!/usr/bin/env bash
set -Eeuo pipefail

readonly workspace="${CONTAINER_WORKSPACE_FOLDER:-/workspace}"
readonly owner="$(id -u):$(id -g)"
readonly reportDirectories=(
	"${workspace}/playwright-report"
	"${workspace}/test-results"
)

sudo mkdir -p "${reportDirectories[@]}"
sudo chown -R "${owner}" "${reportDirectories[@]}"

bash .devcontainer/scripts/verify-env.sh
