---
marp: true
theme: fastr
paginate: true
---

## Outliers

The presence of outliers examines whether a data point in a series of values is extreme (either abnormally high or low) in relation to others in the series.

Outliers can be the result of changes in programmatic activities (such as an intensified campaign) or can be data quality problems.

For the FASTR analysis, we identify outliers which are suspiciously high values compared to the usual volume of services reported by the facility (e.g., low values are not identified as outliers in the FASTR analysis).

<!--
PRESENTER NOTES:
- The presence of outliers examines whether a data point in a series of values is extreme (either abnormally high or low) in relation to others in the series
- Outliers can be the result of changes in programmatic activities (such as an intensified campaign) or can be data quality problems
- For the FASTR analysis, we identify outliers which are suspiciously high values compared to the usual volume of services reported by the facility (e.g., low values are not identified as outliers in the FASTR analysis)
- Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator
- An outlier is defined as: A value greater than 10 times the median absolute deviation (MAD) from the monthly median value for the indicator in each time period, OR a value for which the proportional contribution in volume for a facility, indicator, and time period is greater than 80%
- AND for which: The volume is greater than or equal to the median, the volume is not missing, and the volume is greater than 100
-->
