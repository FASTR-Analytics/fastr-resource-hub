# FASTR Resource Hub

Build workshop presentations from the FASTR RMNCAH-N Service Use Monitoring Resource Package.

**Methodology documentation:** <https://fastr-analytics.org/> (the old `fastr-analytics.github.io` URL redirects here automatically)

**Content catalog:** see [`CATALOG.md`](CATALOG.md) — every module (with slide counts), the activities and their order, and all handouts. It's generated from the source files (`python3 tools/generate_catalog.py`), so it never goes stale.

---

## How It Works

All content lives in the `methodology/` folder. Each file has two parts:

1. **Documentation content** (top) → Vendored into [fastr-analytics.org](https://fastr-analytics.org) by the site repo
2. **Slide content** (after ASCII separator) → Becomes workshop presentations

```
methodology/04_data_quality_assessment.md
┌─────────────────────────────────────────┐
│ # Data Quality Assessment               │
│ Full documentation content...           │  → Website
├─────────────────────────────────────────┤
│ <!-- SLIDE CONTENT (ASCII banner) -->   │
│ <!-- SLIDE:m4_1 -->                     │
│ ## Slide Title                          │  → Workshops
│ <!-- /SLIDE -->                         │
└─────────────────────────────────────────┘
```

---

## Quick Start

### Web App (recommended)

```bash
cd web-app
./dev.sh start
# Open http://localhost:5173
```

The web app provides:
- Content library with all modules and slides
- Workshop builder with AI-assisted scheduling
- Export to Markdown, PDF, and PowerPoint
- Multi-language support (English and French)

### To update methodology content

**You don't need to install Python or run any build scripts** — CI does
that for you when you push. The only tools you need are git and a
Markdown editor. We recommend **VS Code** because it has built-in git,
Markdown preview, and works the same on Mac, Windows and Linux.

**One-time setup (~10 min):**

1. Install [VS Code](https://code.visualstudio.com/) (free).
2. Sign in to GitHub from VS Code (Accounts → Sign in with browser).
3. Open VS Code → **Source Control** panel → **Clone Repository** → paste
   `https://github.com/FASTR-Analytics/fastr-resource-hub.git`.
4. When prompted, install the suggested Markdown extensions.

**Day-to-day workflow:**

1. Open `methodology/04_data_quality_assessment.md` (or whichever module).
2. Edit. Press <kbd>Ctrl/Cmd + Shift + V</kbd> to see a live Markdown
   preview next to your edits.
3. **Source Control** panel → type a short message → click ✓ **Commit** →
   click ↑ **Sync Changes**.

That's it. CI takes over from there:
- Re-extracts slides into `core_content/`
- Rebuilds handout PDFs
- [fastr-analytics.org](https://fastr-analytics.org) picks up the change
  on its next sync
- The deck-builder web app redeploys with your changes

**Power-user shortcut** — if you want to preview the extracted slides
locally before pushing, you can install Python 3 and run
`python3 tools/00_extract_slides.py`. Not required.

### Documentation site

The public methodology documentation lives at **<https://fastr-analytics.org>**,
built from [`FASTR-Analytics/site`](https://github.com/FASTR-Analytics/site)
which vendors `methodology/` from this repo via `pnpm sync:methodology`.

The local MkDocs build is retired — its URL now redirects to the new site.
Edit methodology files here and push; the site repo picks them up on its next
sync.

---

## Tools

| Tool | What it does |
|------|--------------|
| `tools/00_extract_slides.py` | Extract slides from methodology files (`--prune` removes stale files; off by default) |
| `tools/migrate_to_meta.py` | Generate/regenerate module metadata (modules.yaml, _meta.yaml) |
| `tools/validate_content.py` | Validate content + **drift guard**: flags any core_content slide with no methodology source, plus id collisions |
| `tools/generate_catalog.py` | Regenerate [`CATALOG.md`](CATALOG.md) — the content index |

---

## Folder Structure

```
fastr-resource-hub/
├── methodology/           # Source content (edit here!) — docs + SLIDE markers
├── core_content/          # Auto-generated slides (en) — do not hand-edit
├── core_content_fr/       # Auto-generated slides (fr)
├── handouts/              # Participant + facilitator handouts (en/ + fr/), _order.yaml
├── archived_slides/       # Retired slide content (en/ + fr/)
├── modules.yaml           # Module definitions + activity catalog (single source of truth)
├── CATALOG.md             # Generated content index (tools/generate_catalog.py)
├── web-app/               # Deck Builder web application
├── templates/             # Slide templates (+ templates_fr/)
├── resources/             # Images, diagrams, backgrounds
└── tools/                 # Extraction, validation, catalog scripts
```

---

## Guides

| Guide | What it covers |
|-------|----------------|
| [00 Start Here](help%20and%20instructions/00_start_here.md) | Overview and key concepts |
| [01 Editing Content](help%20and%20instructions/01_editing_content.md) | Markdown syntax & SLIDE markers |
| [02 Local Setup](help%20and%20instructions/02_local_setup.md) | Install on your computer |
| [05 Style Guide](help%20and%20instructions/05_style_guide.md) | Formatting conventions |

---

## License

Copyright (c) 2025 The World Bank, Global Financing Facility for Women, Children and Adolescents (GFF), Frequent Assessments and System Tools for Resilience (FASTR) Initiative. All rights reserved.

This software is proprietary and made publicly available for transparency and reference purposes only. Viewing and reviewing the source code is permitted.
