---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## Mean DQA score output

<div class="output-layout">
<div class="output-viz">

![Mean DQA score](../../resources/default_outputs/Default_6._Mean_DQA_score.png)

</div>
<div class="output-text">

**What you see:** Heatmap showing the average DQA score across facility-months, by indicator and region.

**Score:** Average of the completeness-outlier score and the consistency score. Ranges from 0% to 100%.

**Interpretation:** A more nuanced measure than the overall score. Captures partial progress — a region can score 75% even if not all checks pass. Use this to track improvement over time.

</div>
</div>

<!--
PRESENTER NOTES:
- DQA score combines all dimensions into one summary score
- 100% = complete + no outliers + consistent - the goal for quality data
- Use the heatmap to identify priority areas for data quality improvement
- This completes the DQA module - next we'll look at how to adjust for these issues
-->
