---
marp: true
theme: fastr
paginate: true
---

## Coverage estimation

<div style="display: flex; gap: 1.5em;">
<div style="flex: 1.2; font-size: 0.85em;">

**The challenge:** HMIS has numerators (services) but not reliable denominators (target population). Standard catchment populations are often inaccurate. Surveys provide reliable coverage but only every 3-5 years.

**FASTR solution:**

1. **Back-calculate denominators** from survey coverage + HMIS volumes
   - Example: 10,000 ANC1 visits ÷ 80% survey coverage = 12,500 pregnancies
2. **Validate** against multiple denominator options (HMIS-derived, UN projections)
3. **Project forward** by anchoring to last survey and applying HMIS trends

</div>
<div style="flex: 0.8; text-align: center;">

**Coverage** = services delivered ÷ target population

![Coverage equation h:120](../../resources/diagrams/coverage_equation.svg)

</div>
</div>

<!--
PRESENTER NOTES:
- Key insight: we can derive denominators from the data itself
- Multiple denominator options compared to find best fit with survey benchmarks
- Projections extend survey estimates forward using HMIS trends
- Result: more reliable, timely coverage estimates for monitoring
-->
