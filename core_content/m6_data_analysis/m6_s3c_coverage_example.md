---
marp: true
theme: fastr
paginate: true
---

## Service coverage example: ANC4+

What goes into the coverage rate for one indicator. **Numerator** = the number of pregnant women with four or more antenatal visits, taken directly from DHIS-2. **Denominator** = the total number of pregnancies in the population over the same period.

The numerator is easy: facilities report it every month. The denominator is the hard part: DHIS-2 does not hold a count of pregnancies. Without a defensible denominator the coverage percentage is meaningless.

The next few slides explain how FASTR builds that denominator from the data it does have.

![Coverage formula for ANC4+ h:280](../../resources/diagrams/coverage_example_anc4.svg)

<!--
PRESENTER NOTES:
- Use this slide to set up "the denominator problem" on the next slide
- Numerator is HMIS, denominator is NOT — that asymmetry is the whole reason FASTR derives the denominator
- Stress: a percentage with the wrong denominator is worse than no number
-->
