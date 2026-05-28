---
marp: true
theme: fastr
paginate: true
---

## What the FASTR pipeline adds on top of DHIS2

DHIS2 holds the data; FASTR turns it into the analyses you've just seen. Three additions, matching the three sub-topics of this section:

- **Quality-adjusted volumes.** Outliers and reporting gaps are corrected before any analysis runs, so the trends, changes, and disruptions you read reflect service delivery — not data noise.
- **Disruption detection.** Service volumes are compared against the expected rhythm of each indicator (long-term trend + seasonality). Real drops and surpluses are flagged automatically; one-month noise is not.
- **Coverage with a derived denominator.** Denominators are back-calculated from HMIS entry points and benchmarked against UN World Population Prospects, giving a more defensible coverage figure than relying on catchment populations alone.

The same pipeline runs every quarter, so countries get findings on a routine rhythm rather than waiting for a one-off analysis.

<!--
PRESENTER NOTES:
- Frame this as the closer of the analysis section
- DHIS2 = raw data source; FASTR = analytics layer on top
- The three bullets map 1:1 to what was just covered (service utilization, disruption, coverage)
- Stress the quarterly rhythm: FASTR is designed for a cadence, not a one-shot study
-->
