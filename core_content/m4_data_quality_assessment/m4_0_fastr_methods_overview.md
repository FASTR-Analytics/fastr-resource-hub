---
marp: true
theme: fastr
paginate: true
---

## How FASTR analyzes your data

FASTR runs through **5 platform modules in order**. Each one sets the stage for the next:

| | Module | What it does | Why |
|---|--------|-------------|-----|
| 1️⃣ | **Check quality** (M1) | Spots data entry errors, missing reports, and inconsistencies | You can't analyze unreliable data |
| 2️⃣ | **Fix problems** (M2) | Replaces extreme values and fills in missing months | Clean data for reliable results |
| 3️⃣ | **Analyze services** (M3) | Compares observed volumes to what was expected to detect disruptions | Know where and when services changed |
| 4️⃣ | **Build the denominator** (M5) | Estimates the target population for each indicator | Coverage needs a denominator |
| 5️⃣ | **Estimate coverage** (M6) | Calculates % of population covered from reported data | Move from raw numbers to indicators that guide action |

You will work with each of these modules on the platform during this workshop.
