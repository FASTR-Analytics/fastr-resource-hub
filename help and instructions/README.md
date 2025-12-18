# FASTR Slide Builder - Help & Instructions

Quick guides for using the FASTR slide builder.

**Methodology Documentation:** https://fastr-analytics.github.io/fastr-slide-builder/

---

## Guides

| Guide | What it covers |
|-------|----------------|
| [Building Decks](building-decks.md) | Creating workshop presentations |
| [Local Setup](local-setup.md) | Installing on your machine |
| [Codespaces Workflow](codespaces-workflow.md) | Working in GitHub Codespaces |
| [Markdown Guide](markdown-guide.md) | Slide syntax reference |

---

## How It Works: Single Source of Truth

All FASTR methodology content lives in **`methodology/`**. This is the ONLY place you edit content.

The methodology folder serves two purposes:
1. **Documentation website** - Full readable docs at https://fastr-analytics.github.io/fastr-slide-builder/
2. **Slide content source** - Sections marked with `<!-- SLIDE -->` tags become workshop slides

```
methodology/                    ← ALWAYS edit content HERE
├── 00_introduction.md
├── 04_data_quality_assessment.md
├── 05_data_quality_adjustment.md
├── 06a_service_utilization.md
└── ...

    ↓ Run: python3 tools/00_extract_slides.py

core_content/                   ← Auto-generated (don't edit directly)
├── m4_data_quality_assessment/
│   ├── m4_1_approach_to_dqa.md
│   ├── m4_2_indicator_completeness.md
│   └── ...
└── ...
```

---

## Marking Content as Slides

This is the key concept. Inside any methodology file, you wrap content with SLIDE markers to indicate what should become a slide.

### Basic Syntax

```markdown
<!-- SLIDE:slide_id -->
Content that will become a slide
<!-- /SLIDE -->
```

### Slide ID Format

Use this pattern: `m{module}_{section}`

| Module | Example IDs |
|--------|-------------|
| Module 0 (Introduction) | `m0_1`, `m0_2`, `m0_3` |
| Module 4 (Data Quality Assessment) | `m4_1`, `m4_2`, `m4_3` |
| Module 5 (Data Quality Adjustment) | `m5_1`, `m5_2`, `m5_3` |
| Module 6a (Service Utilization) | `m6a_1`, `m6a_2` |
| Module 6b (Coverage) | `m6b_1`, `m6b_2` |

### Complete Example

Here's how a methodology file looks with slide markers:

```markdown
# Data Quality Assessment

This introduction paragraph is part of the full documentation
but will NOT appear in slides.

<!-- SLIDE:m4_1 -->
## What is Data Quality Assessment?

Data quality assessment evaluates HMIS data through three lenses:

- **Completeness** - Are facilities reporting?
- **Outliers** - Are there extreme values?
- **Consistency** - Do related indicators align?

![DQA Overview](resources/diagrams/dqa_overview.png)
<!-- /SLIDE -->

This paragraph between slides is documentation-only.

<!-- SLIDE:m4_2 -->
## Indicator Completeness

Completeness measures the proportion of expected reports
that were actually submitted.

**Formula:**
Completeness = (Reports Received / Reports Expected) × 100

![Completeness Chart](resources/default_outputs/completeness.png)
<!-- /SLIDE -->

Additional documentation text continues here...
```

### What Happens When You Extract

Running `python3 tools/00_extract_slides.py` creates:

```
core_content/m4_data_quality_assessment/
├── m4_1_approach_to_dqa.md     ← Contains first SLIDE block
├── m4_2_indicator_completeness.md  ← Contains second SLIDE block
└── ...
```

Each extracted file contains ONLY the content between `<!-- SLIDE:xxx -->` and `<!-- /SLIDE -->`.

### Rules for Slide Markers

1. **Unique IDs** - Each slide ID must be unique across all files
2. **Matching tags** - Every `<!-- SLIDE:xxx -->` needs a matching `<!-- /SLIDE -->`
3. **No nesting** - Don't put SLIDE markers inside other SLIDE markers
4. **Images** - Use paths relative to methodology folder: `resources/...`

### Quick Workflow

```bash
# 1. Edit a methodology file
#    Add or modify content between SLIDE markers

# 2. Extract slides
python3 tools/00_extract_slides.py

# 3. Build a workshop deck to test
python3 tools/03_build_deck.py --workshop example

# 4. Export to see the result
marp outputs/example_deck.md --theme-set fastr-theme.css --pdf
```

---

## Tools Reference

| Tool | Purpose |
|------|---------|
| `tools/00_extract_slides.py` | Extract slides from methodology files |
| `tools/01_new_workshop.py` | Create a new workshop folder |
| `tools/02_check_workshop.py` | Validate workshop setup |
| `tools/03_build_deck.py` | Build slide deck from workshop config |
| `tools/04_convert_pptx.py` | Export deck to PowerPoint |

---

## Quick Commands

```bash
# Extract slides from methodology (run after editing methodology files)
python3 tools/00_extract_slides.py

# Create new workshop
python3 tools/01_new_workshop.py

# Build deck
python3 tools/03_build_deck.py --workshop YOUR_WORKSHOP

# Export to PDF
marp outputs/YOUR_WORKSHOP_deck.md --theme-set fastr-theme.css --pdf

# Serve docs locally (view methodology website)
source .venv/bin/activate && mkdocs serve -f methodology/mkdocs.yml
```

---

## Need Help?

1. Check the [Methodology Documentation](https://fastr-analytics.github.io/fastr-slide-builder/)
2. Review `workshops/example/` for a reference implementation
3. Look at existing methodology files to see slide marker examples
4. Contact the FASTR team
