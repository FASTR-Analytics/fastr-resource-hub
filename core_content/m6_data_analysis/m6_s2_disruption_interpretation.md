---
marp: true
theme: fastr
paginate: true
---

## Detecting service disruptions

Beyond year-over-year comparisons, we want to know: **Is service delivery on track, or has something disrupted it?**

**The challenge:** Raw service counts are hard to interpret. A drop in services could be a real disruption, or just normal seasonal variation. Different areas have different baseline volumes, making direct comparison difficult.

**FASTR's solution:** Use statistical modeling to estimate what service volume we would *expect* based on historical trends and seasonality, then compare actual volume to this expectation.

- **Disruption:** Observed volume significantly below expected
- **Surplus:** Observed volume significantly above expected

---

## Service disruption output

<div style="display: flex; gap: 1em;">
<div style="flex: 1.2;">

![Disruption output h:300](../../resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Chart comparing actual service volume to model-predicted expected volume, accounting for seasonality.

**What it shows:** Deviations from expected - disruptions (below) or surpluses (above).

**Interpretation:** Consider external factors: COVID, strikes, stockouts, campaigns. Persistent deviations warrant program investigation.

</div>
</div>

<!--
PRESENTER NOTES:
- Condensed version focusing on disruption detection methodology
- Key insight: raw counts hard to interpret without context
- Statistical model provides "expected" baseline accounting for seasonality
- Disruption = sustained deviation below expected, not just a single bad month
- When interpreting disruptions, consider external factors: COVID, strikes, etc.
- Persistent deviations warrant deeper investigation into causes
- Can run at national, provincial, or district level depending on data quality
-->
