#!/usr/bin/env bash
# Render a FASTR handout markdown file to A4 PDF via Marp CLI.
#
# Usage:
#   tools/render_handout.sh path/to/handout.md
#   tools/render_handout.sh path/to/handout.md path/to/output.pdf
#
# Output defaults to <input>.pdf in the same directory.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
THEME="$REPO_ROOT/fastr-handout.css"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <handout.md> [output.pdf]" >&2
  exit 1
fi

INPUT="$1"
OUTPUT="${2:-${INPUT%.md}.pdf}"

if [[ ! -f "$INPUT" ]]; then
  echo "Error: input file not found: $INPUT" >&2
  exit 1
fi

if [[ ! -f "$THEME" ]]; then
  echo "Error: handout theme not found: $THEME" >&2
  exit 1
fi

echo "Rendering: $INPUT → $OUTPUT"

# Prefer an already-installed marp binary (local node_modules, then global) over
# `npx`, which re-resolves the package each call and — when several renders run
# concurrently — can deadlock spawning Chrome. Fall back to npx only if neither
# binary is present.
if [[ -x "$REPO_ROOT/node_modules/.bin/marp" ]]; then
  MARP=("$REPO_ROOT/node_modules/.bin/marp")
elif command -v marp >/dev/null 2>&1; then
  MARP=(marp)
else
  MARP=(npx -y @marp-team/marp-cli)
fi

"${MARP[@]}" "$INPUT" \
  --theme-set "$THEME" \
  --pdf \
  --allow-local-files \
  -o "$OUTPUT"

# Marp silently runs content past the page edge instead of erroring, so check the
# rendered PDF here too — not just in build_handout_pdfs.py. Most handouts are
# iterated on via this script, which is exactly when overflow gets introduced.
# Warn but don't fail: a mid-edit render is often expected to be over-long.
CHECKER="$REPO_ROOT/tools/check_handout_overflow.py"
if [[ "${SKIP_OVERFLOW_CHECK:-}" != "1" && -f "$CHECKER" ]]; then
  python3 "$CHECKER" "$OUTPUT" --quiet || true
fi
