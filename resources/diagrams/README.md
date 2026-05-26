# Diagram library

This directory holds every visual asset used across the FASTR resource hub —
methodology docs, workshop slides, and printed handouts. Use this file as the
reference for what each diagram shows and where it is used.

## Directory layout

| Path | What lives here |
|---|---|
| `resources/diagrams/` | English diagrams (the default; referenced by EN content) |
| `resources/diagrams_fr/` | French versions; mirrors the EN filename so refs swap by switching the parent path |
| `resources/diagrams_pt/` | Portuguese versions (currently only translatable diagrams built from GFF sources) |
| `resources/diagrams/fastr_gff/` | Untouched scrape of the official GFF FASTR portal (source library — do not edit; the generator reads from here) |

## Translatable diagrams from GFF sources

Some diagrams pulled from the GFF portal have their text flattened to vector
outlines, so they cannot be translated by editing the file. The generator at
`tools/build_fastr_diagrams.py` solves this:

1. Reads a source SVG from `fastr_gff/`.
2. Strips the text-glyph paths by fill class — `cls-5` (grey column text) and the
   lower-Y `cls-6` paths (white base-bar text), keeping the four upper `cls-6`
   paths which are the white column cards.
3. Adds a white background and a column-coloured stroke to each card.
4. Injects live SVG `<text>` per language from the recipe table in the script.
5. Emits one file per language to `resources/diagrams{,_fr,_pt}/`.

To update wording or add a new GFF-sourced translatable diagram, edit the recipe
in `tools/build_fastr_diagrams.py` and re-run:

```
python3 tools/build_fastr_diagrams.py
```

Native `<text>` was chosen over `<foreignObject>` so the SVG renders correctly
when embedded via `<img>` (Marp, MkDocs, browsers).

---

## Catalog

Diagrams are grouped by where they're used in the workshop curriculum. The
"Primary use" column lists the canonical reference; many diagrams are also
referenced from related handouts and the methodology docs.

### Intro & "what is FASTR?" (m0)

| File | Shows | Primary use |
|---|---|---|
| `rapid_cycle_analytics.png` | Continuous rapid-cycle analytics, conceptual | slide `m0_0` |
| `Technical_approaches_image.svg` | Four technical approaches — **new GFF design**, translatable (EN/FR/PT) | slide `m0_1`, methodology Fig 3 |
| `what_is_fastr.png` | "Analyze → learn → strengthen → act" loop, single-frame | slide `m0_2` |
| `FASTR_rapid_cycle_analytics_approach.svg` | The full analyze/learn/strengthen/act cycle — **new GFF design**, translatable (EN/FR/PT) | methodology Fig 2 |
| `steps_to_implement_rmncahn_service_chart.svg` | Implementation steps for RMNCAH-N service-use monitoring | slide `m0_3`, methodology Fig 1 |
| `from_analysis_to_action.svg` | Analysis → action arc | slide `m0_3b` |
| `data_triangulation_layers.svg` | Triangulating multiple data sources | slide `m0_5` |
| `disruptions_questions.svg` | Key questions framing disruption analysis | slide `m0_6` |

### Methodology — M1 Data quality assessment (DQA)

| File | Shows | Primary use |
|---|---|---|
| `analytical_pipeline.svg` | Overview of the FASTR analytical pipeline (used across modules) | slide `m4_s1_…`, methodology 04 |
| `measures_data_quality.svg` | The three DQA dimensions | slide `m4_1d_approach_to_dqa` |
| `methodology_outlier.svg` | What "outlier" means visually | handout `h_methodology_dqa` |
| `outlier_impact.svg` | Effect of one outlier on a trend | slide `m4_3b_outliers`, adjustment handouts |
| `completeness_illustration.svg` | Reporting completeness over time | handout `h_methodology_dqa` |
| `consistency_illustration.svg` | Internal consistency between related indicators | slide `m4_4_internal_consistency` |
| `district_consistency.svg` | District-level rollup illustrating consistency | slide `m4_4b_internal_consistency` |

### Methodology — M2 DQA adjustment

| File | Shows | Primary use |
|---|---|---|
| `why_adjust_outliers.svg` | Why adjusting outliers matters | slide `m5_s1a_why_adjust_for_outliers`, adjustment handout |

### Methodology — M3 Service utilization

| File | Shows | Primary use |
|---|---|---|
| `disruptions_framing.svg` | Why disruption detection matters | slide `m6_2a_why_detecting_disruptions_matters` |
| `disruption_chart.png` | Example of an actual-vs-expected service-use chart | slide `m6_2b_service_disruptions_surpluses_detection` |
| `disruption_chart_annotated.svg` | Annotated reading of a disruption chart | slide `m6_s0b_reading_disruption_chart`, methodology recap handout |
| `indicator_directionality.svg` | Which indicators "go up" when service improves | slide `m6_1c_indicator_directionality` |

### Methodology — M5+M6 Coverage estimates

| File | Shows | Primary use |
|---|---|---|
| `coverage_equation.svg` | `coverage = served ÷ in-need` | slide `m6_6_service_coverage_introduction` |
| `coverage_example_anc4.svg` | Worked example with ANC4 | slide `m6_7_definition_of_coverage` |
| `coverage_projection.svg` | Projecting coverage between surveys | slide `m6_14_coverage_projection_methodology` |
| `denominator_cascade.svg` | The "chain of life" demographic cascade | slide `m6_9_demographic_cascade` |
| `denominator_cascade_example.svg` | Cascade with worked numbers | slide `m6_10_denominator_cascade_illustration` |
| `denominator_comparison.svg` | Comparing alternative denominators | slide `m6_13a_denominator_comparison` |
| `service_cascade_funnel.svg` | Service-cascade dropout funnel | slide `m6_9a_cascade_dropout` |

### Workshop activities

#### m3 — FASTR Analytics Platform

| File | Shows | Primary use |
|---|---|---|
| `platform_capabilities.svg` | Platform feature map | slide `m3_1b_overview_of_platform_continued` |
| `projects_within_instance.svg` | Projects nested within a country instance | slide `m3_2c_accessing_platform_continued` |
| `platform_roadmap_2026.svg` | 2026 roadmap | slide `m3_5_roadmap_2026` |

#### m7 — Results communication

| File | Shows | Primary use |
|---|---|---|
| `storytelling_with_data.svg` | Story arc for data communication | slide `m7_s2_storytelling_with_data` |
| `three_spheres_of_influence.svg` | Control / influence / concern framework | slide `m7_6b_three_spheres_of_influence` |

#### m8 — Survey & HFA

| File | Shows | Primary use |
|---|---|---|
| `hfa_indicator_types.svg` | Four types of HFA indicators | slide `m8_1c_four_types_of_indicators` |

#### m9c — Visualizations & interpretation

| File | Shows | Primary use |
|---|---|---|
| `chart_type_guide.svg` | When to use which chart type | slide `m9c_0b_choosing_chart_type` |
| `m9c_filter.svg` | Filter vs disaggregate (the filter half) | handout `h_m9c_create_viz_manually` |
| `m9c_disaggregate.svg` | Filter vs disaggregate (the disaggregate half) | handout `h_m9c_create_viz_manually` |

#### mai — AI assistant

| File | Shows | Primary use |
|---|---|---|
| `ai_accelerator.svg` | AI as an accelerator, not a decider | slide `mai_2_ai_accelerator_not_decider` |
| `ai_on_rails.svg` | How the FASTR AI is constrained ("on rails") | slide `mai_4_ai_how_it_works` |
| `ai_principles.svg` | Core principles for using the AI | methodology section (FR) |

#### mw — Webinar

| File | Shows | Primary use |
|---|---|---|
| `mw_1_approaches.svg` | FASTR's four approaches, webinar version | slide `mw_1_fastr_at_a_glance` |
| `mw_5_platform.svg` | Platform highlights | slide `mw_5_platform_highlights` |
| `mw_8_objectives.svg` | Webinar objectives | slide `mw_8_webinar_objectives` |
| `mw_17_pipeline.svg` | Analysis pipeline, webinar version | slide `mw_17_analysis_pipeline` |
| `mw_19_next_steps.svg` | Next steps slide | slide `mw_19_next_steps` |

#### HMIS data flow

| File | Shows | Primary use |
|---|---|---|
| `HMIS_data_flow.svg` | How HMIS data moves from facility → national | (sparse use; check methodology) |

---

## Translatable diagrams currently generated

| Source (in `fastr_gff/`) | Generated EN/FR/PT (in `diagrams{,_fr,_pt}/`) | Replaces |
|---|---|---|
| `Technical_approaches_image.svg` | `Technical_approaches_image.svg` (×3 languages) | `Technical-Rapid-cycle-analytics--V3.svg` (Fig 3 + slide `m0_1`) — wired; old SVG deleted |
| `FASTR_rapid_cycle_analytics_approach.svg` | `FASTR_rapid_cycle_analytics_approach.svg` (×3 languages) | `GFF-Rapid-Cycle-Analytics-Data-Use_Figure-1.svg` (methodology Fig 2) — wired; old SVG deleted |

## GFF source library — `fastr_gff/`

Scraped 2026-05 from <https://data.gffportal.org/key-themes/FASTR>. Kept verbatim
for provenance and as the generator's input. Do not edit these files in place;
edit the generator's recipe instead.

| File | Type | Notes |
|---|---|---|
| `Technical_approaches_image.svg` | concept diagram | **New design** — source for the generator |
| `FASTR_rapid_cycle_analytics_approach.svg` | concept diagram | **New design** of the analyze→learn→strengthen→act cycle (the methodology's current Fig 2 is the old version) |
| `RMNCAH-N_services_use_monitoring.svg` | icon | Pillar icon, language-neutral |
| `Rapid_cycle_health_facility_phone_survey.svg` | icon | Pillar icon |
| `Rapid_cycle_household_and_clientSurveys.svg` | icon | Pillar icon (filename keeps GFF's mixed-case for provenance) |
| `Digging_Deeper_with_Follow-on_Analyses.svg` | icon | Pillar icon |
| `Data_use_for_decision_making.svg` | icon | Banner/footer icon |
| `banner_design_pattern.svg` | decorative | Page banner pattern |
| `banner_image.jpg` | photo | Hero banner image |
| `FASTR_The-GFF-Approach.jpg` | photo | The-GFF-Approach hero |
| `FASTR_responsive_image.jpg` | photo | Responsive header image |
| `Tracking_Changes_in_Data_Quality.svg` | data output example | **Old** — GFF site is re-using the existing illustration |
| `keeping_an_eye_on_services.svg` | data output example | **Old** — same |
| `Monitoring_shock_facing_health_facilities.svg` | HFA data output | Unsure if new; treat as old until confirmed |
| `Rapid_cycle_health_facility_phone_survey_components.svg` | HFA data output | Unsure if new; treat as old until confirmed |

---

## Naming conventions

- **Use:** `lowercase_snake_case.svg`. Add a module prefix (`m6_…`, `m9c_…`,
  `mw_…`) when a diagram is module-specific.
- **Avoid:** spaces in filenames, mixed PascalCase or camelCase, double-hyphens.
- **Exception:** files inside `fastr_gff/` keep GFF's original filenames so the
  provenance is clear.
- **Mirror filenames across languages.** EN content references
  `resources/diagrams/X.svg`; FR/PT references swap the parent path
  (`resources/diagrams_fr/X.svg`), so the filename must match.

## Known issues / pending

- `core_content_fr/` slides occasionally reference `.png` versions of diagrams
  that exist as `.svg` in EN. Consolidate on `.svg` when time allows.
