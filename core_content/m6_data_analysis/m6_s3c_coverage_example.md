---
marp: true
theme: fastr
paginate: true
---

## Service coverage example

ANC4+ coverage over time: the chart shows the percentage of pregnant women who received at least four antenatal visits, in this country and at this admin level. The horizontal axis is time; the vertical axis is the coverage rate. Where the line dips, fewer women completed all four visits than the model expected. Where it climbs, coverage improved.

The line is built from two things on every point: the numerator (ANC4 visits reported in DHIS2) and the denominator (estimated pregnancies for that period, derived from the demographic cascade). Reading the chart is a question of trend, not a single point — a single low quarter is rarely meaningful, a multi-quarter downturn usually is.

![Coverage example ANC4+ h:300](../../resources/diagrams/coverage_example_anc4.svg)

<!--
PRESENTER NOTES:
- Anchor the reader on what the axis means before they read the line
- Stress that coverage = numerator / denominator, both have to be plausible
- ANC4+ in particular is sensitive to whether the survey-based denominator is fresh
- If the line is bumpy, suspect denominator noise before service-delivery change
-->
