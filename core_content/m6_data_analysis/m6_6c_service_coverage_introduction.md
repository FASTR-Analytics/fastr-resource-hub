---
marp: true
theme: fastr
paginate: true
---

## Two-part analytical process

The coverage estimation module operates in two sequential parts:

| Part | Components |
|------|------------|
| **Part 1: Denominator calculation** | Build four candidate denominator chains by combining HMIS volumes with survey coverage at each entry point, then extending via demographic parameters. Compare chains against UN WPP and select the chain whose median ratio to UN WPP is closest to 1.0. |
| **Part 2: Coverage estimation** | Apply the selected chain to all indicators. Project survey values forward into post-survey years using HMIS year-on-year deltas. Generate final coverage estimates at national and subnational levels. |

<!--
PRESENTER NOTES:
- Modules 5 and 6 convert service volumes into coverage percentages (M5 = denominators, M6 = estimates)
- Coverage = services / target population - the challenge is knowing target population
- HMIS typically uses catchment populations which are often inaccurate
- Our approach: derive denominators from HMIS data validated against surveys
- Two-part process: Part 1 calculates and validates denominators, Part 2 generates estimates
- This enables tracking trends and subnational disparities in coverage
-->
