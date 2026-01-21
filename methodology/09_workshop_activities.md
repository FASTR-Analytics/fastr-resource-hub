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

<!-- SLIDE:m9_1 -->
## Activity: Data refresh and disruption analysis

**Objectives:**

1. Refresh data from DHIS2 using the Data tab
2. Run disruption analysis for the past 24 months
3. Use AI tools to support interpretation
4. Prepare summary findings

![hands-on h:40](resources/icons/hands_on.svg) **Duration: 60-90 minutes**

<!-- /SLIDE -->

<!-- SLIDE:m9_2 -->
## Step 1: Refresh the data

![hands-on h:40](resources/icons/hands_on.svg) **Navigate to the Data tab**

1. Open the FASTR Analytics Platform
2. Go to **Data** tab
3. Select **New Import**
4. Configure DHIS2 API connection
5. Select indicators and date range (24+ months)
6. Run import

<!-- TODO: Add screenshots, clarify DHIS2 API authentication -->

<!-- /SLIDE -->

<!-- SLIDE:m9_3 -->
## Step 2: Run the disruption analysis

![hands-on h:40](resources/icons/hands_on.svg) **Module 3: Service Utilization**

1. Navigate to Service Utilization module
2. Configure parameters:
   - **Period:** Past 24 months
   - **Indicators:** Priority services
   - **Geography:** National and subnational
3. Execute module
4. Review outputs

<!-- /SLIDE -->

<!-- SLIDE:m9_4 -->
## Step 2: Key outputs

| Output | Description |
|--------|-------------|
| `M3_chartout.csv` | Disruption flags by month |
| `M3_disruptions_analysis_*.csv` | Quantified impacts |
| `M3_all_indicators_shortfalls_*.csv` | Service shortfalls |

**Review:** Which months show disruptions? Which services and areas most affected?

<!-- /SLIDE -->

<!-- SLIDE:m9_5 -->
## Step 3: AI-assisted interpretation

![hands-on h:40](resources/icons/hands_on.svg) **Open the AI Assistant**

Load your outputs and try:

> "Summarize the main disruption patterns in this data."

> "Which services and regions show the largest disruptions?"

> "Prepare a summary for Ministry of Health leadership."

<!-- /SLIDE -->

<!-- SLIDE:m9_6 -->
## Step 4: Prepare summary report

**Structure your findings:**

| Section | Content |
|---------|---------|
| Key findings | 3-5 main points |
| Evidence | 2-3 supporting visuals |
| Recommendations | 2-3 priority actions |

<!-- /SLIDE -->

<!-- SLIDE:m9_7 -->
## Discussion

- What patterns emerged in the country data?
- Which services or areas showed unexpected results?
- How should findings be presented to decision-makers?
- What additional context would strengthen interpretation?

<!-- /SLIDE -->

