---
marp: true
theme: fastr
paginate: true
---

## Service coverage estimates

The Coverage Estimates module (Module 4 in the FASTR analytics platform) estimates health service coverage by answering: **"What percentage of the target population received this health service?"**

**Three data sources integrated:**
1. Adjusted health service volumes from HMIS
2. Population projections from United Nations
3. Household survey data from MICS/DHS

---

### Two-part process

**Part 1: Denominator calculation**
- Calculate target populations using multiple methods (HMIS-based and population-based)
- Compare against survey benchmarks
- Automatically select best denominator for each indicator

**Part 2: Coverage estimation**
- Override automatic selections based on programmatic knowledge
- Project survey estimates forward using HMIS trends
- Generate final coverage estimates
