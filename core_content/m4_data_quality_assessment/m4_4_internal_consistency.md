---
marp: true
theme: fastr
paginate: true
---

## Assessing relationships between indicators

Related health services demonstrate predictable relationships that can be used to assess data quality. FASTR evaluates the following indicator pairs:

| Indicator pair | Expected relationship | Rationale |
|----------------|----------------------|-----------|
| ANC1 / ANC4 | ANC1 ≥ ANC4 | More women initiate antenatal care than complete four visits |
| Penta1 / Penta3 | Penta1 ≥ Penta3 | More children receive the first dose than complete the series |
| BCG / Deliveries | BCG ≈ Deliveries | BCG is administered at birth; counts should be similar |

Violations of these expected relationships indicate potential data quality issues requiring investigation.

---

## Why assess consistency at district level?

<div class="columns">
<div>

Patients often access different services at different facilities within a district:

- A woman may attend **ANC1** at a nearby health post, but travel to a health centre for **ANC4**
- A child may receive **Penta1** at a local clinic, but complete **Penta3** at a district hospital

Checking consistency at the facility level would miss these patterns. Aggregating to district level captures the complete picture of service utilization within a geographic area.

</div>
<div>

![District consistency](../../resources/diagrams/district_consistency.svg)

</div>
</div>

---

## Internal consistency: FASTR output

![Internal Consistency](../../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)
