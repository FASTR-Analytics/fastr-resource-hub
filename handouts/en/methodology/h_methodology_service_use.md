---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Methodology recap · Service utilization"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Methodology recap · Module M3</span>

# Service utilization

<p class="meta-line"><strong>What the module does</strong> · <strong>How to read its outputs</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">What it does</p>

This module looks at whether health services are going **up, down, or holding steady** — and, crucially, whether a change is a **real disruption** or just normal monthly noise.

<p class="sb-label">The question it answers</p>

*"Did something actually disrupt services here, or is this just the usual ups and downs?"*

<p class="sb-label">Built on clean data</p>

It runs on the **adjusted** data from the previous module, so outliers and missing months don't create false alarms.

</aside>
<div class="p1-main">

## How it works

You can't judge a disruption by comparing one month to the last — services naturally rise and fall with the seasons and drift over the years. So for each facility (or area) and indicator, FASTR first builds an **expected** level: a line that already accounts for the long-term trend **and** the seasonal pattern.

Then it compares the **actual** reported value to that expected line. A month is flagged as a disruption when the actual strays too far from expected:

- a **sharp** drop or spike in a single month
- a **sustained** dip or surge that lasts several months
- a **run of missing** reports

Finally, a regression measures **how big** the disruption was — the average % below or above expected — and whether it's statistically real rather than chance. That's what lets you say *"ANC1 ran about 15% below expected from March to July."*

<div class="callout-footer">The skill is the comparison: not "is this number high?" but "is it higher or lower than we'd expect for this place, this service, this time of year?"</div>

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">How it works · visually</span>

## Spotting a disruption

![The observed line vs the expected line: where observed runs above it's a surplus, where it runs below it's a disruption w:100%](../../../resources/diagrams/disruption_chart_annotated.svg)

The shaded gap is the distance between what actually happened and what FASTR expected — green above the line, red below.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Output 1 · the trend</span>

## Actual vs expected — spotting disruptions

![Comparing reported service use to expected trends: line charts per indicator, with shaded areas where actual breaks from expected w:100%](../../../resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

- **What it shows** — one panel per indicator. The **black line** is the actual reported volume each month. Behind it sits the **expected** level FASTR computed for that area — a path that already builds in the long-term trend *and* the seasonal pattern, so "expected" means *normal for this place, this service, this time of year*. Where actual and expected pull apart, the gap is shaded: **green** when actual runs above expected (a surplus), **red** when it runs below (a disruption)
- **How to read it** — in three passes. **(1) Shape:** follow the black line for the overall trajectory — rising, flat, or falling across the years. **(2) Breaks:** scan for shaded patches; each is a stretch where reality left the expected path, and the **bigger and longer** the patch, the more serious — a deep red block over several months is a sustained disruption, a thin sliver is minor. **(3) Across indicators:** if red appears in the *same* months on several panels, something hit the whole system (a strike, a stock-out, a shock); red on one panel only points to a cause specific to that service

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Output 1 · the trend (continued)</span>

- **Watch for** — a single odd month is usually noise; wait for a sustained run before acting. Green isn't automatically good (it can be a catch-up campaign or double-counting) and red isn't automatically bad — both deserve a "why?". Line the red patches up against known events (funding cuts, elections, epidemic waves) to move from "something changed" to "this is what changed it"

<div class="callout-footer">Worked example — in the <strong>Antenatal 4th visit</strong> panel, the green block across 2020–2021 is a long stretch where visits ran above the expected line. The small red marks near 2019 are short, one-off dips — not a sustained disruption.</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Output 2 · the size</span>

## Year-on-year change — how much moved

![Service volume by year and year-on-year change: bars per indicator per year, colored for large jumps or drops w:100%](../../../resources/default_outputs/Module3_1_Change_in_service_volume.png)

- **What it shows** — each indicator's **total annual volume** as bars across the years, with the year-on-year change labeled. A bar turns **green** when volume rose more than 10% on the year before, **red** when it fell more than 10%, and stays grey when it held roughly steady
- **How to read it** — this is the bird's-eye companion to the trend chart: that one shows *within-year* timing, this shows *between-year* magnitude. Read across a row to see whether a service is growing, shrinking, or stable, and read the labeled % on any colored bar to size the move. A **red bar in the most recent year** is the one to act on — the service ended the period materially lower than it started
- **Why you can trust it** — it's built on the adjusted data, so a red bar is a real fall in services, not an artefact of a missing month or a removed spike

<div class="callout-footer">Worked example — <strong>Antenatal 1st visit ends 2025 at −13.6%</strong> (red): it finished the period well below the year before. An earlier green bar (+19.5%) was a rebound; the recent red is the one to act on. Together, the trend chart shows <em>when and where</em> services broke from expectation, and this one shows <em>how much</em> they moved.</div>
