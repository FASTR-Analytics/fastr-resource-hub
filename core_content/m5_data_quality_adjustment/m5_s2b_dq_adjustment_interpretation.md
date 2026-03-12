---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## Completeness adjustment output

<div class="output-layout">
<div class="output-viz">

![Completeness adjustment](../../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

</div>
<div class="output-text">

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
