# Managed by .devcontainer/scripts/configure-shell.sh.
# Rebuild or rerun postCreateCommand after changing this file.

export PATH="$HOME/.local/bin:$PATH"
export STARSHIP_CONFIG="$HOME/.config/starship.toml"
export ZSH_PLUGIN_ROOT="$HOME/.local/share/zsh/plugins"
export XDG_CACHE_HOME="${XDG_CACHE_HOME:-$HOME/.cache}"

HISTFILE="${ZSH_HISTORY_FILE:-$HOME/.zsh_history}"
HISTSIZE=50000
SAVEHIST=50000

setopt APPEND_HISTORY
setopt SHARE_HISTORY
setopt EXTENDED_HISTORY
setopt HIST_IGNORE_DUPS
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_FIND_NO_DUPS
setopt HIST_SAVE_NO_DUPS
setopt HIST_REDUCE_BLANKS
setopt HIST_VERIFY
setopt HIST_IGNORE_SPACE

mkdir -p "$XDG_CACHE_HOME/zsh"

fpath=(
  "$ZSH_PLUGIN_ROOT/zsh-completions-0.36.0/src"
  $fpath
)
autoload -Uz compinit
compinit -d "$XDG_CACHE_HOME/zsh/zcompdump"

zstyle ':completion:*' menu select
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'
zstyle ':completion:*' use-cache on
zstyle ':completion:*' cache-path "$XDG_CACHE_HOME/zsh"

ZSH_AUTOSUGGEST_STRATEGY=(history)
ZSH_AUTOSUGGEST_HIGHLIGHT_STYLE='fg=8'
source "$ZSH_PLUGIN_ROOT/zsh-autosuggestions-0.7.1/zsh-autosuggestions.zsh"

source "$ZSH_PLUGIN_ROOT/zsh-syntax-highlighting-0.8.0/zsh-syntax-highlighting.zsh"
source "$ZSH_PLUGIN_ROOT/zsh-history-substring-search-1.1.0/zsh-history-substring-search.zsh"

HISTORY_SUBSTRING_SEARCH_ENSURE_UNIQUE=1
bindkey -e
[[ -n "${terminfo[kcuu1]-}" ]] && bindkey "$terminfo[kcuu1]" history-substring-search-up
[[ -n "${terminfo[kcud1]-}" ]] && bindkey "$terminfo[kcud1]" history-substring-search-down
bindkey '^[[A' history-substring-search-up
bindkey '^[[B' history-substring-search-down
bindkey -M emacs '^P' history-substring-search-up
bindkey -M emacs '^N' history-substring-search-down

if command -v eza >/dev/null 2>&1; then
  alias ls='eza --icons=auto --group-directories-first'
  alias l='eza --icons=auto --group-directories-first'
  alias la='eza -a --icons=auto --group-directories-first'
  alias ll='eza -la --icons=auto --git --group-directories-first --time-style=long-iso'
  alias tree='eza --tree --icons=auto --group-directories-first'
  alias tree2='eza --tree --level=2 --icons=auto --group-directories-first'
  alias tree3='eza --tree --level=3 --icons=auto --group-directories-first'
  alias tree-d='eza --tree --only-dirs --icons=auto --group-directories-first'
  alias lsd='eza --only-dirs --icons=auto --group-directories-first'
  alias lsf='eza --only-files --icons=auto --group-directories-first'
  alias ls-native='command ls --color=auto'
fi

if command -v starship >/dev/null 2>&1; then
  eval "$(starship init zsh)"
fi
