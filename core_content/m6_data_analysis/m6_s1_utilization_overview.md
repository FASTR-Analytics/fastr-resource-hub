---
marp: true
theme: fastr
paginate: true
---

## Service utilization analysis

Service utilization analysis tracks how many health services are being delivered over time, identifying trends, anomalies, and comparisons across areas.

<!-- _class: output -->

<div class="output-layout">
<div class="output-viz">

![Number of services reported h:300](../../resources/default_outputs/Module3_5_Number_of_services_reported.png)

</div>
<div class="output-text">

**What you see:** Line chart showing absolute service volumes over time by indicator.

**What it shows:** Count of services delivered each month/quarter.

**Interpretation:** Look for overall trends (increasing/decreasing) and sudden drops or spikes that may need investigation.

</div>
</div>

---

<!-- _class: output -->
## Year-over-year change output

<div class="output-layout">
<div class="output-viz">

![Change in service volume h:300](../../resources/default_outputs/Module3_1_Change_in_service_volume.png)

</div>
<div class="output-text">

**What you see:** Heatmap comparing current period to same period last year, with changes >±10% flagged.

**Formula:** YoY change % = (this year - last year) / last year × 100

**Interpretation:** Flagged changes require follow-up - is this a real program change, data issue, or expected event?

</div>
</div>

<!--
PRESENTER NOTES:
- Condensed version combining service trends and YoY comparison
- First chart shows absolute volumes - identify overall patterns
- Second chart shows relative changes - easier to compare across indicators
- YoY changes >±10% are flagged - but threshold is configurable
- For flagged changes, ask: data quality issue, real program change, or external event?
- These outputs don't require population denominators - useful when denominators uncertain
-->

---

## Try it yourself

Look at your priority indicator's year-over-year change. Ask yourself:

- Is the change **positive** (increase) or **negative** (decrease)?
- For this indicator, is that change **good** or **bad** for health outcomes?
- What might explain this change — a real program shift, a data issue, or an external event?

*Tip: Remember, not all increases are good. A rise in maternal deaths is a negative outcome even though the number went up.*
