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

STEP 1: ASK THE USER FOR:
1. Country name
2. Analysis time period: The date range of data to include (start month/year to end month/year, e.g., "January 2023 to September 2025")
3. Report subtitle: What would you like as the cover subtitle? For example: "Q3 2025", "2025 Annual", "January-June 2025"

The analysis generation date will be set automatically to the current month and year.

When user provides the analysis time period, convert to period_id format:
- Start date becomes min value: [YEAR][MONTH] as 6-digit number (e.g., January 2025 = 202501)
- End date becomes max value: [YEAR][MONTH] as 6-digit number (e.g., December 2025 = 202512)
- Store these values to use in periodFilterOverride for all indicator slides

STEP 2: DISCOVER AVAILABLE INDICATORS
Before generating the report, check what indicators are available in the platform for this country:

1. Review all indicators available in the platform
2. Map each indicator to one of these standard groups:
   - Adolescent Family Planning (e.g., adolescents counseled for FP, adolescents initiated on modern contraceptive method, adolescent modern contraceptive users)
   - Family Planning (e.g., FP clients counseled, clients initiated on modern contraceptive method, modern contraceptive users)
   - Antenatal Care (e.g., ANC1, ANC4)
   - Deliveries and Postnatal Care (e.g., institutional delivery, PNC)
   - Immunization (e.g., BCG, Penta1, Penta3)
   - Malaria (e.g., malaria RDT+, malaria treated <24hrs)
   - General Services / OPD (e.g., OPD >5, OPD <5)
3. For any indicators that do not fit the standard groups above (e.g., C-sections, maternal deaths, neonatal deaths, diarrhea cases, pneumonia cases, fully immunized, nutrition indicators), present these to the user and ask:
   - "I found these additional indicators: [list]. For each, would you like me to: (a) add it to an existing group, (b) create a new group, or (c) exclude it from the national analysis slides?"
   - Note: mortality indicators (maternal deaths, neonatal deaths) involve low-volume event counts and may not be suitable for the standard disruption chart — flag this to the user
4. Present the final proposed groupings to the user for confirmation before proceeding

Each confirmed group will become ONE slide in the national analysis section, with all indicators in that group shown side by side on the same chart.

KNOWN INDICATOR CODES for selectedReplicant and filterOverrides:
- Maternal: anc1, anc4, delivery, pnc1, csection, maternal_deaths, neonatal_deaths
- Immunization: bcg, penta1, penta3, fully_immunized
- OPD: opd_under5, opd_over5
- Family Planning: fp_new, fp_new_and_cont
- Malaria: malaria_rdt_positive, malaria_treated_less_24hrs
- Child Health: diarrhea_cases_identified, pneumonia_cases_identified, pneumonia_treated

If an indicator in the platform does not match a known code above, note it and ask the user to confirm the correct code.

ACCURACY REQUIREMENTS:
1. Base all analysis only on data visible in the platform - do not draw on external knowledge
2. Do not invent statistics, percentages, or specific numbers - if data is not visible, say so
3. If you cannot verify a claim from the data, mark it with [VERIFY]
4. Do not guess at dates, time periods, or magnitudes

REPORT STANDARDS:
1. Maintain cautious, analytical language - no causal claims
2. Treat disruption signals as descriptive and exploratory
3. Structure narratives in complete sentences (not bullet points)
4. Layout: interpretation on left, visualization on right
5. Use consistent terminology throughout (do not switch between synonyms)

VERIFICATION - Before finalizing each slide, cross-check:
1. All numeric values match what the visualization shows
2. Time periods and indicator names are correctly referenced
3. Described trends (increases, decreases) match the actual data direction
4. Numbers are consistent across slides (same indicator = same values)

STRUCTURE:

SLIDE 1 - Cover slide
- Title: "Tracking Disruptions in Essential Services Using HMIS Data in [COUNTRY]"
- Subtitle: "[REPORT_SUBTITLE]"
- Footer: "Analysis generated in [CURRENT_MONTH_YEAR]"

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
- List all available indicators grouped by the confirmed categories from Step 2

SLIDE 5 - Section header slide
- Title: "Section 1: Service Utilization"
- Subtitle: "Assessment of projected volumes based on historical trends to identify surpluses and disruptions in health services"

SLIDES 6+ - National analysis slides (one slide per indicator GROUP)
Create one slide for each confirmed indicator group from Step 2. Each slide shows all indicators in that group side by side.

FOR EACH GROUP SLIDE:

Title: Write an analytical headline (1-2 sentences) that summarizes the key finding for this group of indicators. The headline should describe what the data shows, not just name the indicators.
- Good example: "Despite widespread shortfalls in 2024, immunization services show signs of recovery by mid-2025, with some disruption in BCG"
- Good example: "Deliveries show surplus in 2025, while PNC recovered after earlier disruptions"
- Bad example: "BCG - Bacillus Calmette-Guérin vaccine"
- Bad example: "Immunization indicators"

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m3-02-01"
  Metric: Actual vs expected service volume (National) [number]
  Values: count_sum (Actual service volume), count_expected_if_above_diff_threshold (Expected service volume)
  Auto-disaggregated by: indicator_common_id
  Optional disaggregations: year, month, period_id
- vizPresetId: "disruption-chart" (Disruptions and surpluses - national - YYYYMM)
- chartTitle: "Comparing reported service use to expected trends, nationally"
- selectedReplicant: The first indicator code in the group
- filterOverrides: Filter on indicator_common_id to include ALL indicator codes for this group:
  - col: "indicator_common_id"
  - vals: [all indicator codes in the group, e.g., ["anc1", "anc4"] or ["bcg", "penta1", "penta3"]]
- periodFilterOverride:
  - periodOption: "period_id"
  - min: Start date as 6-digit number (e.g., 202301 for January 2023)
  - max: End date as 6-digit number (e.g., 202509 for September 2025)

Interpretation (left side): Analyze the data shown in the visualization. Describe in complete sentences:
- For EACH indicator in the group: when disruptions occurred (specific months/periods), duration, and approximate magnitude
- For EACH indicator in the group: when surpluses occurred, and approximate magnitude
- Cross-indicator analysis: describe relationships and patterns ACROSS the indicators in the group (e.g., "Because PNC typically follows delivery trends, we would expect these indicators to move together", "The parallel recovery across BCG, Penta1, and Penta3 suggests a system-wide rebound")
- Overall assessment: a concluding sentence on what the combined pattern means for this service area
- IMPORTANT: Only describe what is actually visible in the chart - do not invent data

BACK PAGE:
- "FASTR initiative:" followed by https://data.gffportal.org/key-theme/FASTR
```

## Prompt 2: Regional Disruptions Analysis

```prompt
Generate Annex 1: Regional Disruptions Analysis for all subnational areas. Insert this annex before the back page (FASTR initiative slide). The back page must remain as the very last slide of the complete report — remove it from its current position and re-add it after the annex.

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
- Title: "Annex 1: Subnational service utilization disruptions"

SLIDE 2 - Subnational summary heatmap
Title: Write an analytical headline summarizing the key subnational finding (e.g., "Large county-level disparities in performance highlight the need to understand local drivers of both service gains and gaps")

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m3-03-02"
  Metric: Difference between actual and expected service volume (Admin area 2) [percent]
  Values: pct_diff (Percent difference)
  Auto-disaggregated by: admin_area_2, indicator_common_id
  Optional disaggregations: year, month, period_id
- Display as a heatmap table: subnational areas (rows) x indicators (columns), showing the percentage difference for the most recent 6 months of the analysis period
- Color coding: Green = more than 10% above expected | White = -10% to +10% | Red = more than 10% below expected
- periodFilterOverride: Filter to the most recent 6 months of the analysis period
- Footer: "Percentage difference between the observed and expected number of services. A negative value indicates an observed level lower than the expected level (disruption), while a positive value indicates a higher level (surplus). Discrepancies greater than ±10% are highlighted in red or green."

Interpretation (left side): Describe in complete sentences:
- Which subnational areas show consistent surpluses or shortfalls across multiple indicators
- Whether areas that perform well on some indicators also perform well on others, or if performance varies by service area
- Any notable patterns (e.g., areas with strong maternal health but weak malaria services)

SLIDES 3+ - Subnational area profiles
For EACH subnational area in the platform, create a slide with:

Slide title: Name of the subnational area

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m3-03-02"
  Metric: Difference between actual and expected service volume (Admin area 2) [percent]
  Values: pct_diff (Percent difference)
  Auto-disaggregated by: admin_area_2, indicator_common_id
  Optional disaggregations: year, month, period_id
- vizPresetId: "disruption-chart" (or appropriate preset for subnational disruption charts)
- chartTitle: "Comparing reported service use to expected trends, [Area Name]"
- filterOverrides: Filter on admin_area_2 to show only this specific subnational area
- Display as a grid of disruption charts for ALL indicators (small multiples)
- periodFilterOverride: Use the same period as the main report

Interpretation (left side): Describe in complete sentences:
- Which indicators show disruptions (below expected) and when
- Which indicators show surpluses (above expected) and when
- The magnitude of deviations from expected
- Any patterns across indicators (e.g., all maternal indicators affected together)
```

## Prompt 3: Data Quality Assessment

```prompt
Generate a Data Quality Assessment annex. Insert this annex before the back page (FASTR initiative slide). The back page must remain as the very last slide of the complete report — remove it from its current position and re-add it after the annex.

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
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-02-02"
    Metric: Proportion of completed records [percent]
    Values: completeness_flag (Binary variable indicating whether the facility meets criteria)
    Optional disaggregations: admin_area_2, admin_area_3, indicator_common_id, year, month, period_id
  - vizPresetId: "completeness-table" (Completeness table by region - YYYYMM)
    Filters: indicator_common_id, admin_area_2
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): In complete sentences describe overall national trends in completeness over time, which indicators have low completeness (name them), and which administrative areas have low completeness (name them).

SLIDE 3 - Outliers
- Title: "Outliers"
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-01-01"
    Metric: Proportion of outliers [percent]
    Values: outlier_flag (Binary variable indicating whether this is an outlier)
    Optional disaggregations: admin_area_2, admin_area_3, indicator_common_id, year, month, period_id
  - vizPresetId: "outlier-table" (Outlier proportion table - YYYYMM)
    Filters: indicator_common_id, admin_area_2
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): In complete sentences describe overall national trends in outliers over time, which indicators have high outlier rates (name them), and which administrative areas have high outlier rates (name them).

SLIDE 4 - Internal consistency (first)
- Title: "Internal consistency"
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-03-01"
    Metric: Proportion of sub-national areas meeting consistency criteria [percent]
    Values: sconsistency
    Auto-disaggregated by: ratio_type
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "consistency-table" (Internal consistency table - YYYYMM)
    Filters: ratio_type, admin_area_2
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): In complete sentences describe what consistency comparisons are being made, overall patterns across the country, and which areas meet or fail consistency criteria.

SLIDE 5 - Internal consistency (second)
- Title: "Internal consistency"
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-03-01" (same metric, different view or breakdown)
  - vizPresetId: "consistency-table"
  - filterOverrides: Filter by admin_area_2 or ratio_type to show a different breakdown
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): Continue describing consistency patterns across administrative areas.

SLIDE 6 - Data quality trends (first)
- Title: "Trends in data quality"
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-04-01"
    Metric: Proportion of facilities with adequate data quality [percent]
    Values: dqa_score (Binary variable indicating adequate data quality)
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "dqa-score-table" (Overall DQA score table - YYYYMM)
    Filters: admin_area_2
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): In complete sentences describe how DQA scores have changed across years, overall country performance, and variation across administrative areas.

SLIDE 7 - Data quality trends (second)
- Title: "Trends in data quality"
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-04-02"
    Metric: Average data quality score across facilities [percent]
    Values: dqa_mean (Data quality score across facilities)
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "mean-dqa-table" (Mean DQA score table - YYYYMM)
    Filters: admin_area_2
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): In complete sentences describe mean DQA score trends across years, which areas have improving vs declining scores, and overall assessment of data quality trajectory.

SLIDE 8 - Completeness trends table
Title: Write an analytical headline about completeness trends (e.g., "Completeness is >95% for most indicators in 2025, strengthening confidence in disruption findings")

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m1-02-02"
  Metric: Proportion of completed records [percent]
  Values: completeness_flag
- vizPresetId: "completeness-timeseries" (Completeness over time - YYYYMM)
  Filters: indicator_common_id
- Display as a table: month (rows) x indicator (columns) showing completeness %
- Color coding: Green = 90% or above | Yellow = 80% to 89% | Red = below 80%
- periodFilterOverride: Use the same period as the main report
- Footer: "Higher completeness improves the reliability of the data, especially when completeness is stable over time. Completeness is defined as the percentage of reporting facilities each month out of the total number of facilities expected to report."

Interpretation (left side): Describe in complete sentences:
- Summary of completeness trends over the analysis period
- Which indicators have weaker completeness (name them)
- Whether completeness improved over time
- Why completeness matters for the disruptions analysis: observed values are adjusted for outliers only, while expected values are adjusted for both completeness and outliers. When completeness is high, disruptions are more likely to reflect true service changes. When completeness is low, apparent disruptions may reflect missing reports rather than real declines.
```
