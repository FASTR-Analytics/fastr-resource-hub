---
marp: true
theme: fastr
paginate: true
---

## Adjustment module: Configuration parameters

The Data Quality Adjustment module uses these key parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| **Rolling window** | 6 months | Window size for calculating replacement values |
| **Low volume threshold** | 100 | Indicators never exceeding this count are excluded from outlier adjustment |

---

## Adjustment hierarchy

When replacing outliers or filling missing values, the module applies methods in priority order:

| Priority | Method | When used |
|----------|--------|-----------|
| 1 | Centered 6-month average | Default: 3 months before + 3 months after |
| 2 | Forward 6-month average | When insufficient preceding data |
| 3 | Backward 6-month average | When insufficient following data |
| 4 | Same month, previous year | For seasonal indicators when rolling averages unavailable |
| 5 | Facility historical mean | Fallback when no other method available |

**Excluded indicators:** Mortality-related indicators (maternal deaths, neonatal deaths, under-5 deaths) are never adjusted.
