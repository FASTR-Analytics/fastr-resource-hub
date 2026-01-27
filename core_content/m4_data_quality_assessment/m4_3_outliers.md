---
marp: true
theme: fastr
paginate: true
---

## Outliers

The presence of outliers examines whether a data point in a series of values is extreme (either abnormally high or low) in relation to others in the series.

Outliers can be the result of changes in programmatic activities (such as an intensified campaign) or can be data quality problems.

For the FASTR analysis, we identify outliers which are suspiciously high values compared to the usual volume of services reported by the facility (e.g., low values are not identified as outliers in the FASTR analysis).

---

## Why adjust for outliers?

![Outlier Impact](../../resources/diagrams/outlier_impact.svg)

---

## Outlier detection methodology

Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator.

An outlier is defined as:

A value greater than **10 times the median absolute deviation (MAD)** from the monthly median value for the indicator in each time period, **OR** a value for which the proportional contribution in volume for a facility, indicator, and time period is **greater than 80%**

**AND** for which:

- The volume is **greater than or equal to the median**
- The volume is **not missing**
- The volume is **greater than 100**

---

## Outliers: Percent of monthly values that are outliers

For a given indicator in a given time period, the percent of monthly values that are outliers:

**% outliers = # monthly values that are outliers / total N of monthly values**

![Outliers h:340](../../resources/default_outputs/Default_1._Proportion_of_outliers.png)

<!--
PRESENTER NOTES:
- FASTR only flags HIGH outliers - low values likely reflect real service disruptions
- The MAD-based method is robust to the outliers themselves (unlike standard deviation)
- Two ways to be flagged: statistical deviation OR dominating the regional total (>80%)
- The diagram shows why outliers matter: one extreme value can mask all other trends
- Ask: Have you seen examples of outliers in your data? What caused them?
-->
