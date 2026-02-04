---
marp: true
theme: fastr
paginate: true
---

## Data quality adjustment

<div style="display: flex; gap: 1.5em;">
<div style="flex: 1; font-size: 0.85em;">

**Why adjust?** Outliers and reporting gaps distort analysis if left uncorrected.

**How?** Replace problematic values with 6-month rolling averages from each facility's historical data.

**Four scenarios for sensitivity analysis:**

| Scenario | What it shows |
|----------|--------------|
| Unadjusted | Raw data as reported |
| Outliers-only | High values smoothed |
| Completeness-only | Gaps filled |
| Both adjusted | Full correction applied |

**Excluded:** Mortality indicators and low-volume indicators (<100/month)

</div>
<div style="flex: 1;">

![Outlier adjustment h:180](../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

![Completeness adjustment h:180](../../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

</div>
</div>

<!--
PRESENTER NOTES:
- Comparing scenarios shows how much results depend on adjustment choices
- Outlier adjustment typically reduces volume (removes inflated values)
- Completeness adjustment typically increases volume (fills gaps)
- Large adjustments indicate areas needing data quality attention
-->
