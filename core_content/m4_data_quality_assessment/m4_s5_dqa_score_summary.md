---
marp: true
theme: fastr
paginate: true
---

## Data quality summary score

A composite measure of data quality provides an overall view of how well a dataset meets quality standards.

By integrating multiple dimensions of data quality into a single score, it simplifies the interpretation of detailed information from several measures. This allows health systems to quickly assess the reliability of data, making it easier to identify trends and issues at a glance.

**Definition of adequate data quality:**

- No missing indicator data for OPD, Penta1, and ANC1, where available
- No outliers for OPD, Penta1, and ANC1, where available
- Consistent reporting between Penta1/Penta3 and ANC1/ANC4

<!--
PRESENTER NOTES:
- DQA score combines all dimensions into one summary score
- 100% = complete + no outliers + consistent - the goal for quality data
- Use the heatmap to identify priority areas for data quality improvement
- This completes the DQA module - next we'll look at how to adjust for these issues
-->

---

## Overall data quality score output

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![DQA score output](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing overall DQA score by indicator and region, color-coded from red (poor) to green (good).

**Formula:** DQA % = (values that are complete, not outliers, and consistent) / (total values) × 100

**Interpretation:** 100% = passes all checks. Use this to prioritize data quality improvement efforts by region and indicator.

</div>
</div>

---

## Mean DQA score output

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Mean DQA score](../../resources/default_outputs/Default_6._Mean_DQA_score.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing mean DQA score across facilities by indicator and region.

**Formula:** Mean DQA = (values that are complete, not outliers, and consistent) / (total values) × 100

**Interpretation:** Shows how close facilities are to meeting all quality criteria. A score of 100% means the data passes all DQA checks.

</div>
</div>

<!--
PRESENTER NOTES:
- DQA score combines all dimensions into one summary score
- 100% = complete + no outliers + consistent - the goal for quality data
- Use the heatmap to identify priority areas for data quality improvement
- This completes the DQA module - next we'll look at how to adjust for these issues
-->
