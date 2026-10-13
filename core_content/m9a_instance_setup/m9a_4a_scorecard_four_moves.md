---
marp: true
theme: fastr
paginate: true
---

## A scorecard in four moves

<div style="font-size: 0.9em;">

| Move | Where | What |
|---|---|---|
| **1. Define** | Data → HMIS → Indicators | **Add indicator** → type **Calculated** → formula, e.g. `anc4 / anc1` |
| **2. Set the rule** | Same form, **Analysis and display** | **Format**, **Direction**, **Target**, **Conditional formatting rule** (thresholds, e.g. 70 and 80) |
| **3. Generate** | Results → Generate new results package | Tick **Indicator values**; pin or attach the package to the project |
| **4. Build the table** | Project → **Create visualization** | Module **Indicator values** → metric **Indicator value** → preset **Scorecard table** → **Conditional formatting: Indicator** |

</div>

Each cell is colored by its own indicator's rule, and the legend shows the bands. Save, then add the table to a dashboard, a report or a slide deck.

<!--
PRESENTER NOTES:
- Move 2 is the one people skip: without a rule the table has numbers but no colors.
- Edits to formulas, thresholds or population figures take effect in the NEXT package, not the current one. Regenerate after every change.
- Population terms (population_pregnancies, population_infants…) come from the instance Population page; if the page has no figure for an area and year, that cell is dropped, not zero.
-->
