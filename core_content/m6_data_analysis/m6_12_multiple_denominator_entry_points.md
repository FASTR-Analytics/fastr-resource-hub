---
marp: true
theme: fastr
paginate: true
---

## Multiple denominator entry points

Each HMIS indicator serves as an entry point into the demographic cascade. The module calculates forward and backward to derive all target populations:

| Entry point | Base calculation | Denominators derived |
|-------------|------------------|---------------------|
| **ANC1** | ANC1 ÷ coverage → Pregnancies | Deliveries, Births, Live births, DPT-eligible, Measles-eligible |
| **Deliveries** | Deliveries ÷ coverage → Live births | Pregnancies (backward), DPT-eligible, Measles-eligible |
| **BCG** | BCG ÷ coverage → Live births | Pregnancies (backward), DPT-eligible, Measles-eligible |
| **Penta1** | Penta1 ÷ coverage → DPT-eligible | Measles-eligible |
| **UN WPP** | Population projections | Pregnancies, Live births, DPT-eligible, Measles-eligible |

Coverage is calculated using each denominator option; the optimal denominator is then selected.
