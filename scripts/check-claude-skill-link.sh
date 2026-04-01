#!/usr/bin/env bash
# 兼容旧脚本名：校验 Claude 链接；建议改用 verify-global-skill-links.sh。
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$DIR/verify-global-skill-links.sh"
