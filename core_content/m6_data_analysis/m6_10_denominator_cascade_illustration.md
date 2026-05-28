---
marp: true
theme: fastr
paginate: true
---

## Estimating denominators from ANC-1

Worked example. The survey says 80% of pregnant women receive ANC1. The HMIS reports 10,000 ANC1 visits in the period, so 10,000 ÷ 0.80 ≈ 12,500 pregnancies. From pregnancies, FASTR walks the cascade: pregnancies → deliveries (apply pregnancy-loss rate) → live births (apply still-birth rate) → infants surviving to each age band (apply neonatal and infant mortality). Each step uses country-specific rates from the most recent DHS or vital statistics. The chain ends with the population eligible for any downstream service — DPT, measles, growth monitoring — without needing to ask the survey for each one.

![Denominator cascade example h:340](../../resources/diagrams/denominator_cascade_example.svg)

<!--
PRESENTER NOTES:
- Walk the example slowly: ANC1 visits → coverage rate → pregnancies → cascade steps
- The 80% is from the survey, the 10,000 is from HMIS — that's the marriage of the two data sources
- Each step's rate is country-specific; the numbers above the arrows in the diagram are illustrative
- End point: ~9,067 children eligible for DPT vaccination (from 12,500 pregnancies)
- Numbers are illustrative — actual rates vary by country
-->
