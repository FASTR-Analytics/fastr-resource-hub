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

In this activity, participants will:

1. Update the database with current DHIS2 data
2. Run service utilization analysis for the past 24 months
3. Use AI tools to interpret visualizations and draft findings

![hands-on h:40](resources/icons/hands_on.svg) **Duration: 60-90 minutes**

---

## Part 1: Import latest data

![hands-on h:40](resources/icons/hands_on.svg) **Using the Data tab**

1. Open the FASTR Analytics Platform
2. Navigate to **Data** tab → **New Import**
3. Configure DHIS2 API connection
4. Select indicators and extend date range through current period
5. Run import

<!-- TODO: Screenshots and detailed workflow to be added -->

---

## Part 2: Run service utilization module

![hands-on h:40](resources/icons/hands_on.svg) **Service Utilization module**

1. Navigate to Service Utilization module
2. Configure:
   - **Period:** Past 24 months
   - **Indicators:** Priority services
   - **Geography:** National and subnational
3. Execute module

**Key output:** `M3_disruptions_analysis_admin_area_1.csv`

---

## Graph 1: Trends over time

**Purpose:** Summarize overall service volume trajectory and identify key trends.

**Suggested AI prompt:**

> Analyze this service volume data for [indicators], covering:
> - Overall trend direction and magnitude from start to end period
> - Notable disruptions, seasonal patterns, or outliers
> - Specific data points for highs, lows, and final-period values

---

## Graph 1: Example interpretation

**BCG** volumes fluctuated through the period, with small gains in 2023 and mid-2024 followed by a decline in early 2025, returning to 50,000 doses by mid-2025.

**Penta1 and Penta3** followed broadly similar trends, with parallel rises and dips through 2024 and early 2025.

By mid-2025, Penta1 reached 64,000 doses and Penta3 57,000, indicating an estimated **11% dropout** between first and third doses.

---

## Graph 2: Quarter-on-quarter change

**Purpose:** Understand service volume changes comparing one quarter to the next.

- **Gray:** No meaningful change
- **Red:** Decrease (e.g., BCG declined 13.1% in Q1 2025)
- **Green:** Increase (e.g., Penta1 increased 10.8% in Q2 2025)

**Suggested AI prompt:**

> Analyze this data to identify quarters with changes greater than 10% and highlight the 2-3 largest increases or decreases.

---

## Graph 3: Service disruptions and surpluses

**Purpose:** Identify disruptions/surpluses and assess impact of external shocks.

**Suggested AI prompt:**

> Analyze this data to:
> - Identify disruption or surplus periods deviating more than 10% from expected
> - Calculate average deviation for highlighted periods
> - Red = disruption, Green = surplus

---

## Graph 3: Example interpretation

**BCG:** Multiple disruptions in 2023 and 2025, with service use 10-24% below expected levels.

**Penta1:** Brief disruptions in 2023 and 2024 (5-14% below expected), with additional disruptions in 2025 averaging 12% below expected.

**Penta3:** Short dips of 5-13% below expected in 2023 and mid-2024.

---

## Moving from data to key messages

**What is a result?**

- Service utilization numbers
- Often many, complex, hard to interpret at a glance

**What is a key takeaway?**

- Why the results matter - the "so what"
- Should be: few in number, simple and clear, actionable

---

## Discussion

- What trends emerged in the country data?
- Which services showed disruptions or surpluses?
- What factors might explain the patterns observed?
- What are the key messages for decision-makers?

<!-- /SLIDE -->

