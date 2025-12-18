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
- https://fastr-analytics.github.io/fastr-slide-builder/
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

### To update methodology content:

1. Open a file in `methodology/`
2. Edit the **documentation content** (above the separator)
3. Edit the **slide content** (below the separator)
4. Save and push to GitHub
5. Website updates automatically

### To extract slides for workshops:

After editing slide content, run:
```bash
python3 tools/00_extract_slides.py
```
This extracts SLIDE-marked content into `core_content/` for use in workshops.

### To create a workshop presentation:

```bash
python3 tools/01_new_workshop.py       # Interactive wizard
python3 tools/02_build_deck.py         # Build deck
marp --no-config outputs/YOUR_deck.md --theme fastr-theme.css --pdf -o outputs/YOUR_deck.pdf
```

---

## Other Guides

| Guide | When to read it |
|-------|-----------------|
| [01 Editing Content](01_editing_content.md) | Markdown syntax & SLIDE markers |
| [02 Building Workshops](02_building_workshops.md) | Creating workshop presentations |
| [03 Local Setup](03_local_setup.md) | Setting up your computer |
| [04 Codespaces Setup](04_codespaces_setup.md) | Working in browser (no install needed) |
| [05 Content Action Plan](05_content_action_plan.md) | Slide content status & tasks to delegate |

---

## Quick Reference

### Where is everything?

| Folder | What's in it |
|--------|--------------|
| `methodology/` | The 9 module files you edit |
| `core_content/` | Auto-generated slides (don't edit directly) |
| `workshops/` | Workshop configurations |
| `tools/` | Build scripts |
| `outputs/` | Generated presentations |

### The tools

| Command | What it does |
|---------|--------------|
| `python3 tools/00_extract_slides.py` | Extract slides from methodology |
| `python3 tools/01_new_workshop.py` | Create new workshop |
| `python3 tools/02_build_deck.py` | Validate + Build the slide deck |
| `python3 tools/03_convert_pptx.py` | Convert to PowerPoint |

---

## Need Help?

- **Documentation website:** https://fastr-analytics.github.io/fastr-slide-builder/
- **Example workshop:** Look at `workshops/example/`
- **Questions:** Contact the FASTR team
