---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## Outlier adjustment output

<div class="output-layout">
<div class="output-viz">

![Outlier adjustment](../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

</div>
<div class="output-text">

**What you see:** Heatmap showing how much service volume changed after replacing outliers with rolling averages.

**Formula:** % change = (adjusted − original) / original × 100

**Interpretation:** Values are typically negative — removing outliers reduces volume. Large adjustments warrant investigation into their source.

</div>
</div>
