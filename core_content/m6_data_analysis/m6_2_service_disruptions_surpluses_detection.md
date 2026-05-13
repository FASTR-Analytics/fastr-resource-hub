---
marp: true
theme: fastr
paginate: true
---

## Service disruptions and surpluses detection

The FASTR approach to detecting service disruptions and surpluses uses **interrupted time series (ITS) regression** with facility-level fixed effects. This statistical framework allows for more meaningful interpretation and comparison of count data across subnational areas, enabling insights that raw data alone cannot provide.

By focusing on meaningful changes and trends rather than raw numbers, this approach supports more accurate and comparable analysis. Previous large and unexpected changes in historical data are removed to establish a clean baseline. Unexpected volume changes are then estimated by comparing observed volumes to expected volumes based on historical trends and seasonality.
