# Identify questions & indicators

> **Note:** Content in this section draws on existing FASTR presentation materials and is subject to revision.

## Overview

This section outlines the process for identifying priority policy and programmatic questions and selecting appropriate indicators for FASTR analysis. It provides a structured approach to ensuring that FASTR analyses are demand-driven, analytically feasible, and aligned with national priorities.

Specifically, this section covers:

1. **Introduction to FASTR: gaps and challenges**  
   An overview of the analytical gaps FASTR is designed to address, its role in reducing fragmentation in routine data analysis, and how FASTR can be positioned as an entry point for engagement with government stakeholders.

2. **Development of a data use case**  
   Guidance on co-developing data use cases through workshops with the Ministry of Health and other stakeholders, including practical examples from country implementations.

3. **Defining priority questions and selecting indicators**  
   A framework for formulating priority analytical questions, selecting suitable indicators, and aligning FASTR analysis with national strategies and decision-making needs.

4. **Preparing for data extraction**  
   A high-level overview of pre-extraction considerations, including understanding the DHIS2 configuration, mapping indicators to data elements, and planning the extraction timeline.

---

## Defining priority questions

Effective use of routine data depends on well-defined analytical questions. Priority questions provide direction for FASTR analyses and help ensure that outputs are relevant and actionable for decision makers.

**Characteristics of a good priority question include:**

- **Addresses a priority issue**  
  Focuses on topics of clear interest to policy makers and program managers.

- **Relevant**  
  Important enough to warrant analysis and to inform decision making.

- **Grounded in current realities**  
  Connected to ongoing challenges, reforms, or shocks affecting service delivery.

- **Meaningful to stakeholders**  
  Addresses issues that matter to specific individuals or groups involved in planning or implementation.

- **Answerable**  
  Can be addressed using available data, methods, and timeframes.

### Assessing relevance: key questions to consider

When assessing whether a question is a priority, the following considerations are useful:

- **Who** is the intended audience?  
- **What** do they need or want to know?  
- **When** do they need the information?  
- **Which period or event** is of interest?  
- **Why** is this information needed?  
- **How** will the findings be used?

### What do we mean by “answerable”?

A question is considered answerable if the following conditions are met:

**Data availability**  
- The required data exist and are of sufficient type, quantity, and quality.

**Analytical feasibility**  
- Appropriate and statistically valid methods are available and feasible to apply.

**Timeliness**  
- The analysis can be completed within the required timeframe (e.g., quarterly reporting cycles).

### PICO framework for formulating answerable questions

> **Note:** This framework was included in the original presentation material and is retained here as an optional tool.

The PICO framework, commonly used in public health and evidence-based research, provides a structured way to formulate clear and answerable questions.

| Component | Description |
|----------|-------------|
| **Population** | The population or group of interest |
| **Intervention** | The service, program, or action being examined |
| **Comparison** | The relevant baseline or comparison condition, if applicable |
| **Outcome** | The expected change or public health objective |

---

## Selecting indicators: what makes a good FASTR indicator?

Indicator selection is critical to the quality and usefulness of FASTR analysis. Indicators should be chosen based on the following criteria:

- **Relevance**  
  The indicator aligns with priority questions and policy objectives.

- **Volume**  
  The indicator is reported at sufficiently high volumes to support robust analysis.

- **Completeness**  
  Reporting completeness is high across facilities and over time.

- **Frequency**  
  The indicator is reported frequently enough (typically monthly) to support rapid-cycle analysis.

- **Type**  
  The indicator represents a count of services delivered.

### Why focus on high-volume indicators?

One of the core strengths of the FASTR approach is its ability to adjust for data quality issues. High-volume indicators are better suited to this process because:

- **Reduced sensitivity to outliers**  
  In low-volume indicators, individual data points can disproportionately affect trends.

- **More stable estimates**  
  High-volume data reduce random variability and improve the reliability of trend detection.

- **Clearer identification of true anomalies**  
  Larger counts make it easier to distinguish genuine outliers from natural variation.

Count indicators also allow for ongoing validation and adjustment before proportions or coverage measures are derived externally.

### Why focus on high-completeness indicators?

Indicators with high reporting completeness are preferred because they:

- **Improve data reliability**  
  More complete data reduce bias and provide a more representative picture of service delivery.

- **Support consistent analysis**  
  High completeness enables meaningful comparisons across time and geographic areas.

- **Reduce misinterpretation**  
  Incomplete data can falsely suggest changes in service utilization when changes are driven by reporting gaps rather than real trends.

While statistical methods such as imputation can be used to address incomplete data, these methods require assumptions about missing values. Further detail is provided in [Data Quality Adjustment](05_data_quality_adjustment.md).

### Why focus on count indicators?

**Limitations of proportion indicators**

- Proportions limit the ability to adjust numerators and denominators separately for data quality issues.  
- Numerators and denominators may each be affected by different sources of error.  
- Separating counts from denominator estimation allows for more transparent and flexible adjustment.

**Mortality as a rare event**

- Mortality indicators are typically low-frequency and not well suited to frequent adjustment.  
- These indicators are generally better analyzed using annual rather than monthly or quarterly data.

---

## FASTR core indicators

The FASTR approach focuses on a core set of RMNCAH-N indicators that represent key points along the reproductive, maternal, newborn, child, and adolescent health and nutrition continuum in low- and middle-income countries. These indicators typically have higher reporting volumes and completeness and serve as proxies for broader service delivery patterns.

Outpatient consultations are also included as a proxy for overall health service utilization. Country- or program-specific indicators may be added as needed to reflect national priorities.

---

## Preparing for data extraction

This step includes a pre-extraction checklist, review of the DHIS2 configuration, mapping of indicators to data elements, and planning of the extraction timeline. These steps ensure that downstream analyses are based on consistent, well-understood inputs.

---

<!--
////////////////////////////////////////////////////////////////////
//                                                                //
//   _____ _     _____ ____  _____    ____ ___  _   _ _____ _   _ //
//  / ____| |   |_   _|  _ \| ____|  / ___/ _ \| \ | |_   _| \ | |//
//  | (___ | |     | | | | | | |__   | |  | | | |  \| | | | |  \| |//
//   \___ \| |     | | | | | |  __|  | |  | | | | . ` | | | | . ` |//
//   ____) | |___ _| |_| |_| | |____ | |__| |_| | |\  | | | | |\  |//
//  |_____/|_____|_____|____/|______| \____\___/|_| \_| |_| |_| \_|//
//                                                                //
//            Edit workshop slides below this line                //
//                                                                //
////////////////////////////////////////////////////////////////////
-->

<!-- SLIDE:m1_1 -->
## What is a data use case?

A data use case is a specific scenario where data is utilized to achieve a particular goal or solve a problem.

**Why is defining a data use case important?**

- Guides decision making by providing a clear framework for analysis
- Enhances efficiency by focusing analyses on a set of relevant key indicators to solve a specific data need
- Leads to better results by aligning data efforts with organizational goals
<!-- /SLIDE -->

<!-- SLIDE:m1_1a -->
## What is our common data use case that will be the focus of this workshop?

Following large shifts in resource availability from external sources, many countries are experiencing abrupt and dramatic reductions in financing

- Resulting in critical gaps in programs and systems
- Leading to potentially severe effects on service delivery and health outcomes for women, children and adolescents

**Key questions arising:**

- What is the magnitude of the cuts, and what effect are they having on service delivery?
- What is the optimal way to prioritize remaining resources?
- What other adaptations can safeguard and strengthen essential service delivery for women, children and adolescents?
<!-- /SLIDE -->

<!-- SLIDE:m1_1b -->
## How do we select indicators? What makes a good indicator for the FASTR analysis?

Indicator selection is critical to the quality and usefulness of FASTR analysis. Indicators should be chosen based on the following criteria:

- **Relevance** - Does this indicator provide data that aligns with our priority questions and objectives?
- **Volume** - Is this indicator collected at a high volume, which improves the robustness of analysis?
- **Completeness** - Does the indicator have a high completeness rate across reporting facilities?
- **Frequency** - Is the indicator reported frequently enough (e.g., monthly) to support rapid-cycle analysis?
- **Type** - Is this indicator a count of services delivered?
<!-- /SLIDE -->

<!-- SLIDE:m1_2 -->
## Development of a data use case

*Content to be developed*

This section will cover:
- Co-creation workshop approach with MoH and stakeholders
- Data use case development guidance
- Example use cases from country implementations
<!-- /SLIDE -->

<!-- SLIDE:m1_2a -->
## Defining priority questions

Effective data use relies on well-defined questions. Priority questions will guide the FASTR analysis and enhance decision making support.

**Qualities of a good question:**

- **Addresses a priority issue**: A topic of interest to you and policy makers
- **Relevant**: Important enough to be worth answering
- **Related to experiences that are alive**: Connected to current issues
- **Important to individuals/groups**: Matters to stakeholders
- **Answerable**: Can be addressed with available data and methods
<!-- /SLIDE -->

<!-- SLIDE:m1_2b -->
## Is my question a relevant priority? 5+ Ws to consider

- **Who** is your audience?
- **What** do they need and want to know?
- **When** do they need to know it by?
- **When** is the event/intervention/period they are interested in?
- **Why** do they need to know?
- **How** will they use the findings?
<!-- /SLIDE -->

<!-- SLIDE:m1_2c -->
## What do we mean by answerable?

**We have the data**
- Type, quantity, quality sufficient for the question

**We have the analysis tools/methods**
- Statistically valid; feasible to use

**We have the time**
- We can answer the question on a quarterly basis
<!-- /SLIDE -->

<!-- SLIDE:m1_2d -->
<!-- Note: This slide was hidden in the original presentation but may be useful to include -->
## PICO framework for identifying answerable questions

A standard tool from evidence-based medicine and public health research for formulating clear, answerable questions.

| Component | Description |
|-----------|-------------|
| **P**opulation | Who is being investigated |
| **I**ntervention | What is being investigated |
| **C**omparison | What is baseline/non-intervention |
| **O**utcome | What is public health objective |
<!-- /SLIDE -->

<!-- SLIDE:m1_3 -->
## What makes a good indicator for FASTR analysis?

- **Relevance**: Does this indicator align with our priority questions and objectives?
- **Volume**: Is this indicator collected at a high volume, improving robustness of analysis?
- **Completeness**: Does the indicator have a high completeness rate across reporting facilities?
- **Frequency**: Is the indicator reported frequently enough (e.g., monthly) to support rapid-cycle analysis?
- **Type**: Is this indicator a count of services delivered?
<!-- /SLIDE -->

<!-- SLIDE:m1_3a -->
## Why focus on high-volume indicators?

One of the core strengths of the FASTR approach is its ability to adjust for data quality issues. High-volume indicators are better suited to this process because:

**Reduced sensitivity to outliers**
In low-volume indicators, individual data points can disproportionately affect trends.

**More stable estimates**
High-volume data reduce random variability and improve the reliability of trend detection.

**Clearer identification of true anomalies**
Larger counts make it easier to distinguish genuine outliers from natural variation.
<!-- /SLIDE -->

<!-- SLIDE:m1_3b -->
## Why focus on high-completeness indicators?

Indicators with high reporting completeness are preferred because they:

**Improve data reliability**
More complete data reduces bias and provide a more representative picture of service delivery.

**Support consistent analysis**
High completeness enables meaningful comparisons across time and geographic areas.

**Reduce misinterpretation**
Incomplete data can falsely suggest changes in service utilization when changes are driven by reporting gaps rather than real trends.

While statistical methods such as imputation can be used to address incomplete data, these methods require assumptions about missing values.
<!-- /SLIDE -->

<!-- SLIDE:m1_3c -->
## Why focus on count indicators?

**Limitations of proportion indicators**

- Proportions limit the ability to adjust numerators and denominators separately for data quality issues
- Numerators and denominators may each be affected by different sources of error
- Separating counts from denominator estimation allows for more transparent and flexible adjustment

**Mortality as a rare event**

- Mortality indicators are typically low-frequency and not well suited to adjustment
- These indicators are generally better analyzed using annual rather than monthly or quarterly data
<!-- /SLIDE -->

<!-- SLIDE:m1_3d -->
## FASTR core indicators

The FASTR approach focuses on a core set of RMNCAH-N indicators that represent key points along the reproductive, maternal, newborn, child, and adolescent health and nutrition continuum in low- and middle-income countries.

These indicators typically have higher reporting volumes and completeness and serve as proxies for broader service delivery patterns.

- Antenatal client 1st visit
- Antenatal client 4th visit
- Institutional delivery
- Postnatal care 1
- BCG doses
- Pentavalent 1st dose
- Pentavalent 3rd dose
- Outpatient visits
<!-- /SLIDE -->

<!-- SLIDE:m1_3e -->
<!-- _class: columns-image-right -->

## Countries have selected indicators to align with the disruptions context and country priorities

![Data prep checklist h:280](../resources/screenshots/data_prep_checklist.png)

The FASTR Data Prep Checklist has been shared with countries.

The checklist includes the FASTR core RMNCAH-N indicators.

Countries have added additional indicators that may be particularly relevant to the country context (e.g., indicators related to services expected to be impacted by recent funding shifts, priority indicators for the government and/or the WB project).

These are the indicators included in the current analysis. Countries can continue to add indicators over time as needed for their use case(s).
<!-- /SLIDE -->

<!-- SLIDE:m1_4 -->
## Preparing for data extraction

*Content to be developed*

This section will cover:
- Pre-extraction checklist
- Understanding your DHIS2 configuration
- Mapping indicators to data elements
- Planning your extraction timeline
<!-- /SLIDE -->

---

**Last updated**: 07-01-2026
**Contact**: FASTR Project Team
