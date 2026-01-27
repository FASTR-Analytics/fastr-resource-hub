---
marp: true
theme: fastr
paginate: true
---

## Automatic denominator selection

For each indicator, the module selects the denominator that produces coverage closest to the survey benchmark.

**Selection algorithm:**

1. Calculate coverage using each denominator option
2. Calculate squared error against survey: $(coverage - survey)^2$
3. Apply selection hierarchy (HMIS-based denominators prioritized over UN WPP)
4. Select the HMIS-based denominator with minimum error

Selection is made per indicator and geographic area. Users may override automatic selections in Part 2.

<!--
PRESENTER NOTES:
- With multiple denominator options, how do we choose?
- Calculate coverage using each option
- Compare to survey benchmark (DHS/MICS is gold standard)
- Select denominator with minimum squared error
- Preference given to HMIS-based over UN WPP denominators
- Selection is automatic but users can override in Part 2
- Different areas may have different best denominators for same indicator
-->
