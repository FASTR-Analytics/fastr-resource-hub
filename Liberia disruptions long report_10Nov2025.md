# Liberia Service Utilization Analysis

**Summary Report: Q3 2025**

Analysis generated in November 2025

---

## Objectives and content in the report

The objective of this report is to provide a timely snapshot of health sector performance by assessing key RMNCAH+N service utilization metrics and HMIS data quality.

It aims to identify trends in service coverage, detect disruptions or surpluses in service delivery, and flag potential data quality issues to support evidence-based decision-making and prompt action to improve health outcomes.

### Table of contents

1. Data Quality Assessment
2. Service Utilization Assessment
3. Service Coverage Estimates

---

## Methodology

### Overview of the Data Quality Assessment methodology

- Identifies key data quality issues by assessing indicator completeness, detecting extreme outliers, and evaluating consistency between related indicators — using monthly, facility-level HMIS data.
- Applies targeted adjustments to flagged data points by replacing outliers and imputing missing values using a centered 12-month rolling average; fallback facility-level averages are used when insufficient history exists.
- Enables sensitivity analysis by producing results under four scenarios (no adjustment, outlier-only, completeness-only, and combined), with certain indicators that don't meet inclusion criteria excluded from adjustment. For this analysis, adjustment is for both outliers and completeness. Mortality indicators are excluded from adjustment.

### Overview of the Service Utilization Assessment methodology

- Service utilization trend analysis, which identifies the percentage change in service use for each quarter of data compared to the previous quarter.
- Disruptions and surplus in service delivery utilization analysis, which helps to identify meaningful positive or negative changes in service use outside of what we would expect given seasonal trends and historical trends.

### Overview of the Service Coverage Estimation methodology

- Coverage estimation analysis uses routine data to estimate trends in service coverage at national and sub-national levels. This occurs by integrating adjusted health service volume data, population projections, and survey data (MICS/DHS). Coverage estimates are calculated for key health indicators using multiple denominator sources, and the optimal denominator is selected by minimizing the error relative to the most recent survey data.

More details on the methodology and data quality adjustment approaches are found in the Annex. All R code and source documentation is also publicly available on GitHub (https://github.com/FASTR-Analytics).

---

## Methodology: Indicator selection

Indicators for this analysis were selected considering nationally prioritized indicators.

### Indicators selected include:

**Family planning:**

- Adolescents counseled for family planning, initiated on modern contraceptive method, and modern contraceptive users (new and continuing)
- Family planning clients counseled, initiated on modern contraceptive method, and modern contraceptive users (new and continuing)

**Maternal and newborn:**

- ANC 1st visit
- ANC 4th visit
- Institutional delivery by skilled birth attendants
- Caesarean section deliveries
- PNC visit within 24 or 48 hrs after delivery

**General:**

- OPD new cases >5
- OPD new cases <5

**Child health:**

- Penta 1 given
- Penta 3 given
- BCG given
- Children <1 fully immunized
- Diarrhea cases identified
- Pneumonia cases identified
- Pneumonia cases treated

**Infectious disease:**

- Malaria RDT positive
- Malaria treated less than 24 hours

**Mortality:**

- Maternal deaths
- Neonatal deaths

---

# Section 1: Data Quality Assessment

Data quality assessments — focused on completeness, consistency, and outliers — inform adjustments applied to routine data to improve reliability of the analyses presented.

---

## Reporting completeness

**Indicator Completeness** — Percentage of facility-months with complete data, Oct 2024 to Sep 2025

Most indicators achieve >95% completeness at the national level, indicating that facilities are consistently submitting monthly data across all indicators.

Most counties report near-complete data across indicators, with only minimal gaps observed.

Grand Gedeh, Margibi, Montserrado, and River Gee show some gaps in completeness, pointing to areas for targeted improvement.

| County | ANC 1 | ANC 4 | Inst. deliveries | BCG | Penta 1 | Penta 3 | C-section | Diarrhea | Adol. FP counseled | Adol. FP initiated | Adol. modern contraceptive | FP clients counseled | FP initiated | Modern contraceptive | Children <1 immunized | Malaria RDT+ | Malaria treated <24h | Maternal deaths | Neonatal deaths | OPD >5 | OPD <5 | PNC 24/48h | Pneumonia identified | Pneumonia treated |
|--------|-------|-------|------------------|-----|---------|---------|-----------|----------|--------------------|--------------------|---------------------------|---------------------|-------------|---------------------|----------------------|-------------|---------------------|-----------------|-----------------|--------|--------|-----------|---------------------|-------------------|
| Bomi | 100% | 100% | 100% | 100% | 100% | 99% | 100% | 100% | 100% | 99% | 99% | 100% | 100% | 99% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| Bong | 100% | 100% | 100% | 100% | 99% | 99% | 100% | 99% | 100% | 100% | 100% | 100% | 100% | 99% | 99% | 99% | 99% | 99% | 100% | 99% | 100% | 99% | 99% | 99% |
| Gbarpolu | 100% | 100% | 100% | 100% | 100% | 99% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 99% | 100% | 99% | 94% | 94% | 100% | 100% | 100% | 100% | 100% | 100% |
| Grand Bassa | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 98% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 98% | 98% | 98% | 98% | 100% | 100% | 100% | 98% | 98% |
| Grand Cape Mount | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 99% | 100% | 100% | 100% | 100% | 100% | 100% | 99% | 98% | 98% | 98% | 99% | 99% | 100% | 99% | 99% | 99% |
| Grand Gedeh | 100% | 100% | 100% | 100% | 99% | 100% | 100% | 97% | 99% | 100% | 100% | 99% | 100% | 100% | 100% | 97% | 97% | 88% | 84% | 99% | 99% | 98% | 97% | 97% |
| Grand Kru | 99% | 99% | 100% | 99% | 99% | 99% | 100% | 100% | 99% | 99% | 99% | 99% | 99% | 99% | 100% | 100% | 100% | 99% | 99% | 99% | 99% | 100% | 100% | 100% |
| Lofa | 99% | 99% | 99% | 100% | 99% | 99% | 98% | 97% | 100% | 98% | 98% | 100% | 99% | 99% | 100% | 97% | 97% | 97% | 97% | 99% | 99% | 97% | 97% | 97% |
| Margibi | 96% | 96% | 95% | 94% | 94% | 94% | 95% | 99% | 93% | 92% | 92% | 93% | 91% | 91% | 94% | 99% | 99% | 98% | 98% | 90% | 88% | 95% | 99% | 99% |
| Maryland | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| Montserrado | 89% | 85% | 85% | 91% | 91% | 91% | 78% | 87% | 77% | 72% | 74% | 76% | 72% | 72% | 91% | 91% | 91% | 83% | 83% | 94% | 92% | 76% | 88% | 87% |
| Nimba | 100% | 100% | 100% | 99% | 99% | 99% | 99% | 98% | 100% | 97% | 97% | 100% | 98% | 98% | 99% | 98% | 98% | 98% | 98% | 100% | 99% | 100% | 98% | 98% |
| River Gee | 98% | 98% | 98% | 100% | 100% | 100% | 98% | 82% | 98% | 98% | 98% | 98% | 98% | 98% | 100% | 82% | 82% | 82% | 82% | 98% | 98% | 98% | 82% | 82% |
| Rivercess | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 98% | 99% | 100% | 100% | 99% | 100% | 100% | 100% | 98% | 98% | 99% | 99% | 100% | 100% | 100% | 98% | 98% |
| Sinoe | 100% | 100% | 100% | 100% | 100% | 99% | 100% | 100% | 99% | 99% | 99% | 100% | 99% | 99% | 100% | 100% | 99% | 99% | 99% | 100% | 100% | 100% | 100% | 100% |
| **National** | **96%** | **95%** | **95%** | **97%** | **97%** | **97%** | **94%** | **97%** | **94%** | **93%** | **93%** | **94%** | **93%** | **93%** | **97%** | **97%** | **97%** | **96%** | **96%** | **97%** | **96%** | **93%** | **97%** | **97%** |

Legend: Green = 90% or above | Yellow = 80% to 89% | Red = Below 80%

Higher completeness improves the reliability of the data, especially when completeness is stable over time. Completeness is defined as the percentage of reporting facilities each month out of the total number of facilities expected to report. A facility is expected to report if it has reported any volume for each indicator anytime within a year. A high completeness does not indicate that the HMIS is representative of all service delivery in the country, as some services may not be delivered in facilities, or some facilities may not report.

---

## Outliers

**Outliers** — Percentage of facility-months that are outliers, Oct 2024 to Sep 2025

On average, fewer than 1% of facility-months across counties are flagged as outliers, showing that unusually high values are very uncommon in Liberia's HMIS data.

Most indicators and counties show <1% outliers, with isolated deviations in indicators related to family planning (e.g., adolescents counselled for family planning, family planning clients counseled, clients initiated on modern contraceptive method, and modern contraceptive users).

Some counties (i.e., Bomi, Bong, Grand Bassa, Lofa, Nimba, Rivercess, and Sinoe) show a pattern of outliers for family planning, with 2 or more indicators reporting outside expected ranges.

Outliers are reports which are suspiciously high compared to the usual volume reported by the facility in other months. Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator. Outliers are defined observations which are greater than 10 times the median absolute deviation (MAD) from the monthly median value for the indicator in each time period, OR a value for which the proportional contribution in volume for a facility, indicator, and time period is greater than 80%. Outliers are only identified for indicators where the volume is greater than or equal to the median, the volume is not missing, and the average volume is greater than 100.

---

## Internal consistency

**Internal consistency** — Percentage of sub-national areas meeting consistency benchmarks, Oct 2024 to Sep 2025

ANC1 vs ANC4 is mostly consistent, though a few counties (Grand Gedeh, Rivercess, and Sinoe) fall below 90%, suggesting misreporting in one of the indicators.

Delivery vs BCG is weak in all counties, likely influenced by ~19% of births at home; home-born infants later vaccinated can make BCG counts exceed deliveries.

Penta1 vs Penta3 is variable, with some counties >90% but others near 60%, pointing to gaps in recording successive doses.

| County | ANC1 is larger than ANC4 | Delivery is approximately equal to BCG | Penta 1 is larger than Penta 3 |
|--------|--------------------------|----------------------------------------|-------------------------------|
| Bomi | 96% | 75% | 94% |
| Bong | 100% | 42% | 91% |
| Gbarpolu | 93% | 80% | 82% |
| Grand Bassa | 97% | 26% | 92% |
| Grand Cape Mount | 100% | 40% | 80% |
| Grand Gedeh | 86% | 75% | 79% |
| Grand Kru | 100% | 25% | 78% |
| Lofa | 100% | 78% | 92% |
| Margibi | 100% | 21% | 77% |
| Maryland | 90% | 78% | 78% |
| Montserrado | 100% | 4% | 82% |
| Nimba | 97% | 70% | 91% |
| River Gee | 96% | 24% | 60% |
| Rivercess | 82% | 56% | 58% |
| Sinoe | 78% | 56% | 73% |
| **National** | **94%** | **50%** | **81%** |

Legend: Green = 90% or above | Yellow = 80% to 89% | Red = Below 80%

Internal consistency assesses the plausibility of reported data based on related indicators. Consistency metrics are approximate — depending on timing and seasonality, indicator definitions, and the nature of service delivery and reporting, values may be expected to sit outside plausible ranges. Indicators which are similar are expected to have roughly the same volume over the year (within a 30% margin). The data in this analysis is adjusted for outliers.

---

## Trends in data quality

### Overall DQA score

Percentage of facility-months with adequate data quality over time

Nationally, average overall scores remain modest (78–83%), showing that only a limited share of facility-months meet all data quality criteria at the same time.

Performance varies widely across counties: some (e.g., Bong, Grand Bassa, and Margibi) regularly exceed 90%, while others (e.g., River Gee, Rivercess, Sinoe) often remain below 70%.

Improvements are visible in several counties from 2024 to 2025 (e.g., Bomi, Bong, Grand Cape Mount, and Montserrado), but persistent gaps remain.

| County | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 |
|--------|------|------|------|------|------|------|------|------|
| Bomi | 67% | 82% | 83% | 63% | 82% | 91% | 83% | 93% |
| Bong | 82% | 89% | 97% | 95% | 94% | 90% | 86% | 95% |
| Gbarpolu | 73% | 83% | 75% | 86% | 74% | 73% | 91% | 75% |
| Grand Bassa | 84% | 86% | 95% | 89% | 94% | 90% | 93% | 90% |
| Grand Cape Mount | 94% | 80% | 80% | 71% | 54% | 67% | 75% | 82% |
| Grand Gedeh | 62% | 76% | 73% | 66% | 80% | 75% | 73% | 74% |
| Grand Kru | 79% | 79% | 84% | 87% | 71% | 61% | 75% | 75% |
| Lofa | 87% | 88% | 96% | 80% | 86% | 96% | 95% | 92% |
| Margibi | 94% | 95% | 92% | 86% | 82% | 80% | 76% | 79% |
| Maryland | 58% | 61% | 86% | 70% | 79% | 75% | 78% | 68% |
| Montserrado | 84% | 85% | 74% | 78% | 83% | 91% | 82% | 88% |
| Nimba | 75% | 77% | 83% | 79% | 80% | 81% | 91% | 90% |
| River Gee | 59% | 56% | 63% | 56% | 50% | 50% | 43% | 60% |
| Rivercess | 66% | 67% | 68% | 77% | 65% | 59% | 67% | 45% |
| Sinoe | 61% | 68% | 69% | 63% | 71% | 67% | 65% | 58% |
| **National** | **79%** | **81%** | **81%** | **78%** | **80%** | **83%** | **81%** | **83%** |

Legend: Green = 80% or above | Yellow = 70% to 79% | Red = Below 70%

Adequate data quality is defined as: 1) No missing data or outliers for OPD, Penta1, and ANC1, where available 2) Consistent reporting between Penta1/Penta3 and ANC1/ANC4.

### Mean DQA score

Average data quality score across facility-months

Nationally, mean scores are high (89–92%), showing that on average, Liberia's HMIS data is close to the desired quality standard.

Most counties maintained strong performance from 2024 to 2025. Margibi surpassed 90%, River Gee improved from 83% to 88%, while Rivercess declined from 92% to 86%, indicating some localized variation in progress.

Although many facility-months don't meet all criteria, they are close on average — suggesting that small improvements in reporting practices could bring most facilities above the threshold.

| County | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 |
|--------|------|------|------|------|------|------|------|------|
| Bomi | 92% | 95% | 95% | 90% | 95% | 97% | 95% | 98% |
| Bong | 94% | 96% | 98% | 98% | 97% | 96% | 96% | 99% |
| Gbarpolu | 93% | 95% | 93% | 95% | 93% | 93% | 98% | 93% |
| Grand Bassa | 95% | 96% | 97% | 96% | 98% | 97% | 98% | 98% |
| Grand Cape Mount | 98% | 95% | 95% | 92% | 88% | 92% | 94% | 95% |
| Grand Gedeh | 90% | 94% | 92% | 90% | 94% | 92% | 93% | 93% |
| Grand Kru | 95% | 95% | 95% | 94% | 91% | 87% | 93% | 93% |
| Lofa | 96% | 97% | 99% | 95% | 96% | 99% | 98% | 97% |
| Margibi | 95% | 91% | 88% | 88% | 89% | 90% | 89% | 93% |
| Maryland | 88% | 89% | 96% | 92% | 94% | 94% | 94% | 92% |
| Montserrado | 86% | 85% | 82% | 82% | 84% | 86% | 84% | 86% |
| Nimba | 94% | 94% | 95% | 94% | 94% | 95% | 98% | 97% |
| River Gee | 89% | 88% | 90% | 88% | 85% | 85% | 83% | 88% |
| Rivercess | 91% | 90% | 91% | 94% | 90% | 89% | 92% | 86% |
| Sinoe | 90% | 91% | 91% | 91% | 93% | 92% | 91% | 89% |
| **National** | **91%** | **91%** | **91%** | **89%** | **90%** | **91%** | **91%** | **92%** |

Legend: Green = 80% or above | Yellow = 70% to 79% | Red = Below 70%

Items included in the DQA score include: No missing data for 1) OPD, 2) Penta1, and 3) ANC1, where available; No outliers for 4) OPD, 5) Penta1, and 6) ANC1, where available; Consistent reporting between 7) Penta1/Penta3, 8) ANC1/ANC4, 9) BCG/Delivery, where available.

---

# Section 2: Service Utilization

Assessment of projected volumes based on historical trends to identify surpluses and disruptions in health services

---

## Adolescent family planning indicators

### Trends in adolescent family planning indicators

**Service utilization over time** — Jul 2023 to Sep 2025

Adolescents counselled for FP fluctuated between a low of ~37,300 in Jan 2024 to a high of ~45,100 in Sep 2024.

Adolescents initiated on modern contraceptive methods and adolescent modern contraceptive users followed similar trends, with the largest declines from Dec 2024 to Jan 2025, recovering by Sept 2025 to ~5,100 and ~9,400 users respectively.

On average, adolescent modern contraceptive methods users represent ~19% of those counselled, indicating that more should be done to understand barriers to uptake.

### Quarter-to-quarter change in service volume

Jul 2023 to Sep 2025

Adolescents counselled for FP was stable without any notable variations in from Q3 2023 to Q3 2025.

Adolescents initiated on modern contraceptive methods and adolescent modern contraceptive users had more frequent fluctuation, with >10% surges in Q2 2024 for both, an extra surge in Q3 2024 for initiations only, and growth again in Q3 2025; both declined in Q1 2024 and Q1 2025.

### Disruptions and surpluses — Comparing reported service use to expected trends, nationally

Adolescent family planning indicators show fluctuations, but overall trends remain flat through 2025, suggesting no major systemic change.

Trends for adolescent counseling for FP were volatile, with repeated declines below expected levels, including a disruption in September 2025 (~11% decline).

Adolescents initiated on modern contraceptive methods and adolescent modern contraceptive users had more frequent fluctuation and followed similar trends, with average disruptions of ~30% for initiations and ~31% for modern-method users, respectively, improving slightly in Jul–Sep 2025.

Adolescent family planning indicators reflect irregular patterns and instability, pointing to challenges in ensuring consistent adolescent reproductive health services.

---

## Family planning indicators (all clients)

### Trends in family planning indicators

**Service utilization over time** — Jul 2023 to Sep 2025

Clients counselled for FP fluctuated between a low of ~183,000 in Jan 2024 to a high of ~228,000 in Sep 2024, decreasing slightly to ~213,000 by the end of 2025.

Clients initiated on modern contraceptive methods and adolescent modern contraceptive users followed similar trends, peaking in Sep 2024, followed by declines from Nov-Feb and increasing over 2025 to reach 15,200 and 32,300 users respectively.

On average, modern-method users are ~13% of those counselled, indicating a persistent conversion gap from counselling to uptake.

### Quarter-to-quarter change in service volume

Jul 2023 to Sep 2025

Client counselled for FP was stable without any notable variations in from Q3 2023 to Q3 2025.

Clients initiated on modern contraceptive methods and adolescent modern contraceptive users had more frequent fluctuation, with >10% surges in Q2 and Q3 2024, and growth again in Q3 2025; both declined in Q1 2025.

### Disruptions and surpluses

Family planning service trends in 2025 were uneven, with sustained counseling shortfalls alongside improving initiation and continuation.

Family planning counseling showed persistent shortfalls through 2025, with a substantial disruption in September 2025 (~20% below expected), representing ~52,000 fewer clients counseled than anticipated.

FP initiations and FP new-and-continuing users exhibited more moderate fluctuations, with occasional deficits earlier in the period but shifting to small surpluses by mid-2025, including +14% and +12% surpluses in September 2025, respectively.

Overall FP service trends in 2025 indicate uneven recovery across indicators — with deep, sustained deficits in counseling volumes but improving performance for initiation and continuation, suggesting different bottlenecks across FP service components.

---

## Antenatal care

### Trends in antenatal care

**Service utilization over time** — Jul 2023 to Sep 2025

In 2025, ANC1 declined from ~23,600 to ~17,800 before rebounding to ~19,200 by September.

ANC4 rose steadily to ~12,000 in April 2025, suggesting improved retention, but then fell slightly to ~10,000 by September.

ANC1 is consistently double ANC4 indicating significant drop-out in follow-up care. Addressing gaps between first and fourth visits remains critical to ensure continuity of care and improved antenatal outcomes.

### Quarter-to-quarter change in service volume

Jul 2023 to Sep 2025

ANC1 experienced a drop of 13% in Q2 2024 followed by a rebound of 13% in Q4. ANC4 volumes were more stable through 2024, followed by large increases in service volume in Q1 and Q2 2025.

The gap between ANC1 and ANC4 services highlights the critical importance of retention strategies to ensure pregnant women complete all recommended visits.

### Disruptions and surpluses

Overall, ANC1 remained aligned with expected trends, while ANC4 showed surpluses in 2025.

Antenatal care first visit: In early 2025, volumes declined compared to late 2024 peaks, though no major disruptions were flagged.

Antenatal care fourth visit: ANC4 showed notable surpluses in 2025, peaking at +19.1% in Jul (~1,700 additional visits nationally) and remaining 13% above expected in Sep.

As 2025 begins, ANC1 shows an overall downward shift compared to late 2024 while ANC4 exceeds expectations, underscoring the need to closely monitor whether changes in the health sector affect early contact and continuity of care differently.

---

## Deliveries and postnatal care

### Trends in deliveries and postnatal care services

**Service utilization over time** — Jul 2023 to Sep 2025

Institutional deliveries and postnatal care visits followed similar upward trends through mid-2025, peaking at roughly 15,700 and 14,400 respectively in May before declining in subsequent months.

The difference between institutional deliveries and PNC visits within 24 or 48 hours after delivery indicates a potential gap in continuum of care.

Caesarean section volumes remained relatively low and stable throughout the period, with only minor fluctuations in early 2025.

### Quarter-to-quarter change in service volume

Jul 2023 to Sep 2025

Institutional deliveries rose steadily in Q2 2025 (+26%), before dropping in Q3 (-12%).

PNC visits within 24–48 hrs followed a similar pattern, with gains in Q2 2025 (+23%) followed by a drop in Q3 (-11%), though volumes remain slightly lower than deliveries.

The consistent 8–10% delivery–PNC gap indicates generally strong continuity of care with room for improvement.

Caesarean sections also peaked in Q2 2025 before tapering off.

### Disruptions and surpluses

Deliveries show surplus in 2025, while PNC recovered after earlier disruptions.

Deliveries: Stable through 2023–24, followed by a clear surplus in early 2025, with ~1,200 more facility deliveries than expected per month (+9.6%), followed by a moderate decline mid-2025, though still near expected levels by September.

PNC visits: Multiple disruptions below expected levels in 2023–24, followed by an increase and subsequent decrease in 2025 that brought volumes closer to expected trends.

Because PNC typically follows delivery trends, we would expect these indicators to move together, and in 2025, we see both indicators following the same trends, with institutional deliveries reaching a surplus.

---

## Child immunization

### Trends in child immunization

**Service utilization over time** — Jul 2023 to Sep 2025

Vaccine service volumes and children <1 fully immunized dipped through mid-2023–24, then rebounded in 2025.

In 2025, vaccination doses were ~17–24,000/month for BCG, 17–26,000 for Penta1, ~16–24,000 for Penta3, and ~16-19,000 children <1 fully immunized. In 2025, Penta3 remained ~8% below Penta1 on average, indicating follow-up remains a priority area.

Encouragingly, all vaccines show upwards trends overall in 2025, suggesting recent improvements in both uptake and retention, though further strengthening of follow-up strategies is still needed.

### Quarter-to-quarter change in service volume

Jul 2023 to Sep 2025

Penta1 and Penta3 are more volatile with sizable declines in Q4 2023 and Q1 2024.

In 2025, BCG, Penta1, and Penta3 all experienced increases in Q2, followed by further increases in Penta1 and Penta3 in Q3.

Children <1 fully immunized declined in Q4 2023, followed by a stable trend through 2024, and an increase of 12% in Q1 2025.

### Disruptions and surpluses

Despite widespread shortfalls in 2024, immunization services show signs of recovery by mid-2025, with some disruption in BCG.

BCG: Sustained disruptions through 2024, with volumes dipping below expectations with an average disruption of ~14% from May to December 2024, but steady recovery into mid-2025 with sustained periods of surplus followed by one small dip in August 2025 of 12%.

Penta1 & Penta3: Also showed shortfalls in 2024, followed by a clear rebound in 2025, with large surpluses from June to September (+16% and +15% on average), with signs of strengthening service continuity.

The parallel recovery across BCG, Penta1, and Penta3 suggests a real system-wide rebound in immunization, not just random fluctuation.

---

## Child illness cases

### Trends in child illness cases

**Service utilization over time** — Jul 2023 to Sep 2025

Diarrhea and pneumonia cases show episodic surges, rather than consistent seasonal patterns. The most pronounced spike occurred in March–April 2025.

At their peak, pneumonia cases reached ~17,200 and diarrhea ~15,200, well above typical monthly levels.

These spikes point to a sharp, short-term increase in disease burden, likely straining health facilities during early 2025.

### Quarter-to-quarter change in service volume

Jul 2023 to Sep 2025

Diarrhea cases spiked in Q4 2023 (+37%) and Q2 2025 (+57%), falling in Q3 2024 (-11%) and Q3 2025 (-20%).

Pneumonia cases jumped in Q4 2023 (+56%) and Q2 2025 (+86%), dropping from Q1 2024 to Q1 2025 and again in Q3 2025.

These shifts highlight that while overall volumes fluctuate gradually, short bursts of rapid change occur episodically and can temporarily increase service burden.

---

## Malaria

### Trends in malaria visits

**Service utilization over time** — Jul 2023 to Sep 2025

Malaria RDT+ cases show a clear seasonal trend, peaking above 37,000 in mid-2024 and again around 32,000 in early–mid 2025, with declines toward the end of each year.

Malaria treated within 24 hrs follows the same seasonal cycle but at lower levels, peaking near 27,000 in mid-2024 and 23,000 in 2025.

The gap between detection and timely treatment remains consistent, suggesting challenges in ensuring all cases receive prompt care, though surges in testing and treatment largely align with seasonal transmission peaks.

### Quarter-to-quarter change in service volume

Jul 2023 to Sep 2025

Both malaria indicators show frequent >10% quarter-to-quarter swings. RDT+ is highly variable, and treatment in less than 24 hrs follows a similar pattern at a lower level.

The largest percent increase was in Q2 2025 (RDT+ +55%, treatment +49%). Patterns are seasonal; cases typically peak in Q2.

Across the period, only ~72% of detected cases on average receive prompt treatment, highlighting a persistent shortfall in rapid malaria case management.

### Disruptions and surpluses

Malaria testing and treatment remain below expected levels in Sep 2025, with shortfalls persisting beyond seasonal patterns.

Malaria rapid diagnostic tests positive (RDT+): Volumes fell well below expectations in 2022–2023, moved into surplus Feb-Jun 2024, then into a sustained shortfall for Aug 2025-Mar 2025 (~3,500 fewer tests positive per month). There was a brief return to expected volumes in Apr-Jun 2025, before renewed shortfalls in Jul-Sep 2025 (~4,600 fewer cases than expected in Sep 2025).

Malaria treated in less than 24 hrs: The pattern mirrors RDT+ with shortfalls in 2022–2023, a surplus in spring 2024 (Mar–Jun), then deficits from late 2024 into early 2025 (roughly 10–15% below expected), a surplus in Apr–Jun 2025, and another dip in Jul–Sep 2025.

Even after adjusting for seasonality, malaria services show prolonged disruptions followed by volatile rebounds, with 2025 shortfalls signaling ongoing challenges in malaria service delivery.

---

## Outpatient visits

### Trends in outpatient visits

**Service utilization over time** — Jul 2023 to Sep 2025

OPD new cases >5 years show notable fluctuations but an upward trend overall, rising from a low of ~131,000 per month in late-2023 to a high of over 190,000 per month by mid-2025 before falling to ~170,000 by Sep.

OPD new cases <5 years remain comparatively stable, between 46,500–72,000 monthly, with smaller peaks in early and mid-2025.

The contrast suggests that while adult OPD demand is growing significantly, child OPD demand remains steady, pointing to different drivers of service utilization by age group.

### Quarter-to-quarter change in service volume

Jul 2023 to Sep 2025

OPD new cases >5 years trend upward overall, with >10% increases in Q2 2024 and Q2 2025.

OPD new cases <5 years experienced more volatility, with frequent >10% declines in Q4 2023, Q3 2024, and Q3 2025, and increases in Q2 2024 and Q2 2025.

This contrast suggests adult OPD demand is growing more steadily, while child OPD demand experiences more short-term shifts.

### Disruptions and surpluses

OPD visits rose above expected levels in 2025, with a stronger rebound among individuals aged 5+ than among children under five.

OPD new cases >5 years: After some disruptions in 2023, volumes were aligned with expected values in 2024, reaching a clear surplus in 2025 (~13% above expected).

OPD new cases <5 years: After modest disruptions in 2023, surpluses emerged in late 2024 and 2025 (~21% above expected).

OPD visits are stabilizing, with both age groups showing recovery by 2025.

---

## Mortality

### Trends in maternal and neonatal mortality

**Service utilization over time** — Jul 2023 to Sep 2025

Reported maternal death counts remained low (generally 0–5 per month) with a small uptick mid-2025, peaking in July and September.

Neonatal deaths were higher and more volatile. After a spike in July 2024, reports fell sharply toward early 2025, then rose again in June 2025 before easing by September.

*Service volume for mortality indicators is unadjusted.*

### Quarter-to-quarter change in service volume

Jul 2023 to Sep 2025

Quarterly trends for maternal deaths show fluctuation with increases in all quarters of 2025 (+25%, +40%, +21%).

Neonatal deaths also showed volatility with two periods of increases in Q1 and Q2 2025 (+16%, +39%), followed by a decrease in Q3 2025 (-46%).

Interpretations should be made cautiously given small numbers.

---

# Section 3: Service Coverage Estimates

Using routine data to estimate recent trends and subnational disparity in the coverage of selected health services. Not intended as official estimates.

---

## Estimating ANC1 service coverage

**Coverage estimates for Antenatal care 1** — 2007 to 2025

DISCLAIMER: These results use routine data to provide rigorous, but not official estimates. They should be interpreted considering any data quality or representation limitations, including data quality findings and any other country specific factors.

Analysis of ANC1 coverage trends suggests a decrease in the coverage of at least one antenatal care visit for pregnant women since the last official survey estimate in 2022.

Analysis of HMIS service utilization data alone suggests that ANC1 coverage rose to 130% in 2022 (likely reflecting denominator issues and possible over-reporting), but has since declined and is 73% in 2025.

Extrapolating HMIS trends to the most recent survey estimate, ANC1 coverage in 2025 is 40%, a decrease of 58 percentage points.

Sub-nationally in 2025, coverage ranged from 93% to 100% across counties.

---

## Estimating ANC4 service coverage

**Coverage estimates for Antenatal care 4** — 2007 to 2025

Analysis of ANC4 coverage trends suggests an increase in the coverage of at least four antenatal care visits for pregnant women since the last official survey estimate in 2022.

Analysis of HMIS service utilization data alone suggests that ANC4 coverage rose steadily since 2018 and is estimated at 65% in 2025.

Extrapolating HMIS trends to the most recent survey estimate, ANC4 coverage in 2025 is 89%, an increase of 5 percentage points compared to 2022.

Sub-nationally in 2025, coverage ranged from 47% to 87% across counties.

---

## Estimating institutional delivery service coverage

**Coverage estimates for Institutional deliveries by skilled birth attendants** — 2007 to 2025

Analysis of institutional delivery coverage trends suggests a small increase in the proportion of births attended by a skilled provider since the last official survey estimate in 2019.

Analysis of HMIS service utilization data alone suggests that institutional delivery coverage has remained relatively stable since 2020 and is estimated at 70% in 2025.

Extrapolating HMIS trends to the most recent survey estimate, institutional delivery coverage in 2025 is 84%, an increase of 1 percentage point compared to 2019.

Sub-nationally in 2025, coverage ranged from 54% to 99% across counties.

---

## Estimating postnatal care service coverage

**Coverage estimates for PNC visit within 24 or 48 hrs after delivery** — 2007 to 2025

Analysis of postnatal care coverage trends suggests a small increase in the proportion of women and newborns receiving postnatal care within 24 or 48 hours of birth since the last official survey estimate in 2020.

Analysis of HMIS service utilization data alone suggests that institutional delivery coverage has remained relatively stable since 2020 and is estimated at 78% in 2025.

Extrapolating HMIS trends to the most recent survey estimate, institutional delivery coverage in 2025 is 84%, an increase of 4 percentage point compared to 2020.

Sub-nationally in 2025, coverage ranged from 61% to 94% across counties.

---

## Estimating BCG service coverage

**Coverage estimates for BCG vaccine** — 2007 to 2025

Analysis of BCG vaccine coverage trends suggests that coverage has increased in the last few years.

Analysis of HMIS service utilization data alone suggests that BCG coverage dropped in 2022 but has since recovered, reaching an estimated 111% in 2025 (likely reflecting denominator issues and possible over-reporting).

Extrapolating HMIS trends to the most recent survey/modelled estimate, BCG coverage in 2025 is 90%, an increase of 8 percentage point compared to 2024.

Sub-nationally in 2025, coverage ranged from 86% to 135% across counties, likely reflecting denominator issues and possible over-reporting.

---

## Estimating Penta1 service coverage

**Coverage estimates for Pentavalent 1 doses given** — 2007 to 2025

Analysis of Penta1 vaccine coverage trends suggests that coverage has increased slightly in 2025.

Analysis of HMIS service utilization data alone suggests that Penta1 coverage increased from a low of 93% in 2020 to a high of 114% in 2024 (likely reflecting denominator issues and possible over-reporting).

Extrapolating HMIS trends to the most recent survey/modelled estimate, Penta1 coverage in 2025 is 100%, an increase of 9 percentage points compared to 2024.

Sub-nationally in 2025, coverage ranged from 71% to 99% across counties.

---

## Estimating Penta3 service coverage

**Coverage estimates for Pentavalent 3 doses given** — 2007 to 2025

Analysis of Penta3 vaccine coverage trends suggests that coverage has recovered since its low point in 2019 but has largely stalled in recent years.

Analysis of HMIS service utilization data alone suggests that Penta3 coverage increased from a low of 74% in 2021 to a high of 83% in 2024.

Extrapolating HMIS trends to the most recent survey/modelled estimate, Penta3 coverage in 2025 is 82%.

Sub-nationally in 2025, coverage ranged from 57% to 97% across counties.

---

# Annex 1: County profiles

*(Pages 45–75: 15 county profiles with 2 pages each showing service utilization trends and disruption/surplus analysis for all indicators at the county level. Counties covered: Bomi, Bong, Gbarpolu, Grand Bassa, Grand Cape Mount, Grand Gedeh, Grand Kru, Lofa, Margibi, Maryland, Montserrado, Nimba, River Gee, Rivercess, Sinoe)*

---

# Annex 2: Methodology

## Methodology: Data Quality Adjustment Approach

### What is data quality assessment?

The Data Quality Assessment (DQA) methodology applies three core assessments: detection of extreme outliers in reported service volumes, analysis of indicator-specific completeness, and consistency checks between related indicators. For each facility and month, the data are processed to identify anomalies, assess reporting continuity, and validate internal coherence across indicators. Outliers are flagged using Median Absolute Deviation (MAD) methods and proportional thresholds. Completeness is evaluated based on whether facilities report non-zero values across months for core indicators. Consistency is checked across linked indicators (e.g., ANC1 vs ANC4, Penta1 vs Penta3), using predefined ratio thresholds. The results are integrated into a composite DQA score that summarizes whether a facility's data meet all quality benchmarks.

### What is data quality adjustment?

Data quality adjustment is the process of correcting known issues in routine health data to improve the reliability of analyses. In the FASTR approach, adjustments are applied to HMIS data using automated methods that identify and correct outlier values and impute missing data based on patterns in historical reporting. This allows countries to make more robust use of the data they already have, even when reporting is imperfect.

### Why adjust for data quality?

Routine health data, such as those captured in DHIS2, are an essential resource for monitoring and improving primary health care systems. However, data quality issues — like outliers, incomplete reporting, and inconsistencies between related indicators — can distort analyses and misinform decision-making.

The FASTR approach includes built-in statistical methods to identify and adjust for these issues, producing more robust and actionable results. While not all data quality challenges can be fully resolved, targeted adjustments improve the reliability of the data and help ensure it can still inform decisions. Rather than treating poor data quality as a barrier, FASTR transforms it into an opportunity for feedback and improvement, enabling countries to use the data they have to make timely, evidence-based decisions.

### How was adjustment done?

The Data Quality Adjustment module uses HMIS data together with the outlier and completeness flags generated by the Data Quality Assessment module, which identify where service volumes are unusually high or missing. Outlier values are replaced with a centered 12-month facility-level rolling average based on valid (non-flagged) data. Missing values due to incomplete reporting are imputed using the same method. If there is not enough valid historical data, a fallback average at the facility level is used instead. Adjustments are applied under four scenarios - no adjustment, outlier-only, completeness-only, and both combined - to enable sensitivity analysis. Indicators which don't meet minimum volume thresholds are excluded from adjustment.

For this analysis, adjustment is for outliers and completeness.

---

## Methodology: How data quality adjustment affects results

*(Pages 78–81: Deviance tables showing percent change in volume due to outlier adjustment and completeness adjustment by county and indicator, plus bar charts showing change in volume due to data quality adjustments for all indicators from Jan 2018 to Sep 2025 under four scenarios: both outlier and completeness adjustment, outlier adjustment only, completeness adjustment only, and number of services reported.)*

---

## Strengths and limitations of this analysis

Analysis of routine health management information systems data (HMIS) and the methodological choices contained in this report provide strengths and limitations which are important to consider in the interpretation of the results.

### Strengths

- Leverages routinely collected HMIS data, enabling timely and low-cost monitoring
- Includes rigorous data quality assessment and adjustment to improve reliability of estimates
- Enables subnational analysis for granular insights
- Supports policy-relevant questions through tailored indicator selection and flexible stratification
- Accounts for seasonality and historical trends using statistical methods not available in DHIS2
- Complements existing DHIS2 tools and strengthens data use through feedback loops

### Limitations

- Cannot correct for all types of data quality issues (e.g., systematic underreporting, denominator inaccuracies)
- Does not account for facilities that never report, which may bias results in areas with large reporting gaps
- Low-volume indicators are more sensitive to anomalies and may not be adjusted
- Requires consistent indicator definitions and stable reporting systems over time for trend analysis

---

**FASTR initiative:** https://data.gffportal.org/key-theme/FASTR
