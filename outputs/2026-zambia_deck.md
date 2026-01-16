---
marp: true
theme: fastr
paginate: true
---


# In-Country Working Session: FASTR Implementation & RMNCAH-N Service Monitoring Analysis

**January 27-30, 2026** | **Lusaka**

*GFF FASTR Team*

<img src="../resources/logos/FASTR_Primary_01_FullName.png" style="position: absolute; bottom: 40px; right: 40px; width: 180px;">

---


<!-- _class: agenda -->
# Agenda

**Day 1 -- Laying the Foundation: Introducing FASTR and Configuring the Analytics Platform**

| Time | Agenda | Facilitator/Presenter |
|------|--------|--------|
| **Opening Session** | | |
| 08:30-09:00 | Participant registration | MoH team |
| 09:00-09:10 | Welcome and opening remarks | MoH team |
| 09:10-09:20 | Icebreakers/Introductions | MoH team |
| 09:20-09:35 | Overview of agenda, workshop objectives | GFF FASTR team |
| **Session 1: Overview of the FASTR approach** | | |
| 09:35-10:30 | Overview: FASTR Approaches | GFF FASTR team |
| **Session 2: HMIS data extraction** | | |
| 10:30-11:30 | Data extraction: Rationale and methods | GFF FASTR team |
| **Session 3: Introduction to the FASTR analytics platform** | | |
| 11:30-12:30 | Introduction to the FASTR analytics platform | GFF FASTR team |
| 12:30-14:00 | *Lunch Break* | |
| 14:00-14:30 | Getting participants into the platform | GFF FASTR team |
| **Session 4: Configuring the FASTR analytics platform** | | |
| 14:30-16:30 | Configuring the analysis platform | GFF FASTR team |

---

<!-- _class: agenda -->
# Agenda

**Day 2 -- Building the Analysis: Applying FASTR Methods and Generating Outputs**

| Time | Agenda | Facilitator/Presenter |
|------|--------|--------|
| 09:00-09:15 | Overview of Day 2 agenda | GFF FASTR team |
| **Session 5: Overview of FASTR methods and analytical outputs** | | |
| 09:15-10:15 | Data quality, service utilization, coverage | GFF FASTR team |
| **Session 6: Creating a project** | | |
| 10:15-11:15 | Project creation and settings | GFF FASTR team |
| **Session 7: Creating visualizations** | | |
| 11:15-12:30 | Creating and editing visualizations | GFF FASTR team |
| 12:30-14:00 | *Lunch Break* | |
| **Session 8: Creating reports** | | |
| 14:30-16:30 | Practice creating and editing reports | GFF FASTR team |

---

<!-- _class: agenda -->
# Agenda

**Day 3 -- From Analysis to Action: Interpreting Results and Using FASTR for Decision-Making**

| Time | Agenda | Facilitator/Presenter |
|------|--------|--------|
| 09:00-09:15 | Overview of Day 3 agenda | GFF FASTR team |
| **Session 8: Interpretation of visualizations** | | |
| 09:15-10:15 | Approaches to support interpretation | GFF FASTR team |
| **Session 9: Creating a Q4 2025 report** | | |
| 10:15-12:30 | Creating short and long reports with country context | GFF FASTR team |
| 12:30-14:00 | *Lunch Break* | |
| **Session 9 (cont'd): Creating a Q4 2025 report** | | |
| 14:00-15:00 | Continue report creation with country context | GFF FASTR team |
| **Session 10: Presenting reports** | | |
| 14:30-15:30 | Present reports, group feedback | GFF FASTR team |

---

<!-- _class: agenda -->
# Agenda

**Day 4 -- Designing the Health Facility Assessment**

| Time | Agenda | Facilitator/Presenter |
|------|--------|--------|
| 09:00-09:15 | Overview of Day 4 agenda | GFF FASTR team |
| **Session 12: Overview of FASTR HFA phone survey** | | |
| 09:15-10:15 | HFA overview and questionnaire adaptation guidelines | GFF FASTR team |
| **Session 13: Questionnaire adaptation to the Zambian context** | | |
| 10:15-12:30 | Review questionnaire + hands-on adaptation | GFF FASTR team |
| 12:30-14:00 | *Lunch Break* | |
| **Session 14: Questionnaire adaptation (cont'd)** | | |
| 14:00-15:00 | Continue questionnaire adaptation (in groups) | GFF FASTR team |
| **Session 15: Discussion: HFA adapted questionnaire** | | |
| 14:30-15:30 | Discuss adapted questionnaire in plenary | GFF FASTR team |
| **Session 16: Discussion: HFA priorities and data use** | | |
| 15:30-16:30 | HFA priorities and data use case in Zambia | GFF FASTR team |
| **Session 17: Action planning and wrap-up** | | |
| 16:30-17:00 | Key messages and wrap-up | GFF FASTR team |

---



# Workshop Objectives

- Prepare MoH for participation in the multi-country workshop
- Strengthen capacity for disruption analysis and data extraction
- Configure the FASTR analytics platform for Zambia
- Produce the first quarterly report
- Adapt the phone survey questionnaire to the Zambian context
- Use data downloader tools for DHIS2

---



# Scope of Work

### Disruption Analysis Activities
- Data extraction and configuration of analytics platform
- Produce first quarterly report
- Review results and contextualize findings (with relevant program teams)

### Phone Survey Activities
- Adaptation of questionnaire (with program input)

### Capacity Building
- Training on data downloader for all with DHIS2 access
- Hybrid format: face-to-face and online

---



# Expected Outputs

- Adapted phone survey questionnaire
- First quarterly report draft
- Trained MoH team on data downloader tools
- Roadmap for participation in Abuja workshop

---


# Session 1: Overview of the FASTR approach

---


## Introduction to FASTR

<div class="columns">
<div>

The Global Financing Facility (GFF) supports country-led efforts to strengthen the use of timely data for decision-making, with the goal of improving primary healthcare (PHC) performance and RMNCAH-N outcomes.

**Frequent Assessments and Health System Tools for Resilience (FASTR)** is the GFF's rapid-cycle analytics framework for monitoring health system performance using high-frequency data.

FASTR brings together four complementary technical approaches:

1. Routine HMIS data analysis
2. Health facility phone surveys
3. High-frequency household phone surveys
4. Follow-on, problem-driven analyses

</div>
<div>

![FASTR Technical Approaches](../resources/diagrams/Technical-Rapid-cycle-analytics--V3.svg)

</div>
</div>

---



## What FASTR does with routine HMIS data

<div class="columns">
<div>

FASTR works directly with Ministries of Health to transform routine HMIS data into actionable evidence for policy and program management.

Using facility-level data, the approach focuses on three core analytic functions:

**Assess data quality**
Identify key issues related to completeness, outliers, and internal consistency.

**Adjust for data quality limitations**
Apply transparent, indicator-specific methods to improve the reliability of trend analysis.

**Analyze service use and coverage trends**
Track changes in priority RMNCAH-N services and compare progress against country priorities and benchmarks.

</div>
<div>

![Steps to implement RMNCAH-N service use monitoring](../resources/diagrams/Steps%20to%20implement%20RMNCAH-N%20service%20chart.svg)

</div>
</div>

---



## Why rapid-cycle analytics?

<div class="columns">
<div>

Routine health information systems are a critical source of data, but they are often underused due to concerns about data quality and long delays between data collection and analysis. Traditional household and facility surveys, while essential, are resource-intensive and infrequent.

FASTR's rapid-cycle analytics address this gap by providing:

- Timely insights aligned with country decision cycles
- Continuous learning rather than one-off assessments
- Direct feedback loops between data, analysis, and action

During the COVID-19 pandemic, this approach was applied in over 20 countries to monitor disruptions to essential RMNCAH-N services and inform response and recovery planning.

</div>
<div>

![FASTR rapid-cycle analytics framework](../resources/diagrams/GFF-Rapid-Cycle-Analytics-Data-Use_Figure-1.svg)

</div>
</div>

---



## Focus of the analysis

### Core indicators

FASTR prioritizes a core set of RMNCAH-N indicators that:

- Represent key service delivery contacts across the continuum of care
- Have relatively high reporting completeness and volumes
- Serve as proxies for broader service delivery performance

Outpatient consultations are included as a proxy for overall health service use. The indicator set can be expanded to reflect country-specific priorities.

### Core data quality metrics

Analysis is anchored in a standardized set of data quality metrics, including:

- Reporting completeness
- Extreme value (outlier) detection
- Consistency across related indicators

These metrics are summarized into an overall data quality score to support interpretation and comparison across areas.

---



## FASTR approach to routine data analysis

The FASTR approach follows a three-step workflow:

### 1. Assess data quality
Identify issues related to completeness, outliers, and internal consistency at national and subnational levels.

### 2. Adjust for data quality limitations
Apply transparent, indicator-specific corrections to improve the reliability of trend analysis.

### 3. Analyze service delivery
Quantify changes in priority service volumes and compare coverage trends against country targets.

This enables continuous, subnational monitoring while data quality is systematically improved.

---


# Session 2: HMIS data extraction

---


## Why extract data from DHIS2?

### Data quality adjustment

The FASTR approach focuses on data quality adjustments to expand the analyses countries can do with DHIS2 data and to generate more robust estimates.

The FASTR methodology includes specific approaches to:
- Identify and adjust for outliers
- Adjust for incomplete reporting
- Apply consistent data quality metrics

These adjustments require processing that cannot be done within DHIS2's native analytics.

---



## Why extract data from DHIS2?

### Analysis complexity

The FASTR approach uses more advanced statistical methods, such as regression analysis, which are not available in DHIS2. While DHIS2 can plot trends over time using raw data, FASTR can go further by:

- Identifying significant increases or decreases in service volume
- Adjusting for data quality issues
- Accounting for expected seasonal variations
- Comparing key periods, such as before and after a reform

The choice between DHIS2 and the FASTR approach should be guided by the specific purpose of your analysis.

---



## Data format and granularity

Data should be downloaded for each **indicator of interest**, at **facility level**, and **monthly** for the **period of interest**.

- Data should be saved in **long format** meaning each row represents a single observation or measurement
- Data should be saved in **.csv format** and can be saved in either a single .csv file or multiple .csv files

### Why monthly facility level data?

We want to use the most granular data we have access to in order to make more fine tuned assessments for data quality. Using monthly facility level data allows us to conduct the most robust analysis.

---



## Key variables

The data extracted should include the following required elements:

| Element | Description |
|---------|-------------|
| Org units | Organizational unit identifier |
| Period | Time period of the data |
| Indicator name | Name of the indicator |
| Total/count | The aggregated value |

---



## How much data?

### Initial FASTR analysis
- Download approximately **five years** of historical data
- Exact period depends on data availability and consistency in indicator definitions

### Routine update to FASTR analysis
- Download new data covering the most recent months not previously included (usually **three months** for quarterly implementation)
- Include the **three preceding months** as recent data is often subject to changes due to late reporting or data quality adjustments

---



## Data extraction tools

We offer two tools for bulk DHIS2 data extraction:

**API Script** (Google Colab)
- Input login credentials, specify timeframes, indicators, and administrative levels
- Download data as a .csv file

**Data Downloader**
- More intuitive, streamlined interface
- Recommended for most users

Both tools enable efficient data extraction, and we provide training resources to support their use.

---



## DHIS2 Data Downloader

The Data Downloader is a desktop application for extracting data from DHIS2.

**Key features:**
- Connect to any DHIS2 instance
- Browse and select data elements and indicators
- Download facility-level data in CSV format
- Maintain download history

**Download from GitHub:**

https://github.com/worldbank/DHIS2-Downloader/releases/

*Facilitator will demonstrate the Data Downloader*

---


# Session 3: Introduction to the FASTR analytics platform

---


## Introduction to the FASTR Analytics Platform

The FASTR analytics platform is a web-based tool for data quality assessment, adjustment, and analysis of routine health data.

**Key features:**

- Upload and analyze data from DHIS2 and other sources
- Built-in statistical methods for data quality adjustment
- User-friendly interface for running analyses
- Flexible visualization and export options

**In this session, we will provide a conceptual walkthrough of the platform and its capabilities.**

---



## Live Demo: Platform Access & Roles

**In this demo, we will:**

- Navigate to the FASTR platform
- Explore user roles: Administrator, Editor, Viewer
- Review user management and permissions
- Understand the workflow for uploading data and making analytical decisions

*Facilitator will demonstrate in the live platform*

---


# <img src="../resources/icons/lunch.png" class="icon" style="height: 1.2em; vertical-align: middle; margin-right: 0.3em;"> Lunch Break

**90 minutes**

Back at 14:00

---


# Session 4: Configuring the FASTR analytics platform

---


## Activity: Setting Up Admin Areas

**In this hands-on session, we will configure:**

- Admin areas (regions, districts)
- Facility structure
- Indicator definitions

*Participants will work directly in the platform*

---



## Activity: Importing Data

**In this hands-on session, we will:**

- Review data format requirements
- Walk through the import process
- Handle validation and error checking

*Participants will import their country's data*

---



## Activity: Installing and Running Modules

**In this hands-on session, we will:**

- Review available analysis modules
- Install required modules
- Run initial analyses

*Participants will configure and run modules on their data*

---


# Day 2

---


# Recap

On Day 1, we covered:

- The FASTR approach and rapid-cycle analytics methodology
- Data extraction from DHIS2 using the Data Downloader
- Introduction to the FASTR Analytics Platform
- Platform configuration: admin areas, data import, modules

---

# Day 2 Focus

Today we will:

- Explore FASTR methods for data quality and analysis
- Create and configure projects
- Build visualizations
- Generate reports

---


# Session 5: Overview of FASTR methods and analytical outputs

---


## FASTR Analytical Pipeline

![Analytical Pipeline](../resources/diagrams/analytical_pipeline.svg)

The components are interdependent: first assess data quality, then apply adjustments, then use the adjusted data for analysis.

---



## Data quality assessment

Understanding the reliability of routine health data

---
## Why talk about data quality?

**The challenge:** Health facilities report data every month, but sometimes:
- Numbers seem too high or too low
- Facilities forget to report
- Related numbers don't match up

**The impact:** Bad data leads to bad decisions
- We might think services are improving when they're not
- We might miss real problems in certain areas
- Resources might go to the wrong places

**FASTR's solution:** Check data quality systematically, fix what we can, and be transparent about limitations

---

## Objectives of FASTR Data Quality Assessment

**Objective 1: Analytical adjustment**

Assessing data quality allows you to adjust for data quality issues, improving the ability to use DHIS2 data for decision-making

**Objective 2: Monitor data quality over time**

Key learning questions include:
- **What is the quality of data for different indicators in DHIS2?** (can inform indicators you select for analysis)
- **Which areas report higher vs. lower quality data?** (can inform targeted data quality validation and supportive supervision)
- **How has data quality improved over time?** (can assess the result of data quality investments, training, etc.)

---
## Three simple questions about data quality

**1. Are facilities reporting regularly?**
- Completeness: Did we get reports from facilities this month?

**2. Are the numbers reasonable?**
- Outliers: Are there any suspiciously high values?

**3. Do related numbers make sense together?**
- Consistency: Do related services show expected patterns?

These three questions help us understand if we can trust the data for decision-making.

---



## Question 1: Are facilities reporting?

---

## Completeness: Did we get reports?

<div style="display: flex; gap: 1.5em; align-items: center;">
<div style="flex: 1;">

**What we're checking:**
Each month, are facilities sending in their reports?

**Why it matters:**
- Missing reports = incomplete picture
- Apparent drops may just be missing data

</div>
<div style="flex: 2;">

![Completeness Illustration](../resources/diagrams/completeness_illustration.svg)

</div>
</div>

---

## What's good completeness?

**It depends on your health system:**
- 90%+ is excellent
- 80-90% is good
- Below 80% means we're missing a lot of information

**Important:** Even 100% completeness doesn't mean we have the full picture - some services might happen outside facilities or some facilities might not be in the reporting system.

**What to look for:** Is completeness improving over time? Which areas have low completeness?

---

## Completeness: FASTR output

![Indicator Completeness](../resources/default_outputs/Default_2._Proportion_of_completed_records.png)

---



## Question 2: Are numbers reasonable?

---

## Outliers: Spotting suspicious numbers

<div style="display: flex; gap: 1.5em; align-items: center;">
<div style="flex: 1;">

**In this example:**
Region A shows a spike in February that's far higher than the other regions.

This is likely a data entry error - after adjustment, all regions show similar gradual trends.

</div>
<div style="flex: 2;">

![Outlier Impact](../resources/diagrams/outlier_impact.svg)

</div>
</div>

---

## How we spot outliers

Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator.

A value is flagged as an outlier if it meets EITHER of two criteria:

1. A value greater than 10 times the Median Absolute Deviation (MAD) from the monthly median value for the indicator, OR
2. A value for which the proportional contribution in volume for a facility, indicator, and time period is greater than 80%

AND for which the count is greater than 100.

---

## Outlier example

**Health Center B - Malaria tests:**

| Month | Tests Reported | Normal? |
|-------|----------------|---------|
| January | 245 | Normal |
| February | 267 | Normal |
| **March** | **2,890** | **Outlier** |
| April | 256 | Normal |

**What happened?** Probably someone entered "2890" instead of "289" (extra zero)

**Impact if we don't fix it:** March would show a huge "spike" in malaria that didn't really happen.

---

## Outliers: FASTR output

![Outliers](../resources/default_outputs/Default_1._Proportion_of_outliers.png)

---



## Question 3: Do related numbers match up?

---

## Consistency: Do related services make sense together?

**What we're checking:**
Health services are related - certain patterns are expected.

**Example 1 - ANC visits:**
- More women should get their **1st** ANC visit (ANC1)
- Fewer should complete all **4** visits (ANC4)
- We expect: ANC1 >= ANC4

**Example 2 - Vaccinations:**
- More babies should get their **1st** Penta dose (Penta1)
- Fewer should complete all **3** doses (Penta3)
- We expect: Penta1 >= Penta3

**If these relationships are backwards, something's wrong with the data.**

---

## Why check consistency at district level?

**Patients move between facilities:**
- Woman might get ANC1 at Health Center A
- But deliver at District Hospital B
- If we only look at each facility separately, numbers might not match

**Solution:** Check consistency at district level
- Add up all ANC1 visits in the district
- Add up all ANC4 visits in the district
- Compare the totals

This accounts for patients visiting different facilities for different services.

---

## Consistency example

<div style="display: flex; gap: 1em; align-items: center;">
<div style="flex: 1; font-size: 0.75em;">

**This passes the consistency check:**
- More women started ANC (5,200) than completed 4 visits (4,100)
- This is logical - not everyone completes all visits

**If it was reversed** (ANC4 > ANC1), we'd know there's a data quality problem.

</div>
<div style="flex: 2;">

![Consistency Illustration](../resources/diagrams/consistency_illustration.svg)

</div>
</div>

---

## Consistency: FASTR output

![Internal Consistency](../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

---



## Putting it all together: Overall data quality

---

## Overall quality score

**For each facility and month, we combine all three checks:**

1. **Complete:** Did the facility report?
2. **No outliers:** Are the numbers reasonable?
3. **Consistent:** Do related numbers make sense?

**Binary DQA Score:**
- dqa_score = 1 if ALL three checks pass
- dqa_score = 0 if ANY check fails

**DQA Mean:** Average of completeness-outlier score and consistency score

**This helps us:**
- Decide which data to use for analysis
- Identify facilities needing support

---

## Overall DQA score: FASTR output

![Overall DQA Score](../resources/default_outputs/Default_5._Overall_DQA_score.png)

---

## Mean DQA score: FASTR output

![Mean DQA Score](../resources/default_outputs/Default_6._Mean_DQA_score.png)

---



## Approach to data quality adjustment

The FASTR analytics platform provides an option for adjusting data for outliers, indicator completeness, or both.

---

## Adjustment for outliers

Each outlier is replaced using the facility's own historical data through a **6-month rolling average**.

**Method depends on position in time series:**

| Position | Method | Example (outlier in June) |
|----------|--------|---------------------------|
| **Middle** | Centered average | Average of Mar-Apr-May + Jul-Aug-Sep |
| **End** | Backward average | Average of Jan-Feb-Mar-Apr-May-Jun (excluding outlier) |
| **Start** | Forward average | Average of Jul-Aug-Sep-Oct-Nov-Dec |

If rolling averages unavailable: same month from previous year, then facility mean.

---

## Adjustment for completeness

Missing values are imputed using the same 6-month rolling average approach.

**Method depends on position in time series:**

| Position | Method | Example (missing in June) |
|----------|--------|---------------------------|
| **Middle** | Centered average | Average of Mar-Apr-May + Jul-Aug-Sep |
| **End** | Backward average | Average of Jan-Feb-Mar-Apr-May |
| **Start** | Forward average | Average of Jul-Aug-Sep-Oct-Nov-Dec |

This prevents reporting gaps from creating artificial drops to zero.

---



## Service utilization analysis

Understanding how health service volumes are changing over time.

---

## Two questions we answer

**1. How is service volume changing?**

Compare volumes year-over-year to identify increases or decreases across regions and indicators.

**2. Are there disruptions from expected patterns?**

Compare actual volumes to what we would expect based on historical trends, to detect and quantify shortfalls or surpluses.

---



## Measuring change over time

We calculate **year-over-year percent change** to identify meaningful shifts in service delivery.

**How it works:**

For each indicator and region, we compare total volume in the current year to the previous year:

$$\text{Percent change} = \frac{\text{Current year} - \text{Previous year}}{\text{Previous year}} \times 100$$

Changes greater than **10%** (increase or decrease) are flagged for review.

---

## Output: Change in service volume

![Change in service volume](../resources/default_outputs/Module3_1_Change_in_service_volume.png)

---

## Reading this chart

**Bars** show annual service volumes by region.

**Percentages** above bars show year-over-year change.

**What to look for:**
- Which regions show the largest increases or decreases?
- Are changes consistent across regions or localized?
- Do patterns differ by indicator?

---



## Output: Actual vs expected (national)

![Actual vs expected national](../resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

This chart shows national-level comparison of actual service volumes against expected values derived from historical trends and seasonality.

---

## Output: Actual vs expected (subnational)

![Actual vs expected subnational](../resources/default_outputs/Module3_3_Actual_vs_expected_subnational.png)

Subnational charts allow comparison across regions to identify where disruptions are concentrated.

---



## Impact of data quality adjustments

The analysis can use different versions of the data:

| Scenario | What it uses |
|----------|--------------|
| **No adjustment** | Raw reported values |
| **Outlier adjustment** | Extreme values corrected |
| **Completeness adjustment** | Adjusted for missing reports |
| **Both adjustments** | Outliers corrected + completeness adjusted |

---

## Output: Volume change by adjustment scenario

![Volume change due to adjustments](../resources/default_outputs/Module3_4_Volume_change_adjustments.png)

---

## Why compare scenarios?

Comparing results across adjustment scenarios helps assess:

- **How much do adjustments change the picture?** If results are similar, findings are robust.
- **Which adjustment has the biggest impact?** Completeness vs outlier corrections.
- **Are conclusions sensitive to data quality assumptions?** Important for interpretation confidence.

---



## Service coverage estimates

The Coverage Estimates module (Module 4 in the FASTR analytics platform) estimates health service coverage by answering: **"What percentage of the target population received this health service?"**

**Three data sources integrated:**
1. Adjusted health service volumes from HMIS
2. Population projections from United Nations
3. Household survey data from MICS/DHS

---

### Two-part process

**Part 1: Denominator calculation**
- Calculate target populations using multiple methods (HMIS-based and population-based)
- Compare against survey benchmarks
- Automatically select best denominator for each indicator

**Part 2: Coverage estimation**
- Override automatic selections based on programmatic knowledge
- Project survey estimates forward using HMIS trends
- Generate final coverage estimates

---



## What is service coverage?

**Coverage** answers: *What percentage of the target population received this health service?*

![Coverage equation](../resources/diagrams/coverage_equation.svg)

---



## Types of denominators for FASTR core analysis

| Type of service | Denominator |
|-----------------|-------------|
| ANC | Pregnancies |
| Delivery | Live births |
| BCG | Live births |
| Penta1 | Infants eligible for Penta (infants surviving 1+ months) |
| Penta3 | Infants eligible for Penta (infants surviving 1+ months) |

---



## Expected relationships which help with estimating denominators

Starting from pregnancies, apply demographic factors to estimate other denominators:

![Denominator cascade flowchart](../resources/diagrams/denominator_cascade.svg)

---



## Estimating denominators from ANC-1

Using survey coverage + DHIS2 counts to derive denominators:

| Step | Formula | Example |
|------|---------|---------|
| Pregnancies | ANC1 count ÷ ANC1 coverage | 100,000 ÷ 0.95 = 105,263 |
| Deliveries | Pregnancies × (1 - stillbirth rate) | 105,263 × 0.97 = 102,105 |
| Live births | Deliveries × survival rate | 102,105 × 0.98 = 100,063 |

---



## Estimating denominators from ANC-1: Visual example

Starting from ANC1 visits, apply demographic adjustment factors to estimate denominators for other services:

![Denominator cascade example](../resources/diagrams/denominator_cascade_example.svg)

---



## Multiple denominator options

Each HMIS indicator provides an **entry point** into the demographic cascade. From that starting point, the module calculates forward and backward to derive all target populations:

| Entry point | Calculation | Denominators derived |
|-------------|-------------|---------------------|
| **ANC1** | ANC1 ÷ coverage → Pregnancies | → Deliveries → Births → Live births → DPT-eligible → Measles-eligible |
| **Deliveries** | Deliveries ÷ coverage → Live births | ← Pregnancies ← ... and → DPT-eligible → Measles-eligible |
| **BCG** | BCG ÷ coverage → Live births | ← Pregnancies ← ... and → DPT-eligible → Measles-eligible |
| **Penta1** | Penta1 ÷ coverage → DPT-eligible | → Measles-eligible |
| **UN WPP** | Population projections | Pregnancies, Live births, DPT-eligible, Measles-eligible |

The module calculates coverage using **each** denominator option, then selects the best one.

---



## Selecting the best denominator

**How the module selects the best denominator:**

1. **Calculate coverage** using each denominator option
2. **Compare to survey** (DHS/MICS) benchmark for that indicator
3. **Select the denominator** that produces coverage closest to survey

---

### Selection rules

- **HMIS-based denominators preferred** over population projections
- **Independent denominators preferred** (e.g., using ANC1 to estimate Penta3 coverage, not Penta1)
- **Lowest error wins** when multiple options are available

This ensures coverage estimates are grounded in observed service delivery patterns.

---



## Projecting coverage between surveys

Surveys (DHS/MICS) occur every 3-5 years. The module projects the last survey value forward using the trend observed in HMIS-calculated coverage:

![Coverage projection method](../resources/diagrams/coverage_projection.svg)

**How it works:** Calculate the year-over-year change (delta) in HMIS coverage, then add each delta to the last survey value. This carries forward the survey baseline while incorporating observed HMIS trends.

---



## Interpreting coverage outputs

**Understanding the chart lines:**

- **Black line/points**: Survey data (DHS/MICS) - the reference standard from household surveys
- **Grey line/points**: HMIS-based coverage - calculated from facility data and selected denominator
- **Red line/points**: Projected coverage - survey estimates extended using HMIS trends

---

### Key questions when reviewing

1. **How close is HMIS coverage to survey?** Large gaps may indicate denominator or data quality issues
2. **Are trends consistent?** HMIS and survey should generally move in the same direction
3. **Are projections plausible?** Coverage should stay between 0-100% and align with program knowledge

---



## Coverage estimates: FASTR outputs

The FASTR analysis generates coverage estimate visualizations at multiple geographic levels:

**1. Coverage calculated from HMIS data (national)**

![Coverage calculated from HMIS data at national level.](../resources/default_outputs/Module4_1_Coverage_HMIS_National.png)

**2. Coverage calculated from HMIS data (admin area 2)**

![Coverage calculated from HMIS data at admin area 2 level.](../resources/default_outputs/Module4_2_Coverage_HMIS_Admin2.png)

**3. Coverage calculated from HMIS data (admin area 3)**

![Coverage calculated from HMIS data at admin area 3 level.](../resources/default_outputs/Module4_3_Coverage_HMIS_Admin3.png)

---


# Session 6: Creating a project

---


## Activity: Creating a Project

**In this hands-on session, we will:**

- Set up a new project
- Configure project settings
- Select indicators and time periods
- Apply best practices for project organization

*Participants will create their first project*

---


# Session 7: Creating visualizations

---


## Activity: Creating Visualizations

**In this hands-on session, we will:**

- Explore available chart types
- Create and customize visualizations
- Export charts for use in reports

*Participants will build visualizations from their analysis*

---


# <img src="../resources/icons/lunch.png" class="icon" style="height: 1.2em; vertical-align: middle; margin-right: 0.3em;"> Lunch Break

**90 minutes**

Back at 14:00

---


# Session 8: Creating reports

---


## Activity: Creating Reports

**In this hands-on session, we will:**

- Use report templates
- Generate automated reports
- Customize report content and layout

*Participants will create their first quarterly report draft*

---


# Day 3

---


# Recap

On Day 2, we covered:

- FASTR methods for data quality assessment and adjustment
- Creating and configuring projects in the platform
- Building visualizations from Zambia data
- Generating reports

---

# Day 3 Focus

Today we move from analysis to action:

- Deep dive into interpretation of results
- Create the Q4 2025 quarterly report
- Present findings to the group
- Develop action plans for continued work

---


# Session 8: Interpretation of visualizations

---


## Analytical thinking & interpretation

*Content to be developed*

This section will cover:
- Frameworks for interpreting FASTR outputs
- Connecting data patterns to programmatic meaning
- Common interpretation pitfalls to avoid
- Building analytical thinking skills

---


# Session 9: Creating a Q4 2025 report

---


## Generating quarterly reporting products

*Content to be developed*

This section will cover:
- Quarterly reporting workflow
- Using the FASTR platform for automated reports
- Quality assurance for reports
- Distribution and feedback mechanisms

---


# <img src="../resources/icons/lunch.png" class="icon" style="height: 1.2em; vertical-align: middle; margin-right: 0.3em;"> Lunch Break

**90 minutes**

Back at 14:00

---


# Session 10: Presenting reports

---


## End user mapping

End user mapping helps ensure that our outputs will meet the real needs of our end users.

### Key questions
1. **Who is my end user?**
2. **What does this end user need to accomplish with the report?**
3. **What information are they most interested in?**
4. **What do they like/not like about current reports?**
5. **How do they like to receive their information?**

---


# Day 4

---


# Recap

On Day 3, we covered:

- Interpretation of FASTR visualizations
- Creation of the Q4 2025 quarterly report
- Presentation of findings and group feedback
- Action planning for continued platform use

---

# Day 4 Focus

Today we design the Health Facility Assessment:

- Overview of the FASTR HFA phone survey
- Review questionnaire structure
- Adapt questionnaire for Zambia context
- Plan HFA priorities and data use

---


# Session 12: Overview of FASTR HFA phone survey

---


## Health Facility Assessment Phone Survey

*Placeholder: Content to be developed*

---


# <img src="../resources/icons/lunch.png" class="icon" style="height: 1.2em; vertical-align: middle; margin-right: 0.3em;"> Lunch Break

**90 minutes**

Back at 14:00

---



# Next Steps & Action Planning

Key actions to take after this working session:

- Finalize adapted phone survey questionnaire
- Complete first quarterly report draft
- Train remaining MoH team on data downloader tools
- Prepare roadmap for participation in Abuja workshop

---

# Quarterly Reporting Cycle

Establish a sustainable reporting rhythm:

- Define quarterly report timeline and responsibilities
- Set up data extraction schedule
- Establish review and approval process
- Plan dissemination to stakeholders

---

# Continued Platform Usage

Maintain momentum with the FASTR platform:

- Regular data updates and quality checks
- Expanding analysis to additional indicators
- Building capacity across MoH teams
- Documentation of lessons learned

---



# Workshop Closing

Thank you for your participation!

Over the past four days, we have:

- Configured the FASTR platform for Zambia
- Created the first quarterly RMNCAH-N report
- Adapted the HFA questionnaire for local context
- Built capacity for ongoing analysis and reporting

---

# Stay Connected

Continue the journey:

- Platform access and support
- Quarterly report submissions
- Multi-country workshop in Abuja
- Ongoing technical assistance from GFF team

---

# Thank You

FASTR Working Session - Zambia
January 27-30, 2026
Lusaka

---


# Contact Information

**FASTR Team**

<img src="../resources/icons/email.png" class="icon" style="height: 1em; vertical-align: middle;"> **Email:** 

<img src="../resources/icons/globe.png" class="icon" style="height: 1em; vertical-align: middle;"> **Website:** https://www.globalfinancingfacility.org/

---

