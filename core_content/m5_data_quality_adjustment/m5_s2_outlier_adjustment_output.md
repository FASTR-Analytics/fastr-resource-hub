---
marp: true
theme: fastr
paginate: true
---

## Outlier adjustment output

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Outlier adjustment](../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing how much service volume changed after replacing outliers with rolling averages.

**Formula:** % change = (adjusted - original) / original × 100

**Interpretation:** Values are typically negative (outliers removed reduce volume). Large adjustments warrant investigation into their source.

</div>
</div>
