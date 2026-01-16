---
marp: true
theme: fastr
paginate: true
---

## Estimating denominators from ANC-1

Using survey coverage + DHIS2 counts to derive denominators:

| Step | Formula | Example |
|------|---------|---------|
| Pregnancies | ANC1 count ÷ ANC1 coverage | 100,000 ÷ 0.95 = 105,263 |
| Deliveries | Pregnancies × (1 - stillbirth rate) | 105,263 × 0.97 = 102,105 |
| Live births | Deliveries × survival rate | 102,105 × 0.98 = 100,063 |
