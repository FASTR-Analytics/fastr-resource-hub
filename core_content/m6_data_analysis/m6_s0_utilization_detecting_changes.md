---
marp: true
theme: fastr
paginate: true
---

## Service utilization: detecting changes

Service volumes naturally go up and down — more malaria cases in the rainy season, for example. How do you tell a **normal variation** from a **real disruption**?

**FASTR learns the normal rhythm** of each indicator in each area:
- Long-term trend (are services growing or shrinking?)
- Seasonality (which months are usually higher?)

Then it compares **observed volumes** to **expected volumes**:

- **Below** expected → potential disruption (stockout? strike? conflict?)
- **Above** expected → unusual increase (vaccination campaign? new program?)

The module measures **how many services were lost or gained** and over what period.
