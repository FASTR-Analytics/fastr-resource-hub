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

ACCURACY REQUIREMENTS:
- Base all analysis only on data visible in the platform - do not draw on external knowledge
- Do not invent statistics, percentages, or specific numbers - if data is not visible, say so
- If you cannot verify a claim from the data, mark it with [VERIFY]
- Do not guess at dates, time periods, or magnitudes

INDICATOR GROUPINGS (use only what exists in platform):
- Maternal & Newborn: ANC1, ANC4, Institutional delivery, PNC (plus C-sections, maternal deaths, stillbirths if available)
- Immunization: BCG, Penta1, Penta3 (plus Measles 1/2, fully immunized, Vitamin A if available)
- General Services: Outpatient visits (plus OPD under 5, OPD over 5 if available)
- Family Planning, Malaria, Nutrition: Include if available in platform

REPORT STANDARDS:
- Maintain cautious, analytical language - no causal claims
- Treat disruption signals as descriptive and exploratory
- Structure narratives in complete sentences (not bullet points)
- Place indicator titles in bold
- Layout: interpretation on left, visualization on right
- Use consistent terminology throughout (do not switch between synonyms)

VERIFICATION: Before finalizing each slide, cross-check:
- All numeric values match what the visualization shows
- Time periods and indicator names are correctly referenced
- Described trends (increases, decreases) match the actual data direction
- Numbers are consistent across slides (same indicator = same values)

STRUCTURE:
1. Cover slide: "Tracking Disruptions in Essential Services Using HMIS Data"
2. Introductory slide with FASTR description
3. Methodology slide: Service Utilization Assessment (purpose, how it works, measuring impact, how to interpret red/green areas)
4. Indicator selection slide listing available indicators by category
5. Section header: "Section 1: Service Utilization"
6. National analysis slides for each indicator category with visualizations and narrative descriptions
7. Annex 1: Subnational analysis header and summary
8. Annex 2: Data quality - completeness heatmap and explanation of why completeness matters
```

## Prompt 2: Regional Disruptions Analysis
```prompt
Generate Regional Disruptions Analysis for all subnational areas.

ACCURACY REQUIREMENTS:
- Base all analysis only on data visible in the platform
- Do not invent statistics or specific numbers - if data is not visible, say so
- If you cannot verify a claim from the data, mark it with [VERIFY]

REPORT STANDARDS:
- Maintain cautious, analytical language - no causal claims
- Treat disruption signals as descriptive and exploratory
- Layout: interpretation on left, visualization on right
- Use consistent terminology throughout

VERIFICATION: Before finalizing each slide, cross-check that described trends match what the visualization shows.

STRUCTURE:
1. Cover slide: "Subnational service utilization disruptions"
2. One slide per subnational area with:
   - Slide title: Name of the subnational area
   - Visualization: Actual vs expected number of services for that area
```

## Prompt 3: Data Quality Assessment Report
```prompt
Generate a Data Quality Assessment Report.

ACCURACY REQUIREMENTS:
- Base all analysis only on data visible in the platform
- Do not invent statistics or specific numbers - if data is not visible, say so
- If you cannot verify a claim from the data, mark it with [VERIFY]

REPORT STANDARDS:
- Maintain cautious, analytical language
- Layout: interpretation on left, visualization on right
- Use consistent terminology throughout

VERIFICATION: Before finalizing each slide, cross-check that all percentages and scores match what the visualization shows.

STRUCTURE:
1. Cover slide: "Data Quality Assessment" with subtitle about completeness, consistency, and outliers
2. Reporting completeness slide: visualization + interpretation of national trends, indicators with low completeness, areas with low completeness
3. Outliers slide: visualization + interpretation of national trends, indicators with high outliers, areas with high outliers
4. Internal consistency slide (2 slides): visualization + interpretation across country and administrative areas
5. Trends in data quality (2 slides): DQA score visualizations + interpretation across years, country, and administrative areas
```
