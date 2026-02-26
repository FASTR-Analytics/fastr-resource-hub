# Instructions for Claude

## Repository Structure

```
fastr-resource-hub/
├── methodology/          # Source content for docs website (MkDocs)
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

### 1. Documentation Website (MkDocs)
- Lives in `methodology/` folder
- Built with MkDocs Material
- Run: `cd methodology && mkdocs serve`
- Config: `methodology/mkdocs.yml`

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
| `modules.yaml` | Single source of truth for module definitions |
| `web-app/server/services/moduleRegistry.ts` | Loads and caches module metadata for the web-app |
| `web-app/server/routes/content.ts` | API for modules, templates, exports |
| `web-app/server/services/deckBuilder.ts` | Builds workshop decks from YAML |
| `tools/00_extract_slides.py` | Extracts slides from methodology to core_content |
| `tools/migrate_to_meta.py` | Generates/regenerates modules.yaml and _meta.yaml |
| `tools/validate_content.py` | Validates content consistency and metadata |
| `methodology/mkdocs.yml` | MkDocs site configuration |

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
