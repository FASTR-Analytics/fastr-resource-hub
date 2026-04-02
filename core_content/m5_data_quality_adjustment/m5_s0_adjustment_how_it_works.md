---
marp: true
theme: fastr
paginate: true
---

## Data correction: how FASTR fixes problems

Rather than throwing away problematic data, FASTR **replaces it with reasonable estimates** — like replacing a faulty meter reading with the average of surrounding months.

**Extreme values →** Replaced by the average of the 6 months around them
**Missing months →** Filled in with the facility's historical trend

FASTR produces **4 versions** of the data for comparison:

| Version | What it contains |
|---------|-----------------|
| Raw data | No modifications |
| Outliers corrected | Extreme spikes smoothed |
| Completeness adjusted | Missing months filled |
| Both adjustments | Spikes smoothed + missing months filled |

You can compare results across all 4 versions. If your conclusions change, that's a signal that data quality deserves attention.
