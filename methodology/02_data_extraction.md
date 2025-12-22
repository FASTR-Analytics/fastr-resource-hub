# Data Extraction

This module covers the process of extracting data from DHIS2 for use in FASTR analyses.

## Overview

### Why Extract Data from DHIS2?

**Data Quality Adjustment**

The FASTR approach focuses on data quality adjustments to expand the analyses countries can do with DHIS2 data and to generate more robust estimates. The FASTR methodology includes specific approaches to:
- Identify and adjust for outliers
- Adjust for incomplete reporting
- Apply consistent data quality metrics

These adjustments require processing that cannot be done within DHIS2's native analytics.

**Analysis Complexity**

The FASTR approach uses more advanced statistical methods, such as regression analysis, which are not available in DHIS2. While DHIS2 can plot trends over time using raw data, FASTR can go further by:
- Identifying significant increases or decreases in service volume
- Adjusting for data quality issues
- Accounting for expected seasonal variations
- Comparing key periods, such as before and after a reform

The choice between DHIS2 and the FASTR approach should be guided by the specific purpose of your analysis. Select the tool that best aligns with your analytical needs.

### What Format and Granularity is Required?

Data should be downloaded for each **indicator of interest**, at **facility level**, and **monthly** for the **period of interest**.

- Data should be saved in **long format** meaning each row represents a single observation or measurement
- Data should be saved in **.csv format** and can be saved in either a single .csv file or multiple .csv files which will be combined when uploading to the analysis platform

**Why Monthly Facility Level Data?**

We want to use the most granular data we have access to in order to make more fine tuned assessments for data quality and adjustments for data quality. We also want to be able to look at trends over time, accounting for things like seasonality. Using monthly facility level data allows us to conduct the most robust analysis.

### Key Variables

The data extracted should include the following required elements:

| Element | Description |
|---------|-------------|
| Org units | Organizational unit identifier |
| Period | Time period of the data |
| Indicator name | Name of the indicator |
| Total/count | The aggregated value |

**Organisational Unit Terms**

| Term | Description |
|------|-------------|
| `orgunitlevel1` | Usually the top level, such as a country |
| `orgunitlevel2` | Could be a state or province |
| `orgunitlevel3` | Could be a district |
| `orgunitlevel4` | Could be a sub-district or health facility |
| `orgunitlevel5` | Could be a department or unit within a facility |
| `organisationunitid` | A unique identifier assigned to each organizational unit within DHIS2 |
| `organisationunitname` | The name of the organizational unit, like "Central Hospital" or "District A" |
| `organisationunitcode` | A code assigned to an organizational unit (shortened or standardized representation) |
| `organisationunitdescription` | A detailed description of the organizational unit |

**Period Terms**

| Term | Description |
|------|-------------|
| `periodid` | A unique identifier for a specific time period in DHIS2 |
| `periodname` | The name of the period, such as "January 2024" or "Q1 2024" |
| `periodcode` | A standardized code representing a period, such as "202411" for January 2024 |
| `perioddescription` | A more detailed description of the period with exact start and end dates |

**Data Element Terms**

| Term | Description |
|------|-------------|
| `dataid` | A unique identifier for a specific data element within DHIS2 |
| `dataname` | The name of the data element, such as "Number of Malaria Cases" |
| `datacode` | A code assigned to a data element (e.g., "MAL_CASES" for malaria cases) |
| `datadescription` | A detailed description of the data element |

**Other Terms**

| Term | Description |
|------|-------------|
| `Total` | The aggregated sum of a specific data element within a given organizational unit and period |
| `date_downloaded` | The date when the data was extracted from DHIS2 (useful for auditing and version control) |

### How Much Data?

**Initial FASTR Analysis**

- Generally recommended to download approximately **five years** of historical data
- The exact period should be determined based on:
  - Data availability
  - Consistency in indicator definitions over time
  - The specifics of a country's routine data system
- Ideally, using at least five years of historical data allows for a thorough assessment of trends over time

**Routine Update to FASTR Analysis**

- Start with the existing database and download new data covering the most recent months not previously included – this is usually a **three-month period** when the FASTR analysis is being implemented on a quarterly basis
- Additionally, include the **three preceding months** to the new data time period, as this relatively recent data is often subject to changes due to late reporting or data quality adjustments
- If you have reason to believe there have been substantial changes to the historical data, you can always choose to redownload a longer time period

### Tools for Data Extraction

*Full documentation content to be developed*

This section will cover:
- DHIS2 data export options
- API-based extraction methods
- Data transformation requirements
- Quality checks on extracted data

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
## Why Extract Data from DHIS2?

### Data Quality Adjustment

The FASTR approach focuses on data quality adjustments to expand the analyses countries can do with DHIS2 data and to generate more robust estimates.

The FASTR methodology includes specific approaches to:
- Identify and adjust for outliers
- Adjust for incomplete reporting
- Apply consistent data quality metrics

These adjustments require processing that cannot be done within DHIS2's native analytics.
<!-- /SLIDE -->

<!-- SLIDE:m2_1a -->
## Why Extract Data from DHIS2?

### Analysis Complexity

The FASTR approach uses more advanced statistical methods, such as regression analysis, which are not available in DHIS2. While DHIS2 can plot trends over time using raw data, FASTR can go further by:

- Identifying significant increases or decreases in service volume
- Adjusting for data quality issues
- Accounting for expected seasonal variations
- Comparing key periods, such as before and after a reform

The choice between DHIS2 and the FASTR approach should be guided by the specific purpose of your analysis.
<!-- /SLIDE -->

<!-- SLIDE:m2_1b -->
## Data Format and Granularity

Data should be downloaded for each **indicator of interest**, at **facility level**, and **monthly** for the **period of interest**.

- Data should be saved in **long format** meaning each row represents a single observation or measurement
- Data should be saved in **.csv format** and can be saved in either a single .csv file or multiple .csv files

### Why Monthly Facility Level Data?

We want to use the most granular data we have access to in order to make more fine tuned assessments for data quality. Using monthly facility level data allows us to conduct the most robust analysis.
<!-- /SLIDE -->

<!-- SLIDE:m2_1c -->
## Key Variables

The data extracted should include the following required elements:

| Element | Description |
|---------|-------------|
| Org units | Organizational unit identifier |
| Period | Time period of the data |
| Indicator name | Name of the indicator |
| Total/count | The aggregated value |
<!-- /SLIDE -->

<!-- SLIDE:m2_1d -->
## How Much Data?

### Initial FASTR Analysis
- Download approximately **five years** of historical data
- Exact period depends on data availability and consistency in indicator definitions

### Routine Update to FASTR Analysis
- Download new data covering the most recent months not previously included (usually **three months** for quarterly implementation)
- Include the **three preceding months** as recent data is often subject to changes due to late reporting or data quality adjustments
<!-- /SLIDE -->

<!-- SLIDE:m2_2 -->
## Tools for Data Extraction

*Content to be developed*

This section will cover:
- DHIS2 data export options
- API-based extraction methods
- Data transformation requirements
- Quality checks on extracted data
<!-- /SLIDE -->
