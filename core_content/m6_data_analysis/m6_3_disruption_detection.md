---
marp: true
theme: fastr
paginate: true
---

## Disruption detection

The analysis identifies periods where service delivery deviates significantly from expected levels using a two-stage approach:

| Stage | Method | Purpose |
|-------|--------|---------|
| **1. Control chart analysis** | Statistical process control | Identify when disruptions occur |
| **2. Regression analysis** | Panel regression models | Quantify disruption magnitude |

---

## Expected service volume

Expected volume is modeled using two components:

| Component | Description |
|-----------|-------------|
| **Trend** | Long-term direction (increasing, decreasing, or stable) |
| **Seasonality** | Predictable monthly patterns (e.g., increased malaria cases during rainy season) |

The model estimates expected volume for each month based on historical patterns. Significant deviations from expected values are flagged as potential disruptions.

---

## Shortfalls and surpluses

<div class="columns">
<div>

| Comparison | Interpretation |
|------------|----------------|
| **Actual = Expected** | Services delivered as anticipated |
| **Actual < Expected** | Shortfall: fewer services than expected |
| **Actual > Expected** | Surplus: more services than expected |

Surpluses may indicate catch-up campaigns, outreach activities, or reporting changes.

</div>
<div>

![Actual vs expected national](../../resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

</div>
</div>

---

## Chart interpretation

| Element | Description |
|---------|-------------|
| **Black line** | Actual (observed) service volumes |
| **Red shaded areas** | Shortfall periods (actual below expected) |
| **Green shaded areas** | Surplus periods (actual above expected) |

The magnitude of the shaded area corresponds to the scale of the disruption.
