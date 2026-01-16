---
marp: true
theme: fastr
paginate: true
---

## Adjustment for outliers

For each value flagged as an outlier, the module calculates what the value "should have been" based on that facility's historical pattern.

**Methods used (in order of preference):**
1. Centered 6-month rolling average (3 months before + 3 months after)
2. Forward 6-month rolling average
3. Backward 6-month rolling average
4. Same month from the previous year (for seasonal indicators)
5. Facility-specific historical mean (fallback)

---

### Outlier adjustment: FASTR output

![Percent change in volume due to outlier adjustment.](../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

Heatmap showing percent change in service volumes due to outlier replacement.
