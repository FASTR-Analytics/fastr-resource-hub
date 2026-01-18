---
marp: true
theme: fastr
paginate: true
---

## Data quality adjustment - Module 2

Correcting outliers and imputing missing values to improve data reliability

---

## Rationale for data quality adjustment

Routine HMIS data contain two common limitations that can distort analytical results:

| Issue | Impact on analysis |
|-------|-------------------|
| **Outliers** | Extreme values create artificial spikes in service volumes |
| **Incomplete reporting** | Missing data creates artificial declines that do not reflect actual service delivery |

FASTR addresses these limitations by replacing problematic values with estimates derived from each facility's historical reporting patterns.

---

## Adjustment scenarios

To support transparency and sensitivity analysis, FASTR produces four parallel datasets:

| Scenario | Description |
|----------|-------------|
| **Unadjusted** | Original reported values |
| **Outliers adjusted** | Extreme values replaced |
| **Completeness adjusted** | Missing values imputed |
| **Both adjusted** | All corrections applied |

---

## Indicators excluded from adjustment

Certain indicators are excluded from the adjustment process:

- **Mortality indicators** (maternal deaths, neonatal deaths, under-5 deaths): These represent discrete events where smoothing or imputation is not appropriate
- **Low-volume indicators**: Indicators that never exceed 100 reported events in any month are excluded from outlier adjustment
