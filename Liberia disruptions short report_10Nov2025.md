# Tracking Disruptions in Essential Services Using HMIS Data in Liberia

**Q3 2025**

Analysis generated in November 2025

---

## Tracking Disruptions in Essential Services Using HMIS Data

The FASTR approach uses routine HMIS data to monitor how service delivery shifts over time.

By comparing observed vs. expected service volumes — adjusted for seasonality and historical trends — we can identify disruptions or surpluses in key health services.

This analysis provides a timely, system-wide perspective, highlighting where and when service use deviates from expected patterns. Findings generate actionable evidence to guide rapid responses, helping sustain continuity of essential care during funding uncertainty or operational change.

---

## Methodology: Service Utilization Assessment

**Purpose:**
Track changes in health service use over time, identifying where services fall below or rise above expected patterns.

**How it works:**
- Uses routine HMIS data, cleaned for outliers and missing values.
- Builds an "expected" trend line for each service, adjusting for seasonality and historical trends in service utilization.
- Compares actual service volumes to expected levels.

**Measuring impact:**
- Flagged disruption periods are analyzed to estimate how much service volumes changed compared to what was expected.
- Results are shown at national and sub-national levels highlighting both system-wide and localized effects.

**How to interpret figures:**
- Red shaded areas = potential disruptions (service volumes lower than expected).
- Green shaded areas = potential surpluses (service volumes higher than expected).
- These are signals, not conclusions — they highlight when and where volumes deviate, but require further investigation into the underlying reasons ("why").

More details on the methodology and data quality adjustment approaches are found alongside the source code on GitHub (https://github.com/FASTR-Analytics).

---

## Methodology: Indicator selection

Indicators for the service utilization analysis were selected considering nationally prioritized indicators.

**Indicators selected include:**

**Family planning:**
- Adolescents counseled for family planning, initiated on modern contraceptive method, and modern contraceptive users (new and continuing)
- Family planning clients counseled, initiated on modern contraceptive method, and modern contraceptive users (new and continuing)

**Maternal and newborn:**
- ANC 1st visit
- ANC 4th visit
- Institutional delivery by skilled birth attendants
- Cesarean section deliveries
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

## Section 1: Service Utilization

Assessment of projected volumes based on historical trends to identify surpluses and disruptions in health services

---

## Adolescent family planning indicators show fluctuations, but overall trends remain flat through 2025, suggesting no major systemic change

**Comparing reported service use to expected trends, nationally**
Jul 2023 to Sep 2025

*Charts: Adolescents (10-19 yrs) counselled for family planning | Adolescents (10-19 yrs) initiated on modern contraceptive method | Adolescent (10-19 yrs) modern contraceptive users (new and continuing)*

Trends for adolescent counseling for FP were volatile, with repeated declines below expected levels, including a disruption in September 2025 (~11% decline).

Adolescents initiated on modern contraceptive methods and adolescent modern contraceptive users had more frequent fluctuation and followed similar trends, with average disruptions of ~30% for initiations and ~31% for modern-method users, respectively, improving slightly in Jul–Sep 2025.

Adolescent family planning indicators reflect irregular patterns and instability, pointing to challenges in ensuring consistent adolescent reproductive health services.

---

## Family planning service trends in 2025 were uneven, with sustained counseling shortfalls alongside improving initiation and continuation

**Comparing reported service use to expected trends, nationally**
Jul 2023 to Sep 2025

*Charts: Family planning clients counseled | Clients initiated on modern contraceptive method | Modern contraceptive users (new and continuing)*

Family planning counseling showed persistent shortfalls through 2025, with a substantial disruption in September 2025 (~20% below expected), representing ~52,000 fewer clients counseled than anticipated.

FP initiations and FP new-and-continuing users exhibited more moderate fluctuations, with occasional deficits earlier in the period but shifting to small surpluses by mid-2025, including +14% and +12% surpluses in September 2025, respectively.

Overall FP service trends in 2025 indicate uneven recovery across indicators — with deep, sustained deficits in counseling volumes but improving performance for initiation and continuation, suggesting different bottlenecks across FP service components.

---

## Overall, ANC1 remained aligned with expected trends, while ANC4 showed surpluses in 2025

**Comparing reported service use to expected trends, nationally**
Jul 2023 to Sep 2025

*Charts: Antenatal care 1 | Antenatal care 4*

Antenatal care first visit: In early 2025, volumes declined compared to late 2024 peaks, though no major disruptions were flagged.

Antenatal care fourth visit: ANC4 showed notable surpluses in 2025, peaking at +19.1% in Jul (~1,700 additional visits nationally) and remaining 13% above expected in Sep.

As 2025 begins, ANC1 shows an overall downward shift compared to late 2024 while ANC4 exceeds expectations, underscoring the need to closely monitor whether changes in the health sector affect early contact and continuity of care differently.

---

## Deliveries show surplus in 2025, while PNC recovered after earlier disruptions

**Comparing reported service use to expected trends, nationally**
Jul 2023 to Sep 2025

*Charts: Institutional deliveries by skilled birth attendants | PNC visit within 24 or 48 hrs after delivery*

Deliveries: Stable through 2023–24, followed by a clear surplus in early 2025, with ~1,200 more facility deliveries than expected per month (+9.6%), followed by a moderate decline mid-2025, though still near expected levels by September.

PNC visits: Multiple disruptions below expected levels in 2023–24, followed by an increase and subsequent decrease in 2025 that brought volumes closer to expected trends.

Because PNC typically follows delivery trends, we would expect these indicators to move together, and in 2025, we see both indicators following the same trends, with institutional deliveries reaching a surplus.

---

## Despite widespread shortfalls in 2024, immunization services show signs of recovery by mid-2025, with some disruption in BCG

**Comparing reported service use to expected trends, nationally**
Jul 2023 to Sep 2025

*Charts: BCG vaccine | Pentavalent 1 doses given | Pentavalent 3 doses given*

BCG: Sustained disruptions through 2024, with volumes dipping below expectations with an average disruption of ~14% from May to December 2024, but steady recovery into mid-2025 with sustained periods of surplus followed by one small dip in August 2025 of 12%.

Penta1 & Penta3: Also showed shortfalls in 2024, followed by a clear rebound in 2025, with large surpluses from June to September (+16% and +15% on average), with signs of strengthening service continuity.

The parallel recovery across BCG, Penta1, and Penta3 suggests a real system-wide rebound in immunization, not just random fluctuation.

---

## Malaria testing and treatment remain below expected levels in Sep 2025, with shortfalls persisting beyond seasonal patterns

**Comparing reported service use to expected trends, nationally**
Jul 2022 to Sep 2025

*Charts: Malaria RDT+ | Malaria treated in less than 24 hrs*

Malaria rapid diagnostic tests positive (RDT+): Volumes fell well below expectations in 2022–2023, moved into surplus Feb-Jun 2024, then into a sustained shortfall for Aug 2025-Mar 2025 (~3,500 fewer tests positive per month). There was a brief return to expected volumes in Apr-Jun 2025, before renewed shortfalls in Jul-Sep 2025 (~4,600 fewer cases than expected in Sep 2025).

Malaria treated in less than 24 hrs: The pattern mirrors RDT+ with shortfalls in 2022–2023, a surplus in spring 2024 (Mar–Jun), then deficits from late 2024 into early 2025 (roughly 10–15% below expected), a surplus in Apr-Jun 2025, and another dip in Jul–Sep 2025.

Even after adjusting for seasonality, malaria services show prolonged disruptions followed by volatile rebounds, with 2025 shortfalls signaling ongoing challenges in malaria service delivery.

---

## OPD visits rose above expected levels in 2025, with a stronger rebound among individuals aged 5+ than among children under five

**Comparing reported service use to expected trends, nationally**
Jul 2023 to Sep 2025

*Charts: OPD new cases > 5 years | OPD new cases < 5 years*

OPD new cases >5 years: After some disruptions in 2023, volumes were aligned with expected values in 2024, reaching a clear surplus in 2025 (~13% above expected).

OPD new cases <5 years: After modest disruptions in 2023, surpluses emerged in late 2024 and 2025 (~21% above expected).

OPD visits are stabilizing, with both age groups showing recovery by 2025.

---

## Annex 1: County service utilization disruptions

---

## Large county-level disparities in performance highlight the need to understand local drivers of both service gains and gaps

**Difference between the number of services observed and the number of services expected, by county and indicator**
Period: Apr 2025 to Sep 2025

| County | ANC 1 | ANC 4 | Inst. deliveries | BCG | Penta 1 | Penta 3 | Adol. modern contraceptive users | Malaria RDT+ | Malaria treated <24hrs | OPD >5 | OPD <5 | PNC |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Bomi | 14% | 23% | 14% | 4% | 0% | -3% | 145% | 9% | 3% | 23% | 25% | 2% |
| Bong | -5% | -9% | -6% | -4% | 9% | 6% | 43% | 17% | 4% | 41% | 59% | -12% |
| Gbarpolu | 0% | 2% | -7% | -9% | -13% | -11% | 290% | -37% | -31% | 14% | 26% | -13% |
| Grand Bassa | -5% | -1% | -4% | 3% | 15% | 11% | 52% | -8% | -30% | 23% | 30% | -9% |
| Grand Cape Mount | 8% | -12% | -5% | -1% | 7% | 1% | -13% | 46% | 50% | 28% | 18% | -9% |
| Grand Gedeh | -5% | -9% | -6% | -6% | 15% | 19% | -10% | -30% | -33% | 27% | 25% | -8% |
| Grand Kru | 27% | 23% | 34% | 27% | 25% | 22% | -3% | -1% | 35% | 12% | 11% | 23% |
| Lofa | -3% | -13% | -7% | -8% | -9% | -7% | 9% | 48% | 23% | 30% | 35% | -9% |
| Margibi | 22% | 21% | 13% | 30% | 43% | 47% | 31% | 23% | 29% | 27% | 38% | 1% |
| Maryland | 16% | 30% | 18% | 11% | 7% | 9% | -50% | -12% | -12% | 21% | 23% | 18% |
| Montserrado | 11% | 44% | 32% | 17% | 23% | 20% | -62% | -11% | -22% | 9% | 15% | 19% |
| Nimba | -3% | 1% | -8% | -14% | -6% | -8% | 39% | 11% | 2% | 24% | 59% | -13% |
| River Gee | -10% | -29% | -11% | 8% | 26% | 21% | 39% | 17% | 61% | 20% | 8% | -15% |
| Rivercess | 11% | 40% | 32% | 20% | 22% | 26% | -11% | -13% | -11% | 48% | 27% | 20% |
| Sinoe | 51% | 70% | 58% | 28% | 25% | 26% | -10% | 1% | -7% | 71% | 70% | 64% |

*Color coding: Green = More than 10% above | White = -10% to +10% | Red = More than 10% below*

Wide variation across counties: While some counties show large surpluses across several indicators (e.g., Maryland, Margibi, Sinoe), others exhibit consistent shortfalls (e.g., Gbarpolu, Grand Gedeh, River Gee), indicating uneven recovery and service performance.

Indicator-specific patterns differ by county: Counties that overperform on maternal and child health indicators (e.g., ANC, deliveries, immunization) are not always the same counties that overperform on outpatient care or malaria treatment — highlighting distinct service delivery dynamics at the subnational level.

Some counties show mixed performance within the same service area: For example, a county may exceed expectations on one immunization indicator yet fall below on another, suggesting potential bottlenecks in supply chains, reporting, or service readiness that vary locally.

---

## County Profiles

### Bomi County
**Comparing reported service use to expected trends, Bomi**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts: ANC 1, ANC 4, Institutional deliveries, BCG, Penta 1, Penta 3, Adolescents counselled for FP, Adolescents initiated on modern contraceptive method, Adolescent modern contraceptive users, FP clients counseled, Clients initiated on modern contraceptive method, Modern contraceptive users, Malaria RDT+, Malaria treated <24 hrs, OPD >5, OPD <5, PNC*

---

### Bong County
**Comparing reported service use to expected trends, Bong**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Gbarpolu County
**Comparing reported service use to expected trends, Gbarpolu**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Grand Bassa County
**Comparing reported service use to expected trends, Grand Bassa**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Grand Cape Mount County
**Comparing reported service use to expected trends, Grand Cape Mount**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Grand Gedeh County
**Comparing reported service use to expected trends, Grand Gedeh**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Grand Kru County
**Comparing reported service use to expected trends, Grand Kru**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Lofa County
**Comparing reported service use to expected trends, Lofa**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Margibi County
**Comparing reported service use to expected trends, Margibi**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Maryland County
**Comparing reported service use to expected trends, Maryland**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Montserrado County
**Comparing reported service use to expected trends, Montserrado**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Nimba County
**Comparing reported service use to expected trends, Nimba**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Rivercess County
**Comparing reported service use to expected trends, Rivercess**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### River Gee County
**Comparing reported service use to expected trends, River Gee**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

### Sinoe County
**Comparing reported service use to expected trends, Sinoe**
Jul 2023 to Sep 2025

*Grid of 17 disruption charts for all indicators*

---

## Annex 2: Trends in indicator reporting completeness

## Completeness is >95% for most indicators in 2025, strengthening confidence in disruption findings

**Summary of Completeness Trends (July 2023 – Sept 2025)**

Overall completeness is high: Most indicators remain above 90% throughout the period, showing reliable reporting across the HMIS.

Areas of weaker completeness: Family planning and PNC indicators show dips into the 80–89% range at times, particularly mid-2023 and mid-2024.

Improvement in 2025: Completeness is consistently strong across nearly all indicators (>95%), reducing concern about missing reports.

**Why Completeness Matters for the Disruptions Analysis**

Observed values: These are adjusted for outliers only, so they reflect the actual raw service volumes after removing implausible spikes.

Expected values: These are adjusted for both completeness and outliers. This means the model "fills in" where reporting gaps exist, building an expected trend line as if all facilities had reported consistently.

When completeness is high, observed and expected volumes are more comparable, and disruptions are more likely to reflect true service changes.

When completeness is low, expected values may be artificially higher than observed, creating apparent "disruptions" that actually reflect missing reports rather than real declines in service delivery.

**Indicator Completeness**
Percentage of facility-months with complete data, Jul 2023 to Sep 2025

| Month | ANC 1 | ANC 4 | Inst. del. | BCG | Penta 1 | Penta 3 | Adol. counselled FP | Adol. initiated modern contraceptive | Adol. modern contraceptive users | FP clients counseled | Clients initiated modern contraceptive | Modern contraceptive users | Malaria RDT+ | Malaria treated <24hrs | OPD >5 | OPD <5 | PNC |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **2023** | | | | | | | | | | | | | | | | | |
| Jul | 91% | 89% | 89% | 90% | 90% | 90% | 89% | 85% | 86% | 89% | 87% | 87% | 96% | 96% | 89% | 89% | 86% |
| Aug | 93% | 92% | 91% | 92% | 92% | 92% | 89% | 86% | 87% | 88% | 87% | 87% | 96% | 96% | 92% | 91% | 87% |
| Sep | 93% | 91% | 91% | 92% | 93% | 93% | 90% | 87% | 87% | 90% | 86% | 86% | 96% | 97% | 94% | 93% | 87% |
| Oct | 93% | 91% | 90% | 92% | 92% | 92% | 88% | 86% | 87% | 88% | 85% | 86% | 97% | 97% | 95% | 94% | 87% |
| Nov | 93% | 91% | 90% | 93% | 92% | 93% | 89% | 86% | 86% | 89% | 86% | 86% | 98% | 98% | 94% | 93% | 84% |
| Dec | 95% | 93% | 92% | 95% | 95% | 95% | 92% | 88% | 88% | 91% | 88% | 88% | 99% | 98% | 97% | 95% | 88% |
| **2024** | | | | | | | | | | | | | | | | | |
| Jan | 96% | 94% | 94% | 96% | 96% | 96% | 94% | 90% | 90% | 94% | 90% | 90% | 100% | 100% | 98% | 97% | 91% |
| Feb | 96% | 95% | 95% | 95% | 95% | 95% | 94% | 92% | 92% | 94% | 93% | 92% | 98% | 98% | 98% | 96% | 93% |
| Mar | 96% | 94% | 95% | 93% | 93% | 93% | 93% | 90% | 90% | 93% | 89% | 90% | 98% | 98% | 97% | 95% | 92% |
| Apr | 95% | 94% | 94% | 95% | 95% | 95% | 93% | 90% | 90% | 93% | 91% | 91% | 98% | 98% | 97% | 95% | 91% |
| May | 94% | 91% | 93% | 94% | 95% | 95% | 91% | 88% | 89% | 91% | 89% | 89% | 97% | 97% | 97% | 95% | 88% |
| Jun | 91% | 88% | 89% | 92% | 93% | 93% | 90% | 87% | 88% | 91% | 88% | 88% | 96% | 96% | 95% | 94% | 87% |
| Jul | 95% | 91% | 93% | 94% | 94% | 93% | 91% | 88% | 88% | 90% | 89% | 89% | 97% | 97% | 94% | 94% | 91% |
| Aug | 95% | 92% | 93% | 96% | 96% | 96% | 90% | 88% | 89% | 90% | 89% | 90% | 99% | 99% | 97% | 96% | 88% |
| Sep | 95% | 93% | 93% | 94% | 94% | 94% | 91% | 89% | 89% | 91% | 90% | 90% | 96% | 96% | 95% | 95% | 89% |
| Oct | 95% | 93% | 94% | 95% | 95% | 95% | 91% | 89% | 90% | 91% | 90% | 90% | 95% | 95% | 96% | 95% | 89% |
| Nov | 94% | 93% | 94% | 96% | 96% | 96% | 93% | 91% | 91% | 92% | 91% | 91% | 97% | 97% | 96% | 95% | 91% |
| Dec | 96% | 95% | 96% | 97% | 97% | 97% | 94% | 93% | 93% | 94% | 92% | 92% | 99% | 99% | 98% | 97% | 93% |
| **2025** | | | | | | | | | | | | | | | | | |
| Jan | 97% | 96% | 95% | 98% | 98% | 98% | 96% | 93% | 94% | 96% | 94% | 94% | 100% | 100% | 98% | 98% | 92% |
| Feb | 97% | 96% | 95% | 99% | 99% | 99% | 95% | 93% | 93% | 94% | 92% | 92% | 99% | 99% | 98% | 97% | 93% |
| Mar | 98% | 97% | 96% | 98% | 98% | 98% | 96% | 94% | 95% | 95% | 93% | 94% | 100% | 100% | 98% | 97% | 95% |
| Apr | 96% | 95% | 95% | 96% | 96% | 96% | 93% | 92% | 92% | 93% | 92% | 92% | 98% | 98% | 97% | 96% | 93% |
| May | 97% | 96% | 95% | 97% | 96% | 96% | 94% | 93% | 93% | 94% | 93% | 93% | 98% | 98% | 96% | 95% | 93% |
| Jun | 97% | 96% | 96% | 98% | 98% | 98% | 96% | 95% | 95% | 96% | 95% | 95% | 98% | 98% | 97% | 96% | 95% |
| Jul | 98% | 98% | 98% | 99% | 99% | 99% | 96% | 96% | 96% | 96% | 95% | 95% | 96% | 95% | 98% | 97% | 96% |
| Aug | 95% | 95% | 95% | 97% | 97% | 97% | 94% | 92% | 93% | 94% | 92% | 92% | 94% | 94% | 95% | 94% | 94% |
| Sep | 96% | 95% | 94% | 97% | 97% | 97% | 95% | 94% | 94% | 95% | 93% | 93% | 95% | 95% | 96% | 94% | 94% |

*Color coding: Green = 90% or above | Yellow = 80% to 89% | Red = Below 80%*

Higher completeness improves the reliability of the data, especially when completeness is stable over time. Completeness is defined as the percentage of reporting facilities each month out of the total number of facilities expected to report. A facility is expected to report if it has reported any volume for each indicator anytime within a year. A high completeness does not indicate that the HMIS is representative of all service delivery in the country, as some services may not be delivered in facilities, or some facilities may not report.

---

**FASTR initiative:**
https://data.gffportal.org/key-theme/FASTR
