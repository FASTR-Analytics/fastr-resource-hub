---
marp: true
theme: fastr
paginate: true
---

## Disruption detection

Our approach to service disruptions and surpluses utilizes an interrupted time series regression with facility-level fixed effects. Previous large and unexpected changes in historical data are removed. Unexpected volume changes are estimated by comparing observed volume to expected volume based on historical trends and seasonality.

---

## Disruptions and surpluses

<div style="display: flex; gap: 1.5em; align-items: flex-start;">
<div style="flex: 1;">

**Disruptions** are flagged when volumes fall below anticipated levels, signaling potential barriers to access, resource shortages, or system failures.

**Surpluses** occur when volumes exceed expectations, which may indicate increased demand, over-reporting, or changes in service delivery.

</div>
<div style="flex: 2;">

![Disruption and surplus example h:300](../../resources/diagrams/disruption_chart.png)

</div>
</div>

---

## How it works

**Using past data to set expectations:** We look at the past few years of data to understand the typical pattern for each month, accounting for regular seasonal changes.

**Spotting unusual changes:** We compare current service volumes to expectations. If we see volumes much higher or lower than expected, we flag it as an unusual change.

**Handling past disruptions:** We adjust historical data by removing previous big, unexpected changes so one-off events don't skew our understanding of what's "normal."

**Detecting disruptions over time:** We look at trends to see if there are clear shifts in health service use over several months.

---

## Comparison to DHIS2

Extension of service utilization analysis, using more complex statistical approaches not available in DHIS2.

Using a regression framework, we are able to:

- Account for seasonality
- Exclude unusual changes to ensure one-off events aren't influencing normal trends
- Use historical data as a baseline for context
- Detect disruptions and recovery patterns
- Quantify changes with a robust methodology as compared to just observing simple fluctuations in a trend line

This improves the ability to interpret and compare utilization data across national and sub-national areas without needing population denominators.

<!--
PRESENTER NOTES:
- Disruption detection goes beyond simple YoY comparison
- Uses interrupted time series regression with fixed effects
- Key concept: compare actual to "expected" based on historical patterns
- Disruption = significantly below expected; Surplus = significantly above expected
- Advantages over DHIS2: accounts for seasonality, excludes unusual historical events
- Can quantify magnitude of disruptions in absolute numbers and percentages
- Useful for assessing impact of events like COVID, strikes, stockouts, campaigns
-->
