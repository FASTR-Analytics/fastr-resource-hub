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
