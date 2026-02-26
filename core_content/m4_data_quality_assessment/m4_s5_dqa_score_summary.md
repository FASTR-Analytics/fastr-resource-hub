---
marp: true
theme: fastr
paginate: true
---

## Data quality summary score

Results from the outlier, completeness, and consistency checks are combined into an overall DQA score for a set of core indicators (Penta1, ANC1, OPD).

**Two complementary measures:**

- **Overall DQA score** — percentage of facility-months passing **all** quality checks. Binary: a facility-month scores 100% only if all core indicators are complete, free of outliers, and consistent
- **Mean DQA score** — average of the completeness-outlier score and the consistency score. Captures partial progress even when not all checks pass

**A facility-month has adequate data quality when:**

- All core indicator data are reported (complete)
- No values are flagged as outliers
- Consistency benchmarks are met for available indicator pairs (e.g., Penta1/Penta3, ANC1/ANC4)

<!--
PRESENTER NOTES:
- The overall DQA score is strict: all-or-nothing. A single failed check = 0%
- The mean DQA score is more nuanced: shows how close facilities are to meeting all criteria
- Example: if completeness-outlier score is 1.0 but consistency is 0.5, mean DQA = 0.75 (75%)
- Use overall score to identify problem areas; use mean score to track improvement over time
- This completes the DQA module - next we'll look at how to adjust for these issues
-->

---

<!-- _class: output -->
## Overall data quality score output

<div class="output-layout">
<div class="output-viz">

![DQA score output](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

</div>
<div class="output-text">

**What you see:** Heatmap showing the percentage of facility-months that pass **all** quality checks, by indicator and region.

**Score:** Binary — each facility-month is either adequate (passes all checks) or not. The percentage reflects the share that pass.

**Interpretation:** A strict measure. Low scores indicate many facility-months fail at least one check. Use this to identify regions and indicators needing data quality improvement.

</div>
</div>

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
