---
marp: true
theme: fastr
paginate: true
---

## Disruption detection comparison to DHIS2

Disruption detection extends service utilization analysis using statistical approaches not available in DHIS2. The regression framework enables several capabilities that improve upon simple trend visualization.

The model **accounts for seasonality** when calculating expected values, ensuring that seasonal patterns are not mistaken for disruptions. It **excludes unusual historical changes** so that one-off events do not influence the baseline. **Historical data serves as context** for establishing expected service levels, and the framework systematically **detects both disruptions and recovery patterns**.

Most importantly, this approach **quantifies changes with a robust methodology** rather than relying on visual observation of trend fluctuations. This improves the ability to interpret and compare utilization data across national and subnational areas **without requiring population denominators**.
