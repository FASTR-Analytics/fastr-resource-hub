# FASTR Slide Builder

Build workshop presentations from FASTR methodology content.

**Documentation:** https://fastr-analytics.github.io/fastr-slide-builder/

---

## Start Here

New to this project? **[Read the Start Here guide](help%20and%20instructions/00_start_here.md)**

---

## All Guides

| Guide | What it covers |
|-------|----------------|
| [00 Start Here](help%20and%20instructions/00_start_here.md) | Overview and key concepts |
| [01 Editing Content](help%20and%20instructions/01_editing_content.md) | Write & edit methodology files |
| [02 Building Workshops](help%20and%20instructions/02_building_workshops.md) | Create presentations |
| [03 Local Setup](help%20and%20instructions/03_local_setup.md) | Install on your computer |
| [04 Codespaces](help%20and%20instructions/04_codespaces_setup.md) | Work in browser (no install) |
| [05 Content Action Plan](help%20and%20instructions/05_content_action_plan.md) | Slide content status & tasks |

---

## Quick Commands

```bash
python3 tools/00_extract_slides.py    # Extract slides from methodology
python3 tools/01_new_workshop.py      # Create new workshop
python3 tools/02_build_deck.py        # Validate + Build deck
```

---

## The Key Concept

All content lives in `methodology/`. Edit there, and:
- Full text → Documentation website
- SLIDE markers → Workshop slides

See [00 Start Here](help%20and%20instructions/00_start_here.md) for details.

---

## License

Copyright (c) 2025 The World Bank, Global Financing Facility for Women, Children and Adolescents (GFF), Frequent Assessments and System Tools for Resilience (FASTR) Initiative. All rights reserved.

This software is proprietary and made publicly available for transparency and reference purposes only. Viewing and reviewing the source code is permitted.
