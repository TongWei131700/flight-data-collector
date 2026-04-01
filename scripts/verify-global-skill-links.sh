#!/usr/bin/env bash
set -euo pipefail

CANON="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CANON_RESOLVED="$(cd "$CANON" && pwd)"

fail=0
check_link() {
  local label="$1"
  local target="$2"
  echo "[check] $label: $target"
  if [[ ! -L "$target" ]]; then
    echo "  [ERROR] 不是符号链接（请先运行 link-global-skill.sh）" >&2
    fail=1
    return
  fi
  local abs
  abs="$(cd "$(dirname "$target")" && cd "$(readlink "$target")" && pwd)"
  if [[ "$abs" != "$CANON_RESOLVED" ]]; then
    echo "  [ERROR] 指向 $abs，期望 $CANON_RESOLVED" >&2
    fail=1
    return
  fi
  if [[ ! -f "$target/SKILL.md" ]]; then
    echo "  [ERROR] 链接目标下缺少 SKILL.md" >&2
    fail=1
    return
  fi
  echo "  [ok]"
}

check_link "Cursor" "${HOME}/.cursor/skills/flight-data-collector"
check_link "Claude Code" "${HOME}/.claude/skills/flight-data-collector"
check_link "OpenClaw" "${HOME}/.openclaw/skills/flight-data-collector"

if [[ "$fail" -ne 0 ]]; then
  exit 1
fi
echo "[OK] 全局真源: $CANON_RESOLVED — 三处链接一致。"
