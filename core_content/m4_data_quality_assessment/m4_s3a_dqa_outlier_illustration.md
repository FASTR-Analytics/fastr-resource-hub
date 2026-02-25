---
marp: true
theme: fastr
paginate: true
---

## Why adjust for outliers?

![Why adjust for outliers](../../resources/diagrams/outlier_impact.svg)

<!--
PRESENTER NOTES:
- Visual example showing the impact of an outlier on data interpretation
- Left panel: raw data with a spike caused by a data entry error — distorts the trend line
- Right panel: same data after outlier adjustment using rolling averages — underlying trend is preserved
- Key point: a single extreme value can pull national or regional totals significantly, distorting service utilization and coverage estimates
- Outlier adjustment replaces the extreme value with a more plausible estimate based on the facility's own historical data
- This makes downstream analysis (trends, disruptions, coverage) more reliable
-->
