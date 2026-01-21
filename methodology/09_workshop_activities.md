# Workshop activities

This chapter contains hands-on activities for workshop participants.

---

<!--
////////////////////////////////////////////////////////////////////
//                                                                //
//            Edit workshop slides below this line                //
//                                                                //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:disruption -->
## Activity: Service utilization analysis

*DRAFT - NEEDS REVIEW*

**Objectives**

- Update the database with current DHIS2 data
- Run service utilization analysis for the past 24 months
- Use AI tools to interpret visualizations and draft findings

![hands-on h:40](resources/icons/hands_on.svg) **Duration: 60-90 minutes**

---

## Part 1: Import latest data

*TO BE CONFIRMED: Data tab workflow and screenshots*

Within the FASTR Analytics Platform, navigate to the **Data** tab and select **New Import** to pull the latest data from DHIS2.

1. Configure the DHIS2 API connection
2. Select your priority indicators
3. Extend the date range through the current period
4. Run import and verify completion

---

## Part 2: Run service utilization module

*TO BE CONFIRMED: Exact module steps*

Navigate to the **Service Utilization** module and configure:

- **Period:** Extend through current quarter
- **Indicators:** Priority services for your country
- **Geography:** National and subnational levels

Execute the module. Country-level monthly aggregates will be available in `M3_disruptions_analysis_admin_area_1.csv`

---

## Graph 1: Trends over time

**Purpose:** Summarize the overall service volume trajectory and identify key trends over time.

When describing this graph, consider:

- Identify specific data points for highs or lows
- Look at periods of increase or decrease
- Compare service utilization between related indicators (e.g., Penta1 & Penta3)
- Assess whether changes reflect seasonality or meaningful shifts

---

## Graph 1: AI prompt

*NEEDS REVIEW: Prompt wording*

**Suggested prompt:**

> Analyze this service volume data for BCG, Penta1, and Penta3, covering:
> - Overall trend direction and magnitude from start to end period
> - Notable disruptions, seasonal patterns, or outliers
> - Specific data points for highs, lows, and final-period values

---

## Graph 1: Example interpretation

*PLACEHOLDER - Use country-specific example*

BCG volumes fluctuated through the period, with small gains in 2023 and mid-2024 followed by a decline in early 2025, returning to 50,000 doses by mid-2025.

Penta1 and Penta3 followed broadly similar trends, with parallel rises and dips through 2024 and early 2025.

By mid-2025, Penta1 reached 64,000 doses and Penta3 57,000, indicating an estimated 11% dropout between first and third doses.

---

## Graph 2: Quarter-on-quarter change

**Purpose:** Understand service volume changes comparing one quarter to the next, highlighting meaningful shifts.

Reading the graph:

- **Gray:** No meaningful quarter-on-quarter change
- **Red:** Decrease (e.g., BCG declined 13.1% in Q1 2025)
- **Green:** Increase (e.g., Penta1 increased 10.8% in Q2 2025)

---

## Graph 2: AI prompt

*NEEDS REVIEW: Prompt wording*

**Suggested prompt:**

> Analyze this service volume data to:
> - Note when all changes are under 10% (no major disruptions)
> - Highlight 2-3 of the largest increases or decreases
> - Identify unusual changes greater than 10%

---

## Graph 3: Disruptions and surpluses

**Purpose:** Identify disruptions and surpluses and assess the impact of external shocks such as pandemics, stock-outs, or health worker strikes.

When describing this graph, consider:

- Identifying years with disruptions
- Calculating average disruptions or surpluses
- Comparing expected vs. observed values

---

## Graph 3: AI prompt

*NEEDS REVIEW: Prompt wording*

**Suggested prompt:**

> Analyze this service volume data to:
> - Identify disruption or surplus periods deviating more than 10% from expected patterns
> - Calculate average deviation for highlighted periods
> - Red = disruption, Green = surplus

---

## Graph 3: Example interpretation

*PLACEHOLDER - Use country-specific example*

**BCG:** Multiple disruptions in 2023 and 2025, with service use 10-24% below expected levels.

**Penta1:** Brief disruptions in 2023 and 2024 (5-14% below expected), with additional disruptions in 2025 averaging 12% below expected.

**Penta3:** Short dips of 5-13% below expected in 2023 and mid-2024.

---

## Moving from data to key messages

**What is a result?**
Results are what the analysis found - service utilization numbers. They are often many in number, complex, and hard to understand at a glance.

**What is a key takeaway?**
Key takeaways explain what the results are telling us - the "so what." They should be few in number, simple and clear, easy to remember, and actionable.

---

## Discussion

- What patterns emerged in the country data?
- Which services showed disruptions or surpluses?
- What factors might explain the patterns observed?
- What are the key messages for decision-makers?

<!-- /SLIDE -->

