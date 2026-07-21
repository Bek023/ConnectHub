#!/usr/bin/env bash
# Refresh the graphify knowledge graph after Claude edits a file in this repo.
# Wired as a PostToolUse hook on Write|Edit — see .claude/settings.json.
# Reads the hook payload (JSON) on stdin; exits 0 in every path so it can never
# block a turn.
set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
LOCK="/tmp/graphify-connecthub.lock"

FILE="$(jq -r '.tool_input.file_path // .tool_response.filePath // empty' 2>/dev/null)"

# Nothing to do: no path in the payload, an edit outside this repo, or an edit
# to graphify's own output (which would re-trigger this hook forever).
case "$FILE" in
  "") exit 0 ;;
  "$ROOT"/graphify-out/*) exit 0 ;;
  "$ROOT"/*) ;;
  *) exit 0 ;;
esac

GRAPHIFY="$(command -v graphify 2>/dev/null || echo "$HOME/.local/bin/graphify")"
[ -x "$GRAPHIFY" ] || exit 0

# Atomic lock: if a refresh is already running, skip this one rather than
# letting two graphify processes write graph.json at the same time.
mkdir "$LOCK" 2>/dev/null || exit 0
trap 'rmdir "$LOCK" 2>/dev/null' EXIT

cd "$ROOT" || exit 0
# --code-only: no LLM API key is available in this environment, so docs are not
# re-extracted. See the "Known limitation" section in CLAUDE.md.
"$GRAPHIFY" . --code-only --update >/tmp/graphify-hook.log 2>&1 || true
