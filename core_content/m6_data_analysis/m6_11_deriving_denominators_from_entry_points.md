---
marp: true
theme: fastr
paginate: true
---

## Deriving denominators from entry points

Each HMIS indicator (ANC1, deliveries, BCG, Penta1) serves as an **entry point** for calculating denominators. From any entry point, the cascade derives other populations in both directions:

- **Forward:** Apply mortality/attrition rates to move down the cascade
  - *Example:* DPT-eligible → Measles1-eligible → Measles2-eligible
- **Backward:** Reverse mortality rates (add deaths back) to move up the cascade
  - *Example:* Penta1 → Live births → Deliveries → Pregnancies

This gives us **multiple independent denominator estimates** for each target population, allowing us to select the most accurate one.

<!--
PRESENTER NOTES:
- Each HMIS indicator can serve as an entry point for denominator calculation
- Cascade works in two directions - forward and backward
- Forward: apply mortality rates to get downstream populations
- Backward: reverse the logic (add deaths back) to get upstream populations
- Example: from Penta1, can estimate live births, then deliveries, then pregnancies
- Multiple entry points give us multiple independent denominator estimates
- Having multiple estimates allows validation and selection of best option
-->
