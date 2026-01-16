---
marp: true
theme: fastr
paginate: true
---

## Detecting disruptions

Beyond simple trends, we detect periods where service delivery deviates significantly from what we would expect.

**The approach:**

1. Calculate **expected volume** based on historical patterns
2. Compare **actual volume** to expected
3. Quantify the **shortfall** (actual below expected) or **surplus** (actual above expected)

---

## What is "expected" volume?

We model expected service volume using two components:

**Trend:** The long-term direction (increasing, decreasing, or stable)

**Seasonality:** Predictable monthly patterns (e.g., malaria cases rise in rainy season)

The model learns these patterns from historical data and projects what volume *should* be in each month.

---

## Expected vs actual: Visual concept

<div class="columns">
<div>

**When actual = expected:**
Services are delivered as anticipated based on historical patterns.

**When actual < expected (shortfall):**
Fewer services than expected — possible disruption.

**When actual > expected (surplus):**
More services than expected — could indicate catch-up, outreach, or reporting changes.

</div>
<div>

![Actual vs expected national](../../resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

</div>
</div>

---

## Reading the actual vs expected charts

**Black line:** Actual (observed) service volumes

**Red shaded areas:** Shortfall periods — actual is below expected

**Green shaded areas:** Surplus periods — actual is above expected

**The larger the shaded area, the greater the disruption magnitude.**
