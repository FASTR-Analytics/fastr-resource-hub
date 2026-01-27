---
marp: true
theme: fastr
paginate: true
---

## FASTR analytical pipeline

![Analytical Pipeline h:390](../../resources/diagrams/analytical_pipeline.svg)

The FASTR analysis follows a sequential workflow where each step builds on the previous:

1. **Assess data quality** - Identify issues with completeness, outliers, and consistency
2. **Adjust for quality issues** - Apply corrections to improve data reliability
3. **Analyze adjusted data** - Generate service utilization and coverage estimates

<!--
PRESENTER NOTES:
- This is the overall FASTR workflow - emphasize that each step builds on the previous
- DQA comes first because we need to understand data limitations before analyzing
- Adjustment is optional but recommended for most analyses
- The final analysis uses cleaned data for more reliable estimates
-->
