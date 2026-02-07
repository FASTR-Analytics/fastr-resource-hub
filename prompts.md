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

# Indicator Deep Dives

## Program Areas

### Maternal Health
```prompt
Analyze maternal health indicators including ANC coverage, institutional deliveries, and postnatal care. Provide:
- Current performance levels
- Trends over the past year
- Geographic variations
- Recommendations for improvement
```

### Child Health
```prompt
Analyze child health indicators including immunization coverage, growth monitoring, and treatment of common childhood illnesses. Provide:
- Coverage rates and trends
- Identification of underperforming areas
- Barriers to service delivery
- Recommended interventions
```

### Immunization
```prompt
Analyze immunization indicators including Penta1, Penta3, measles coverage, and dropout rates. Provide:
- Coverage rates and trends
- Dropout analysis (Penta1 to Penta3)
- Geographic variations
- Cold chain or supply considerations
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
