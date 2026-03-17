---
marp: true
theme: fastr
paginate: true
---

## Combined adjustment output

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Combined adjustment](../../resources/default_outputs/Default_3._Percent_change_in_volume_due_to_both_outlier_and_completeness_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing net effect of both outlier removal and completeness imputation on service volumes.

**Formula:** % change = (adjusted - original) / original × 100

**Interpretation:** Outliers reduce volume (negative), completeness adds volume (positive). Net effect depends on which issue is more prevalent. Compare all four scenarios to assess sensitivity.

</div>
</div>
