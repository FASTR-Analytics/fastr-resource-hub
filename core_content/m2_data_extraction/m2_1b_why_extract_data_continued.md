---
marp: true
theme: fastr
paginate: true
---

<!-- _class: columns-image-right -->

## Data format and granularity

![h:200 Data format wide](../../resources/screenshots/data_format_wide.png)

- Data should be downloaded for each **health indicator** (e.g. ANC1 visits, BCG vaccinations), at **facility level** (individual health centers), and **monthly** for the **period of interest**
- Data should be saved in long format — one row per observation (e.g. one row = one facility, one month, one indicator)
- Data should be saved as a `.csv` file (a simple spreadsheet format) — either a single file or multiple files that will be combined when uploading to the FASTR platform

<!--
PRESENTER NOTES:
- We want to use the most granular data we have access to in order to make more fine-tuned assessments for data quality and adjustments
- We also want to be able to look at trends over time, accounting for things like seasonality
- Using monthly facility-level data allows us to conduct the most robust analysis
-->
