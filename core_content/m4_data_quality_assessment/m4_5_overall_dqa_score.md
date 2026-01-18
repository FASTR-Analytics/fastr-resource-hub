---
marp: true
theme: fastr
paginate: true
---

## Data quality summary score

A composite measure of data quality provides an overall view of how well a dataset meets quality standards.

By integrating multiple dimensions of data quality into a single score, it simplifies the interpretation of detailed information from several measures. This allows health systems to quickly assess the reliability of data, making it easier to identify trends and issues at a glance.

---

## Definition of adequate data quality

For the FASTR analysis, we defined adequate data quality as:

- No missing indicator data for OPD, Penta1, and ANC1, where available, **AND**
- No outliers for OPD, Penta1, and ANC1, where available, **AND**
- Consistent reporting between Penta1/Penta3 and ANC1/ANC4

---

## Overall DQA score: Percent of monthly values meeting all criteria

For a given indicator in a given time period, the percent of monthly values meeting all DQA criteria:

**% adequate quality = # monthly values meeting all criteria / total N of monthly values**

![Overall DQA Score h:480](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

---

## Mean DQA score: Average of component scores

The mean DQA score averages two component scores:

**Mean DQA = (completeness & outlier score + consistency score) / 2**

![Mean DQA Score h:480](../../resources/default_outputs/Default_6._Mean_DQA_score.png)
