---
marp: true
theme: fastr
paginate: true
---

## Data quality summary score

Results from the outlier, completeness, and consistency checks are combined into an overall DQA score for a set of core indicators (Penta1, ANC1, OPD).

**Two complementary measures:**

- **Overall DQA score** — percentage of facility-months passing **all** quality checks. Binary: a facility-month scores 100% only if all core indicators are complete, free of outliers, and consistent
- **Mean DQA score** — average of the completeness-outlier score and the consistency score. Captures partial progress even when not all checks pass

**A facility-month has adequate data quality when:**

- All core indicator data are reported (complete)
- No values are flagged as outliers
- Consistency benchmarks are met for available indicator pairs (e.g., Penta1/Penta3, ANC1/ANC4)
