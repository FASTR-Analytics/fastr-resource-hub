---
marp: true
theme: fastr
paginate: true
---


# FASTR Workshop - Example Country

**Date:** January 15-17, 2025
**Location:** Capital City, Country
**Facilitators:** Dr. Smith, Dr. Jones

![FASTR Logo](../assets/fastr_logo.png)

---


# Workshop Agenda

![Agenda](../workshops/example/agenda.png)

---



# What is FASTR?

A data-driven framework developed by the GFF to help countries monitor and improve maternal, newborn, child, and adolescent health services.

FASTR strengthens the use of routine health facility data by applying standardized methods for data quality assessment, trend analysis, coverage estimation, and decision-focused interpretation.

![FASTR Approach](../assets/FASTR_rapid_cycle_analytics_approach.svg)

---
### FASTR supports governments to:

- Identify data quality gaps and strengthen HMIS use
- Track service performance and disruptions in near real time
- Generate actionable insights for planning, budgeting, and program improvement


**FASTR provides a practical, analytic pathway for turning routine health data into reliable, policy-relevant insights.**

---
## The Challenge FASTR Addresses

Health systems generate a lot of data, but each source comes with limitations that make it hard to build a clear, reliable picture of service performance.

- **Routine facility data (e.g., DHIS2)** provide continuous monthly reporting,  
  but suffer from issues like incomplete submission, outliers, and internal inconsistencies.

- **Household surveys (e.g., DHS, MICS)** offer strong methodological rigor,  
  but are infrequent and cannot capture short-term changes.

- **Population and demographic estimates (e.g., UNWPP, national projections)** are needed to understand the size of the groups we aim to serve,  
  but these estimates differ across sources and come with uncertainty.

---
### FASTR introduces a structured analytic approach to **clean, adjust, reconcile, and integrate** these data streams—producing a coherent, decision-ready view of service utilisation and coverage that supports continuous monitoring between survey rounds.

---
## What Does FASTR Do?

<br>**FASTR is a structured pipeline that transforms routine facility data into reliable, decision-ready insights.**

1. **Diagnoses data quality**  
   Identifies gaps in completeness, detects outliers, and checks consistency.

2. **Improves the data**  
   Applies transparent, reproducible adjustments to correct quality issues.

3. **Analyzes service patterns**  
   Detects disruptions, quantifies changes over time, and strengthens trend signals.

4. **Generates coverage estimates**  
   Integrates adjusted DHIS2 data with surveys and population estimates to produce coherent coverage trends.

---
## What this enables

<br>Countries can use their routine data to **monitor service performance and coverage between survey rounds** with clearer, more reliable signals.

<br>
<br>
(placeholder for illustration)

---



## What is the FASTR Analytical Lab approach?

<br>The FASTR Analytical Lab is a hands-on, structured process that helps country teams learn how to analyse routine health facility data, interpret the results together, and use the findings to guide decisions each quarter.

<br>The Lab focuses on:
- Asking the right questions  
- Running analysis using FASTR methods  
- Reviewing and interpreting results  
- Deciding what actions follow  

---

## What the Lab Helps Countries Do

<br>**1. Ask the right questions**  
Identify priority issues that matter for service quality, availability, and improvement.

**2. Generate actionable evidence**  
Use FASTR methods to analyse routine health facility data in a consistent and reproducible way.

**3. Interpret and translate results**  
Work with program teams and decision-makers to understand the findings and identify what actions they imply.

**4. Build a routine analysis and review process**  
Establish a regular way of analysing results and discussing what actions should follow, aligned with national planning and reporting cycles.

---


# Tea Break

**15 minutes**

We'll resume at 10:45 AM

---


# Data Extraction

---

## Session Objectives

1. Understand why DHIS2 data needs to be extracted for FASTR analyses  
2. Understand the required data structure and level of detail  
3. Learn about the available tools for extracting or importing data  
---

## Why Extract Data from DHIS2? Why not analyse directly inside DHIS2?

<br>**The FASTR Analytics Platform applies data quality adjustments**  

- The platform implements the FASTR approach, automatically correcting for missing reports, outliers, and reporting-rate issues.  

- This produces more reliable estimates than raw DHIS2 trend charts.

<br>**The platform enables additional analytical methods**

- It operationalises techniques such as regression-based seasonality adjustment, disruption detection, and denominator modelling.  
- These methods go beyond what DHIS2 offers through its built-in analytics tools.

<br>**Different tools for different purposes**

- DHIS2 is ideal for quick visual checks.  
- The FASTR Analytics Platform is designed for deeper, reproducible analysis that supports interpretation and decision-making.


## Direct Import from DHIS2

The **Direct Import** option is the simplest and most reliable way to bring DHIS2 data into the FASTR Analytics Platform.  
It connects securely to your country’s DHIS2 server, retrieves the selected indicators, and automatically reshapes the data into the structure required for analysis.

**What the platform takes care of:**
- API authentication  
- Retrieving facility-level monthly data  
- Reshaping to the correct long format  
- Validating fields before analysis  

> **Live demo coming next**  
> We will walk through the Direct Import workflow step by step.

---

## Other Options for Extracting DHIS2 Data

FASTR has also developed tools that countries may use if they prefer to prepare their data before uploading it to the platform.

**Available tools include:**
- **FASTR DHIS2 Data Downloader**  
  A guided interface for selecting indicators, time periods, and administrative levels, producing ready-to-upload CSVs.

- **FASTR API Script (Google Colab)**  
  A script-driven option for automated or large-scale extraction.

Countries can choose whichever approach fits their workflow.  
Both tools produce CSVs that are compatible with the FASTR platform when correctly structured.

---
## How the FASTR Analytics Platform Expects the Data

<div class="columns">

<div>

### Direct Import

The platform expects **facility-level, monthly data** in a standard long format.
<br>**The Direct Import builds this structure for you automatically.**

It:
- Calls the DHIS2 API  
- Applies the correct long-format structure  
- Standardises organisational units  
- Ensures completeness of required fields  

No manual formatting is needed.

</div>

<div>

### If uploading CSVs manually

When data are prepared using the Downloader, API script, or DHIS2 exports, the CSV must follow this structure:

**Data format principles**
- **Facility-level:** each row corresponds to a facility  
- **Monthly:** one record per facility–indicator–month  
- **Long format:** one observation per row  
- **CSV file(s):** single or multiple files accepted  

**Required fields**
- Organisation unit (facility + hierarchy)  
- Period (e.g., 2023-07)  
- Indicator or data element  
- Reported value  
- Date extracted  

</div>

</div>

---
## Data format and granularity
<br>

![hmis_data_raw](../assets/input_data.png)

---
## How Much Data?

### Initial FASTR analysis

For a first run, we recommend extracting around **five years of historical data**.  
This length provides enough information to understand long-term trends, seasonal patterns, and underlying variation.

The exact period may vary depending on:
- How far back reliable DHIS2 data are available  
- Whether indicator definitions or reporting practices changed  
- The stability of the routine information system  

The goal is to include enough history to establish a solid baseline for trends and seasonality.


---

## How Much Data? (continued)

### Routine updates to the FASTR analysis

For each new run, you do **not** need to re-download the full historical dataset.  
Instead, update only the period that is new or likely to have changed.

A practical approach is to:
- Download the **new months** not yet in your dataset  
- Include a **buffer of recent months** (often the last 2–3 months) because DHIS2 values may change due to late reporting or corrections  

If there are signs of major historical revisions or indicator changes, you can always re-download a longer period to ensure consistency.

---


# Lunch Break

**60 minutes**

We'll resume at 1:00 PM

---

# Data Quality Assessment

Understanding the reliability of routine health data

---
## Why Talk About Data Quality?

**The challenge:** Health facilities report data every month, but sometimes:
- Numbers seem too high or too low
- Facilities forget to report
- Related numbers don't match up

**The impact:** Bad data leads to bad decisions
- We might think services are improving when they're not
- We might miss real problems in certain areas
- Resources might go to the wrong places

**FASTR's solution:** Check data quality systematically, fix what we can, and be transparent about limitations

---
## Three Simple Questions About Data Quality

**1. Are facilities reporting regularly?**
- Completeness: Did we get reports from facilities this month?

**2. Are the numbers reasonable?**
- Outliers: Are there any suspiciously high values?

**3. Do related numbers make sense together?**
- Consistency: Do related services show expected patterns?

These three questions help us understand if we can trust the data for decision-making.

---

## Question 1: Are Facilities Reporting?

---

## Completeness: Did We Get Reports?

**What we're checking:**
Each month, are facilities sending in their reports?

**Example:**
- District has 20 health centers
- In March, only 15 sent ANC data
- **Completeness = 75%** (15 out of 20 reported)

**Why it matters:**
- If many facilities don't report, we're missing part of the picture
- Trends might look like services dropped, when really facilities just didn't report

---

## What's Good Completeness?

**It depends on your health system:**
- 90%+ is excellent
- 80-90% is good
- Below 80% means we're missing a lot of information

**Important:** Even 100% completeness doesn't mean we have the full picture - some services might happen outside facilities or some facilities might not be in the reporting system.

**What to look for:** Is completeness improving over time? Which areas have low completeness?

---

## Question 2: Are Numbers Reasonable?

---

## Outliers: Spotting Suspicious Numbers

**What we're checking:**
Are there any values that seem way too high compared to what that facility normally reports?

**Real example:**
- Health Center A normally reports 20-25 deliveries per month
- In March, they reported 450 deliveries
- **This is likely a data entry error** (maybe they typed an extra digit, or reported cumulative instead of monthly)

**Why it matters:**
- One extreme value can make it look like there was a huge service increase
- Skews totals and trends for the whole district or province

---

## How We Spot Outliers

**We use two checks:**

**Check 1: Is this value much higher than usual for this facility?**
- Look at the facility's typical monthly values
- If one month is extremely different, flag it

**Check 2: Does one month account for most of the year's total?**
- If March has 80% of the facility's annual deliveries, something's wrong
- Services should be spread more evenly across months

**Both checks together** help us find data entry errors or reporting problems.

---

## Outlier Example

**Health Center B - Malaria Tests:**

| Month | Tests Reported | Normal? |
|-------|----------------|---------|
| January | 245 | Normal |
| February | 267 | Normal |
| **March** | **2,890** | **Outlier** |
| April | 256 | Normal |

**What happened?** Probably someone entered "2890" instead of "289" (extra zero)

**Impact if we don't fix it:** March would show a huge "spike" in malaria that didn't really happen.

---

## Question 3: Do Related Numbers Match Up?

---

## Consistency: Do Related Services Make Sense Together?

**What we're checking:**
Health services are related - certain patterns are expected.

**Example 1 - ANC visits:**
- More women should get their **1st** ANC visit (ANC1)
- Fewer should complete all **4** visits (ANC4)
- We expect: ANC1 >= ANC4

**Example 2 - Vaccinations:**
- More babies should get their **1st** Penta dose (Penta1)
- Fewer should complete all **3** doses (Penta3)
- We expect: Penta1 >= Penta3

**If these relationships are backwards, something's wrong with the data.**

---

## Why Check Consistency at District Level?

**Patients move between facilities:**
- Woman might get ANC1 at Health Center A
- But deliver at District Hospital B
- If we only look at each facility separately, numbers might not match

**Solution:** Check consistency at district level
- Add up all ANC1 visits in the district
- Add up all ANC4 visits in the district
- Compare the totals

This accounts for patients visiting different facilities for different services.

---

## Consistency Example

**District X - ANC Services:**

| Indicator | District Total | Expected Relationship |
|-----------|----------------|----------------------|
| ANC1 | 5,200 visits | Should be higher |
| ANC4 | 4,100 visits | Should be lower |

**This passes the consistency check** - more women started ANC (5,200) than completed 4 visits (4,100).

**If it was reversed** (more ANC4 than ANC1), we'd know there's a data quality problem.

---

## Putting It All Together: Overall Data Quality

---

## Overall Quality Score

**For each facility and month, we combine all three checks:**

**Complete:** Did the facility report?
**No outliers:** Are the numbers reasonable?
**Consistent:** Do related numbers make sense?

**If all three pass -> Quality Score = 1 (good quality)**
**If any fail -> Quality Score = 0 (quality issue)**

**This score helps us:**
- Decide which data to use for analysis
- Identify facilities that need support
- Track if data quality is improving over time

---


# Afternoon Break

**15 minutes**

We'll resume at 3:30 PM

---

# Data Adjustment

Fixing data quality issues to enable reliable analysis

---

## What Do We Do About Quality Issues?

---

## Two Options: Accept or Adjust

**Option 1: Just report the quality issues**
- Show which data has problems
- Let users decide whether to use it
- Be transparent about limitations

**Option 2: Try to fix the problems statistically**
- Replace bad values with estimates
- Fill in missing reports
- Produce "cleaned" datasets

**FASTR does both** - we report quality issues AND provide adjusted datasets, so users can choose.

---

## How We Adjust Data

**For outliers (suspiciously high values):**
- Don't just delete them
- **Replace with the facility's typical value**
- Use the average of surrounding months

**Example:**
- Feb: 80 deliveries
- **Mar: 450 deliveries** (outlier)
- Apr: 85 deliveries

**Adjusted March value:**  Average of Feb and Apr = 83 deliveries

This preserves the facility's pattern while removing the data error.

---

## How We Fill Missing Data

**For missing reports:**
- Don't leave them as zero (that would make it look like services stopped)
- **Estimate what the value probably was**
- Use the facility's typical value from nearby months

**Example:**
- Jan: 45 malaria tests
- **Feb: No report (missing)**
- Mar: 48 malaria tests

**Estimated February value:** Average of nearby months = 47 tests

This prevents gaps from creating false "drops" in service delivery.

---

## Four Versions of the Data

**To give users flexibility, we create four versions:**

1. **Original (no changes):** Raw data as reported
2. **Outliers fixed:** Only extreme values replaced
3. **Missing filled:** Only gaps filled in
4. **Both fixed:** Outliers replaced AND gaps filled

**Why four versions?**
- You can see the impact of adjustments
- Choose the version that makes sense for your analysis
- Transparency about what was changed

**Most common choice:** Version 4 (both adjustments) for cleanest analysis

---

## Real-World Example: Comparing Versions

**Province Y - Institutional Deliveries (Q1 totals):**

| Version | Total Deliveries | Difference |
|---------|------------------|------------|
| Original (no changes) | 12,450 | Baseline |
| Outliers fixed | 11,890 | -560 (outliers removed) |
| Missing filled | 13,210 | +760 (gaps filled) |
| Both fixed | 12,650 | +200 (net effect) |

**Interpretation:** Outliers were inflating the total, but missing reports were deflating it. The "both fixed" version is probably closest to reality.

---

## How to Use Data Quality Information

---

## For Program Managers

**Three questions to ask:**

1. **Can we trust this data for decision-making?**
   - Check the quality scores for your area
   - If most months have good quality -> yes, use it
   - If quality is poor -> dig deeper before making decisions

2. **Which areas need data quality support?**
   - Low completeness -> facilities need reporting support
   - Many outliers -> need better data entry or validation
   - Consistency problems -> need training on indicator definitions

3. **Is data quality improving?**
   - Track quality scores over time
   - See if interventions (training, digitization) are working

---

## For Data Analysts

**How to use the quality outputs:**

**For analysis:**
- Use the adjusted datasets (version 4 typically)
- Filter to high-quality months if needed
- Report which version you used

**For data quality improvement:**
- Share outlier lists with facilities for correction
- Identify facilities with chronic quality problems
- Prioritize areas for in-person data quality assessments

**For reporting:**
- Always mention data quality caveats
- Show before/after adjustment comparisons
- Be transparent about limitations

---

## Common Questions

---

## "Why not just fix all the problems in DHIS2?"

**We do both!**

**Long-term solution:** Improve data quality at the source
- Training, supervision, better systems
- This is the goal - takes time

**Short-term solution:** Statistical adjustments
- Enables analysis with current data
- Fills gaps while quality improves
- Provides feedback to guide improvements

**FASTR helps with both** - identifies problems for fixing AND enables analysis despite problems.

---

## "How do we know the adjustments are right?"

**We don't claim they're perfect, but they're better than the alternatives:**

**Alternative 1: Use raw data with errors**
- Outliers skew results
- Missing data creates false drops
- Decisions based on bad data

**Alternative 2: Throw out all problem data**
- Lose too much information
- Can't analyze anything
- No basis for decisions

**FASTR approach: Make reasonable estimates**
- Based on facility's own pattern
- Transparent about what was changed
- Provide multiple versions for comparison

---

## "What if our data quality is really bad?"

**FASTR can still help:**

**First: Understand HOW bad**
- The assessment shows exactly where problems are
- Completeness, outliers, consistency by area and indicator
- This guides improvement efforts

**Second: Use what you can**
- Even partial data is better than no data
- Focus on areas/indicators with better quality
- Track improvement over time

**Third: Set realistic expectations**
- Coverage estimates will have more uncertainty
- Trend directions still useful even if exact numbers uncertain
- Transparency about limitations builds trust

---

## Key Takeaways

---

## Remember These Points

**1. Data quality matters for decision-making**
- Bad data -> bad decisions
- Systematic checking prevents mistakes

**2. Three simple dimensions to check**
- Completeness: Are facilities reporting?
- Outliers: Are numbers reasonable?
- Consistency: Do related numbers match?

**3. We can both report and adjust**
- Transparency about problems
- Statistical fixes where appropriate
- Multiple versions for flexibility

**4. Use quality information strategically**
- For analysis: Choose appropriate data version
- For improvement: Target support where needed
- For reporting: Be transparent about limitations

---

## What's Next?

**Now that we have quality-assessed and adjusted data, we can:**

**Disruption Detection:** Analyze service delivery trends
- Detect disruptions in services
- Quantify shortfalls and surpluses
- Monitor health system performance

**Coverage Analysis:** Estimate population coverage
- What percentage of people are being reached?
- Are we meeting targets?
- Where are the gaps?

**The data quality work enables everything else!**

---


# See You Tomorrow!

**Day 1 Complete**

We resume tomorrow at **9:00 AM**

**Tomorrow:** Disruption, Coverage

---


# Monitoring Service Delivery Trends

Detecting when health services are disrupted and measuring the impact

---

## Why Monitor Service Trends?

**The question:** Are health services being delivered consistently over time?

**Why it matters:**
- Services might drop during strikes, outbreaks, or supply shortages
- Services might surge during campaigns or after reforms
- We need to know when changes happen and how big they are

**FASTR helps you:**
- Spot when services deviate from normal patterns
- Measure how many services were missed (or exceeded)
- Identify which areas are most affected

---

## What We Mean by "Service Disruption"

**A disruption is when service delivery is significantly different from what we'd normally expect.**

**Examples of disruptions:**
- **Negative:** ANC visits drop by 30% during a health worker strike
- **Positive:** Vaccination rates surge during a catch-up campaign
- **Sustained:** Deliveries remain low for 6 months due to facility closure

**Not a disruption:**
- Small month-to-month variation (normal fluctuation)
- Predictable seasonal patterns (like malaria during rainy season)

---

## Two Key Questions FASTR Answers

**Question 1: WHEN did disruptions happen?**
- Which months showed unusual patterns?
- Were disruptions one-time events or sustained over months?

**Question 2: HOW MUCH was the impact?**
- How many services were missed during disruptions?
- What percentage drop occurred?
- Which areas had the biggest shortfalls?

**Together:** Identify problems + quantify their size = better targeted responses

---

## How FASTR Detects Disruptions

---

## Step 1: Understanding "Normal"

**Before we can spot problems, we need to know what's normal for each area and service.**

**FASTR looks at historical patterns:**
- What's the typical number of ANC visits in Province X each month?
- Is there a seasonal pattern? (Some services naturally higher in certain months)
- Is there a long-term trend? (Services increasing or decreasing over time)

**Example:**
- Province A normally has 800-900 ANC1 visits per month
- Slightly higher in dry season (better access)
- Gradually increasing trend (+2% per year)

---

## Step 2: Comparing Actual to Expected

**Once we know what's "normal," we compare actual service delivery to what we'd expect.**

**Example - Province A ANC1:**

| Month | Expected | Actual | Difference |
|-------|----------|--------|------------|
| Jan | 850 | 840 | -10 (normal variation) |
| Feb | 870 | 870 | 0 (right on track) |
| **Mar** | **860** | **620** | **-240** (**disruption**) |
| Apr | 880 | 890 | +10 (normal variation) |

**March shows a large drop** - this flags as a potential disruption needing investigation.

---

## Different Types of Disruptions

**FASTR looks for several disruption patterns:**

**1. Sharp drop or spike**
- One month with a very large change
- Example: Strike causes ANC to drop 40% in one month

**2. Gradual decline**
- Services slowly dropping over several months
- Example: Stock-outs cause steady decrease in deliveries

**3. Sustained low period**
- Services consistently below normal for months
- Example: Facility closure keeps immunizations low for 6 months

**4. Sustained surge**
- Services consistently above normal
- Example: Campaign boosts vaccination rates for 3 months

---

## Real Example: COVID-19 Disruption

**Country X - Institutional Deliveries:**

**Before COVID (Jan-Feb 2020):**
- Expected: ~10,000 deliveries/month
- Actual: 9,800-10,200 (normal range)

**During First Wave (Mar-Jun 2020):**
- Expected: ~10,000 deliveries/month
- Actual: 7,500-8,000 (**sustained disruption**)
- Impact: ~2,500 missed deliveries per month

**Recovery (Jul-Dec 2020):**
- Gradually returned toward normal
- By December: 9,500 deliveries

**FASTR detected:** When disruption started, its magnitude, and when recovery began.

---

## Measuring the Impact

---

## Calculating Service Shortfalls

**Once we identify a disruption, we measure its impact:**

**Shortfall = Expected Services - Actual Services**

**Example - District Y, March 2023:**
- Expected ANC4 visits: 1,200
- Actual ANC4 visits: 850
- **Shortfall: 350 visits (29% below expected)**

**Interpretation:** District Y missed about 350 ANC4 visits in March - these women didn't complete their antenatal care.

---

## Shortfalls vs. Surpluses

**Shortfall (negative disruption):**
- Fewer services delivered than expected
- Shows missed opportunities
- Requires catch-up efforts

**Surplus (positive disruption):**
- More services delivered than expected
- Could indicate successful campaign, policy change, or data quality issue
- Need to verify if it's real or a reporting problem

**Example surplus:**
- Vaccination campaign reaches 5,000 children
- Expected only 3,000 based on normal patterns
- Surplus: +2,000 vaccinations (positive outcome!)

---

## Geographic Detail: National vs. Local

**FASTR analyzes disruptions at multiple levels:**

**National level:**
- Overall country trends
- Big picture of health system performance

**Provincial/regional level:**
- Which provinces are most affected?
- Are disruptions concentrated geographically?

**District level (optional):**
- Most detailed view
- Identifies specific districts needing support

**Why multiple levels?** National trends can mask local problems - one province might be fine while another suffers major disruptions.

---

## Example: National vs. Provincial View

**National ANC1 (March 2023):**
- Expected: 50,000 visits
- Actual: 48,000 visits
- Shortfall: -2,000 (4% below expected) - **looks minor**

**But breaking down by province:**

| Province | Expected | Actual | Shortfall |
|----------|----------|--------|-----------|
| North | 15,000 | 14,800 | -200 (1%) |
| South | 20,000 | 19,900 | -100 (0.5%) |
| **East** | **15,000** | **13,300** | **-1,700 (11%)** |

**East Province has a serious problem** that's hidden in the national average!

---

## Interpreting Disruption Results

---

## Key Questions to Ask

**1. Which services are most disrupted?**
- Maternal health? Child health? Specific diseases?
- Are all services affected equally or just certain ones?

**2. When did disruptions occur?**
- Can we link to known events (strikes, campaigns, outbreaks)?
- Are they one-time or ongoing?

**3. Where are disruptions concentrated?**
- Which geographic areas are most affected?
- Urban vs. rural patterns?

**4. How severe are the impacts?**
- How many people missed services?
- What's the percentage change?

---

## Using Results for Decision-Making

**For program managers:**

**Immediate actions:**
- Investigate cause of detected disruptions
- Plan catch-up services for areas with large shortfalls
- Allocate resources to most-affected areas

**Strategic planning:**
- Identify chronic problem areas needing system strengthening
- Evaluate impact of policies or reforms
- Set realistic targets based on actual patterns

**Monitoring:**
- Track whether interventions improve service delivery
- Early warning system for emerging problems

---

## For Data Analysts

**Analysis workflow:**

1. **Review disruption flags:** Which months/areas were flagged?
2. **Examine magnitude:** Are shortfalls large enough to act on?
3. **Check data quality:** Could this be a data reporting issue?
4. **Contextualize:** What events might explain the pattern?
5. **Communicate findings:** Create visualizations and key messages

**Key outputs to share:**
- Lists of disrupted periods by indicator and area
- Shortfall estimates (numbers and percentages)
- Time series graphs showing expected vs. actual
- Maps showing geographic distribution of disruptions

---

## Common Questions

---

## "How do you know what 'expected' should be?"

**We use your own historical data:**

- Look at past 2-3 years of data for each area
- Account for seasonal patterns (some months naturally higher/lower)
- Account for long-term trends (gradual increases/decreases)
- Each area has its own "normal" based on its own history

**Example:**
- Rural clinic's "normal": 50 deliveries/month
- Urban hospital's "normal": 500 deliveries/month
- Each compared to its own baseline, not to each other

---

## "What if services are always low - is that a disruption?"

**No - disruption means a CHANGE from the usual pattern.**

**If services have always been low:**
- That's a chronic access problem, not a disruption
- Important issue but requires different response (system strengthening)

**A disruption is:**
- Services that WERE at some level
- Then DROP (or increase) significantly
- Compared to their own baseline

**Both matter** - but disruption detection helps you spot new/emerging problems distinct from existing chronic issues.

---

## "Could this just be a reporting problem?"

**Yes, sometimes! That's why data quality work (Module 1-2) comes first.**

**FASTR helps distinguish:**

**Real service disruption:**
- Affects multiple related indicators (ANC, deliveries, postnatal all drop together)
- Matches known events (strike, outbreak, policy change)
- Persists across months
- Other data sources confirm

**Data quality issue:**
- Only one indicator affected while others normal
- No plausible explanation for drop
- Inconsistent with facility reports or surveys
- Returns to normal next month with no intervention

**Always cross-check with program knowledge and other data sources.**

---

## "What about normal seasonal variation?"

**FASTR accounts for this automatically.**

**Example - Malaria services:**
- Naturally higher during rainy season
- Lower during dry season
- This is NOT flagged as a disruption

**How it works:**
- Looks at seasonal patterns in historical data
- Expects higher malaria in rainy season
- Only flags if it's unusual EVEN accounting for the season

**Example:**
- April usually has 1,000 malaria cases (rainy season)
- This April has only 600 cases
- Flagged as disruption (low even for rainy season)

---

## Key Takeaways

---

## Remember These Points

**1. Disruptions are changes from expected patterns**
- Not about absolute levels, but deviations from normal
- Each area compared to its own baseline

**2. Two-part analysis**
- WHEN: Identify months with unusual patterns
- HOW MUCH: Quantify the impact (shortfalls/surpluses)

**3. Multiple perspectives matter**
- National trends can hide local problems
- Look at provincial and district levels

**4. Context is essential**
- Link disruptions to known events
- Cross-check with data quality assessments
- Verify with program staff and other data

**5. Use for action**
- Identify areas needing support
- Quantify catch-up service needs
- Monitor impact of interventions

---

## What's Next?

**Now that we can track service delivery patterns, we can ask:**

**Module 4: Coverage Estimation**
- What percentage of the population is being reached?
- Are we meeting coverage targets?
- Where are the biggest gaps?

**Coverage adds the population perspective** - not just how many services, but what proportion of people who need them are getting them.

---


# Tea Break

**15 minutes**

We'll resume at 10:45 AM

---


# Estimating Service Coverage

Understanding what percentage of people are being reached

---

## Why Estimate Coverage?

**Service numbers alone don't tell the full story:**

- Province A: 10,000 ANC visits
- Province B: 5,000 ANC visits

**Which is doing better?** We can't tell without knowing population size!

**If Province A has:**
- 20,000 pregnancies → 50% coverage (half of pregnant women reached)

**If Province B has:**
- 6,000 pregnancies → 83% coverage (most pregnant women reached)

**Coverage shows whether services are reaching their target population.**

---

## What Is Coverage?

**Coverage = Proportion of people who need a service and actually get it**

**Formula:**
```
Coverage = (Services Delivered / Target Population) × 100%
```

**Example - Vaccination Coverage:**
- 8,000 babies vaccinated (from DHIS2)
- 10,000 babies born (target population)
- **Coverage = 80%**

**This tells us:** 80% of babies are being vaccinated, 20% are being missed.

---

## The Coverage Challenge

**The hard part: How do we know the target population size?**

**For vaccinations, we need to know:**
- How many babies were born this year?

**For ANC, we need to know:**
- How many women are pregnant?

**These numbers aren't easy to get:**
- Birth registration incomplete
- Pregnancies hard to count
- Population estimates may be outdated

**FASTR uses multiple data sources to estimate these target populations.**

---

## Three Data Sources FASTR Combines

**1. DHIS2 Service Data (what we have from facilities)**
- Number of services delivered each month
- Already quality-checked and adjusted (from Modules 1-2)

**2. Household Surveys (DHS/MICS)**
- Every 3-5 years, surveys ask women about services received
- Provides validated coverage estimates
- But infrequent - what about years in between?

**3. Population Data (UN estimates)**
- Estimates of total population, births, children
- Available for every year
- But may not match local realities

**FASTR combines all three to fill gaps and validate estimates.**

---

## How FASTR Estimates Coverage

---

## Step 1: Estimate Target Population

**We need to know: How many people should have received this service?**

**FASTR uses two approaches:**

**Approach 1: Work backwards from surveys**
- Survey says 80% of pregnant women got ANC1
- DHIS2 says 10,000 women got ANC1
- Math: If 10,000 = 80%, then total pregnancies = 10,000 ÷ 0.80 = 12,500

**Approach 2: Use population projections**
- UN says 15,000 women of childbearing age in district
- Birth rate is 3%
- Expected pregnancies ≈ 15,000 × 0.03 = 450 per year

**FASTR compares both methods and chooses the one that matches surveys best.**

---

## Why Different Target Populations?

**Not all services target the same group:**

**Pregnancies (for ANC):**
- Live births + stillbirths + pregnancy loss

**Births (for delivery services):**
- Live births + stillbirths

**Infants (for vaccinations):**
- Live births - infant deaths

**FASTR adjusts the calculations for each indicator's specific target group.**

---

## Step 2: Calculate Coverage

**Once we know target population:**

**Coverage = (Services from DHIS2 / Target Population) × 100%**

**Example - Penta3 Vaccination:**
- DHIS2: 9,500 children received Penta3
- Target: 12,000 surviving infants
- **Coverage = 79%**

**Simple math, but the challenge is getting the target population right!**

---

## Step 3: Validate Against Surveys

**How do we know our coverage estimate is correct?**

**Compare to survey data:**

| Year | FASTR Estimate | Survey Estimate | Match? |
|------|----------------|-----------------|--------|
| 2019 | 76% | 78% | ✓ Close |
| 2020 | 79% | - | - |
| 2021 | 82% | 81% | ✓ Close |

**If FASTR estimates match surveys:** We can trust estimates for non-survey years (like 2020)

**If they don't match:** Need to adjust our method or check data quality

---

## Filling Gaps Between Surveys

**Problem:** Surveys only every 3-5 years. What about in between?

**Solution:** Use trends from DHIS2 data to fill gaps

**Example - ANC4 Coverage:**

| Year | Survey | DHIS2-based | FASTR Final Estimate |
|------|--------|-------------|---------------------|
| 2018 | - | 65% | 65% |
| **2019** | **70%** | 68% | **70% (survey)** |
| 2020 | - | 72% | **72%** (follow DHIS2 trend) |
| 2021 | - | 74% | **74%** (follow DHIS2 trend) |
| **2022** | **75%** | 76% | **75% (survey)** |

**FASTR tracks the direction of change from DHIS2** while anchoring to validated survey points.

---

## Geographic Detail

**FASTR estimates coverage at multiple levels:**

**National:**
- Overall country coverage
- Are we meeting national targets (e.g., 90% vaccination)?

**Provincial/Regional:**
- Which areas have highest/lowest coverage?
- Where are the equity gaps?

**District (where data permits):**
- Most detailed view for targeting interventions

**Challenge:** Surveys often don't have enough data for reliable district estimates, so some detailed coverage may only be available for certain indicators.

---

## Interpreting Coverage Estimates

---

## Key Questions to Ask

**1. What is the coverage level?**
- Are we meeting targets (e.g., 90% for immunization)?
- Which services have highest/lowest coverage?

**2. What are the trends?**
- Is coverage increasing, stable, or declining?
- Are we making progress toward goals?

**3. Where are the gaps?**
- Which areas have lowest coverage?
- Urban vs. rural differences?
- Which populations are being missed?

**4. How does DHIS2 compare to surveys?**
- If very different, might indicate data quality issues
- Or suggest denominator problems

---

## Coverage vs. Service Volume

**Important: These tell different stories!**

**Service Volume (from Module 3):**
- **Question:** How many services were delivered?
- **Example:** 10,000 ANC visits
- **Use:** Operations, detecting disruptions

**Coverage:**
- **Question:** What % of people who need it got the service?
- **Example:** 75% of pregnant women got ANC
- **Use:** Equity, progress toward targets

**Both matter - you need both perspectives for complete picture.**

---

## Real Example: Coverage vs. Volume

**District X - Immunization:**

**2020:**
- Volume: 5,000 children vaccinated
- Population: 6,000 infants
- **Coverage: 83%**

**2021:**
- Volume: 5,500 children vaccinated (+10% increase!)
- Population: 7,500 infants (population grew)
- **Coverage: 73%** (dropped!)

**Service volume increased, but coverage decreased because population grew faster than services expanded.**

**Coverage reveals the problem that volume alone missed.**

---

## Using Coverage for Decision-Making

---

## For Program Managers

**Strategic planning:**
- **Low coverage areas:** Need service expansion or outreach
- **High coverage:** Can be models for others
- **Declining coverage despite stable volume:** Population growing faster than services

**Resource allocation:**
- Target resources to low-coverage areas
- Account for population size when distributing supplies

**Target setting:**
- Set realistic targets based on historical trends
- Track progress toward national/global goals (SDGs, Gavi targets)

---

## For Equity Analysis

**Coverage reveals who's being left behind:**

**Compare across:**
- Urban vs. rural areas
- Rich vs. poor regions
- Different geographic zones

**Example - ANC Coverage:**
- Urban province: 90% coverage
- Rural province: 65% coverage
- **Equity gap: 25 percentage points**

**This identifies where to focus equity interventions.**

---

## Common Questions

---

## "Why are there different coverage estimates?"

**You might see:**
- FASTR estimates from DHIS2
- Survey estimates (DHS/MICS)
- Projected estimates
- Administrative targets

**All are useful but measure different things:**

**Surveys:** Most accurate, but infrequent
**FASTR DHIS2-based:** Timely, continuous, but depends on data quality
**Projected:** Fills gaps, but assumes trends continue
**Targets:** Aspirational goals, not measurements

**Best practice:** Look at all together and understand strengths/limits of each.

---

## "What if coverage is over 100%?"

**This happens sometimes! Possible reasons:**

**1. Population estimate too low**
- Actual population bigger than estimated
- Migration not accounted for
- Population data outdated

**2. Services reaching people from outside**
- Referral hospital serving multiple districts
- People crossing borders for better services

**3. Data quality issues**
- Over-reporting in DHIS2
- Duplicates counted

**What to do:** Investigate the cause, adjust denominators or data as appropriate.

---

## "How accurate are these estimates?"

**Honest answer: They're estimates, not perfect measurements.**

**Factors affecting accuracy:**
- DHIS2 data quality (checked in Modules 1-2)
- Population estimates may not match reality
- Survey data has sampling error
- Assumptions in calculations

**How to build confidence:**
- Compare DHIS2 to surveys - should be reasonably close
- Check if trends make sense with program knowledge
- Look for consistency across related indicators
- Validate with local program staff

**Use estimates for understanding trends and patterns, not exact percentages.**

---

## "Can we trust estimates for areas with bad data quality?"

**It depends on HOW bad:**

**If data quality is moderate:**
- Coverage trends still useful
- Exact numbers less certain
- Focus on direction of change

**If data quality is very poor:**
- Coverage estimates highly uncertain
- Be transparent about limitations
- Focus on improving data quality first

**Always:**
- Check Module 1-2 data quality scores
- Report quality caveats with coverage estimates
- Use multiple data sources to cross-validate

---

## Key Takeaways

---

## Remember These Points

**1. Coverage shows population reach**
- Not just how many services, but what % of people who need them
- Essential for equity and progress monitoring

**2. Requires knowing target population**
- This is the hard part - who needs the service?
- FASTR uses multiple methods and validates against surveys

**3. Combines three data sources**
- DHIS2 (timely but needs quality checking)
- Surveys (accurate but infrequent)
- Population data (always available but may be outdated)

**4. Fills gaps between surveys**
- Uses DHIS2 trends to estimate coverage for non-survey years
- Anchored to validated survey points

**5. Geographic detail reveals equity gaps**
- National averages can hide local problems
- District-level analysis identifies where to target interventions

---

## Using All Four Modules Together

---

## The Complete FASTR Picture

**Module 1: Data Quality Assessment**
- Are the numbers reliable?
- Which areas have good/poor data?

**Module 2: Data Quality Adjustments**
- Fix what we can statistically
- Provide clean data for analysis

**Module 3: Service Utilization**
- How many services delivered?
- When were there disruptions?
- How big were the shortfalls?

**Module 4: Coverage Estimation**
- What % of the population is reached?
- Are we meeting targets?
- Where are the equity gaps?

---

## Example: Using All Modules for ANC

**Module 1-2:** Data quality for ANC indicators
- Check completeness, outliers, consistency
- Adjust data as needed

**Module 3:** ANC service trends
- Detect disruptions in ANC delivery
- Quantify shortfalls during COVID-19

**Module 4:** ANC coverage
- Estimate % of pregnant women getting ANC1 and ANC4
- Compare across regions
- Track progress toward 90% ANC4 target

**Together:** Complete picture of ANC service delivery and population coverage

---

## What This Enables

**Quarterly monitoring:**
- Regular updates on service delivery and coverage
- Early detection of problems
- Timely course corrections

**Evidence-based decisions:**
- Know where to focus resources
- Identify equity gaps
- Set realistic targets

**Accountability:**
- Track progress toward goals
- Show impact of interventions
- Transparent reporting with quality caveats

**Continuous improvement:**
- Data quality feedback loops
- Learn what works where
- Adapt strategies based on evidence

---

## Final Takeaway

**FASTR transforms routine facility data into actionable intelligence:**

✓ Systematic data quality assessment
✓ Statistical adjustments where appropriate
✓ Disruption detection and quantification
✓ Population coverage estimation
✓ Multi-level geographic analysis
✓ Quarterly monitoring capability

<br>

>**Result:**
>Better information → Better decisions → Better health outcomes

---


# Thank You!

## Questions & Discussion

---

# Contact Information

**FASTR Team**

📧 Email: fastr@example.org
🌐 Website: https://fastr.org

---

