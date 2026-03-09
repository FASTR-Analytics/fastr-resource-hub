---
marp: true
theme: fastr
paginate: true
---

## Service cascade and dropout analysis

A service cascade shows the journey patients take through a series of related health services. At each step, some patients don't continue to the next one — this is called **dropout**.

For example, in maternal health: **ANC1 → ANC4 → Facility delivery → PNC**

Each step should ideally retain as many patients as possible, but in practice, numbers decrease along the way. Understanding where and why patients drop out helps target interventions.

![Service cascade](../../resources/diagrams/service_cascade_funnel.svg)

---

## Calculating and interpreting dropout

**Dropout formula:**

> Dropout % = (Earlier step - Later step) / Earlier step × 100

**Example:** If 1,000 women attend ANC1 but only 700 complete ANC4:

> Dropout = (1,000 - 700) / 1,000 × 100 = **30%**

**Interpretation scale:**

| Dropout rate | Interpretation |
|---|---|
| < 10% | Excellent — strong continuity of care |
| 10–25% | Acceptable — monitor regularly |
| 25–50% | Investigate further — identify barriers |
| > 50% | Critical — requires immediate action |

**Try it:** Find Penta1 and Penta3 for your region. What is the dropout rate? What might explain it?
