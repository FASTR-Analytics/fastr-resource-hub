# Getting Started

## Orientation

### Dataset Overview
```prompt
Show me an overview of the data: what indicators, regions, and time periods are available? Create a summary slide showing data coverage.
```

### What's New
```prompt
What are the most recent data updates? Show me the latest reporting period and highlight any notable changes with a visualization.
```

# Data Quality

## Assessment

### Quality Review
```prompt
Create a data quality dashboard for [REGION/TIME PERIOD]. Show me:
- Completeness trends over time
- Outlier flags by indicator
- A summary slide with key quality issues and recommendations
Use visualizations to make patterns clear.
```

### Completeness Check
```prompt
Analyze data completeness across facilities and time periods. Show me a completeness heatmap and identify:
- Facilities with incomplete reporting
- Time periods with missing data
- Patterns in data gaps that might indicate systematic issues
```

### Outlier Detection
```prompt
Review the data for potential outliers or data quality issues. Show outliers visually and check for:
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
Analyze key health metrics over the past 12 months and create a trend analysis deck:
- One slide per significant trend with a time series visualization
- A summary slide highlighting top 3 improvements and top 3 concerns
- Include specific numbers and percentage changes on each slide
```

### Compare Regions
```prompt
Compare health indicator performance across administrative regions and create comparison slides:
- A chart comparing all regions with color-coded performance levels
- A table showing top and bottom performers with percent change
- A slide highlighting most improved and most concerning regions
```

### Period-over-Period Analysis
```prompt
Compare current period performance against the previous period for key indicators. Show the comparison with a visualization highlighting changes. Identify:
- Indicators with significant changes
- Whether changes align with expected trends
- Areas requiring immediate attention
```

### Where to Focus
```prompt
Based on the data, which regions or indicators should we prioritize for support? Identify areas with declining performance or persistent gaps. Create a summary slide showing the priority areas.
```

# Indicator Analysis

FASTR focuses on core RMNCAH-N indicators that represent key points along the health continuum. These indicators typically have higher reporting volumes and serve as proxies for broader service delivery patterns.

## Maternal Health

### ANC Disruptions
```prompt
Analyze ANC1 and ANC4 for disruptions and create visualization slides showing:
- Actual vs expected volumes with disruption periods highlighted
- Regional breakdown of which areas are most affected
- A summary slide with key findings and estimated missed services
```

### Delivery Services
```prompt
Analyze institutional delivery trends and create visualization slides showing:
- Actual vs expected volumes with disruption periods highlighted
- Subnational variation across regions
- A summary slide with key findings
```

### Postnatal Care
```prompt
Analyze PNC for disruptions and create visualization slides showing:
- PNC actual vs expected volumes with disruption periods highlighted
- Whether PNC visits are tracking with deliveries
- Gaps between expected and actual service volumes by region
```

## Child Health

### Immunization Coverage
```prompt
Analyze BCG, Penta1, and Penta3 for disruptions and create visualization slides showing:
- Actual vs expected for each vaccine with disruption periods highlighted
- Regions with persistent gaps
- A summary slide with key findings
```

### Dropout Analysis
```prompt
Compare Penta1 to Penta3 dropout patterns and show as a visualization over time. Are children completing the vaccine series? How has dropout changed? Show regional variation.
```

## General Services

### Outpatient Trends
```prompt
Analyze outpatient visit trends and create visualization slides showing:
- Actual vs expected volumes with disruption periods highlighted
- How patterns vary across regions
- A summary slide with key findings
```

## Cross-Indicator

### Service Continuity
```prompt
Create a cross-service disruption analysis with:
- Multi-panel visualization showing ANC, delivery, and immunization disruptions aligned by time
- A heatmap showing disruption severity by service and time period
- Summary slide: Are disruptions systemic or service-specific? Which services recovered fastest?
```

### Regional Comparison
```prompt
Which regions show the most disruptions across indicators? Create a heatmap showing disruption severity by region and indicator. Identify areas with consistent gaps between actual and expected service volumes.
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
Optionally add this chart to a slide with a title and key insight text.
```

### Regional Comparison
```prompt
Create a visualization comparing [METRIC NAME] across regions. Use:
- A bar chart for easy comparison
- Color coding to highlight performance levels
- Clear labels showing actual values
Optionally add this chart to a slide with interpretation.
```

### Disaggregated Analysis
```prompt
Create a visualization showing [METRIC NAME] disaggregated by [AGE/SEX/OTHER]. Display:
- Clear comparison between groups
- Percentage or absolute values as appropriate
- Trends over time if relevant
Optionally add this chart to a slide with interpretation.
```

### Heatmap
```prompt
Create a heatmap showing [DQ scores / completeness / performance] across [regions / indicators / time periods]. Use color coding to highlight areas needing attention. Optionally add to a slide.
```

# Reports & Communication

## Executive Summary

### Monthly Summary
```prompt
Create a monthly executive summary presentation:
- Cover slide: "Monthly Health Indicators Summary - [MONTH YEAR]"
- Key achievements: slides showing top improvements with visualizations
- Areas needing attention: slides showing top concerns with visualizations
- Final slide: recommended actions for stakeholders
Make it ready to present to senior leadership.
```

### Quarterly Report
```prompt
Create a quarterly report presentation covering the past 3 months:
- Cover slide: "Quarterly Health Report - [QUARTER YEAR]"
- Progress toward annual targets with visualizations
- Comparison with previous quarter
- Regional performance highlights with charts
- Final slide: recommended focus areas for next quarter
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

# Workflows

## Quick Actions

### Insight to Slide
```prompt
I found something interesting: [DESCRIPTION]. Create a slide showing this insight with an appropriate visualization, a clear title that states the finding, and supporting numbers.
```

### Quick Deck
```prompt
I need a quick 5-slide deck on [INDICATOR/TOPIC] for [AUDIENCE]. Include: current status, trend over time, regional comparison, data quality context, and recommendations.
```

### Data Story
```prompt
Tell me the data story about [TOPIC]. Walk me through the key findings with visualizations, then compile the most important ones into a presentation deck.
```

# Methodology

## Understanding Metrics

### Explain Indicator
```prompt
Explain how [METRIC NAME] is calculated and show me:
- Numerator and denominator definitions
- A visualization showing typical value ranges and current performance
- Data sources and common interpretation pitfalls
Optionally create a training slide explaining this indicator.
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

The analysis generation date is February 2026.

When user provides the analysis time period, convert to period_id format:
- Start date becomes min value: [YEAR][MONTH] as 6-digit number (e.g., January 2025 = 202501)
- End date becomes max value: [YEAR][MONTH] as 6-digit number (e.g., December 2025 = 202512)
- Store these values to use in periodFilterOverride for all indicator slides

STEP 2: DISCOVER AVAILABLE INDICATORS
Before generating the report, check what indicators are available in the platform for this country.

Each country instance has different indicator IDs (indicator_common_id) and labels. Do NOT assume a fixed list of codes — read them from the platform.

1. Review all indicator IDs and their labels available in the platform for this country
2. Present the full list to the user (ID + label)
3. Propose groupings based on the indicator labels. Use these as a starting guide, but adapt to what actually exists:
   - Antenatal Care: indicators related to ANC visits (e.g., anc1, anc4, anc_trimester1)
   - Deliveries and Postnatal Care: facility deliveries, skilled birth attendance, PNC, C-sections (e.g., delivery, sba, pnc1, csection)
   - Immunization: vaccines (e.g., bcg, penta1, penta3, measles1, opv1, fully_immunized)
   - Family Planning: FP counseling, new users, continuing users (e.g., fp_new, fp_new_and_cont, fp_counseled)
   - Adolescent Family Planning: if adolescent-specific FP indicators exist, group separately (e.g., fp_adolescent_counseled, fp_adolescent_new)
   - Malaria: testing, positivity, treatment (e.g., malaria_rdt_positive, malaria_treated_less_24hrs, mal_positive)
   - General Services / OPD: outpatient visits (e.g., opd, opd_under5, opd_over5)
   - Other groups as needed based on what exists (e.g., Nutrition, HIV/TB, NCDs, Mortality)
4. For any indicators that do not fit clearly into a group, present them to the user and ask:
   - "I found these additional indicators: [list with IDs and labels]. For each, would you like me to: (a) add it to an existing group, (b) create a new group, or (c) exclude it from the national analysis slides?"
   - Note: mortality indicators (e.g., maternal_deaths, neonatal_deaths, stillbirths) involve low-volume event counts and may not be suitable for the standard disruption chart — flag this to the user
5. Present the final proposed groupings to the user for confirmation before proceeding

Each confirmed group will become ONE slide in the national analysis section, with all indicators in that group shown side by side on the same chart. Use the exact indicator_common_id values from the platform for the filterOverrides and selectedReplicant parameters.

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

SLIDE 2 - Subnational summary table
Title: Write an analytical headline summarizing the key subnational finding (e.g., "Large county-level disparities in performance highlight the need to understand local drivers of both service gains and gaps")

Create a content slide with a data table showing:
- Rows: each subnational area
- Columns: each indicator (use short labels)
- Values: percentage difference between actual and expected service volumes for the most recent 6 months of the analysis period
- Use get_metric_data with metricId "m3-03-02" to retrieve the data, then build the table on the slide
- Color coding: Green = more than 10% above expected | White = -10% to +10% | Red = more than 10% below expected
- Footer: "Percentage difference between the observed and expected number of services. A negative value indicates an observed level lower than the expected level (disruption), while a positive value indicates a higher level (surplus). Discrepancies greater than ±10% are highlighted in red or green."

Below the table, add 2-3 sentences summarizing the key patterns (e.g., which areas show consistent surpluses or shortfalls, whether performance varies by service area).

SLIDES 3+ - Subnational area profiles
For EACH subnational area in the platform, create a simple slide with:

- Title: Name of the subnational area
- Visualization: Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m3-02-01"
    Metric: Actual vs expected service volume (National) [number] — filtered to this specific area
    Values: count_sum (Actual service volume), count_expected_if_above_diff_threshold (Expected service volume)
    Auto-disaggregated by: indicator_common_id
  - vizPresetId: "disruption-chart"
  - chartTitle: "Comparing reported service use to expected trends, [Area Name]"
  - filterOverrides: Filter on admin_area_2 to show only this specific subnational area, and on indicator_common_id to include all indicators from the report
  - periodFilterOverride: Use the same period as the main report

Keep these slides clean — area name and visualization only, no interpretation text.
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
- Fixed text (include on slide below the interpretation): "Higher completeness improves the reliability of the data, especially when completeness is stable over time. Completeness is defined as the percentage of reporting facilities each month out of the total number of facilities expected to report. A facility is expected to report if it has reported any volume for each indicator anytime within a year. A high completeness does not indicate that the HMIS is representative of all service delivery in the country, as some services may not be delivered in facilities, or some facilities may not report."

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
- Fixed text (include on slide below the interpretation): "Outliers are reports which are suspiciously high compared to the usual volume reported by the facility in other months. Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator. Outliers are defined as observations which are greater than 10 times the median absolute deviation (MAD) from the monthly median value for the indicator in each time period, OR a value for which the proportional contribution in volume for a facility, indicator, and time period is greater than 80%. Outliers are only identified for indicators where the volume is greater than or equal to the median, the volume is not missing, and the average volume is greater than 100."

SLIDE 4 - Internal consistency
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
- Fixed text (include on slide below the interpretation): "Internal consistency assesses the plausibility of reported data based on related indicators. Consistency metrics are approximate — depending on timing and seasonality, indicator definitions, and the nature of service delivery and reporting, values may be expected to sit outside plausible ranges. Indicators which are similar are expected to have roughly the same volume over the year (within a 30% margin). The data in this analysis is adjusted for outliers."

SLIDE 5 - Data quality trends (overall DQA score)
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
- Fixed text (include on slide below the interpretation): "Adequate data quality is defined as: 1) No missing data or outliers for OPD, Penta1, and ANC1, where available 2) Consistent reporting between Penta1/Penta3 and ANC1/ANC4."

SLIDE 6 - Data quality trends (mean DQA score)
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
- Fixed text (include on slide below the interpretation): "Items included in the DQA score include: No missing data for 1) OPD, 2) Penta1, and 3) ANC1, where available; No outliers for 4) OPD, 5) Penta1, and 6) ANC1, where available; Consistent reporting between 7) Penta1/Penta3, 8) ANC1/ANC4, 9) BCG/Delivery, where available."

SLIDE 7 - Completeness trends table
Title: Write an analytical headline about completeness trends (e.g., "Completeness is >95% for most indicators in 2025, strengthening confidence in disruption findings")

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m1-02-02"
  Metric: Proportion of completed records [percent]
  Values: completeness_flag (Binary variable indicating whether the facility meets criteria)
  Optional disaggregations: admin_area_2, admin_area_3, indicator_common_id, year, month, period_id
- vizPresetId: "completeness-table" (Completeness table by region - YYYYMM)
  Filters: indicator_common_id, admin_area_2
- Display as a table: period_id (rows) x indicator_common_id (columns) showing completeness %
- Color coding: Green = 90% or above | Yellow = 80% to 89% | Red = below 80%
- periodFilterOverride: Use the same period as the main report

Interpretation (left side): Describe in complete sentences:
- Summary of completeness trends over the analysis period
- Which indicators have weaker completeness (name them)
- Whether completeness improved over time

Then include this fixed text block:

**Why Completeness Matters for the Disruptions Analysis**

Observed values: These are adjusted for outliers only, so they reflect the actual raw service volumes after removing implausible spikes.

Expected values: These are adjusted for both completeness and outliers. This means the model "fills in" where reporting gaps exist, building an expected trend line as if all facilities had reported consistently.

When completeness is high, observed and expected volumes are more comparable, and disruptions are more likely to reflect true service changes.

When completeness is low, expected values may be artificially higher than observed, creating apparent "disruptions" that actually reflect missing reports rather than real declines in service delivery.
```
