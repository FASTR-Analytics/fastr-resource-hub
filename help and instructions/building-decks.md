# Building FASTR Workshop Decks

Step-by-step guide for creating FASTR workshop presentations.

## Quick Start

```bash
# 1. Create workshop (interactive wizard)
python3 tools/01_setup_workshop.py

# 2. Edit your files
#    - config.py (workshop details, country data)
#    - Custom slide .md files (your content)
#    - assets/fastr-outputs/ (replace with your country charts)

# 3. Check setup (catches common issues)
python3 tools/02_check_workshop.py --workshop YOUR_WORKSHOP

# 4. Build the deck
python3 tools/03_build_deck.py --workshop YOUR_WORKSHOP

# 5. Export to PDF
marp outputs/YOUR_WORKSHOP_deck.md --theme-set fastr-theme.css --pdf
```

---

## Part 1: Create Your Workshop

### Step 1: Run the Setup Wizard

```bash
python3 tools/01_setup_workshop.py
```

The wizard asks for:
- Workshop name (e.g., "FASTR Workshop - Nigeria")
- Location (e.g., "Abuja, Nigeria")
- Date (e.g., "January 15-17, 2025")
- Facilitators
- Number of days (1, 2, or 3)

### What Gets Created

```
workshops/2025-nigeria/
├── config.py                    # Workshop settings & country data
├── README.md                    # Instructions for this workshop
├── agenda.png                   # Placeholder - replace with yours
│
├── objectives.md                # Custom slide: workshop goals
├── country-overview.md          # Custom slide: country context
├── health-priorities.md         # Custom slide: health priorities
├── dq-findings.md               # Custom slide: DQ results
├── disruption-local.md          # Custom slide: disruption data
├── coverage-results.md          # Custom slide: coverage results
├── next-steps.md                # Custom slide: action items
│
└── assets/
    └── fastr-outputs/           # FASTR visualizations
        ├── README.md            # Explains what to replace
        ├── m1_*.png             # Data quality charts (defaults)
        └── m2_*.png             # Data adjustment charts (defaults)
```

---

## Part 2: Customize Your Content

### Edit config.py

The config has four main sections:

**Section 1: Basic Info**
```python
'name': 'FASTR Workshop - Nigeria',
'date': 'January 15-17, 2025',
'location': 'Abuja, Nigeria',
'facilitators': 'Dr. Adeyemi, Dr. Okafor',
```

**Section 2: Deck Order**
Control which slides appear and in what order:
```python
'deck_order': [
    'agenda',              # Built-in agenda slide
    'objectives.md',       # Your custom slide
    'country-overview.md', # Your custom slide
    'intro',               # Built-in session
    'dq_assessment',       # Built-in session
    'dq-findings.md',      # Your custom slide
    # ... etc
],
```

**Section 3: Schedule**
```python
'workshop_days': 2,
'tea_time': '10:45 AM',
'lunch_time': '1:00 PM',
```

**Section 4: Country Data**
Fill in your country statistics - they auto-fill into slides:
```python
'country_data': {
    'total_facilities': '2,847',
    'reporting_rate': '92%',
    'survey_anc1': '87%',
    # ... etc
}
```

Use `{{variable_name}}` in any slide to insert these values.

### Edit Custom Slides

Each `.md` file is a custom slide. Edit them with your content:

```markdown
# Workshop Objectives

By the end of this workshop, participants will:

1. Understand FASTR methodology
2. Apply data quality assessment techniques
3. Generate coverage estimates for {{LOCATION}}
4. Develop action plans based on findings

---
```

### Replace FASTR Visualizations

Your workshop folder has default charts in `assets/fastr-outputs/`.
Replace them with your country's actual FASTR outputs:

1. Run your FASTR analysis
2. Export visualizations with the **same filenames**
3. Copy to `assets/fastr-outputs/`, replacing the defaults
4. Build - your charts appear in the slides

**Files to replace:**
- `m1_Proportion_of_completed_records.png`
- `m1_Proportion_of_outliers.png`
- `m1_Overall_DQA_score.png`
- `m2_Volume_change_due_to_data_quality_adjustments.png`
- ... (see README in that folder for full list)

### Add Your Agenda Image

Replace `agenda.png` with your actual workshop agenda image.

---

## Part 3: Check Your Setup

Before building, run the check tool to catch common issues:

```bash
python3 tools/02_check_workshop.py --workshop 2025-nigeria
```

**What it checks:**
- Config.py syntax is valid
- All files in deck_order exist
- All `{{variables}}` have values defined
- All image paths resolve correctly

**Example output:**
```
Checking workshop: 2025-nigeria
============================================================

1. Config file...
   OK: config.py loads successfully

2. Required fields...
   OK: All required fields populated

3. Deck order files...
   OK: All 15 files found

4. Variable definitions...
   OK: All variables defined (29 used, 25 country-specific)

5. Image paths...
   OK: All 11 images found

============================================================
SUMMARY
============================================================

  All checks passed!

  Ready to build:
    python3 tools/03_build_deck.py --workshop 2025-nigeria
```

---

## Part 4: Build Your Deck

```bash
python3 tools/03_build_deck.py --workshop 2025-nigeria
```

**What happens:**
1. Reads your config.py
2. Assembles slides in deck_order sequence
3. Replaces all `{{variables}}` with your values
4. Uses your country charts (if you replaced them)
5. Adds breaks at appropriate points
6. Outputs to `outputs/2025-nigeria_deck.md`

---

## Part 5: Export to PDF

```bash
marp outputs/2025-nigeria_deck.md --theme-set fastr-theme.css --pdf
```

**Output:** `outputs/2025-nigeria_deck.pdf`

### Why PDF is Recommended
- Perfect FASTR styling
- Consistent across all platforms
- No font issues
- Ready to present

### Preview Before Export

```bash
marp --preview outputs/2025-nigeria_deck.md --theme-set fastr-theme.css
```

Opens in browser for quick review.

---

## Part 6: Export to PowerPoint (Alternative)

Use PowerPoint if you need to edit slides after export:

```bash
python3 tools/04_convert_to_pptx.py outputs/2025-nigeria_deck.md
```

**Note:** PowerPoint may need font/layout adjustments after export.

---

## Built-in Sessions

Use these IDs in your `deck_order`:

| Session ID | Content | Duration |
|------------|---------|----------|
| `intro` | Background & FASTR Approach | ~30 min |
| `extraction` | Data Extraction from DHIS2 | ~45 min |
| `dq_assessment` | Data Quality Assessment | ~90 min |
| `dq_adjustment` | Data Adjustment Methods | ~60 min |
| `disruption` | Service Disruption Detection | ~90 min |
| `coverage` | Coverage Analysis | ~90 min |
| `facility` | Facility Assessments | ~30 min |

---

## Troubleshooting

### Check Tool Errors

| Error | Solution |
|-------|----------|
| Config.py syntax error | Fix Python syntax in config.py |
| Custom slide missing | Create the file or remove from deck_order |
| Variable not defined | Add to country_data in config.py |
| Image not found | Check file exists at the path |

### Build Errors

| Error | Solution |
|-------|----------|
| Workshop not found | Check folder name matches --workshop argument |
| Config not found | Ensure config.py exists in workshop folder |

### PDF Rendering Issues

| Issue | Solution |
|-------|----------|
| Command not found: marp | Install: `npm install -g @marp-team/marp-cli` |
| No styling | Include `--theme-set fastr-theme.css` |
| Images missing | Check paths start with `../assets/` |

---

## Quick Reference

```bash
# Create workshop
python3 tools/01_setup_workshop.py

# Check setup
python3 tools/02_check_workshop.py --workshop WORKSHOP_ID

# Build deck
python3 tools/03_build_deck.py --workshop WORKSHOP_ID

# Export to PDF
marp outputs/WORKSHOP_ID_deck.md --theme-set fastr-theme.css --pdf

# Export to PowerPoint
python3 tools/04_convert_to_pptx.py outputs/WORKSHOP_ID_deck.md

# Preview in browser
marp --preview outputs/WORKSHOP_ID_deck.md --theme-set fastr-theme.css
```

---

## Next Steps

- **[Markdown Guide](markdown-guide.md)** - Slide syntax reference
- **[Local Setup](local-setup.md)** - Installation instructions
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines
