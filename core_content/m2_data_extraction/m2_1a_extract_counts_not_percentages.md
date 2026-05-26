---
marp: true
theme: fastr
paginate: true
---

## Extract counts, not percentages

FASTR analyses **raw service counts**, not percentages, proportions, or pre-calculated coverage figures.

<div class="columns">
<div>

| Do extract | Do **not** extract |
|------------|--------------------|
| ANC1 visits per facility per month | ANC1 coverage rate (%) |
| Penta1 doses administered | Vaccination coverage proportion |
| Facility deliveries | Pre-calculated coverage indicators |

</div>
<div>

**Why counts, not percentages?**

- Outliers cannot be detected on a percentage: it caps at 100 and hides the underlying volume.
- Percentages cannot be summed across facilities of different sizes to produce a regional total.
- The platform builds coverage itself from counts and population denominators (**Modules 5 & 6**).
- Outlier and completeness adjustments (**Modules 1 & 2**) require raw counts to run.

</div>
</div>

<!--
PRESENTER NOTES:
- This is the most important rule for data extraction.
- Common mistake: pulling DHIS2 "data elements" that already store coverage %.
- Always extract the numerator (count of services); the platform handles the rest.
- If the DHIS2 indicator says "rate", "%", or "proportion", it is the wrong field.
- Concrete example to anchor the rule: ANC1 visits (count) vs ANC1 coverage rate (%).
-->
