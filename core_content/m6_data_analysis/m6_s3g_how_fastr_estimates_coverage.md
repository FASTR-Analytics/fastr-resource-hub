---
marp: true
theme: fastr
paginate: true
---

## How FASTR estimates coverage

Putting the pieces together, FASTR estimates coverage in three steps:

1. **Build denominators multiple ways.** Back-calculate target populations from each routine HMIS entry point (ANC1, SBA, BCG, Penta1) by combining service volumes with survey coverage values. *Example: 10,000 ANC1 visits at a surveyed coverage of 80% imply ~12,500 pregnancies.* In parallel, derive denominators from UN demographic projections.

2. **Select the best chain.** Compute coverage with each denominator option and compare the median ratio of HMIS-derived to UN-projected denominators. The chain whose median ratio sits closest to 1.0 is kept and applied uniformly across all indicators.

3. **Project coverage forward.** Anchor to the last available survey value and apply year-over-year HMIS trends to extend coverage estimates into post-survey years.

> Surveys anchor the back-calculation; UN WPP arbitrates between chains; HMIS trends carry the estimate forward.
