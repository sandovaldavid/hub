#!/usr/bin/env bash
set -euo pipefail

STARSHIP_VERSION="${STARSHIP_VERSION:-v1.26.0}"
EZA_VERSION="${EZA_VERSION:-0.23.5}"
ZSH_AUTOSUGGESTIONS_VERSION="${ZSH_AUTOSUGGESTIONS_VERSION:-0.7.1}"
ZSH_SYNTAX_HIGHLIGHTING_VERSION="${ZSH_SYNTAX_HIGHLIGHTING_VERSION:-0.8.0}"
ZSH_COMPLETIONS_VERSION="${ZSH_COMPLETIONS_VERSION:-0.36.0}"
ZSH_HISTORY_SUBSTRING_SEARCH_VERSION="${ZSH_HISTORY_SUBSTRING_SEARCH_VERSION:-1.1.0}"

BIN_DIR="${HOME}/.local/bin"
CONFIG_DIR="${HOME}/.config/devcontainer"
STARSHIP_CONFIG_DIR="${HOME}/.config"
STARSHIP_CONFIG="${STARSHIP_CONFIG_DIR}/starship.toml"
PLUGIN_ROOT="${HOME}/.local/share/zsh/plugins"
REPOSITORY_ROOT="${REPOSITORY_ROOT:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

mkdir -p "$BIN_DIR" "$CONFIG_DIR" "$STARSHIP_CONFIG_DIR" "$PLUGIN_ROOT"

install_archive() {
  local name="$1"
  local version="$2"
  local url="$3"
  local checksum="$4"
  local destination="$5"
  local expected_file="$6"

  if [[ -f "${destination}/.devcontainer-version" ]] \
    && [[ "$(<"${destination}/.devcontainer-version")" == "$version" ]] \
    && [[ -f "${destination}/${expected_file}" ]]; then
    return 0
  fi

  local temp_dir archive
  temp_dir="$(mktemp -d)"
  archive="${temp_dir}/${name}.tar.gz"

  curl --proto '=https' --tlsv1.2 -fsSL "$url" -o "$archive"
  printf '%s  %s\n' "$checksum" "$archive" | sha256sum --check --status

  rm -rf "$destination"
  mkdir -p "$destination"
  tar -xzf "$archive" -C "$destination" --strip-components=1
  printf '%s\n' "$version" > "${destination}/.devcontainer-version"
  rm -rf "$temp_dir"
}

install_starship() {
  local starship_bin="${BIN_DIR}/starship"
  local installed_version=""

  if [[ -x "$starship_bin" ]]; then
    installed_version="$($starship_bin --version 2>/dev/null | awk 'NR == 1 { print $2 }')"
  elif command -v starship >/dev/null 2>&1; then
    starship_bin="$(command -v starship)"
    installed_version="$(starship --version 2>/dev/null | awk 'NR == 1 { print $2 }')"
  fi

  if [[ "$installed_version" != "${STARSHIP_VERSION#v}" ]]; then
    curl --proto '=https' --tlsv1.2 -fsSL https://starship.rs/install.sh \
      | sh -s -- --yes --bin-dir "$BIN_DIR" --version "$STARSHIP_VERSION"
  fi
}

install_eza() {
  local eza_bin="${BIN_DIR}/eza"
  if [[ -x "$eza_bin" ]] && "$eza_bin" --version 2>/dev/null | grep -q "${EZA_VERSION}"; then
    return 0
  fi

  local target checksum
  case "$(uname -m)" in
    x86_64|amd64)
      target="x86_64-unknown-linux-gnu"
      checksum="35c70c5c43c29108075e58b893234c67ef585f0b53a7eaf8e9e7d4eec9f339b4"
      ;;
    aarch64|arm64)
      target="aarch64-unknown-linux-gnu"
      checksum="40b87ae8628aa2ff0f0d2dc24ab52f689631366385c3da630bae745671fd71ec"
      ;;
    *)
      echo "Unsupported architecture for the pinned eza binary: $(uname -m)" >&2
      exit 1
      ;;
  esac

  local temp_dir archive
  temp_dir="$(mktemp -d)"
  archive="${temp_dir}/eza.tar.gz"

  curl --proto '=https' --tlsv1.2 -fsSL \
    "https://github.com/eza-community/eza/releases/download/v${EZA_VERSION}/eza_${target}.tar.gz" \
    -o "$archive"
  printf '%s  %s\n' "$checksum" "$archive" | sha256sum --check --status
  tar -xzf "$archive" -C "$temp_dir"
  install -m 0755 "${temp_dir}/eza" "$eza_bin"
  rm -rf "$temp_dir"
}

prepare_history() {
  local history_file="${ZSH_HISTORY_FILE:-$HOME/.zsh_history}"
  local history_dir
  history_dir="$(dirname "$history_file")"

  if [[ ! -d "$history_dir" ]] || [[ ! -w "$history_dir" ]]; then
    if command -v sudo >/dev/null 2>&1; then
      sudo mkdir -p "$history_dir"
      sudo chown "$(id -u):$(id -g)" "$history_dir"
      sudo chmod 0700 "$history_dir"
    else
      mkdir -p "$history_dir"
    fi
  fi

  touch "$history_file"
  chmod 0600 "$history_file"
}

replace_managed_block() {
  local rc_file="$1"
  local shell_name="$2"
  local source_file="${CONFIG_DIR}/shell.${shell_name}"
  local start_marker="# >>> devcontainer-shell >>>"
  local end_marker="# <<< devcontainer-shell <<<"
  local temp_file

  touch "$rc_file"
  temp_file="$(mktemp)"

  awk -v start="$start_marker" -v end="$end_marker" '
    $0 == start { skipping = 1; next }
    $0 == end { skipping = 0; next }
    !skipping { print }
  ' "$rc_file" \
    | awk '
      $0 == "# devcontainer-starship" { legacy = 1; next }
      legacy && $0 == "fi" { legacy = 0; next }
      !legacy { print }
    ' > "$temp_file"

  cat >> "$temp_file" <<EOF_RC

${start_marker}
[[ -f "${source_file}" ]] && source "${source_file}"
${end_marker}
EOF_RC

  mv "$temp_file" "$rc_file"
}

install_starship
install_eza

install_archive \
  zsh-autosuggestions "$ZSH_AUTOSUGGESTIONS_VERSION" \
  "https://github.com/zsh-users/zsh-autosuggestions/archive/refs/tags/v${ZSH_AUTOSUGGESTIONS_VERSION}.tar.gz" \
  "0df7affff21cd87ed298e6a3970ed08a1dd66a6efa676454ee5b091ad503badf" \
  "${PLUGIN_ROOT}/zsh-autosuggestions-${ZSH_AUTOSUGGESTIONS_VERSION}" \
  zsh-autosuggestions.zsh

install_archive \
  zsh-syntax-highlighting "$ZSH_SYNTAX_HIGHLIGHTING_VERSION" \
  "https://github.com/zsh-users/zsh-syntax-highlighting/archive/refs/tags/${ZSH_SYNTAX_HIGHLIGHTING_VERSION}.tar.gz" \
  "5981c19ebaab027e356fe1ee5284f7a021b89d4405cc53dc84b476c3aee9cc32" \
  "${PLUGIN_ROOT}/zsh-syntax-highlighting-${ZSH_SYNTAX_HIGHLIGHTING_VERSION}" \
  zsh-syntax-highlighting.zsh

install_archive \
  zsh-completions "$ZSH_COMPLETIONS_VERSION" \
  "https://github.com/zsh-users/zsh-completions/archive/refs/tags/${ZSH_COMPLETIONS_VERSION}.tar.gz" \
  "5aa68be2999a7be2eb56de8e4acff8f3bba4a66b9acbb233752536857408fb2e" \
  "${PLUGIN_ROOT}/zsh-completions-${ZSH_COMPLETIONS_VERSION}" \
  zsh-completions.plugin.zsh

install_archive \
  zsh-history-substring-search "$ZSH_HISTORY_SUBSTRING_SEARCH_VERSION" \
  "https://github.com/zsh-users/zsh-history-substring-search/archive/refs/tags/v${ZSH_HISTORY_SUBSTRING_SEARCH_VERSION}.tar.gz" \
  "9b52eca6c894dd98caa5f07160199f3f3179ff017575d5acc9fdc467b1ac70f8" \
  "${PLUGIN_ROOT}/zsh-history-substring-search-${ZSH_HISTORY_SUBSTRING_SEARCH_VERSION}" \
  zsh-history-substring-search.zsh

source_starship="${REPOSITORY_ROOT}/.devcontainer/config/starship.toml"
source_zsh="${REPOSITORY_ROOT}/.devcontainer/config/shell.zsh"
source_bash="${REPOSITORY_ROOT}/.devcontainer/config/shell.bash"

for source_file in "$source_starship" "$source_zsh" "$source_bash"; do
  if [[ ! -f "$source_file" ]]; then
    echo "Dev Container shell config not found: $source_file" >&2
    exit 1
  fi
done

install -m 0644 "$source_starship" "$STARSHIP_CONFIG"
install -m 0644 "$source_zsh" "${CONFIG_DIR}/shell.zsh"
install -m 0644 "$source_bash" "${CONFIG_DIR}/shell.bash"

prepare_history
replace_managed_block "$HOME/.zshrc" zsh
replace_managed_block "$HOME/.bashrc" bash

printf 'Dev Container shell configured: Starship %s, eza %s, and pinned Zsh plugins.\n' \
  "${STARSHIP_VERSION#v}" "$EZA_VERSION"
