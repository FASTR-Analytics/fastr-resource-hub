---
marp: true
theme: fastr
paginate: true
---

## How completeness adjustment works

A facility that misses a month of reporting looks, in the raw data, like a sudden drop to zero — a fall in services that didn't actually happen. FASTR fills these gaps with estimates drawn from a six-month rolling-average framework anchored to the facility's own reporting history.

| Priority | Method | When applied |
|---|---|---|
| 1 | Centered 6-month average | Sufficient data exists before and after the gap |
| 2 | Forward 6-month average | Gap sits at the start of the time series |
| 3 | Backward 6-month average | Gap sits at the end of the time series |
| 4 | Facility historical mean | Fallback when no rolling window is possible |

The result: temporary reporting gaps no longer translate into artefactual declines in measured service volume.
