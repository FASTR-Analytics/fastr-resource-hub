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

**Headings**: Use sentence case (only capitalize the first word and proper nouns). Do NOT capitalize each word.

- Correct: `## Why focus on high volume indicators?`
- Incorrect: `## Why Focus on High Volume Indicators?`

**Heading hierarchy**: Use `##` for main sections, `###` for subsections, etc.

## The 9 module files

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
