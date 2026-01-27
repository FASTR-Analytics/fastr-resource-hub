---
marp: true
theme: fastr
paginate: true
---

## Forward and backward derivation

From any entry point, the cascade derives denominators in both directions:

| Direction | Method | Example from Penta1 |
|-----------|--------|---------------------|
| **Forward** | Apply mortality/attrition rates | DPT-eligible → Measles1-eligible → Measles2-eligible |
| **Backward** | Reverse mortality rates (add deaths back) | DPT-eligible → Live births → Births → Deliveries → Pregnancies |

Backward derivation enables estimation of upstream populations from downstream service counts.

<!--
PRESENTER NOTES:
- Cascade works in two directions
- Forward: pregnancies → deliveries → live births → DPT-eligible → Measles-eligible
- Backward: reverse the logic (add deaths back instead of subtracting)
- Example: from Penta1, can estimate live births, then births, then pregnancies
- Multiple entry points give us multiple independent denominator estimates
- Having multiple estimates allows validation and selection of best option
-->
