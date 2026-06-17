#!/usr/bin/env bash
# Build methodology/_out/EDITING.pdf from methodology/EDITING.md.
#
# Pipeline: pandoc → HTML (with a small inline stylesheet) → Chrome
# headless → PDF. Pandoc handles the Markdown semantics (tables, kbd
# tags, links, lists), Chrome handles the rendering so emoji and
# unicode characters like ✓ that LaTeX chokes on render cleanly.
#
# Re-run whenever EDITING.md changes:
#   bash methodology/build_editing_pdf.sh
#
# Requires: pandoc, Google Chrome (macOS).

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SRC="$SCRIPT_DIR/EDITING.md"
OUT_DIR="$SCRIPT_DIR/_out"
OUT_PDF="$OUT_DIR/EDITING.pdf"
TMP_HTML="$(mktemp -t fastr_editing).html"

mkdir -p "$OUT_DIR"

# Inline FASTR-branded stylesheet. Plain HTML look — not a slide deck.
read -r -d '' CSS <<'EOF' || true
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1.5rem;
  color: #222;
  line-height: 1.55;
}
h1 { color: #09544F; border-bottom: 2px solid #09544F; padding-bottom: 0.3rem; }
h2 { color: #0C716B; margin-top: 2rem; }
h3 { color: #0C716B; }
code, kbd {
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 1px 5px;
  font-family: "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.92em;
}
kbd {
  box-shadow: 0 1px 0 rgba(0,0,0,0.1);
  font-weight: 600;
}
table { border-collapse: collapse; margin: 1rem 0; width: 100%; }
table th, table td { border: 1px solid #ddd; padding: 0.5rem 0.75rem; text-align: left; }
table th { background: #E8F4F3; color: #09544F; }
blockquote {
  border-left: 3px solid #1F9A9C;
  background: #E8F4F3;
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  color: #444;
}
a { color: #0C716B; }
p, li { font-size: 0.95em; }
EOF

echo "Rendering Markdown → HTML…"
pandoc "$SRC" \
  --standalone \
  --metadata title="Editing the FASTR methodology" \
  --css=/dev/stdin \
  -o "$TMP_HTML" <<< "$CSS"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME" ]; then
  echo "Error: Google Chrome not found at $CHROME" >&2
  echo "Open methodology/EDITING.md in VS Code and use 'Markdown PDF: Export' instead." >&2
  exit 1
fi

echo "Rendering HTML → PDF via Chrome headless…"
"$CHROME" \
  --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf="$OUT_PDF" \
  "file://$TMP_HTML" >/dev/null 2>&1

rm -f "$TMP_HTML"

if [ -f "$OUT_PDF" ]; then
  echo "→ $OUT_PDF ($(du -h "$OUT_PDF" | awk '{print $1}'))"
else
  echo "Error: PDF not produced." >&2
  exit 1
fi
