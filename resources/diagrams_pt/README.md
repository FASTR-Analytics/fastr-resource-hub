# Portuguese (European) diagrams

This folder holds Portuguese-language versions of FASTR diagrams used in
slides and methodology. SVG files in here are referenced by
`resources/diagrams_pt/<name>.svg` from `methodology/pt/*.md` and
`core_content_pt/<module>/*.md`.

## Current state (as of 2026-05-31)

Only 2 of ~40 EN diagrams have a PT version:
- `FASTR_rapid_cycle_analytics_approach.svg`
- `Technical_approaches_image.svg`

The rest of the PT methodology and slides currently reference the **EN
diagrams** (`resources/diagrams/<name>.svg`) because translate_docs.py
preserves the original image paths. This is the intentional fallback —
EN diagrams render fine in a PT deck, but their labels are still in
English.

## Diagrams that need PT versions

These are referenced from EN methodology or slides but have no PT copy.
Prioritize by frequency of use.

| Diagram | EN copy | FR copy | Used in |
|---|---|---|---|
| ai_accelerator.svg | ✓ | ✓ | mai (AI Assistant) |
| ai_on_rails.svg | ✓ | ✓ | mai |
| analytical_pipeline.svg | ✓ | ✓ | m4 |
| chart_type_guide.svg | ✓ | ✓ | m7 |
| completeness_illustration.svg | ✓ | ✓ | m4 |
| consistency_illustration.svg | ✓ | ✓ | m4 |
| coverage_equation.svg | ✓ | ✓ | m6 |
| coverage_example_anc4.svg | ✓ | ✓ | m6 |
| coverage_projection.svg | ✓ | ✓ | m6 |
| data_triangulation_layers.svg | ✓ | ✓ | m8 |
| denominator_cascade.svg | ✓ | ✓ | m6 |
| denominator_cascade_example.svg | ✓ | ✓ | m6 |
| denominator_comparison.svg | ✓ | ✓ | m6 |
| disruption_chart_annotated.svg | ✓ | ✓ | m6 |
| disruptions_framing.svg | ✓ | ✓ | m6 |
| disruptions_questions.svg | ✓ | ✓ | m6 |
| district_consistency.svg | ✓ | ✓ | m4 |
| from_analysis_to_action.svg | ✓ | ✓ | m0 |
| hfa_indicator_types.svg | ✓ | ✓ | m8 |
| HMIS_data_flow.svg | ✓ | ✓ | m0 |
| indicator_directionality.svg | ✓ | ✓ | m6 |
| learning_exchange_objectives.svg | ✓ | ✓ | workshop |
| m9c_disaggregate.svg | ✓ | ✓ | m9c |
| m9c_filter.svg | ✓ | ✓ | m9c |
| measures_data_quality.svg | ✓ | ✓ | m4 |
| meeting_norms.svg | ✓ | ✓ | workshop |
| methodology_outlier.svg | ✓ | ✓ | m4 |
| mw_1_approaches.svg | ✓ | ✓ | webinar |
| mw_17_pipeline.svg | ✓ | ✓ | webinar |
| mw_19_next_steps.svg | ✓ | ✓ | webinar |
| mw_5_platform.svg | ✓ | ✓ | webinar |
| mw_8_objectives.svg | ✓ | ✓ | webinar |
| outlier_impact.svg | ✓ | ✓ | m4 |
| platform_capabilities.svg | ✓ | ✓ | m3 |
| platform_roadmap_2026.svg | ✓ | ✓ | m3 |
| projects_within_instance.svg | ✓ | ✓ | m3 |
| service_cascade_funnel.svg | ✓ | ✓ | m6 |
| steps_to_implement_rmncahn_service_chart.svg | ✓ | ✓ | m0 |
| storytelling_with_data.svg | ✓ | ✓ | m7 |
| three_spheres_of_influence.svg | ✓ | ✓ | m7 |

## How to add a PT diagram

1. Copy the FR version from `resources/diagrams_fr/<name>.svg` as a
   starting point (text positioning is closer to PT length than EN).
2. Open in a text editor — most SVGs are hand-edited; replace `<text>`
   contents with the PT translation. Refer to
   `translations/glossary.yml` (the `pt:` section) for canonical
   terminology (FASTR, GFF, RMNCAH-N → SRMNIA-N, HMIS → SIGS, ANC1 →
   CPN1, etc.).
3. Once the SVG is in place here, update the markdown path in the
   relevant `methodology/pt/*.md` or `core_content_pt/<module>/*.md`
   from `resources/diagrams/` to `resources/diagrams_pt/`.
4. Re-extract slides if you changed methodology/pt:
   `python3 tools/00_extract_slides.py --lang pt`.
