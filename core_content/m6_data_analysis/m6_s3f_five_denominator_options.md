---
marp: true
theme: fastr
paginate: true
---

## Denominator options used by FASTR

FASTR builds **four candidate denominator chains** from HMIS service volumes, each anchored on a different service:

- **ANC1-derived chain** — anchored on first antenatal visits
- **Delivery-derived chain** — anchored on reported deliveries
- **BCG-derived chain** — anchored on BCG vaccinations (national level only)
- **Penta1-derived chain** — anchored on first Penta dose (national level only)

**UN World Population Prospects (UN WPP)** estimates are loaded alongside these chains. UN WPP is not a selectable denominator — it serves as the **reference anchor** used to compare the four chains and pre-select the one whose ratio to UN WPP is closest to 1.0.
