---
marp: true
theme: fastr
paginate: true
---

## Combined adjustment: FASTR output

When both adjustments are applied, outliers are corrected first, then missing values are imputed using the cleaned data.

![Percent change in volume due to both outlier and completeness adjustment.](../../resources/default_outputs/Default_3._Percent_change_in_volume_due_to_both_outlier_and_completeness_adjustment.png)

**Interpretation:**

| Value | Meaning |
|-------|---------|
| **Negative** | Outlier effect dominates (extreme values reduced volume) |
| **Positive** | Completeness effect dominates (imputed values increased volume) |
| **Near zero** | Minimal adjustment required; data quality was high |
