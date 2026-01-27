---
marp: true
theme: fastr
paginate: true
---

## Denominators by entry point

<style scoped>
table { font-size: 0.75em; }
th, td { padding: 0.3em 0.5em !important; }
</style>

Each HMIS indicator serves as an entry point. The module derives all target populations via forward and backward cascades:

| Entry point | Base calculation | Forward derivation | Backward derivation |
|-------------|------------------|-------------------|---------------------|
| **ANC1** | ANC1 ÷ coverage → Pregnancies | Deliveries → Live births → DPT-eligible → Measles-eligible | — |
| **Deliveries** | Deliveries ÷ coverage → Deliveries | Live births → DPT-eligible → Measles-eligible | Pregnancies |
| **BCG** | BCG ÷ coverage → Live births | DPT-eligible → Measles-eligible | Deliveries → Pregnancies |
| **Penta1** | Penta1 ÷ coverage → DPT-eligible | Measles1-eligible → Measles2-eligible | Live births → Births → Deliveries → Pregnancies |
| **UN WPP** | Crude birth rate × population → Pregnancies, live births; Under-1 pop → DPT, measles | Applies mortality rates for measles denominators | — |

<!--
PRESENTER NOTES:
- Each HMIS indicator can serve as an entry point for denominator calculation
- ANC1: starts from pregnancies, derives all downstream populations
- Delivery/BCG: starts from live births, derives in both directions
- Penta1: starts from DPT-eligible, derives forward to measles and backward to pregnancies
- UN WPP provides population-based alternative (not service-based)
- Having multiple options allows selection of most accurate denominator per indicator
- Table summarizes which denominators can be derived from each entry point
-->
