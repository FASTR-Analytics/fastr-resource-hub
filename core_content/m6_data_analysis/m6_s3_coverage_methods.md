---
marp: true
theme: fastr
paginate: true
---

## What is coverage?

In plain language, **coverage** tells you what share of the people who needed a service actually received it. It is a percentage: services delivered divided by the target population, times 100.

A high coverage means the system is reaching most of who it should. A low coverage means people who needed the service did not get it — either it was not available, not accessible, or not used.

---

## Coverage: the denominator problem

The numerator is easy — it's what facilities report in DHIS2. But the **denominator** (how many people needed the service) is not in DHIS2. Without it, you can count services delivered but you cannot say what share of the population that represents.

![Coverage equation h:280](../../resources/diagrams/coverage_equation.svg)

---

## Denominators by service type

The denominator is not one number — it is a different group for every service. ANC measures against pregnancies, BCG against live births, Penta against surviving infants.

<div style="font-size: 0.85em;">

| Service | Target population (denominator) |
|---|---|
| **ANC1, ANC4** | Pregnant women in the period |
| **Skilled delivery** | Pregnant women (expected deliveries) |
| **Postnatal care — mother** | Recent live births / postpartum women |
| **BCG (at birth)** | Live births |
| **PENTA1, PENTA3** | Surviving infants in the age-eligible cohort |
| **Measles 1 (9 months)** | Surviving infants aged 9–12 months |
| **PNC1 — newborn** | Live births |

</div>

---

## How FASTR deduces the denominator

FASTR works back up the chain to estimate the target population from what facilities already report.

**Example.** A survey says 80% of pregnant women receive ANC1. The HMIS reports 10,000 ANC1 visits. So there are roughly **10,000 ÷ 0.80 = 12,500 pregnancies** in that period.

From the pregnancy count, the demographic cascade gives deliveries, live births, and surviving infants — using country-specific rates for pregnancy losses, stillbirths, twins and infant mortality.

![The denominator calculation chain h:220](../../resources/diagrams/denominator_cascade_example.svg)
