---
marp: true
theme: fastr
paginate: true
---

## Data quality: what does FASTR check?

Before analyzing, FASTR checks if the data is reliable — like an accountant verifying the numbers before preparing a report.

**Three checks:**

- **Extreme values** — A facility suddenly reports 10× more than usual? Probably a data entry error
- **Missing reports** — A facility didn't submit a report for 3 months? Its data is missing
- **Logical consistency** — More 4th antenatal visits than 1st visits? Something is wrong

Each check produces a **quality score** that helps decide if data can be used as-is or needs adjustment.
