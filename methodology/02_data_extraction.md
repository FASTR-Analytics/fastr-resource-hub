# Data extraction

> **Note:** Content in this section draws on existing FASTR presentation materials and is subject to revision.

## Overview

This section describes the rationale, requirements, and recommended practices for extracting routine service delivery data from DHIS2 for use in the FASTR analytical pipeline.

### Why extract data from DHIS2?

**Data quality adjustment**

The FASTR approach prioritizes systematic data quality adjustment to enable more rigorous use of routine DHIS2 data and to generate analytically robust, policy-relevant estimates. The methodology includes standardized procedures to:

- Identify and adjust for outliers  
- Adjust for incomplete reporting  
- Apply consistent data quality metrics across indicators and facilities  

These procedures require data processing and statistical operations that cannot be implemented within DHIS2’s native analytics environment.

**Analysis complexity**

FASTR applies analytical methods—most notably regression-based techniques—that extend beyond the descriptive trend analysis available in DHIS2. While DHIS2 supports visualization of raw service delivery trends, FASTR enables additional analytical capabilities, including:

- Identification of statistically significant increases or decreases in service volumes  
- Adjustment for data quality limitations  
- Explicit accounting for expected seasonal variation  
- Comparison of service delivery across key periods, such as before and after policy reforms, shocks, or disruptions  

The choice between relying solely on DHIS2 analytics and applying the FASTR approach should be guided by the intended analytical purpose. FASTR is designed for analyses that require greater statistical rigor, comparability over time, and consistency across geographic levels.

!!! warning "Extract counts, not percentages"

    The FASTR pipeline requires **raw service counts** — the actual number of events reported by each facility each month (e.g., *"152 children received Penta1 at this facility in March 2024"*). It does **not** accept percentages, proportions, rates, or pre-calculated coverage figures.

    **Why this matters:**

    - **Outlier detection works on magnitude.** A facility reporting 850 ANC1 visits when its usual range is 100–200 is obviously an outlier. The same facility reporting *"92% coverage"* tells us nothing — the percentage is bounded by 100, hides the underlying volume, and erases the signal we use to flag reporting errors.
    - **Counts can be added across facilities; percentages cannot.** To get a regional or national total, the platform sums facility counts. Averaging percentages across facilities of different sizes gives the wrong answer (a 100-bed hospital and a 5-bed health post would weigh equally).
    - **The platform builds the denominator itself.** Module 5 derives the target population (pregnant women, infants, etc.) from HMIS data, surveys, and UN projections. Module 6 then calculates coverage as `count ÷ denominator`. If you feed in a coverage % directly, there is no count to divide and no comparison to make.
    - **Adjustment imputes counts.** Modules 1 and 2 detect outliers using statistical thresholds on raw values and fill missing months using rolling averages of past counts. Both methods are statistically meaningless on percentages.

    **What to extract:** the numerator only — number of services delivered, doses given, visits recorded, deaths registered, etc. The platform handles aggregation, adjustment, and coverage calculation.

    **Common pitfalls to avoid:**

    - DHIS2 *"data elements"* that store coverage % directly (e.g. `ANC1 coverage rate`) — extract the underlying count instead (e.g. `ANC1 visits — first contact`).
    - Indicators pre-aggregated by month or quarter at the district level — extract facility-month rows instead.
    - Computed indicators like *"% of fully immunized children"* — feed in the underlying components separately (BCG, Penta1, Measles1, etc.).

### What format and granularity is required?

Data should be extracted for each **indicator of interest**, at **facility level**, and at a **monthly** time step for the **period of analysis**.

- Data must be stored in **long format**, with one row per observation  
- Data should be saved in **.csv format**  
- Data may be stored in a single file or split across multiple files, which can be combined during upload to the analysis platform  

**Why monthly facility-level data?**

Using the most granular data available enables more precise assessment of reporting patterns and data quality issues. Monthly, facility-level data allow for robust adjustment of reporting completeness, identification of facility-specific anomalies, and estimation of trends over time while accounting for seasonal variation. This level of granularity supports full implementation of the FASTR methodology.

### Key variables

The extracted dataset should include the following minimum set of variables:

| Element | Description |
|--------|-------------|
| Org units | Organizational unit identifier |
| Period | Time period of the observation |
| Indicator name | Name of the indicator |
| Total / count | Aggregated indicator value |

**Organisational unit terms**

| Term | Description |
|------|-------------|
| `orgunitlevel1` | Highest administrative level (e.g., country) |
| `orgunitlevel2` | Intermediate administrative level (e.g., state or province) |
| `orgunitlevel3` | District or equivalent |
| `orgunitlevel4` | Sub-district or health facility |
| `orgunitlevel5` | Unit or department within a facility |
| `organisationunitid` | Unique DHIS2 identifier for the organizational unit |
| `organisationunitname` | Name of the organizational unit |
| `organisationunitcode` | Standardized organizational unit code |
| `organisationunitdescription` | Description of the organizational unit |

**Period terms**

| Term | Description |
|------|-------------|
| `periodid` | Unique identifier for the reporting period |
| `periodname` | Human-readable period label (e.g., January 2024, Q1 2024) |
| `periodcode` | Standardized period code (e.g., 202401) |
| `perioddescription` | Description including period start and end dates |

**Data element terms**

| Term | Description |
|------|-------------|
| `dataid` | Unique identifier for the data element |
| `dataname` | Name of the data element |
| `datacode` | Standardized data element code |
| `datadescription` | Description of the data element |

**Other terms**

| Term | Description |
|------|-------------|
| `total` | Aggregated value for the data element by organizational unit and period |
| `date_downloaded` | Date of data extraction, for audit and version control |

### How much data?

**Initial FASTR analysis**

For initial implementation, it is generally recommended to extract approximately **five years of historical data**. The appropriate time window should be determined based on:

- Data availability and completeness  
- Consistency of indicator definitions over time  
- Characteristics of the national routine data system  

A multi-year time series improves the reliability of trend estimation and seasonal adjustment.

**Routine update to FASTR analysis**

For routine updates (e.g., quarterly implementation):

- Begin with the existing FASTR database and extract data for the most recent months not yet included (typically a **three-month period**)  
- Re-extract the **three preceding months** to account for late reporting or revisions to recent data  
- If substantial revisions to historical data are suspected, consider re-extracting a longer historical period  

### Tools for data extraction

*Full documentation content to be developed.*

This section will cover:
- DHIS2 data export options  
- API-based extraction methods  
- Data transformation requirements  
- Quality assurance checks on extracted data  

---

<!--
////////////////////////////////////////////////////////////////////
//                                                                //
//   _____ _     _____ ____  _____    ____ ___  _   _ _____ _   _ //
//  / ____| |   |_   _|  _ \| ____|  / ___/ _ \| \ | |_   _| \ | |//
//  | (___ | |     | | | | | | |__   | |  | | | |  \| | | | |  \| |//
//   \___ \| |     | | | | | |  __|  | |  | | | | . ` | | | | . ` |//
//   ____) | |___ _| |_| |_| | |____ | |__| |_| | |\  | | | | |\  |//
//  |_____/|_____|_____|____/|______| \____\___/|_| \_| |_| |_| \_|//
//                                                                //
//            Edit workshop slides below this line                //
//                                                                //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m2_0 -->
## Show of hands...

![w:120](../resources/icons/raise-hand.svg)

Do you regularly extract data from DHIS2?

If so, what are the primary reasons?
<!-- /SLIDE -->

<!-- SLIDE:m2_1 -->
## Why would you extract data from DHIS2? Why not just do analysis in DHIS2 itself?

**Data quality adjustment**

The FASTR approach focuses on data quality adjustments to expand the analyses countries can do with DHIS2 data and to generate more robust estimates.

**Analysis complexity**

The FASTR approach uses more advanced statistical methods, such as regression analysis, which are not available in DHIS2. While DHIS2 can plot trends over time using raw data, FASTR can go further by identifying significant increases or decreases in service volume, adjusting for data quality issues, accounting for expected seasonal variations, and comparing key periods, such as before and after a reform.

The choice between DHIS2 and the FASTR approach should be guided by the specific purpose of your analysis. Select the tool that best aligns with your analytical needs!
<!-- /SLIDE -->

<!-- SLIDE:m2_1a -->
## Extract counts, not percentages

FASTR analyses **raw service counts**, not percentages, proportions, or pre-calculated coverage figures.

<div class="columns">
<div>

| Do extract | Do **not** extract |
|------------|--------------------|
| ANC1 visits per facility per month | ANC1 coverage rate (%) |
| Penta1 doses administered | Vaccination coverage proportion |
| Facility deliveries | Pre-calculated coverage indicators |

</div>
<div>

**Why counts, not percentages?**

- Outliers cannot be detected on a percentage: it caps at 100 and hides the underlying volume.
- Percentages cannot be summed across facilities of different sizes to produce a regional total.
- The platform builds coverage itself from counts and population denominators (**Modules 5 & 6**).
- Outlier and completeness adjustments (**Modules 1 & 2**) require raw counts to run.

</div>
</div>

<!--
PRESENTER NOTES:
- This is the most important rule for data extraction.
- Common mistake: pulling DHIS2 "data elements" that already store coverage %.
- Always extract the numerator (count of services); the platform handles the rest.
- If the DHIS2 indicator says "rate", "%", or "proportion", it is the wrong field.
- Concrete example to anchor the rule: ANC1 visits (count) vs ANC1 coverage rate (%).
-->
<!-- /SLIDE -->

<!-- SLIDE:m2_1b -->
<!-- _class: columns-image-right -->

## Data format and granularity

![h:200 Data format wide](resources/screenshots/data_format_wide.png)

- Data should be downloaded for each **indicator of interest**, at **facility level**, and **monthly** for the **period of interest**
- Data should be saved in long format meaning each row represents a single observation or measurement (see example)
- Data should be saved in .csv format and can be saved in either a single .csv file or multiple .csv files which will be combined when uploading to the analysis platform

<!--
PRESENTER NOTES:
- We want to use the most granular data we have access to in order to make more fine-tuned assessments for data quality and adjustments
- We also want to be able to look at trends over time, accounting for things like seasonality
- Using monthly facility-level data allows us to conduct the most robust analysis
-->
<!-- /SLIDE -->

<!-- SLIDE:m2_1d -->
## How much data?

**Initial FASTR analysis**

- Generally recommended to download approximately five years of historical data
- However, the exact period should be determined based on data availability, consistency in indicator definitions over time, and the specifics of a country's routine data system
- Ideally, using at least five years of historical data allows for a thorough assessment of trends over time

**Routine update to FASTR analysis**

- Start with the existing database and download new data covering the most recent months not previously included – this is usually a three-month period when the FASTR analysis is being implemented on a quarterly basis
- Additionally, include the three proceeding months to the new data time period, as this relatively recent data is often subject to changes due to late reporting or data quality adjustments
- If you have reason to believe there have been substantial changes to the historical data, you can always choose to redownload a longer time period
<!-- /SLIDE -->

<!-- SLIDE:m2_2 -->
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
<!-- /SLIDE -->

<!-- SLIDE:m2_2a -->
## Data extraction

The **FASTR analytics platform** contains a direct import feature to automatically import data from DHIS2. This is often the easiest approach once indicators have been identified for inclusion in the platform.

![h:200 Direct import feature](resources/screenshots/platform/direct_import_1.png)

![h:200 Direct import interface](resources/screenshots/platform/direct_import_2.png)

<!-- /SLIDE -->

<!-- SLIDE:m2_2b -->
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
<!-- /SLIDE -->

<!-- SLIDE:m2_2c -->
## Data Downloader: Login

![Data Downloader login screen h:450](../resources/screenshots/data_downloader/01_login.png)

<!--
PRESENTER NOTES:
- Practice downloading data + facility backbone
- Need to review levels at which facilities are reported to know if we can use direct import feature
-->
<!-- /SLIDE -->

<!-- SLIDE:m2_2d -->
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
<!-- /SLIDE -->

<!-- SLIDE:m2_2e -->
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
<!-- /SLIDE -->

<!-- SLIDE:m2_2f -->
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
<!-- /SLIDE -->

<!-- SLIDE:m2_2g -->
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
<!-- /SLIDE -->

<!-- SLIDE:m2_2h -->
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
<!-- /SLIDE -->

---

**Contact**: <fastr@worldbank.org>
