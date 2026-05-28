---
marp: true
theme: fastr
paginate: true
---

## How FASTR estimates coverage

**1. Back-calculate at the entry point.** For each HMIS entry-point service (ANC1, deliveries, BCG, Penta1), combine the service volume with the most recent survey coverage for that service to back-calculate the target population.
*Example: 10,000 ANC1 visits ÷ 80% ANC1 survey coverage → ~12,500 pregnancies.*

**2. Extend through the demographic cascade.** Apply country-specific parameters — pregnancy loss, stillbirth, neonatal and post-neonatal mortality — to derive the other populations needed by the chain (live births, surviving infants, etc.). This produces four parallel chains, one per entry point.

**3. Select the best chain against UN WPP.** Compare each chain to UN World Population Prospects at national level and pick the chain whose median ratio to UN WPP is closest to 1.0. The selected chain is then applied uniformly to all indicators and geographic levels.

**4. Project coverage forward.** For years between surveys, anchor to the last survey value and apply year-on-year HMIS coverage deltas (additive method).

<!--
PRESENTER NOTES:
- Condensed overview of coverage estimation methodology
- Key insight: standard HMIS denominators (catchment populations) often inaccurate
- FASTR approach: derive denominators from data, validate against surveys
- Example calculation: 10,000 ANC1 / 80% coverage = 12,500 pregnancies
- Multiple denominator options compared to select best fit
- Projections extend surveys forward using HMIS trends
- Result: more reliable coverage estimates for monitoring
-->
