# Workshop activities

This chapter contains hands-on activities for workshop participants. Each activity provides a structured workflow using country data and FASTR tools.

---

## Activity: Data refresh and disruption analysis

This activity covers the complete workflow for updating DHIS2 data, running a disruption analysis, and producing a summary report on service delivery patterns over the past 24 months.

### Objectives

1. **Refresh data** - Use the Data Downloader to import current data from DHIS2
2. **Run analysis** - Execute the disruption analysis module
3. **Interpret results** - Use AI tools to support interpretation
4. **Document findings** - Prepare a summary report

### Step 1: Refresh the data

Ensure the analysis uses the most current available data.

![hands-on h:40](../resources/icons/hands_on.svg) **Open the Data Downloader**

The Data Downloader connects to the country DHIS2 instance and imports facility-level data directly into the FASTR database.

1. Authenticate with DHIS2 credentials
2. Select indicators for analysis
3. Set the date range to include at least 24 months
4. Initiate download and import

*Placeholder: Screenshots of Data Downloader interface*

??? info "Technical details"

    The Data Downloader uses the DHIS2 API to:

    - Extract data at facility level
    - Transform to FASTR-compatible format
    - Load directly into the analysis database

    This eliminates manual data export and file handling.

### Step 2: Run the disruption analysis

With current data imported, run the Service Utilization module to identify disruptions.

![hands-on h:40](../resources/icons/hands_on.svg) **Run Module 3: Service Utilization**

1. Open the FASTR Analytics Platform
2. Navigate to the Service Utilization module
3. Configure parameters:
   - **Period:** Past 24 months
   - **Indicators:** Priority services (e.g., ANC, immunizations, outpatient visits)
   - **Geography:** National and subnational levels
4. Execute the module

The analysis identifies months where service volumes deviated from expected levels and quantifies the magnitude of disruptions.

**Key outputs:**

| Output file | Description |
|-------------|-------------|
| `M3_chartout.csv` | Disruption flags by month |
| `M3_disruptions_analysis_*.csv` | Quantified disruption impacts |
| `M3_all_indicators_shortfalls_*.csv` | Service shortfall summaries |

### Step 3: AI-assisted interpretation

Use the AI assistant to support analysis of results.

![hands-on h:40](../resources/icons/hands_on.svg) **Open the AI Assistant**

Load the disruption analysis outputs and use prompts such as:

**Initial analysis:**
> "Summarize the main patterns in this disruption analysis."

**Geographic comparison:**
> "Which services and regions show the largest disruptions over the past 24 months?"

**Draft narrative:**
> "Prepare a brief summary of these disruption trends for Ministry of Health leadership."

**Recommendations:**
> "Based on these results, identify priority areas for intervention."

Review and refine AI-generated content as needed.

### Step 4: Prepare the summary report

Compile findings into a structured report.

**Suggested structure:**

1. **Key findings** (3-5 points)
   - Service delivery trends
   - Most affected services and areas
   - Recovery status

2. **Supporting evidence** (2-3 visuals)
   - Trend chart showing disruption periods
   - Geographic comparison (map or table)
   - Before/after comparison

3. **Recommendations** (2-3 actions)
   - Priority interventions
   - Areas requiring attention

### Discussion questions

- What patterns emerged in the country data?
- Which services or areas showed unexpected results?
- How should these findings be presented to decision-makers?
- What additional context would strengthen interpretation?

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

1. Refresh data from DHIS2 using Data Downloader
2. Run disruption analysis for the past 24 months
3. Use AI tools to support interpretation
4. Prepare summary findings

![hands-on h:40](resources/icons/hands_on.svg) **Duration: 60-90 minutes**

<!-- /SLIDE -->

<!-- SLIDE:m9_2 -->
## Step 1: Refresh the data

![hands-on h:40](resources/icons/hands_on.svg) **Using the Data Downloader**

- Authenticate with DHIS2 credentials
- Select indicators for analysis
- Set date range (24+ months)
- Download and import

*Placeholder: Data Downloader demonstration*

<!-- /SLIDE -->

<!-- SLIDE:m9_3 -->
## Step 2: Run the disruption analysis

![hands-on h:40](resources/icons/hands_on.svg) **Module 3: Service Utilization**

Configure:
- Period: Past 24 months
- Indicators: Priority services
- Geography: National and subnational

Execute module and review outputs

<!-- /SLIDE -->

<!-- SLIDE:m9_4 -->
## Step 3: AI-assisted interpretation

![hands-on h:40](resources/icons/hands_on.svg) **Example prompts**

> "Summarize the main patterns in this disruption analysis."

> "Which services and regions show the largest disruptions?"

> "Prepare a summary for Ministry of Health leadership."

Review and refine as needed.

<!-- /SLIDE -->

<!-- SLIDE:m9_5 -->
## Step 4: Prepare summary report

**Report structure:**

- 3-5 key findings
- 2-3 supporting visuals
- 2-3 recommended actions

**Discussion:** What patterns emerged? What additional context would help?

<!-- /SLIDE -->

