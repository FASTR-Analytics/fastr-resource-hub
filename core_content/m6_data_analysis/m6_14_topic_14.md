---
marp: true
theme: fastr
paginate: true
---

## Projecting coverage between surveys

Surveys (DHS/MICS) occur every 3-5 years. The module projects the last survey value forward using the trend observed in HMIS-calculated coverage:

![Coverage projection method](../../resources/diagrams/coverage_projection.svg)

**How it works:** Calculate the year-over-year change (delta) in HMIS coverage, then add each delta to the last survey value. This carries forward the survey baseline while incorporating observed HMIS trends.
