---
marp: true
theme: fastr
paginate: true
---

## Identifying implausible values

<div style="display: flex; gap: 1.5em; align-items: center;">
<div style="flex: 1;">

**Illustration:**
Region A displays an anomalous increase in February that substantially exceeds values reported by other regions.

This pattern is indicative of a data entry error. Following adjustment, all regions demonstrate consistent gradual trends.

</div>
<div style="flex: 2;">

![Outlier Impact](../../resources/diagrams/outlier_impact.svg)

</div>
</div>

---

## Outlier detection methodology

Outliers are identified through analysis of within-facility variation in monthly reporting for each indicator.

A value is classified as an outlier if it meets EITHER criterion:

1. The value exceeds 10 times the Median Absolute Deviation (MAD) from the facility's monthly median for that indicator, OR
2. The value represents more than 80% of the total volume for a given facility, indicator, and time period

AND the reported count exceeds 100.

---

## Outlier illustration

**Health Centre B - Malaria diagnostic tests:**

| Month | Tests reported | Classification |
|-------|----------------|---------|
| January | 245 | Within expected range |
| February | 267 | Within expected range |
| **March** | **2,890** | **Outlier** |
| April | 256 | Within expected range |

**Probable cause:** Data entry error (e.g., "2890" entered instead of "289")

**Analytical impact:** Without adjustment, the data would indicate an erroneous increase in malaria testing during March.

---

## Outlier prevalence: FASTR output

![Outliers](../../resources/default_outputs/Default_1._Proportion_of_outliers.png)
