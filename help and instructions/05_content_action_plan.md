# Content Action Plan: Methodology Modules

Audit of content status across all methodology modules.

---

## Summary

| Module | Slides | Status | Action Needed |
|--------|--------|--------|---------------|
| M0 Introduction | 6 | DRAFTED | Review needed |
| M1 Questions & Indicators | 11 | DRAFTED | Review needed |
| M2 Data Extraction | 13 | PARTIAL | Complete missing content |
| M3 FASTR Platform | 6 | PARTIAL | More slides needed (docs are comprehensive) |
| M4 DQ Assessment | 17 | DRAFTED | Review needed |
| M5 DQ Adjustment | 6 | DRAFTED | Review; consider more slides |
| M6a Service Utilization | 11 | DRAFTED | Review needed |
| M6b Coverage Estimates | 13 | DRAFTED | Review needed |
| M7 Results Communication | 33 | DRAFTED | Review needed |
| M8 Survey & HFA | 4 | DRAFTED | Review needed |
| MAI AI Assistant | 28 | DRAFTED | Review needed |
| M9a-h Workshop Activities | varies | DRAFTED | Review needed |

**Modules needing more slides extracted: M3, M5**
**Modules needing review: all others**

---

## Status Key

| Status | Meaning |
|--------|---------|
| **DRAFTED** | Real content exists, needs review and sign-off |
| **PARTIAL** | Some content exists, more slides needed |

---

## Content Creation Strategy

**Approach:** Use AI to extract and adapt content from existing FASTR workshop decks and training materials.

1. Gather existing PowerPoint/PDF decks for each module
2. Use AI to extract relevant content into markdown format
3. Adapt content to fit the methodology documentation structure
4. Content goes into existing SLIDE markers (structure already in place)
5. Review and refine with subject matter experts

---

## Detailed Status by Module

### Module 0: Introduction (00_introduction.md)
**Status: DRAFTED - NEEDS REVIEW** (6 slides)

Covers FASTR introduction, rapid-cycle analytics approach, and country entry points. Good conceptual overview with presenter notes.

---

### Module 1: Questions & Indicators (01_identify_questions_indicators.md)
**Status: DRAFTED - NEEDS REVIEW** (11 slides)

Comprehensive content with country examples (Nigeria, Guinea, Ethiopia), data use case frameworks, and indicator selection guidance. Previously listed as PLACEHOLDER but has been filled in.

---

### Module 2: Data Extraction (02_data_extraction.md)
**Status: PARTIAL** (13 slides)

Good content on why to extract data, but some extraction tool topics could use more detail.

---

### Module 3: FASTR Analytics Platform (03_fastr_analytics_platform.md)
**Status: PARTIAL** (6 slides, but extensive documentation)

The documentation section (~233 lines) covers platform features comprehensively, but only 6 slides have been extracted. Major topics in the docs (data flow, modules, visualizations, reports, collaboration) need corresponding slides.

**Action needed:**
- [ ] Extract more slides from the existing documentation content
- [ ] Add slides for: data flow, running modules, creating visualizations, generating reports

---

### Module 4: Data Quality Assessment (04_data_quality_assessment.md)
**Status: DRAFTED - NEEDS REVIEW** (17 slides)

Deep technical module covering completeness, outliers, and consistency validation. Well-balanced between documentation and slides.

---

### Module 5: Data Quality Adjustment (05_data_quality_adjustment.md)
**Status: DRAFTED - NEEDS REVIEW** (6 slides)

Good technical content (50KB of documentation) but limited slide coverage relative to the depth of the material.

---

### Module 6a: Service Utilization (06a_service_utilization.md)
**Status: DRAFTED - NEEDS REVIEW** (11 slides)

Covers service disruption detection, statistical process control, and regression-based analysis.

---

### Module 6b: Coverage Estimates (06b_coverage_estimates.md)
**Status: DRAFTED - NEEDS REVIEW** (13 slides)

Covers coverage estimation methodology, HMIS/UN WPP/survey data integration.

---

### Module 7: Results Communication (07_results_communication.md)
**Status: DRAFTED - NEEDS REVIEW** (33 slides)

Very comprehensive module covering analytical thinking, interpretation, messaging, storytelling, and action planning. Previously listed as PLACEHOLDER but has been fully developed.

---

### Module 8: Survey & HFA
**Status: DRAFTED** (4 slides)

Covers rapid-cycle facility surveys, HFA design, adaptive content, indicator types.

---

### AI Assistant Module (mai_ai_assistant)
**Status: DRAFTED** (28 slides)

Covers AI capabilities, prompting techniques, conversations, data privacy. Sub-topics use letter suffixes (mai_3a, mai_5a, etc.).

---

## French Translation Gaps

| Module | EN Files | FR Files | Missing in FR |
|--------|----------|----------|---------------|
| mai_ai_assistant | 28 | 12 | 16 files |
| m7_results_communication | 36 | 32 | 4 files |
| m8_survey_hfa | 4 | 1 | 3 files |
| m6_data_analysis | 30 | 29 | 3 files (+ 2 stale FR files to delete) |
| m0_introduction | 7 | 5 | 2 files |
| m5_data_quality_adjustment | 6 | 5 | 1 file |

---

## Priority Action Items

### HIGH PRIORITY: Slide Extraction

**Module 3: FASTR Analytics Platform**
- [ ] Extract additional slides from extensive documentation
- [ ] Cover: data flow, running modules, visualizations, reports

### MEDIUM PRIORITY: Review

**All drafted modules need subject matter expert review:**
- [ ] M0 Introduction
- [ ] M1 Questions & Indicators
- [ ] M4 DQ Assessment
- [ ] M5 DQ Adjustment
- [ ] M6a Service Utilization
- [ ] M6b Coverage Estimates
- [ ] M7 Results Communication

### LOWER PRIORITY: French Translations

- [ ] Translate 16 missing AI Assistant files
- [ ] Translate 4 missing M7 files
- [ ] Translate 3 missing M8 files
- [ ] Translate remaining gaps (M0, M5, M6)
- [ ] Delete 2 stale FR files in m6_data_analysis

---

*Last updated: 2026-02-26*
