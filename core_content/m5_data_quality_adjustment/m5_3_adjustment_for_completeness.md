---
marp: true
theme: fastr
paginate: true
---

## Completeness adjustment methodology

For months identified as incomplete or missing, values are imputed using the same 6-month rolling average approach applied to outlier adjustment.

| Priority | Method | Application |
|----------|--------|-------------|
| 1 | Centered 6-month average | When sufficient data exists before and after the gap |
| 2 | Forward 6-month average | For gaps at the start of the time series |
| 3 | Backward 6-month average | For gaps at the end of the time series |
| 4 | Facility historical mean | Fallback when rolling averages unavailable |

This approach prevents temporary reporting gaps from creating artificial declines in service volumes.

---

## Completeness adjustment: FASTR output

![Percent change in volume due to completeness adjustment. h:400](../../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

**Interpretation:** Positive values indicate that missing data was imputed, increasing total reported volume. Values near zero indicate reporting was already complete for that indicator/area.
