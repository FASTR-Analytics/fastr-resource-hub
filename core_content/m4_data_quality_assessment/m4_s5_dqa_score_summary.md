---
marp: true
theme: fastr
paginate: true
---

## Data quality summary score

Results from the outlier, completeness, and consistency checks are combined into an overall DQA score for a set of core indicators (Penta1, ANC1, OPD).

**Two complementary measures:**

- **Overall DQA score:** Percentage of facility-months passing **all** quality checks. A facility-month scores 100% only if all core indicators are complete, free of outliers, and consistent
- **Mean DQA score:** Average of the completeness-outlier score and the consistency score. Captures partial progress even when not all checks pass

**A facility-month has adequate data quality when:**

- All core indicator data are reported (complete)
- No values are flagged as outliers
- Consistency benchmarks are met for available indicator pairs (e.g., Penta1/Penta3, ANC1/ANC4)

**Quick guide:** Above 80% = reliable for analysis. 60-80% = usable with caution. Below 60% = investigate before using.

**Try it:** Check your region's DQA score. Is it above or below 80%? If below, which dimension is pulling it down?

<!--
PRESENTER NOTES:
- The overall DQA score is strict: all-or-nothing. A single failed check = 0%
- The mean DQA score is more nuanced: shows how close facilities are to meeting all criteria
- Example: if completeness-outlier score is 1.0 but consistency is 0.5, mean DQA = 0.75 (75%)
- Use overall score to identify problem areas; use mean score to track improvement over time
- This completes the DQA module - next we'll look at how to adjust for these issues
-->
