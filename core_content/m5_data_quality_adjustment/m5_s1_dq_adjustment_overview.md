---
marp: true
theme: fastr
paginate: true
---

## Data quality adjustment

**Why adjust?** Outliers and reporting gaps identified in the DQA will distort service utilization and coverage estimates if left uncorrected. The goal is to replace problematic values with reasonable estimates based on each facility's own historical patterns.

**How?** Outliers and missing values are replaced using 6-month rolling averages from the facility's historical data.

**Four parallel datasets:** FASTR produces unadjusted, outliers-only adjusted, completeness-only adjusted, and both-adjusted versions. This enables sensitivity analysis - comparing results across scenarios to assess how much conclusions depend on adjustment choices.

**Excluded from adjustment:** Mortality indicators (discrete events that shouldn't be smoothed) and low-volume indicators (<100 events/month, where adjustment adds noise).

<!--
PRESENTER NOTES:
- Condensed overview of adjustment rationale and methods
- Key message: adjustment enables analysis despite DQ limitations
- Four scenarios support sensitivity analysis - important for transparency
- Not everything should be adjusted - mortality and low-volume excluded
-->
