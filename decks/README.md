# decks/

Standalone, one-off slide decks that are **not** part of the workshop
curriculum — advocacy talks (plaidoyers), briefings, and other bespoke
presentations. Unlike `core_content/`, these are hand-authored and are not
assembled by the deck builder or vendored by the docs site.

## Layout

```
decks/
├── README.md
├── build_deck_pptx.py                   # native (editable) PPTX builder — see "PPTX" below
└── fr/
    ├── plaidoyer_plateforme_fastr.md    # source of the PDF (Marp, theme: fastr)
    ├── plaidoyer_plateforme_fastr.pdf   # rendered from the .md — presenter-ready
    └── plaidoyer_plateforme_fastr.pptx  # built by build_deck_pptx.py — editable in PowerPoint
```

There are **two sources**, on purpose: the `.md` drives the **PDF**, and
`build_deck_pptx.py` drives the **editable PPTX**. Keep them in sync when you
change content.

Language subfolders (`fr/`, `en/`, …) mirror the rest of the repo. Image paths
in a deck point at the shared assets with `../../resources/...`.

## Rendered-from-library decks

`en/platform_security_sustainability.pdf` and `fr/platform_security_sustainability.pdf`
are **not** hand-authored here — they are rendered from the `mg` slide-library
module (`core_content/mg_platform_governance/` + `core_content_fr/`), which is
the source of truth. Edit the slides there (or assemble them in the deck-builder
app), then regenerate: concatenate the module's slides per `_meta.yaml` order
into one Marp file and render with `npx @marp-team/marp-cli <combined.md> -o
decks/<lang>/platform_security_sustainability.pdf --allow-local-files`.

## How to edit

- Each deck is a single Marp markdown file using `theme: fastr` (the shared
  `fastr-theme.css` at the repo root). **Reuse the existing slide classes**
  (`title-cover`, `section-cover`, `two-panel`, `output`, `split-panel`,
  `columns-3`, `results-chain`, `spacious`, `compact`, `centered`, `bg-green`,
  …) — do not add new CSS to the theme for a one-off deck.
- Need a deck-specific look? Put a scoped `<style>` block at the top of that
  deck's markdown (see the horizontal-title override in
  `plaidoyer_plateforme_fastr.md`). It only affects that deck.
- Platform screenshots live in `resources/screenshots/platform_fr/` (captured
  from the sanctioned demo site, `demo-fr.fastr-analytics.org`). Any claim about
  the platform must be verified against the published docs + platform code first
  (see the repo `CLAUDE.md`).

## Key commands

```bash
# PDF — from the Marp markdown (16:9, picks up marp.config.mjs + fastr-theme.css)
npx @marp-team/marp-cli decks/fr/plaidoyer_plateforme_fastr.md \
  -o decks/fr/plaidoyer_plateforme_fastr.pdf --allow-local-files

# Editable PPTX — native python-pptx build (NOT Marp). Needs: pip install python-pptx pillow
python3 decks/build_deck_pptx.py --lang fr
```

## PPTX — read this before exporting slides

**Use `build_deck_pptx.py` for PowerPoint. Do not use Marp for PPTX.**

We tried both Marp paths and PowerPoint (esp. on macOS) rejects them:

| Method | Result |
|--------|--------|
| `marp --pptx-editable` | LibreOffice round-trip → *"PowerPoint found a problem… repair"*; also mangles the CSS-grid layouts (split-panel, results-chain). |
| `marp --pptx` (image-based) | Each slide is one flat picture; macOS PowerPoint often *"can't read"* the file, and nothing is editable anyway. |
| **`build_deck_pptx.py`** (python-pptx) | **Native OOXML — opens clean, fully editable text/shapes.** ✅ |

`build_deck_pptx.py` writes the slides as real text boxes and shapes (same
approach as the web-app's `pptxgenjs` deck exporter, which is why *that* works).
The deck **content lives in the script** as a `CONTENT[lang]` list, mirroring the
markdown. When you edit the `.md`, update the matching entry in the script and
re-run it. Verify with LibreOffice:

```bash
soffice --headless --convert-to pdf --outdir /tmp decks/fr/plaidoyer_plateforme_fastr.pptx
# converts as an "Impress document" (editable) — not a "Draw document" (image dump)
```

## Gotchas

- **Don't reach for `marp --pptx*`** for these decks — see the table above. Marp
  is for the **PDF** only.
- Marp runs content past the page edge silently. After large edits, eyeball the
  rendered PDF slides — there is no slide-level overflow guard for `decks/` the
  way `tools/check_handout_overflow.py` guards handouts.
- Poppins may not be installed on the presenting machine; PowerPoint will
  substitute a default sans. That is cosmetic and expected.
- `core_content/` is auto-generated — never hand-author a bespoke deck there.
  This folder exists so one-off decks don't get overwritten by the extractor.
