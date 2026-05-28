---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## Outlier detection output

<div class="output-layout">
<div class="output-viz">

![Outliers output](../../resources/default_outputs/Default_1._Proportion_of_outliers.png)

</div>
<div class="output-text">

**What you see:** Heatmap showing the proportion of values flagged as outliers by indicator and region.

**Formula:** Outlier % = (values flagged / total values) × 100

**Interpretation:** High rates may indicate data entry errors or legitimate events like campaigns. Review facility registers to distinguish between the two.

</div>
</div>

<!--
PRESENTER NOTES:
- Outliers are values that are extreme relative to a facility's usual reporting volume; only suspiciously high values are flagged.
- High outlier rates can reflect data entry errors OR real programmatic events (campaigns, surges). Investigation distinguishes the two — see m4_3a "Investigating a flagged outlier".
- The formula and method follow m4_3c "Outlier detection methodology".
-->
