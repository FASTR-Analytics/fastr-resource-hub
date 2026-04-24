# General slide preferences

When creating slides that combine text and a visualization, always use a two-column layout: text on the left, visualization on the right. After adding both blocks to a slide, use `modify_slide_layout` to arrange them side by side with a 6-6 column split (text block span 6 on left, visualization block span 6 on right). Do not leave them stacked vertically.

# Writing style

Write in complete, readable sentences. Do not start sentences with a label followed by a colon (e.g., do not write "Binary: a facility-month scores 100% only if..."). Instead, integrate the information into a flowing sentence (e.g., "A facility-month scores 100% only if all key indicators are complete, without outliers, and consistent").

---

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
3. "When was this analysis completed?" — suggest the current month and year (e.g., "April 2026") but let the user confirm or change it. Use their answer as the report generation date.

When user provides the analysis time period, convert to period_id format:
- Start date becomes min value: [YEAR][MONTH] as 6-digit number (e.g., January 2025 = 202501)
- End date becomes max value: [YEAR][MONTH] as 6-digit number (e.g., December 2025 = 202512)
- Store these values to use in periodFilterOverride for all indicator slides

STEP 2: DISCOVER AVAILABLE INDICATORS
Before generating the report, check what indicators are available in the platform for this country.

Each country instance has different indicator IDs (indicator_common_id) and labels. Do NOT assume a fixed list of codes — read them from the platform.

1. Review all indicator IDs and their labels available in the platform for this country
2. For each indicator, call get_metric_data with the analysis period to verify it contains data. Keep only indicators with actual data for the analysis period
3. Present the filtered list to the user (ID + label)
4. Propose groupings based on the indicator labels. Use these as a starting guide, but adapt to what actually exists:
   - Antenatal Care: indicators related to ANC visits (e.g., anc1, anc4, anc_trimester1)
   - Deliveries and Postnatal Care: facility deliveries, skilled birth attendance, PNC, C-sections (e.g., delivery, sba, pnc1, csection)
   - Immunization: vaccines (e.g., bcg, penta1, penta3, measles1, opv1, fully_immunized)
   - Family Planning: FP counseling, new users, continuing users (e.g., fp_new, fp_new_and_cont, fp_counseled)
   - Adolescent Family Planning: if adolescent-specific FP indicators exist, group separately (e.g., fp_adolescent_counseled, fp_adolescent_new)
   - Malaria: testing, positivity, treatment (e.g., malaria_rdt_positive, malaria_treated_less_24hrs, mal_positive)
   - General Services / OPD: outpatient visits (e.g., opd, opd_under5, opd_over5)
   - Other groups as needed based on what exists (e.g., Nutrition, HIV/TB, NCDs, Mortality)
5. Use ask_user_questions to present the proposed groupings for review. List each group with its indicators (ID + label). Ask: "Here are the proposed indicator groupings. Would you like to change anything — move indicators between groups, create new groups, or exclude any?"
6. After the main groupings are confirmed, check for mortality indicators (e.g., maternal_deaths, neonatal_deaths, stillbirths). Always use ask_user_questions to ask: "The platform has these mortality indicators: [list]. Mortality data involves low event counts and different interpretation (increases = bad). Would you like to include them in the report or exclude them?"
7. If any confirmed group contains more than 3 indicators, use ask_user_questions to suggest splitting it into logical subgroups. Each subgroup will have its own set of slides.

Each confirmed group/subgroup will become a set of slides in the national analysis section (monthly trends, quarterly change, and disruption analysis). Use the exact indicator_common_id values from the platform for all technical parameters (filterOverrides, selectedReplicant).

ACCURACY REQUIREMENTS:
1. Base all analysis only on data visible in the platform - do not draw on external knowledge
2. Do not invent statistics, percentages, or specific numbers - if data is not visible, say so
3. If you cannot verify a claim from the data, mark it with [VERIFY]
4. Do not guess at dates, time periods, or magnitudes
5. NEVER guess what acronyms stand for or make up methodology descriptions. Before writing any acronym expansion, technical term definition, or methodology explanation, use get_methodology_docs_list and get_methodology_doc_content to verify against the official documentation. If you cannot verify it, do not include it

REPORT STANDARDS:
1. Maintain cautious, analytical language - no causal claims
2. Treat disruption signals as descriptive and exploratory
3. Keep slide text concise — target 50-100 words per slide (max 180 words), use bullet points where appropriate
4. Content slide layout: text interpretation (span 4) on left, visualization (span 8) on right. After adding both blocks, use modify_slide_layout to arrange them side by side in a 4-8 column split. Do not leave blocks stacked vertically
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
- Insert the text as-is without reducing it. In one text block with bullet points:

Data Quality Assessment
Identifies the main data quality issues by evaluating indicator completeness, detecting extreme outliers, and verifying consistency between related indicators — using monthly HMIS (DHIS2) data at facility level.

Applies targeted adjustments to flagged data points, replacing outliers and imputing missing data using a 12-month centered moving average; facility-level means are used by default when there is insufficient historical data.

Service Utilization Assessment
Analysis of service utilization trends, which identifies the percentage change in service utilization for each quarter compared to the previous quarter.

Analysis of disruptions and surpluses in service utilization, which detects significant changes (positive or negative) in service use beyond what would be expected given seasonality and historical trends.

How to interpret disruption figures: Red shaded areas = potential disruptions (below expected). Green shaded areas = potential surpluses (above expected). These are signals, not conclusions — they require further investigation.

More details on the methodology and data quality adjustment approaches are available in the annex. The complete R code and source documentation are also publicly available on GitHub (https://github.com/FASTR-Analytics)

- Note: Data quality affects interpretation. When completeness is low, expected values may be artificially higher than observed, creating apparent "disruptions" that actually reflect missing reports rather than real declines in service delivery.

SLIDE 4 - Indicator selection slide
- Title: "Methodology: Indicator selection"
- Subtitle: "Indicators for the service utilization analysis were selected considering nationally prioritized indicators."
- List all available indicators grouped by the confirmed categories from Step 2

SLIDE 5 - Section header slide
- Title: "Section 1: Service Utilization"
- Subtitle: "Assessment of projected volumes based on historical trends to identify surpluses and disruptions in health services"

SLIDES 6+ - National analysis slides (three slides per indicator GROUP)
For each confirmed indicator group from Step 2, create three consecutive slides:
- Slide Type A: Monthly service utilization trends
- Slide Type B: Quarterly service volume with quarter-to-quarter % change
- Slide Type C: Disruption analysis

Before creating slides for each group, call get_metric_data to verify data is available.

SLIDE TYPE A: Monthly Service Utilization Trends

Title: "Trends in [group description]" — use a descriptive phrase for the service area, NOT a list of indicator codes
- Good: "Trends in antenatal care"
- Bad: "Trends in anc1, anc4"

Interpretation (left side, span 4 — 60-100 words, max 130): Use bullet points:
- One bullet per indicator describing monthly fluctuations
- Cross-indicator insight: patterns, gaps
- Implications: one sentence actionable insight

Visualization (right side, span 8): Create using from_metric with:
- metricId: "m3-01-01"
- vizPresetId: "volume-monthly"
- valuesFilter: "count_final_both"
- filterOverrides: all indicator codes in the group
- Use startDate/endDate covering last 12 complete quarters (36 months)

SLIDE TYPE B: Quarterly Change in Service Volume

Title: One analytical sentence summarizing the key quarterly finding. Past tense, 1-2 sentences max.
- Good: "Antenatal services showed gradual growth, with fourth visits increasing more notably than first visits in 2025"
- Bad: "Quarter-to-quarter change in antenatal services"

Interpretation (left side, span 4 — 50-80 words, max 100):
- One standalone paragraph: overall trend summary
- Per indicator: specific quarter-to-quarter changes with percentages
- Only mention quarters with >10% change. If no >10% changes: "[INDICATOR] remained consistent since [DATE]..."

Visualization (right side, span 8): Create using from_metric with:
- metricId: "m3-01-01"
- vizPresetId: "volume-quarterly"
- valuesFilter: "count_final_both"
- filterOverrides: all indicator codes in the group
- Show data labels, indicator in columns not lines

SLIDE TYPE C: Disruption Analysis

Title: Write an analytical headline (1-2 sentences) that summarizes the key finding for this group of indicators. The headline should describe what the data shows, not just name the indicators.
- Good example: "Despite widespread shortfalls in 2024, immunization services show signs of recovery by mid-2025, with some disruption in BCG"
- Good example: "Deliveries show surplus in 2025, while PNC recovered after earlier disruptions"
- Bad example: "BCG - Bacillus Calmette-Guérin vaccine"
- Bad example: "Immunization indicators"

Visualization (right side, span 8): Create using from_metric with these parameters:
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

Interpretation (left side, span 4 — target 50-100 words, max 180): Analyze the data shown in the visualization. Use bullet points covering:
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

AFTER COMPLETING THE REPORT:
Let the user know: "Report complete. If you'd like to add more sections, you can run these prompts from the library: Prompt 2 (Regional disruptions analysis) or Prompt 3 (Data quality assessment annex)."
```

## Prompt 2: Regional Disruptions Analysis

```prompt
Generate Annex 1: Regional Disruptions Analysis for all subnational areas. Insert this annex before the back page (FASTR initiative slide). The back page must remain as the very last slide of the complete report — remove it from its current position and re-add it after the annex.

ACCURACY REQUIREMENTS:
1. Base all analysis only on data visible in the platform
2. Do not invent statistics or specific numbers - if data is not visible, say so
3. If you cannot verify a claim from the data, mark it with [VERIFY]
4. NEVER guess what acronyms stand for or make up methodology descriptions. Before writing any acronym expansion, technical term definition, or methodology explanation, use get_methodology_docs_list and get_methodology_doc_content to verify against the official documentation. If you cannot verify it, do not include it

REPORT STANDARDS:
1. Maintain cautious, analytical language - no causal claims
2. Treat disruption signals as descriptive and exploratory
3. Layout: after adding text and visualization blocks to a slide, use modify_slide_layout to arrange them side by side in a 6-6 column split — text block (span 6) on the left, visualization block (span 6) on the right. Do not leave blocks stacked vertically
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
4. NEVER guess what acronyms stand for or make up methodology descriptions. Before writing any acronym expansion, technical term definition, or methodology explanation, use get_methodology_docs_list and get_methodology_doc_content to verify against the official documentation. If you cannot verify it, do not include it

REPORT STANDARDS:
1. Maintain cautious, analytical language
2. Layout: after adding text and visualization blocks to a slide, use modify_slide_layout to arrange them side by side in a 6-6 column split — text block (span 6) on the left, visualization block (span 6) on the right. Do not leave blocks stacked vertically
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
4. "When was this analysis completed?" — suggest the current month and year (e.g., "April 2026") but let the user confirm or change it. Use their answer as the report generation date.

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
2. For each indicator, call get_metric_data with the analysis period to verify it contains data. Keep only indicators with actual data for the analysis period
3. Present the filtered list to the user (ID + label)
4. Propose groupings based on the indicator labels. Use these as a starting guide, but adapt to what actually exists:
   - Antenatal Care: indicators related to ANC visits (e.g., anc1, anc4, anc_trimester1)
   - Deliveries and Postnatal Care: facility deliveries, skilled birth attendance, PNC, C-sections (e.g., delivery, sba, pnc1, csection)
   - Immunization: vaccines (e.g., bcg, penta1, penta3, measles1, opv1, fully_immunized)
   - Family Planning: FP counseling, new users, continuing users (e.g., fp_new, fp_new_and_cont, fp_counseled)
   - Adolescent Family Planning: if adolescent-specific FP indicators exist, group separately (e.g., fp_adolescent_counseled, fp_adolescent_new)
   - Malaria: testing, positivity, treatment (e.g., malaria_rdt_positive, malaria_treated_less_24hrs, mal_positive)
   - General Services / OPD: outpatient visits (e.g., opd, opd_under5, opd_over5)
   - Other groups as needed based on what exists (e.g., Nutrition, HIV/TB, NCDs, Mortality)
5. Use ask_user_questions to present the proposed groupings for review. List each group with its indicators (ID + label). Ask: "Here are the proposed indicator groupings. Would you like to change anything — move indicators between groups, create new groups, or exclude any?"
6. After the main groupings are confirmed, check for mortality indicators (e.g., maternal_deaths, neonatal_deaths, stillbirths). Always use ask_user_questions to ask: "The platform has these mortality indicators: [list]. Mortality data involves low event counts and different interpretation (increases = bad). Would you like to include them in the report or exclude them?"
7. If any confirmed group contains more than 3 indicators, use ask_user_questions to suggest splitting it into logical subgroups. Each subgroup will have its own set of slides.

Each confirmed group/subgroup will become a set of slides in the analysis section (monthly trends, quarterly change, and disruption analysis). Use the exact indicator_common_id values from the platform for all technical parameters (filterOverrides, selectedReplicant).

ACCURACY REQUIREMENTS:
1. Base all analysis only on data visible in the platform - do not draw on external knowledge
2. Do not invent statistics, percentages, or specific numbers - if data is not visible, say so
3. If you cannot verify a claim from the data, mark it with [VERIFY]
4. Do not guess at dates, time periods, or magnitudes
5. NEVER guess what acronyms stand for or make up methodology descriptions. Before writing any acronym expansion, technical term definition, or methodology explanation, use get_methodology_docs_list and get_methodology_doc_content to verify against the official documentation. If you cannot verify it, do not include it

REPORT STANDARDS:
1. Maintain cautious, analytical language - no causal claims
2. Treat disruption signals as descriptive and exploratory
3. Keep slide text concise — target 50-100 words per slide (max 180 words), use bullet points where appropriate
4. Content slide layout: text interpretation (span 4) on left, visualization (span 8) on right. After adding both blocks, use modify_slide_layout to arrange them side by side in a 4-8 column split. Do not leave blocks stacked vertically
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
- Insert the text as-is without reducing it. In one text block with bullet points:

Data Quality Assessment
Identifies the main data quality issues by evaluating indicator completeness, detecting extreme outliers, and verifying consistency between related indicators — using monthly HMIS (DHIS2) data at facility level.

Applies targeted adjustments to flagged data points, replacing outliers and imputing missing data using a 12-month centered moving average; facility-level means are used by default when there is insufficient historical data.

Service Utilization Assessment
Analysis of service utilization trends, which identifies the percentage change in service utilization for each quarter compared to the previous quarter.

Analysis of disruptions and surpluses in service utilization, which detects significant changes (positive or negative) in service use beyond what would be expected given seasonality and historical trends. Results are shown for [AREA NAME].

How to interpret disruption figures: Red shaded areas = potential disruptions (below expected). Green shaded areas = potential surpluses (above expected). These are signals, not conclusions — they require further investigation.

More details on the methodology and data quality adjustment approaches are available in the annex. The complete R code and source documentation are also publicly available on GitHub (https://github.com/FASTR-Analytics)

- Note: Data quality affects interpretation. When completeness is low, expected values may be artificially higher than observed, creating apparent "disruptions" that actually reflect missing reports rather than real declines in service delivery.

SLIDE 4 - Indicator selection slide
- Title: "Methodology: Indicator selection"
- Subtitle: "Indicators for the service utilization analysis were selected considering nationally prioritized indicators."
- List all available indicators grouped by the confirmed categories from Step 3

SLIDE 5 - Section header slide
- Title: "Service Utilization in [AREA NAME]"
- Subtitle: "Assessment of projected volumes based on historical trends to identify surpluses and disruptions in health services"

SLIDES 6+ - Area-level analysis slides (three slides per indicator GROUP)
For each confirmed indicator group from Step 3, create three consecutive slides:
- Slide Type A: Monthly service utilization trends
- Slide Type B: Quarterly service volume with quarter-to-quarter % change
- Slide Type C: Disruption analysis

Before creating slides for each group, call get_metric_data to verify data is available.

SLIDE TYPE A: Monthly Service Utilization Trends

Title: "Trends in [group description]" — use a descriptive phrase for the service area, NOT a list of indicator codes
- Good: "Trends in antenatal care"
- Bad: "Trends in anc1, anc4"

Interpretation (left side, span 4 — 60-100 words, max 130): Use bullet points:
- One bullet per indicator describing monthly fluctuations
- Cross-indicator insight: patterns, gaps
- Implications: one sentence actionable insight

Visualization (right side, span 8): Create using from_metric with:
- metricId: "m3-01-01"
- vizPresetId: "volume-monthly"
- valuesFilter: "count_final_both"
- filterOverrides: all indicator codes in the group
- Use startDate/endDate covering last 12 complete quarters (36 months)

SLIDE TYPE B: Quarterly Change in Service Volume

Title: One analytical sentence summarizing the key quarterly finding. Past tense, 1-2 sentences max.
- Good: "Antenatal services showed gradual growth, with fourth visits increasing more notably than first visits in 2025"
- Bad: "Quarter-to-quarter change in antenatal services"

Interpretation (left side, span 4 — 50-80 words, max 100):
- One standalone paragraph: overall trend summary
- Per indicator: specific quarter-to-quarter changes with percentages
- Only mention quarters with >10% change. If no >10% changes: "[INDICATOR] remained consistent since [DATE]..."

Visualization (right side, span 8): Create using from_metric with:
- metricId: "m3-01-01"
- vizPresetId: "volume-quarterly"
- valuesFilter: "count_final_both"
- filterOverrides: all indicator codes in the group
- Show data labels, indicator in columns not lines

SLIDE TYPE C: Disruption Analysis

Title: Write an analytical headline (1-2 sentences) that summarizes the key finding for this group of indicators. The headline should describe what the data shows, not just name the indicators.
- Good example: "Despite widespread shortfalls in 2024, immunization services show signs of recovery by mid-2025, with some disruption in BCG"
- Good example: "Deliveries show surplus in 2025, while PNC recovered after earlier disruptions"
- Bad example: "BCG - Bacillus Calmette-Guérin vaccine"
- Bad example: "Immunization indicators"

Visualization (right side, span 8): Create using from_metric with these parameters:
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

Interpretation (left side, span 4 — target 50-100 words, max 180): Analyze the data shown in the visualization. Use bullet points covering:
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

## Prompt 5: Review slide deck

```prompt
Review the current slide deck — check data accuracy, language, terminology, consistency, and word count in a single pass.

CRITICAL: Do not guess or hallucinate. Every claim about what is correct or incorrect must be verified. If you are unsure, say so — do not assume.

Always check if the user is in editing_slide_deck mode. If not, ask them to open the slide deck they want reviewed.
Always refer to slides by their number (not their ID).

SETUP (do this once before reviewing any slides):
1. Call get_available_metrics ONCE — cache all indicator IDs and their labels for the entire review
2. Call get_methodology_docs_list ONCE — cache available methodology documents
3. Get the full list of slides in the deck

REVIEW ALL SLIDES:
Go through every slide. For each slide, apply ALL checks below. Do NOT use ask_user_questions between slides — move through the deck continuously.

For slides WITHOUT a visualization (cover, section headers, methodology text-only): apply only the language, terminology, and consistency checks.
For slides WITH a visualization (from_metric): apply all checks including data accuracy.

CHECK 1: DATA ACCURACY (visualization slides only)
- Use get_metric_data to pull the underlying data for this slide's visualization
- Does every number in the text match the underlying data?
- Are any statistics unverifiable? Flag with [UNVERIFIED]
- Watch for hedged fabrication — "approximately" or "around" may precede invented figures
- Are time periods correctly referenced?
- Does the text only reference what is visible in the data?

CHECK 2: INDICATOR NAMES AND INTERPRETATION
- Do indicator names match the exact labels cached from get_available_metrics? Do not accept paraphrased or shortened names
- No indicator_common_id codes in text — only human-readable labels
- Service delivery indicators (ANC, deliveries, PNC, immunizations, OPD, FP): increase = positive, decrease = concern
- Mortality indicators (maternal deaths, neonatal deaths, stillbirths): increase = BAD, decrease = GOOD
- Negative quality indicators (dropout rates, outlier rates): increase = worsening

CHECK 3: ACRONYMS AND METHODOLOGY
- If any acronym is expanded in the text, verify against the cached methodology docs. If needed, call get_methodology_doc_content for the specific doc. A wrong expansion is a critical error
- Are methodology descriptions accurate and not paraphrased or watered down?

CHECK 4: LANGUAGE AND FRAMING
- No causal claims — only exploratory, descriptive language
- No overgeneralization — findings scoped to the specific area and time period
- Appropriate hedging — conclusions not stronger than data supports
- Health terms used correctly (e.g., "skilled birth attendance" not "assisted delivery")
- Country and admin area names spelled correctly and matching the platform

CHECK 5: CONSISTENCY ACROSS SLIDES
- Same indicator on multiple slides: are the values consistent?
- Indicator names spelled the same way throughout?
- Time periods referenced consistently?
- Slide titles follow the same style?

CHECK 6: WORD COUNT
- Is each text block within the target range (50-100 words, max 180)?

REPORTING:
- For clean slides: log internally and move on — do NOT stop or ask the user
- For slides with issues: note the slide number, issues found, and suggested fixes — then continue to the next slide

AFTER REVIEWING ALL SLIDES:
Present a single summary report:

1. "Review complete: [X] slides reviewed, [Y] issues found across [Z] slides."
2. List each slide with issues:
   - "Slide [N]: [issue description] → Suggested fix: [fix]"
3. If no issues found across the entire deck: "All slides passed review. No issues found."
4. Use ask_user_questions ONCE with options:
   - If issues found: "How would you like to proceed?" → "Fix all issues automatically", "Review issues one by one", "Done — no fixes needed"
   - If no issues: "All clear." → "Done"
```

## Prompt 6: Universal Quarterly Report

```prompt
Universal Instructions for FASTR Quarterly Report Generation

CONTEXT: These instructions apply to all countries and all languages. The report must be generated in the appropriate language based on the country context (French for French-speaking countries, English for English-speaking countries).

STEP 1: INITIAL CHECKS AND BASIC INFORMATION

1.1 Verify editing mode
- Confirm that the user is in editing_slide_deck mode
- If not, ask the user to create a new deck or open an existing one

1.2 Collect basic information
Use ask_user_questions to ask one question at a time, in this order:

Question 1: Analysis period
- Ask: "What analysis period should I use? (start month/year to end month/year, e.g.: January 2023 to September 2025)"
- Convert the response to period_id format:
  - Start date → min value: [YEAR][MONTH] as a 6-digit number (e.g.: January 2025 = 202501)
  - End date → max value: [YEAR][MONTH] as a 6-digit number (e.g.: December 2025 = 202512)
- Store these values for later use in all period filters

Question 2: Cover subtitle
- Suggest options based on the analysis period, for example:
  - The relevant quarter (e.g.: "Q4 2025")
  - The included months (e.g.: "October–December 2025")
  - Allow the user to enter their own text

1.3 Generate the cover slide

Title:
- French: "Analyse de l'utilisation des services au/à/aux [COUNTRY]"
- English: "[COUNTRY] - Service Utilization Analysis"
- Adapt the article according to the country (au Sénégal, à Madagascar, aux Philippines, etc.)

Subtitle:
- Use the user's answer to Question 2

Date:
- Ask the user: "When was this analysis completed?" — suggest the current month and year (e.g., "April 2026") but let the user confirm or change it
- French format: "Analyse générée en [MONTH_YEAR]"
- English format: "Analysis generated in [MONTH_YEAR]"

STEP 2: INDICATOR DISCOVERY AND ORGANIZATION

2.1 Query the platform
- Call get_available_metrics to retrieve all available indicators
- For each indicator, call get_metric_data with the analysis period to verify it contains data
- Keep only indicators with actual data for the analysis period

2.2 Identify available indicators
- Read the indicator_common_id values and their labels from the platform
- NEVER assume a fixed list of indicators — each country has its own codes and labels
- Create a complete list: ID + label for each indicator with data

2.3 Propose groupings
Propose groupings based on indicator labels. Use these categories as a starting guide, but adapt based on what actually exists:

Common service groups:
- Antenatal care: indicators related to ANC visits (e.g.: anc1, anc4, anc_trimester1, syphilis_tested_anc)
- Deliveries and postnatal care: facility deliveries, skilled birth attendance, PNC, caesarean sections (e.g.: delivery, sba, pnc1_mother, pnc1_newborn, csection)
- Immunization: vaccines (e.g.: bcg, penta1, penta3, measles1, measles2, opv1, rr1, fully_immunized)
- Family planning: FP counseling, new users, continuing users (e.g.: fp_new, fp_new_and_cont, fp_counseled, new_fp)
- Adolescent family planning: if adolescent-specific FP indicators exist, group them separately (e.g.: fp_adolescent_counseled, fp_adolescent_new)
- Malaria: testing, positivity, treatment (e.g.: malaria_tested, malaria_confirmed, malaria_treated, mal_positive)
- General services / Outpatient visits: outpatient visits (e.g.: opd, opd_under5, opd_over5)
- HIV/TB: HIV testing, ARV treatment, TB cases (e.g.: hiv_tested, hiv_treated, tb_confirmed, tb_treated)
- Nutrition: vitamin A supplementation, iron/folic acid, etc. (e.g.: vitamin_a, ifa)
- Other groups depending on what exists (Non-communicable diseases, Child health, etc.)

2.4 Validate with user

First validation: Indicator groupings
Use ask_user_questions to present the proposed groupings:
- List each group with its indicators (ID + label)
- Ask: "Here are the proposed indicator groupings. Would you like to change anything — move indicators between groups, create new groups, or exclude any?"

Second validation: Mortality indicators
After confirming the main groupings:
- Check whether mortality indicators exist (e.g.: maternal_deaths, neonatal_deaths, stillbirths, child_deaths)
- Always use ask_user_questions to ask:
  - English: "The platform has these mortality indicators: [list]. Mortality data involves low event counts and different interpretation (increases = bad). Would you like to include them in the report or exclude them?"

Managing groups with many indicators:
- If a confirmed group contains more than 3 indicators, use ask_user_questions to ask how to divide it
- Suggest logical subgroups
- Each subgroup will have its own slide

2.5 Finalize the structure
- Each confirmed group/subgroup will become a section with multiple slides in the national analysis
- Use the exact indicator_common_id values from the platform for all technical parameters (filterOverrides, selectedReplicant)

ACCURACY REQUIREMENTS (CRITICAL)

Golden Rule: Verify Before Asserting
- ✅ Base all analysis solely on data visible in the platform
- ✅ NEVER invent statistics, percentages, or specific figures
- ✅ If data is not visible, say so explicitly
- ✅ If a claim cannot be verified, mark it with [VERIFY]
- ✅ Never guess dates, periods, or magnitudes

Terminology and methodology verification
BEFORE writing any acronym expansion, technical term definition, or methodology explanation:
- Call get_methodology_docs_list to see available documentation
- Call get_methodology_doc_content to verify official content
- If it cannot be verified → do not include it
- NEVER guess what acronyms stand for or invent methodology descriptions

REPORT STANDARDS

Style and language
- ✅ Maintain cautious, analytical language — no causal claims
- ✅ Treat disruption signals as descriptive and exploratory
- ✅ Use consistent terminology throughout the report (do not alternate between synonyms)

Text length
- Target: 50–100 words per slide (adjust downward if multiple charts)
- Absolute maximum: 180 words per slide (unless the user provides text; in that case, do not shorten it)
- Use bullet points, not long paragraphs
- Slides with charts/visualizations = less text

Content slide layout
- Left: Text interpretation
- Right: Visualization/chart

Indicator references in text
CRITICAL RULE: In all slide text (titles, interpretations, headings), use ONLY the readable label of indicators.
✅ CORRECT:
- "First antenatal visit"
- "Skilled birth attendance"
- "Penta 3 vaccine"
❌ INCORRECT:
- "anc1"
- "anc1 (First antenatal visit)"
- "First antenatal visit (anc1)"
indicator_common_id codes are used ONLY in technical parameters (filterOverrides, selectedReplicant, etc.) — never in user-visible text.

Slide references
- Always refer to slides by their number (e.g.: "slide 3", "slide 5")
- Never by their technical ID (e.g.: "a3k", "x7m")

CRITICAL INDICATOR INTERPRETATION RULES

⚠️ CAUTION: Not all increases are good. Not all decreases are bad.

Apply the correct interpretation according to the indicator type:

Type 1: Service delivery indicators (↑ = positive, ↓ = concerning)
Examples:
- ANC visits, deliveries, PNC visits, vaccinations, outpatient visits, family planning, skilled birth attendance
Interpretation:
- "Surplus" (above expected) = positive signal
- "Disruption" (below expected) = concern

Type 2: Mortality and adverse outcome indicators (↑ = BAD, ↓ = positive)
Examples:
- Maternal deaths, neonatal deaths, stillbirths, child deaths, any indicator measuring deaths or adverse events
Interpretation:
- An INCREASE is a NEGATIVE finding — more deaths is ALWAYS bad
- A DECREASE is a POSITIVE finding — fewer deaths is ALWAYS good
- NEVER describe an increase in deaths as an "improvement" or "positive trend"
- NEVER describe a decrease in deaths as a "concern" or "disruption"

Type 3: Negative quality indicators (↑ = bad, ↓ = good)
Examples:
- Dropout rates (e.g.: Penta1 to Penta3 dropout), outlier rates, stockout rates, low birth weight, diarrhea cases
Interpretation:
- An increase means the situation is worsening
- A decrease means the situation is improving

Verification process before writing
Before writing any title or interpretation, ask:
- Does this indicator measure something we want MORE of (services)?
- Or something we want LESS of (deaths, dropouts, disease)?
- Frame the language accordingly

PRE-FINALIZATION VERIFICATION

Before finalizing each slide, cross-check:
- ✅ All numerical values match what the visualization shows
- ✅ Time periods and indicator names are correctly referenced
- ✅ Described trends (increases, decreases) match the actual direction of the data
- ✅ Figures are consistent across slides (same indicator = same values)
- ✅ Interpretation framing matches the indicator type — an increase in deaths is NEVER described as positive

OVERALL WORKFLOW
- Verify mode → editing_slide_deck
- Collect basic info → Questions 1–2 (one at a time)
- Generate cover → STOP and wait for confirmation
- Discover indicators → get_available_metrics + get_metric_data
- Propose groupings → Present to user
- Validate with user → Groupings, then mortality
- Proceed to methodology slide

This universal base applies to all reports, all countries, all languages. Specific report structure instructions will follow.

NEXT SLIDE — Methodology

Insert the text as-is without reducing it. In one text block with bullet points:

Data Quality Assessment
Identifies the main data quality issues by evaluating indicator completeness, detecting extreme outliers, and verifying consistency between related indicators — using monthly HMIS (DHIS2) data at facility level.

Applies targeted adjustments to flagged data points, replacing outliers and imputing missing data using a 12-month centered moving average; facility-level means are used by default when there is insufficient historical data.

Enables sensitivity analysis by producing results under four scenarios (no adjustment, outliers only, completeness only, and combined). In this analysis, adjustments cover both outliers and completeness.

Service Utilization Assessment
Analysis of service utilization trends, which identifies the percentage change in service utilization for each quarter compared to the previous quarter.

Analysis of disruptions and surpluses in service utilization, which detects significant changes (positive or negative) in service use beyond what would be expected given seasonality and historical trends.

Service Coverage Estimation
The coverage estimation analysis uses routine data to estimate service coverage trends at national and subnational levels. This is done by integrating adjusted health service volumes, demographic projections, and survey data (MICS/DHS).

Coverage estimates are calculated for key health indicators using multiple denominator sources, and the optimal denominator is retained by minimizing error against the most recent survey data.

More details on the methodology and data quality adjustment approaches are available in the annex. The complete R code and source documentation are also publicly available on GitHub (https://github.com/FASTR-Analytics)

SLIDE 4 — Indicator Selection Slide
- Title: "Methodology: Indicator selection"
- Subtitle: "Indicators for the service utilization analysis were selected considering nationally prioritized indicators."
- List all available indicators grouped by the confirmed categories from Step 2. USE THIS FORMAT:
**GROUP 1** Indicator1, Indicator2. Example:
Deliveries and postnatal care: Skilled birth attendance, PNC1 mother, PNC1 newborn

INSTRUCTIONS TO GENERATE Section 1: Data Quality Assessment

Accuracy Requirements
- Base all analysis only on data visible in the platform
- Do not invent statistics or specific numbers — if data is not visible, say so
- If you cannot verify a claim from the data, mark it with [VERIFY]
- NEVER guess what acronyms stand for or make up methodology descriptions. Before writing any acronym expansion, technical term definition, or methodology explanation, use get_methodology_docs_list and get_methodology_doc_content to verify against the official documentation. If you cannot verify it, do not include it

Report Standards
- Maintain cautious, analytical language
- Layout: after adding text and visualization blocks to a slide, use modify_slide_layout to arrange them side by side in a 6-6 column split — text block (span 6) on the left, visualization block (span 6) on the right. Do not leave blocks stacked vertically
- Use consistent terminology throughout
- Always refer to slides by their number (not their ID)

Methodology Reference
If you need additional context on how FASTR calculates data quality metrics, fetch the methodology documentation from https://fastr-analytics.github.io/fastr-resource-hub/. Use it to write accurate summaries and interpretations for each slide.

Data Quality Metrics
Use get_available_metrics to confirm available metrics and their preset visualizations. The data quality metrics used in this annex are:
- m1-01-01: Proportion of outliers [percent] — preset: outlier-table — filters: indicator_common_id, admin_area_2
- m1-02-02: Proportion of completed records [percent] — preset: completeness-table — filters: indicator_common_id, admin_area_2. ALWAYS use completeness-table preset for this metric (do NOT use completeness-timeseries)
- m1-03-01: Proportion of sub-national areas meeting consistency criteria [percent] — preset: consistency-table — filters: ratio_type, admin_area_2
- m1-04-01: Proportion of facilities with adequate data quality [percent] — preset: dqa-score-table — filters: admin_area_2
- m1-04-02: Average data quality score across facilities [percent] — preset: mean-dqa-table — filters: admin_area_2

For each slide, create the visualization using from_metric with the metricId and vizPresetId specified. Use periodFilterOverride matching the main report period.

Verification: Before finalizing each slide, cross-check that all percentages and scores match what the visualization shows.

Structure: Data Quality Assessment Slides

NEXT SLIDE — Completeness
Title: Write an analytical headline about completeness patterns (e.g., "Completeness rates remain low nationally but [X] shows low rates in recent months")

Visualization (right side): Create using from_metric with:
- metricId: m1-02-02
- vizPresetId: completeness-table
- Filters: indicator_common_id, admin_area_2
- Display as table: period_id (rows) x indicator_common_id (columns) showing completeness %
- Color coding: Green = 90% or above | Yellow = 80% to 89% | Red = below 80%
- periodFilterOverride: Use the same period as the main report

Interpretation (left side): Use bullet points:
- Describe the overall national trend in completeness — stable, improving, or worsening?
- Name specific indicators with the lowest completeness
- Note whether completeness rates have improved or worsened over the analysis period
- Explain the implication: lower completeness rates mean more values are being adjusted, which can affect the reliability of trend analysis

Add a text block below the interpretation: "When completeness is high, observed and expected volumes are more comparable, and disruptions are more likely to reflect true service changes. When completeness is low, expected values may be artificially higher than observed, creating apparent "disruptions" that actually reflect missing reports rather than real declines in service delivery."

Note for TIM: DQA legends in francophone instances are in English.

NEXT SLIDE — Outliers
Title: Write an analytical headline about outlier patterns (e.g., "Outlier rates remain low nationally but [X] shows elevated rates in recent months")

Visualization (right side): Create using from_metric with:
- metricId: m1-01-01
- vizPresetId: outlier-table
- Filters: indicator_common_id, admin_area_2
- Display as table: period_id (rows) × indicator_common_id (columns) showing outlier %
- Color coding: Green = below 2% | Yellow = 2% to 5% | Red = above 5%
- periodFilterOverride: Use the same period as the main report

Interpretation (left side): Use bullet points:
- Describe the overall national trend in outlier rates — stable, improving, or worsening?
- Name specific indicators with the highest outlier rates
- Note whether outlier rates have improved or worsened over the analysis period
- Explain the implication: high outlier rates mean more values are being adjusted, which can affect the reliability of trend analysis

Add a text block below the interpretation: "Outliers are reports which are suspiciously high compared to the usual volume reported by the facility in other months. Outliers are identified by assessing the within-facility variation in monthly reporting for each indicator. Outliers are defined as observations which are greater than 10 times the median absolute deviation (MAD) from the monthly median value for the indicator in each time period, OR a value for which the proportional contribution in volume for a facility, indicator, and time period is greater than 80%. Outliers are only identified for indicators where the volume is greater than or equal to the median, the volume is not missing, and the average volume is greater than 100."

NEXT SLIDE — Internal Consistency
Title: Write an analytical headline about consistency (e.g., "Most indicator pairs show consistent reporting, but [RATIO] falls outside plausible ranges in several regions")

Visualization (right side): Create using from_metric with:
- metricId: m1-03-01
- vizPresetId: consistency-table
- Filters: ratio_type, admin_area_2
- Display as table: period_id (rows) × ratio_type (columns) showing % of areas meeting consistency criteria
- Color coding: Green = 90% or above | Yellow = 70% to 89% | Red = below 70%

Interpretation (left side): Use bullet points:
- Explain what each ratio_type represents (e.g., Penta1/Penta3 compares first to third dose, ANC1/ANC4 compares first to fourth visit)
- Identify which ratios consistently meet or fail criteria
- Note whether consistency is improving or worsening over the analysis period
- Highlight any specific regions where consistency is notably low

Add a text block below the interpretation: "Internal consistency assesses the plausibility of reported data based on related indicators. Consistency metrics are approximate — depending on timing and seasonality, indicator definitions, and the nature of service delivery and reporting, values may be expected to sit outside plausible ranges. Indicators which are similar are expected to have roughly the same volume over the year (within a 30% margin). The data in this analysis is adjusted for outliers."

NEXT SLIDE — Data Quality Trends (Overall DQA Score)
Title: Write an analytical headline about DQA trends (e.g., "The proportion of facilities with adequate data quality has improved from X% to Y% since [YEAR]")

Visualization (right side): metricId: m1-04-01 | vizPresetId: dqa-score-table | Filters: admin_area_2
Display as table: admin_area_2 (rows) × year (columns) showing % of facilities with adequate DQ
Color coding: Green = 70% or above | Yellow = 50% to 69% | Red = below 50%

Interpretation (left side): Describe national DQ trend, name top/lowest-performing regions, identify notable changes, explain implications.

Add a text block: "Adequate data quality is defined as: 1) No missing data or outliers for OPD, Penta1, and ANC1, where available 2) Consistent reporting between Penta1/Penta3 and ANC1/ANC4."

NEXT SLIDE — Data Quality Trends (Mean DQA Score)
Title: Write an analytical headline about mean DQA trends (e.g., "Mean data quality scores are highest in [X] and [Y], while [Z] lags behind")

Visualization (right side): metricId: m1-04-02 | vizPresetId: mean-dqa-table | Filters: admin_area_2
Display as table: admin_area_2 (rows) × year (columns) showing mean DQA score %
Color coding: Green = 70% or above | Yellow = 50% to 69% | Red = below 50%

Interpretation (left side): Describe national mean DQA trend, contrast top/lowest-performing regions, note significant changes, conclude with overall assessment.

Add a text block: "Items included in the DQA score include: No missing data for OPD, Penta1, and ANC1, where available; No outliers for OPD, Penta1, and ANC1, where available; Consistent reporting between Penta1/Penta3, ANC1/ANC4, BCG/Delivery, where available."

NEXT SLIDE — Section 2 Header
Title: "Section 2: Service Utilization, Nationally"
Subtitle (English): Service utilization over time and assessment of projected volumes based on historical trends to identify surpluses and disruptions in health services at national level.
Subtitle (French): Utilisation des services au fil du temps et évaluation des volumes projetés en fonction des tendances historiques afin d'identifier les excédents et les perturbations dans les services de santé.

UNIVERSAL TEMPLATE: National Service Utilization Slides by Indicator Group

For each indicator group, create three consecutive slides:
- Slide Type A: Monthly service utilization trends
- Slide Type B: Quarterly service volume with quarter-to-quarter % change
- Slide Type C: Service disruption

Both slides use consistent layout: text interpretation (span=4) on left, visualization (span=8) on right.

SLIDE TYPE A: Monthly Service Utilization Trends

Slide Header Format: "Trends in [group description]"
Rules:
- Use a descriptive phrase for the service area, NOT a list of indicator codes
- ✅ Good: "Trends in antenatal care"
- ✅ Good: "Trends in delivery services"
- ❌ Bad: "Trends in BCG, Penta1, Penta3"

Left Block — Text Interpretation (span=4):
Structure: [Service utilization evolution heading]: [INDICATOR 1]: [describe monthly fluctuations] | [INDICATOR 2]: [describe pattern] | [Cross-indicator insight]: [patterns, gaps] | [Implications heading]: [one sentence actionable insight]
Guidelines: Use bold headings, one bullet per indicator, include specific months/periods and approximate numbers. Word count: 60–100 words, max 130. Only describe what is visible in actual data.

Right Block — Visualization (span=8): metricId: m3-01-01 | vizPresetId: volume-monthly | valuesFilter: count_final_both | startDate/endDate: last 12 complete quarters (36 months)

SLIDE TYPE B: Quarterly Change in Service Volume

Slide Header: One analytical sentence summarizing the key finding. Past tense, 1–2 sentences maximum. Focuses on overall trend across the group.
✅ Good: "Antenatal services showed gradual growth, with fourth visits increasing more notably than first visits in 2025"
❌ Bad: "Quarter-to-quarter change in antenatal services"

Left Block — Text Interpretation (span=4):
Structure: [One standalone paragraph: overall trend summary] | [INDICATOR 1] [specific quarter-to-quarter changes with percentages] | [INDICATOR 2] [specific changes]
Guidelines: Only mention quarters with >10% change. If no >10% changes: "[INDICATOR] remained consistent since [DATE]..." Word count: 50–80 words, max 100.

Right Block: metricId: m3-01-01 | vizPresetId: volume-quarterly | valuesFilter: count_final_both | Show data labels, indicator in columns not lines

SLIDE TYPE C: Disruption Analysis

Title: Write an analytical headline (1–2 sentences) summarizing the key finding for this group of indicators.
✅ Good: "Despite widespread shortfalls in 2024, immunization services show signs of recovery by mid-2025"
❌ Bad: "BCG - Bacillus Calmette-Guérin vaccine"

Visualization (right side): metricId: m3-02-01 | vizPresetId: disruption-chart | chartTitle: "Comparing reported service use to expected trends, nationally" | selectedReplicant: first indicator in group | filterOverrides: all indicator codes in group | periodFilterOverride: analysis period

Interpretation (left side — target 50–100 words, max 180): For EACH indicator: specific time periods of disruptions/surpluses with approximate magnitudes. Cross-indicator patterns. Overall assessment. Only describe what is actually visible in the chart.

Workflow
Step 1: Verify data availability — call get_metric_data before creating slides. For monthly: disaggregations: indicator_common_id, period_id. For quarterly: disaggregations: indicator_common_id, quarter_id.
Step 2: Analyze the data — identify highs/lows, calculate quarter-to-quarter % changes, note indicator relationships.
Step 3: Create slides — use create_slide for each type (A, B, C) per indicator group. Position sequentially.

Inputs Needed
- Indicator groups with codes (e.g., Antenatal care: anc1, anc4)
- Date range: Last 12 complete quarters (36 months), format YYYYMM
- Language: English or French (or other)
- Adjustment type (optional): Default: count_final_both. Alternatives: count_final_none, count_final_outliers, count_final_completeness
- Position in deck: After which section or slide should these be inserted?

Key Principles
- ✅ Always query data first — use get_metric_data before writing any interpretation
- ✅ Never fabricate numbers — only report what's in the actual data
- ✅ Consistent layout — every slide uses 4-8 span split in columns
- ✅ Parallel structure — same text format for each indicator group
- ✅ Analytical headers — Slide Type B headers describe findings, not just topic
- ✅ Evidence-based text — include specific numbers, months, quarters from visualizations
- ✅ Actionable insights — "Implications" section suggests what should be done

NEXT SLIDE — Section 3 Header
Title: "Section 3: Service Coverage Estimates"
Subtitle (English): Using routine data to estimate recent trends and subnational disparity in the coverage of selected health services. Not intended as official estimates.
Subtitle (French): Utilisation des données de routine pour estimer les tendances récentes et les disparités infranationales dans la couverture de certains services de santé. Non destiné à servir d'estimations officielles.

PROMPT: Create Coverage Estimation Slides for All Indicators

Create individual coverage estimation slides for each indicator that has coverage data available in metrics m6-01-01 (national) and m6-02-01 (subnational). Organize slides following a life-course approach: CPN1, CPN4, Deliveries, BCG, Penta 1, Penta 3.

Step 1: Identify Available Indicators
Call get_metric_data for m6-01-01 to see which indicators are in the indicator_common_id dimension.

Step 2: For Each Indicator, Create One Slide

Block 1 (Top Row, Full Width): National coverage timeseries chart WITH DATA LABELS. Use: {"type": "from_visualization", "visualizationId": "wua", "replicant": "[indicator_code]"}

Block 2 (Bottom Row, Left — Span 4): Combined text interpretation with two subsections: "Tendance nationale:" and "Variabilité infranationale:"

Block 3 (Bottom Row, Right — Span 8): Subnational coverage bar chart. Use: {"type": "from_metric", "metricId": "m6-02-01", "vizPresetId": "coverage-bar", "selectedReplicant": "[indicator_code]", "startDate": 2001, "endDate": 2025}

Text Interpretation Guidelines

For National Trend (2–3 sentences):
- Describe historical survey trend (increase/decrease/stable) with specific years and percentages
- Briefly mention the survey-based projected trajectory to the latest year
- Compare HMIS estimates to survey trajectory (aligned/higher/lower)
- If there's a difference, indicate when it appears and whether it's temporary or persistent

For Subnational Variability (1 sentence): "In [years], [indicator] coverage shows [strong/moderate] subnational variability, ranging from a minimum of X% ([region]) to a maximum of Y% ([region]), with the majority of regions recording coverage between A% and B%."

Interpretation Rules: Write in project language. Use neutral, descriptive language. DO NOT speculate about causes. DO NOT interpret whether patterns are good or bad. Focus ONLY on patterns visible in the data.

Indicator List to Process
- anc1 (CPN1)
- anc4 (CPN4) ✓ Already completed
- bcg (BCG 0–11 months)
- penta1 (Penta 1)
- penta3 (Penta 3)
- sba (Skilled birth attendance)
- pnc1_mother (PNC1 mother) — if available

Slide Naming Convention
- Header: "Estimation de la couverture du service [Indicator Full Name in French]"
- National chart title: "Tendances de la couverture [Indicator] au niveau national"
- Subnational chart title: "Couverture [Indicator] par région"

BACK PAGE

FASTR initiative: https://data.gffportal.org/key-theme/FASTR

AFTER COMPLETING THE REPORT

Notify the user: "Report complete. If you'd like to add more sections, you can run these prompts from the library: Prompt 2 (Regional disruptions analysis) or Prompt 3 (Data quality assessment annex)."
```
