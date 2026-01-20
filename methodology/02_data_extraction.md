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

<!-- SLIDE:m2_1 -->
## Why extract data from DHIS2?

### Data quality adjustment

The FASTR approach focuses on data quality adjustments to expand the analyses countries can do with DHIS2 data and to generate more robust estimates.

The FASTR methodology includes specific approaches to:
- Identify and adjust for outliers
- Adjust for incomplete reporting
- Apply consistent data quality metrics

These adjustments require processing that cannot be done within DHIS2's native analytics.
<!-- /SLIDE -->

<!-- SLIDE:m2_1a -->
## Why extract data from DHIS2?

### Analysis complexity

The FASTR approach uses more advanced statistical methods, such as regression analysis, which are not available in DHIS2. While DHIS2 can plot trends over time using raw data, FASTR can go further by:

- Identifying significant increases or decreases in service volume
- Adjusting for data quality issues
- Accounting for expected seasonal variations
- Comparing key periods, such as before and after a reform

The choice between DHIS2 and the FASTR approach should be guided by the specific purpose of your analysis.
<!-- /SLIDE -->

<!-- SLIDE:m2_1b -->
## Data format and granularity

Data should be downloaded for each **indicator of interest**, at **facility level**, and **monthly** for the **period of interest**.

- Data should be saved in **long format** meaning each row represents a single observation or measurement
- Data should be saved in **.csv format** and can be saved in either a single .csv file or multiple .csv files

### Why monthly facility level data?

We want to use the most granular data we have access to in order to make more fine tuned assessments for data quality. Using monthly facility level data allows us to conduct the most robust analysis.
<!-- /SLIDE -->

<!-- SLIDE:m2_1c -->
## Key variables

The data extracted should include the following required elements:

| Element | Description |
|---------|-------------|
| Org units | Organizational unit identifier |
| Period | Time period of the data |
| Indicator name | Name of the indicator |
| Total/count | The aggregated value |
<!-- /SLIDE -->

<!-- SLIDE:m2_1d -->
## How much data?

### Initial FASTR analysis
- Download approximately **five years** of historical data
- Exact period depends on data availability and consistency in indicator definitions

### Routine update to FASTR analysis
- Download new data covering the most recent months not previously included (usually **three months** for quarterly implementation)
- Include the **three preceding months** as recent data is often subject to changes due to late reporting or data quality adjustments
<!-- /SLIDE -->

<!-- SLIDE:m2_2 -->
## Data extraction tools

We offer two tools for bulk DHIS2 data extraction:

**API Script** (Google Colab)
- Input login credentials, specify timeframes, indicators, and administrative levels
- Download data as a .csv file

**Data Downloader**
- More intuitive, streamlined interface
- Recommended for most users

Both tools enable efficient data extraction, and we provide training resources to support their use.
<!-- /SLIDE -->

<!-- SLIDE:m2_2a -->
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
<!-- /SLIDE -->

<!-- SLIDE:m2_2b -->
## Data Downloader: Login

![Data Downloader login screen h:420](../resources/screenshots/data_downloader/01_login.png)

<p style="font-size: 0.8em; color: #666; margin-top: 0.5rem;">Enter your DHIS2 instance URL and credentials to connect.</p>
<!-- /SLIDE -->

<!-- SLIDE:m2_2c -->
## Data Downloader: Overview

![Data Downloader overview h:420](../resources/screenshots/data_downloader/02_overview.png)

<p style="font-size: 0.8em; color: #666; margin-top: 0.5rem;">The main interface displays available data elements and download options.</p>
<!-- /SLIDE -->

<!-- SLIDE:m2_2d -->
## Data Downloader: Download history

![Data Downloader history h:420](../resources/screenshots/data_downloader/03_history.png)

<p style="font-size: 0.8em; color: #666; margin-top: 0.5rem;">Track previous downloads and re-download data as needed.</p>
<!-- /SLIDE -->

<!-- SLIDE:m2_2e -->
## Data Downloader: Data dictionary

![Data Downloader dictionary h:420](../resources/screenshots/data_downloader/04_dictionary.png)

<p style="font-size: 0.8em; color: #666; margin-top: 0.5rem;">Browse and search available data elements and indicators from your DHIS2 instance.</p>
<!-- /SLIDE -->

<!-- SLIDE:m2_2f -->
## Data Downloader: Facility list

![Data Downloader facility list h:420](../resources/screenshots/data_downloader/05_facility_list.png)

<p style="font-size: 0.8em; color: #666; margin-top: 0.5rem;">View and filter facilities by administrative level and organization unit.</p>
<!-- /SLIDE -->

<!-- SLIDE:m2_2g -->
## Data Downloader: Facility map

![Data Downloader facility map h:420](../resources/screenshots/data_downloader/06_facility_map.png)

<p style="font-size: 0.8em; color: #666; margin-top: 0.5rem;">Visualize facility locations on an interactive map.</p>
<!-- /SLIDE -->

---

**Last updated**: 07-01-2026
**Contact**: FASTR Project Team
