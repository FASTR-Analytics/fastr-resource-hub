# Workshop activities

This chapter contains hands-on activities for workshop participants. Each activity walks through a practical workflow using real data and tools.

---

## Activity: Refresh data and run a disruption analysis

In this activity, we'll update our database with the latest DHIS2 data, run a disruption analysis, and use AI tools to help write up findings for the past 24 months.

### What we'll do

1. **Get fresh data** - Use the Data Downloader to pull the most recent data from DHIS2
2. **Run the analysis** - Execute the disruption analysis module on updated data
3. **Interpret with AI** - Use AI tools to help make sense of the results
4. **Write it up** - Draft a short report on disruption patterns

### Step 1: Refresh the data

First, let's make sure we're working with the most current data.

![hands-on h:40](../resources/icons/hands_on.svg) **Open the Data Downloader**

The Data Downloader connects to your DHIS2 instance and pulls facility-level data directly into the FASTR database.

1. Log in with your DHIS2 credentials
2. Select the indicators you want to analyze
3. Set the date range - we need at least 24 months of data
4. Click download and wait for import to complete

*Placeholder: Screenshots of Data Downloader interface*

??? info "What's happening behind the scenes?"

    The Data Downloader uses the DHIS2 API to:

    - Pull data at facility level
    - Transform it into FASTR format
    - Load it directly into your analysis database

    This means no manual exports or file uploads needed.

### Step 2: Run the disruption analysis

Now we'll analyze the data to identify service disruptions.

![hands-on h:40](../resources/icons/hands_on.svg) **Run Module 3: Service Utilization**

1. Open the FASTR Analytics Platform
2. Go to the Service Utilization module
3. Set these parameters:
   - **Period:** Past 24 months
   - **Indicators:** Your priority services (ANC, immunizations, etc.)
   - **Geography:** National and provincial levels
4. Run the module

The analysis will flag months where services dropped below expected levels and calculate how big the gap was.

**What to look for in the outputs:**

| Output file | What it tells you |
|-------------|-------------------|
| `M3_chartout.csv` | Which months had disruptions |
| `M3_disruptions_analysis_*.csv` | How big the disruptions were |
| `M3_all_indicators_shortfalls_*.csv` | Total services "missed" |

### Step 3: Use AI to interpret results

Let's use the AI assistant to help make sense of the numbers.

![hands-on h:40](../resources/icons/hands_on.svg) **Open the AI Assistant**

Load your disruption analysis outputs and try these prompts:

**To get started:**
> "What are the main patterns you see in this disruption analysis?"

**To dig deeper:**
> "Which services and regions were most affected in the past 24 months?"

**To draft findings:**
> "Write a brief summary of these disruption trends for a Ministry of Health audience."

**To get recommendations:**
> "Based on these results, what should we prioritize?"

The AI will give you a starting point - review it, edit it, and make it yours.

### Step 4: Put together your findings

Now pull it all together into a short report.

**Suggested structure:**

1. **Key findings** (3-5 bullets)
   - What happened to service delivery?
   - Which areas/services were most affected?
   - Are things recovering?

2. **The data** (2-3 visuals)
   - Trend chart showing disruption period
   - Map or table of geographic variation
   - Before/after comparison

3. **What to do about it** (2-3 actions)
   - Priority interventions
   - Areas needing attention

### Discussion

After completing the analysis, discuss with your group:

- What patterns did you find in your country's data?
- Were there surprises in which services or areas were affected?
- How would you present these findings to decision-makers?
- What additional information would help explain the patterns?

---

<!--
////////////////////////////////////////////////////////////////////
//                                                                //
//            Edit workshop slides below this line                //
//                                                                //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m9_1 -->
## Activity: Disruption analysis with fresh data

**What we'll do together:**

1. Refresh data from DHIS2 using Data Downloader
2. Run disruption analysis on the past 24 months
3. Use AI tools to interpret and write up findings

![hands-on h:40](resources/icons/hands_on.svg) **Duration: 60-90 minutes**

<!-- /SLIDE -->

<!-- SLIDE:m9_2 -->
## Step 1: Get fresh data

![hands-on h:40](resources/icons/hands_on.svg) **Using the Data Downloader**

- Log in with your DHIS2 credentials
- Select your indicators
- Set date range (24+ months)
- Download and import

*Placeholder: Data Downloader demo*

<!-- /SLIDE -->

<!-- SLIDE:m9_3 -->
## Step 2: Run the disruption analysis

![hands-on h:40](resources/icons/hands_on.svg) **Module 3: Service Utilization**

Configure:
- Period: Past 24 months
- Indicators: Priority services
- Geography: National + provincial

Run and review outputs

<!-- /SLIDE -->

<!-- SLIDE:m9_4 -->
## Step 3: AI-assisted interpretation

![hands-on h:40](resources/icons/hands_on.svg) **Try these prompts**

> "What are the main disruption patterns in this data?"

> "Which services and regions were most affected?"

> "Draft a summary for Ministry of Health leadership."

Review, edit, make it yours.

<!-- /SLIDE -->

<!-- SLIDE:m9_5 -->
## Step 4: Write up your findings

**Your short report should include:**

- 3-5 key findings
- 2-3 supporting visuals
- 2-3 recommended actions

**Discussion:** What did you find? Any surprises?

<!-- /SLIDE -->

