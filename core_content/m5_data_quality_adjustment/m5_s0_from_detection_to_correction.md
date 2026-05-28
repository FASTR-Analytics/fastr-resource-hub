---
marp: true
theme: fastr
paginate: true
---

## From detection to correction

Module 1 flagged the data-quality problems — extreme values, missing reports, internal inconsistencies. Module 2 picks up from there.

FASTR replaces the flagged values with reasonable estimates from each facility's own historical patterns, so the service-utilization and coverage analyses downstream work from cleaner data.

To support transparency, FASTR produces **four parallel datasets**:

- **Unadjusted** — original reported values
- **Outliers adjusted** — extreme values replaced
- **Completeness adjusted** — missing values imputed
- **Both adjusted** — all corrections applied

The next slides walk through each adjustment and its output.
