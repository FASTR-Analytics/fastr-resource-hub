# Custom presentations

This section contains standalone presentations designed for specific audiences and time constraints.

## 20-minute high-level overview

A condensed introduction to FASTR methodology covering the key concepts from data quality assessment through coverage estimation. Designed for executive briefings or introductory sessions.

**Duration:** ~20 minutes (15 slides)

**Audience:** Decision-makers, new stakeholders, introductory workshops

### Slide deck structure

The presentation follows the FASTR analytical pipeline:

1. **Introduction** (5 slides): What is FASTR, the rapid-cycle analytics approach, and FASTR vs DHIS2
2. **Data quality assessment** (3 slides): The three dimensions and their objectives
3. **Data quality adjustment** (2 slides): Methods and sensitivity analysis
4. **Service utilization** (2 slides): Tracking volumes and detecting disruptions
5. **Coverage estimation** (4 slides): Methodology and outputs

---

<!-- SLIDE:overview_title -->
<!-- _class: title -->

# FASTR High-Level Overview

**Facility Analytics for Service Tracking and Results**

A 20-minute introduction to rapid-cycle analytics for RMNCAH-N monitoring

<!-- SLIDE:overview_what_trying_achieve -->
## What are we trying to achieve?

Rapid cycle analytics accelerates improvements in RMNCAH-N outcomes by increasing the systematic use of data for decision making

![w:700](resources/diagrams/rapid_cycle_analytics.png)

<!-- SLIDE:overview_how_achieved -->
## How can this be achieved?

Timely, rigorous, and low-cost approaches to monitoring PHC systems, underpinned by capacity building and data use support aligned with country demand and needs

![w:800](resources/diagrams/Technical-Rapid-cycle-analytics--V3.svg)

<!-- SLIDE:overview_what_is_fastr -->
## What is FASTR?

An approach to catalyzing continuous 'analyze, learn, strengthen, act' cycles to drive the systematic use of timely data for decision making.

![w:700](resources/diagrams/what_is_fastr.png)

<!--
PRESENTER NOTES:
- Routine health information systems are a critical source of data, but often underused due to concerns about data quality and long delays between data collection and analysis
- Traditional household and facility surveys, while essential, are resource-intensive and infrequent
- FASTR's rapid-cycle analytics address this gap by providing:
  - Timely insights aligned with country decision cycles
  - Continuous learning rather than one-off assessments
  - Direct feedback loops between data, analysis, and action
-->

<!-- SLIDE:overview_fastr_approach -->
## What is the FASTR approach to RMNCAH-N service use monitoring?

<div class="columns-image-right">
<div>

Quarterly analyses of DHIS2 data, focusing on prioritized national indicators

Building sustainable tools to ensure that stakeholders who need to use data can generate the right analysis and visualizations, at the right time, on their indicators of interest

Combining analysis and visualization with capacity strengthening and data use support for sustainability and institutionalization

</div>
<div>

![Steps to implement RMNCAH-N service use monitoring](resources/diagrams/Steps%20to%20implement%20RMNCAH-N%20service%20chart.svg)

</div>
</div>

<!-- SLIDE:overview_fastr_vs_dhis2 -->
## Why FASTR? Value add beyond standard DHIS2 analysis

**DHIS2 provides the foundation** - robust data collection, storage, and basic visualization

**FASTR builds on this foundation with:**

- **Data quality adjustment** - Automatically adjusts for outliers and completeness gaps before analysis
- **Advanced analytical methods** - Disruption detection, coverage projection, and sensitivity analysis
- **Standardized visualizations** - Percent change approach to identify meaningful fluctuations across indicators
- **Improved coverage estimation** - Back-calculates denominators from surveys rather than relying solely on catchment populations
- **Faster analytics cycles** - Pre-built analytical pipeline aligned with country decision-making timelines
- **Built-in capacity strengthening** - Reproducible methods that build local analytical skills

<!--
PRESENTER NOTES:
- DHIS2 is excellent for data collection and basic visualization - FASTR complements it
- Key differentiator: data quality adjustment before analysis
- Coverage methodology goes beyond simple HMIS/population ratios
- Goal is to enable faster, more rigorous analysis for decision-making
-->

<!-- SLIDE:overview_dqa_pipeline -->
## Data quality assessment

The FASTR analysis follows a sequential workflow:

1. **Assess data quality** - Identify issues with completeness, outliers, and consistency
2. **Adjust for quality issues** - Apply corrections to improve data reliability
3. **Analyze adjusted data** - Generate service utilization and coverage estimates

![Analytical Pipeline h:200](resources/diagrams/analytical_pipeline.svg)

**Philosophy:** Data quality should not be a barrier to data use. Using data and providing feedback is the first step toward improving data quality.

<!--
PRESENTER NOTES:
- FASTR takes a multi-pronged approach to data quality
- Focus on high-volume indicators for more stable estimates
- Emphasize variation over time and space rather than point estimates
- Interpret results collaboratively with in-country decision-makers
-->

<!-- SLIDE:overview_dqa_dimensions -->
## Three dimensions of data quality

<div style="font-size: 0.9em;">

| Dimension | What it measures | Red flag |
|-----------|------------------|----------|
| **Completeness** | % of facilities reporting each indicator | Gaps by region or time period |
| **Outliers** | Suspiciously high values vs. facility history | Data entry errors |
| **Consistency** | Logical relationships (e.g., ANC1 ≥ ANC4) | System or process issues |

</div>

<div style="display: flex; gap: 0.5em; margin-top: 0.5em;">
<div style="flex: 1;">

![Completeness h:180](resources/default_outputs/Default_2._Proportion_of_completed_records.png)

</div>
<div style="flex: 1;">

![Outliers h:180](resources/default_outputs/Default_1._Proportion_of_outliers.png)

</div>
<div style="flex: 1;">

![Consistency h:180](resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

</div>
</div>

Each dimension generates a heatmap showing issues by indicator and area.

<!--
PRESENTER NOTES:
- Completeness: Are facilities that should report actually reporting?
- Outliers: Only flags HIGH values (low values may be real service disruptions)
- Consistency: Assessed at district level to account for patient movement between facilities
-->

<!-- SLIDE:overview_dqa_summary -->
## In summary ... Data quality assessment

**Objectives of data quality assessment:**

- **Enable analytical adjustment:** Systematic assessment supports targeted adjustments, enhancing the utility of HMIS data for evidence-based decision-making

- **Monitor data quality trends:** Inform indicator selection, guide targeted interventions, and evaluate improvement initiatives over time

**Key learning questions:**

- Which indicators have the highest completeness and are most reliable for analysis?
- Are there specific regions or time periods with consistent data quality issues?
- Has data quality improved since the last assessment cycle?

<!--
PRESENTER NOTES:
- DQA is not about rejecting data, but understanding its limitations
- High-quality indicators can be used with more confidence
- Low-quality indicators may need adjustment or careful interpretation
-->

<!-- SLIDE:overview_adjustment -->
## Data quality adjustment

<div style="display: flex; gap: 1.5em;">
<div style="flex: 1; font-size: 0.85em;">

**Why adjust?** Outliers and reporting gaps distort analysis if left uncorrected.

**How?** Replace problematic values with 6-month rolling averages from each facility's historical data.

**Four scenarios for sensitivity analysis:**

| Scenario | What it shows |
|----------|--------------|
| Unadjusted | Raw data as reported |
| Outliers-only | High values smoothed |
| Completeness-only | Gaps filled |
| Both adjusted | Full correction applied |

**Excluded:** Mortality indicators and low-volume indicators (<100/month)

</div>
<div style="flex: 1;">

![Outlier adjustment h:180](resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

![Completeness adjustment h:180](resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

</div>
</div>

<!--
PRESENTER NOTES:
- Comparing scenarios shows how much results depend on adjustment choices
- Outlier adjustment typically reduces volume (removes inflated values)
- Completeness adjustment typically increases volume (fills gaps)
- Large adjustments indicate areas needing data quality attention
-->

<!-- SLIDE:overview_adjustment_summary -->
## In summary ... Data quality adjustment

**Objectives of data quality adjustment:**

- **Improve data reliability:** Replace outliers and fill reporting gaps using facility-specific historical patterns, without discarding valuable information

- **Enable sensitivity analysis:** Compare results across adjustment scenarios (unadjusted, outliers-only, completeness-only, both) to assess robustness of conclusions

**Key learning questions:**

- How much do results change between unadjusted and adjusted data?
- Which regions or indicators require the largest adjustments?
- Are there facilities or areas where data quality improvements should be prioritized?

<!--
PRESENTER NOTES:
- Adjustment is transparent - we can see exactly what changed
- Large adjustments indicate areas needing data quality attention
- Sensitivity analysis builds confidence in findings
-->

<!-- SLIDE:overview_utilization -->
## Service utilization analysis

Track service volumes over time, detect disruptions, compare across areas.

<div style="display: flex; gap: 1em;">
<div style="flex: 1;">

![Service volumes h:220](resources/default_outputs/Module3_5_Number_of_services_reported.png)

**Volumes over time:** Look for trends and sudden changes

</div>
<div style="flex: 1;">

![Year-over-year h:220](resources/default_outputs/Module3_1_Change_in_service_volume.png)

**Year-over-year change:** Changes >±10% flagged for investigation

</div>
</div>

**Disruption detection:** Compare actual volume to model-predicted expected volume (accounting for seasonality). Investigate: COVID? Strikes? Stockouts? Campaigns?

<!--
PRESENTER NOTES:
- Service volumes don't require population denominators - useful when denominators uncertain
- YoY comparison controls for seasonal variation
- Disruption = sustained deviation below expected, not just a single bad month
- When flagged changes appear, ask: data quality issue, real program change, or external event?
-->

<!-- SLIDE:overview_utilization_summary -->
## In summary ... Service utilization

**Objectives of service utilization analysis:**

- **Track service delivery trends:** Monitor volumes over time to identify whether services are reaching the population as expected

- **Detect disruptions and surpluses:** Compare actual service volumes to model-predicted expected values, accounting for seasonality, to flag significant deviations

**Key learning questions:**

- Are service volumes increasing, decreasing, or stable compared to last year?
- Were there disruptions during specific periods (COVID, strikes, stockouts)?
- Which regions show the largest year-over-year changes requiring investigation?

<!--
PRESENTER NOTES:
- Utilization analysis doesn't require denominators - useful when population data uncertain
- Flagged changes trigger investigation, not automatic conclusions
- Triangulate with local knowledge to understand root causes
-->

<!-- SLIDE:overview_coverage -->
## Coverage estimation

<div style="display: flex; gap: 1.5em;">
<div style="flex: 1.2; font-size: 0.85em;">

**The challenge:** HMIS has numerators (services) but not reliable denominators (target population). Standard catchment populations are often inaccurate. Surveys provide reliable coverage but only every 3-5 years.

**FASTR solution:**

1. **Back-calculate denominators** from survey coverage + HMIS volumes
   - Example: 10,000 ANC1 visits ÷ 80% survey coverage = 12,500 pregnancies
2. **Validate** against multiple denominator options (HMIS-derived, UN projections)
3. **Project forward** by anchoring to last survey and applying HMIS trends

</div>
<div style="flex: 0.8; text-align: center;">

**Coverage** = services delivered ÷ target population

![Coverage equation h:120](resources/diagrams/coverage_equation.svg)

</div>
</div>

<!--
PRESENTER NOTES:
- Key insight: we can derive denominators from the data itself
- Multiple denominator options compared to find best fit with survey benchmarks
- Projections extend survey estimates forward using HMIS trends
- Result: more reliable, timely coverage estimates for monitoring
-->

<!-- SLIDE:overview_coverage_outputs -->
## Coverage outputs

<div style="display: flex; gap: 1em;">
<div style="flex: 1;">

![Coverage national h:280](resources/default_outputs/Module4_1_Coverage_HMIS_National.png)

**National trends:** Black = survey, Grey = HMIS-derived, Red = projected

</div>
<div style="flex: 1;">

![Coverage subnational h:280](resources/default_outputs/Module4_2_Coverage_HMIS_Admin2.png)

**Subnational comparison:** Identify low-coverage areas for prioritization

</div>
</div>

**Watch for:**
- Coverage >100%: denominator underestimate or double-counting
- Coverage very low: denominator overestimate or under-reporting
- Large gap between HMIS and survey: denominator accuracy issue

<!--
PRESENTER NOTES:
- Compare grey (HMIS) to black (survey) - gap indicates denominator accuracy
- Subnational view identifies geographic disparities for targeting resources
- Use these outputs to inform program planning and resource allocation
-->

<!-- SLIDE:overview_coverage_summary -->
## In summary ... Coverage

**Objectives of coverage analysis:**

- **Identify unmet needs:** Identifying gaps between the population in need and those receiving services, uncovering unmet needs that utilization alone cannot reveal
  - While utilization measures "how many people came," coverage answers "how well we are meeting the needs of those who required care"

- **Explore inequities:** Exploring inequities in service coverage by geographical location, allowing for targeting of recommended actions

**Key learning questions:**

- Has coverage of Penta1 improved since the most recent DHS?
- Has coverage of ANC1 improved more in state 1 as compared to state 2?

<!--
PRESENTER NOTES:
- Coverage goes beyond utilization to reveal unmet need
- Subnational analysis highlights geographic inequities for targeting
- Use these questions to guide discussion with stakeholders
-->
