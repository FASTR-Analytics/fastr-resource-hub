---
marp: true
theme: fastr
paginate: true
---

## Using demographic relationships to estimate denominators

Once you have one entry point — for example, the number of pregnancies from ANC1 — you can chain demographic ratios to work out the target population for every other service. Each arrow in the cascade is a ratio drawn from a national source (DHS, census, vital statistics):

- Pregnancies → live births uses fetal and early-loss rates
- Live births → surviving infants uses neonatal and infant mortality
- Surviving infants → age-eligible cohorts uses age-specific survival

Combine the chain and FASTR can back out the denominator for any service from any single input.

<!--
PRESENTER NOTES:
- Frame this as "one entry point, many denominators" — that's the value of the cascade
- The ratios come from country-specific sources; FASTR doesn't invent them
- The cascade on the next slide is the visual reference; this slide is the why
- Common question: which year of ratios? Use the most recent DHS / vital stats per country
-->
