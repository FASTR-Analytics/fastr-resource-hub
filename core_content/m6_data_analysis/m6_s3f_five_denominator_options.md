---
marp: true
theme: fastr
paginate: true
---

## Five denominator options for FASTR analysis

FASTR builds the denominator from the data it does have. Four of the five options anchor on a routine HMIS service whose target population is known from surveys; the fifth uses UN demographic projections.

- **ANC1** → back-calculates pregnancies
- **Skilled birth attendance** → back-calculates deliveries
- **BCG immunization** → back-calculates live births *(national only)*
- **Penta1 immunization** → back-calculates DPT-eligible infants *(national only)*
- **UN World Population Prospects** → demographic projections of live births *(national only)*

Each option produces a complete denominator cascade for every other indicator. FASTR computes all five and selects the best fit — see the next slides.
