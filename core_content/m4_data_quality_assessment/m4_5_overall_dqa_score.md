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

---

## Quick interpretation guide

| Score range | What it means | What to do |
|-------------|---------------|------------|
| **Above 80%** | Reliable — use confidently for analysis | Proceed with analysis |
| **60-80%** | Usable with caution — some quality gaps | Note limitations, investigate weak dimensions |
| **Below 60%** | Investigate before using | Identify which dimension (completeness, outliers, consistency) is pulling the score down |

**Try it:** Check your region's overall DQA score. Is it above or below 80%? If below, look at the individual dimension scores — which one needs the most attention?
