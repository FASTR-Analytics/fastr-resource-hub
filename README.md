# FASTR Slide Builder

Build customized FASTR workshop presentations from reusable content modules.

**Repository:** https://github.com/FASTR-Analytics/fastr-slide-builder

## What This Tool Does

The FASTR Slide Builder helps you create country-specific workshop presentations by:
- Combining core FASTR methodology content with your custom slides
- Auto-filling workshop details and country statistics using `{{variables}}`
- Intelligently placing breaks and structuring multi-day workshops
- Exporting to PDF or PowerPoint with FASTR branding

## Quick Start

### 3-Step Workflow

```bash
# 1. Set up a new workshop (interactive)
python3 tools/01_setup_workshop.py

# 2. Build the slide deck
python3 tools/02_build_deck.py

# 3. Export to PDF (recommended)
marp outputs/YOUR-WORKSHOP_deck.md --theme-set fastr-theme.css --pdf
```

That's it! Your presentation is ready.

## Key Features

### Flexible Slide Ordering
Use `deck_order` in `config.py` to control exactly which slides appear and in what order:

```python
'deck_order': [
    'agenda',                    # Built-in agenda slide
    'objectives.md',             # Your custom slide
    'intro',                     # Built-in FASTR intro session
    'dq_assessment',             # Built-in data quality session
    'dq-findings.md',            # Your country-specific findings
    'coverage',                  # Built-in coverage session
    'next-steps.md',             # Your action items
]
```

### Smart Variable Substitution
Define country data once in `config.py`, use everywhere with `{{variable}}`:

```python
'country_data': {
    'total_facilities': '2,847',
    'reporting_rate': '92%',
    'survey_anc1': '87%',
}
```

Then in any slide: "Coverage: {{survey_anc1}}" becomes "Coverage: 87%"

### Automatic Break Placement
The builder intelligently adds tea, lunch, and afternoon breaks based on your workshop duration (1, 2, or 3 days).

## Installation Options

### Option 1: GitHub Codespaces (Zero Setup)
1. Open https://github.com/FASTR-Analytics/fastr-slide-builder
2. Click **Code** → **Codespaces** → **Create codespace on main**
3. Everything is pre-installed and ready to use

Free tier: 60 hours/month. [Full guide](CONTRIBUTING.md#using-github-codespaces)

### Option 2: Local Development
Requires: Python 3.7+, Node.js, Marp CLI. [Installation guide](docs/local-setup.md)

## Folder Structure

```
fastr-slide-builder/
├── tools/                  # Build scripts
│   ├── 01_setup_workshop.py    # Create new workshop (interactive)
│   ├── 02_build_deck.py        # Assemble markdown deck
│   └── 03_convert_to_pptx.py   # Export to PowerPoint (optional)
│
├── templates/              # Reusable slide templates
│   ├── title_slide.md
│   ├── agenda.md
│   ├── closing.md
│   └── custom_slides/          # Template custom slides
│
├── core_content/           # Shared FASTR methodology (7 sections)
│   ├── 01_background_rationale.md
│   ├── 02_fastr_approach.md
│   ├── 03_data_extraction.md
│   ├── 04a_data_quality_assessment.md
│   ├── 04b_data_adjustment.md
│   ├── 05_service_utilization.md
│   ├── 06_coverage_analysis.md
│   └── 07_facility_assessments.md
│
├── workshops/              # Workshop-specific content
│   ├── example/                # Reference implementation
│   └── YOUR-WORKSHOP/
│       ├── config.py           # Workshop settings & country data
│       ├── objectives.md       # Custom slide: workshop goals
│       ├── country-overview.md # Custom slide: country context
│       ├── dq-findings.md      # Custom slide: DQ results
│       └── agenda.png          # Agenda image
│
├── assets/                 # Shared images (organized by type)
│   ├── logos/              # FASTR logo, partner logos
│   ├── diagrams/           # Methodology flowcharts
│   ├── screenshots/        # DHIS2, platform UI
│   └── fastr-outputs/      # Default FASTR visualizations
│
├── outputs/                # Generated decks (gitignored)
```

### Assets Folder Guide

| Folder | What goes here | Examples |
|--------|----------------|----------|
| `logos/` | Brand logos, partner logos | fastr-logo.png, who-logo.png |
| `diagrams/` | Methodology flowcharts, conceptual diagrams | data-flow.svg, fastr-approach.png |
| `screenshots/` | UI screenshots, data examples | dhis2-export.png, csv-format.png |
| `fastr-outputs/` | Standard FASTR visualizations | coverage-chart.png, dq-heatmap.png |

Reference in slides:
```markdown
![](../../assets/logos/fastr-logo.png)        # from workshops/
![](../assets/diagrams/data-flow.svg)         # from core_content/
```

## Built-in Sessions

Use these session IDs in your `deck_order`:

- `intro` - Background & FASTR approach (~30 min)
- `extraction` - Data extraction from DHIS2 (~45 min)
- `dq_assessment` - Data quality assessment (~90 min)
- `dq_adjustment` - Data adjustment methods (~60 min)
- `disruption` - Service disruption detection (~90 min)
- `coverage` - Coverage analysis (~90 min)
- `facility` - Facility assessments (~30 min)

## Customizing Your Workshop

1. **Run the setup wizard:**
   ```bash
   python3 tools/01_setup_workshop.py
   ```

2. **Edit generated files:**
   - `config.py` - Workshop details, session order, country statistics
   - `*.md` files - Custom slides with your content
   - `agenda.png` - Your workshop agenda image

3. **Build and export:**
   ```bash
   python3 tools/02_build_deck.py
   marp outputs/YOUR-WORKSHOP_deck.md --theme-set fastr-theme.css --pdf
   ```

## Common Commands

```bash
# Create new workshop (interactive wizard)
python3 tools/01_setup_workshop.py

# Build deck (interactive - shows all workshops)
python3 tools/02_build_deck.py

# Build specific workshop (non-interactive)
python3 tools/02_build_deck.py --workshop 2025-nigeria

# Export to PDF (recommended)
marp outputs/2025-nigeria_deck.md --theme-set fastr-theme.css --pdf

# Export to PowerPoint (alternative)
python3 tools/03_convert_to_pptx.py outputs/2025-nigeria_deck.md
```

## PDF vs PowerPoint

**PDF (Recommended):**
- Perfect FASTR styling out-of-the-box
- Consistent across all platforms
- Smaller file size
- Ready to present immediately

**PowerPoint:**
- Allows post-export editing
- Useful for last-minute changes
- May require font/layout adjustments

## Documentation

- **[Full Documentation](docs/)** - Comprehensive guides
- **[Markdown Guide](docs/markdown-guide.md)** - Marp syntax reference
- **[Building Decks](docs/building-decks.md)** - Detailed workflow
- **[Local Setup](docs/local-setup.md)** - Installation instructions

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Contributing to core content
- Creating workshop-specific content
- Using GitHub Codespaces
- Git workflow best practices

## Requirements

**Required:**
- Python 3.7+

**Optional (for rendering):**
- Marp CLI: `npm install -g @marp-team/marp-cli` (for PDF export)
- Pandoc: `brew install pandoc` (for PowerPoint export)

## Support

1. Check this README and docs/ folder
2. Review the example workshop: `workshops/example/`
3. See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guides
4. Contact the FASTR team

## License

FASTR methodology and content - see your organization's license.
