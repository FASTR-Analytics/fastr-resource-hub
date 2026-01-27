---
marp: true
theme: fastr
paginate: true
---

## Coverage projection methodology

The module projects the most recent survey value forward using trends observed in HMIS-derived coverage:

![Coverage projection method](../../resources/diagrams/coverage_projection.svg)

Year-over-year changes (deltas) in HMIS coverage are calculated and applied to the last survey value. This approach preserves the survey baseline while incorporating observed service delivery trends.

<!--
PRESENTER NOTES:
- Surveys are infrequent (3-5 years) - need to fill gaps
- Projection method: last survey value + HMIS trend since survey
- Formula: Projected = Survey baseline + (Current HMIS - Survey year HMIS)
- Preserves calibration to survey while incorporating observed changes
- Additive approach avoids compounding errors
- Projections should be validated when new survey data available
- Longer time since survey = less reliable projection
-->
