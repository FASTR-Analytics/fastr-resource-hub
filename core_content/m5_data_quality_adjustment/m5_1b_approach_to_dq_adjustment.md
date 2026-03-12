---
marp: true
theme: fastr
paginate: true
---

## Indicators excluded from adjustment

Certain indicators are excluded from the adjustment process:

- **Mortality indicators** (maternal deaths, neonatal deaths, under-5 deaths): These represent discrete events where smoothing or imputation is not appropriate
- **Low-volume indicators**: Indicators that never exceed 100 reported events in any month are excluded from adjustment

<!--
PRESENTER NOTES:
- This module addresses the issues identified in DQA
- Key concept: we replace problematic values with estimates based on facility's own history
- Four parallel datasets allow sensitivity analysis - how much do results change?
- Mortality excluded because smoothing discrete rare events is inappropriate
- Low-volume excluded because adjustment adds noise to already sparse data
-->
