---
marp: true
theme: fastr
paginate: true
---

<!-- _class: compact -->

## How does the FASTR data quality analysis differ from the DQA analysis done in DHIS2?

**Selection of indicators, measures, and thresholds continued**

The purpose of the data quality assessment guides the selection of indicators, measures, and thresholds.

- DHIS2 DQA assesses four measures of internal consistency: presence of outliers, consistency over time, consistency between related indicators, and consistency between reported data and original records (this metric requires a site assessment / data collection). FASTR focuses on two of these measures: presence of outliers and consistency between related indicators because these are important for analysis and can be done routinely and remotely without visits to heath facilities.

- FASTR and DHIS2 DQA use different outlier detection methods (MADs vs standard deviations); FASTR focuses on identifying VERY large outliers that have undue influence in the analysis and for which adjustments will be made; DHIS2 DQA focuses on identifying outliers that should be followed up at the facility level, with no significant negative impact even if a few correct values are flagged as potential outliers, since these will be investigated further.

- DHIS2 DQA may assess agreement with external data sources such as periodic population-based surveys and consistency of population data which serves as the denominator for coverage analysis. FASTR does not include this in the data quality assessment but instead incorporates this in our coverage analysis.

