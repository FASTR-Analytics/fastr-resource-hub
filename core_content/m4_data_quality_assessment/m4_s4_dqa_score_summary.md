---
marp: true
theme: fastr
paginate: true
---

## Internal consistency

<div style="font-size: 0.9em;">

Internal consistency checks whether related indicators maintain expected logical relationships. FASTR assesses the following pairs of indicators to measure internal consistency:

| Indicator pair | Expected relationship |
|----------------|----------------------|
| ANC1/ANC4 | Ratio should be greater than 1 |
| Penta1/Penta3 | Ratio should be greater than 1 |
| BCG/Facility delivery | Ratio should be within 30% (i.e. >=0.7 and <=1.3) |

We expect the number of pregnant women receiving a first ANC visit will always be higher than the number of pregnant women receiving a fourth ANC visit.

BCG is a birth dose vaccine so we expect that BCG and facility delivery will be equal. However, we recognize there may be more variability in this predicted relationship thus we set a range of within 30%.

FASTR assesses consistency at the **district level** rather than facility level. This is because patients frequently seek care from different facilities within the same district - a woman may have her ANC1 visit at a health post but travel to the district hospital for ANC4. Assessing at district level accounts for this patient movement.

</div>

---

## Internal consistency output

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Consistency output](../../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing the % of districts where indicator pairs meet expected relationships (e.g., ANC1 ≥ ANC4).

**Formula:** Consistency % = (districts meeting criteria / total districts) × 100

**Interpretation:** Low consistency may indicate data flow problems, double-counting, or systematic under-reporting at the district level.

</div>
</div>

---

## DQA mean: combining all quality dimensions

The mean DQA score shows how close a facility's data is to meeting all quality criteria. A score of 100% means the data passes all DQA checks - no missing values, no outliers, and consistent reporting.

**Average DQA score across facilities** = (number of monthly values that are complete, not outliers, and consistent) ÷ (total number of monthly values)

---

## DQA mean output

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![DQA score output](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing DQA mean by indicator and region, color-coded from red (poor) to green (good).

**Formula:** (values that are complete, not outliers, and consistent) ÷ (total values)

**Interpretation:** 100% = passes all checks. Use this to prioritize data quality improvement efforts.

</div>
</div>

<!--
PRESENTER NOTES:
- Consistency is assessed at district level to account for patient movement
- DQA mean combines all dimensions into one summary score
- 100% = complete + no outliers + consistent - the goal for quality data
- Use the heatmap to identify priority areas for data quality improvement
- This completes the DQA module - next we'll look at how to adjust for these issues
-->
