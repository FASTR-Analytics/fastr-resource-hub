---
marp: true
theme: fastr
paginate: true
---

<!-- _class: compact -->
## Coverage module: Configuration parameters

| Parameter | Description |
|-----------|-------------|
| **Count value to use** | Which adjusted count to use for coverage calculation |
| **Level to calculate coverage for** | Geographic levels for coverage estimation: national, provincial (admin area 2), or district (admin area 3) |
| **Pregnancy loss rate** | Proportion of pregnancies ending in loss before delivery |
| **Twin rate** | Proportion of deliveries resulting in twins |
| **Stillbirth rate** | Proportion of births that are stillbirths |
| **Neonatal mortality rate** | Deaths in first 28 days per live birth |
| **Postneonatal mortality rate** | Deaths from 28 days to 1 year per live birth |
| **Infant mortality rate** | Deaths before age 1 per live birth |
| **Under 5 mortality rate** | Deaths before age 5 per live birth |

Country-specific mortality rates may be obtained from DHS reports, UN IGME, or national vital statistics.

<!--
PRESENTER NOTES:
- Configuration parameters control denominator calculations
- Count variable: which adjusted data to use (recommend "both")
- Analysis levels: national, provincial, district - choose based on data quality
- Demographic rates: defaults provided but should use country-specific values
- Sources for rates: DHS reports, UN IGME estimates, national vital statistics
- Mortality rates affect denominator calculations significantly
- Higher mortality = smaller surviving population denominators
-->
