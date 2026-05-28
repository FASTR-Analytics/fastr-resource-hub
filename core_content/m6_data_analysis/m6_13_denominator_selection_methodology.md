---
marp: true
theme: fastr
paginate: true
---

## Denominator selection methodology

FASTR builds **four candidate denominator chains**, each anchored on a different HMIS entry-point service (ANC1, deliveries, BCG, Penta1). For each chain, the platform:

1. **Back-calculates the entry-point population** by combining the HMIS service volume with the most recent survey coverage for that service. (Example: ANC1 volume ÷ ANC1 survey coverage → estimated pregnancies.)
2. **Extends through the demographic cascade** using country-specific parameters — pregnancy loss, stillbirth, neonatal and post-neonatal mortality — to derive the other target populations a chain needs (live births, surviving infants, etc.).

To pick between the four chains, the platform compares each to **UN World Population Prospects (UN WPP)** at national level and selects the chain whose median ratio to UN WPP is closest to 1.0.

**One chain, applied uniformly.** The chosen chain is then used for all indicators and all geographic levels.

**User override.** In Part 2 (m006), an analyst can override the auto-selection by setting `DENOMINATOR_CHAIN` to a specific chain (`anc1`, `delivery`, `bcg`, or `penta1`) if programmatic considerations argue for a different choice.

<!--
PRESENTER NOTES:
- The selection logic lives in m005's select_best_chain() function.
- UN WPP is the *anchor* used to compare chains; surveys are NOT the selection criterion.
- Median ratio closest to 1.0 = chain whose calculated population matches UN WPP most closely on average.
- One chain applies to ALL indicators in the analysis — not different chains per indicator.
- Same chain applies to ALL geographic levels (national, admin2, admin3).
- Users can manually override via the DENOMINATOR_CHAIN parameter in m006.
-->
