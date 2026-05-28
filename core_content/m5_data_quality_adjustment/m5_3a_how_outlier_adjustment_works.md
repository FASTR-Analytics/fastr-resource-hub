---
marp: true
theme: fastr
paginate: true
---

## How outlier adjustment works

For each flagged value, FASTR computes a **rolling average** from the surrounding months — a six-month window that captures the facility's typical reporting level without being distorted by the outlier itself. The outlier is then replaced by that average.

When a centered six-month window isn't possible (e.g., the outlier sits near the start or end of the time series), FASTR falls back through a hierarchy of alternatives:

| Priority | Method | When applied |
|---|---|---|
| 1 | Centered 6-month average | 3 months before + 3 months after the outlier |
| 2 | Forward 6-month average | Insufficient preceding data (outlier near start of series) |
| 3 | Backward 6-month average | Insufficient following data (outlier near end of series) |
| 4 | Same month, previous year | When rolling averages aren't possible; useful for strongly seasonal indicators |
| 5 | Facility historical mean | Final fallback when no recent comparable data exists |

The replacement is always anchored in the facility's own reporting history — never imported from another facility or a national average.
