---
marp: true
theme: fastr
paginate: true
---

## Impact of data quality adjustments

The analysis can use different versions of the data:

| Scenario | What it uses |
|----------|--------------|
| **No adjustment** | Raw reported values |
| **Outlier adjustment** | Extreme values corrected |
| **Completeness adjustment** | Adjusted for missing reports |
| **Both adjustments** | Outliers corrected + completeness adjusted |

---

## Output: Volume change by adjustment scenario

![Volume change due to adjustments](../../resources/default_outputs/Module3_4_Volume_change_adjustments.png)

---

## Why compare scenarios?

Comparing results across adjustment scenarios helps assess:

- **How much do adjustments change the picture?** If results are similar, findings are robust.
- **Which adjustment has the biggest impact?** Completeness vs outlier corrections.
- **Are conclusions sensitive to data quality assumptions?** Important for interpretation confidence.
