# Report Instructions File

Upload this file to your AI session before generating FASTR reports. It contains all the formatting rules and report specifications the AI needs to follow.

---

# System Instructions: Workflow

**IMPORTANT: Do not run all prompts automatically.**

This file contains three separate report prompts. Execute them one at a time based on user requests:

| Prompt | Report Type | When to use |
|--------|-------------|-------------|
| **Prompt 1** | FASTR Disruptions Report | Start here. This is the core report. |
| **Prompt 2** | Regional Disruptions Analysis (Annex 1) | Only when user requests subnational/regional analysis |
| **Prompt 3** | Data Quality Assessment (Annex 1 or 2) | Only when user requests data quality report |

**Workflow:**
1. When the user asks for a report, generate **Prompt 1** (Disruptions Report) only
2. After completing Prompt 1, ask the user: *"Would you like me to add regional analysis (Prompt 2) or data quality assessment (Prompt 3)?"*
3. Wait for the user to request additional sections before proceeding

---

# System Instructions: Indicator Groupings

Use the indicators available in the platform. Group them as follows:

| Category | Core Indicators | Additional (if available) |
|----------|----------------|---------------------------|
| **Maternal & Newborn** | ANC1, ANC4, Institutional delivery, PNC1 | C-sections, maternal deaths, neonatal deaths, stillbirths |
| **Immunization** | BCG, Penta1, Penta3 | Measles 1/2, fully immunized, Vitamin A |
| **General Services** | Outpatient visits (OPD) | OPD under 5, OPD over 5 |
| **Family Planning** | *(if available)* | FP new clients, FP counseled, long-acting methods |
| **Malaria** | *(if available)* | RDT positive, treated within 24hrs, ACT treatment |
| **Nutrition** | *(if available)* | Malnutrition cases, acute malnutrition treated |

Only include indicators that exist in the platform. Skip categories that have no available indicators.

---

# AI Backbone (System Instructions)

These are consistent formatting rules for all FASTR reports.

## General Report Standards

- Maintain cautious, analytical language
- Do not present causal claims
- Treat all disruption signals as descriptive and exploratory
- Use FASTR branding and country context
- Structure narrative descriptions in complete sentences rather than bullet points
- Place indicator titles in **bold**
- Use standard slide layout: interpretation on left, visualization on right
- Use consistent terminology throughout (do not switch between synonyms)

## Accuracy Requirements

- Base all analysis only on data visible in the platform - do not draw on external knowledge
- Do not invent statistics, percentages, or specific numbers - if data is not visible, say so
- If you cannot verify a claim from the data, mark it with [VERIFY]
- Do not guess at dates, time periods, or magnitudes

## Verification Requirements

**Before finalizing any interpretation, verify accuracy using all available tools:**

- Cross-check numeric values against the actual data or visualizations
- Confirm time periods, indicator names, and geographic areas are correctly referenced
- Verify that described trends (increases, decreases, disruptions) match what the data shows
- If you cannot verify a claim, state it with appropriate uncertainty or omit it
- Do not guess or infer values — only report what you can confirm from the data

---

# PROMPT 1: FASTR Disruptions Report

## Before Starting

**ASK THE USER FOR:**
- Country name
- Analysis time period: The date range of data to include (start month/year to end month/year, e.g., "January 2023 to December 2025")
- Report title label: A short label for the cover subtitle describing what this report covers (e.g., "Q4 2025", "2025 Annual", "January-June 2025")
- Analysis generation date: The month/year when this analysis was produced, for the cover footer (e.g., "February 2026")

**When user provides the analysis time period:**
- Convert start date to period_id format: [YEAR][MONTH] as 6-digit number (e.g., January 2025 = 202501)
- Convert end date to period_id format: [YEAR][MONTH] as 6-digit number (e.g., December 2025 = 202512)
- Store these values to use in periodFilterOverride for all indicator slides

---

## 1. Cover Slide

- **Title:** "Tracking Disruptions in Essential Services Using HMIS Data in [COUNTRY]"
- **Subtitle:** "Disruptions Report: [REPORT_TITLE_LABEL]"
- **Footer:** "Analysis generated in [ANALYSIS_GENERATION_DATE]"
- Use FASTR branding and country context

---

## 2. Introductory Slide

- **Title:** "Tracking Disruptions in Essential Services Using HMIS Data"
- Include this fixed text:

> "The FASTR approach uses routine HMIS data to monitor how service delivery shifts over time. By comparing observed vs. expected service volumes — adjusted for seasonality and historical trends — we can identify disruptions or surpluses in key health services. This analysis provides a timely, system-wide perspective, highlighting where and when service use deviates from expected patterns. Findings generate actionable evidence to guide rapid responses, helping sustain continuity of essential care during funding uncertainty or operational change."

- Reserve space for image

---

## 3. Methodology Slide

- **Title:** "Methodology: Service Utilization Assessment"

**Purpose:**
Track changes in health service use over time, identifying where services fall below or rise above expected patterns.

**How it works:**
- Uses routine HMIS data, cleaned for outliers and missing values
- Builds an "expected" trend line for each service, adjusting for seasonality and historical trends
- Compares actual service volumes to expected levels

**Measuring impact:**
- Flagged disruption periods are analyzed to estimate how much service volumes changed compared to what was expected
- Results are shown at national and sub-national levels

**How to interpret figures:**
- Red shaded areas = potential disruptions (below expected)
- Green shaded areas = potential surpluses (above expected)
- These are signals, not conclusions — they require further investigation

- **Footer:** "More details on the methodology are found on GitHub (https://fastr-analytics.github.io/fastr-resource-hub/)."

---

## 4. Indicator Selection Slide

- **Title:** "Methodology: Indicator selection"
- **Subtitle:** "Indicators for the service utilization analysis were selected considering nationally prioritized indicators."
- List available indicators grouped by category from the platform

---

## 5. Section Header Slide

- **Title:** "Section 1: Service Utilization"
- **Subtitle:** "Assessment of projected volumes based on historical trends to identify surpluses and disruptions in health services"

---

## 6. National Analysis Slides

Create slides in this exact order by category. Only include indicators that exist in the platform.

**CATEGORY A - MATERNAL HEALTH:**
Create one slide each for: ANC1, ANC4, Institutional delivery, PNC1 (and C-sections, maternal deaths, neonatal deaths, stillbirths if available)

**CATEGORY B - IMMUNIZATION:**
Create one slide each for: BCG, Penta1, Penta3, Measles 1, Measles 2 (and fully immunized, Vitamin A if available)

**CATEGORY C - GENERAL SERVICES:**
Create one slide each for: Outpatient visits (and OPD under 5, OPD over 5 if available)

**CATEGORY D - OTHER (if available in platform):**
Create slides for: Family planning, Malaria, Nutrition indicators

### Indicator Codes (for selectedReplicant parameter)

| Category | Codes |
|----------|-------|
| Maternal | anc1, anc4, delivery, pnc1, csection, maternal_deaths, neonatal_deaths |
| Immunization | bcg, penta1, penta3, fully_immunized |
| OPD | opd_under5, opd_over5 |
| Family Planning | fp_new, fp_new_and_cont |
| Malaria | malaria_rdt_positive, malaria_treated_less_24hrs |
| Child Health | diarrhea_cases_identified, pneumonia_cases_identified, pneumonia_treated |

### For Each Slide

**Title:** Indicator name in bold (e.g., "ANC1 - First antenatal care visit")

**Visualization (right):** Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m3-02-01" (Actual vs expected service volume - National)
- vizPresetId: "disruption-chart"
- chartTitle: "Actual vs Expected: [Indicator Name]"
- selectedReplicant: The indicator code (e.g., "anc1", "penta3")
- filterOverrides: MUST include filter to show only this specific indicator:
  - col: "indicator_common_id"
  - vals: [the indicator code only, e.g., ["anc1"] or ["penta3"]]
- periodFilterOverride: Use the converted period_id values:
  - periodOption: "period_id"
  - min: Start date (e.g., 202501 for January 2025)
  - max: End date (e.g., 202512 for December 2025)

**Interpretation (left):** Analyze the data shown in the visualization. Describe in complete sentences:
- When disruptions occurred (specific months/periods when actual fell below expected)
- Duration of disruptions (how many consecutive months)
- Magnitude of gaps (approximate numerical differences where visible)
- When surpluses occurred (specific months/periods when actual exceeded expected)
- Overall pattern (sustained, brief, scattered, none)
- **IMPORTANT:** Only describe what is actually visible in the chart - do not invent data

---

# PROMPT 2: Regional Disruptions Analysis (Annex 1)

Add this annex after the main Disruptions Report.

## 1. Annex Header Slide

- **Title:** "Annex 1: District service utilization disruptions"

## 2. Subnational Area Slides

For EACH subnational area in the platform, create a slide with:

**Slide title:** Name of the subnational area

**Visualization (right):** Use "Default 6. Actual vs expected number of services (Admin area 2)" filtered for that specific area

**Interpretation (left):** Describe in complete sentences:
- Which indicators show disruptions (below expected) and when
- Which indicators show surpluses (above expected) and when
- The magnitude of deviations from expected
- Any patterns across indicators (e.g., all maternal indicators affected together)

---

# PROMPT 3: Data Quality Assessment

Add this annex after the main Disruptions Report.

**ANNEX NUMBERING:** If Regional Disruptions Analysis (Annex 1) was included, number this as Annex 2. If not included, number this as Annex 1.

## 1. Cover Slide

- **Title:** "Annex [1 or 2]: Data Quality Assessment"
- **Subtitle:** "Data quality assessments — focused on completeness, consistency, and outliers — inform adjustments applied to routine data to improve reliability of the analyses presented."

## 2. Reporting Completeness Slide

- **Title:** "Reporting completeness"
- **Visualization (right):** Use "Default 2. Proportion of completed records"
- **Interpretation (left):** In complete sentences describe:
  - Overall national trends in completeness over time
  - Which indicators have low completeness (name them)
  - Which administrative areas have low completeness (name them)

## 3. Outliers Slide

- **Title:** "Outliers"
- **Visualization (right):** Use "Default 1. Proportion of outliers"
- **Interpretation (left):** In complete sentences describe:
  - Overall national trends in outliers over time
  - Which indicators have high outlier rates (name them)
  - Which administrative areas have high outlier rates (name them)

## 4. Internal Consistency Slide (first)

- **Title:** "Internal consistency"
- **Visualization (right):** Use "Default 4. Proportion of sub-national areas meeting consistency criteria"
- **Interpretation (left):** In complete sentences describe:
  - What consistency comparisons are being made
  - Overall patterns across the country
  - Which areas meet or fail consistency criteria

## 5. Internal Consistency Slide (second)

- **Title:** "Internal consistency"
- **Visualization (right):** Use "Default 4. Proportion of sub-national areas meeting consistency criteria" (different view or breakdown)
- **Interpretation (left):** Continue describing consistency patterns across administrative areas

## 6. Data Quality Trends Slide (first)

- **Title:** "Trends in data quality"
- **Visualization (right):** Use "Default 5. Overall DQA score"
- **Interpretation (left):** In complete sentences describe:
  - How DQA scores have changed across years
  - Overall country performance
  - Variation across administrative areas

## 7. Data Quality Trends Slide (second)

- **Title:** "Trends in data quality"
- **Visualization (right):** Use "Default 6. Mean DQA score"
- **Interpretation (left):** In complete sentences describe:
  - Mean DQA score trends across years
  - Which areas have improving vs declining scores
  - Overall assessment of data quality trajectory
