#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

json_files=(
  ".agents/plugins/marketplace.json"
  ".claude-plugin/marketplace.json"
  "plugins/meta-learn/.codex-plugin/plugin.json"
  "plugins/meta-learn/.claude-plugin/plugin.json"
)

for file in "${json_files[@]}"; do
  jq empty "$file"
done

codex_version="$(jq -r '.version' plugins/meta-learn/.codex-plugin/plugin.json)"
claude_version="$(jq -r '.version' plugins/meta-learn/.claude-plugin/plugin.json)"
marketplace_version="$(jq -r '.plugins[] | select(.name == "meta-learn") | .version' .claude-plugin/marketplace.json)"

if [[ "$codex_version" != "$claude_version" || "$codex_version" != "$marketplace_version" ]]; then
  echo "Version mismatch: Codex=$codex_version Claude=$claude_version Marketplace=$marketplace_version" >&2
  exit 1
fi

test -f plugins/meta-learn/skills/meta-learn/SKILL.md
test -f plugins/meta-learn/skills/meta-learn/references/metalearn-start.md

if command -v claude >/dev/null 2>&1; then
  claude plugin validate --strict .
fi

echo "Validation passed for keep-learning $codex_version"
