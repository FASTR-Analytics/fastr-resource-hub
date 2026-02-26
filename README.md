# FASTR Resource Hub

Build workshop presentations from the FASTR RMNCAH-N Service Use Monitoring Resource Package.

**Methodology Documentation:** https://fastr-analytics.github.io/fastr-resource-hub/

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

```bash
# 1. Edit files in methodology/
# 2. Extract slides (also regenerates metadata)
python3 tools/00_extract_slides.py

# 3. Commit both
git add methodology/ core_content/ modules.yaml
git commit -m "Update content"
```

### Documentation website

```bash
cd methodology && mkdocs serve
# Open http://localhost:8000
```

---

## Tools

| Tool | What it does |
|------|--------------|
| `tools/00_extract_slides.py` | Extract slides from methodology files |
| `tools/migrate_to_meta.py` | Generate/regenerate module metadata (modules.yaml, _meta.yaml) |
| `tools/validate_content.py` | Validate content consistency and metadata |

---

## Folder Structure

```
fastr-resource-hub/
├── methodology/           # Source content (edit here!)
├── core_content/          # Auto-generated slides
├── core_content_fr/       # French translations
├── modules.yaml           # Module definitions (single source of truth)
├── web-app/               # Deck Builder web application
├── templates/             # Slide templates
├── templates_fr/          # French templates
├── resources/             # Images, diagrams, backgrounds
└── tools/                 # Extraction and validation scripts
```

---

## Guides

| Guide | What it covers |
|-------|----------------|
| [00 Start Here](help%20and%20instructions/00_start_here.md) | Overview and key concepts |
| [01 Editing Content](help%20and%20instructions/01_editing_content.md) | Markdown syntax & SLIDE markers |
| [03 Local Setup](help%20and%20instructions/03_local_setup.md) | Install on your computer |
| [07 Style Guide](help%20and%20instructions/07_style_guide.md) | Formatting conventions |

---

## License

Copyright (c) 2025 The World Bank, Global Financing Facility for Women, Children and Adolescents (GFF), Frequent Assessments and System Tools for Resilience (FASTR) Initiative. All rights reserved.

This software is proprietary and made publicly available for transparency and reference purposes only. Viewing and reviewing the source code is permitted.
