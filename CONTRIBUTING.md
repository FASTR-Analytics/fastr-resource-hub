# Contributing to FASTR Resource Hub

This guide covers how to update methodology content and work with the web app.

---

## Quick Reference

| Task | How |
|------|-----|
| Edit content | Work in `methodology/` folder |
| Extract slides | `python3 tools/00_extract_slides.py` |
| Build workshops | Use the web app at http://localhost:5173 |
| Validate content | `python3 tools/validate_content.py` |

---

## Understanding the File Structure

### Each methodology file has two parts:

```
methodology/04_data_quality_assessment.md
┌─────────────────────────────────────────────────────────────────────┐
│  # Data Quality Assessment                                          │
│  Full documentation content here...                                 │  → Website
├─────────────────────────────────────────────────────────────────────┤
│  <!-- SLIDE:m4_1 -->                                                │
│  ## Slide Title                                                     │
│  Condensed bullet points for workshops                              │  → Workshops
│  <!-- /SLIDE -->                                                    │
└─────────────────────────────────────────────────────────────────────┘
```

- **Above the ASCII banner** = Documentation website content
- **Below the ASCII banner** = Workshop slide content

---

## Updating Methodology Content

### 1. Edit the methodology file

```bash
# Open in your editor
code methodology/04_data_quality_assessment.md
```

### 2. Edit both parts as needed

- Update documentation content (above separator)
- Update slide content (below separator, in SLIDE markers)

### 3. Extract slides

```bash
python3 tools/00_extract_slides.py
```

This regenerates `core_content/` and `_meta.yaml` files from methodology.

### 4. Preview in the web app

```bash
cd web-app && ./dev.sh start
# Open http://localhost:5173
```

### 5. Commit

```bash
git add methodology/ core_content/
git commit -m "content: Update DQA section"
```

---

## Creating a Workshop

Workshops are created and managed through the web app:

1. Start the web app: `cd web-app && ./dev.sh start`
2. Open http://localhost:5173
3. Use the Workshop Builder to create a new workshop
4. Configure schedule, modules, and settings
5. Export to Markdown, PDF, or PowerPoint

---

## SLIDE Marker Reference

### Basic syntax

```markdown
<!-- SLIDE:m4_1 -->
## Slide Title

- Bullet point
- Another point

![Chart](resources/default_outputs/chart.png)
<!-- /SLIDE -->
```

### Slide ID format

Use pattern: `m{module}_{number}`

| Module | Example IDs |
|--------|-------------|
| Introduction (m0) | `m0_1`, `m0_2`, `m0_3` |
| Questions (m1) | `m1_1`, `m1_2` |
| Extraction (m2) | `m2_1`, `m2_2` |
| Platform (m3) | `m3_1`, `m3_2`, ... `m3_8` |
| DQA (m4) | `m4_1`, `m4_2`, `m4_3` |
| Adjustment (m5) | `m5_1`, `m5_2` |
| Analysis (m6) | `m6_1`, `m6_2`, ... `m6_5` |
| Results (m7) | `m7_1`, `m7_2` |
| AI Assistant (mai) | `mai_1`, `mai_2`, ... |
| Condensed (any) | `m4_s1`, `m4_s2` (prefix with `_s`) |

---

## Metadata System

Module definitions live in `modules.yaml` at the repo root. Each module folder has a `_meta.yaml` listing its slides with ordering and variant info.

- **Regenerate metadata:** `python3 tools/migrate_to_meta.py`
- **Validate metadata:** `python3 tools/validate_content.py`
- **Auto-regenerated** when running `tools/00_extract_slides.py`

---

## Setup

### Local Setup

```bash
git clone https://github.com/FASTR-Analytics/fastr-resource-hub.git
cd fastr-resource-hub
cd web-app && npm install
./dev.sh start
```

---

## Commit Message Format

```
<type>: <short description>
```

| Type | Use for |
|------|---------|
| `content:` | Methodology content changes |
| `tools:` | Build script changes |
| `docs:` | Documentation updates |
| `fix:` | Bug fixes |

---

## Questions?

- **Documentation:** https://fastr-analytics.github.io/fastr-resource-hub/
- **Help guides:** See `help and instructions/` folder
- **Contact:** FASTR team
