# Instructions for Claude

## Writing about the FASTR platform — sources of truth

When writing or editing anything that describes the FASTR platform or how it
works (methodology, handouts, slide decks, prompts, primers, deck-builder copy,
etc.), always do this **before** you write anything:

1. **Read the published docs first** — they are the user-facing source of truth:
   - **Admin guide:** https://github.com/FASTR-Analytics/site/tree/main/src/content/docs/admin-guide
   - **User guide:** https://github.com/FASTR-Analytics/site/tree/main/src/content/docs/user-guide
   - Both are bilingual; the FR mirror lives at `.../docs/fr/admin-guide/` and `.../docs/fr/user-guide/`.

2. **Verify every claim against the platform code** before shipping:
   - **Platform repo (web app, API, UI):** https://github.com/FASTR-Analytics/platform
   - **Analytical modules repo (R/TS code that runs DQA, adjustment, service
     utilization, denominators, coverage):**
     https://github.com/FASTR-Analytics/modules
     - `m001/` — Module 1: Data Quality Assessment (DQA)
     - `m002/` — Module 2: Data Quality Adjustment
     - `m003/` — Module 3: Service Utilization & Disruption Detection
     - `m005/` — Module 5: Denominator calculation (Part 1 of coverage)
     - `m006/` — Module 6: Coverage Estimation (Part 2 of coverage)
     - There is no platform M4 — the numbering skips 4. Use M1/M2/M3/M5/M6
       explicitly when writing about platform modules.
   - Do not trust assumptions, memory, or prior conversations — confirm in the
     docs and the code.

3. If the published docs disagree with the platform code, the **code wins** —
   flag the discrepancy so the docs can be fixed upstream rather than carrying
   the error into new material.

Quick lookups: `gh api repos/FASTR-Analytics/<repo>/contents/<path>` (and `gh
search code --repo FASTR-Analytics/<repo> <query>`). Clone locally if you need
to grep or read heavily.

## Subsystem READMEs — where to look next

Each major folder has its own README with the everyday workflow for that area.
Read those before this file's `Key Files` table — they're more current and less
abstract.

**Repo overview & contribution**
- [`README.md`](README.md) — repo overview and quickstart
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — contribution workflow + commit conventions
- [`help and instructions/README.md`](help%20and%20instructions/README.md) — onboarding guide + style guide

**Content (source → extracted)**
- [`methodology/README.md`](methodology/README.md) — slide content source of truth (EN + `fr/`); vendored by fastr-analytics.org
- [`core_content/README.md`](core_content/README.md) — auto-generated slide library — **DO NOT HAND-EDIT**

**Building & rendering**
- [`tools/README.md`](tools/README.md) — index of build / validate / render scripts
- [`templates/README.md`](templates/README.md) — workshop slide templates (EN + FR mirror)
- [`web-app/README.md`](web-app/README.md) — Deck Builder app (also `web-app/ABOUT.md`, `web-app/ARCHITECTURE.md`)
- [`handouts/README.md`](handouts/README.md) — handout source, templates, render commands

**Assets & brand**
- [`resources/README.md`](resources/README.md) — diagrams, icons, logos, backgrounds, screenshots
- [`FASTR Design System/README.md`](FASTR%20Design%20System/README.md) — brand tokens, slide templates, web UI kit
- [`GeoJSON/README.md`](GeoJSON/README.md) — country admin-boundary files used by maps

**Reference & planning**
- [`data_received/README.md`](data_received/README.md) — input materials received from partners
- [`content-strategy/README.md`](content-strategy/README.md) — handout audit + planning notes

**Archived**
- [`archive/README.md`](archive/README.md) and [`archived_slides/README.md`](archived_slides/README.md) — retired material; do not link from active content

Any new top-level subsystem ships with its own `README.md` following
[`.docs/README.template.md`](.docs/README.template.md) (5 sections: what / layout
/ how to edit / key commands / gotchas) and gets a link in this index.

## Repository Structure

```
fastr-resource-hub/
├── methodology/          # Methodology source (vendored by fastr-analytics.org via the site repo's sync)
├── core_content/         # Extracted slides for web-app (auto-generated + custom)
├── core_content_fr/      # French translations
├── web-app/              # Deck Builder web application
├── templates/            # Slide templates (title, breaks, etc.)
├── templates_fr/         # French templates
├── resources/            # Images, diagrams, backgrounds
├── modules.yaml          # Single source of truth for module definitions
└── tools/                # Python scripts for extraction and validation
```

## Two Systems

### 1. Methodology source (consumed by fastr-analytics.org)
- Markdown lives in `methodology/` (EN) and `methodology/fr/` (FR).
- The public documentation site at **https://fastr-analytics.org** is built
  from [`FASTR-Analytics/site`](https://github.com/FASTR-Analytics/site), which
  vendors this folder via `pnpm sync:methodology` (see `sync-methodology.ts`
  in that repo). The sync ignores `mkdocs.yml`, `javascripts/`, `overrides/`,
  `plugins/`, and `stylesheets/`, so MkDocs config never leaks into the
  Starlight site.
- **The local MkDocs build is retired.** Its config (`methodology/mkdocs.yml`)
  now serves a redirect to fastr-analytics.org via
  `methodology/javascripts/redirect.js` + `methodology/overrides/main.html`.
- See [`methodology/README.md`](methodology/README.md) for the edit/sync flow.

### 2. Web App - Deck Builder
- Lives in `web-app/` folder
- React frontend + Express backend
- Run: `cd web-app && ./dev.sh start`
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Content Flow

```
methodology/*.md  →  MkDocs website (docs)
       ↓
       →  Extracted to core_content/ (via tools/00_extract_slides.py)
              ↓
              →  _meta.yaml generated per module (slide ordering/metadata)
              →  Web-app reads from core_content/ + _meta.yaml for slide library
```

## Metadata Architecture

Module definitions are centralized in `modules.yaml` at the repo root. Each module folder has a `_meta.yaml` file listing its slides with order, variant (full/condensed), and title.

**`modules.yaml`** — defines all modules with:
- `id`, `number`, `folder` — identification and folder mapping
- `name.en`, `name.fr` — display names per language
- `ai_context` — description, topics, duration for AI features

**`_meta.yaml`** (per module folder) — lists slides with:
- `file` — filename
- `order` — sort order (float, e.g., 1.01 for sub-topics)
- `variant` — `full` or `condensed`
- `title` — slide title

The web-app loads these via `moduleRegistry.ts` (60s TTL cache). Falls back to regex-based discovery if `_meta.yaml` is missing.

### Adding a New Module

1. Create folder in `core_content/` (e.g., `core_content/m10_new_module/`)
2. Add slide files
3. Run `python3 tools/migrate_to_meta.py` to regenerate `modules.yaml` and `_meta.yaml`
4. Or manually add the module entry to `modules.yaml` and create `_meta.yaml`

### Adding/Removing Slides

1. Add or remove `.md` files in the module folder
2. Run `python3 tools/00_extract_slides.py` (auto-regenerates `_meta.yaml`)
3. Or run `python3 tools/migrate_to_meta.py` to regenerate metadata only

## File Naming Conventions

| Location | Pattern | Example |
|----------|---------|---------|
| Methodology | `{num}_{name}.md` | `04_data_quality_assessment.md` |
| Core content (full) | `m{num}_{topic}_{name}.md` | `m4_1_dqa_overview.md` |
| Core content (condensed) | `m{num}_s{topic}_{name}.md` | `m4_s1_dqa_overview.md` |
| Custom content | `{num}_{name}.md` | `01_introduction.md` |
| French content | Same patterns in `core_content_fr/` | |

## Key Files

| File | Purpose |
|------|---------|
| `modules.yaml` | Single source of truth for module definitions + the activity catalog (order, prerequisites, materials) |
| `CATALOG.md` | Generated content index — modules, activities, handouts (regenerate with `tools/generate_catalog.py`) |
| `web-app/server/services/moduleRegistry.ts` | Loads and caches module metadata for the web-app |
| `web-app/server/routes/content.ts` | API for modules, templates, exports |
| `web-app/server/services/deckBuilder.ts` | Builds workshop decks from YAML |
| `tools/00_extract_slides.py` | Extracts slides from methodology to core_content (`--prune` deletes stale files; off by default) |
| `tools/migrate_to_meta.py` | Generates/regenerates modules.yaml and _meta.yaml |
| `tools/validate_content.py` | Validates content + **drift guard**: flags core_content slides with no methodology source + id collisions |
| `tools/generate_catalog.py` | Regenerates `CATALOG.md` from the source files |
| `methodology/mkdocs.yml` | Retired MkDocs config — now drives the redirect to fastr-analytics.org |

## Running the Web-App

```bash
cd web-app
./dev.sh start    # Start both frontend and backend
./dev.sh stop     # Stop servers
./dev.sh restart  # Restart servers
./dev.sh status   # Check server status
```

Logs:
- Backend: `tail -f /tmp/fastr-backend.log`
- Frontend: `tail -f /tmp/fastr-frontend.log`

## Style Guidelines

See `help and instructions/07_style_guide.md` for full guide.

**Key rules:**
- **Headings**: Sentence case (only capitalize first word and proper nouns)
- **Bold**: For key terms, labels (e.g., **Inputs**:)
- **Inline code**: For filenames, variables (e.g., `hmis_data.csv`)
- **Lists**: No periods for single-line items

## Module Reference

| # | Methodology File | Topic |
|---|------------------|-------|
| 0 | `00_introduction.md` | Introduction to FASTR |
| 1 | `01_identify_questions_indicators.md` | Questions & Indicators |
| 2 | `02_data_extraction.md` | Data Extraction |
| 3 | `03_fastr_analytics_platform.md` | Analytics Platform |
| 3b | `03b_ai_assistant.md` | AI Assistant |
| 4 | `04_data_quality_assessment.md` | DQ Assessment |
| 5 | `05_data_quality_adjustment.md` | DQ Adjustment |
| 6 | `06a_service_utilization.md`, `06b_coverage_estimates.md` | Data Analysis |
| 7 | `07_results_communication.md` | Results Communication |
| 8 | (Survey & HFA) | Survey & HFA |
| 9a-9h | `10_workshop_activities.md` | Workshop Activities & Platform Guides |
| - | `core_content_fr/overview_20min/` | Custom 20-min overview (FR only) |
