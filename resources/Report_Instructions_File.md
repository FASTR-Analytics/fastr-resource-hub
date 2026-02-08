# Report Instructions File

Upload this file to your AI session before generating FASTR reports. It contains all the formatting rules and report specifications the AI needs to follow.

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

---

# PROMPT 1: FASTR Disruptions Report

## 1. Cover & Context Section

### Cover Slide
- **Title:** "Tracking Disruptions in Essential Services Using HMIS Data in {COUNTRY}"
- **Subtitle:** "Disruptions Report: {REPORT_PERIOD}"
- **Footer:** "Analysis generated in {ANALYSIS_MONTH_YEAR}"
- Use FASTR branding and country context

### Introductory Slide
- **Title:** "Tracking Disruptions in Essential Services Using HMIS Data"
- Include fixed description text (50% of slide):

> "The FASTR approach uses routine HMIS data to monitor how service delivery shifts over time. By comparing observed vs. expected service volumes — adjusted for seasonality and historical trends — we can identify disruptions or surpluses in key health services. This analysis provides a timely, system-wide perspective, highlighting where and when service use deviates from expected patterns. Findings generate actionable evidence to guide rapid responses, helping sustain continuity of essential care during funding uncertainty or operational change."

- Reserve other 50% of slide for image upload

---

## 2. Methodology Section

### Methodology Slide
- **Title** (in text box with white text): "Methodology: Service Utilization Assessment"
- **Description:**

**Purpose:**
Track changes in health service use over time, identifying where services fall below or rise above expected patterns.

**How it works:**
- Uses routine HMIS data, cleaned for outliers and missing values
- Builds an "expected" trend line for each service, adjusting for seasonality and historical trends in service utilization
- Compares actual service volumes to expected levels

**Measuring impact:**
- Flagged disruption periods are analyzed to estimate how much service volumes changed compared to what was expected
- Results are shown at national and sub-national levels highlighting both system-wide and localized effects

**How to interpret figures:**
- Red shaded areas = potential disruptions (service volumes lower than expected)
- Green shaded areas = potential surpluses (service volumes higher than expected)
- These are signals, not conclusions — they highlight when and where volumes deviate, but require further investigation into the underlying reasons ("why")

- **Footer** (in text box): "More details on the methodology and data quality adjustment approaches are found alongside the source code on GitHub (https://fastr-analytics.github.io/fastr-resource-hub/)."

### Indicator Selection Slide
- **Header:** "Methodology: Indicator selection"
- **Sub-header:** "Indicators for the service utilization analysis were selected considering nationally prioritized indicators."
- **Indicators selected include** (grouped into):
  - Reproductive health
  - Maternal and newborn health
  - Child health and nutrition
  - General services

---

## 3. Section Header

- **Title:** "Section 1: Service Utilization"
- **Subtitle:** "Assessment of projected volumes based on historical trends to identify surpluses and disruptions in health services"

---

## 4. National Service Utilization Analysis

Create national-level disruptions and surpluses slides covering {START_DATE} to {END_DATE} for each of the following indicator groupings:

### Slide for ANC1 and ANC4
- Pull visualization titled "ANC1/4 Disruptions"
- Include narrative description on left side describing timing, duration, and magnitude of disruptions and surpluses in complete sentences (not bullet points)
- Put indicator title in **bold**

### Slide for Institutional delivery, delivery by skilled birth attendant, postnatal care within 48 hours
- Pull appropriate visualization
- Include narrative description on left side describing timing, duration, and magnitude of disruptions and surpluses in complete sentences
- Put indicator title in **bold**

### Slide for BCG, Penta1, Penta3
- Pull appropriate visualization
- Include narrative description on left side describing timing, duration, and magnitude of disruptions and surpluses in complete sentences
- Put indicator title in **bold**

### Slide for Measles vaccine 1 and Measles vaccine 2
- Pull appropriate visualization
- Include narrative description on left side describing timing, duration, and magnitude of disruptions and surpluses in complete sentences
- Put indicator title in **bold**

### Slide for Outpatient visits
- Pull appropriate visualization
- Include narrative description on left side describing timing, duration, and magnitude of disruptions and surpluses in complete sentences
- Put indicator title in **bold**

---

## 5. Annex 1: Subnational Analysis

### Annex Header Slide
- **Title:** "Annex 1: District service utilization disruptions"

### Summary Slide
- Create slide with textbox on right titled: "Summary of Completeness Trends {START_DATE}-{END_DATE}"

---

## 6. Annex 2: Data Quality

### Completeness Visualization (before header)
- Create visualization showing completeness monthly trends from {START_DATE}-{END_DATE}
- Format as heat map table: years as rows, months as row groups, indicators as columns
- Include all indicators

### Annex Header Slide
- **Title:** "Annex 2: Trends in indicator reporting completeness"
- Follow with 3 paragraphs describing:
  - Overall percentage completeness across all indicators
  - Areas of weaker completeness
  - Trends for 2025

### Fixed text to include:

> **Why Completeness Matters for the Disruptions Analysis**
>
> **Observed values:** These are adjusted for outliers only, so they reflect the actual raw service volumes after removing implausible spikes.
>
> **Expected values:** These are adjusted for both completeness and outliers. This means the model "fills in" where reporting gaps exist, building an expected trend line as if all facilities had reported consistently.
>
> When completeness is high, observed and expected volumes are more comparable, and disruptions are more likely to reflect true service changes. When completeness is low, expected values may be artificially higher than observed, creating apparent "disruptions" that actually reflect missing reports rather than real declines in service delivery.

---

# PROMPT 2: Regional Disruptions Analysis

Create slides in the following order:

### Cover Slide
- **Title:** "Subnational service utilization disruptions"

### Subnational Area Slides
For each subnational area, generate a new slide with:
- **Slide title:** Name of the subnational area
- **Visualization:** "Default 6. Actual vs expected number of services (Admin area 2)" for the corresponding subnational area

---

# PROMPT 3: Data Quality Assessment

Create slides in the following order:

### Slide 1 - Cover Slide
- **Title:** "Data Quality Assessment"
- **Subtitle:** "Data quality assessments — focused on completeness, consistency, and outliers — inform adjustments applied to routine data to improve reliability of the analyses presented."

### Slide 2 - Reporting Completeness
- **Title:** "Reporting completeness"
- Insert visualization on right side: "Default 2. Proportion of completed records"
- Add interpretation on left side including:
  - Overall national trends in completeness
  - Discussion of indicators with low completeness
  - Discussion of administrative areas with low completeness

### Slide 3 - Outliers
- **Title:** "Outliers"
- Insert visualization on right side: "Default 1. Proportion of outliers"
- Add interpretation on left side including:
  - Overall national trends in outliers
  - Discussion of indicators with high outliers
  - Discussion of administrative areas with high outliers

### Slide 4 - Internal Consistency
- **Title:** "Internal consistency"
- Insert visualization on right side: "Default 4. Proportion of sub-national areas meeting consistency criteria"
- Add interpretation on left side including:
  - Description of consistency across comparisons
  - Across the country
  - Across administrative areas

### Slide 5 - Internal Consistency (continued)
- Insert visualization on right side: "Default 4. Proportion of sub-national areas meeting consistency criteria"
- Add interpretation on left side including:
  - Description of consistency across comparisons
  - Across the country
  - Across administrative areas

### Slide 6 - Trends in Data Quality
- **Title:** "Trends in data quality"
- Insert visualization on right side: "Default 5. Overall DQA score"
- Add interpretation on left side including:
  - Description of DQA score across years
  - Across the country
  - Across administrative areas

### Slide 7 - Trends in Data Quality (continued)
- **Title:** "Trends in data quality"
- Insert visualization on right side: "Default 6. Mean DQA score"
- Add interpretation on left side including:
  - Description of mean DQA score across years
  - Across the country
  - Across administrative areas
