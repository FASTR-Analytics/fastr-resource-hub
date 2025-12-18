# FASTR Workshop - Nigeria

**Location:** Lagos
**Date:** January 10-15, 2026
**Facilitators:** Claire

## Files

- `workshop.yaml` - Workshop configuration (modules, schedule, etc.)
- Custom slides to edit:
  - `objectives.md` - Workshop objectives
  - `country-overview.md` - Country context
  - `health-priorities.md` - Health priorities
  - `next-steps.md` - Action items

## Build Your Deck

```bash
# Optional: Check setup
python3 tools/02_check_workshop.py 2025-nigeria

# Build the deck
python3 tools/03_build_deck.py 2025-nigeria

# Convert to PowerPoint (optional)
python3 tools/04_convert_pptx.py 2025-nigeria
```

## Country Outputs

Add your FASTR platform outputs to `media/outputs/` to include them in slides.
