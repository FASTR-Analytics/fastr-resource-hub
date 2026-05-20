# Handout audit — FASTR curriculum

> Generated 2026-05-12. One Explore agent reviewed each module and tagged every slide. This document is a **proposal** — edit any row freely.
>
> **2026-05-13 update**: 5 of 6 pre-pipeline decisions resolved (see "Decisions taken" below). MAI + M7 dedup complete: 15 files removed from EN, EN ↔ FR now in lockstep for those modules.

## Context

The FASTR curriculum today is one undifferentiated pool of 16:9 slides (~311 slides across 20 modules). Activity and demo content currently lives on slides, which is unhelpful in a hands-on session — facilitators and participants would be better served by a 1–2 page A4 handout per activity.

This audit classifies every slide as one of:

- **THEORY** — explanation, framework, definition, diagram, motivation. Stays as a slide unchanged.
- **ACTIVITY** — participants do something with their hands. Becomes a handout. The slide is replaced by a minimal pointer slide ("Activity: X — see handout / 15 min").
- **DEMO** — facilitator demonstrates live (clicking through the platform, showing an AI conversation). Slide becomes a pointer/checklist; the step-by-step demo script becomes a facilitator handout.
- **HYBRID** — theory + an in-line activity ask on the same slide. The theory part stays as a slide; the activity ask moves to a handout. Each hybrid row has a "how to split" note.

Decisions made before this audit:
- **Granularity**: one handout per activity (1–2 pages), not per-module workbooks.
- **On-screen behaviour**: each activity slide becomes a minimal pointer slide so the room still has a visual anchor.

## Decisions taken 2026-05-13

**M7 output-walkthrough DEMOs** → **one reference handout per FASTR analytical module**.
Not 13 individual handouts; not one mega-doc. Each analytical module that produces an output (DQA, Adjustment, Service Utilization, Disruption, Coverage) gets a "How to read [module] outputs" reference handout following a consistent "what you see / what it means" pattern. Estimated ~5 reference handouts covering all 13 DEMOs in M7 plus the equivalent output slides in M4/M5/M6.

**DEMO vs ACTIVITY** → **separate facilitator-notes shape**.
DEMO content (click-through scripts, talking points, common questions) becomes facilitator-facing handouts; participants don't receive them. ACTIVITY handouts stay participant-facing (worksheets, prompts, instructions). Two distinct templates in the pipeline plan.

**MW (Webinar) handouts** → **separate template, downloadable links**.
Pre/post-webinar worksheets (intro sheet, priority ranking, pre-workshop checklist, next-steps tracker) use a distinct template optimised for solo work. Delivered as downloadable PDF links in pre/post-webinar emails — not bound into a workshop packet. Visual style can differ from in-room activity handouts.

**M9g (quiz)** → **parked**.
Decision deferred to pipeline implementation. Audit doc keeps all 5 questions tagged ACTIVITY for now.

## Dedup outcome 2026-05-12

**MAI module** — 12 duplicate slides removed from `core_content/mai_ai_assistant/`. EN `_meta.yaml` rewritten to mirror the canonical FR ordering (18 entries; matches the MAI flow documented in user memory). The FR side already had the clean state, so no FR files or meta were modified. Files removed:
- mai_2_ai_assistant_capabilities.md
- mai_3_ai_ask_questions.md
- mai_3a_ai_ask_questions_continued.md
- mai_4_ai_conversations.md
- mai_4a_ai_conversations_continued.md
- mai_5_ai_tips_better_answers.md
- mai_5a_ai_good_prompt_checklist.md
- mai_6_ai_capabilities_table.md
- mai_6a_ai_capabilities_table_continued.md
- mai_8_ai_private_vs_shared.md
- mai_8a_ai_private_vs_shared_continued.md
- mai_8b_ai_private_vs_shared_continued.md

**M7 module** — 3 byte-identical `_topic_*a.md` leftovers removed from `core_content/m7_results_communication/`. EN meta down to 45 entries (matches FR). Files removed:
- m7_4a_topic_4a.md
- m7_6a_topic_6a.md
- m7_7a_topic_7a.md

After these changes, EN and FR have **identical file lists** in both mai and m7 folders. Validator + web-app test suite both pass.

## How to read this doc

1. Skim the **Summary table** to see where the bulk of activity content lives.
2. Drop into the **per-module sections** for modules you want to review in detail.
3. Edit any tag, handout name, or pointer slide text directly. Add notes in the Notes column.
4. The **Recommended next pass** section at the end lists open questions surfaced during the audit — these become the brief for the pipeline plan (folder structure, A4 render, deck-builder UI).

---

## Summary

| Module | Slides | Theory | Activity | Demo | Hybrid | Handouts proposed |
|--------|--------|--------|----------|------|--------|-------------------|
| M0 — Introduction | 12 | 12 | 0 | 0 | 0 | 0 |
| M1 — Questions & Indicators | 11 | 11 | 0 | 0 | 0 | 0 |
| M2 — Data Extraction | 14 | 11 | 1 | 2 | 0 | 3 |
| M3 — Analytics Platform | 9 | 9 | 0 | 0 | 0 | 0 |
| M4 — Data Quality Assessment | 35 | 33 | 0 | 0 | 2 | 2 |
| M5 — Data Quality Adjustment | 9 | 9 | 0 | 0 | 0 | 0 |
| M6 — Data Analysis | 49 | 38 | 1 | 4 | 6 | 11 |
| M7 — Results Communication | 45 | 28 | 4 | 13 | 0 | ~13 (after 2026-05-12 dedup) |
| M8 — Survey & HFA | 4 | 4 | 0 | 0 | 0 | 0 |
| M9a — Instance Setup | 4 | 0 | 4 | 0 | 0 | 4 |
| M9b — Getting Started | 3 | 0 | 1 | 1 | 1 | 3 |
| M9c — Visualizations & Interpretation | 13 | 3 | 8 | 2 | 0 | 10 |
| M9d — Slide Decks | 12 | 4 | 4 | 3 | 1 | 8 |
| M9e — Disruption Report | 14 | 3 | 6 | 5 | 0 | 11 |
| M9f — Prompting Techniques | 11 | 3 | 5 | 2 | 1 | 8 |
| M9g — FASTR Quiz | 6 | 1 | 5 | 0 | 0 | 5 |
| M9h — Platform Demo | 1 | 0 | 0 | 1 | 0 | 1 |
| M9i — Standard FASTR Reports | 3 | 1 | 1 | 0 | 1 | 2 |
| MAI — AI Assistant | 18 | 18 | 0 | 0 | 0 | 0 (deduped 2026-05-12) |
| MW — Webinar | 20 | 13 | 3 | 1 | 3 | 7 |
| **Total** | **293** | **200** | **43** | **34** | **15** | **~85** (post-dedup) |

Headline takeaway: roughly **30% of slides** are activity-, demo-, or hybrid-flavoured (95 of 308). The pipeline needs to produce ~91 handouts. The activity work concentrates in M9a–M9i (84 handouts proposed across those eight modules), with notable secondary clusters in M7 (Results Communication, ~16 handouts) and M6 (Data Analysis, 11 handouts). Modules M0, M1, M3, M5, M8, and MAI are pure theory and don't need handouts at all.

---

## Per-module breakdown

### M0 — Introduction to FASTR (12 slides)

**Notes**: pure theory module. No handouts needed.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m0_0_what_are_we_trying_to_achieve.md | What are we trying to achieve? | THEORY |  |  |  |
| m0_1_how_can_this_be_achieved.md | How can this be achieved? | THEORY |  |  |  |
| m0_2_what_is_fastr.md | What is FASTR? | THEORY |  |  |  |
| m0_3_fastr_approach_rmncahn.md | FASTR approach to RMNCAH-N service use monitoring | THEORY |  |  |  |
| m0_3a_how_countries_use_fastr.md | How do countries use FASTR? | THEORY |  |  |  |
| m0_3b_from_analysis_to_action.md | From analysis to action | THEORY |  |  |  |
| m0_4_fastr_outputs.md | FASTR analytics: suite of outputs and products | THEORY |  |  |  |
| m0_5_data_triangulation.md | Data triangulation: bringing together multiple sources | THEORY |  |  |  |
| m0_5a_why_fastr.md | Why FASTR? | THEORY |  |  |  |
| m0_5b_disruptions_text.md | Context | THEORY |  |  |  |
| m0_6_disruptions_context.md | Why now? Responding to disruptions | THEORY |  |  |  |
| m0_7_community_of_practice.md | FASTR community of practice | THEORY |  |  |  |

### M1 — Identify Questions & Indicators (11 slides)

**Notes**: pure theory module. No handouts needed.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m1_1_what_is_data_use_case.md | What is a data use case? | THEORY |  |  |  |
| m1_1a_nigeria_quarterly_monitoring.md | Nigeria: Quarterly performance monitoring | THEORY |  |  | Case study |
| m1_1a2_guinea_investment_tracking.md | Guinea: Tracking investment case progress | THEORY |  |  | Case study |
| m1_1a3_ethiopia_program_monitoring.md | Ethiopia: Monitoring government program results | THEORY |  |  | Case study |
| m1_1b_common_data_use_case.md | Common data use case for this workshop | THEORY |  |  |  |
| m1_1c_how_select_indicators.md | How do we select indicators? | THEORY |  |  | 5 selection criteria |
| m1_2_fastr_core_indicators.md | FASTR core indicators | THEORY |  |  | 8 core RMNCAH-N indicators |
| m1_2a_country_indicator_selection.md | Countries have selected indicators... | THEORY |  |  | References Data Prep Checklist tool |
| m1_3_high_volume_indicators.md | Why focus on high-volume indicators? | THEORY |  |  |  |
| m1_3a_high_completeness_indicators.md | Why focus on high-completeness indicators? | THEORY |  |  |  |
| m1_3b_count_indicators.md | Why focus on count indicators? | THEORY |  |  |  |

### M2 — Data Extraction (14 slides)

**Notes**: 11 theory + 1 activity (show-of-hands) + 2 demo (Data Downloader walkthroughs). The 6 Data Downloader screenshot slides (login/overview/history/dictionary/facility list/facility map) are descriptive references, not hands-on instructions.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m2_0_show_of_hands_extraction.md | Show of hands... | ACTIVITY | h_m2_extraction_poll | "Show of hands — see prompt / 2 min" | Quick engagement check |
| m2_1_why_extract_data.md | Why would you extract data from DHIS2? | THEORY |  |  |  |
| m2_1a_what_data_does_fastr_need.md | What data does FASTR need? | THEORY |  |  |  |
| m2_1b_why_extract_data_continued.md | Data format and granularity | THEORY |  |  |  |
| m2_1d_why_extract_data_continued.md | How much data? | THEORY |  |  |  |
| m2_2_tools_for_data_extraction.md | Data extraction (overview) | DEMO | h_m2_extraction_tools | "Demo: extraction tools — see facilitator handout / 10 min" | Signals demo follows |
| m2_2a_fastr_direct_import.md | Data extraction (direct import) | THEORY |  |  | Reference only |
| m2_2b_data_downloader.md | DHIS2 Data Downloader | DEMO | h_m2_data_downloader_intro | "Demo: Data Downloader — see facilitator handout / 15 min" | Live demo intro |
| m2_2c_data_downloader_login.md | Data Downloader: Login | THEORY |  |  | Screenshot reference |
| m2_2d_data_downloader_overview.md | Data Downloader: Overview | THEORY |  |  | Screenshot reference |
| m2_2e_data_downloader_history.md | Data Downloader: Download history | THEORY |  |  | Screenshot reference |
| m2_2f_data_downloader_dictionary.md | Data Downloader: Data dictionary | THEORY |  |  | Screenshot reference |
| m2_2g_data_downloader_facility_list.md | Data Downloader: Facility list | THEORY |  |  | Screenshot reference |
| m2_2h_data_downloader_facility_map.md | Data Downloader: Facility map | THEORY |  |  | Screenshot reference |

### M3 — FASTR Analytics Platform (9 slides)

**Notes**: pure theory. The actual hands-on platform work happens in M9b "Getting Started" — m3 just frames the concepts.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m3_0_learning_objectives.md | What you'll learn | THEORY |  |  | Points to downstream hands-on |
| m3_1_overview_of_platform.md | FASTR analytics platform | THEORY |  |  |  |
| m3_1b_overview_of_platform_continued.md | Platform capabilities | THEORY |  |  |  |
| m3_2a_accessing_platform_continued.md | Country Instance | THEORY |  |  |  |
| m3_2b_accessing_platform_continued.md | User Roles and Permissions | THEORY |  |  |  |
| m3_2c_accessing_platform_continued.md | Projects Within an Instance | THEORY |  |  |  |
| m3_2e_configuring_platform_intro.md | Configuring the analysis platform | THEORY |  |  |  |
| m3_3_next_steps.md | Getting started with the platform | THEORY |  |  | Pointer to M9b activity |
| m3_5_roadmap_2026.md | Platform roadmap | THEORY |  |  |  |

### M4 — Data Quality Assessment (35 slides, full + condensed)

**Notes**: almost entirely theory. Two HYBRID slides at the heart of outlier investigation — they pair the methodology with a decision exercise that should become a workshop handout.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m4_0_fastr_methods_overview.md | FASTR analytical pipeline | THEORY |  |  |  |
| m4_1_approach_to_dqa.md | FASTR multi-pronged approach to DQ | THEORY |  |  |  |
| m4_1a_measures_data_quality_detailed.md | Measures of data quality - detailed | THEORY |  |  |  |
| m4_1b_approach_to_dqa.md | Rationale for DQA | THEORY |  |  |  |
| m4_1b_fastr_vs_dhis2_dqa.md | FASTR DQA vs DHIS2 DQA | THEORY |  |  |  |
| m4_1c_approach_to_dqa.md | Assessing and adjusting for DQ | THEORY |  |  |  |
| m4_1c_fastr_vs_dhis2_dqa_continued.md | FASTR vs DHIS2 DQA (continued) | THEORY |  |  |  |
| m4_1d_approach_to_dqa.md | Measures of data quality | THEORY |  |  |  |
| m4_2_indicator_completeness.md | Indicator completeness | THEORY |  |  |  |
| m4_2a_notes_on_completeness.md | Notes on completeness | THEORY |  |  |  |
| m4_3_outliers.md | Outliers | THEORY |  |  |  |
| m4_3a_outlier_investigation.md | Investigating a flagged outlier | HYBRID | h_m4_outlier_investigation | "Outlier investigation walk-through — see handout / 15 min" | Theory part = 5-question checklist; handout = participants apply it to their own data |
| m4_3ab_outlier_investigation.md | Making the call | HYBRID | h_m4_outlier_decision | "Outlier decision exercise — see handout / 10 min" | Theory part = 3 decision paths; handout = participants make calls on sample outliers |
| m4_3b_outliers.md | Why adjust for outliers? | THEORY |  |  |  |
| m4_3c_outliers.md | Outlier detection methodology | THEORY |  |  |  |
| m4_4_internal_consistency.md | Consistency between related indicators | THEORY |  |  |  |
| m4_4b_internal_consistency.md | Why assess consistency at district level? | THEORY |  |  |  |
| m4_5_overall_dqa_score.md | Data quality summary score | THEORY |  |  |  |
| m4_5b_overall_dqa_score.md | Quick interpretation guide | THEORY |  |  |  |
| m4_6_dqa_configuration_parameters.md | DQA module: Configuration parameters | THEORY |  |  |  |
| m4_s0_dqa_what_we_check.md | Data quality: what does FASTR check? | THEORY |  |  | condensed |
| m4_s1_dqa_pipeline_overview.md | FASTR analytical pipeline | THEORY |  |  | condensed |
| m4_s1b_dqa_pipeline_overview.md | FASTR approach to data quality | THEORY |  |  | condensed |
| m4_s2_dqa_rationale_objectives.md | Rationale for DQA | THEORY |  |  | condensed |
| m4_s2b_dqa_rationale_objectives.md | Objectives of DQA | THEORY |  |  | condensed |
| m4_s3_dqa_completeness.md | Indicator completeness | THEORY |  |  | condensed |
| m4_s3a_dqa_outlier_illustration.md | Why adjust for outliers? | THEORY |  |  | condensed |
| m4_s3b_dqa_completeness.md | Indicator completeness output | THEORY |  |  | condensed |
| m4_s3b_dqa_outliers.md | Outlier detection | THEORY |  |  | condensed |
| m4_s3bb_dqa_outliers.md | Outlier detection output | THEORY |  |  | condensed |
| m4_s4_dqa_internal_consistency.md | Internal consistency | THEORY |  |  | condensed |
| m4_s4b_dqa_internal_consistency.md | Internal consistency output | THEORY |  |  | condensed |
| m4_s5_dqa_score_summary.md | Data quality summary score | THEORY |  |  | condensed |
| m4_s5b_dqa_score_summary.md | Overall DQ score output | THEORY |  |  | condensed |
| m4_s5c_dqa_score_summary.md | Mean DQA score output | THEORY |  |  | condensed |

### M5 — Data Quality Adjustment (9 slides)

**Notes**: pure theory module. No handouts needed.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m5_1_approach_to_dq_adjustment.md | Rationale for DQ adjustment | THEORY |  |  |  |
| m5_1b_approach_to_dq_adjustment.md | Indicators excluded from adjustment | THEORY |  |  |  |
| m5_2_adjustment_for_outliers.md | Outlier adjustment methodology | THEORY |  |  |  |
| m5_3_adjustment_for_completeness.md | Completeness adjustment methodology | THEORY |  |  |  |
| m5_s0_adjustment_how_it_works.md | Data correction: how FASTR fixes problems | THEORY |  |  | condensed |
| m5_s1_dq_adjustment_overview.md | Data quality adjustment | THEORY |  |  | condensed |
| m5_s1a_why_adjust_for_outliers.md | Why adjust for outliers? | THEORY |  |  | condensed |
| m5_s2_dq_adjustment_interpretation.md | Outlier/Completeness adjustment output | THEORY |  |  | condensed |
| m5_s2b_dq_adjustment_interpretation.md | Completeness adjustment output | THEORY |  |  | condensed |

### M6 — Data Analysis (49 slides, full + condensed)

**Notes**: large theory module on service utilization, disruption detection, and coverage methodology. Contains one explicit "Try it yourself" activity in the condensed track, several output-interpretation walkthroughs that are facilitator demos, and a cluster of chart-reading hybrids. Some condensed slides appear to be duplicates of others — flagged in notes.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m6_1_service_utilization_analysis.md | Service utilization analysis | THEORY |  |  |  |
| m6_1a_service_utilization_comparison_dhis2.md | Service utilization vs DHIS2 | THEORY |  |  |  |
| m6_1b_indicator_directionality.md | Indicator directionality | THEORY |  |  |  |
| m6_1b_service_utilization_analysis.md | Service utilization comparison to DHIS2 | THEORY |  |  | possible duplicate of m6_1a |
| m6_2_service_disruptions_surpluses_detection.md | Service disruptions and surpluses detection | THEORY |  |  |  |
| m6_2a_why_detecting_disruptions_matters.md | Why detecting disruptions matters | THEORY |  |  |  |
| m6_2b_service_disruptions_surpluses_detection.md | How disruption detection works | THEORY |  |  |  |
| m6_2c_service_disruptions_surpluses_detection.md | Disruption detection vs DHIS2 | THEORY |  |  |  |
| m6_5a_service_utilization_configuration_parameters.md | Service utilization module: Configuration parameters | THEORY |  |  |  |
| m6_6_service_coverage_introduction.md | Service coverage estimation | THEORY |  |  |  |
| m6_6b_service_coverage_introduction.md | Our approach to service coverage analysis | THEORY |  |  |  |
| m6_6c_service_coverage_introduction.md | Two-part analytical process | THEORY |  |  |  |
| m6_7_definition_of_coverage.md | Service coverage example | THEORY |  |  |  |
| m6_8_denominators_by_service_type.md | Denominators by service type | THEORY |  |  |  |
| m6_9_demographic_cascade.md | Expected relationships for denominators | THEORY |  |  |  |
| m6_9a_cascade_dropout.md | Service cascade and dropout analysis | THEORY |  |  |  |
| m6_9ab_cascade_dropout.md | Calculating and interpreting dropout | HYBRID | h_m6_dropout | "Dropout exercise — see handout / 10 min" | Theory = formula; handout = participants compute dropout on their region |
| m6_10_denominator_cascade_illustration.md | Estimating denominators from ANC-1 | THEORY |  |  |  |
| m6_11_deriving_denominators_from_entry_points.md | Deriving denominators from entry points | THEORY |  |  |  |
| m6_13_denominator_selection_methodology.md | Denominator selection methodology | THEORY |  |  |  |
| m6_13a_denominator_comparison.md | Which denominator provides more plausible estimates? | THEORY |  |  |  |
| m6_14_coverage_projection_methodology.md | Coverage projection methodology | THEORY |  |  |  |
| m6_19_coverage_configuration_parameters.md | Coverage module: Configuration parameters | THEORY |  |  |  |
| m6_s0_utilization_detecting_changes.md | Service utilization: detecting changes | THEORY |  |  | condensed |
| m6_s0b_reading_disruption_chart.md | Reading a disruption chart | HYBRID | h_m6_disruption_reading | "Chart reading — see handout / 5 min" | Theory = legend; handout = read 2 sample charts |
| m6_s0c_coverage_methods.md | Coverage: from volumes to percentages | THEORY |  |  | condensed |
| m6_s0d_reading_coverage_chart.md | Reading a coverage chart | HYBRID | h_m6_coverage_reading | "Chart reading — see handout / 5 min" | Theory = legend; handout = read 2 sample charts |
| m6_s1_utilization_overview.md | Service utilization analysis | HYBRID | h_m6_utilization_overview | "Output walkthrough — see handout / 5 min" | Theory = chart shape; handout = interpretation prompts |
| m6_s1a_quarter_on_quarter_change.md | Quarter-on-quarter change | THEORY |  |  | condensed |
| m6_s1b_indicator_directionality.md | Indicator directionality | THEORY |  |  | condensed |
| m6_s1b_utilization_overview.md | Year-over-year change output | DEMO | h_m6_yoy_change | "Output walkthrough: YoY — see facilitator handout / 5 min" | Facilitator walkthrough of heatmap |
| m6_s1c_utilization_overview.md | Try it yourself | ACTIVITY | h_m6_utilization_practice | "Activity: interpret YoY — see handout / 10 min" | Hands-on interpretation exercise |
| m6_s2_disruption_interpretation.md | Detecting service disruptions | HYBRID | h_m6_disruption_detect | "Disruption interpretation — see handout / 5 min" | Theory = stat model; handout = 2 sample interpretations |
| m6_s2b_disruption_interpretation.md | Service disruption output | DEMO | h_m6_disruption_output | "Output walkthrough: disruption — see facilitator handout / 5 min" |  |
| m6_s3_coverage_overview.md | Service coverage estimation | THEORY |  |  | condensed |
| m6_s3a_coverage_example.md | Service coverage example | THEORY |  |  | condensed |
| m6_s3b_coverage_overview.md | How FASTR estimates coverage | THEORY |  |  | condensed |
| m6_s3b_expected_relationships.md | Expected relationships for denominators | THEORY |  |  | possible duplicate of m6_9 |
| m6_s3c_estimating_denominators.md | Estimating denominators from ANC-1 | THEORY |  |  | possible duplicate of m6_10 |
| m6_s3d_five_denominator_options.md | Five denominator options for FASTR | THEORY |  |  |  |
| m6_s3e_how_fastr_estimates_coverage.md | How FASTR estimates coverage | THEORY |  |  |  |
| m6_s4_coverage_interpretation.md | Coverage output: National trends | DEMO | h_m6_coverage_national | "Output walkthrough: coverage national — see facilitator handout / 5 min" |  |
| m6_s4b_coverage_interpretation.md | Coverage output: Subnational comparison | DEMO | h_m6_coverage_subnational | "Output walkthrough: coverage subnational — see facilitator handout / 5 min" |  |
| m6_s4c_coverage_interpretation.md | Drill down for the full picture | HYBRID | h_m6_coverage_drilling | "Drilling exercise — see handout / 10 min" | Theory = approach; handout = participants drill on their region |
| m6_s5_country_example_nigeria.md | Country example: Nigeria | THEORY |  |  |  |
| m6_s5_value_beyond_dhis2.md | Why FASTR? Value add beyond DHIS2 | THEORY |  |  |  |
| m6_s6_fastr_value_beyond_dhis2.md | Why FASTR? Value add beyond DHIS2 | THEORY |  |  | duplicate of m6_s5_value |
| m6_s6_topic_s6.md | Key takeaway | THEORY |  |  |  |
| m6_s7_key_takeaway.md | Key takeaway | THEORY |  |  | duplicate of m6_s6_topic_s6 |

### M7 — Results Communication (48 slides, full + condensed)

**Notes**: large module with 13 output-interpretation DEMOs (facilitator walkthroughs of FASTR module outputs) and 7 explicit ACTIVITY slides. Several activity slides exist in duplicate (e.g., `m7_4a_map_your_users.md` and `m7_4a_topic_4a.md`); de-dup expected to drop ~3 handouts from the proposed count.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m7_1_analytical_thinking_interpretation.md | Analytical thinking & interpretation | THEORY |  |  |  |
| m7_1a_analytical_thinking_interpretation_continued.md | Critical thinking checklist | THEORY |  |  |  |
| m7_1b_analytical_thinking_interpretation_continued.md | Common interpretation pitfalls | THEORY |  |  |  |
| m7_1c_analytical_thinking_interpretation_continued.md | Interpreting FASTR module outputs | THEORY |  |  |  |
| m7_1d_outliers_output.md | Outlier detection output | DEMO | h_m7_outliers_detection | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1d2_completeness_output.md | Indicator completeness output | DEMO | h_m7_completeness | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1e_internal_consistency_output.md | Internal consistency output | DEMO | h_m7_consistency | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1f_overall_dqa_score_output.md | Overall DQA score output | DEMO | h_m7_dqa_overall | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1g_mean_dqa_score_output.md | Mean DQA score output | DEMO | h_m7_dqa_mean | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1h_outlier_adjustment_output.md | Outlier adjustment output | DEMO | h_m7_outlier_adjustment | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1i_completeness_adjustment_output.md | Completeness adjustment output | DEMO | h_m7_completeness_adjustment | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1i2_combined_adjustment_output.md | Combined adjustment output | DEMO | h_m7_combined_adjustment | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1j_service_utilization_output.md | Service utilization output: trends | DEMO | h_m7_service_trends | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1k_year_over_year_change_output.md | Year-over-year change output | DEMO | h_m7_yoy_change | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1l_disruption_output_national.md | Disruption output: national | DEMO | h_m7_disruption_national | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1m_disruption_output_subnational.md | Disruption output: subnational | DEMO | h_m7_disruption_subnational | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1n_coverage_output_national.md | Coverage output: national | DEMO | h_m7_coverage_national | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_1o_coverage_output_subnational.md | Coverage output: subnational | DEMO | h_m7_coverage_subnational | "Output walkthrough — see facilitator handout / 3 min" |  |
| m7_2_data_visualization_communication.md | Moving from data to key messages | THEORY |  |  |  |
| m7_2a_data_visualization_communication_continued.md | Example: result vs key takeaway | THEORY |  |  |  |
| m7_2a2_finding_statement_formula.md | Writing a finding statement | THEORY |  |  |  |
| m7_2a2_finding_statement_formulab.md | Try it yourself | ACTIVITY | h_m7_finding_statement | "Activity: finding statement — see handout / 10 min" |  |
| m7_2b_data_visualization_communication.md | Try it yourself | ACTIVITY | h_m7_result_takeaway | "Activity: result → takeaway — see handout / 10 min" |  |
| m7_2b_data_visualization_communication_continued.md | Choosing the right report format | THEORY |  |  |  |
| m7_2c_data_visualization_communication_continued.md | Storytelling with data | THEORY |  |  |  |
| m7_2cb_data_visualization_communication_continued.md | Structure your presentation like a story | THEORY |  |  |  |
| m7_2d_data_visualization_communication_continued.md | Example: developing a data story | THEORY |  |  |  |
| m7_3_using_data_for_decision_making.md | Dissemination and data use roadmap | THEORY |  |  |  |
| m7_3a_using_data_for_decision_making_continued.md | Action plan for FASTR moving forward | THEORY |  |  |  |
| m7_4_topic_4.md | Understanding your audience: User mapping | THEORY |  |  |  |
| m7_4a_map_your_users.md | Activity: Map your users | ACTIVITY | h_m7_user_mapping | "Activity: map your users — see handout / 20 min" |  |
| m7_4a_topic_4a.md | Activity: Map your users | ACTIVITY | (same as above) |  | DUPLICATE — consolidate with m7_4a_map_your_users |
| m7_5_topic_5.md | Storytelling with data | THEORY |  |  |  |
| m7_5a_topic_5a.md | From data to story: Example | THEORY |  |  |  |
| m7_6_topic_6.md | Linking results to actions | THEORY |  |  |  |
| m7_6a_link_results_to_actions.md | Activity: Link your results to actions | ACTIVITY | h_m7_results_actions | "Activity: link to actions — see handout / 20 min" |  |
| m7_6a_topic_6a.md | Activity: Link your results to actions | ACTIVITY | (same as above) |  | DUPLICATE — consolidate |
| m7_6b_three_spheres_of_influence.md | Three spheres of influence | THEORY |  |  |  |
| m7_7_topic_7.md | Building a roadmap for sustained use | THEORY |  |  |  |
| m7_7a_country_action_planning.md | Activity: Country action planning | ACTIVITY | h_m7_action_plan | "Activity: country action plan — see handout / 30 min" |  |
| m7_7a_topic_7a.md | Activity: Country action planning | ACTIVITY | (same as above) |  | DUPLICATE — consolidate |
| m7_s1_from_data_to_key_messages.md | From data to key messages | THEORY |  |  | condensed |
| m7_s2_storytelling_with_data.md | Storytelling with data | THEORY |  |  | condensed |
| m7_s2a_finding_statement_formula.md | Writing a finding statement | THEORY |  |  | condensed |
| m7_s2ab_finding_statement_formula.md | Try it yourself | ACTIVITY | h_m7_finding_statement_condensed | "Activity: finding statement — see handout / 10 min" | condensed variant |
| m7_s3_choosing_report_format.md | Choosing the right report format | THEORY |  |  | condensed |
| m7_s4_linking_results_to_actions.md | Linking results to actions | THEORY |  |  | condensed |
| m7_s5_three_spheres_of_influence.md | Three spheres of influence | THEORY |  |  | condensed |

### M8 — Survey & HFA (4 slides)

**Notes**: pure theory module. No handouts needed.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m8_1_rapid_cycle_facility_survey.md | Rapid-cycle facility survey | THEORY |  |  |  |
| m8_1a_hfa_survey_design.md | Health facility survey design | THEORY |  |  |  |
| m8_1b_adaptive_survey_content.md | Adaptive survey content with RMNCAH-N focus | THEORY |  |  |  |
| m8_1c_four_types_of_indicators.md | Four types of indicators | THEORY |  |  |  |

### M9a — Instance Setup (4 slides)

**Notes**: pure activity module. All 4 slides become handouts. Currently the most clear-cut case for the handout pattern.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m9a_0_setting_up_admin_areas.md | Activity: Setting up admin areas | ACTIVITY | h_m9a_admin_areas | "Activity: admin areas — see handout / 25 min" |  |
| m9a_1_importing_data.md | Activity: Importing data | ACTIVITY | h_m9a_importing_data | "Activity: import data — see handout / 25 min" |  |
| m9a_2_installing_running_modules.md | Activity: Installing and running modules | ACTIVITY | h_m9a_modules | "Activity: install modules — see handout / 20 min" |  |
| m9a_3_creating_project.md | Activity: Creating a project | ACTIVITY | h_m9a_creating_project | "Activity: create project — see handout / 15 min" |  |

### M9b — Getting Started (3 slides)

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m9b_0_platform_demo.md | Demo: FASTR analytics platform | DEMO | h_m9b_platform_demo | "Demo: platform tour — see facilitator handout / 10 min" | Empty title in meta — fix |
| m9b_1_logging_into_platform.md | Practice: Logging into the platform | ACTIVITY | h_m9b_logging_in | "Activity: log in — see handout / 10 min" |  |
| m9b_2_creating_user_folder.md | Creating your user folder | HYBRID | h_m9b_user_folder | "Activity: user folder — see handout / 10 min" | Theory = why folders matter; handout = I-do/you-do steps |

### M9c — Visualizations & Interpretation (13 slides)

**Notes**: heavily activity-flavoured. 8 ACTIVITY + 2 DEMO + 3 THEORY.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m9c_0a_creating_visualizations_intro.md | Creating visualizations | THEORY |  |  |  |
| m9c_0b_choosing_chart_type.md | Choosing the right chart type | THEORY |  |  |  |
| m9c_1_creating_visualizations_manually.md | Activity: Creating visualizations manually | ACTIVITY | h_m9c_create_manually | "Activity: viz manually — see handout / 30 min" | I-we-you scaffold |
| m9c_2_creating_visualizations_ai.md | Activity: Creating visualizations using AI | ACTIVITY | h_m9c_create_with_ai | "Activity: viz with AI — see handout / 25 min" | I-we-you scaffold |
| m9c_2a_explore_with_ai.md | Explore with the AI Assistant | ACTIVITY | h_m9c_explore_ai | "Activity: free explore with AI — see handout / 20 min" |  |
| m9c_3_interpreting_visualizations.md | How to interpret a FASTR visualization | THEORY |  |  | 6-step framework |
| m9c_3a_interpreting_example.md | Example: Interpreting a visualization | DEMO | h_m9c_interpret_example | "Demo: interpretation example — see facilitator handout / 10 min" |  |
| m9c_3a2_interpreting_narrative.md | Example narrative: ANC1/ANC4 trends | DEMO | h_m9c_narrative_example | "Demo: narrative example — see facilitator handout / 5 min" |  |
| m9c_3b_interpreting_activity.md | Activity: Interpreting visualizations in slide decks | ACTIVITY | h_m9c_interpret_slidedecks | "Activity: interpret in slide decks — see handout / 25 min" | I-we-you |
| m9c_3c_try_it_yourself.md | Try it yourself | ACTIVITY | h_m9c_try_it_yourself | "Activity: apply 6-step framework — see handout / 15 min" |  |
| m9c_4_interpreting_with_ai.md | Activity: Creating interpretations with AI | ACTIVITY | h_m9c_interpret_with_ai | "Activity: AI interpretations — see handout / 25 min" |  |
| m9c_5_disruption_exercise.md | Has there been a disruption? | ACTIVITY | h_m9c_disruption_check | "Activity: disruption check — see handout / 15 min" | Includes context/financing discussion |
| m9c_5a_dig_deeper.md | Dig deeper: is it real or a data issue? | ACTIVITY | h_m9c_data_vs_disruption | "Activity: dig deeper — see handout / 10 min" |  |

### M9d — Slide Decks (12 slides)

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m9d_0a_creating_slide_decks_intro.md | Creating slide decks | THEORY |  |  |  |
| m9d_1_creating_slide_decks.md | Activity: Creating slide decks | ACTIVITY | h_m9d_create_slide_deck | "Activity: create slide deck — see handout / 15 min" |  |
| m9d_1a_adding_viz_interpretation_guide.md | Add a visualization and interpretation text | HYBRID | h_m9d_add_viz_text | "Activity: add viz + text — see handout / 15 min" | Theory = block model; handout = step list |
| m9d_1b_adding_viz_manually.md | Activity: Adding visualizations manually | ACTIVITY | h_m9d_add_viz_manually | "Activity: add viz manually — see handout / 15 min" | I-we-you |
| m9d_1c_adding_viz_ai.md | Activity: Adding visualizations using AI | ACTIVITY | h_m9d_add_viz_ai | "Activity: add viz with AI — see handout / 15 min" | I-we-you |
| m9d_2_editing_formatting_slides.md | Your next task: Edit and finalize | ACTIVITY | h_m9d_edit_slides | "Activity: edit slides — see handout / 20 min" |  |
| m9d_2a_editing_why_it_matters.md | Editing your slides: why it matters | THEORY |  |  |  |
| m9d_2b_open_slide_editor.md | Step 1: Open the slide editor | DEMO | h_m9d_open_editor | "Demo: open editor — see facilitator handout / 2 min" | Maybe consolidate with m9d_2c, m9d_2d |
| m9d_2c_resize_text_visualization.md | Step 2: Resize text and visualization | DEMO | h_m9d_resize | "Demo: resize — see facilitator handout / 3 min" |  |
| m9d_2d_other_edits.md | Other edits you can make | DEMO | h_m9d_other_edits | "Demo: other edits — see facilitator handout / 3 min" |  |
| m9d_3_formatting_text.md | Formatting your report text | THEORY |  |  | Reference table |
| m9d_3a_formatting_report_settings.md | Formatting your report: settings | THEORY |  |  | Reference |

### M9e — Disruption Report (14 slides)

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m9e_1_manual_to_ai_reporting.md | Time to build your final output | THEORY |  |  | Session framing |
| m9e_2_creating_disruption_report_ai.md | Activity: Creating a disruption report with AI | ACTIVITY | h_m9e_setup_report_generation | "Activity: report setup — see handout / 15 min" |  |
| m9e_2a_alternative_approach.md | Alternative: Working without a custom prompt | THEORY |  |  |  |
| m9e_2ab_alternative_approach.md | Step 1: Upload report to Assets | DEMO | h_m9e_upload_assets | "Demo: upload assets — see facilitator handout / 3 min" |  |
| m9e_2ac_alternative_approach.md | Step 2: Include report in AI conversation | DEMO | h_m9e_attach_file_chat | "Demo: attach file — see facilitator handout / 3 min" |  |
| m9e_2b_creating_disruption_report_ai.md | Understanding the prompt | THEORY |  |  |  |
| m9e_2c_creating_disruption_report_ai.md | AI Assistant will ask for report details | DEMO | h_m9e_respond_ai_questions | "Demo: AI intake — see facilitator handout / 5 min" |  |
| m9e_3_ai_proposes_groupings.md | AI proposes indicator groupings | DEMO | h_m9e_review_groupings | "Demo: review groupings — see facilitator handout / 5 min" |  |
| m9e_4_confirm_ai_builds.md | Confirm and AI builds your slides | DEMO | h_m9e_generate_slides | "Demo: AI builds slides — see facilitator handout / 10 min" |  |
| m9e_5_review_checklist.md | Review checklist: Verifying AI output | ACTIVITY | h_m9e_verify_output | "Activity: review checklist — see handout / 15 min" |  |
| m9e_6_refine_disruption_report.md | Activity: Refine your disruption report | ACTIVITY | h_m9e_refinement_options | "Activity: refine — see handout / 30 min" |  |
| m9e_6b_refine_disruption_report.md | Review checklist: Prompt 2 & 3 | ACTIVITY | h_m9e_verify_prompts_2_3 | "Activity: verify prompts 2&3 — see handout / 15 min" |  |
| m9e_7_peer_review_checklist.md | Peer review: disruption report feedback | ACTIVITY | h_m9e_peer_review | "Activity: peer review — see handout / 30 min" |  |
| m9e_8_presenting_reports.md | Presenting reports and group feedback | ACTIVITY | h_m9e_final_presentation | "Activity: present reports — see handout / 45 min" | Plenary debrief |

### M9f — Prompting Techniques (11 slides)

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m9f_0_good_vs_vague_prompt.md | From vague to specific | THEORY |  |  |  |
| m9f_0b_good_vs_vague_prompt.md | Try it yourself — build a prompt | ACTIVITY | h_m9f_build_prompt | "Activity: build a prompt — see handout / 10 min" |  |
| m9f_1_explore_with_ai_assistant.md | Explore with the AI Assistant | ACTIVITY | h_m9f_explore_assistant | "Activity: explore — see handout / 15 min" |  |
| m9f_2_iterative_vs_single_prompts.md | Exercise: AI & iterative conversation | ACTIVITY | h_m9f_iterative_prompts | "Activity: iterative prompts — see handout / 20 min" |  |
| m9f_2b_iterative_vs_single_prompts.md | Exercise: AI & single prompt | ACTIVITY | h_m9f_single_prompt | "Activity: single prompt — see handout / 15 min" | Comparison pair with m9f_2 |
| m9f_2c_iterative_vs_single_prompts.md | Iterative vs single prompts: reflection | HYBRID | h_m9f_iterative_comparison | "Activity: reflect — see handout / 10 min" | Theory = principles; handout = reflection prompts |
| m9f_3_refining_a_prompt.md | Self-paced exercise: Refining a prompt | ACTIVITY | h_m9f_refine_prompt | "Activity: refine — see handout / 20 min" |  |
| m9f_4_introducing_prompt_library.md | Introducing the prompt library | THEORY |  |  |  |
| m9f_4b_introducing_prompt_library.md | Prompt library organization | THEORY |  |  |  |
| m9f_5_working_from_pdf_template.md | Alternative: Working from a PDF template | DEMO | h_m9f_pdf_template | "Demo: PDF template workflow — see facilitator handout / 10 min" |  |
| m9f_6_example_prompts.md | Example prompts at a glance | DEMO | h_m9f_example_prompts | "Reference: example prompts — see handout" | Could be a participant reference handout instead of demo |

### M9g — FASTR Quiz (6 slides)

**Notes**: 1 intro + 5 quiz questions. Recommend: keep intro on screen to frame the activity; move all 5 questions to a single combined handout so participants can work asynchronously and keep it as a reference. Alternative: keep quiz on-screen (revealed one-by-one) and add a *participant answer sheet* as the handout. Decision needed.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m9g_1_fastr_quiz.md | FASTR quiz | THEORY |  |  | Intro/framing — keep as slide |
| m9g_1b_fastr_quiz.md | 1. What does FASTR stand for? | ACTIVITY | h_m9g_quiz | "Quiz: 5 questions — see handout / 15 min" | Consolidate Q1–5 into one handout |
| m9g_1c_fastr_quiz.md | 2. FASTR's 3 data quality dimensions? | ACTIVITY | (same as above) |  |  |
| m9g_1d_fastr_quiz.md | 3. 4 technical pillars under FASTR? | ACTIVITY | (same as above) |  |  |
| m9g_1e_fastr_quiz.md | 4. ANC1 vs ANC4 case | ACTIVITY | (same as above) |  | Scenario-based |
| m9g_1f_fastr_quiz.md | 5. ANC1 coverage target population | ACTIVITY | (same as above) |  |  |

### M9h — Platform Demo (1 slide)

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m9h_1_platform_access_roles.md | Live demo: platform access & roles | DEMO | h_m9h_platform_access_roles | "Demo: platform access & roles — see facilitator handout / 15 min" |  |

### M9i — Standard FASTR Reports (3 slides)

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| m9i_1_report_overview.md | What we're building | THEORY |  |  |  |
| m9i_2_create_report.md | Creating a report step by step | ACTIVITY | h_m9i_create_report | "Activity: create report — see handout / 20 min" |  |
| m9i_3_ai_draft.md | Speed up with the AI assistant | HYBRID | h_m9i_ai_draft | "Activity: AI-drafted report — see handout / 60 min" | Theory = AI capabilities; handout = group task to build Q4 report |

### MAI — AI Assistant (30 slides)

**Notes**: pure theory module. NO handouts needed. **Major caveat**: ~15 slides appear to be duplicates from a prior refactor (same `order` value used twice with different files). Recommend a separate cleanup pass to dedupe before pipeline work.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| mai_1_ai_assistant_overview.md | The AI assistant | THEORY |  |  |  |
| mai_2_ai_accelerator_not_decider.md | AI is an accelerator, not a decision maker | THEORY |  |  |  |
| mai_2_ai_assistant_capabilities.md | AI is an accelerator, not a decision maker | THEORY |  |  | DUPLICATE of mai_2_ai_accelerator_not_decider |
| mai_2a_four_skills_for_ai.md | Working well with AI: four habits | THEORY |  |  |  |
| mai_2b_four_skills_in_practice.md | The 4 D's — think of AI as a new colleague | THEORY |  |  |  |
| mai_3_ai_ask_questions.md | What the AI assistant can do | THEORY |  |  |  |
| mai_3_ai_assistant_capabilities.md | What the AI assistant can do | THEORY |  |  | DUPLICATE of mai_3_ai_ask_questions |
| mai_3a_ai_ask_questions_continued.md | Where the AI provides greatest value | THEORY |  |  |  |
| mai_3a_ai_greatest_value.md | Where the AI helps most | THEORY |  |  | DUPLICATE of mai_3a_ai_ask_questions_continued |
| mai_4_ai_conversations.md | How the AI assistant works | THEORY |  |  |  |
| mai_4_ai_how_it_works.md | How the AI assistant works | THEORY |  |  | DUPLICATE of mai_4_ai_conversations |
| mai_4a_ai_conversations.md | How conversations work | THEORY |  |  |  |
| mai_4a_ai_conversations_continued.md | How conversations work | THEORY |  |  | DUPLICATE of mai_4a_ai_conversations |
| mai_5_ai_little_value_example.md | When AI adds little value | THEORY |  |  |  |
| mai_5_ai_tips_better_answers.md | When AI adds little value | THEORY |  |  | DUPLICATE of mai_5_ai_little_value_example |
| mai_5a_ai_good_prompt_checklist.md | When AI is helpful | THEORY |  |  |  |
| mai_5a_ai_helpful_example.md | When AI is helpful | THEORY |  |  | DUPLICATE of mai_5a_ai_good_prompt_checklist |
| mai_6_ai_capabilities_table.md | Tips for better answers | THEORY |  |  |  |
| mai_6_ai_tips_better_answers.md | Tips for better answers | THEORY |  |  | DUPLICATE of mai_6_ai_capabilities_table |
| mai_6a_ai_capabilities_table_continued.md | What makes a good prompt? | THEORY |  |  |  |
| mai_6a_ai_good_prompt_checklist.md | What makes a good prompt? | THEORY |  |  | DUPLICATE of mai_6a_ai_capabilities_table_continued |
| mai_7_ai_prompt_library_overview.md | The prompt library | THEORY |  |  |  |
| mai_7a_ai_prompt_examples_table.md | Example prompts at a glance | THEORY |  |  |  |
| mai_7b_ai_prompt_library_overview.md | Prompt library organization | THEORY |  |  |  |
| mai_8_ai_private_vs_shared.md | What happens when you log off | THEORY |  |  |  |
| mai_8_ai_what_happens_log_off.md | What happens when you log off | THEORY |  |  | DUPLICATE of mai_8_ai_private_vs_shared |
| mai_8a_ai_private_vs_shared.md | Private vs shared on team projects | THEORY |  |  |  |
| mai_8a_ai_private_vs_shared_continued.md | Private vs shared on team projects | THEORY |  |  | DUPLICATE of mai_8a_ai_private_vs_shared |
| mai_8b_ai_private_vs_shared_continued.md | How teams work together | THEORY |  |  |  |
| mai_8b_ai_team_collaboration.md | How teams work together | THEORY |  |  | DUPLICATE of mai_8b_ai_private_vs_shared_continued |

### MW — Webinar (20 slides)

**Notes**: webinar content. The activity/hybrid handouts here are pre-/post-webinar materials (worksheets, checklists, tracking sheets) rather than in-room workshop activities — different shape from M9 handouts.

| File | Title | Tag | Handout name | Pointer slide text | Notes |
|------|-------|-----|--------------|--------------------|-------|
| mw_1_fastr_at_a_glance.md | FASTR at a glance | THEORY |  |  |  |
| mw_2_data_sources_visual.md | Data sources at a glance | THEORY |  |  |  |
| mw_3_indicator_essentials.md | Key RMNCAH-N indicators | THEORY |  |  |  |
| mw_4_data_quality_snapshot.md | Data quality at a glance | THEORY |  |  |  |
| mw_5_platform_highlights.md | FASTR Analytics Platform | DEMO | h_mw_platform_demo | "Platform tour — see facilitator notes / 5 min" |  |
| mw_6_ai_assistant_intro.md | AI assistant | THEORY |  |  |  |
| mw_7_country_progress.md | FASTR across countries | THEORY |  |  |  |
| mw_8_webinar_objectives.md | Webinar objectives | THEORY |  |  |  |
| mw_9_webinar_agenda.md | Agenda | THEORY |  |  |  |
| mw_10_team_introductions.md | Team and participant introductions | ACTIVITY | h_mw_intro_worksheet | "Introductions — see worksheet" | Optional pre-fill worksheet |
| mw_11_fastr_context.md | Why FASTR? | THEORY |  |  |  |
| mw_12_priority_poll.md | Priority ranking poll | ACTIVITY | h_mw_priority_ranking | "Priority ranking — see handout" | Pre-poll worksheet |
| mw_13_context.md | Disruptions and context | THEORY |  |  |  |
| mw_14_experience_poll.md | FASTR experience poll | ACTIVITY | h_mw_experience_checklist | "Self-assessment — see handout" | Pre-poll worksheet |
| mw_15_fastr_objective.md | FASTR objective | THEORY |  |  |  |
| mw_16_rmncahn_approach.md | RMNCAH-N monitoring approach | THEORY |  |  |  |
| mw_17_analysis_pipeline.md | HMIS analysis pipeline | HYBRID | h_mw_analysis_pipeline | "Pipeline reference — see handout" | Theory = pipeline diagram; handout = expanded reference |
| mw_18_whats_next.md | What's next | HYBRID | h_mw_workshop_prep | "Pre-workshop checklist — see handout" | Theory = framing; handout = checklist |
| mw_19_next_steps.md | Next steps before the workshop | HYBRID | h_mw_next_steps_tracker | "Next-steps tracker — see handout" | Theory = framing; handout = timeline tracker |
| mw_20_about_fastr.md | About FASTR | THEORY |  |  |  |

---

## Recommended next pass

Open questions surfaced by the audit. These become the brief for the second-round pipeline plan (where handouts live, how they're rendered, how they get into a workshop deck).

### Content-strategy questions

1. ~~**MAI cleanup before handouts.**~~ ✅ **Done 2026-05-12.** 12 EN duplicates removed; EN meta now mirrors canonical FR order (18 slides).
2. ~~**M7 `_topic_*a.md` duplicates.**~~ ✅ **Done 2026-05-12.** 3 byte-identical leftover files removed; EN/FR file lists now identical in M7.
3. ~~**M7 output-walkthrough DEMOs.**~~ ✅ **Decided 2026-05-13.** One "How to read [module] outputs" reference handout per analytical module (DQA, Adjustment, Service Utilization, Disruption, Coverage) — ~5 reference handouts covering all 13 M7 output slides.
4. ~~**M9g quiz handling.**~~ 🅿️ **Parked 2026-05-13.** Decision deferred to pipeline implementation.
5. ~~**MW handouts shape.**~~ ✅ **Decided 2026-05-13.** Separate template optimised for solo pre/post-webinar work; delivered as downloadable links in webinar emails, not bound into a workshop packet.
6. ~~**Demo handouts: facilitator vs participant.**~~ ✅ **Decided 2026-05-13.** Separate facilitator-notes template for DEMO content; ACTIVITY handouts stay participant-facing.
7. **Existing M2 Data Downloader screenshots (6 slides).** Still open. Currently tagged THEORY (reference material) — revisit if you want a printable tool guide.
8. **Estimated minutes on pointer slides.** Numbers used in this audit (`/15 min`, `/30 min`) are rough estimates. Final pointer slides need real durations validated by anyone who's run the activity in-room.

### EN/FR sync follow-ups

✅ **Resolved 2026-05-13.** Three rounds of cleanup landed:

**Round 1 — meta dedup + missing translations:**
- M6 file dedup: presenter notes from `m6_s5_value_beyond_dhis2.md` merged into the FR-canonical `m6_s6_fastr_value_beyond_dhis2.md`; both `m6_s5_value` and the byte-identical `m6_s6_topic_s6.md` deleted.
- EN meta rewrites for M4, M6, M7, M9e to mirror FR `_meta.yaml` ordering (all duplicate `order` values eliminated).
- `m4_2a_notes_on_completeness.md` translated to FR and added to FR meta.

**Round 2 — Bucket A: EN monolithic file refactor (18 files trimmed):**

A structural-consistency scan found that EN contains multi-slide monolithic markdown files (separated by `---`), while FR has the same content split into one-slide-per-file. Both sides referenced the split files in their `_meta.yaml`, but EN also referenced the monoliths — meaning workshops in EN double-rendered slides 2+ when both the monolith and its split files were in the deck.

Refactored EN to match FR: trimmed each monolith to slide 1; slides 2+ already existed as separate `*_b`, `*_c`, `*_d` files. 18 EN files trimmed across M4, M5, M6:

| Monolith trimmed | Slides preserved as | Lines (was → now) |
|------------------|---------------------|-------------------|
| m4_1_approach_to_dqa.md | m4_1b, m4_1c, m4_1d | 68 → 18 |
| m4_3_outliers.md | m4_3b, m4_3c | 55 → 24 |
| m4_4_internal_consistency.md | m4_4b | 67 → 45 |
| m4_s1_dqa_pipeline_overview.md | m4_s1b | 29 → 16 |
| m4_s2_dqa_rationale_objectives.md | m4_s2b | 30 → 18 |
| m4_s3_dqa_completeness.md | m4_s3b_dqa_completeness | 54 → 25 |
| m4_s3b_dqa_outliers.md | m4_s3bb | 65 → 29 |
| m4_s4_dqa_internal_consistency.md | m4_s4b | 47 → 26 |
| m4_s5_dqa_score_summary.md | m4_s5b, m4_s5c | 76 → 26 |
| m5_1_approach_to_dq_adjustment.md | m5_1b | 38 → 20 |
| m5_s2_dq_adjustment_interpretation.md | m5_s2b | 56 → 25 |
| m6_1_service_utilization_analysis.md | m6_1b | 22 → 12 |
| m6_2_service_disruptions_surpluses_detection.md | m6_2b, m6_2c | 53 → 12 |
| m6_6_service_coverage_introduction.md | m6_6b, m6_6c | 45 → 14 |
| m6_s1_utilization_overview.md | m6_s1b | 58 → 27 |
| m6_s2_disruption_interpretation.md | m6_s2b | 49 → 17 |
| m6_s3_coverage_overview.md | m6_s3b_coverage_overview | 35 → 14 |
| m6_s4_coverage_interpretation.md | m6_s4b | 57 → 25 |

Structural divergence dropped from **41 pairs to 17**. Remaining 17 are all low-severity (bullet count nudges from translator style + 5 missing FR images + 1 mai table where FR has more rows than EN).

Validator state after all rounds:
- ✓ EN `_meta.yaml` consistent
- ✓ FR `_meta.yaml` consistent
- ✓ Full translation coverage
- ✓ `modules.yaml` valid
- ✓ 13/13 web-app tests pass

Bucket B (smaller drift — missing FR images, minor content variations) deferred to a follow-up.

**Round 3 — Bucket B partial cleanup + handout infrastructure (2026-05-13):**
- 4 FR icon-ref insertions (m2_2b, m7_4a, m7_6a, m7_7a) — content gaps closed.
- mai_8 FR backport: outdated whiteboard row + footnote removed; AI conversation note synced to EN's accurate wording.
- M8 placeholder translated: `m8_1_rapid_cycle_facility_survey.md` FR fully written + 2-column layout + hospital icon ref restored.
- Validator quick wins: 3 broken image refs fixed (m0_3 URL-encoded filename, m6_s1a EN+FR by renaming asset to `Module3_QoQ_change.png`), slide density warning fixed (m7_6b `_class: compact` added).
- **Content freshness tracking added**: `last_reviewed: YYYY-MM-DD` field in `_meta.yaml`; new `tools/check_content_freshness.py` script lists stale (>6 months) and unverified slides per language.
- M0 / M1 / M3 theory review: 30 slide entries stamped per language (M3 roadmap `m3_5_roadmap_2026.md` skipped pending verification).
- **Handout infrastructure built**: `handouts/` folder + 3 blank templates (participant_activity, facilitator_demo, webinar_worksheet) + `fastr-handout.css` A4 Marp theme + `tools/render_handout.sh` render script + `handouts/en/m9a/h_m9a_admin_areas.md` skeleton example (EN+FR). 3 PDFs successfully rendered as smoke test.

Final state after Round 3:
- ✓ Divergent EN/FR pairs: 41 → 17 → 12 → 11 (only minor bullet-count nudges remain, plus M3 roadmap)
- ✓ Slide content-freshness: 25 → 58 stamped per language (233 unverified backlog remains)
- ✓ Validator: 0 broken refs, 0 density warnings, EN+FR meta consistent, full translation coverage
- ✓ Web-app: 13/13 tests pass, tsc clean

### Pipeline-design questions (for the second plan)

1. **Folder layout.** Where do handout source files live?
   - Option A: new top-level `handouts/` folder mirroring `core_content/` module structure
   - Option B: `core_content/{module}/handouts/` sub-folders
   - Option C: same folder, distinguished by filename prefix (`h_*.md`)
2. **Markdown shape.** Marp-style markdown with A4 page break directives? Pandoc-flavoured? A new lightweight template (front-matter + body) that renders via a custom A4 CSS?
3. **Output format.** PDF only? PDF + printable HTML? Editable docx? Single source → multiple outputs?
4. **Bilingual.** FR mirror of every handout source file, like `core_content_fr/`? Or single bilingual source with `[en]:` / `[fr]:` blocks?
5. **Deck-builder integration.** Does the web-app surface handouts as a separate "Handouts" mode alongside slides? Does export bundle both? Per-workshop selection of handouts (like sessions)?
6. **Per-workshop customization.** Like slides today, should a workshop be able to fork a handout for country-specific customisation? Same `fork-on-edit` pattern, but for handouts.
7. **Numbering.** Pointer slides currently say "see handout" (no page number). If we bundle handouts into a single workshop packet, do we number them and have the pointer say "see handout p.7"?
8. **Source ↔ slide replacement.** When a slide is replaced by a pointer slide, do we keep the original detailed slide in the library (for reference) or delete it? If we keep it, how do we prevent it from being added to a deck by mistake?

### Volume + effort estimate

- **~91 handouts** at 1–2 pages each = 90–180 pages of new content
- Roughly **half** are short demo/output walkthroughs (1 page each)
- Roughly **half** are full activity guides (2 pages each)
- After MAI deduplication: total slide count drops from ~308 to ~293
- After duplicate-activity consolidation in M7: handout count drops by 3
- Realistic final handout count: **~87**

Each handout needs an EN + FR version. So **~174 markdown source files** to write at the content-creation phase.
