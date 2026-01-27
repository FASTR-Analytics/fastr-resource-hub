---
marp: true
theme: fastr
paginate: true
---

## Activity: Quarterly service utilization report

*DRAFT - NEEDS REVIEW*

**Goal:** Each country team produces an updated service utilization report using the latest data.

**Steps:**

1. Import latest data from DHIS2
2. Run service utilization analysis
3. Interpret outputs using AI tools
4. Draft key findings for your country report

![hands-on h:40](../../resources/icons/hands_on.svg) **Duration: 60-90 minutes**

---

## Step 1: Import latest data

*TO BE CONFIRMED: Data tab workflow*

Each country team will update their database with the most recent DHIS2 data.

1. Navigate to **Data** tab → **New Import**
2. Configure your country's DHIS2 API connection
3. Select your priority indicators
4. Extend the date range through the current period
5. Run import

---

## Step 2: Run service utilization module

*TO BE CONFIRMED: Module configuration*

Run the Service Utilization module for your country.

- **Period:** Extend through current quarter
- **Indicators:** Your country's priority services
- **Geography:** National and subnational levels

Output: `M3_disruptions_analysis_admin_area_1.csv`

---

## Step 3: Interpret your outputs

For each visualization, use the AI assistant to help draft interpretations for your country report.

The following slides provide:

- Purpose of each graph
- What to look for
- Suggested AI prompts
- Example interpretations

---

## Graph 1: Trends over time

**Purpose:** Summarize your country's service volume trajectory over time.

**What to look for:**

- Highs and lows - what were the peak and minimum values?
- Periods of increase or decrease
- Related indicators (e.g., Penta1 vs Penta3) - do they move together?
- Seasonality vs meaningful shifts

---

## Graph 1: AI prompt

*NEEDS REVIEW*

**Suggested prompt:**

> Analyze this service volume data covering:
> - Overall trend direction and magnitude from start to end period
> - Notable disruptions, seasonal patterns, or outliers
> - Specific data points for highs, lows, and final-period values

---

## Graph 2: Quarter-on-quarter change

**Purpose:** Identify quarters with meaningful changes in your country's service volumes.

**Reading the graph:**

- **Gray:** No meaningful change (under 10%)
- **Red:** Decrease of 10% or more
- **Green:** Increase of 10% or more

---

## Graph 2: AI prompt

*NEEDS REVIEW*

**Suggested prompt:**

> Analyze this data to:
> - Note when all changes are under 10% (stable period)
> - Highlight the 2-3 largest increases or decreases
> - Flag any quarters with changes greater than 10%

---

## Graph 3: Disruptions and surpluses

**Purpose:** Identify periods where your country's service delivery deviated significantly from expected levels.

**What to look for:**

- Which periods show disruptions (below expected)?
- Which periods show surpluses (above expected)?
- What is the average deviation during disruption periods?

---

## Graph 3: AI prompt

*NEEDS REVIEW*

**Suggested prompt:**

> Analyze this data to:
> - Identify disruption or surplus periods deviating more than 10% from expected
> - Calculate average deviation for highlighted periods
> - Red = disruption, Green = surplus

---

## Step 4: Draft your key messages

**From data to key messages**

Results are what the analysis found - often many, complex, hard to interpret at a glance.

Key takeaways are the "so what" - they should be:

- Few in number (3-5)
- Simple and clear
- Actionable

Each country team: Draft 3-5 key messages from your analysis.

---

## Report checklist

Before finishing, confirm your country report includes:

- [ ] Data updated through current period
- [ ] Trends over time interpretation
- [ ] Quarter-on-quarter changes highlighted
- [ ] Disruptions/surpluses identified
- [ ] 3-5 key messages drafted

---

## Discussion

- What trends emerged in your country's data?
- Which services showed disruptions or surpluses?
- What factors might explain the patterns?
- What are your key messages for decision-makers?
