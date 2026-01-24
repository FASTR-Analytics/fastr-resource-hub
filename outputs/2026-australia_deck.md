---
marp: true
theme: fastr
paginate: true
---


<!-- _class: title-cover -->

![bg](../resources/backgrounds/cover_slide.png)

# STRENGTHENING HEALTH SYSTEMS AND RMNCAH-N OUTCOMES THROUGH RAPID CYCLE ANALYTICS AND DATA USE

**Country Workshop: Introduction to FASTR RMNCAH-N Service Use Monitoring**

Perth, Australia

Jan 10-12

---


<!-- _class: centered -->

# Welcome and Opening Remarks

![w:120](../resources/icons/lecture.png)

---


<!-- _class: centered -->

# Introductions

![w:120](../resources/icons/people_group.svg)

---



## What are we trying to achieve?

Rapid cycle analytics accelerates improvements in RMNCAH-N outcomes by increasing the systematic use of data for decision making

![w:700](../resources/diagrams/rapid_cycle_analytics.png)

---



## How can this be achieved?

Timely, rigorous, and low-cost approaches to monitoring PHC systems, underpinned by capacity building and data use support aligned with country demand and needs

![w:800](../resources/diagrams/Technical-Rapid-cycle-analytics--V3.svg)

---



## RMNCAH-N service use monitoring

<style scoped>
.split { display: flex !important; gap: 2rem; align-items: center; }
.split .text { flex: 1; }
.split .image { flex: 1; display: flex; justify-content: center; align-items: center; }
.split .image img { max-height: 420px !important; max-width: 100% !important; }
</style>

<div class="split">
<div class="text">

Rapid-cycle approaches using routine HMIS data can:

- **Evaluate HMIS data quality** at national and sub-national levels
- **Measure monthly changes** in health service utilization
- **Compare coverage trends** with country targets

</div>
<div class="image">

![HMIS data flow](../resources/diagrams/HMIS_data_flow.svg)

</div>
</div>

---



## What is FASTR?

An approach to catalyzing continuous 'analyze, learn, strengthen, act' cycles to drive the systematic use of timely data for decision making.

![w:700](../resources/diagrams/what_is_fastr.png)

---



## What is the FASTR approach to RMNCAH-N service use monitoring?

<div class="columns-image-right">
<div>

Quarterly analyses of DHIS2 data, focusing on prioritized national indicators

Building sustainable tools to ensure that stakeholders who need to use data can generate the right analysis and visualizations, at the right time, on their indicators of interest

Combining analysis and visualization with capacity strengthening and data use support for sustainability and institutionalization

</div>
<div>

![Steps to implement RMNCAH-N service use monitoring](../resources/diagrams/Steps%20to%20implement%20RMNCAH-N%20service%20chart.svg)

</div>
</div>

---


<!-- _class: agenda -->
# Agenda

**Day 1**

<table>
<tr style="background: #CAE6E9;"><th>Time</th><th>Agenda</th><th>Facilitator/Presenter</th></tr>
<tr><td>09:00</td><td>Title Slide</td><td></td></tr>
<tr><td></td><td>Workshop Objectives</td><td></td></tr>
<tr><td></td><td>Introduction to FASTR</td><td></td></tr>
<tr><td></td><td>Agenda</td><td></td></tr>
<tr><td></td><td>Data Extraction</td><td></td></tr>
<tr><td></td><td><em>Lunch Break</em></td><td></td></tr>
<tr><td></td><td>Identify Questions & Indicators</td><td></td></tr>
<tr><td></td><td><em>Tea Break</em></td><td></td></tr>
<tr><td></td><td>End of Day 1</td><td></td></tr>
<tr><td>09:00</td><td>Day 2 Recap</td><td></td></tr>
<tr><td></td><td>FASTR Analytics Platform</td><td></td></tr>
</table>

---

<!-- _class: agenda -->
# Agenda

**Day 2**

<table>
<tr style="background: #CAE6E9;"><th>Time</th><th>Agenda</th><th>Facilitator/Presenter</th></tr>
<tr><td></td><td>Data Quality Assessment</td><td></td></tr>
<tr><td></td><td><em>Tea Break</em></td><td></td></tr>
<tr><td></td><td>Data Quality Adjustment</td><td></td></tr>
<tr><td></td><td><em>Tea Break</em></td><td></td></tr>
<tr><td></td><td>End of Day 2</td><td></td></tr>
<tr><td></td><td>Day 3 Recap</td><td></td></tr>
<tr><td></td><td>Data Analysis</td><td></td></tr>
<tr><td></td><td><em>Lunch Break</em></td><td></td></tr>
<tr><td></td><td>Results Communication</td><td></td></tr>
<tr><td></td><td><em>Tea Break</em></td><td></td></tr>
<tr><td></td><td>Closing</td><td></td></tr>
<tr><td></td><td>Data Quality Assessment</td><td></td></tr>
</table>

---



## Show of hands...

![w:120](../resources/icons/raise-hand.png)

Do you regularly extract data from DHIS2?

If so, what are the primary reasons?

---



## Why would you extract data from DHIS2? Why not just do analysis in DHIS2 itself?

**Data quality adjustment**

The FASTR approach focuses on data quality adjustments to expand the analyses countries can do with DHIS2 data and to generate more robust estimates.

**Analysis complexity**

The FASTR approach uses more advanced statistical methods, such as regression analysis, which are not available in DHIS2. While DHIS2 can plot trends over time using raw data, FASTR can go further by identifying significant increases or decreases in service volume, adjusting for data quality issues, accounting for expected seasonal variations, and comparing key periods, such as before and after a reform.

The choice between DHIS2 and the FASTR approach should be guided by the specific purpose of your analysis. Select the tool that best aligns with your analytical needs!

---



<!-- _class: columns-image-right -->

## Data format and granularity

![Data format example](../workshops/2026-australia/media/data_format_example.png)

Data should be downloaded for each indicator of interest, at facility level, and monthly for the period of interest.

Data should be saved in long format meaning each row represents a single observation or measurement (see example).

Data should be saved in .csv format and can be saved in either a single .csv file or multiple .csv files which will be combined when uploading to the analysis platform.

---



## How much data?

**Initial FASTR analysis**

- Generally recommended to download approximately five years of historical data
- However, the exact period should be determined based on data availability, consistency in indicator definitions over time, and the specifics of a country's routine data system
- Ideally, using at least five years of historical data allows for a thorough assessment of trends over time

**Routine update to FASTR analysis**

- Start with the existing database and download new data covering the most recent months not previously included – this is usually a three-month period when the FASTR analysis is being implemented on a quarterly basis
- Additionally, include the three proceeding months to the new data time period, as this relatively recent data is often subject to changes due to late reporting or data quality adjustments
- If you have reason to believe there have been substantial changes to the historical data, you can always choose to redownload a longer time period

---



## Data extraction

<div class="columns">
<div>

We offer two tools for bulk DHIS2 data extraction: a user-friendly Data Downloader and a direct import feature within the FASTR analytics platform.

The Data Downloader provides a streamlined interface to download DHIS2 data. This tool is particularly useful to explore DHIS2 metadata and download indicators requiring disaggregated dimensions.

The Data Downloader is available at: https://github.com/worldbank/DHIS2-Downloader/releases/

</div>
<div>

![Data Downloader h:380](../resources/screenshots/data_downloader.png)

</div>
</div>

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

![demo h:35](../resources/icons/demo.svg) *Facilitator will demonstrate the Data Downloader*

---



## Data Downloader: Login

![Data Downloader login screen h:450](../resources/screenshots/data_downloader/01_login.png)

---



## Data Downloader: Overview

<div class="columns">
<div>

![Data Downloader overview h:380](../resources/screenshots/data_downloader/02_overview.png)

</div>
<div>

**Main interface**

- Browse available data elements and indicators
- Select time periods and organization units
- Configure download options
- Start data extraction

</div>
</div>

---



## Data Downloader: Download history

<div class="columns">
<div>

![Data Downloader history h:380](../resources/screenshots/data_downloader/03_history.png)

</div>
<div>

**Track your downloads**

- View all previous download sessions
- Re-download data with same parameters
- Access download logs and status
- Manage downloaded files

</div>
</div>

---



## Data Downloader: Data dictionary

<div class="columns">
<div>

![Data Downloader dictionary h:380](../resources/screenshots/data_downloader/04_dictionary.png)

</div>
<div>

**Explore available data**

- Browse all data elements from your DHIS2
- Search by name or code
- View metadata and definitions
- Identify indicators for your analysis

</div>
</div>

---



## Data Downloader: Facility list

<div class="columns">
<div>

![Data Downloader facility list h:380](../resources/screenshots/data_downloader/05_facility_list.png)

</div>
<div>

**Facility management**

- View complete facility list
- Filter by administrative level
- Search by facility name
- Export facility data

</div>
</div>

---



## Data Downloader: Facility map

<div class="columns">
<div>

![Data Downloader facility map h:380](../resources/screenshots/data_downloader/06_facility_map.png)

</div>
<div>

**Geographic visualization**

- Download GeoJSON boundary files
- Toggle administrative boundaries by level (Level 1 = country, Level 2 = regions, etc.)
- Higher levels display facility points
- Useful for verifying geographic structure

</div>
</div>

---


# <img src="../resources/icons/lunch.png" class="icon" style="height: 1.2em; vertical-align: middle; margin-right: 0.3em;"> Lunch Break

**60 minutes**

Back at 

---



## What is a data use case?

A data use case is a specific scenario where data is utilized to achieve a particular goal or solve a problem.

**Why is defining a data use case important?**

- Guides decision making by providing a clear framework for analysis
- Enhances efficiency by focusing analyses on a set of relevant key indicators to solve a specific data need
- Leads to better results by aligning data efforts with organizational goals

---



## What is our common data use case that will be the focus of this workshop?

Following large shifts in resource availability from external sources, many countries are experiencing abrupt and dramatic reductions in financing

- Resulting in critical gaps in programs and systems
- Leading to potentially severe effects on service delivery and health outcomes for women, children and adolescents

**Key questions arising:**

- What is the magnitude of the cuts, and what effect are they having on service delivery?
- What is the optimal way to prioritize remaining resources?
- What other adaptations can safeguard and strengthen essential service delivery for women, children and adolescents?

---



## How do we select indicators? What makes a good indicator for the FASTR analysis?

Indicator selection is critical to the quality and usefulness of FASTR analysis. Indicators should be chosen based on the following criteria:

- **Relevance** - Does this indicator provide data that aligns with our priority questions and objectives?
- **Volume** - Is this indicator collected at a high volume, which improves the robustness of analysis?
- **Completeness** - Does the indicator have a high completeness rate across reporting facilities?
- **Frequency** - Is the indicator reported frequently enough (e.g., monthly) to support rapid-cycle analysis?
- **Type** - Is this indicator a count of services delivered?

---



## Development of a data use case

*Content to be developed*

This section will cover:
- Co-creation workshop approach with MoH and stakeholders
- Data use case development guidance
- Example use cases from country implementations

---



## Defining priority questions

Effective data use relies on well-defined questions. Priority questions will guide the FASTR analysis and enhance decision making support.

**Qualities of a good question:**

- **Addresses a priority issue**: A topic of interest to you and policy makers
- **Relevant**: Important enough to be worth answering
- **Related to experiences that are alive**: Connected to current issues
- **Important to individuals/groups**: Matters to stakeholders
- **Answerable**: Can be addressed with available data and methods

---



## Is my question a relevant priority? 5+ Ws to consider

- **Who** is your audience?
- **What** do they need and want to know?
- **When** do they need to know it by?
- **When** is the event/intervention/period they are interested in?
- **Why** do they need to know?
- **How** will they use the findings?

---



## What do we mean by answerable?

**We have the data**
- Type, quantity, quality sufficient for the question

**We have the analysis tools/methods**
- Statistically valid; feasible to use

**We have the time**
- We can answer the question on a quarterly basis

---



<!-- Note: This slide was hidden in the original presentation but may be useful to include -->
## PICO framework for identifying answerable questions

A standard tool from evidence-based medicine and public health research for formulating clear, answerable questions.

| Component | Description |
|-----------|-------------|
| **P**opulation | Who is being investigated |
| **I**ntervention | What is being investigated |
| **C**omparison | What is baseline/non-intervention |
| **O**utcome | What is public health objective |

---



## What makes a good indicator for FASTR analysis?

- **Relevance**: Does this indicator align with our priority questions and objectives?
- **Volume**: Is this indicator collected at a high volume, improving robustness of analysis?
- **Completeness**: Does the indicator have a high completeness rate across reporting facilities?
- **Frequency**: Is the indicator reported frequently enough (e.g., monthly) to support rapid-cycle analysis?
- **Type**: Is this indicator a count of services delivered?

---



## Why focus on high-volume indicators?

One of the core strengths of the FASTR approach is its ability to adjust for data quality issues. High-volume indicators are better suited to this process because:

**Reduced sensitivity to outliers**
In low-volume indicators, individual data points can disproportionately affect trends.

**More stable estimates**
High-volume data reduce random variability and improve the reliability of trend detection.

**Clearer identification of true anomalies**
Larger counts make it easier to distinguish genuine outliers from natural variation.

---



## Why focus on high-completeness indicators?

Indicators with high reporting completeness are preferred because they:

**Improve data reliability**
More complete data reduces bias and provide a more representative picture of service delivery.

**Support consistent analysis**
High completeness enables meaningful comparisons across time and geographic areas.

**Reduce misinterpretation**
Incomplete data can falsely suggest changes in service utilization when changes are driven by reporting gaps rather than real trends.

While statistical methods such as imputation can be used to address incomplete data, these methods require assumptions about missing values.

---



## Why focus on count indicators?

**Limitations of proportion indicators**

- Proportions limit the ability to adjust numerators and denominators separately for data quality issues
- Numerators and denominators may each be affected by different sources of error
- Separating counts from denominator estimation allows for more transparent and flexible adjustment

**Mortality as a rare event**

- Mortality indicators are typically low-frequency and not well suited to adjustment
- These indicators are generally better analyzed using annual rather than monthly or quarterly data

---



## FASTR core indicators

The FASTR approach focuses on a core set of RMNCAH-N indicators that represent key points along the reproductive, maternal, newborn, child, and adolescent health and nutrition continuum in low- and middle-income countries.

These indicators typically have higher reporting volumes and completeness and serve as proxies for broader service delivery patterns.

- Antenatal client 1st visit
- Antenatal client 4th visit
- Institutional delivery
- Postnatal care 1
- BCG doses
- Pentavalent 1st dose
- Pentavalent 3rd dose
- Outpatient visits

---



<!-- _class: columns-image-right -->

## Countries have selected indicators to align with the disruptions context and country priorities

![Data prep checklist h:280](../resources/screenshots/data_prep_checklist.png)

The FASTR Data Prep Checklist has been shared with countries.

The checklist includes the FASTR core RMNCAH-N indicators.

Countries have added additional indicators that may be particularly relevant to the country context (e.g., indicators related to services expected to be impacted by recent funding shifts, priority indicators for the government and/or the WB project).

These are the indicators included in the current analysis. Countries can continue to add indicators over time as needed for their use case(s).

---



## Preparing for data extraction

*Content to be developed*

This section will cover:
- Pre-extraction checklist
- Understanding your DHIS2 configuration
- Mapping indicators to data elements
- Planning your extraction timeline

---


# <img src="../resources/icons/coffee.png" class="icon" style="height: 1.2em; vertical-align: middle; margin-right: 0.3em;"> Tea Break

**15 minutes**

Back at 

---


# See You Tomorrow!

**Day 1 Complete**

We resume tomorrow at **09:00**

---


## FASTR analytics platform

<div class="columns">
<div>

The FASTR analytics platform is a web-based tool designed to support data quality assessment, adjustment, and analysis for routine health data.

It allows users to upload and analyze data from various sources, including DHIS2, with built-in statistical methods to generate an adjusted dataset and run priority analyses on selected indicators.

The platform provides a user-friendly interface for running analyses and offers flexible options for visualizing and exporting results.

</div>
<div>

![FASTR platform h:380](../workshops/2026-australia/media/fastr_platform.png)

</div>
</div>

---



## Platform Capabilities

<style scoped>
p { text-align: center; }
img { display: block; margin: 0 auto; }
</style>

![Platform Capabilities h:420](../resources/diagrams/platform_capabilities.svg)

<p style="font-size: 0.8em; color: #666; margin-top: 0.5rem;">Data flows from import through analysis to shareable outputs.</p>

---



## Live Demo: Platform Access & Roles

![demo h:40](../resources/icons/demo.svg) **In this demo, we will:**

- Navigate to the FASTR platform
- Explore user roles: Administrator, Editor, Viewer
- Review user management and permissions
- Understand the workflow for uploading data and making analytical decisions

*Facilitator will demonstrate in the live platform*

---



## Country Instance

Each country has its own **instance** of the FASTR analytics platform.

An instance contains:

- All registered users and their accounts
- The shared administrative structure (regions, districts, facilities)
- Indicator definitions and data sources
- All projects created for that country

**Think of an instance as your country's dedicated workspace.**

---



## User Roles and Permissions

There are two levels of permissions in the platform:

&nbsp;

**Instance-level roles:**

- **Instance Administrators** can add users, create projects, assign roles, upload data, import and configure modules, and run analyses

&nbsp;

**Project-level roles:**

- **Project Editors** can create visualizations, create reports, and download/export results
- **Project Viewers** can view visualizations, view reports, and download/export results

&nbsp;

*Administrators are assigned per instance; Editors and Viewers are assigned per project.*

---



## Projects Within an Instance

<style scoped>
.container { display: flex; gap: 1rem; }
.container .img-col { flex: 2; }
.container .img-col img { width: 100%; height: auto; }
.container .text-col { flex: 1; font-size: 0.85em; }
</style>

<div class="container">
<div class="img-col">

![Projects within instance](../resources/diagrams/projects_within_instance.svg)

</div>
<div class="text-col">

Each country instance can contain **multiple projects**.

A country may only need one project, or multiple projects can be used for:

- Different versions of analyses
- A demo or playground project
- Separate projects for different teams or programs

**Key questions when setting up:**

- Who is the admin?
- Who can edit?
- Who can view?

</div>
</div>

---



## Practice: Logging Into the Platform

<style scoped>
table { border: none !important; background: transparent !important; width: 100% !important; }
table td, table th { border: none !important; background: transparent !important; padding: 8px !important; vertical-align: top !important; width: 50% !important; }
table img { max-height: 280px !important; width: auto !important; }
</style>

| | |
|:---|:---|
| ![Login page](../workshops/2026-australia/media/01_login_page.png) | ![Sign up form](../workshops/2026-australia/media/02_sign_up.png) |
| **1.** Go to https://australia.fastr-analytics.org | **2.** Click Sign up and enter your details |
| **3.** Enter your information (verify email) | **4.** After login, you'll be added to a project |

---



## Configuring the analysis platform

- Configuration of the analysis platform is an admin feature

- We will work together to configure the following items:
  - Admin areas (regions, districts)
  - Facility structure
  - Indicator definitions

- Note since this is an admin feature all participants will NOT be doing this step. Instead, you will select one person to have admin rights, and they will help us walk through these steps.

---



## Activity: Setting Up Admin Areas

![hands-on h:40](../resources/icons/hands_on.svg) **In this hands-on session, we will configure:**

- Admin areas (regions, districts)
- Facility structure
- Indicator definitions

*Participants will work directly in the platform*

---



## Activity: Importing Data

![hands-on h:40](../resources/icons/hands_on.svg) **In this hands-on session, we will:**

- Review data format requirements
- Walk through the import process
- Handle validation and error checking

*Participants will import their country's data*

---



## Activity: Installing and Running Modules

![hands-on h:40](../resources/icons/hands_on.svg) **In this hands-on session, we will:**

- Review available analysis modules
- Install required modules
- Run initial analyses

*Participants will configure and run modules on their data*

---



## Activity: Creating a Project

![hands-on h:40](../resources/icons/hands_on.svg) **In this hands-on session, we will:**

- Set up a new project
- Configure project settings
- Select indicators and time periods
- Apply best practices for project organization

*Participants will create their first project*

---



## Activity: Creating Visualizations

![hands-on h:40](../resources/icons/hands_on.svg) **In this hands-on session, we will:**

- Explore available chart types
- Create and customize visualizations
- Export charts for use in reports

*Participants will build visualizations from their analysis*

---



## Activity: Creating Reports

![hands-on h:40](../resources/icons/hands_on.svg) **In this hands-on session, we will:**

- Use report templates
- Generate automated reports
- Customize report content and layout

*Participants will create their first quarterly report draft*

---


# Day 2

---


## FASTR analytical pipeline

![Analytical Pipeline h:390](../resources/diagrams/analytical_pipeline.svg)

The FASTR analysis follows a sequential workflow where each step builds on the previous:

1. **Assess data quality** - Identify issues with completeness, outliers, and consistency
2. **Adjust for quality issues** - Apply corrections to improve data reliability
3. **Analyze adjusted data** - Generate service utilization and coverage estimates

---



## FASTR takes a multi-pronged approach to data quality, with the belief that data quality should not be a barrier to data use – with the right feedback loops, use of data can contribute to improved quality

- We do granular data quality assessments and adjustments based on facility-level data leveraging HMIS access with an API

- We use only high-volume indicators, because the most-used services provide more stable estimates

- We focus on variations across time and space rather than specific point estimates and discuss the interpretation and relevance for decision-making with in-country decision-makers

- We believe that using the data and providing feedback is the first step to improving the data

We will discuss each of these areas over the next sessions.

---
## Rationale for data quality assessment

**Challenge:** Routine health facility data may contain quality limitations:
- Reported values may fall outside plausible ranges
- Reporting gaps affect data completeness
- Inconsistencies exist between related indicators

&nbsp;

**Implications:** Data quality limitations affect decision-making
- Inaccurate assessments of service delivery trends
- Misidentification of areas requiring intervention
- Suboptimal resource allocation

---

## Assessing and adjusting for data quality

Quality assessments identify the highest priority issues and necessary analytical adjustments, so quality issues do not become a barrier to data analysis and use.

&nbsp;

**Objective 1: Enable analytical adjustment**

Systematic data quality assessment supports the application of targeted adjustments, enhancing the utility of HMIS data for evidence-based decision-making.

&nbsp;

**Objective 2: Monitor data quality trends**

Data quality assessment enables ongoing monitoring to:
- Inform indicator selection based on quality profiles across the HMIS
- Guide targeted data quality interventions and supportive supervision in areas with weaker data quality
- Evaluate the effectiveness of data quality improvement initiatives over time

---
## Measures of data quality

![Measures of data quality](../workshops/2026-australia/media/measures_data_quality.png)

---



## Measures of data quality - detailed (1/2)

| Domain | What does it measure? | How is it assessed? |
|--------|----------------------|---------------------|
| **Completeness** | Are all data present? | Reporting completeness: whether all units report. Indicator completeness: whether values are recorded for specific data elements |
| **Timeliness** | Are data regularly submitted on time? | Whether units submitted reports before the set deadline |

---



## Measures of data quality - detailed (2/2)

| Domain | What does it measure? | How is it assessed? |
|--------|----------------------|---------------------|
| **Consistency** | Are data plausible in view of what has been previously reported? | Presence of outliers, consistency over time, consistency between related indicators, external comparison with other data sources, consistency of population data |
| **Accuracy** | Do data faithfully reflect actual service delivery? | Review of source documents and comparison to monthly reports and HMIS values (data verification factor) |

---



## How does FASTR data quality analysis differ from DHIS2? (1/2)

**Purpose of data quality assessment**

- **DHIS2:** focuses on data quality assessment to routinely strengthen data quality over time
- **FASTR:** focuses on assessing data quality to inform an analysis which answers a pressing policy question

&nbsp;

**Data quality adjustment**

- **DHIS2:** focus is on identifying data quality issues and working with facilities to improve reporting practices
- **FASTR:** focus on applying analytical adjustment techniques to account for data quality issues in the analysis; goal is to generate the most robust estimates despite data quality challenges

---



## How does FASTR data quality analysis differ from DHIS2? (2/2)

**Selection of indicators, measures, and thresholds** – FASTR focuses on DQA elements most relevant for analysis

- The purpose of the data quality assessment guides the selection of indicators, measures, and thresholds

- DHIS2 allows configuration of a DQA dashboard for any selection of indicators; FASTR selects indicators that will be used in a specific analysis

- DHIS2 DQA includes timeliness as a measure of data quality. FASTR does not include timeliness - it is important for strengthening routine reporting but less important for analysis with available data

- DHIS2 DQA includes reporting completeness and indicator completeness while FASTR focuses only on indicator completeness

---



## Indicator completeness

<div style="display: flex; gap: 1.5em; align-items: flex-start;">
<div style="flex: 1;">

**What it measures:** The extent to which facilities report data on selected core indicators

**Why it matters:**
- Higher completeness improves data reliability
- Stability over time strengthens trend analysis

**Key distinction:**
Indicator completeness ≠ reporting completeness. This metric examines specific data elements, not just whether the monthly form was submitted.

</div>
<div style="flex: 2;">

![Completeness Illustration](../resources/diagrams/completeness_illustration.svg)

</div>
</div>

---

## Definition of indicator completeness

For the FASTR analysis, completeness is defined as:

**The percentage of reporting facilities each month out of the total number of facilities expected to report.**

- A facility is deemed to be "reporting" if there is a non-missing, non-zero value recorded for the indicator and month
- A facility is expected to report if it has reported any volume for that indicator anytime within a year
- Facilities that do not report for six or more consecutive months at the beginning or end of their reporting period are classified as **inactive** rather than incomplete. This prevents penalizing facilities that have not yet begun reporting or have permanently ceased operations

---

## Notes on completeness

- A high level of completeness does not necessarily indicate that the HMIS is representative of all service delivery in the country as some services may not be delivered in facilities, or some facilities may not report

- For countries where the DHIS2 system does not store 0's, indicator completeness may be underestimated if there are many low-volume facilities for a given indicator


---

## Completeness: Percent of monthly values that are complete

<p style="font-size: 0.9em; margin-bottom: 0.5rem;">For a given indicator in a given time period, the percent of monthly values that are complete:</p>

<p style="font-size: 0.9em;"><strong>% complete = # monthly values that are complete / total N of monthly values</strong></p>

![Indicator Completeness h:340](../resources/default_outputs/Default_2._Proportion_of_completed_records.png)

---



## Outliers

The presence of outliers examines whether a data point in a series of values is extreme (either abnormally high or low) in relation to others in the series.

Outliers can be the result of changes in programmatic activities (such as an intensified campaign) or can be data quality problems.

For the FASTR analysis, we identify outliers which are suspiciously high values compared to the usual volume of services reported by the facility (e.g., low values are not identified as outliers in the FASTR analysis).

---

## Outlier illustration

Region A displays an anomalous spike in February that substantially exceeds values reported by other regions — indicative of a data entry error or reporting issue.

![Outlier Impact](../resources/diagrams/outlier_impact.svg)

---

## Outlier detection methodology

Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator.

An outlier is defined as:

A value greater than **10 times the median absolute deviation (MAD)** from the monthly median value for the indicator in each time period, **OR** a value for which the proportional contribution in volume for a facility, indicator, and time period is **greater than 80%**

**AND** for which:

- The volume is **greater than or equal to the median**
- The volume is **not missing**
- The volume is **greater than 100**

---

## Outliers: Percent of monthly values that are outliers

For a given indicator in a given time period, the percent of monthly values that are outliers:

**% outliers = # monthly values that are outliers / total N of monthly values**

![Outliers h:340](../resources/default_outputs/Default_1._Proportion_of_outliers.png)

---



## Consistency between related indicators

Program indicators with a predictable relationship are examined to determine whether the expected relationship exists between them. In other words, this process examines whether the observed relationship between the indicators, as shown in the reported data, is that which is expected.

---

## Indicator pairs assessed

<div class="columns">
<div>

| Indicator pair | Expected relationship |
|----------------|----------------------|
| ANC1 / ANC4 | Ratio should be ≥ 0.95 |
| Penta1 / Penta3 | Ratio should be ≥ 0.95 |
| BCG / Facility delivery | Within 30% (≥0.7 and ≤1.3) |

These pairs have expected relationships. We expect ANC1 > ANC4 since not all women complete four visits.

BCG is a birth dose vaccine so we expect similar numbers to facility deliveries, with a 30% tolerance for variability.

</div>
<div>

![Consistency illustration h:280](../resources/diagrams/consistency_illustration.svg)

</div>
</div>

---

## Why assess consistency at district level?

<div style="display: flex; gap: 1.5em; align-items: flex-start;">
<div style="flex: 1;">

Patients often access different services at different facilities within a district:

- A woman may attend **ANC1** at a nearby health post, but travel to a health centre for **ANC4**
- A child may receive **Penta1** at a local clinic, but complete **Penta3** at a district hospital

Checking consistency at the facility level would miss these patterns. Aggregating to district level captures the complete picture of service utilization within a geographic area.

</div>
<div style="flex: 2;">

![District consistency](../resources/diagrams/district_consistency.svg)

</div>
</div>

---

## Internal consistency: FASTR output

![Internal Consistency h:420](../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

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

![Overall DQA Score h:340](../resources/default_outputs/Default_5._Overall_DQA_score.png)

---

## Mean DQA score: How close are we to adequate quality?

The mean DQA score shows how close a facility's data is to meeting all quality criteria. A score of **100% means the data passes** all DQA checks—no missing values, no outliers, and consistent reporting.

**Mean DQA = (completeness & outlier score + consistency score) / 2**


![Mean DQA Score h:320](../resources/default_outputs/Default_6._Mean_DQA_score.png)

---


# <img src="../resources/icons/coffee.png" class="icon" style="height: 1.2em; vertical-align: middle; margin-right: 0.3em;"> Tea Break

**15 minutes**

Back at 

---



## Data quality adjustment - Module 2

Correcting outliers and imputing missing values to improve data reliability

---

## Rationale for data quality adjustment

Routine HMIS data contain two common limitations that can distort analytical results:

| Issue | Impact on analysis |
|-------|-------------------|
| **Outliers** | Extreme values create artificial spikes in service volumes |
| **Incomplete reporting** | Missing data creates artificial declines that do not reflect actual service delivery |

FASTR addresses these limitations by replacing problematic values with estimates derived from each facility's historical reporting patterns.

---

## Adjustment scenarios

To support transparency and sensitivity analysis, FASTR produces four parallel datasets:

| Scenario | Description |
|----------|-------------|
| **Unadjusted** | Original reported values |
| **Outliers adjusted** | Extreme values replaced |
| **Completeness adjusted** | Missing values imputed |
| **Both adjusted** | All corrections applied |

---

## Indicators excluded from adjustment

Certain indicators are excluded from the adjustment process:

- **Mortality indicators** (maternal deaths, neonatal deaths, under-5 deaths): These represent discrete events where smoothing or imputation is not appropriate
- **Low-volume indicators**: Indicators that never exceed 100 reported events in any month are excluded from adjustment

---



## Outlier adjustment methodology

Outlier values are replaced using facility-specific historical data. The adjustment follows a hierarchical approach:

| Priority | Method | Application |
|----------|--------|-------------|
| 1 | Centered 6-month average | 3 months before + 3 months after the outlier |
| 2 | Forward 6-month average | When insufficient preceding data (e.g., start of series) |
| 3 | Backward 6-month average | When insufficient following data (e.g., end of series) |
| 4 | Same month, previous year | When rolling averages unavailable; useful for seasonal indicators |
| 5 | Facility historical mean | Mean of all valid values for this indicator at this facility |

---

## Outlier adjustment: FASTR output

![Percent change in volume due to outlier adjustment. h:380](../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

---



## Completeness adjustment methodology

For months identified as incomplete or missing, values are imputed using the same 6-month rolling average approach applied to outlier adjustment.

| Priority | Method | Application |
|----------|--------|-------------|
| 1 | Centered 6-month average | When sufficient data exists before and after the gap |
| 2 | Forward 6-month average | For gaps at the start of the time series |
| 3 | Backward 6-month average | For gaps at the end of the time series |
| 4 | Facility historical mean | Mean of all valid values for this indicator at this facility |

This approach prevents temporary reporting gaps from creating artificial declines in service volumes.

---

## Completeness adjustment: FASTR output

![Percent change in volume due to completeness adjustment. h:380](../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

---


# <img src="../resources/icons/coffee.png" class="icon" style="height: 1.2em; vertical-align: middle; margin-right: 0.3em;"> Tea Break

**15 minutes**

Back at 

---


# See You Tomorrow!

**Day 2 Complete**

We resume tomorrow at **09:00**

---


## Service utilization analysis - Module 3

Detecting and quantifying changes in health service delivery over time

---

## Objectives

**1. Measure changes in service volume**

Year-over-year comparison of service volumes identifies increases or decreases across regions and indicators.

**2. Detect and quantify disruptions**

Statistical comparison of observed volumes against expected levels—derived from historical trends and seasonal patterns—enables identification and quantification of service shortfalls or surpluses.

---

## Service utilization over time

![Service utilization over time h:420](../resources/default_outputs/Module3_5_Number_of_services_reported.png)

---



## Year-over-year change

**Year-over-year percent change** quantifies shifts in service delivery between consecutive years.

For each indicator and region, total volume in the current year is compared to the previous year:

**Percent change** = (Current year − Previous year) ÷ Previous year × 100

Changes exceeding **±10%** are flagged for review.

---

## Output: Change in service volume

<div style="display: flex; gap: 1.5em; align-items: flex-start;">
<div style="flex: 1.2;">

![Change in service volume h:340](../resources/default_outputs/Module3_1_Change_in_service_volume.png)

</div>
<div style="flex: 1;">

### Interpretation

**Bars** show annual service volumes by region. **Percentages** indicate year-over-year change.

**Key considerations:**
- Which regions exhibit the largest changes?
- Are changes consistent across regions or geographically concentrated?
- Do patterns vary by indicator?

</div>
</div>

---



## Disruption detection

Our approach to service disruptions and surpluses utilizes an interrupted time series regression with facility-level fixed effects. Previous large and unexpected changes in historical data are removed. Unexpected volume changes are estimated by comparing observed volume to expected volume based on historical trends and seasonality.

---

## Disruptions and surpluses

<div style="display: flex; gap: 1.5em; align-items: flex-start;">
<div style="flex: 1;">

**Disruptions** are flagged when volumes fall below anticipated levels, signaling potential barriers to access, resource shortages, or system failures.

**Surpluses** occur when volumes exceed expectations, which may indicate increased demand, over-reporting, or changes in service delivery.

</div>
<div style="flex: 2;">

![Disruption and surplus example h:300](../resources/diagrams/disruption_chart.png)

</div>
</div>

---

## How it works

**Using past data to set expectations:** We look at the past few years of data to understand the typical pattern for each month, accounting for regular seasonal changes.

**Spotting unusual changes:** We compare current service volumes to expectations. If we see volumes much higher or lower than expected, we flag it as an unusual change.

**Handling past disruptions:** We adjust historical data by removing previous big, unexpected changes so one-off events don't skew our understanding of what's "normal."

**Detecting disruptions over time:** We look at trends to see if there are clear shifts in health service use over several months.

---

## Comparison to DHIS2

Extension of service utilization analysis, using more complex statistical approaches not available in DHIS2.

Using a regression framework, we are able to:

- Account for seasonality
- Exclude unusual changes to ensure one-off events aren't influencing normal trends
- Use historical data as a baseline for context
- Detect disruptions and recovery patterns
- Quantify changes with a robust methodology as compared to just observing simple fluctuations in a trend line

This improves the ability to interpret and compare utilization data across national and sub-national areas without needing population denominators.

---



## Output: Actual vs expected (national)

![Actual vs expected national h:380](../resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

<p style="font-size: 0.8em; color: #666;">National-level comparison of observed service volumes against expected values derived from historical trends and seasonal patterns.

---

## Output: Actual vs expected (subnational)

![Actual vs expected subnational h:380](../resources/default_outputs/Module3_3_Actual_vs_expected_subnational.png)

<p style="font-size: 0.8em; color: #666;">Subnational disaggregation enables identification of geographic areas where disruptions are concentrated.

---



## Service coverage estimates - Module 4

Estimating the percentage of the target population that received a given health service

---

## Our approach to service coverage analysis

Our approach derives and validates population denominators, significantly improving coverage estimates reported from HMIS systems.

In countries with accurate data, this approach helps identify subnational inequities and updates outdated estimates, while in countries with less precise data, the trends still provide valuable insights into performance.

We use these estimates to track recent trends and subnational disparities in the coverage of selected health services.

---

## Two-part analytical process

The coverage estimation module operates in two sequential parts:

| Part | Components |
|------|------------|
| **Part 1: Denominator calculation** | Calculate target populations using multiple methods; compare against survey benchmarks; select optimal denominator for each indicator |
| **Part 2: Coverage estimation** | Apply denominator selections; project survey estimates forward using HMIS trends; generate final coverage estimates |

---



## What is service coverage?

**Service coverage** represents the proportion of the target population that received a specified health service.

![Coverage equation](../resources/diagrams/coverage_equation.svg)

---



## Denominators by service type

Each health indicator corresponds to a specific target population:

| Service | Target population (denominator) |
|---------|--------------------------------|
| ANC1, ANC4 | Pregnant women |
| Institutional delivery | Live births |
| BCG | Live births |
| Penta1, Penta3 | Infants surviving beyond neonatal period |
| Measles1, Measles2 | Infants surviving beyond infancy |

---



## Demographic cascade

Sequential demographic adjustments transform one target population estimate into another. Starting from pregnancies, demographic factors are applied to derive subsequent denominators:

![Denominator cascade flowchart](../resources/diagrams/denominator_cascade.svg)

---



## Denominator cascade: Illustration

<p style="font-size: 0.85em;">Starting from ANC1 service counts, demographic adjustment factors are applied sequentially to derive denominators for other services:</p>

![Denominator cascade example h:380](../resources/diagrams/denominator_cascade_example.svg)

---



## Forward and backward derivation

From any entry point, the cascade derives denominators in both directions:

| Direction | Method | Example from Penta1 |
|-----------|--------|---------------------|
| **Forward** | Apply mortality/attrition rates | DPT-eligible → Measles1-eligible → Measles2-eligible |
| **Backward** | Reverse mortality rates (add deaths back) | DPT-eligible → Live births → Births → Deliveries → Pregnancies |

Backward derivation enables estimation of upstream populations from downstream service counts.

---



## Denominators by entry point

<style scoped>
table { font-size: 0.75em; }
th, td { padding: 0.3em 0.5em !important; }
</style>

Each HMIS indicator serves as an entry point. The module derives all target populations via forward and backward cascades:

| Entry point | Base calculation | Forward derivation | Backward derivation |
|-------------|------------------|-------------------|---------------------|
| **ANC1** | ANC1 ÷ coverage → Pregnancies | Deliveries → Live births → DPT-eligible → Measles-eligible | — |
| **Deliveries** | Deliveries ÷ coverage → Deliveries | Live births → DPT-eligible → Measles-eligible | Pregnancies |
| **BCG** | BCG ÷ coverage → Live births | DPT-eligible → Measles-eligible | Deliveries → Pregnancies |
| **Penta1** | Penta1 ÷ coverage → DPT-eligible | Measles1-eligible → Measles2-eligible | Live births → Births → Deliveries → Pregnancies |
| **UN WPP** | Crude birth rate × population → Pregnancies, live births; Under-1 pop → DPT, measles | Applies mortality rates for measles denominators | — |

---



## Automatic denominator selection

For each indicator, the module selects the denominator that produces coverage closest to the survey benchmark.

**Selection algorithm:**

1. Calculate coverage using each denominator option
2. Calculate squared error against survey: $(coverage - survey)^2$
3. Apply selection hierarchy (HMIS-based denominators prioritized over UN WPP)
4. Select the HMIS-based denominator with minimum error

Selection is made per indicator and geographic area. Users may override automatic selections in Part 2.

---



## Coverage projection methodology

The module projects the most recent survey value forward using trends observed in HMIS-derived coverage:

![Coverage projection method](../resources/diagrams/coverage_projection.svg)

Year-over-year changes (deltas) in HMIS coverage are calculated and applied to the last survey value. This approach preserves the survey baseline while incorporating observed service delivery trends.

---



## Interpretation of coverage outputs

| Element | Description |
|---------|-------------|
| **Black line/points** | Survey data (DHS/MICS) — household survey reference |
| **Grey line/points** | HMIS-based coverage from facility data |
| **Red line/points** | Projected coverage — survey estimates extended using HMIS trends |

---



## Coverage (national)

<div style="display: flex; gap: 1.5em; align-items: flex-start;">
<div style="flex: 1.2;">

![Coverage calculated from HMIS data at national level. h:340](../resources/default_outputs/Module4_1_Coverage_HMIS_National.png)

</div>
<div style="flex: 1;">

### Interpretation

**Black line/points** show survey data (DHS/MICS) as the household survey reference. **Grey line/points** show HMIS-based coverage from facility data. **Red line/points** show projected coverage — survey estimates extended using HMIS trends.

</div>
</div>

---



## Coverage (subnational)

![Coverage calculated from HMIS data at admin area 2 level. h:420](../resources/default_outputs/Module4_2_Coverage_HMIS_Admin2.png)

---



## Coverage (subnational)

![Coverage calculated from HMIS data at subnational level. h:420](../resources/default_outputs/Module4_3_Coverage_HMIS_Subnational.png)

---


# <img src="../resources/icons/lunch.png" class="icon" style="height: 1.2em; vertical-align: middle; margin-right: 0.3em;"> Lunch Break

**60 minutes**

Back at 

---



## Analytical thinking & interpretation

Interpretation connects **data patterns** to **programmatic meaning**.

For every FASTR output, ask three questions:

1. **What does it show?** — Describe the pattern accurately
2. **Why might that be?** — Consider multiple explanations
3. **What should we do?** — Identify next steps or actions

<small>*Moving from numbers to insights requires context, critical thinking, and programmatic knowledge.*</small>

---



## Moving from data to key messages

### What is a result?
Results are what the analysis found (data quality scores, coverage estimations, service utilization numbers). They are often many in number, complex, hard to understand 'at a glance', and lacking interpretation.

### What is a key takeaway?
Key takeaways are what the results are telling us — why the results matter, the 'so what'. They should be few in number, simple and clear, easy to remember, and actionable.

---



## Dissemination and data use roadmap

A data use roadmap is a strategic plan that outlines how data will be utilized, shared, and disseminated effectively.

### Why is it important?
- Establishes metrics to evaluate the success of data use
- Identifies key stakeholders, target audiences, and dissemination platforms
- Outlines steps needed to achieve data dissemination goals
- Anticipates potential challenges and develops strategies to solve for them

---



## Presenting reports and group feedback

*Content to be developed*

---



## Generating quarterly reporting products

*Content to be developed*

This section will cover:
- Quarterly reporting workflow
- Using the FASTR platform for automated reports
- Quality assurance for reports
- Distribution and feedback mechanisms

---


# <img src="../resources/icons/coffee.png" class="icon" style="height: 1.2em; vertical-align: middle; margin-right: 0.3em;"> Tea Break

**15 minutes**

Back at 

---



# Contact Information

**FASTR Team**

**Email:** 

**Website:** https://www.globalfinancingfacility.org/

---



## FASTR analytical pipeline

![Analytical Pipeline h:390](../resources/diagrams/analytical_pipeline.svg)

The FASTR analysis follows a sequential workflow where each step builds on the previous:

1. **Assess data quality** - Identify issues with completeness, outliers, and consistency
2. **Adjust for quality issues** - Apply corrections to improve data reliability
3. **Analyze adjusted data** - Generate service utilization and coverage estimates

---



## FASTR takes a multi-pronged approach to data quality, with the belief that data quality should not be a barrier to data use – with the right feedback loops, use of data can contribute to improved quality

- We do granular data quality assessments and adjustments based on facility-level data leveraging HMIS access with an API

- We use only high-volume indicators, because the most-used services provide more stable estimates

- We focus on variations across time and space rather than specific point estimates and discuss the interpretation and relevance for decision-making with in-country decision-makers

- We believe that using the data and providing feedback is the first step to improving the data

We will discuss each of these areas over the next sessions.

---
## Rationale for data quality assessment

**Challenge:** Routine health facility data may contain quality limitations:
- Reported values may fall outside plausible ranges
- Reporting gaps affect data completeness
- Inconsistencies exist between related indicators

&nbsp;

**Implications:** Data quality limitations affect decision-making
- Inaccurate assessments of service delivery trends
- Misidentification of areas requiring intervention
- Suboptimal resource allocation

---

## Assessing and adjusting for data quality

Quality assessments identify the highest priority issues and necessary analytical adjustments, so quality issues do not become a barrier to data analysis and use.

&nbsp;

**Objective 1: Enable analytical adjustment**

Systematic data quality assessment supports the application of targeted adjustments, enhancing the utility of HMIS data for evidence-based decision-making.

&nbsp;

**Objective 2: Monitor data quality trends**

Data quality assessment enables ongoing monitoring to:
- Inform indicator selection based on quality profiles across the HMIS
- Guide targeted data quality interventions and supportive supervision in areas with weaker data quality
- Evaluate the effectiveness of data quality improvement initiatives over time

---
## Measures of data quality

![Measures of data quality](../workshops/2026-australia/media/measures_data_quality.png)

---



## Measures of data quality - detailed (1/2)

| Domain | What does it measure? | How is it assessed? |
|--------|----------------------|---------------------|
| **Completeness** | Are all data present? | Reporting completeness: whether all units report. Indicator completeness: whether values are recorded for specific data elements |
| **Timeliness** | Are data regularly submitted on time? | Whether units submitted reports before the set deadline |

---



## Measures of data quality - detailed (2/2)

| Domain | What does it measure? | How is it assessed? |
|--------|----------------------|---------------------|
| **Consistency** | Are data plausible in view of what has been previously reported? | Presence of outliers, consistency over time, consistency between related indicators, external comparison with other data sources, consistency of population data |
| **Accuracy** | Do data faithfully reflect actual service delivery? | Review of source documents and comparison to monthly reports and HMIS values (data verification factor) |

---



## How does FASTR data quality analysis differ from DHIS2? (1/2)

**Purpose of data quality assessment**

- **DHIS2:** focuses on data quality assessment to routinely strengthen data quality over time
- **FASTR:** focuses on assessing data quality to inform an analysis which answers a pressing policy question

&nbsp;

**Data quality adjustment**

- **DHIS2:** focus is on identifying data quality issues and working with facilities to improve reporting practices
- **FASTR:** focus on applying analytical adjustment techniques to account for data quality issues in the analysis; goal is to generate the most robust estimates despite data quality challenges

---



## How does FASTR data quality analysis differ from DHIS2? (2/2)

**Selection of indicators, measures, and thresholds** – FASTR focuses on DQA elements most relevant for analysis

- The purpose of the data quality assessment guides the selection of indicators, measures, and thresholds

- DHIS2 allows configuration of a DQA dashboard for any selection of indicators; FASTR selects indicators that will be used in a specific analysis

- DHIS2 DQA includes timeliness as a measure of data quality. FASTR does not include timeliness - it is important for strengthening routine reporting but less important for analysis with available data

- DHIS2 DQA includes reporting completeness and indicator completeness while FASTR focuses only on indicator completeness

---



## Indicator completeness

<div style="display: flex; gap: 1.5em; align-items: flex-start;">
<div style="flex: 1;">

**What it measures:** The extent to which facilities report data on selected core indicators

**Why it matters:**
- Higher completeness improves data reliability
- Stability over time strengthens trend analysis

**Key distinction:**
Indicator completeness ≠ reporting completeness. This metric examines specific data elements, not just whether the monthly form was submitted.

</div>
<div style="flex: 2;">

![Completeness Illustration](../resources/diagrams/completeness_illustration.svg)

</div>
</div>

---

## Definition of indicator completeness

For the FASTR analysis, completeness is defined as:

**The percentage of reporting facilities each month out of the total number of facilities expected to report.**

- A facility is deemed to be "reporting" if there is a non-missing, non-zero value recorded for the indicator and month
- A facility is expected to report if it has reported any volume for that indicator anytime within a year
- Facilities that do not report for six or more consecutive months at the beginning or end of their reporting period are classified as **inactive** rather than incomplete. This prevents penalizing facilities that have not yet begun reporting or have permanently ceased operations

---

## Notes on completeness

- A high level of completeness does not necessarily indicate that the HMIS is representative of all service delivery in the country as some services may not be delivered in facilities, or some facilities may not report

- For countries where the DHIS2 system does not store 0's, indicator completeness may be underestimated if there are many low-volume facilities for a given indicator


---

## Completeness: Percent of monthly values that are complete

<p style="font-size: 0.9em; margin-bottom: 0.5rem;">For a given indicator in a given time period, the percent of monthly values that are complete:</p>

<p style="font-size: 0.9em;"><strong>% complete = # monthly values that are complete / total N of monthly values</strong></p>

![Indicator Completeness h:340](../resources/default_outputs/Default_2._Proportion_of_completed_records.png)

---



## Outliers

The presence of outliers examines whether a data point in a series of values is extreme (either abnormally high or low) in relation to others in the series.

Outliers can be the result of changes in programmatic activities (such as an intensified campaign) or can be data quality problems.

For the FASTR analysis, we identify outliers which are suspiciously high values compared to the usual volume of services reported by the facility (e.g., low values are not identified as outliers in the FASTR analysis).

---

## Outlier illustration

Region A displays an anomalous spike in February that substantially exceeds values reported by other regions — indicative of a data entry error or reporting issue.

![Outlier Impact](../resources/diagrams/outlier_impact.svg)

---

## Outlier detection methodology

Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator.

An outlier is defined as:

A value greater than **10 times the median absolute deviation (MAD)** from the monthly median value for the indicator in each time period, **OR** a value for which the proportional contribution in volume for a facility, indicator, and time period is **greater than 80%**

**AND** for which:

- The volume is **greater than or equal to the median**
- The volume is **not missing**
- The volume is **greater than 100**

---

## Outliers: Percent of monthly values that are outliers

For a given indicator in a given time period, the percent of monthly values that are outliers:

**% outliers = # monthly values that are outliers / total N of monthly values**

![Outliers h:340](../resources/default_outputs/Default_1._Proportion_of_outliers.png)

---



## Consistency between related indicators

Program indicators with a predictable relationship are examined to determine whether the expected relationship exists between them. In other words, this process examines whether the observed relationship between the indicators, as shown in the reported data, is that which is expected.

---

## Indicator pairs assessed

<div class="columns">
<div>

| Indicator pair | Expected relationship |
|----------------|----------------------|
| ANC1 / ANC4 | Ratio should be ≥ 0.95 |
| Penta1 / Penta3 | Ratio should be ≥ 0.95 |
| BCG / Facility delivery | Within 30% (≥0.7 and ≤1.3) |

These pairs have expected relationships. We expect ANC1 > ANC4 since not all women complete four visits.

BCG is a birth dose vaccine so we expect similar numbers to facility deliveries, with a 30% tolerance for variability.

</div>
<div>

![Consistency illustration h:280](../resources/diagrams/consistency_illustration.svg)

</div>
</div>

---

## Why assess consistency at district level?

<div style="display: flex; gap: 1.5em; align-items: flex-start;">
<div style="flex: 1;">

Patients often access different services at different facilities within a district:

- A woman may attend **ANC1** at a nearby health post, but travel to a health centre for **ANC4**
- A child may receive **Penta1** at a local clinic, but complete **Penta3** at a district hospital

Checking consistency at the facility level would miss these patterns. Aggregating to district level captures the complete picture of service utilization within a geographic area.

</div>
<div style="flex: 2;">

![District consistency](../resources/diagrams/district_consistency.svg)

</div>
</div>

---

## Internal consistency: FASTR output

![Internal Consistency h:420](../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

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

![Overall DQA Score h:340](../resources/default_outputs/Default_5._Overall_DQA_score.png)

---

## Mean DQA score: How close are we to adequate quality?

The mean DQA score shows how close a facility's data is to meeting all quality criteria. A score of **100% means the data passes** all DQA checks—no missing values, no outliers, and consistent reporting.

**Mean DQA = (completeness & outlier score + consistency score) / 2**


![Mean DQA Score h:320](../resources/default_outputs/Default_6._Mean_DQA_score.png)

---


# Contact Information

**FASTR Team**

**Email:** 

**Website:** https://www.globalfinancingfacility.org/

---

