---
marp: true
theme: fastr
paginate: true
---

## Rationale for data quality adjustment

Routine HMIS data contain two common limitations that can distort analytical results:
- **Outliers:** Extreme values create artificial spikes in service volumes
- **Incomplete reporting:** Missing data creates artificial declines that do not reflect actual service delivery

FASTR addresses these limitations by replacing problematic values with estimates derived from each facility's historical reporting patterns.

**Adjustment scenarios:** To support transparency and sensitivity analysis, FASTR produces four parallel datasets:
- **Unadjusted:** Original reported values
- **Outliers adjusted:** Extreme values replaced
- **Completeness adjusted:** Missing values imputed
- **Both adjusted:** All corrections applied
