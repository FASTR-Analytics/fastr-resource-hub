---
marp: true
theme: fastr
paginate: true
---

## Multiple denominator options

Each HMIS indicator provides an **entry point** into the demographic cascade. From that starting point, the module calculates forward and backward to derive all target populations:

| Entry point | Calculation | Denominators derived |
|-------------|-------------|---------------------|
| **ANC1** | ANC1 ÷ coverage → Pregnancies | → Deliveries → Births → Live births → DPT-eligible → Measles-eligible |
| **Deliveries** | Deliveries ÷ coverage → Live births | ← Pregnancies ← ... and → DPT-eligible → Measles-eligible |
| **BCG** | BCG ÷ coverage → Live births | ← Pregnancies ← ... and → DPT-eligible → Measles-eligible |
| **Penta1** | Penta1 ÷ coverage → DPT-eligible | ← Live births ← Births ← ... and → Measles-eligible |

This produces **four complete sets** of denominators, each anchored to a different HMIS indicator. A fifth option uses **UN population projections** directly.
