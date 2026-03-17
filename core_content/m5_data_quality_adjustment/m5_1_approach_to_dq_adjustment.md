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

---

## Indicators excluded from adjustment

Certain indicators are excluded from the adjustment process:

- **Mortality indicators** (maternal deaths, neonatal deaths, under-5 deaths): These represent discrete events where smoothing or imputation is not appropriate
- **Low-volume indicators**: Indicators that never exceed 100 reported events in any month are excluded from adjustment

<!--
PRESENTER NOTES:
- This module addresses the issues identified in DQA
- Key concept: we replace problematic values with estimates based on facility's own history
- Four parallel datasets allow sensitivity analysis - how much do results change?
- Mortality excluded because smoothing discrete rare events is inappropriate
- Low-volume excluded because adjustment adds noise to already sparse data
-->
