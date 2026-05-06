<!-- REVIEW LAST: We are still drafting other sections of the methodology -->

# Executive summary

> **Note:** Content in this section is subject to revision.

## FASTR RMNCAH-N service use monitoring

This documentation describes the FASTR approach to monitoring reproductive, maternal, newborn, child, and adolescent health and nutrition (RMNCAH-N) service delivery using routine health management information system (HMIS) data. The methodology guides users through an end-to-end process: from defining priority questions and extracting data, through platform-based analysis, to communicating results for decision-making.

## Background

The Global Financing Facility (GFF) supports country-led efforts to improve the timely use of data for decision-making through **Frequent Assessments and Health System Tools for Resilience (FASTR)**. Health management information systems in low- and middle-income countries generate routine facility-level service delivery data monthly. However, these data are frequently affected by reporting incompleteness, statistical outliers, and internal inconsistencies that limit their analytical utility.

Traditional household surveys (DHS, MICS) provide validated coverage estimates but are conducted infrequently (typically every 3-5 years), creating gaps in the availability of timely data for monitoring service delivery trends, detecting disruptions, and tracking progress toward health system goals. FASTR addresses these constraints through a structured analytical process that systematically assesses and adjusts for data quality issues in routine HMIS data.

## The FASTR methodology

### Identification of priority questions and indicators

The FASTR methodology begins with the identification of priority analytical questions and the selection of corresponding indicators. This step is undertaken in collaboration with Ministries of Health and relevant stakeholders to define policy-relevant use cases, ensure alignment with national health strategies, and specify requirements for data extraction from DHIS2 systems.

### Data extraction

Facility-level data are extracted directly from DHIS2 via APIs at monthly resolution and structured within the platform to support data quality assessment, subnational analysis, and trend monitoring.

### The FASTR analytics platform

These structured data are processed within the FASTR analytics platform, which provides a standardized environment for implementing a modular set of analytical components. Users configure administrative hierarchies and facility mappings and execute analytical modules to generate data quality metrics, service utilization analyses, and coverage estimates in a consistent and reproducible manner.

### Platform module 1: Data Quality Assessment

This module applies statistical methods to assess the reliability of routine health facility data. It identifies extreme values using median absolute deviation, evaluates reporting completeness at facility and indicator levels, and checks internal consistency across related indicators (for example, ensuring that ANC1 values are not lower than ANC4). Outputs include facility-level data quality scores and flags for use in subsequent data adjustment and analysis.

### Platform module 2: Data Quality Adjustment

The Data Quality Adjustment module produces four parallel versions of the dataset: (i) unadjusted data, (ii) data adjusted for outliers only, (iii) data adjusted for missing values only, and (iv) data adjusted for both outliers and missing values. Outlier adjustment replaces flagged observations with six-month rolling medians, while missing values are imputed using the same hierarchical approach. Retaining all four versions supports transparency and sensitivity analysis.

### Platform module 3: Service Utilization Analysis

This module applies statistical process control techniques to detect deviations in service volumes from expected patterns after accounting for seasonality and long-term trends. Panel regression models are estimated at national, regional, and district levels to quantify the magnitude and statistical significance of service shortfalls or surpluses during identified disruption periods.

### Platform modules 5 & 6: Coverage Estimation (Part 1 — denominators, Part 2 — coverage)

The Coverage Estimates module derives target population denominators by combining HMIS service volumes with household survey coverage information and population projections. Multiple denominator series are generated using alternative HMIS indicators and demographic assumptions, including adjustments for biological factors. Coverage projections for post-survey years are produced by applying HMIS-derived annual changes to survey baselines.

### Results communication

Analytical outputs are translated into policy-relevant insights through structured interpretation and visualization. Results are tailored to different audiences and compiled into routine reporting products to support ongoing monitoring, planning, and decision-making.

## Key features

**End-to-end process**: The methodology covers the complete workflow from defining questions through data extraction, platform-based analysis, and results communication—not just the analytical modules.

**Multiple adjustment options**: The platform generates four versions of adjusted data (no adjustments, outliers only, missing data only, or both), allowing users to test how different data quality assumptions affect results.

**Geographic flexibility**: Analysis works at national and sub-national levels, with outputs available at admin area 2 and admin area 3 levels where data quality permits.

**Customizable settings**: All thresholds, time windows, and adjustment methods can be modified to fit country-specific data and context.

---

**Last updated**: 26-01-2026
**Contact**: FASTR Project Team
