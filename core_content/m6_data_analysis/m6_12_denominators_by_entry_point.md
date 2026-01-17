---
marp: true
theme: fastr
paginate: true
---

## Denominators by entry point

Each HMIS indicator serves as an entry point. The module derives all target populations via forward and backward cascades:

| Entry point | Base calculation | Forward derivation | Backward derivation |
|-------------|------------------|-------------------|---------------------|
| **ANC1** | ANC1 ÷ coverage → Pregnancies | Deliveries → Live births → DPT-eligible → Measles-eligible | — |
| **Deliveries** | Deliveries ÷ coverage → Deliveries | Live births → DPT-eligible → Measles-eligible | Pregnancies |
| **BCG** | BCG ÷ coverage → Live births | DPT-eligible → Measles-eligible | Deliveries → Pregnancies |
| **Penta1** | Penta1 ÷ coverage → DPT-eligible | Measles1-eligible → Measles2-eligible | Live births → Births → Deliveries → Pregnancies |
| **UN WPP** | Population projections | All denominators directly | — |
