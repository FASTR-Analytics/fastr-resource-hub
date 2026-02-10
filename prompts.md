# Getting Started

## Orientation

### Dataset Overview
```prompt
Show me an overview of the data: what indicators, regions, and time periods are available?
```

### What's New
```prompt
What are the most recent data updates? Show me the latest reporting period.
```

# Data Quality

## Assessment

### Quality Review
```prompt
Assess the quality of data for [FACILITY/REGION/TIME PERIOD]. Examine:
- Completeness of reporting
- Consistency with related indicators
- Plausibility of values
- Timeliness of reporting
- Recommendations for improvement
```

### Completeness Check
```prompt
Analyze data completeness across facilities and time periods. Identify:
- Facilities with incomplete reporting
- Time periods with missing data
- Patterns in data gaps that might indicate systematic issues
```

### Outlier Detection
```prompt
Review the data for potential outliers or data quality issues. Check for:
- Values that are statistically unusual
- Sudden jumps or drops that may indicate reporting errors
- Missing data patterns
- Inconsistencies across related indicators
```

### Validation Check
```prompt
Validate the data for [METRIC NAME] by:
- Checking for impossible values
- Comparing with related indicators
- Identifying unusual patterns
- Suggesting potential data corrections
```

# Analysis

## Trends and Patterns

### Identify Key Trends
```prompt
Analyze the available health metrics and identify the most significant trends over the past 12 months. Focus on:
- Metrics showing consistent improvement or decline
- Any seasonal patterns
- Outliers that warrant investigation

Present findings in a structured format with specific numbers and percentages.
```

### Compare Regions
```prompt
Compare health indicator performance across administrative regions. Highlight:
- Top and bottom performing regions
- Regions showing significant improvement or decline
- Possible explanations for regional differences based on available context
```

### Period-over-Period Analysis
```prompt
Compare current period performance against the previous period for key indicators. Identify:
- Indicators with significant changes
- Whether changes align with expected trends
- Areas requiring immediate attention
```

### Where to Focus
```prompt
Based on the data, which regions or indicators should we prioritize for support? Identify areas with declining performance or persistent gaps.
```

# Indicator Analysis

FASTR focuses on core RMNCAH-N indicators that represent key points along the health continuum. These indicators typically have higher reporting volumes and serve as proxies for broader service delivery patterns.

## Maternal Health

### ANC Disruptions
```prompt
Analyze ANC1 and ANC4 for disruptions. Show actual vs expected volumes, flag periods where services fell below expected levels, and identify which regions are most affected.
```

### Delivery Services
```prompt
Analyze institutional delivery trends. Compare actual volumes to expected, highlight any disruption periods, and show subnational variation.
```

### Postnatal Care
```prompt
Analyze PNC1 for disruptions. Are postnatal care visits tracking with deliveries? Flag any gaps between expected and actual service volumes.
```

## Child Health

### Immunization Coverage
```prompt
Analyze BCG, Penta1, and Penta3 for disruptions. Show actual vs expected for each vaccine, identify disruption periods, and flag regions with persistent gaps.
```

### Dropout Analysis
```prompt
Compare Penta1 to Penta3 dropout patterns. Are children completing the vaccine series? How has dropout changed over time?
```

## General Services

### Outpatient Trends
```prompt
Analyze outpatient visit trends. Compare actual vs expected volumes, identify disruption periods, and show how patterns vary across regions.
```

## Cross-Indicator

### Service Continuity
```prompt
Compare disruption patterns across ANC, delivery, and immunization. Are disruptions happening at the same time across services, or are some indicators more affected than others?
```

### Regional Comparison
```prompt
Which regions show the most disruptions across indicators? Identify areas with consistent gaps between actual and expected service volumes.
```

# Visualizations

## Chart Creation

### Time Series Chart
```prompt
Create a time series visualization showing [METRIC NAME] over the past [TIME PERIOD]. Include:
- Clear axis labels and title
- Trend line if appropriate
- Annotations for significant changes
- Disaggregation by [CATEGORY] if relevant
```

### Regional Comparison
```prompt
Create a visualization comparing [METRIC NAME] across regions. Use:
- A bar chart for easy comparison
- Color coding to highlight performance levels
- Clear labels showing actual values
```

### Disaggregated Analysis
```prompt
Create a visualization showing [METRIC NAME] disaggregated by [AGE/SEX/OTHER]. Display:
- Clear comparison between groups
- Percentage or absolute values as appropriate
- Trends over time if relevant
```

### Heatmap
```prompt
Create a heatmap showing [DQ scores / completeness / performance] across [regions / indicators / time periods]. Use color coding to highlight areas needing attention.
```

# Reports & Communication

## Executive Summary

### Monthly Summary
```prompt
Generate an executive summary of this month's key health indicators. Include:
- Overall performance assessment
- Top 3 achievements with specific metrics
- Top 3 areas needing attention with recommendations
- Key action items for stakeholders
```

### Quarterly Report
```prompt
Create a quarterly report covering the past 3 months. Include:
- Progress toward annual targets
- Comparison with previous quarter
- Regional performance highlights
- Recommended focus areas for next quarter
```

## Stakeholder Communication

### Key Messages
```prompt
Generate 3-5 key messages from this analysis suitable for senior leadership. Focus on what matters most and what action is needed.
```

### Talking Points
```prompt
Create talking points for presenting these findings to [stakeholders]. Include:
- Main findings in plain language
- Supporting data points
- Recommended actions
```

# Methodology

## Understanding Metrics

### Explain Indicator
```prompt
Explain how [METRIC NAME] is calculated. Include:
- Numerator and denominator definitions
- Data sources
- Typical values or targets
- Common interpretation pitfalls
```

### Compare Indicators
```prompt
Compare [INDICATOR 1] and [INDICATOR 2]. Explain:
- How they differ
- When to use each
- How they complement each other
- What insights can be gained from analyzing them together
```

## FASTR Help

### How FASTR Detects Outliers
```prompt
Explain how FASTR identifies outliers in the data. What statistical method is used? How should I interpret flagged values?
```

### Understanding DQ Scores
```prompt
What does the data quality score mean? How is it calculated? What score indicates good vs. poor quality?
```

### How Adjustment Works
```prompt
Explain how FASTR adjusts data for quality issues. When are values adjusted vs. excluded? How does this affect my analysis?
```

# Standardized Report Generation

## Prompt 1: FASTR Disruptions Report

```prompt
Generate a FASTR Disruptions Report.

BEFORE STARTING, ASK THE USER FOR:
1. Country name
2. Analysis time period: The date range of data to include (start month/year to end month/year, e.g., "January 2023 to December 2025")
3. Report title label: A short label for the cover subtitle describing what this report covers (e.g., "Q4 2025", "2025 Annual", "January-June 2025")
4. Analysis generation date: The month/year when this analysis was produced, for the cover footer (e.g., "February 2026")

When user provides the analysis time period, convert to period_id format:
- Start date becomes min value: [YEAR][MONTH] as 6-digit number (e.g., January 2025 = 202501)
- End date becomes max value: [YEAR][MONTH] as 6-digit number (e.g., December 2025 = 202512)
- Store these values to use in periodFilterOverride for all indicator slides

ACCURACY REQUIREMENTS:
1. Base all analysis only on data visible in the platform - do not draw on external knowledge
2. Do not invent statistics, percentages, or specific numbers - if data is not visible, say so
3. If you cannot verify a claim from the data, mark it with [VERIFY]
4. Do not guess at dates, time periods, or magnitudes

INDICATOR GROUPINGS (use only what exists in platform):
- Maternal and Newborn: ANC1, ANC4, Institutional delivery, PNC (plus C-sections, maternal deaths, stillbirths if available)
- Immunization: BCG, Penta1, Penta3 (plus Measles 1/2, fully immunized, Vitamin A if available)
- General Services: Outpatient visits (plus OPD under 5, OPD over 5 if available)
- Family Planning, Malaria, Nutrition: Include if available in platform

REPORT STANDARDS:
1. Maintain cautious, analytical language - no causal claims
2. Treat disruption signals as descriptive and exploratory
3. Structure narratives in complete sentences (not bullet points)
4. Place indicator titles in bold
5. Layout: interpretation on left, visualization on right
6. Use consistent terminology throughout (do not switch between synonyms)

VERIFICATION - Before finalizing each slide, cross-check:
1. All numeric values match what the visualization shows
2. Time periods and indicator names are correctly referenced
3. Described trends (increases, decreases) match the actual data direction
4. Numbers are consistent across slides (same indicator = same values)

STRUCTURE:

SLIDE 1 - Cover slide
- Title: "Tracking Disruptions in Essential Services Using HMIS Data in [COUNTRY]"
- Subtitle: "Disruptions Report: [REPORT_TITLE_LABEL]"
- Footer: "Analysis generated in [ANALYSIS_GENERATION_DATE]"

SLIDE 2 - Introductory slide
- Title: "Tracking Disruptions in Essential Services Using HMIS Data"
- Fixed text: "The FASTR approach uses routine HMIS data to monitor how service delivery shifts over time. By comparing observed vs. expected service volumes — adjusted for seasonality and historical trends — we can identify disruptions or surpluses in key health services. This analysis provides a timely, system-wide perspective, highlighting where and when service use deviates from expected patterns. Findings generate actionable evidence to guide rapid responses, helping sustain continuity of essential care during funding uncertainty or operational change."
- Reserve space for image

SLIDE 3 - Methodology slide
- Title: "Methodology: Service Utilization Assessment"
- Purpose: Track changes in health service use over time, identifying where services fall below or rise above expected patterns.
- How it works: Uses routine HMIS data, cleaned for outliers and missing values. Builds an "expected" trend line for each service, adjusting for seasonality and historical trends. Compares actual service volumes to expected levels.
- Measuring impact: Flagged disruption periods are analyzed to estimate how much service volumes changed compared to what was expected. Results are shown at national and sub-national levels.
- How to interpret figures: Red shaded areas = potential disruptions (below expected). Green shaded areas = potential surpluses (above expected). These are signals, not conclusions — they require further investigation.
- Footer: "More details on the methodology are found on GitHub (https://fastr-analytics.github.io/fastr-resource-hub/)."

SLIDE 4 - Indicator selection slide
- Title: "Methodology: Indicator selection"
- Subtitle: "Indicators for the service utilization analysis were selected considering nationally prioritized indicators."
- List available indicators grouped by category from the platform

SLIDE 5 - Section header slide
- Title: "Section 1: Service Utilization"
- Subtitle: "Assessment of projected volumes based on historical trends to identify surpluses and disruptions in health services"

SLIDES 6+ - National analysis slides
Create slides in this exact order by category. Only include indicators that exist in the platform.

CATEGORY A - MATERNAL HEALTH:
Create one slide each for: ANC1, ANC4, Institutional delivery, PNC1 (and C-sections, maternal deaths, neonatal deaths, stillbirths if available)

CATEGORY B - IMMUNIZATION:
Create one slide each for: BCG, Penta1, Penta3, Measles 1, Measles 2 (and fully immunized, Vitamin A if available)

CATEGORY C - GENERAL SERVICES:
Create one slide each for: Outpatient visits (and OPD under 5, OPD over 5 if available)

CATEGORY D - OTHER (if available in platform):
Create slides for: Family planning, Malaria, Nutrition indicators

INDICATOR CODES for selectedReplicant parameter:
- Maternal: anc1, anc4, delivery, pnc1, csection, maternal_deaths, neonatal_deaths
- Immunization: bcg, penta1, penta3, fully_immunized
- OPD: opd_under5, opd_over5
- Family Planning: fp_new, fp_new_and_cont
- Malaria: malaria_rdt_positive, malaria_treated_less_24hrs
- Child Health: diarrhea_cases_identified, pneumonia_cases_identified, pneumonia_treated

FOR EACH INDICATOR SLIDE:

Title: Indicator name in bold (e.g., "ANC1 - First antenatal care visit")

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m3-02-01" (Actual vs expected service volume - National)
- vizPresetId: "disruption-chart"
- chartTitle: "Actual vs Expected: [Indicator Name]"
- selectedReplicant: The indicator code (e.g., "anc1", "penta3")
- filterOverrides: MUST include filter to show only this specific indicator:
  - col: "indicator_common_id"
  - vals: [the indicator code only, e.g., ["anc1"] or ["penta3"]]
- periodFilterOverride:
  - periodOption: "period_id"
  - min: Start date as 6-digit number (e.g., 202501 for January 2025)
  - max: End date as 6-digit number (e.g., 202512 for December 2025)

Interpretation (left side): Analyze the data shown in the visualization. Describe in complete sentences:
- When disruptions occurred (specific months/periods when actual fell below expected)
- Duration of disruptions (how many consecutive months)
- Magnitude of gaps (approximate numerical differences where visible)
- When surpluses occurred (specific months/periods when actual exceeded expected)
- Overall pattern (sustained, brief, scattered, none)
- IMPORTANT: Only describe what is actually visible in the chart - do not invent data
```

## Prompt 2: Regional Disruptions Analysis (Annex 1)

```prompt
Generate Annex 1: Regional Disruptions Analysis for all subnational areas. Add this annex after the main Disruptions Report.

ACCURACY REQUIREMENTS:
1. Base all analysis only on data visible in the platform
2. Do not invent statistics or specific numbers - if data is not visible, say so
3. If you cannot verify a claim from the data, mark it with [VERIFY]

REPORT STANDARDS:
1. Maintain cautious, analytical language - no causal claims
2. Treat disruption signals as descriptive and exploratory
3. Layout: interpretation on left, visualization on right
4. Use consistent terminology throughout

VERIFICATION: Before finalizing each slide, cross-check that described trends match what the visualization shows.

STRUCTURE:

SLIDE 1 - Annex header slide
- Title: "Annex 1: District service utilization disruptions"

SLIDES 2+ - Subnational area slides
For EACH subnational area in the platform, create a slide with:

Slide title: Name of the subnational area

Visualization (right side): Use "Default 6. Actual vs expected number of services (Admin area 2)" filtered for that specific area

Interpretation (left side): Describe in complete sentences:
- Which indicators show disruptions (below expected) and when
- Which indicators show surpluses (above expected) and when
- The magnitude of deviations from expected
- Any patterns across indicators (e.g., all maternal indicators affected together)
```

## Prompt 3: Data Quality Assessment

```prompt
Generate a Data Quality Assessment annex. Add this after the main Disruptions Report.

ANNEX NUMBERING: If Regional Disruptions Analysis (Annex 1) was included, number this as Annex 2. If not included, number this as Annex 1.

ACCURACY REQUIREMENTS:
1. Base all analysis only on data visible in the platform
2. Do not invent statistics or specific numbers - if data is not visible, say so
3. If you cannot verify a claim from the data, mark it with [VERIFY]

REPORT STANDARDS:
1. Maintain cautious, analytical language
2. Layout: interpretation on left, visualization on right
3. Use consistent terminology throughout

VERIFICATION: Before finalizing each slide, cross-check that all percentages and scores match what the visualization shows.

STRUCTURE:

SLIDE 1 - Cover slide
- Title: "Annex [1 or 2]: Data Quality Assessment"
- Subtitle: "Data quality assessments — focused on completeness, consistency, and outliers — inform adjustments applied to routine data to improve reliability of the analyses presented."

SLIDE 2 - Reporting completeness
- Title: "Reporting completeness"
- Visualization (right side): Use "Default 2. Proportion of completed records"
- Interpretation (left side): In complete sentences describe overall national trends in completeness over time, which indicators have low completeness (name them), and which administrative areas have low completeness (name them).

SLIDE 3 - Outliers
- Title: "Outliers"
- Visualization (right side): Use "Default 1. Proportion of outliers"
- Interpretation (left side): In complete sentences describe overall national trends in outliers over time, which indicators have high outlier rates (name them), and which administrative areas have high outlier rates (name them).

SLIDE 4 - Internal consistency (first)
- Title: "Internal consistency"
- Visualization (right side): Use "Default 4. Proportion of sub-national areas meeting consistency criteria"
- Interpretation (left side): In complete sentences describe what consistency comparisons are being made, overall patterns across the country, and which areas meet or fail consistency criteria.

SLIDE 5 - Internal consistency (second)
- Title: "Internal consistency"
- Visualization (right side): Use "Default 4. Proportion of sub-national areas meeting consistency criteria" (different view or breakdown)
- Interpretation (left side): Continue describing consistency patterns across administrative areas.

SLIDE 6 - Data quality trends (first)
- Title: "Trends in data quality"
- Visualization (right side): Use "Default 5. Overall DQA score"
- Interpretation (left side): In complete sentences describe how DQA scores have changed across years, overall country performance, and variation across administrative areas.

SLIDE 7 - Data quality trends (second)
- Title: "Trends in data quality"
- Visualization (right side): Use "Default 6. Mean DQA score"
- Interpretation (left side): In complete sentences describe mean DQA score trends across years, which areas have improving vs declining scores, and overall assessment of data quality trajectory.
```
