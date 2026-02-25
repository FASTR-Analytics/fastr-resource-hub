---
marp: true
theme: fastr
paginate: true
---

## Expected relationships which help with estimating denominators

![Denominator cascade flowchart](../../resources/diagrams/denominator_cascade.svg)

<!--
PRESENTER NOTES:
Demographic cascade shows how populations transform through life stages
- Start with pregnancies → apply pregnancy loss → deliveries
- Deliveries → adjust for twins → births
- Births → subtract stillbirths → live births
- Live births → subtract neonatal deaths → DPT-eligible
- DPT-eligible → subtract post-neonatal deaths → Measles-eligible
- Each step uses country-specific mortality rates
- This logic works in both directions (forward and backward)

Key formulas:
- Preg = Del/(1-PLR)
- Del = Preg*(1-PLR)
- TB = Del/(1-0.5*TWR)
- Del = TB*(1-0.5*TWR)
- TB = LB/(1-SBR)
- LB = TB*(1-SBR)
- Preg = (LB*(1-0.5*TWR))/((1-SBR)*(1-PLR))

At provincial level, we use all default values!
-->
