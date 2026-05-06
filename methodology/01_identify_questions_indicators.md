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

- Leads to better results by aligning data efforts with organizational goals.
- Guides decision making by providing a clear framework for analysis
- Enhances efficiency by focusing analyses on a set of relevant key indicators to solve a specific data need
<!-- /SLIDE -->

<!-- SLIDE:m1_1a -->
## Nigeria: Quarterly performance monitoring

In Nigeria, FASTR is enabling quarterly performance monitoring for the National Health Sector Renewal Initiative -- and informing systems-strengthening efforts along the way.

<div style="display: flex; gap: 1em;">
<div style="flex: 1;">

![Nigeria FASTR example 1](resources/screenshots/country_examples/nigeria_example_1.png)

</div>
<div style="flex: 1;">

![Nigeria FASTR example 2](resources/screenshots/country_examples/nigeria_example_2.png)

</div>
</div>

<div style="font-size: 0.75em;">

> "Part of the FASTR process should open up serious conversations that will lead to improvements in the system. It's not about pulling an indicator that will not get us good information. It is about using this FASTR process to make better decisions and re-engineer the system."
>
> — **Dr. Anthony Adoghe**, Director of M&E, Federal Ministry of Health and Social Welfare

</div>
<!-- /SLIDE -->

<!-- SLIDE:m1_1a2 -->
## Guinea: Tracking investment case progress

<p style="font-size: 0.85em;">Quarterly RMNCAH-N service use monitoring has supported Guinea to track investment case progress and quickly spot challenges -- like this sharp drop in immunization in the beginning of 2024.</p>

![Guinea immunization monitoring h:440](resources/screenshots/country_examples/guinea_immunization.jpeg)
<!-- /SLIDE -->

<!-- SLIDE:m1_1a3 -->
## Ethiopia: Monitoring government program results

<p style="font-size: 0.85em;">Using FASTR HMIS analysis for monitoring results prioritized in government program supported by WB/GFF in Ethiopia.</p>

![Ethiopia FASTR monitoring h:440](resources/screenshots/country_examples/ethiopia_example.png)
<!-- /SLIDE -->

<!-- SLIDE:m1_1b -->
## What is our common data use case that will be the focus of this workshop?

Following large shifts in resource availability from external sources, many countries are experiencing abrupt and dramatic reductions in financing

- Resulting in critical gaps in programs and systems
- Leading to potentially severe effects on service delivery and health outcomes for women, children and adolescents

**Key questions arising:**

- What is the magnitude of the cuts, and what effect are they having on service delivery?
- What is the optimal way to prioritize remaining resources?
- What other adaptations can safeguard and strengthen essential service delivery for women, children and adolescents?
<!-- /SLIDE -->

<!-- SLIDE:m1_1c -->
## How do we select indicators? What makes a good indicator for the FASTR analysis?

Indicator selection is critical to the quality and usefulness of FASTR analysis. Indicators should be chosen based on the following criteria:

- **Relevance** - Does this indicator provide data that aligns with our priority questions and objectives?
- **Volume** - Is this indicator collected at a high volume, which improves the robustness of analysis?
- **Completeness** - Does the indicator have a high completeness rate across reporting facilities?
- **Frequency** - Is the indicator reported frequently enough (e.g., monthly) to support rapid-cycle analysis?
- **Type** - Is this indicator a count of services delivered?
<!-- /SLIDE -->

<!-- SLIDE:m1_2 -->
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

<!-- SLIDE:m1_2a -->
<!-- _class: columns-image-right -->

## Countries have selected indicators to align with the disruptions context and country priorities

![Data prep checklist h:280](../resources/screenshots/data_prep_checklist.png)

- The FASTR Data Prep Checklist has been shared with countries
- The checklist includes the FASTR core RMNCAH-N indicators
- Countries have added additional indicators relevant to their context (e.g., services impacted by funding shifts, government priorities)
- These are the indicators included in the current analysis
- Countries can continue to add indicators over time as needed
<!-- /SLIDE -->

<!-- SLIDE:m1_3 -->
## Why focus on high-volume indicators?

One of the core strengths of the FASTR approach is its ability to adjust for data quality issues. High-volume indicators are better suited to this process because:

**Reduced sensitivity to outliers**
In low-volume indicators, individual data points can disproportionately affect trends.

**More stable estimates**
High-volume data reduce random variability and improve the reliability of trend detection.

**Clearer identification of true anomalies**
Larger counts make it easier to distinguish genuine outliers from natural variation.
<!-- /SLIDE -->

<!-- SLIDE:m1_3a -->
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

<!-- SLIDE:m1_3b -->
## Why focus on count indicators?

**Limitations of proportion indicators**

- Proportions limit the ability to adjust numerators and denominators separately for data quality issues
- Numerators and denominators may each be affected by different sources of error
- Separating counts from denominator estimation allows for more transparent and flexible adjustment

**Mortality as a rare event**

- Mortality indicators are typically low-frequency and not well suited to adjustment
- These indicators are generally better analyzed using annual rather than monthly or quarterly data
<!-- /SLIDE -->

---

**Last updated**: 06-05-2026
**Contact**: <fastr@worldbank.org>
