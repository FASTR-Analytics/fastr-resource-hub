---
marp: true
theme: fastr
paginate: true
---

## Detecting service disruptions

Beyond year-over-year comparisons, we want to know: **Is service delivery on track, or has something disrupted it?**

**The challenge:** Raw service counts are hard to interpret. A drop in services could be a real disruption, or just normal seasonal variation. Different areas have different baseline volumes, making direct comparison difficult.

**FASTR's solution:** Use statistical modeling to estimate what service volume we would *expect* based on historical trends and seasonality, then compare actual volume to this expectation.

- **Disruption:** Observed volume significantly below expected
- **Surplus:** Observed volume significantly above expected
