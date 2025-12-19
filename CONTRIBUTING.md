# Contributing to FASTR Slide Builder

This guide covers how to update methodology content and create workshop presentations.

---

## Quick Reference

| Task | Command |
|------|---------|
| Edit content | Work in `methodology/` folder |
| Extract slides | `python3 tools/00_extract_slides.py` |
| Create workshop | `python3 tools/01_new_workshop.py` |
| Build deck | `python3 tools/02_build_deck.py --workshop NAME` |

---

## Understanding the File Structure

### Each methodology file has two parts:

```
methodology/04_data_quality_assessment.md
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  # Data Quality Assessment                                          │
│                                                                     │
│  Full documentation content here...                                 │
│  This appears on the methodology website.                           │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  <!--                                                               │
│  ////////////////////////////////////////////////////////////////////│
│  //   _____ _     _____ ____  _____    ____ ___  _   _ _____ _   _ //│
│  //  / ____| |   |_   _|  _ \| ____|  / ___/ _ \| \ | |_   _| \ | |//│
│  //   ... SLIDE CONTENT ...                                        //│
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

This regenerates `core_content/` from methodology files.

### 4. Test with a build

```bash
python3 tools/02_build_deck.py --workshop example
```

### 5. Commit both folders

```bash
git add methodology/ core_content/
git commit -m "content: Update DQA section"
git push
```

---

## Creating a Workshop

### 1. Run the wizard

```bash
python3 tools/01_new_workshop.py
```

The wizard asks for:
- Workshop name and location
- Date and facilitators
- Number of days
- Which modules to include

### 2. What gets created

```
workshops/2025-nigeria/
├── workshop.yaml              # Settings, schedule, country data
├── 01_objectives.md           # Custom slide: workshop goals
├── 02_country-overview.md     # Custom slide: country context
├── 03_health-priorities.md    # Custom slide: focus areas
├── 99_next-steps.md           # Custom slide: action items
└── media/                     # Workshop-specific images
```

### 3. Customize workshop.yaml

```yaml
workshop:
  name: "FASTR Workshop - Nigeria"
  date: "January 15-17, 2025"
  location: "Abuja, Nigeria"

country_data:
  total_facilities: "2,847"
  reporting_rate: "92%"
  # Add your country's data here
```

Variables like `{{total_facilities}}` in slides get replaced with these values.

### 4. Build and export

```bash
# Build (validates automatically)
python3 tools/02_build_deck.py --workshop 2025-nigeria

# Export to PDF
marp --no-config outputs/2025-nigeria_deck.md --theme fastr-theme.css --pdf --allow-local-files
```

### 5. Commit your workshop

```bash
git add workshops/2025-nigeria/
git commit -m "workshop: Add Nigeria 2025"
git push
```

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

---

## Setup Options

### GitHub Codespaces (No installation needed)

1. Go to https://github.com/FASTR-Analytics/fastr-resource-hub
2. Click **Code** → **Codespaces** → **Create codespace**
3. Ready in 2-3 minutes

### Local Setup

```bash
git clone https://github.com/FASTR-Analytics/fastr-resource-hub.git
cd fastr-resource-hub
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
npm install -g @marp-team/marp-cli
```

---

## Commit Message Format

```
<type>: <short description>
```

| Type | Use for |
|------|---------|
| `content:` | Methodology content changes |
| `workshop:` | Workshop additions/updates |
| `tools:` | Build script changes |
| `docs:` | Documentation updates |
| `fix:` | Bug fixes |

Examples:
```bash
git commit -m "content: Update DQA completeness section"
git commit -m "workshop: Add Nigeria 2025 workshop"
git commit -m "fix: Correct image path in module 3"
```

---

## Questions?

- **Documentation:** https://fastr-analytics.github.io/fastr-resource-hub/
- **Help guides:** See `help and instructions/` folder
- **Contact:** FASTR team
