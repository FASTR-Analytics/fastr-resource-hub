#!/usr/bin/env bash
# Check that deck-palette colors don't leak into web-chrome code.
# Whitelist: DiagramBuilder.tsx (renders into slides), slides/ output,
# styles/design-tokens.css (declares the canonical token).
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CLIENT_SRC="$SCRIPT_DIR/../client/src"

# Deck-palette hexes that should not appear in web chrome
DECK_HEXES=("#09544F" "#0C716B" "#1F9A9C" "#D0CB17")

# Files that legitimately reference deck colors
ALLOW_PATTERN='(DiagramBuilder\.tsx|design-tokens\.css|slides/|fastr-theme)'

FAIL=0
for hex in "${DECK_HEXES[@]}"; do
  # grep for the hex, exclude allowed paths, exit 0 if nothing found
  LEAKS=$(grep -rEni "$hex" "$CLIENT_SRC" 2>/dev/null | grep -Ev "$ALLOW_PATTERN" || true)
  if [ -n "$LEAKS" ]; then
    echo "ERROR: deck-palette color $hex found outside whitelist:" >&2
    echo "$LEAKS" >&2
    echo "" >&2
    FAIL=1
  fi
done

if [ "$FAIL" = "1" ]; then
  echo "Web-chrome code must use the navy/teal/orange web palette." >&2
  echo "Use --fastr-web-* CSS vars or tailwind fastr.* utilities instead." >&2
  exit 1
fi

echo "✓ design-system check passed"
