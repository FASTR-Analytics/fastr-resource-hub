---
marp: true
theme: fastr
paginate: true
---

## Outlier adjustment methodology

Outlier values are replaced using facility-specific historical data. The adjustment follows a hierarchical approach:

| Priority | Method | Application |
|----------|--------|-------------|
| 1 | Centered 6-month average | 3 months before + 3 months after the outlier |
| 2 | Forward 6-month average | When insufficient preceding data (e.g., start of series) |
| 3 | Backward 6-month average | When insufficient following data (e.g., end of series) |
| 4 | Same month, previous year | When rolling averages unavailable; useful for seasonal indicators |
| 5 | Facility historical mean | Fallback when no other method is applicable |

---

## Outlier adjustment: FASTR output

![Percent change in volume due to outlier adjustment. h:400](../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

**Interpretation:** Negative values indicate that extreme high values were replaced with lower estimates. Values near zero indicate few outliers were detected for that indicator/area.
