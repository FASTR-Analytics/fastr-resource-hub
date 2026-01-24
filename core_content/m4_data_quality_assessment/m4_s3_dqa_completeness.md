---
marp: true
theme: fastr
paginate: true
---

## Indicator completeness

Indicator completeness measures whether facilities that should be reporting data on specific indicators are actually doing so. This is different from overall reporting completeness - we're looking at specific data elements, not just whether the monthly form was submitted.

**Definition:** Percentage of facilities reporting each month out of facilities expected to report.
- A facility is "reporting" if there is a non-missing, non-zero value for the indicator that month
- A facility is "expected to report" if it has reported any volume for that indicator within the past year

Higher and stable completeness improves data reliability.

---

## Indicator completeness output

<div style="display: flex; gap: 1em;">
<div style="flex: 1.2;">

![Completeness output h:320](../../resources/default_outputs/Default_2._Proportion_of_completed_records.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**What you see:** Heatmap showing completeness by indicator and region over time.

**Formula:** Completeness % = (facilities reporting / facilities expected) × 100

**Interpretation:** Look for systematic gaps by region or indicator, declining trends, or seasonal patterns. Low completeness suggests reporting barriers needing attention.

</div>
</div>
