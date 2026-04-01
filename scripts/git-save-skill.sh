#!/usr/bin/env bash
# 将本技能目录一次性提交到 $HOME 的 Git 仓库（skills/flight-data-collector）。
# 用法：在真源目录执行 ./scripts/git-save-skill.sh ["提交说明"]
set -euo pipefail
SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REPO_HOME="${REPO_HOME:-$HOME}"
REL="skills/flight-data-collector"
cd "$REPO_HOME"

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "[error] 不是 Git 仓库: $REPO_HOME" >&2
  exit 1
fi

# 若存在未解决冲突，先提示（不自动删内容，避免误伤）
if git diff --name-only --diff-filter=U 2>/dev/null | grep -q .; then
  echo "[error] 仓库存在未合并冲突文件，请先手动解决后再运行本脚本。" >&2
  git diff --name-only --diff-filter=U
  exit 2
fi

MSG=${1:-"chore(skills): save flight-data-collector skill (rules, Claude permissions, docs)"}

git add "$REL"
if git diff --cached --quiet; then
  echo "[ok] 无新变更可提交（$REL 已与 HEAD 一致）。"
  exit 0
fi

git commit -m "$MSG"
echo "[ok] 已提交: $MSG"
