# FASTR Workshop - Example Country

**Location:** Capital City, Country
**Date:** January 15-17, 2025
**Facilitators:** Dr. Smith, Dr. Jones

## Files in this folder

- `config.py` - Workshop configuration
- `agenda.png` - Replace with your agenda image
- Custom slides (edit these with your content):
  - `objectives.md` - Workshop objectives
  - `country-overview.md` - Country context
  - `health-priorities.md` - Health priorities
  - `dq-findings.md` - Data quality findings
  - `disruption-local.md` - Disruption analysis
  - `coverage-results.md` - Coverage results
  - `next-steps.md` - Action items

## To build your deck

```bash
python3 tools/03_build_deck.py --workshop example
```

## To convert to PowerPoint

```bash
python3 tools/04_convert_to_pptx.py outputs/example_deck.md
```
