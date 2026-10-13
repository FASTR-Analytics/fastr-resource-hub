---
marp: true
theme: fastr
paginate: true
---

## From detection to correction

The Data quality assessment module flagged the data-quality problems — extreme values, missing reports, internal inconsistencies. The Data quality adjustments module picks up from there.

Rather than discarding the flagged values, FASTR replaces them with reasonable estimates from each facility's own historical patterns — like replacing an illegible meter reading with the average of the neighboring months — so the service-utilization and coverage analyses downstream work from cleaner data.

To support transparency, FASTR produces **four parallel datasets**:

- **Unadjusted** — original reported values
- **Outliers adjusted** — extreme values replaced
- **Completeness adjusted** — missing values imputed
- **Both adjusted** — all corrections applied

The next slides walk through each adjustment and its output.
