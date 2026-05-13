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
exec npx -y @marp-team/marp-cli "$INPUT" \
  --theme-set "$THEME" \
  --pdf \
  --allow-local-files \
  -o "$OUTPUT"
