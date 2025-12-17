---
marp: true
theme: fastr
paginate: true
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

## Projecting Forward from Surveys

**Problem:** Surveys only every 3-5 years. What's happened since the last survey?

**Solution:** Project forward from the last survey using HMIS trends

**How it works:**
1. **Anchor** to the most recent survey value (baseline)
2. **Calculate deltas** (year-on-year changes) from HMIS coverage data
3. **Project forward:** New estimate = Survey value + cumulative HMIS change

**Example - ANC4 Coverage:**

| Year | Survey | HMIS Coverage | HMIS Delta | Projected |
|------|--------|---------------|------------|-----------|
| 2019 | **68%** | 65% | - | **68%** (anchor) |
| 2020 | - | 67% | +2% | **70%** (68 + 2) |
| 2021 | - | 70% | +3% | **73%** (68 + 5) |
| 2022 | - | 72% | +2% | **75%** (68 + 7) |

**Key insight:** FASTR uses HMIS to track the *direction and magnitude of change*, anchored to validated survey data.

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

**4. Projects forward from surveys**
- Uses HMIS trends to project coverage beyond the last survey
- Anchored to validated survey baseline, tracks direction of change

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
