# Start Here

Welcome! This guide explains how the FASTR slide builder works.

---

## The One Thing You Need to Know

**All your work happens in the `methodology/` folder.**

To contribute to methodology content AND slide content, you only need to work in the `methodology/` folder. That's it.

---

## What is this project?

The `methodology/` folder contains the entire **FASTR RMNCAH-N Service Use Monitoring Resource Package**. The methodology chapters are:

| File | Chapter |
|------|---------|
| `00_introduction.md` | Introduction to FASTR |
| `01_identify_questions_indicators.md` | Identify questions & indicators |
| `02_data_extraction.md` | Data extraction |
| `03_fastr_analytics_platform.md` | The FASTR analytics platform |
| `03b_ai_assistant.md` | AI Assistant |
| `04_data_quality_assessment.md` | Data quality assessment |
| `05_data_quality_adjustment.md` | Data quality adjustment |
| `06a_service_utilization.md` | Service utilization analysis |
| `06b_coverage_estimates.md` | Coverage estimates |
| `07_results_communication.md` | Results communication |
| `08_survey_hfa.md` | Survey & HFA |
| `11_user_guide.md` | Platform user guide |

The same chapter files exist in `methodology/fr/` (French) and `methodology/pt/` (Portuguese), mirroring the English source. The workshop deck library on top of these chapters is broken down further into smaller modules — see `modules.yaml` at the repo root for the full module registry.

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
- https://fastr-analytics.org
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
| [02 Local Setup](02_local_setup.md) | Beginner | Installing Git, Python, VS Code on your computer |
| [03 Codespaces Setup](03_codespaces_setup.md) | Everyone | Working in browser (no install needed) |
| [04 Content Action Plan](04_content_action_plan.md) | Everyone | Slide content status & tasks to delegate |
| [05 Style Guide](05_style_guide.md) | Everyone | Formatting conventions for methodology docs |
| [06 Code Reference](06_code_reference.md) | Developer | Map from methodology chapters to the FASTR-Analytics/modules code repo |
| [07 Translation Workflow](07_translation_workflow.md) | Everyone | DeepL-backed FR + PT translation process + REVIEWED marker |
| [08 Handouts Collaborator Guide](08_handouts_collaborator_guide.md) | Collaborator | Drafting condensed handouts with Claude Code |

---

## Quick Reference

### Where is everything?

| Folder | What's in it |
|--------|--------------|
| `methodology/` | Methodology chapters you edit (EN source) |
| `methodology/fr/`, `methodology/pt/` | French and Portuguese mirrors |
| `core_content/` | Auto-generated slide library (don't edit directly) |
| `core_content_fr/`, `core_content_pt/` | French and Portuguese slide mirrors |
| `templates/`, `templates_fr/`, `templates_pt/` | Slide templates (title, breaks, etc.) per language |
| `handouts/` | Participant + facilitator handouts (EN, FR, PT) |
| `modules.yaml` | Module definitions (single source of truth) |
| `web-app/` | Deck Builder web application |
| `tools/` | Extraction, validation, translation, and render scripts |
| `FASTR Design System/` | Brand tokens, slide templates, web UI kit |

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

- **Documentation website:** https://fastr-analytics.org
- **Questions:** Contact the FASTR team
