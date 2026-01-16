---
marp: true
theme: fastr
paginate: true
---

## Projecting coverage between surveys

Surveys (DHS/MICS) occur every 3-5 years. The module projects the last survey value forward using the trend observed in HMIS-calculated coverage:

![Coverage projection method](../../resources/diagrams/coverage_projection.svg)

---

### Projection formula

$$\text{Projected coverage}_t = \text{Last survey value} + (\text{HMIS coverage}_t - \text{HMIS coverage}_{\text{survey year}})$$

This preserves the survey calibration while incorporating observed trends from administrative data.
