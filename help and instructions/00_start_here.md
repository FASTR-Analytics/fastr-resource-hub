# Start Here

Welcome! This guide explains how the FASTR slide builder works.

---

## The One Thing You Need to Know

**All your work happens in the `methodology/` folder.**

To contribute to methodology content AND slide content, you only need to work in the `methodology/` folder. That's it.

---

## What is this project?

The `methodology/` folder contains the entire **FASTR RMNCAH-N Service Use Monitoring Resource Package**. The 9 module files cover the complete FASTR methodology:

| File | Module |
|------|--------|
| `00_introduction.md` | Introduction to FASTR |
| `01_identify_questions_indicators.md` | Identify Questions & Indicators |
| `02_data_extraction.md` | Data Extraction |
| `03_fastr_analytics_platform.md` | The FASTR Analytics Platform |
| `04_data_quality_assessment.md` | Data Quality Assessment |
| `05_data_quality_adjustment.md` | Data Quality Adjustment |
| `06a_service_utilization.md` | Service Utilization Analysis |
| `06b_coverage_estimates.md` | Coverage Estimates |
| `07_results_communication.md` | Results Communication |

---

## How Each File Works

Each methodology file has **two parts** that serve different purposes:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  # Data Quality Assessment                                          │
│                                                                     │
│  Full documentation content here...                                 │
│  This appears on the methodology website.                           │
│  Detailed explanations, context, references.                        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  <!--                                                               │
│  ////////////////////////////////////////////////////////////////////│
│  //   _____ _     _____ ____  _____    ____ ___  _   _ _____ _   _ //│
│  //  / ____| |   |_   _|  _ \| ____|  / ___/ _ \| \ | |_   _| \ | |//│
│  //  | (___ | |     | | | | | | |__   | |  | | | |  \| | | | |  \| |//│
│  //   \___ \| |     | | | | | |  __|  | |  | | | | . ` | | | | . ` |//│
│  //   ____) | |___ _| |_| |_| | |____ | |__| |_| | |\  | | | | |\  |//│
│  //  |_____/|_____|_____|____/|______| \____\___/|_| \_| |_| |_| \_|//│
│  //            Edit workshop slides below this line                //│
│  ////////////////////////////////////////////////////////////////////│
│  -->                                                                │
│                                                                     │
│  <!-- SLIDE:m4_1 -->                                                │
│  ## Slide Title                                                     │
│  Condensed bullet points for workshops                              │
│  <!-- /SLIDE -->                                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Part 1: Documentation (top of file)

Everything **above** the ASCII art separator becomes the **documentation website**:
- https://fastr-analytics.github.io/fastr-resource-hub/
- Full explanations, context, references
- All the detail needed for self-study

### Part 2: Slides (after the separator)

Everything **below** the `SLIDE CONTENT` ASCII art separator becomes **workshop slides**:
- Look for the big ASCII art banner
- Below it are `<!-- SLIDE:xxx -->` markers
- Content between markers = presentation slides
- Condensed for in-person delivery

---

## How to Contribute

### To update methodology content (no technical skills needed):

1. Open a file in `methodology/`
2. Edit the **documentation content** (above the separator)
3. Edit the **slide content** (below the separator)
4. Save and push to GitHub
5. Website updates automatically

### To extract slides after editing (basic terminal use):

After editing slide content, run:
```bash
python3 tools/00_extract_slides.py
```
This extracts SLIDE-marked content into `core_content/` for use in workshops.

### To create a workshop presentation (basic terminal use):

Use the web app:
```bash
cd web-app && ./dev.sh start
# Open http://localhost:5173
```

The web app lets you create workshops, build schedules (with AI assistance), and export to Markdown, PDF, or PowerPoint.

---

## Other Guides

| Guide | Skill level | When to read it |
|-------|-------------|-----------------|
| [01 Editing Content](01_editing_content.md) | Everyone | Markdown syntax & SLIDE markers |
| [03 Local Setup](03_local_setup.md) | Beginner | Installing Git, Python, VS Code on your computer |
| [04 Codespaces Setup](04_codespaces_setup.md) | Everyone | Working in browser (no install needed) |
| [05 Content Action Plan](05_content_action_plan.md) | Everyone | Slide content status & tasks to delegate |
| [07 Style Guide](07_style_guide.md) | Everyone | Formatting conventions for methodology docs |
| [08 Code Reference](08_code_reference.md) | Developer | R module code reference for AI assistants |
| [09 Translation Workflow](09_translation_workflow.md) | Developer | French translation process |

---

## Quick Reference

### Where is everything?

| Folder | What's in it |
|--------|--------------|
| `methodology/` | Module source files you edit |
| `core_content/` | Auto-generated slides (don't edit directly) |
| `core_content_fr/` | French translations |
| `modules.yaml` | Module definitions (single source of truth) |
| `web-app/` | Deck Builder web application |
| `tools/` | Extraction and validation scripts |

### Tools

| Command | What it does |
|---------|--------------|
| `python3 tools/00_extract_slides.py` | Extract slides from methodology |
| `python3 tools/validate_content.py` | Validate content consistency |
| `python3 tools/migrate_to_meta.py` | Regenerate module metadata |

### Web app (for workshops and exports)

```bash
cd web-app && ./dev.sh start
# Open http://localhost:5173
```

---

## Need Help?

- **Documentation website:** https://fastr-analytics.github.io/fastr-resource-hub/
- **Questions:** Contact the FASTR team
