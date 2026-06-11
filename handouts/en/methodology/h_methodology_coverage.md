---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Methodology recap · Coverage estimates"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Methodology recap · Modules M5 + M6</span>

# Coverage estimates

<p class="meta-line"><strong>What the modules do</strong> · <strong>How to read the output</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">What they do</p>

Turn raw service counts into **coverage** — the share of the people who *needed* a service who actually received it.

<p class="sb-label">Two parts</p>

- **M5** works out the **target population** (the hard part)
- **M6** turns it into coverage and fills the years between surveys

<p class="sb-label">Keep in mind</p>

These are **estimates from routine data** — good for trends and comparison, not official national figures.

</aside>
<div class="p1-main">

## What "coverage" means

Coverage answers one simple question: **of all the people who needed a service, what share actually got it?**

Take first antenatal visits (ANC1). If **10,000** women were pregnant in a district and **8,000** of them had an ANC1 visit, then coverage is 8,000 ÷ 10,000 = **80%**.

So coverage is always a fraction:

> **coverage = the number served ÷ the number who needed it**

![Service coverage = the population who received the service, over the target population who needed it w:100%](../../../resources/diagrams/coverage_equation.svg)

## The catch

The **top** number is easy — the 8,000 ANC1 visits come straight from HMIS; it's just the service count.

The **bottom** number is the hard part: **nobody counts how many pregnant women (or infants) there are.** No facility files a report saying "10,000 women were pregnant here this year."

So the whole job of these modules comes down to one question — **where do we get that bottom number, the target population?** That is what M5 sets out to estimate.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">M5 · estimating the population</span>

## How M5 finds the bottom number

**Step 1 — borrow it from a survey.** Every few years a household survey measures coverage *directly*, by interviewing families. It can tell us that, say, **80% of pregnant women got ANC1**. Now combine that with the count we already have: if the **8,000** ANC1 visits are 80% of all pregnant women, then the total is 8,000 ÷ 0.80 = **10,000 pregnant women**. We've recovered the bottom number we couldn't count.

**Step 2 — adjust it to the right group.** 10,000 pregnant women is the right denominator for antenatal care — but **Penta1 is given to infants**, a different group. We don't need a second survey: a pregnancy *becomes* a birth *becomes* an infant, and we know roughly how many are lost at each stage. So FASTR steps the number down — minus miscarriages and stillbirths, minus newborn deaths — to about **9,100 infants**. One survey now gives the denominator for *every* indicator.

**Step 3 — cross-check, and pick the best.** ANC1 isn't the only place to start; deliveries, Penta1 and BCG each give their own estimate of the population, and they won't all agree. To choose, FASTR lines each estimate up against the **UN population projection** — an independent figure built without HMIS — and keeps the one that comes closest.

<div class="callout-footer">Coverage is only as good as its denominator. That's why M5 doesn't trust one indicator — it triangulates several and lets the independent UN projection break the tie.</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">M5 · the chain of life (step 2)</span>

## From pregnancies to infants

![The chain of life: pregnancies, minus losses at each stage, become deliveries, births, live births, and finally infants eligible for vaccines w:100%](../../../resources/diagrams/denominator_cascade.svg)

The **teal arrows** step *forward* — each applies one standard demographic rate (subtracting losses at that stage). The **red arrows run backward**: the same rates let you **back-calculate** the chain from any point, so FASTR can start from whichever indicator has a survey (ANC1, delivery, Penta1…) and still reach every other target population.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">M6 · the output</span>

## Coverage over time

Now the easy part: **coverage = HMIS count ÷ that population**, every indicator, year and area. Surveys come only every few years, so between them FASTR holds the last survey value and shifts it by however much HMIS coverage has moved — the survey sets the **level**, HMIS the **direction**.

![Coverage estimates over time for one indicator: an HMIS line, survey points, and a projected line w:100%](../../../resources/default_outputs/Module4_1_Coverage_HMIS_National.png)

- **The lines** — **grey** = HMIS coverage (count ÷ estimated population), every year, labelled *Administrative data* in the platform; **black** = actual survey results (MICS/DHS), labelled *Survey-based estimate*; **red** = the survey level projected forward on the HMIS trend where no survey exists, labelled *Projected estimate*
- **How to read it** — where the grey HMIS line and the black survey points sit close, the denominator is sound and the trend is trustworthy; then read the direction — rising, flat, or slipping
- **Watch for** — coverage **above 100%** is a warning sign (denominator too low or count inflated), not real over-coverage

<div class="callout-footer">The same chart is produced at national, region and district level — read them together: a healthy national trend can still hide a struggling district.</div>
