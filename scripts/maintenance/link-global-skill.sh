#!/usr/bin/env bash
# 将 flight-data-collector 以符号链接方式挂到 Cursor / Claude Code / OpenClaw。
# 真源为本脚本所在技能根目录（含 SKILL.md 的目录）。
set -euo pipefail

CANON="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ ! -f "$CANON/SKILL.md" ]]; then
  echo "[error] 未找到真源 SKILL.md: $CANON/SKILL.md" >&2
  exit 1
fi

link_one() {
  local target="$1"
  local parent
  parent="$(dirname "$target")"
  mkdir -p "$parent"
  if [[ -e "$target" && ! -L "$target" ]]; then
    local bak="${target}.bak.$(date +%Y%m%d%H%M%S)"
    echo "[backup] $target -> $bak"
    mv "$target" "$bak"
  fi
  ln -sfn "$CANON" "$target"
  echo "[ok] $target -> $CANON"
}

link_one "${HOME}/.cursor/skills/flight-data-collector"
link_one "${HOME}/.claude/skills/flight-data-collector"
link_one "${HOME}/.openclaw/skills/flight-data-collector"
echo "[done] 三处链接已就绪。运行 ./scripts/verify-global-skill-links.sh 校验。"
