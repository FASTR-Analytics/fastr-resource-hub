---
marp: true
theme: fastr
paginate: true
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
