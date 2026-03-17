---
marp: true
theme: fastr
paginate: true
---

## Completeness adjustment output

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Completeness adjustment](../../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing how much service volume changed after imputing missing data with rolling averages.

**Formula:** % change = (adjusted - original) / original × 100

**Interpretation:** Values are typically positive (imputation adds volume). Large adjustments indicate areas needing completeness improvement.

</div>
</div>
