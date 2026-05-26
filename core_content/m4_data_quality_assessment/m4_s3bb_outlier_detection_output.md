---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## Outlier detection output

<div class="output-layout">
<div class="output-viz">

![Outliers output](../../resources/default_outputs/Default_1._Proportion_of_outliers.png)

</div>
<div class="output-text">

**What you see:** Heatmap showing proportion of values flagged as outliers by indicator and region.

**Formula:** Outlier % = (values flagged / total values) × 100

**Interpretation:** High rates may indicate data entry errors or legitimate events like campaigns. Review facility registers to distinguish between the two.

</div>
</div>

<!--
PRESENTER NOTES:
- The presence of outliers examines whether a data point in a series of values is extreme (either abnormally high or low) in relation to others in the series
- Outliers can be the result of changes in programmatic activities (such as an intensified campaign) or can be data quality problems
- For the FASTR analysis, we identify outliers which are suspiciously high values compared to the usual volume of services reported by the facility (e.g., low values are not identified as outliers in the FASTR analysis)
- Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator
- An outlier is defined as: A value greater than 10 times the median absolute deviation (MAD) from the monthly median value for the indicator in each time period, OR a value for which the proportional contribution in volume for a facility, indicator, and time period is greater than 80%
- AND for which: The volume is greater than or equal to the median, the volume is not missing, and the volume is greater than 100
- For the FASTR analysis, the time period considered for identifying outliers using the MAD approach spans the entire dataset. This means that if the dataset includes five years of data, the median value for each indicator will be calculated across the entire five-year period
- For the FASTR analysis, the proportional allocation approach to identifying outliers is applied on a calendar-year basis. This means that all data from the year 2024 will be used to assess the proportional contribution of service volumes reported in 2024. If the analysis is conducted mid-year, only the available data up to that point will be considered, potentially leading to a partial year's data being used in the assessment
- This restricts the FASTR analysis to outliers which are suspiciously high values compared to the usual volume of services reported by a facility
- Missing data from a DHIS2 system can be due to non-reporting or reporting of zero services delivered (zeros are often not stored in DHIS2). We cannot distinguish between missing due to non-reporting and missing due to reporting zero services. As such, missing values are excluded from the analysis
- We restrict outlier detection to service volumes greater than 100 as this helps in focusing on meaningful, stable, and operationally significant data. It reduces noise due to small volume volatility and focuses on more impactful outliers (e.g. large volumes are likely to have more significant implications of the analysis)
-->
