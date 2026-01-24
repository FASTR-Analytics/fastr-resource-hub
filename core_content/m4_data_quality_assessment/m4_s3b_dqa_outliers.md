---
marp: true
theme: fastr
paginate: true
---

## Outlier detection

Outliers are values that are suspiciously **high** compared to a facility's usual reporting volume. They may result from data entry errors or genuine programmatic changes (e.g., campaigns).

**Note:** FASTR only flags high values as outliers - unusually low values are not flagged, as these more likely reflect service disruptions than data errors.

**How outliers are identified:** For each facility and indicator, we assess within-facility variation in monthly reporting. A value is flagged if it deviates significantly from the facility's typical pattern (using statistical thresholds based on median absolute deviation).

---

## Outlier detection output

<div style="display: flex; gap: 1em;">
<div style="flex: 1.2;">

![Outliers output h:320](../../resources/default_outputs/Default_1._Proportion_of_outliers.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing proportion of values flagged as outliers by indicator and region.

**Formula:** Outlier % = (values flagged / total values) × 100

**Interpretation:** High rates may indicate data entry errors or legitimate events like campaigns. Review facility registers to distinguish between the two.

</div>
</div>
