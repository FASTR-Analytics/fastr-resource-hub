---
marp: true
theme: fastr
paginate: true
---

<!-- _class: compact -->
## Internal consistency

Internal consistency checks whether related indicators maintain expected logical relationships. FASTR assesses the following pairs of indicators to measure internal consistency:

| Indicator pair | Expected relationship |
|----------------|----------------------|
| ANC1/ANC4 | Ratio should be greater than 1 |
| Penta1/Penta3 | Ratio should be greater than 1 |
| BCG/Facility delivery | Ratio should be within 30% (i.e. >=0.7 and <=1.3) |

We expect the number of pregnant women receiving a first ANC visit will always be higher than the number of pregnant women receiving a fourth ANC visit.

BCG is a birth dose vaccine so we expect that BCG and facility delivery will be equal. However, we recognize there may be more variability in this predicted relationship thus we set a range of within 30%.

FASTR assesses consistency at the **district level** rather than facility level. This is because patients frequently seek care from different facilities within the same district - a woman may have her ANC1 visit at a health post but travel to the district hospital for ANC4. Assessing at district level accounts for this patient movement.

---

<!-- _class: output -->
## Internal consistency output

<div class="output-layout">
<div class="output-viz">

![Consistency output](../../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

</div>
<div class="output-text">

**What you see:** Heatmap showing the % of districts where indicator pairs meet expected relationships (e.g., ANC1 ≥ ANC4).

**Formula:** Consistency % = (districts meeting criteria / total districts) × 100

**Interpretation:** Low consistency may indicate data flow problems, double-counting, or systematic under-reporting at the district level.

</div>
</div>
