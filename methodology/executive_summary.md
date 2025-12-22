<!-- REVIEW LAST: We are still drafting other sections of the methodology -->

# Executive Summary

## FASTR RMNCAH-N Service Use Monitoring

This documentation describes the FASTR approach to monitoring reproductive, maternal, newborn, child, and adolescent health and nutrition (RMNCAH-N) service delivery using routine health management information system (HMIS) data. The methodology guides users through an end-to-end process: from defining priority questions and extracting data, through platform-based analysis, to communicating results for decision-making.

## Background

The Global Financing Facility (GFF) supports country-led efforts to improve the timely use of data for decision-making through **Frequent Assessments and Health System Tools for Resilience (FASTR)**. Health management information systems in low- and middle-income countries generate routine facility-level service delivery data monthly. However, these data are frequently affected by reporting incompleteness, statistical outliers, and internal inconsistencies that limit their analytical utility.

Traditional household surveys (DHS, MICS) provide validated coverage estimates but are conducted infrequently (typically every 3-5 years), creating gaps in the availability of timely data for monitoring service delivery trends, detecting disruptions, and tracking progress toward health system goals. FASTR addresses these constraints through a structured analytical process that systematically assesses and adjusts for data quality issues in routine HMIS data.

## The FASTR Methodology

### Identify Questions and Indicators

The process begins with defining priority questions for FASTR analysis and selecting appropriate indicators. This involves working with Ministries of Health and stakeholders to develop data use cases, aligning indicators with national health strategies, and preparing for data extraction from DHIS2 systems.

### Data Extraction

Data is extracted from DHIS2 at the facility-month level to enable facility-level data quality assessment, subnational disaggregation of results, and longitudinal trend analysis. The FASTR methodology requires specific data transformations that cannot be done within DHIS2's native analytics.

### The FASTR Analytics Platform

The FASTR analytics platform provides a structured environment for running the four core analytical modules. Users configure administrative areas and facilities, import prepared datasets, and run modules to generate data quality metrics, service utilization estimates, and coverage indicators.

### Platform Module 1: Data Quality Assessment

Applies statistical methods to identify outliers using median absolute deviation, tracks reporting completeness at facility and indicator levels, and validates logical consistency between related indicators (e.g., ANC1 ≥ ANC4). Generates facility-level quality scores and flags for downstream use in data adjustment and analysis.

### Platform Module 2: Data Quality Adjustment

Generates four parallel versions of the dataset: (1) original unadjusted data, (2) outlier-adjusted data only, (3) missing data imputed only, and (4) both adjustments applied. Outlier adjustment replaces flagged values with 6-month rolling medians. Missing data imputation follows the same hierarchical approach. All four versions are retained to support sensitivity analysis.

### Platform Module 3: Service Utilization Analysis

Applies statistical process control methods to identify months where service volumes deviate significantly from expected patterns after accounting for seasonality and trends. Uses panel regression models at national, regional, and district levels to quantify the magnitude of service shortfalls or surpluses during disruption periods.

### Platform Module 4: Coverage Estimation

Calculates target population denominators by combining HMIS service counts with survey-reported coverage rates. Multiple denominator options are derived from different HMIS indicators and UN population estimates, adjusted for biological factors. Generates coverage projections for years beyond the most recent survey by applying annual percent changes observed in HMIS data to survey baselines.

### Results Communication

Translates analytical outputs into actionable insights for decision-makers. This includes interpreting FASTR results, developing effective data visualizations, tailoring messages to different audiences, and generating quarterly reporting products for ongoing monitoring.

## Key Features

**End-to-End Process**: The methodology covers the complete workflow from defining questions through data extraction, platform-based analysis, and results communication—not just the analytical modules.

**Multiple Adjustment Options**: The platform generates four versions of adjusted data (no adjustments, outliers only, missing data only, or both), allowing users to test how different data quality assumptions affect results.

**Geographic Flexibility**: Analysis works at national and sub-national levels, with outputs available at admin area 2 and admin area 3 levels where data quality permits.

**Customizable Settings**: All thresholds, time windows, and adjustment methods can be modified to fit country-specific data and context.
