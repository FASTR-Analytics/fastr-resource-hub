---
marp: true
theme: fastr
paginate: true
---

## Question 3: Do related numbers match up?

---

## Consistency: Do related services make sense together?

**What we're checking:**
Health services are related - certain patterns are expected.

**Example 1 - ANC visits:**
- More women should get their **1st** ANC visit (ANC1)
- Fewer should complete all **4** visits (ANC4)
- We expect: ANC1 >= ANC4

**Example 2 - Vaccinations:**
- More babies should get their **1st** Penta dose (Penta1)
- Fewer should complete all **3** doses (Penta3)
- We expect: Penta1 >= Penta3

**If these relationships are backwards, something's wrong with the data.**

---

## Why check consistency at district level?

**Patients move between facilities:**
- Woman might get ANC1 at Health Center A
- But deliver at District Hospital B
- If we only look at each facility separately, numbers might not match

**Solution:** Check consistency at district level
- Add up all ANC1 visits in the district
- Add up all ANC4 visits in the district
- Compare the totals

This accounts for patients visiting different facilities for different services.

---

## Consistency example

<div style="display: flex; gap: 1em; align-items: center;">
<div style="flex: 1; font-size: 0.75em;">

**This passes the consistency check:**
- More women started ANC (5,200) than completed 4 visits (4,100)
- This is logical - not everyone completes all visits

**If it was reversed** (ANC4 > ANC1), we'd know there's a data quality problem.

</div>
<div style="flex: 2;">

![Consistency Illustration](../../resources/diagrams/consistency_illustration.svg)

</div>
</div>

---

## Consistency: FASTR output

![Internal Consistency](../../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)
