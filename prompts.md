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
- A summary slide highlighting top 3 positive findings and top 3 areas of concern
- Include specific numbers and percentage changes on each slide
Remember: for mortality indicators, an increase is a concern, not an improvement.
```

### Compare Regions
```prompt
Compare health indicator performance across administrative regions and create comparison slides:
- A chart comparing all regions with color-coded performance levels
- A table showing top and bottom performers with percent change
- A slide highlighting most improved and most concerning regions
Remember: for mortality indicators, higher values are worse — rank accordingly.
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
Based on the data, which regions or indicators should we prioritize for support? Identify areas with declining service delivery, rising mortality or dropout rates, or persistent gaps. Create a summary slide showing the priority areas.
```

# Indicator Analysis

FASTR focuses on core RMNCAH-N indicators that represent key points along the health continuum. These indicators typically have higher reporting volumes and serve as proxies for broader service delivery patterns.

**Important**: Not all increases are improvements. For service delivery indicators (ANC, deliveries, immunizations), an increase is positive. But for mortality indicators (maternal deaths, neonatal deaths, stillbirths) and dropout rates, an increase is ALWAYS negative — more deaths or more dropouts is bad. Frame all analysis accordingly.

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
Compare Penta1 to Penta3 dropout patterns and show as a visualization over time. Are children completing the vaccine series? How has dropout changed? Show regional variation. Note: increasing dropout is a negative finding — it means fewer children complete the series.
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
- Positive findings: slides showing top improvements with visualizations
- Areas needing attention: slides showing top concerns with visualizations
- Final slide: recommended actions for stakeholders
Make it ready to present to senior leadership.
Remember: for mortality indicators, an increase is always a concern, never an achievement. For service indicators, an increase is positive.
```

### Quarterly Report
```prompt
Create a quarterly report presentation covering the past 3 months:
- Cover slide: "Quarterly Health Report - [QUARTER YEAR]"
- Progress toward annual targets with visualizations
- Comparison with previous quarter
- Regional performance highlights with charts
- Final slide: recommended focus areas for next quarter
Remember: for mortality indicators, an increase is always a concern, never progress. For service indicators, an increase is positive.
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
I need a quick 5-slide deck on [INDICATOR/TOPIC] for [AUDIENCE]. Include: current status, trend over time, regional comparison, data quality context, and recommendations. Frame trends correctly: increases in service delivery are positive, but increases in mortality or dropout rates are negative.
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

Always check if the user is in editing_slide_deck mode. If the user is not in this mode, ask them to either create a new slide deck or open an existing one.

STEP 1: ASK THE USER
You should already know which country this is from the platform context. If you don't know what country this is, use ask_user_questions to ask.

Use ask_user_questions to ask each of the following one at a time:
1. "What analysis time period should I use? (start month/year to end month/year, e.g., January 2023 to September 2025)"
2. "What would you like as the cover subtitle?" — offer these as selectable options: "Q3 2025", "2025 Annual", "January-June 2025" (the user can also type their own)

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
4. Use ask_user_questions to present the proposed groupings for review. List each group with its indicators (ID + label). Ask: "Here are the proposed indicator groupings. Would you like to change anything — move indicators between groups, create new groups, or exclude any?"
5. After the main groupings are confirmed, check for mortality indicators (e.g., maternal_deaths, neonatal_deaths, stillbirths). Always use ask_user_questions to ask: "The platform has these mortality indicators: [list]. Mortality data involves low event counts and different interpretation (increases = bad). Would you like to include them in the report or exclude them?"

Each confirmed group will become ONE slide in the national analysis section, with all indicators in that group shown side by side on the same chart. Use the exact indicator_common_id values from the platform for the filterOverrides and selectedReplicant parameters.

ACCURACY REQUIREMENTS:
1. Base all analysis only on data visible in the platform - do not draw on external knowledge
2. Do not invent statistics, percentages, or specific numbers - if data is not visible, say so
3. If you cannot verify a claim from the data, mark it with [VERIFY]
4. Do not guess at dates, time periods, or magnitudes

REPORT STANDARDS:
1. Maintain cautious, analytical language - no causal claims
2. Treat disruption signals as descriptive and exploratory
3. Keep slide text concise — target 50-100 words per slide (max 180 words), use bullet points where appropriate
4. Layout: interpretation on left, visualization on right
5. Use consistent terminology throughout (do not switch between synonyms)
6. In all slide text (titles, interpretations, headlines), refer to indicators by their human-readable label ONLY (e.g., "Pneumonia cases identified", "ANC first visit"). NEVER include indicator_common_id codes in slide text — not on their own, not in parentheses, not as "code (Label)". Write "Pneumonia cases identified", NOT "pneumonia_cases_identified (Pneumonia cases identified)". Codes are only for technical parameters (filterOverrides, selectedReplicant)
7. Always refer to slides by their number (not their ID)

CRITICAL — INDICATOR INTERPRETATION RULES:
NOT all increases are good. NOT all decreases are bad. You MUST apply the correct interpretation based on indicator type:

Service delivery indicators (increase = positive, decrease = concern):
- ANC visits, deliveries, PNC visits, immunizations, OPD visits, family planning, skilled birth attendance
- For these: "surplus" (above expected) = positive signal, "disruption" (below expected) = concern

Mortality and adverse outcome indicators (increase = BAD, decrease = positive):
- Maternal deaths, neonatal deaths, stillbirths, and any indicator measuring deaths or adverse events
- For these: an INCREASE is a NEGATIVE finding — more deaths is ALWAYS bad
- For these: a DECREASE is a POSITIVE finding — fewer deaths is ALWAYS good
- NEVER describe an increase in deaths as an "improvement" or "positive trend"
- NEVER describe a decrease in deaths as a "concern" or "disruption"

Negative quality indicators (increase = bad, decrease = good):
- Dropout rates (e.g., Penta1 to Penta3 dropout), outlier rates, stockout rates
- For these: an increase means the situation is worsening

When writing headlines and interpretations, always check: does this indicator measure something we WANT more of (services) or something we want LESS of (deaths, dropouts)? Frame your language accordingly.

VERIFICATION - Before finalizing each slide, cross-check:
1. All numeric values match what the visualization shows
2. Time periods and indicator names are correctly referenced
3. Described trends (increases, decreases) match the actual data direction
4. Numbers are consistent across slides (same indicator = same values)
5. Interpretation framing matches indicator type — an increase in deaths is NEVER described as positive

STRUCTURE:

SLIDE 1 - Cover slide
- Title: "Tracking Disruptions in Essential Services Using HMIS Data in [COUNTRY]"
- Subtitle: "[REPORT_SUBTITLE]"
- Add a text block at the bottom: "Analysis generated in [CURRENT_MONTH_YEAR]"

SLIDE 2 - Introductory slide
- Title: "Tracking Disruptions in Essential Services Using HMIS Data"
- Text block: "The FASTR approach uses routine HMIS data to monitor how service delivery shifts over time. By comparing observed vs. expected service volumes — adjusted for seasonality and historical trends — we can identify disruptions or surpluses in key health services. This analysis provides a timely, system-wide perspective, highlighting where and when service use deviates from expected patterns. Findings generate actionable evidence to guide rapid responses, helping sustain continuity of essential care during funding uncertainty or operational change."
- Add an image block

SLIDE 3 - Methodology slide
- Title: "Methodology: Service Utilization Assessment"
- Purpose: Track changes in health service use over time, identifying where services fall below or rise above expected patterns.
- How it works: Uses routine HMIS data, cleaned for outliers and missing values. Builds an "expected" trend line for each service, adjusting for seasonality and historical trends. Compares actual service volumes to expected levels.
- Measuring impact: Flagged disruption periods are analyzed to estimate how much service volumes changed compared to what was expected. Results are shown at national and sub-national levels.
- How to interpret figures: Red shaded areas = potential disruptions (below expected). Green shaded areas = potential surpluses (above expected). These are signals, not conclusions — they require further investigation.
- Add a text block at the bottom: "More details on the methodology are found on GitHub (https://fastr-analytics.github.io/fastr-resource-hub/)."

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

Interpretation (left side — target 50-100 words, max 180): Analyze the data shown in the visualization. Use bullet points covering:
- For EACH indicator: specific time periods of disruptions/surpluses, with approximate magnitudes (numbers or percentages from the chart)
- Cross-indicator patterns: how indicators relate to each other
- Overall assessment of what the combined pattern means
- IMPORTANT: Only describe what is actually visible in the chart - do not invent data

Good example (for a Deliveries & PNC group):
"- Deliveries: Stable through 2023-24, clear surplus in early 2025 (~1,200 more facility deliveries than expected per month, +9.6%), moderate decline mid-2025 but still near expected levels by September
- PNC visits: Multiple disruptions below expected in 2023-24, increase then decrease in 2025 bringing volumes closer to expected
- Both indicators follow the same 2025 trajectory, consistent with PNC typically tracking delivery trends"

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
5. Always refer to slides by their number (not their ID)

CRITICAL — INDICATOR INTERPRETATION RULES:
NOT all increases are good. NOT all decreases are bad. You MUST apply the correct interpretation based on indicator type:

Service delivery indicators (increase = positive, decrease = concern):
- ANC visits, deliveries, PNC visits, immunizations, OPD visits, family planning, skilled birth attendance
- For these: "surplus" (above expected) = positive signal, "disruption" (below expected) = concern

Mortality and adverse outcome indicators (increase = BAD, decrease = positive):
- Maternal deaths, neonatal deaths, stillbirths, and any indicator measuring deaths or adverse events
- For these: an INCREASE is a NEGATIVE finding — more deaths is ALWAYS bad
- For these: a DECREASE is a POSITIVE finding — fewer deaths is ALWAYS good
- NEVER describe an increase in deaths as an "improvement" or "positive trend"
- NEVER describe a decrease in deaths as a "concern" or "disruption"

Negative quality indicators (increase = bad, decrease = good):
- Dropout rates (e.g., Penta1 to Penta3 dropout), outlier rates, stockout rates
- For these: an increase means the situation is worsening

When writing headlines and interpretations, always check: does this indicator measure something we WANT more of (services) or something we want LESS of (deaths, dropouts)? Frame your language accordingly.

VERIFICATION: Before finalizing each slide, cross-check that described trends match what the visualization shows. Confirm interpretation framing matches indicator type — an increase in deaths is NEVER described as positive.

STRUCTURE:

SLIDE 1 - Annex header slide
- Title: "Annex 1: Subnational service utilization disruptions"

SLIDE 2 - Subnational summary table
Title: Write an analytical headline summarizing the key subnational finding (e.g., "Large county-level disparities in performance highlight the need to understand local drivers of both service gains and gaps")

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: "m3-03-02"
  Metric: Difference between actual and expected service volume [Admin area 2] [percent]
  Values: pct_diff (Percent difference)
  Auto-disaggregated by: admin_area_2, indicator_common_id
- vizPresetId: "disruption-differences-table"
- filterOverrides: Filter on indicator_common_id to include all indicators from the report
- periodFilterOverride: Use the same period as the main report

Interpretation (left side): 2-3 sentences summarizing the key patterns (e.g., which areas show consistent surpluses or shortfalls, whether performance varies by service area).

Add a text block at the bottom: "Percentage difference between the observed and expected number of services. A negative value indicates an observed level lower than the expected level (disruption), while a positive value indicates a higher level (surplus)."

SLIDES 3+ - Subnational area profiles
For EACH subnational area in the platform, create a simple slide with:

- Title: Name of the subnational area
- Visualization: Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m3-03-01"
    Metric: Actual vs expected service volume [Admin area 2] [number]
    Values: count_sum (Actual service volume), count_expected_if_above_diff_threshold (Expected service volume)
    Auto-disaggregated by: admin_area_2, indicator_common_id
  - vizPresetId: "disruption-chart-single-admin-area-2" (REQUIRES selectedReplicant)
  - chartTitle: "Comparing reported service use to expected trends, [Area Name]"
  - selectedReplicant: The admin_area_2 value for this specific subnational area
  - filterOverrides: Filter on indicator_common_id to include all indicators from the report
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
4. Always refer to slides by their number (not their ID)

METHODOLOGY REFERENCE:
If you need additional context on how FASTR calculates data quality metrics, fetch the methodology documentation from https://fastr-analytics.github.io/fastr-resource-hub/. Use it to write accurate summaries and interpretations for each slide.

DATA QUALITY METRICS:
Use get_available_metrics to confirm available metrics and their preset visualizations. The data quality metrics used in this annex are:
- m1-01-01: Proportion of outliers [percent] — preset: outlier-table — filters: indicator_common_id, admin_area_2
- m1-02-02: Proportion of completed records [percent] — preset: completeness-table — filters: indicator_common_id, admin_area_2. ALWAYS use completeness-table preset for this metric (do NOT use completeness-timeseries)
- m1-03-01: Proportion of sub-national areas meeting consistency criteria [percent] — preset: consistency-table — filters: ratio_type, admin_area_2
- m1-04-01: Proportion of facilities with adequate data quality [percent] — preset: dqa-score-table — filters: admin_area_2
- m1-04-02: Average data quality score across facilities [percent] — preset: mean-dqa-table — filters: admin_area_2

For each slide, create the visualization using from_metric with the metricId and vizPresetId specified. Use periodFilterOverride matching the main report period.

VERIFICATION: Before finalizing each slide, cross-check that all percentages and scores match what the visualization shows.

STRUCTURE:

STEP 1: GENERATE COMPLETENESS SUMMARY

SLIDE 1 - Cover slide
- Title: "Annex [1 or 2]: Trends in Indicator Reporting Completeness"

SLIDE 2 - Completeness trends
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

Interpretation (left side): Use bullet points:
- Summary of completeness trends over the analysis period
- Which indicators have weaker completeness (name them)
- Whether completeness improved over time

Then add a text block with:

**Why Completeness Matters for the Disruptions Analysis**

Observed values: These are adjusted for outliers only, so they reflect the actual raw service volumes after removing implausible spikes.

Expected values: These are adjusted for both completeness and outliers. This means the model "fills in" where reporting gaps exist, building an expected trend line as if all facilities had reported consistently.

When completeness is high, observed and expected volumes are more comparable, and disruptions are more likely to reflect true service changes.

When completeness is low, expected values may be artificially higher than observed, creating apparent "disruptions" that actually reflect missing reports rather than real declines in service delivery.

STEP 2: ASK THE USER
After generating the completeness summary, use ask_user_questions to ask: "Would you like me to add additional data quality slides covering outliers, internal consistency, and DQA score trends?" — ask this exact question only, do not add explanations

If the user says yes, update the cover slide title to "Annex [1 or 2]: Data Quality Assessment", then generate the following additional slides:

SLIDE 3 - Outliers
- Title: Write an analytical headline about outlier patterns (e.g., "Outlier rates remain low nationally but [X] shows elevated rates in recent months")
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-01-01"
    Metric: Proportion of outliers [percent]
    Values: outlier_flag (Binary variable indicating whether this is an outlier)
    Optional disaggregations: admin_area_2, admin_area_3, indicator_common_id, year, month, period_id
  - vizPresetId: "outlier-table" (Outlier proportion table - YYYYMM)
    Filters: indicator_common_id, admin_area_2
  - Display as a table: period_id (rows) × indicator_common_id (columns) showing outlier %
  - Color coding: Green = below 2% | Yellow = 2% to 5% | Red = above 5%
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): Use bullet points:
  - Describe the overall national trend in outlier rates — are they stable, improving, or worsening?
  - Name specific indicators with the highest outlier rates
  - Note whether outlier rates have improved or worsened over the analysis period
  - Explain the implication: high outlier rates mean more values are being adjusted, which can affect the reliability of trend analysis
- Add a text block below the interpretation: "Outliers are reports which are suspiciously high compared to the usual volume reported by the facility in other months. Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator. Outliers are defined as observations which are greater than 10 times the median absolute deviation (MAD) from the monthly median value for the indicator in each time period, OR a value for which the proportional contribution in volume for a facility, indicator, and time period is greater than 80%. Outliers are only identified for indicators where the volume is greater than or equal to the median, the volume is not missing, and the average volume is greater than 100."

SLIDE 4 - Internal consistency
- Title: Write an analytical headline about consistency (e.g., "Most indicator pairs show consistent reporting, but [RATIO] falls outside plausible ranges in several regions")
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-03-01"
    Metric: Proportion of sub-national areas meeting consistency criteria [percent]
    Values: sconsistency
    Auto-disaggregated by: ratio_type
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "consistency-table" (Internal consistency table - YYYYMM)
    Filters: ratio_type, admin_area_2
  - Display as a table: period_id (rows) × ratio_type (columns) showing % of areas meeting consistency criteria
  - Color coding: Green = 90% or above | Yellow = 70% to 89% | Red = below 70%
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): Use bullet points:
  - Explain what each ratio_type represents (e.g., Penta1/Penta3 compares first to third dose, ANC1/ANC4 compares first to fourth visit)
  - Identify which ratios consistently meet or fail criteria
  - Note whether consistency is improving or worsening over the analysis period
  - Highlight any specific regions where consistency is notably low
- Add a text block below the interpretation: "Internal consistency assesses the plausibility of reported data based on related indicators. Consistency metrics are approximate — depending on timing and seasonality, indicator definitions, and the nature of service delivery and reporting, values may be expected to sit outside plausible ranges. Indicators which are similar are expected to have roughly the same volume over the year (within a 30% margin). The data in this analysis is adjusted for outliers."

SLIDE 5 - Data quality trends (overall DQA score)
- Title: Write an analytical headline about DQA trends (e.g., "The proportion of facilities with adequate data quality has improved from X% to Y% since [YEAR]")
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-04-01"
    Metric: Proportion of facilities with adequate data quality [percent]
    Values: dqa_score (Binary variable indicating adequate data quality)
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "dqa-score-table" (Overall DQA score table - YYYYMM)
    Filters: admin_area_2
  - Display as a table: admin_area_2 (rows) × year (columns) showing % of facilities with adequate DQ
  - Color coding: Green = 70% or above | Yellow = 50% to 69% | Red = below 50%
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): Use bullet points:
  - Describe the national trend — is DQ improving over time?
  - Name top-performing and lowest-performing regions
  - Identify regions where DQ has notably improved or declined
  - Explain the implication: areas with low DQA scores may have less reliable disruption estimates
- Add a text block below the interpretation: "Adequate data quality is defined as: 1) No missing data or outliers for OPD, Penta1, and ANC1, where available 2) Consistent reporting between Penta1/Penta3 and ANC1/ANC4."

SLIDE 6 - Data quality trends (mean DQA score)
- Title: Write an analytical headline about mean DQA trends (e.g., "Mean data quality scores are highest in [X] and [Y], while [Z] lags behind")
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-04-02"
    Metric: Average data quality score across facilities [percent]
    Values: dqa_mean (Data quality score across facilities)
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "mean-dqa-table" (Mean DQA score table - YYYYMM)
    Filters: admin_area_2
  - Display as a table: admin_area_2 (rows) × year (columns) showing mean DQA score %
  - Color coding: Green = 70% or above | Yellow = 50% to 69% | Red = below 50%
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): Use bullet points:
  - Describe the national mean DQA trend — is it improving, stable, or declining?
  - Contrast top-performing vs lowest-performing regions
  - Note any regions showing significant improvement or decline
  - Conclude with an overall assessment of data quality trajectory and what it means for the disruption analysis
- Add a text block below the interpretation: "Items included in the DQA score include: No missing data for 1) OPD, 2) Penta1, and 3) ANC1, where available; No outliers for 4) OPD, 5) Penta1, and 6) ANC1, where available; Consistent reporting between 7) Penta1/Penta3, 8) ANC1/ANC4, 9) BCG/Delivery, where available."
```

## Prompt 4: Subnational Disruptions Report

```prompt
Generate a FASTR Subnational Disruptions Report. This report focuses on a single subnational area (e.g., a state, province, or county) and is self-contained — it covers the main disruption analysis, with optional sub-area breakdown and data quality assessment.

Always check if the user is in editing_slide_deck mode. If the user is not in this mode, ask them to either create a new slide deck or open an existing one.

STEP 1: ASK THE USER
You should already know which country this is from the platform context. If you don't know what country this is, use ask_user_questions to ask.

Use ask_user_questions to ask each of the following one at a time:
1. "Which subnational area should this report focus on? (e.g., a zone, state, county, or district)" — ask as a free-text question, let the user type the area name
2. "What analysis time period should I use? (start month/year to end month/year, e.g., January 2023 to September 2025)"
3. "What would you like as the cover subtitle?" — offer these as selectable options: "Q3 2025", "2025 Annual", "January-June 2025" (the user can also type their own)

The analysis generation date is February 2026.

When user provides the analysis time period, convert to period_id format:
- Start date becomes min value: [YEAR][MONTH] as 6-digit number (e.g., January 2025 = 202501)
- End date becomes max value: [YEAR][MONTH] as 6-digit number (e.g., December 2025 = 202512)
- Store these values to use in periodFilterOverride for all indicator slides

STEP 2: IDENTIFY ADMIN LEVEL AND METRICS
You already know each country's admin hierarchy. Based on the country and area name from Step 1, determine which admin level the area belongs to and verify it exists in the platform.

Record for use throughout the report:
- AREA_LEVEL: the admin level column (e.g., "admin_area_2" or "admin_area_3")
- AREA_VALUE: the exact area name as it appears in the platform

Use get_available_metrics to find the disruption metric and single-area chart preset for AREA_LEVEL. Store as AREA_METRIC_ID and AREA_PRESET_ID.

Common metric mappings:
- admin_area_2: metricId "m3-03-01", vizPresetId "disruption-chart-single-admin-area-2"
- admin_area_3: metricId "m3-04-01", vizPresetId "disruption-chart-single-admin-area-3"

Also check if a disruption metric exists at the next admin level down (for the optional sub-area breakdown in Step 4). If found, store as SUB_AREA_METRIC_ID, SUB_AREA_PRESET_ID, and SUB_AREA_TABLE_METRIC_ID:
- If AREA_LEVEL is admin_area_2, the sub-area metrics are:
  - SUB_AREA_METRIC_ID: "m3-04-01" (single district chart)
  - SUB_AREA_PRESET_ID: "disruption-chart-single-admin-area-3"
  - SUB_AREA_TABLE_METRIC_ID: "m3-04-02" with vizPresetId "disruption-differences-table-single-admin-area-2-multiple-admin-area-3" (summary table of all districts within the area)

If no disruption metric exists at AREA_LEVEL, inform the user and suggest alternatives.

STEP 3: DISCOVER AVAILABLE INDICATORS
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
4. Use ask_user_questions to present the proposed groupings for review. List each group with its indicators (ID + label). Ask: "Here are the proposed indicator groupings. Would you like to change anything — move indicators between groups, create new groups, or exclude any?"
5. After the main groupings are confirmed, check for mortality indicators (e.g., maternal_deaths, neonatal_deaths, stillbirths). Always use ask_user_questions to ask: "The platform has these mortality indicators: [list]. Mortality data involves low event counts and different interpretation (increases = bad). Would you like to include them in the report or exclude them?"

Each confirmed group will become ONE slide in the analysis section, with all indicators in that group shown side by side on the same chart. Use the exact indicator_common_id values from the platform for the filterOverrides and selectedReplicant parameters.

ACCURACY REQUIREMENTS:
1. Base all analysis only on data visible in the platform - do not draw on external knowledge
2. Do not invent statistics, percentages, or specific numbers - if data is not visible, say so
3. If you cannot verify a claim from the data, mark it with [VERIFY]
4. Do not guess at dates, time periods, or magnitudes

REPORT STANDARDS:
1. Maintain cautious, analytical language - no causal claims
2. Treat disruption signals as descriptive and exploratory
3. Keep slide text concise — target 50-100 words per slide (max 180 words), use bullet points where appropriate
4. Layout: interpretation on left, visualization on right
5. Use consistent terminology throughout (do not switch between synonyms)
6. In all slide text (titles, interpretations, headlines), refer to indicators by their human-readable label ONLY (e.g., "Pneumonia cases identified", "ANC first visit"). NEVER include indicator_common_id codes in slide text — not on their own, not in parentheses, not as "code (Label)". Write "Pneumonia cases identified", NOT "pneumonia_cases_identified (Pneumonia cases identified)". Codes are only for technical parameters (filterOverrides, selectedReplicant)
7. Always refer to slides by their number (not their ID)

CRITICAL — INDICATOR INTERPRETATION RULES:
NOT all increases are good. NOT all decreases are bad. You MUST apply the correct interpretation based on indicator type:

Service delivery indicators (increase = positive, decrease = concern):
- ANC visits, deliveries, PNC visits, immunizations, OPD visits, family planning, skilled birth attendance
- For these: "surplus" (above expected) = positive signal, "disruption" (below expected) = concern

Mortality and adverse outcome indicators (increase = BAD, decrease = positive):
- Maternal deaths, neonatal deaths, stillbirths, and any indicator measuring deaths or adverse events
- For these: an INCREASE is a NEGATIVE finding — more deaths is ALWAYS bad
- For these: a DECREASE is a POSITIVE finding — fewer deaths is ALWAYS good
- NEVER describe an increase in deaths as an "improvement" or "positive trend"
- NEVER describe a decrease in deaths as a "concern" or "disruption"

Negative quality indicators (increase = bad, decrease = good):
- Dropout rates (e.g., Penta1 to Penta3 dropout), outlier rates, stockout rates
- For these: an increase means the situation is worsening

When writing headlines and interpretations, always check: does this indicator measure something we WANT more of (services) or something we want LESS of (deaths, dropouts)? Frame your language accordingly.

VERIFICATION - Before finalizing each slide, cross-check:
1. All numeric values match what the visualization shows
2. Time periods and indicator names are correctly referenced
3. Described trends (increases, decreases) match the actual data direction
4. Numbers are consistent across slides (same indicator = same values)
5. Interpretation framing matches indicator type — an increase in deaths is NEVER described as positive

STRUCTURE:

SLIDE 1 - Cover slide
- Title: "Tracking Disruptions in Essential Services Using HMIS Data in [AREA NAME], [COUNTRY]"
- Subtitle: "[REPORT_SUBTITLE]"
- Add a text block at the bottom: "Analysis generated in [CURRENT_MONTH_YEAR]"

SLIDE 2 - Introductory slide
- Title: "Tracking Disruptions in Essential Services Using HMIS Data"
- Text block: "The FASTR approach uses routine HMIS data to monitor how service delivery shifts over time. By comparing observed vs. expected service volumes — adjusted for seasonality and historical trends — we can identify disruptions or surpluses in key health services. This analysis provides a timely, system-wide perspective, highlighting where and when service use deviates from expected patterns. Findings generate actionable evidence to guide rapid responses, helping sustain continuity of essential care during funding uncertainty or operational change."
- Add an image block

SLIDE 3 - Methodology slide
- Title: "Methodology: Service Utilization Assessment"
- Purpose: Track changes in health service use over time, identifying where services fall below or rise above expected patterns.
- How it works: Uses routine HMIS data, cleaned for outliers and missing values. Builds an "expected" trend line for each service, adjusting for seasonality and historical trends. Compares actual service volumes to expected levels.
- Measuring impact: Flagged disruption periods are analyzed to estimate how much service volumes changed compared to what was expected. Results are shown for [AREA NAME].
- How to interpret figures: Red shaded areas = potential disruptions (below expected). Green shaded areas = potential surpluses (above expected). These are signals, not conclusions — they require further investigation.
- Add a text block at the bottom: "More details on the methodology are found on GitHub (https://fastr-analytics.github.io/fastr-resource-hub/)."

SLIDE 4 - Indicator selection slide
- Title: "Methodology: Indicator selection"
- Subtitle: "Indicators for the service utilization analysis were selected considering nationally prioritized indicators."
- List all available indicators grouped by the confirmed categories from Step 3

SLIDE 5 - Section header slide
- Title: "Service Utilization in [AREA NAME]"
- Subtitle: "Assessment of projected volumes based on historical trends to identify surpluses and disruptions in health services"

SLIDES 6+ - Area-level disruption analysis slides (one slide per indicator GROUP)
Create one slide for each confirmed indicator group from Step 3. Each slide shows all indicators in that group side by side.

FOR EACH GROUP SLIDE:

Title: Write an analytical headline (1-2 sentences) that summarizes the key finding for this group of indicators. The headline should describe what the data shows, not just name the indicators.
- Good example: "Despite widespread shortfalls in 2024, immunization services show signs of recovery by mid-2025, with some disruption in BCG"
- Good example: "Deliveries show surplus in 2025, while PNC recovered after earlier disruptions"
- Bad example: "BCG - Bacillus Calmette-Guérin vaccine"
- Bad example: "Immunization indicators"

Visualization (right side): Create using from_metric with these parameters:
- type: "from_metric"
- metricId: AREA_METRIC_ID (determined in Step 2, e.g., "m3-03-01" for admin_area_2)
- vizPresetId: AREA_PRESET_ID (determined in Step 2, e.g., "disruption-chart-single-admin-area-2" for admin_area_2)
- chartTitle: "Comparing reported service use to expected trends, [AREA NAME]"
- selectedReplicant: AREA_VALUE (the exact area name from the platform)
- filterOverrides: Filter on indicator_common_id to include ALL indicator codes for this group:
  - col: "indicator_common_id"
  - vals: [all indicator codes in the group, e.g., ["anc1", "anc4"] or ["bcg", "penta1", "penta3"]]
- periodFilterOverride:
  - periodOption: "period_id"
  - min: Start date as 6-digit number (e.g., 202301 for January 2023)
  - max: End date as 6-digit number (e.g., 202509 for September 2025)

Interpretation (left side — target 50-100 words, max 180): Analyze the data shown in the visualization. Use bullet points covering:
- For EACH indicator: specific time periods of disruptions/surpluses, with approximate magnitudes (numbers or percentages from the chart)
- Cross-indicator patterns: how indicators relate to each other
- Overall assessment of what the combined pattern means
- IMPORTANT: Only describe what is actually visible in the chart - do not invent data

Good example (for a Deliveries & PNC group):
"- Deliveries: Stable through 2023-24, clear surplus in early 2025 (~1,200 more facility deliveries than expected per month, +9.6%), moderate decline mid-2025 but still near expected levels by September
- PNC visits: Multiple disruptions below expected in 2023-24, increase then decrease in 2025 bringing volumes closer to expected
- Both indicators follow the same 2025 trajectory, consistent with PNC typically tracking delivery trends"

BACK PAGE:
- "FASTR initiative:" followed by https://data.gffportal.org/key-theme/FASTR

STEP 4 (OPTIONAL): SUB-AREA BREAKDOWN
Before asking the user, first verify that sub-area data actually exists: use get_metric_data with SUB_AREA_METRIC_ID to check if data is returned for areas within [AREA NAME]. If no data exists, skip this step silently — do not offer it.

If data exists, use ask_user_questions to ask: "Would you like to add sub-area profiles for areas within [AREA NAME]?" — ask this exact question only, do not add explanations

If SUB_AREA_METRIC_ID was not found in Step 2, skip this step — do not offer it.

If the user says yes and sub-area metrics are available:
- Insert the sub-area section before the back page (move back page to end)

SECTION HEADER SLIDE:
- Title: "Sub-area Service Utilization Profiles within [AREA NAME]"

SUB-AREA SUMMARY TABLE (if SUB_AREA_TABLE_METRIC_ID was found in Step 2):
- Title: Write an analytical headline summarizing the key sub-area finding
- Visualization: Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: SUB_AREA_TABLE_METRIC_ID (e.g., "m3-04-02")
  - vizPresetId: "disruption-differences-table-single-admin-area-2-multiple-admin-area-3"
  - selectedReplicant: AREA_VALUE
  - filterOverrides:
    - col: "indicator_common_id"
    - vals: [all indicator codes from the report]
    - ALSO filter on AREA_LEVEL column to scope to AREA_VALUE
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): 2-3 bullet points summarizing which sub-areas show consistent surpluses or shortfalls.
- Add a text block at the bottom: "Percentage difference between the observed and expected number of services. A negative value indicates an observed level lower than the expected level (disruption), while a positive value indicates a higher level (surplus)."

SUB-AREA SLIDES (one per sub-area):
For EACH sub-area within [AREA NAME], create a simple slide with:

- Title: Name of the sub-area
- Visualization: Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: SUB_AREA_METRIC_ID (determined in Step 2)
  - vizPresetId: SUB_AREA_PRESET_ID (determined in Step 2)
  - chartTitle: "Comparing reported service use to expected trends, [Sub-area Name]"
  - selectedReplicant: The sub-area name value
  - filterOverrides:
    - col: "indicator_common_id"
    - vals: [all indicator codes from the report]
    - ALSO filter on AREA_LEVEL column to scope to AREA_VALUE (e.g., col: "admin_area_2", vals: ["North Central"] if showing states within a zone)
  - periodFilterOverride: Use the same period as the main report

Keep these slides clean — sub-area name and visualization only, no interpretation text.

After the sub-area slides, re-add the back page as the final slide.

STEP 5 (OPTIONAL): DATA QUALITY ASSESSMENT
After the sub-area breakdown (or after the main report if sub-areas were skipped), use ask_user_questions to ask: "Would you like to add a data quality assessment for [AREA NAME]?" — ask this exact question only, do not add explanations or bullet lists of what the section includes

If the user says yes, generate a DQ section scoped to the specific area. Insert before the back page (move back page to end).

METHODOLOGY REFERENCE:
If you need additional context on how FASTR calculates data quality metrics, fetch the methodology documentation from https://fastr-analytics.github.io/fastr-resource-hub/. Use it to write accurate summaries and interpretations for each slide.

DATA QUALITY METRICS:
Use get_available_metrics to confirm available metrics and their preset visualizations. The data quality metrics used in this section are:
- m1-01-01: Proportion of outliers [percent] — preset: outlier-table — filters: indicator_common_id, admin_area_2
- m1-02-02: Proportion of completed records [percent] — preset: completeness-table — filters: indicator_common_id, admin_area_2. ALWAYS use completeness-table preset for this metric (do NOT use completeness-timeseries)
- m1-03-01: Proportion of sub-national areas meeting consistency criteria [percent] — preset: consistency-table — filters: ratio_type, admin_area_2
- m1-04-01: Proportion of facilities with adequate data quality [percent] — preset: dqa-score-table — filters: admin_area_2
- m1-04-02: Average data quality score across facilities [percent] — preset: mean-dqa-table — filters: admin_area_2

For each DQ slide, apply a filterOverride on the AREA_LEVEL column (determined in Step 2) to scope all data to AREA_VALUE. For example:
  - col: AREA_LEVEL (e.g., "admin_area_2" or "admin_area_3")
  - vals: [AREA_VALUE]
Use periodFilterOverride matching the main report period.

STEP 5a: GENERATE COMPLETENESS SUMMARY

DQ COVER SLIDE:
- Title: "Data Quality Assessment: [AREA NAME]"

DQ SLIDE 1 - Completeness trends
Title: Write an analytical headline about completeness trends in [AREA NAME] (e.g., "Completeness is >95% for most indicators in [AREA NAME], strengthening confidence in disruption findings")

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
- filterOverrides: col: AREA_LEVEL, vals: [AREA_VALUE] (to scope to [AREA NAME])
- periodFilterOverride: Use the same period as the main report

Interpretation (left side): Use bullet points:
- Summary of completeness trends over the analysis period for [AREA NAME]
- Which indicators have weaker completeness (name them)
- Whether completeness improved over time

Then add a text block with:

**Why Completeness Matters for the Disruptions Analysis**

Observed values: These are adjusted for outliers only, so they reflect the actual raw service volumes after removing implausible spikes.

Expected values: These are adjusted for both completeness and outliers. This means the model "fills in" where reporting gaps exist, building an expected trend line as if all facilities had reported consistently.

When completeness is high, observed and expected volumes are more comparable, and disruptions are more likely to reflect true service changes.

When completeness is low, expected values may be artificially higher than observed, creating apparent "disruptions" that actually reflect missing reports rather than real declines in service delivery.

STEP 5b: ASK THE USER
After generating the completeness summary, use ask_user_questions to ask: "Would you like me to add additional data quality slides covering outliers, internal consistency, and DQA score trends for [AREA NAME]?" — ask this exact question only, do not add explanations

If the user says yes, update the DQ cover slide title to "Data Quality Assessment: [AREA NAME]", then generate the following additional slides. All slides are filtered to [AREA NAME].

DQ SLIDE 2 - Outliers
- Title: Write an analytical headline about outlier patterns in [AREA NAME]
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-01-01"
    Metric: Proportion of outliers [percent]
    Values: outlier_flag (Binary variable indicating whether this is an outlier)
    Optional disaggregations: admin_area_2, admin_area_3, indicator_common_id, year, month, period_id
  - vizPresetId: "outlier-table" (Outlier proportion table - YYYYMM)
    Filters: indicator_common_id, admin_area_2
  - Display as a table: period_id (rows) × indicator_common_id (columns) showing outlier %
  - Color coding: Green = below 2% | Yellow = 2% to 5% | Red = above 5%
  - filterOverrides: col: AREA_LEVEL, vals: [AREA_VALUE] (to scope to [AREA NAME])
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): Use bullet points:
  - Describe the trend in outlier rates for [AREA NAME] — are they stable, improving, or worsening?
  - Name specific indicators with the highest outlier rates
  - Note whether outlier rates have improved or worsened over the analysis period
  - Explain the implication: high outlier rates mean more values are being adjusted, which can affect the reliability of trend analysis
- Add a text block below the interpretation: "Outliers are reports which are suspiciously high compared to the usual volume reported by the facility in other months. Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator. Outliers are defined as observations which are greater than 10 times the median absolute deviation (MAD) from the monthly median value for the indicator in each time period, OR a value for which the proportional contribution in volume for a facility, indicator, and time period is greater than 80%. Outliers are only identified for indicators where the volume is greater than or equal to the median, the volume is not missing, and the average volume is greater than 100."

DQ SLIDE 3 - Internal consistency
- Title: Write an analytical headline about consistency in [AREA NAME]
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-03-01"
    Metric: Proportion of sub-national areas meeting consistency criteria [percent]
    Values: sconsistency
    Auto-disaggregated by: ratio_type
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "consistency-table" (Internal consistency table - YYYYMM)
    Filters: ratio_type, admin_area_2
  - Display as a table: period_id (rows) × ratio_type (columns) showing % of areas meeting consistency criteria
  - Color coding: Green = 90% or above | Yellow = 70% to 89% | Red = below 70%
  - filterOverrides: col: AREA_LEVEL, vals: [AREA_VALUE] (to scope to [AREA NAME])
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): Use bullet points:
  - Explain what each ratio_type represents (e.g., Penta1/Penta3 compares first to third dose, ANC1/ANC4 compares first to fourth visit)
  - Identify which ratios consistently meet or fail criteria in [AREA NAME]
  - Note whether consistency is improving or worsening over the analysis period
- Add a text block below the interpretation: "Internal consistency assesses the plausibility of reported data based on related indicators. Consistency metrics are approximate — depending on timing and seasonality, indicator definitions, and the nature of service delivery and reporting, values may be expected to sit outside plausible ranges. Indicators which are similar are expected to have roughly the same volume over the year (within a 30% margin). The data in this analysis is adjusted for outliers."

DQ SLIDE 4 - Data quality trends (overall DQA score)
- Title: Write an analytical headline about DQA trends in [AREA NAME]
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-04-01"
    Metric: Proportion of facilities with adequate data quality [percent]
    Values: dqa_score (Binary variable indicating adequate data quality)
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "dqa-score-table" (Overall DQA score table - YYYYMM)
    Filters: admin_area_2
  - Display as a table: admin_area_2 (rows) × year (columns) showing % of facilities with adequate DQ
  - Color coding: Green = 70% or above | Yellow = 50% to 69% | Red = below 50%
  - filterOverrides: col: AREA_LEVEL, vals: [AREA_VALUE] (to scope to [AREA NAME])
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): Use bullet points:
  - Describe the DQA trend in [AREA NAME] — is data quality improving over time?
  - Identify whether DQ has notably improved or declined
  - Explain the implication: low DQA scores may mean less reliable disruption estimates
- Add a text block below the interpretation: "Adequate data quality is defined as: 1) No missing data or outliers for OPD, Penta1, and ANC1, where available 2) Consistent reporting between Penta1/Penta3 and ANC1/ANC4."

DQ SLIDE 5 - Data quality trends (mean DQA score)
- Title: Write an analytical headline about mean DQA trends in [AREA NAME]
- Visualization (right side): Create using from_metric with these parameters:
  - type: "from_metric"
  - metricId: "m1-04-02"
    Metric: Average data quality score across facilities [percent]
    Values: dqa_mean (Data quality score across facilities)
    Optional disaggregations: admin_area_2, admin_area_3, year, month, period_id
  - vizPresetId: "mean-dqa-table" (Mean DQA score table - YYYYMM)
    Filters: admin_area_2
  - Display as a table: admin_area_2 (rows) × year (columns) showing mean DQA score %
  - Color coding: Green = 70% or above | Yellow = 50% to 69% | Red = below 50%
  - filterOverrides: col: AREA_LEVEL, vals: [AREA_VALUE] (to scope to [AREA NAME])
  - periodFilterOverride: Use the same period as the main report
- Interpretation (left side): Use bullet points:
  - Describe the mean DQA trend in [AREA NAME] — is it improving, stable, or declining?
  - Conclude with an overall assessment of data quality trajectory and what it means for the disruption analysis
- Add a text block below the interpretation: "Items included in the DQA score include: No missing data for 1) OPD, 2) Penta1, and 3) ANC1, where available; No outliers for 4) OPD, 5) Penta1, and 6) ANC1, where available; Consistent reporting between 7) Penta1/Penta3, 8) ANC1/ANC4, 9) BCG/Delivery, where available."

After all DQ slides, re-add the back page as the final slide.
```

## Prompt 5a: Review data accuracy

```prompt
Review the current slide deck — check that every text block is accurate against the underlying data. We will review one slide at a time.

Always check if the user is in editing_slide_deck mode. If not, ask them to open the slide deck they want reviewed.

Always refer to slides by their number (not their ID).

FOR EACH SLIDE (one at a time):
For each slide that has a visualization (image block with from_metric):

1. Read all text blocks on the slide — title, interpretation text, any text block at the bottom
2. Look at the visualization's from_metric parameters (metricId, vizPresetId, filterOverrides, periodFilterOverride) and use get_metric_data to pull the underlying data
3. Apply these checks:

DATA ACCURACY
- Does every number in the text blocks match the underlying data?
- Are any statistics mentioned that cannot be verified from the data? Flag with [UNVERIFIED]
- Watch for hedged fabrication — "approximately," "around," or "estimated" may precede invented figures. Verify every number, even hedged ones
- Are round numbers used where precise figures should appear? (red flag for fabricated data)
- Are time periods correctly referenced?
- Does the text only reference what is visible in the data? No external claims

INDICATOR INTERPRETATION DIRECTION
- Service delivery indicators (ANC, deliveries, PNC, immunizations, OPD, family planning): increase = positive, decrease = concern
- Mortality indicators (maternal deaths, neonatal deaths, stillbirths): increase = BAD, decrease = GOOD
- Negative quality indicators (dropout rates, outlier rates): increase = worsening

TABLES AND DQ SLIDES
- For DQ annex slides: pull the data with get_metric_data and check that text blocks match the actual values
- Are methodology text blocks preserved accurately — not paraphrased or watered down?

4. Present your findings for this slide — list any issues found and suggest fixes
5. ALWAYS use the ask_user_questions tool (not a text question) to let the user proceed. Never ask "Ready to proceed?" as plain text — always call ask_user_questions with selectable options:
   - If issues found: "Slide [N]: [number] issues found. How would you like to proceed?" → options: "Fix and continue to next slide", "Skip to next slide", "Stop review here"
   - If no issues: "Slide [N]: No issues found." → options: "Next slide", "Stop review here"

After the last slide, confirm: "All slides reviewed."
```

## Prompt 5b: Review language and consistency

```prompt
Review the current slide deck — check language, terminology, consistency, and word count. We will review one slide at a time.

Always check if the user is in editing_slide_deck mode. If not, ask them to open the slide deck they want reviewed.

Always refer to slides by their number (not their ID).

FOR EACH SLIDE (one at a time):
Read all text blocks on the slide and check:

LANGUAGE AND FRAMING
- No causal claims — only exploratory, descriptive language (e.g., "suggests" not "caused by")
- No overgeneralization — findings are scoped to the specific area and time period
- Appropriate hedging — conclusions are not stronger than what the data supports
- No indicator codes in text blocks — only human-readable labels (e.g., "ANC first visit" not "anc1")

TECHNICAL TERMINOLOGY
- Are health terms used correctly? (e.g., "skilled birth attendance" not "assisted delivery")
- Are acronyms expanded correctly on first use and used consistently after?
- Is the country name spelled correctly?
- Do admin area names match exactly what appears in the platform?

CONSISTENCY WITH PREVIOUS SLIDES
- Same indicator on multiple slides: are the values consistent?
- Are indicator names spelled the same way as earlier slides?
- Are time periods referenced consistently?
- Do slide titles follow the same style as previous slides?

WORD COUNT
- Is each text block within the target range (50-100 words, max 180)?

Present your findings for this slide — list any issues and suggest fixes.
ALWAYS use the ask_user_questions tool (not a text question) to let the user proceed. Never ask "Ready to proceed?" as plain text — always call ask_user_questions with selectable options:
- If issues found: "Slide [N]: [number] issues found. How would you like to proceed?" → options: "Fix and continue to next slide", "Skip to next slide", "Stop review here"
- If no issues: "Slide [N]: No issues found." → options: "Next slide", "Stop review here"

After the last slide, confirm: "All slides reviewed."
```
