# Instructions for Claude

## Content Location - Single Source of Truth

**All content lives in the `methodology/` folder only.**

The `methodology/` folder is the **single source of truth** for all FASTR content. Content written here is then:
1. Published to the documentation website
2. Extracted into slides for workshop presentations

Do NOT add or edit content in:
- `core_content/` - this is auto-generated from methodology files
- `workshops/` - these only contain configuration, not content
- `templates/` - structural templates only

## How the System Works

```
methodology/*.md  →  Documentation website
       ↓
       →  Extracted to core_content/ (via tools/00_extract_slides.py)
              ↓
              →  Combined into workshop decks (via tools/02_build_deck.py)
```

## File Structure in methodology/

Each methodology file has two parts:

1. **Documentation section** (top): Full explanations for the website
2. **Slide section** (after ASCII separator): Condensed content for workshops, marked with `<!-- SLIDE:xxx -->` tags

When adding new content, add it to the appropriate methodology file in both sections if it should appear on both the website and in workshop slides.

## Style guidelines

See `help and instructions/07_style_guide.md` for the full style guide.

**Key rules:**
- **Headings**: Sentence case (only capitalize first word and proper nouns)
- **Heading hierarchy**: `#` title, `##` main sections, `###` subsections, `####` details
- **Bold**: For key terms, feature introductions, labels (e.g., **Inputs**:)
- **Inline code**: For filenames, variables, function names (e.g., `hmis_data.csv`)
- **Lists**: No periods for single-line items
- **Expandable sections**: Use `???` for technical details

## The module files

| File | Topic |
|------|-------|
| `00_introduction.md` | Introduction to FASTR |
| `01_identify_questions_indicators.md` | Identify Questions & Indicators |
| `02_data_extraction.md` | Data Extraction |
| `03_fastr_analytics_platform.md` | The FASTR Analytics Platform |
| `04_data_quality_assessment.md` | Data Quality Assessment |
| `05_data_quality_adjustment.md` | Data Quality Adjustment |
| `06a_service_utilization.md` | Service Utilization Analysis |
| `06b_coverage_estimates.md` | Coverage Estimates |
| `07_results_communication.md` | Results Communication |
| `09_fastr_rmet_integration.md` | FASTR and RMET Integration |
| `10_workshop_activities.md` | Workshop Activities |
