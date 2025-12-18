# Building FASTR Workshop Decks

Step-by-step guide for creating FASTR workshop presentations.

---

## Quick Start

```bash
# 1. Create workshop (interactive wizard)
python3 tools/01_new_workshop.py

# 2. Edit your files
#    - workshop.yaml (workshop details, country data)
#    - Custom slide .md files (your content)

# 3. Build the deck (validates automatically)
python3 tools/02_build_deck.py --workshop YOUR_WORKSHOP

# 4. Export to PDF
marp --no-config outputs/YOUR_WORKSHOP_deck.md --theme fastr-theme.css --pdf --allow-local-files
```

---

## Part 1: Create Your Workshop

### Run the Setup Wizard

```bash
python3 tools/01_new_workshop.py
```

The wizard asks for:
- Workshop name (e.g., "FASTR Workshop - Nigeria")
- Location (e.g., "Abuja, Nigeria")
- Date (e.g., "January 15-17, 2025")
- Facilitators
- Number of days (1, 2, or 3)
- Which modules to include

### What Gets Created

```
workshops/2025-nigeria/
├── config.py                    # Workshop settings & country data
├── objectives.md                # Custom slide: workshop goals
├── country-overview.md          # Custom slide: country context
├── dq-findings.md               # Custom slide: DQ results
├── next-steps.md                # Custom slide: action items
└── media/                       # Workshop-specific images
```

---

## Part 2: Customize Your Content

### Edit config.py

**Basic Info:**
```python
'name': 'FASTR Workshop - Nigeria',
'date': 'January 15-17, 2025',
'location': 'Abuja, Nigeria',
'facilitators': 'Dr. Adeyemi, Dr. Okafor',
```

**Deck Order:**
```python
'deck_order': [
    'agenda',              # Built-in agenda slide
    'objectives.md',       # Your custom slide
    'intro',               # Built-in session
    'dq_assessment',       # Built-in session
    'dq-findings.md',      # Your custom slide
],
```

**Country Data (auto-fills into slides):**
```python
'country_data': {
    'total_facilities': '2,847',
    'reporting_rate': '92%',
    'survey_anc1': '87%',
}
```

Use `{{variable_name}}` in any slide to insert these values.

---

## Part 3: Build

```bash
python3 tools/02_build_deck.py --workshop 2025-nigeria
```

The build script automatically validates:
- Required fields (name, date, location)
- Files in deck_order exist
- Variables used have values in country_data

Output: `outputs/2025-nigeria_deck.md`

---

## Part 4: Export

### PDF (Recommended)

```bash
marp --no-config outputs/2025-nigeria_deck.md --theme fastr-theme.css --pdf --allow-local-files
```

Output: `outputs/2025-nigeria_deck.pdf`

### PowerPoint (Alternative)

```bash
python3 tools/03_convert_pptx.py outputs/2025-nigeria_deck.md
```

Note: PowerPoint may need font/layout adjustments after export.

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

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| Workshop not found | Check folder name matches --workshop argument |
| Config not found | Ensure config.py exists in workshop folder |
| Variable not defined | Add to country_data in config.py |
| marp: command not found | Install: `npm install -g @marp-team/marp-cli` |
| No styling in PDF | Use `--theme fastr-theme.css` (not --theme-set) |

---

## Quick Reference

```bash
# Create workshop
python3 tools/01_new_workshop.py

# Build deck (validates automatically)
python3 tools/02_build_deck.py --workshop WORKSHOP_ID

# Export to PDF
marp --no-config outputs/WORKSHOP_ID_deck.md --theme fastr-theme.css --pdf --allow-local-files

# Preview in browser
marp --no-config --preview outputs/WORKSHOP_ID_deck.md --theme fastr-theme.css
```
