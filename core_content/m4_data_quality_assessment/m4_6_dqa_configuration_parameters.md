---
marp: true
theme: fastr
paginate: true
---

## DQA module: Configuration parameters

| Parameter | Description |
|-----------|-------------|
| **Proportion threshold for outlier detection** | Adjusts the threshold for proportional contribution to flag a facility-month as an outlier |
| **Minimum count threshold for consideration** | Defines the minimum count required for a facility-month to be considered an outlier |
| **Number of MADs** | Outliers are defined as observations which are greater than X times the median absolute deviation (MAD) from the monthly median value for the indicator in each time period |
| **Indicators subjected to DQA** | Defines which indicators are included for assessment of outliers and completeness for inclusion in the DQA score |
| **Consistency pairs used** | Defines which indicator pairs are used for consistency analysis and the expected ratio ranges |
