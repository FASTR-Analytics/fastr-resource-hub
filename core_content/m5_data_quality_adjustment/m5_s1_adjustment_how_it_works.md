---
marp: true
theme: fastr
paginate: true
---

## How the adjustment works

Outliers and missing values are replaced using **6-month rolling averages** from each facility's own historical data. The same hierarchical approach applies to both adjustments:

| Priority | Method | When applied |
|---|---|---|
| 1 | Centered 6-month average | Sufficient data before and after the value |
| 2 | Forward 6-month average | Value sits at the start of the series |
| 3 | Backward 6-month average | Value sits at the end of the series |
| 4 | Facility historical mean | Fallback when rolling averages aren't possible |

The replacement is based on the facility's own pattern, so each adjustment stays anchored to what that facility usually reports.
