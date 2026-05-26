---
marp: true
theme: fastr
paginate: true
---

## Extract counts, not percentages

FASTR analyses **raw service counts** — the actual number of services each facility reported each month. It does **not** accept percentages, proportions, or pre-calculated coverage figures.

| Do extract | Do **not** extract |
|------------|--------------------|
| Number of ANC1 visits per facility per month | ANC1 coverage rate (%) |
| Number of Penta1 doses administered | Vaccination coverage proportion |
| Number of facility deliveries | Pre-calculated coverage indicators |

**Why?**

- You can't detect an outlier on a percentage — it is capped at 100 and hides the underlying facility volume.
- You can't add percentages across facilities of different sizes to get a regional total.
- The platform calculates coverage itself by dividing counts by population denominators in **Modules 5 & 6**.
- Outlier and completeness adjustments (**Modules 1 & 2**) are statistical methods that need raw counts to work.

<!--
PRESENTER NOTES:
- This is the most important rule for data extraction
- Common mistake: pulling DHIS2 "data elements" that already store coverage %
- Always extract the numerator (count of services) — the platform handles the rest
- If your DHIS2 indicator says "rate" or "%" or "proportion", you have the wrong thing
- Show participants concrete example: ANC1 visits (count) vs ANC1 coverage rate (%)
-->
