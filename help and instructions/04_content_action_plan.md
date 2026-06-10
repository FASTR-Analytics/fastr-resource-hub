# Content Action Plan: Methodology Modules

Audit of content status across all methodology modules.

*Last audited: 2026-06-10.* Re-run `python3 tools/translate_docs.py --lang fr --status` and `--lang pt --status` plus the slide-count command below to refresh.

---

## Methodology source files (the EN canon)

15 files in `methodology/` are the source of truth. The FR and PT mirrors each contain the same 15 (PT) or 14 (FR — `README.md` not yet translated) files.

| File | Purpose |
|------|---------|
| `00_introduction.md` | Introduction to FASTR |
| `01_identify_questions_indicators.md` | Identify priority questions & indicators |
| `02_data_extraction.md` | Data extraction |
| `03_fastr_analytics_platform.md` | The FASTR analytics platform |
| `03b_ai_assistant.md` | AI Assistant |
| `04_data_quality_assessment.md` | Data quality assessment |
| `05_data_quality_adjustment.md` | Data quality adjustment |
| `06a_service_utilization.md` | Service utilization analysis |
| `06b_coverage_estimates.md` | Coverage estimates |
| `07_results_communication.md` | Results communication |
| `08_survey_hfa.md` | Survey & HFA |
| `11_user_guide.md` | Platform user guide |
| `index.md`, `README.md`, `disclaimer.md` | Site landing + housekeeping |

---

## Workshop slide library (`core_content/`)

23 modules registered in `modules.yaml` (22 active + 1 deprecated). All three languages mirror each other one-for-one. Counts as of 2026-06-10:

| Module ID | Name | Slides per language |
|---|---|---|
| `m0` | Introduction to FASTR | 7 |
| `m1` | Identify priority questions | 11 |
| `m2` | Data extraction | 14 |
| `m3` | FASTR Analytics Platform | 5 |
| `m3b` / `mai` | AI Assistant | 13 |
| `m4` | Data Quality Assessment | 34 |
| `m5` | Data Quality Adjustment | 13 |
| `m6` | Data Analysis (service use + coverage) | 44 |
| `m7a` | Analytical thinking | 4 |
| `m7b` | Data visualization | 3 |
| `m7c` | Understanding audience | 1 |
| `m7d` | Storytelling with data | 2 |
| `m7e` | Linking results to actions | 4 |
| `m7f` | Roadmap for sustained use | 2 |
| `m8` | Survey & HFA | 10 |
| `m9a` | Instance setup | 4 |
| `m9b` | Getting started | 1 |
| `m9c` | Visualizations & interpretation | 6 |
| `m9d` | Slide decks | 8 |
| `m9e` | Disruption report | 17 |
| `m9f` | Prompting techniques | 14 |
| `m9g` | FASTR quiz | 6 |
| `mw` | Webinar (deprecated, hidden from library) | 20 |

**Total active slides:** ~213 per language (excluding the deprecated `mw` module).

To recount:
```bash
for lang in core_content core_content_fr core_content_pt; do
  echo "=== $lang ==="
  for d in $lang/m*/; do
    mod=$(basename "$d")
    count=$(ls "$d" 2>/dev/null | grep -E "^m.*\.md$" | wc -l | tr -d ' ')
    echo "$mod: $count"
  done
done
```

---

## Translation status

Output of `python3 tools/translate_docs.py --lang fr --status` and `--lang pt --status` on 2026-06-10:

| File | FR status | FR new sections | PT status | PT new sections |
|------|-----------|-----------------|-----------|------------------|
| `00_introduction.md` | ⚠ needs review | 27 | ⚠ needs review | 27 |
| `01_identify_questions_indicators.md` | ⚠ needs review | 22 | ⚠ needs review | 22 |
| `02_data_extraction.md` | ⚠ needs review | 19 | ⚠ needs review | 20 |
| `03_fastr_analytics_platform.md` | ⚠ needs review | 38 | ⚠ needs review | 42 |
| `03b_ai_assistant.md` | ⚠ needs review | 27 | ⚠ needs review | 27 |
| `04_data_quality_assessment.md` | ⚠ needs review | 47 | ⚠ needs review | 47 |
| `05_data_quality_adjustment.md` | ⚠ needs review | 27 | ⚠ needs review | 27 |
| `06a_service_utilization.md` | ⚠ needs review | 68 | ⚠ needs review | 68 |
| `06b_coverage_estimates.md` | ⚠ needs review | 65 | ⚠ needs review | 60 |
| `07_results_communication.md` | ⚠ needs review | 36 | ⚠ needs review | 36 |
| `08_survey_hfa.md` | ⚠ needs review | 37 | ⚠ needs review | 37 |
| `11_user_guide.md` | ⚠ needs review | 9 | ⚠ needs review | 10 |
| `README.md` | ○ not translated | — | ⚠ needs review | 3 |
| `disclaimer.md` | ⚠ needs review | 3 | ⚠ needs review | 4 |
| `index.md` | ⚠ needs review | 4 | ⚠ needs review | 4 |

**Headline:** every single FR and PT methodology file has been machine-translated at some point, but **none of them carries a `<!-- REVIEWED -->` marker.** That means the next time `translate_docs.py` runs, all human edits in any of these files get overwritten unless a marker is added first. This is the most pressing translation hygiene task.

The "new sections" column counts English sub-sections that have appeared since the last machine pass — these will be auto-appended on the next run *once a REVIEWED marker exists*, with `<!-- NEW CONTENT - needs review -->` markers around them.

Status legend (from the tool):
- `○` Not translated yet
- `⚠` Translated but not reviewed (will be overwritten on re-run)
- `✓` Reviewed and protected
- `⚡` Reviewed + new English sections (new content will be appended)

---

## What's changed since the previous snapshot (2026-02-26)

Module-level deltas (active modules only):

- **`m4` doubled** (17 → 34 slides) — DQA module substantially expanded
- **`m5` doubled** (6 → 13) — adjustment module expanded
- **`m6` nearly doubled** (24 → 44, combining the old `m6a` + `m6b`)
- **`m7` reorganized** into six sub-modules `m7a`–`m7f` (was a single 33-slide module; now totals 16 slides across the six)
- **`m8` more than doubled** (4 → 10)
- **`mai` consolidated** (28 → 13) — duplicates removed per the May 2026 MAI dedup
- **`m9a`–`m9g` added** as the workshop activities track (~56 slides)
- **Portuguese added** as a third supported language, mirroring FR

Editorial review state of individual modules is not tracked objectively in this audit — that requires a separate SME pass and is not derivable from file counts.

---

## Priority action items

### High priority

- [ ] **Apply `<!-- REVIEWED -->` markers to every FR and PT methodology file** once each has been human-checked. Currently zero files are protected; next translation run will overwrite all manual edits.
- [ ] **Translate `methodology/README.md` to FR** (only file currently in `○ not translated` state).

### Medium priority

- [ ] Review the 36+ new English sub-sections that have accumulated in `07_results_communication.md`, `04_data_quality_assessment.md`, and the M6 chapters — run the translation tool to append them to FR + PT once the upstream content is signed off.
- [ ] Decide whether the deprecated `mw_webinar` module slides should be archived out of `core_content/` (currently still rendering with 20 slides, hidden from the library by the `deprecated: true` flag in `modules.yaml`).

### Lower priority

- [ ] SME review of the `m9a`–`m9g` workshop activity modules (newer additions, not yet reviewed against the workshop runbook).
- [ ] Re-verify the `m7a`–`m7f` split actually matches how the modules are now taught.

---

## How to refresh this document

The objective numbers in this doc come from two commands:

```bash
# Translation status per language
python3 tools/translate_docs.py --lang fr --status
python3 tools/translate_docs.py --lang pt --status

# Slide counts per module per language
for lang in core_content core_content_fr core_content_pt; do
  echo "=== $lang ==="
  for d in $lang/m*/; do
    mod=$(basename "$d")
    count=$(ls "$d" 2>/dev/null | grep -E "^m.*\.md$" | wc -l | tr -d ' ')
    echo "$mod: $count"
  done
done
```

Run those, update the tables, and bump the "Last audited" date at the top.
