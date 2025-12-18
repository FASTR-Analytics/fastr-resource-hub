# Building FASTR Workshop Decks

Step-by-step guide for creating FASTR workshop presentations.

---

## Quick Start

```bash
# 1. Create workshop (interactive wizard)
python3 tools/01_new_workshop.py

# 2. Edit your files
#    - workshop.yaml (settings, schedule, country data)
#    - Custom slide .md files

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
- Country and location
- Date and facilitators
- Number of days (1-5)
- Which modules to include (type `all` for all modules)

### What Gets Created

```
workshops/2025-nigeria/
├── workshop.yaml              # Settings, schedule, country data
├── 01_objectives.md           # Custom slide: workshop goals
├── 02_country-overview.md     # Custom slide: country context
├── 03_health-priorities.md    # Custom slide: focus areas
├── 04_coverage-results.md     # Custom slide: results
├── 05_disruption-local.md     # Custom slide: disruption analysis
├── 06_dq-findings.md          # Custom slide: DQ findings
├── 99_next-steps.md           # Custom slide: action items
├── media/                     # Workshop-specific images
│   └── outputs/               # FASTR platform outputs
└── README.md                  # Workshop documentation
```

---

## Part 2: Customize Your Content

### Edit workshop.yaml

**Basic Info:**
```yaml
workshop:
  id: "2025-nigeria"
  name: "FASTR Workshop - Nigeria"
  country: "Nigeria"
  location: "Abuja, Nigeria"
  date: "January 15-17, 2025"
  facilitators: "Dr. Adeyemi, Dr. Okafor"
```

**Schedule (auto-generated, can customize):**
```yaml
schedule:
  days: 3
  start_time: "9:00 AM"
  tea_time: "10:30 AM"
  lunch_time: "12:30 PM"
  afternoon_tea: "3:30 PM"
```

**Deck Order (modules and custom slides):**
```yaml
content:
  deck_order:
    - agenda
    - 01_objectives.md        # Custom slide
    - m0                      # Module 0: Introduction
    - 02_country-overview.md  # Custom slide
    - m1                      # Module 1: Questions
    - m2                      # Module 2: Extraction
    - m3                      # Module 3: Platform (auto-splits if >90 min)
    - m4                      # Module 4: DQA
    - m5                      # Module 5: Adjustment
    - m6                      # Module 6: Analysis
    - m7                      # Module 7: Results
    - 99_next-steps.md        # Custom slide
```

**Country Data (fills {{placeholders}} in slides):**
```yaml
country_data:
  total_facilities: "2,847"
  facilities_reporting: "2,623"
  reporting_rate: "92%"
  total_population: "220 million"
  last_survey: "DHS 2023"
```

---

## Part 3: Build

```bash
python3 tools/02_build_deck.py --workshop 2025-nigeria
```

The build script automatically:
- Validates required fields
- Checks all files exist
- Warns about undefined variables
- Generates full-day schedules (9 AM - 5 PM)
- Inserts breaks at appropriate times

Output: `outputs/2025-nigeria_deck.md`

---

## Part 4: Export

### PDF (Recommended)

```bash
marp --no-config outputs/2025-nigeria_deck.md --theme fastr-theme.css --pdf --allow-local-files
```

### PowerPoint (Alternative)

```bash
python3 tools/03_convert_pptx.py outputs/2025-nigeria_deck.md
```

Note: PowerPoint may need font/layout adjustments.

---

## Module Reference

Use module prefixes in `deck_order`:

| Module | ID | Duration | Topics |
|--------|-----|----------|--------|
| Introduction | `m0` | 75 min | FASTR approach, why rapid analytics |
| Questions & Indicators | `m1` | 60 min | Identifying questions |
| Data Extraction | `m2` | 45 min | Getting data from DHIS2 |
| Analytics Platform | `m3` | 120 min | Using the FASTR platform (auto-splits) |
| Data Quality Assessment | `m4` | 60 min | Completeness, outliers |
| Data Quality Adjustment | `m5` | 75 min | Adjustment methods |
| Data Analysis | `m6` | 90 min | Utilization, coverage |
| Results Communication | `m7` | 75 min | Reporting, visualization |

**Long modules auto-split:** Modules >90 min (like Platform) automatically split across days.

---

## Optional Sessions

The wizard generates commented templates for common workshop additions:

```yaml
# OPENING CEREMONY (Day 1)
#   - time: "8:50 AM - 9:00 AM"
#     session: Welcome / Opening Prayer
#     duration: 10

# GUEST SPEAKERS
#   - time: "2:00 PM - 2:30 PM"
#     session: "Guest Speaker: [Name, Title]"
#     duration: 30

# CLOSING CEREMONY (Final Day)
#   - time: "3:30 PM - 4:00 PM"
#     session: Certificate Ceremony
#     duration: 30
```

Uncomment and customize as needed.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Workshop not found | Check folder name matches `--workshop` argument |
| Config not found | Ensure `workshop.yaml` exists in workshop folder |
| Variable not defined | Add to `country_data:` section in workshop.yaml |
| marp not found | Install: `npm install -g @marp-team/marp-cli` |
| No styling in PDF | Use `--theme fastr-theme.css` (not --theme-set) |
| Images not showing | Use `--allow-local-files` flag |

---

## Quick Reference

```bash
# Create workshop
python3 tools/01_new_workshop.py

# Build deck
python3 tools/02_build_deck.py --workshop WORKSHOP_ID

# Export to PDF
marp --no-config outputs/WORKSHOP_ID_deck.md --theme fastr-theme.css --pdf --allow-local-files

# Preview in browser
marp --no-config --preview outputs/WORKSHOP_ID_deck.md --theme fastr-theme.css

# Convert to PowerPoint
python3 tools/03_convert_pptx.py outputs/WORKSHOP_ID_deck.md
```
