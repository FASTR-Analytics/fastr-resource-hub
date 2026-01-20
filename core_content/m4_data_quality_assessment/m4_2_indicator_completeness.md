---
marp: true
theme: fastr
paginate: true
---

## Indicator completeness

<div style="display: flex; gap: 1.5em; align-items: flex-start;">
<div style="flex: 1;">

Indicator completeness measures the extent to which facilities that are supposed to report data on the selected core indicators are in fact doing so.

Higher completeness improves reliability of the data, especially when completeness is stable over time.

This is different from overall reporting completeness in that it looks at completeness of specific data elements and not only at the receipt of the monthly reporting form.

</div>
<div style="flex: 2;">

![Completeness Illustration](../../resources/diagrams/completeness_illustration.svg)

</div>
</div>

---

## Definition of indicator completeness

For the FASTR analysis, completeness is defined as:

**The percentage of reporting facilities each month out of the total number of facilities expected to report.**

- A facility is deemed to be "reporting" if there is a non-missing, non-zero value recorded for the indicator and month
- A facility is expected to report if it has reported any volume for that indicator anytime within a year
- Facilities that do not report for six or more consecutive months at the beginning or end of their reporting period are classified as **inactive** rather than incomplete. This prevents penalizing facilities that have not yet begun reporting or have permanently ceased operations

---

## Notes on completeness

- A high level of completeness does not necessarily indicate that the HMIS is representative of all service delivery in the country as some services may not be delivered in facilities, or some facilities may not report

- For countries where the DHIS2 system does not store 0's, indicator completeness may be underestimated if there are many low-volume facilities for a given indicator


---

## Completeness: Percent of monthly values that are complete

<p style="font-size: 0.9em; margin-bottom: 0.5rem;">For a given indicator in a given time period, the percent of monthly values that are complete:</p>

<p style="font-size: 0.9em;"><strong>% complete = # monthly values that are complete / total N of monthly values</strong></p>

![Indicator Completeness h:340](../../resources/default_outputs/Default_2._Proportion_of_completed_records.png)
