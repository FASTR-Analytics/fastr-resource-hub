---
marp: true
theme: fastr
paginate: true
---

## Three dimensions of data quality + overall score

<div style="font-size: 0.85em;">

| Dimension | What it measures | Red flag |
|-----------|------------------|----------|
| **Completeness** | % of facilities reporting each indicator | Gaps by region or time period |
| **Outliers** | Suspiciously high values vs. facility history | Data entry errors |
| **Consistency** | Logical relationships (e.g., ANC1 ≥ ANC4) | System or process issues |
| **Overall DQA score** | Combines all 3 dimensions into single metric | Quick view of data quality |

</div>

<div style="display: flex; gap: 0.4em; margin-top: 0.3em;">
<div style="flex: 1;">

![Completeness h:150](../../resources/default_outputs/Default_2._Proportion_of_completed_records.png)

</div>
<div style="flex: 1;">

![Outliers h:150](../../resources/default_outputs/Default_1._Proportion_of_outliers.png)

</div>
<div style="flex: 1;">

![Consistency h:150](../../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

</div>
<div style="flex: 1;">

![DQA Score h:150](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

</div>
</div>

<!--
PRESENTER NOTES:
- Completeness: Are facilities that should report actually reporting?
- Outliers: Only flags HIGH values (low values may be real service disruptions)
- Consistency: Assessed at district level to account for patient movement between facilities
- Overall DQA score: 100% means data passes all checks - complete, no outliers, consistent
-->
