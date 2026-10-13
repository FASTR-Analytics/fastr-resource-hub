---
marp: true
theme: fastr
paginate: true
---

## Naming conventions for indicators

**Labels** appear in your visualizations, so keep them short. Long labels become unreadable on charts.

- Avoid: *Total number of first antenatal care visits in public facilities*
- Prefer: *ANC1 (public facilities)*

**Indicator IDs** should stay readable and must not be a raw DHIS2 code. Use lowercase `snake_case`, the standard convention for variable names in data analysis.

- Avoid: `uTj3xK9pLm2` (raw ID) or `ANC1 First Trimester` (spaces and capitals)
- Prefer: `anc1_first_trimester`, `maternal_mortality_rate`, `assisted_deliveries`
