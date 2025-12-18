# FASTR Slide Builder

Build workshop presentations from the FASTR RMNCAH-N Service Use Monitoring Resource Package.

**Methodology Documentation:** https://fastr-analytics.github.io/fastr-slide-builder/

---

## How It Works

All content lives in the `methodology/` folder. Each file has two parts:

1. **Documentation content** (top) → Becomes the methodology website
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

### To create a workshop presentation:

```bash
# 1. Create workshop (interactive wizard)
python3 tools/01_new_workshop.py

# 2. Build the deck (validates automatically)
python3 tools/02_build_deck.py --workshop YOUR_WORKSHOP

# 3. Export to PDF
marp --no-config outputs/YOUR_WORKSHOP_deck.md --theme fastr-theme.css --pdf --allow-local-files
```

### To update methodology content:

```bash
# 1. Edit files in methodology/
# 2. Extract slides
python3 tools/00_extract_slides.py

# 3. Commit both
git add methodology/ core_content/
git commit -m "Update content"
git push
```

---

## Tools

| Tool | What it does |
|------|--------------|
| `python3 tools/00_extract_slides.py` | Extract slides from methodology files |
| `python3 tools/01_new_workshop.py` | Create a new workshop (interactive wizard) |
| `python3 tools/02_build_deck.py` | Validate and build slide deck |
| `python3 tools/03_convert_pptx.py` | Convert to PowerPoint (optional) |

---

## Folder Structure

```
fastr-slide-builder/
├── methodology/           # Source content (edit here!)
│   ├── 00_introduction.md
│   ├── 01_identify_questions_indicators.md
│   ├── 02_data_extraction.md
│   ├── 03_fastr_analytics_platform.md
│   ├── 04_data_quality_assessment.md
│   ├── 05_data_quality_adjustment.md
│   ├── 06a_service_utilization.md
│   ├── 06b_coverage_estimates.md
│   └── 07_results_communication.md
├── core_content/          # Auto-generated slides (don't edit)
├── workshops/             # Workshop configurations
├── templates/             # Slide templates
├── tools/                 # Build scripts
└── outputs/               # Generated presentations
```

---

## Guides

| Guide | What it covers |
|-------|----------------|
| [00 Start Here](help%20and%20instructions/00_start_here.md) | Overview and key concepts |
| [01 Editing Content](help%20and%20instructions/01_editing_content.md) | Markdown syntax & SLIDE markers |
| [02 Building Workshops](help%20and%20instructions/02_building_workshops.md) | Create presentations |
| [03 Local Setup](help%20and%20instructions/03_local_setup.md) | Install on your computer |
| [04 Codespaces](help%20and%20instructions/04_codespaces_setup.md) | Work in browser (no install) |

---

## License

Copyright (c) 2025 The World Bank, Global Financing Facility for Women, Children and Adolescents (GFF), Frequent Assessments and System Tools for Resilience (FASTR) Initiative. All rights reserved.

This software is proprietary and made publicly available for transparency and reference purposes only. Viewing and reviewing the source code is permitted.
