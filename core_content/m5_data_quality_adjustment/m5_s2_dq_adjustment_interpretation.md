---
marp: true
theme: fastr
paginate: true
---

## Outlier adjustment output

<div style="display: flex; gap: 1em;">
<div style="flex: 1.2;">

![Outlier adjustment h:320](../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing how much service volume changed after replacing outliers with rolling averages.

**Formula:** % change = (adjusted - original) / original × 100

**Interpretation:** Values are typically negative (outliers removed reduce volume). Large adjustments warrant investigation into their source.

</div>
</div>

---

## Completeness adjustment output

<div style="display: flex; gap: 1em;">
<div style="flex: 1.2;">

![Completeness adjustment h:320](../../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing how much service volume changed after imputing missing data with rolling averages.

**Formula:** % change = (adjusted - original) / original × 100

**Interpretation:** Values are typically positive (imputation adds volume). Large adjustments indicate areas needing completeness improvement.

</div>
</div>

<!--
PRESENTER NOTES:
- Two outputs shown: outlier adjustment and completeness adjustment
- Outlier heatmap: negative values mean outliers were removed (reduced inflated counts)
- Completeness heatmap: positive values mean gaps were filled (increased total volume)
- Large adjustments (dark colors) indicate areas/indicators with data quality issues
- Use these to identify where to focus data quality improvement efforts
- Compare regions: which have more outlier issues vs completeness issues?
-->
