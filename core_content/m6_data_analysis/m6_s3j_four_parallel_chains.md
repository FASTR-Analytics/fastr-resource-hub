---
marp: true
theme: fastr
paginate: true
---

## Four parallel chains, best fit wins

ANC1 is not the only entry point. FASTR runs the same back-calculation from **four different services**:

- **ANC1** → estimates pregnancies
- **Skilled birth attendance** → estimates deliveries
- **BCG** → estimates live births
- **Penta1** → estimates DPT-eligible infants

Each entry point produces a complete cascade. FASTR then compares all four against UN World Population Prospects and **keeps the chain whose median ratio is closest to 1.0**. That selected chain is then applied uniformly to every indicator, so coverage estimates across the country are internally consistent.

<!--
PRESENTER NOTES:
- ANC1 alone could be biased if the survey ANC1 coverage value is off — that's why FASTR runs 4 in parallel
- UN WPP gives an independent national-level benchmark for the chain selection
- Selection is automatic, but participants can inspect and override in the platform
-->
