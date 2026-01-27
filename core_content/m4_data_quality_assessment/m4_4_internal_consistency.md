---
marp: true
theme: fastr
paginate: true
---

## Consistency between related indicators

Program indicators with a predictable relationship are examined to determine whether the expected relationship exists between them. In other words, this process examines whether the observed relationship between the indicators, as shown in the reported data, is that which is expected.

---

## Indicator pairs assessed

<div class="columns">
<div>

| Indicator pair | Expected relationship |
|----------------|----------------------|
| ANC1 / ANC4 | Ratio should be ≥ 0.95 |
| Penta1 / Penta3 | Ratio should be ≥ 0.95 |
| BCG / Facility delivery | Within 30% (≥0.7 and ≤1.3) |

These pairs have expected relationships. We expect ANC1 > ANC4 since not all women complete four visits.

BCG is a birth dose vaccine so we expect similar numbers to facility deliveries, with a 30% tolerance for variability.

</div>
<div>

![Consistency illustration h:280](../../resources/diagrams/consistency_illustration.svg)

</div>
</div>

---

## Why assess consistency at district level?

<div style="display: flex; gap: 1.5em; align-items: flex-start;">
<div style="flex: 1;">

Patients often access different services at different facilities within a district:

- A woman may attend **ANC1** at a nearby health post, but travel to a health centre for **ANC4**
- A child may receive **Penta1** at a local clinic, but complete **Penta3** at a district hospital

Checking consistency at the facility level would miss these patterns. Aggregating to district level captures the complete picture of service utilization within a geographic area.

</div>
<div style="flex: 2;">

![District consistency](../../resources/diagrams/district_consistency.svg)

</div>
</div>

---

## Internal consistency: FASTR output

**% meeting consistency criteria** = (number of areas where indicator ratio meets threshold) / (total number of areas) × 100

![Internal Consistency h:380](../../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

<!--
PRESENTER NOTES:
- Consistency checks logical relationships: ANC1 should always ≥ ANC4 (can't have 4th visit without 1st)
- We assess at DISTRICT level because patients move between facilities within a district
- Example: woman has ANC1 at health post, ANC4 at district hospital - still consistent at district level
- BCG vs deliveries allows 30% tolerance because not all births happen in facilities
- Ask: In your context, do patients commonly seek different services at different facilities?
-->
