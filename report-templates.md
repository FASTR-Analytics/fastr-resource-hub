# Report Templates

These templates generate complete, standardized reports. Fill in the parameters and the AI follows the specification.

---

## FASTR Disruptions Report

**Purpose:** Generates a full disruptions analysis report with cover, methodology, national analysis, subnational annex, and data quality annex.

### Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| COUNTRY | Country name | Malawi |
| REPORT_PERIOD | Report period label | Q2 2025 |
| ANALYSIS_MONTH_YEAR | When analysis was run | January 2025 |
| START_DATE | Analysis start | Jul 2023 |
| END_DATE | Analysis end | Dec 2025 |

### Prompt

> Generate a FASTR Disruptions Report for [COUNTRY] covering [START_DATE] to [END_DATE]. Analysis month: [ANALYSIS_MONTH_YEAR]. Report period: [REPORT_PERIOD].

### What gets generated

1. Cover slide with FASTR branding
2. Introduction slide (HMIS disruption tracking)
3. Methodology slides (service utilization approach, indicator selection)
4. National analysis slides:
   - ANC1/ANC4
   - Delivery services (institutional, SBA, PNC)
   - Vaccines (BCG, Penta1/3, Measles1/2)
   - Outpatient visits
5. Annex 1: Subnational disruptions
6. Annex 2: Data quality (completeness heatmap)

---

## Regional Disruptions Analysis

**Purpose:** Generates subnational slides showing actual vs. expected for each admin area.

### Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| COUNTRY | Country name | Malawi |
| START_DATE | Analysis start | Jul 2023 |
| END_DATE | Analysis end | Dec 2025 |

### Prompt

> Generate Regional Disruptions Analysis for all subnational areas in [COUNTRY] from [START_DATE] to [END_DATE].

### What gets generated

- Cover slide
- One slide per subnational area with actual vs. expected visualization

---

## Data Quality Assessment Report

**Purpose:** Generates a DQA report covering completeness, outliers, consistency, and DQA scores.

### Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| COUNTRY | Country name | Malawi |
| REPORT_PERIOD | Report period | 2024 Annual |

### Prompt

> Generate a Data Quality Assessment Report for [COUNTRY] for [REPORT_PERIOD].

### What gets generated

1. Cover slide
2. Reporting completeness (visualization + interpretation)
3. Outliers (visualization + interpretation)
4. Internal consistency (2 slides)
5. DQA score trends (2 slides)
