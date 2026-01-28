---
marp: true
theme: fastr
paginate: true
---

## Denominator selection methodology

**Goal:** Select the denominator method that produces coverage estimates closest to survey benchmarks (DHS/MICS).

**How it works:**

1. Calculate coverage using all available denominator methods
2. Compare each result to survey coverage estimates
3. Select the denominator with the smallest error compared to the survey

This approach minimizes the discrepancy between HMIS and survey-based estimates, making the selected denominator the most reliable for estimating true coverage.

**Key point:** Each indicator (ANC1, ANC4, deliveries, etc.) may use a different denominator method. However, for a given indicator, the same method is used across all timepoints and all subnational areas for consistency. Selection is performed at the national level, then applied uniformly to all geographic levels.

<!--
PRESENTER NOTES:
- We have multiple ways to calculate denominators - which one is best?
- Survey data (DHS/MICS) is our gold standard for coverage
- We test each denominator method and pick the one closest to survey
- Selection is done at the national level using national survey data
- The selected method is then applied to all subnational areas
- This ensures consistency: same method for all regions and timepoints within an indicator
- Different indicators can use different methods (ANC1 might use one, Penta1 another)
- Users can override automatic selections if needed
-->
