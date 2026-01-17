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
