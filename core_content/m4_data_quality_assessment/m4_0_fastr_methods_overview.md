---
marp: true
theme: fastr
paginate: true
---

## How FASTR analyzes your data

FASTR runs **4 modules in order**. Each one sets the stage for the next:

| | Module | What it does | Why |
|---|--------|-------------|-----|
| 1️⃣ | **Check quality** | Spots data entry errors, missing reports, and inconsistencies | You can't analyze unreliable data |
| 2️⃣ | **Fix problems** | Replaces extreme values and fills in missing months | Clean data for reliable results |
| 3️⃣ | **Analyze services** | Compares observed volumes to what was expected to detect disruptions | Know where and when services changed |
| 4️⃣ | **Estimate coverage** | Calculates % of population covered from reported data | Move from raw numbers to indicators that guide action |

You will run all 4 modules on the platform during this workshop.
