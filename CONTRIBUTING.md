# Contributing to FASTR Slide Builder

Thank you for contributing! This guide covers how to update content and create workshops.

---

## Quick Reference

- **Edit methodology content:** Work in `methodology/` folder
- **Create workshops:** Run `python3 tools/01_new_workshop.py`
- **Full documentation:** https://fastr-analytics.github.io/fastr-slide-builder/
- **Help guides:** See `help and instructions/` folder

---

## The Single Source of Truth

All FASTR methodology content lives in **`methodology/`**. This is the ONLY place to edit content.

```
methodology/                    ← Edit HERE
├── 00_introduction.md
├── 04_data_quality_assessment.md
├── 05_data_quality_adjustment.md
├── 06a_service_utilization.md
├── 06b_coverage_estimates.md
└── ...

    ↓ python3 tools/00_extract_slides.py

core_content/                   ← Auto-generated (don't edit)
```

**Never edit files in `core_content/` directly** - they are regenerated from methodology files.

---

## Updating Methodology Content

### 1. Edit the methodology file

Open a file in `methodology/` and make your changes:

```bash
# Example: editing data quality assessment
code methodology/04_data_quality_assessment.md
```

### 2. Mark slide content (if needed)

Wrap content that should become slides with SLIDE markers:

```markdown
Regular documentation text here (won't be a slide).

<!-- SLIDE:m4_1 -->
## This Becomes a Slide

- Bullet points
- More content

![Image](resources/default_outputs/chart.png)
<!-- /SLIDE -->

More documentation text (won't be a slide).
```

### 3. Extract slides

After editing, regenerate the slide files:

```bash
python3 tools/00_extract_slides.py
```

### 4. Test your changes

```bash
# Build example workshop
python3 tools/02_build_deck.py --workshop example

# Export to PDF
marp --no-config outputs/example_deck.md --theme fastr-theme.css --pdf --allow-local-files

# View result
open outputs/example_deck.pdf
```

### 5. Commit both methodology and core_content

```bash
git add methodology/ core_content/
git commit -m "Update DQA section with new content"
git push
```

---

## Creating a Workshop

### 1. Run the wizard

```bash
python3 tools/01_new_workshop.py
```

### 2. Edit your workshop files

```
workshops/YOUR_WORKSHOP/
├── config.py           # Workshop settings, deck order, country data
├── objectives.md       # Custom slide
├── dq-findings.md      # Custom slide
└── ...
```

### 3. Build and test

```bash
python3 tools/02_build_deck.py --workshop YOUR_WORKSHOP
marp --no-config outputs/YOUR_WORKSHOP_deck.md --theme fastr-theme.css --pdf --allow-local-files
```

### 4. Commit

```bash
git add workshops/YOUR_WORKSHOP/
git commit -m "Add workshop for Country 2025"
git push
```

---

## Setup Options

### GitHub Codespaces (Recommended)

No installation needed:

1. Go to https://github.com/FASTR-Analytics/fastr-slide-builder
2. Click **Code** → **Codespaces** → **Create codespace**
3. Everything is ready in 2-3 minutes

### Local Setup

See [help and instructions/03_local_setup.md](help%20and%20instructions/03_local_setup.md)

```bash
git clone https://github.com/FASTR-Analytics/fastr-slide-builder.git
cd fastr-slide-builder
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Commit Guidelines

### Format

```
<type>: <short description>
```

### Types

- `content:` - Methodology content changes
- `workshop:` - Workshop additions/updates
- `tools:` - Build script updates
- `docs:` - Documentation updates
- `fix:` - Bug fixes

### Examples

```bash
git commit -m "content: Update DQA completeness section"
git commit -m "workshop: Add Nigeria 2025 workshop"
git commit -m "tools: Fix slide extraction for module 6"
git commit -m "docs: Update README with new workflow"
```

---

## Questions?

- Check the [Methodology Documentation](https://fastr-analytics.github.io/fastr-slide-builder/)
- Review `workshops/example/` for reference
- Contact the FASTR team
