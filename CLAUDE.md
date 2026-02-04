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
├── workshops/            # Workshop YAML configs
└── tools/                # Python scripts for extraction
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
              →  Web-app reads from core_content/ for slide library
```

## Web-App Module System

The web-app scans `core_content/` for module folders:

**Standard modules** (auto-extracted from methodology):
- Folder pattern: `m{number}_{name}/` (e.g., `m4_data_quality_assessment/`)
- File pattern: `m{num}_{topic}_{name}.md` or `m{num}_s{topic}_{name}.md` (condensed)
- Configured in: `web-app/server/routes/content.ts`

**Custom modules** (manually created):
- Folder: `core_content/overview_20min/`
- File pattern: `01_name.md`, `02_name.md`, etc.
- Must be registered in `content.ts` MODULE_NAMES

### Adding a New Custom Module

1. Create folder in `core_content/` (e.g., `core_content/my_custom/`)
2. Add slide files with numbered prefix: `01_intro.md`, `02_content.md`
3. Update `web-app/server/routes/content.ts`:
   - Add to `MODULE_NAMES` for both `en` and `fr`
   - Update folder detection logic if pattern differs from standard

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
| `web-app/server/routes/content.ts` | API for modules, templates, exports |
| `web-app/server/services/deckBuilder.ts` | Builds workshop decks from YAML |
| `tools/00_extract_slides.py` | Extracts slides from methodology to core_content |
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
| 4 | `04_data_quality_assessment.md` | DQ Assessment |
| 5 | `05_data_quality_adjustment.md` | DQ Adjustment |
| 6 | `06a_service_utilization.md`, `06b_coverage_estimates.md` | Data Analysis |
| 7 | `07_results_communication.md` | Results Communication |
| 8 | (Survey & HFA) | Survey & HFA |
| 9 | `10_workshop_activities.md` | Workshop Activities |
| - | `core_content/overview_20min/` | Custom 20-min overview (not from methodology) |
