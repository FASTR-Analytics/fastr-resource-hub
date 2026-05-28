---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Methodology recap · Data quality adjustment"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Methodology recap · Module M2</span>

# Data quality adjustment

<p class="meta-line"><strong>What the module does</strong> · <strong>How to read its outputs</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">What it does</p>

This module **repairs** the problems the previous one found. It fills the missing months and replaces the outlier spikes, so that trends and coverage aren't thrown off by a few bad numbers.

<p class="sb-label">What it does not do</p>

It never invents a trend. Every replacement comes from the facility's **own history**, and data that passed the quality checks is left exactly as reported.

<p class="sb-label">Four versions</p>

It saves the data four ways — **unadjusted**, **outliers fixed**, **gaps filled**, and **both** — so you can always see exactly what changed.

</aside>
<div class="p1-main">

## How the fix works

When the previous module flags a month as an **outlier** or **missing**, FASTR replaces just that one value — using the facility's **own surrounding months**, never numbers borrowed from another facility. It works down a short ladder and takes the first option the facility's history allows:

1. **The months right around it** — the average of the months on either side of the flagged one. This is the normal case: the facility's own level at that point in time
2. **If the flagged month sits at the very start or end of the records** — there aren't enough months on *both* sides, so FASTR uses whichever side has data: the **6 months just after** (when the gap is near the beginning) or the **6 just before** (when it's near the end)
3. **For an outlier only — the same month a year earlier** — for seasonal services, this matches like with like (a December to a December)
4. **If none of those exist** — the facility's **overall average** for that indicator

Months that passed the quality checks are left exactly as reported, so the real shape of activity is preserved.

**Some indicators are never adjusted:** deaths and stillbirths (every case matters and must not be smoothed away), and very low-volume indicators — those that never reach 100 in a month, where there is too little signal to estimate from. These keep their raw values.

<div class="callout-footer">Adjustment fills and smooths using each facility's own history — it never borrows from other facilities and never invents a trend.</div>

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">What the fix does</span>

## A spike, replaced — the trend kept

![Before and after: a single outlier spike is replaced by the average of nearby months, and the underlying trend is preserved w:100%](../../../resources/diagrams/why_adjust_outliers.svg)

Each flagged value is swapped for the facility's own normal level, so the spike disappears but the real shape of activity stays intact.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">The output</span>

## How much did the data change?

![Percent change in volume due to outlier adjustment: a table of districts by indicator, each cell colored green, gold or red w:100%](../../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

- **What each cell is** — pick a district (a row) and an indicator (a column). The number is how much that indicator's total **changed** once the suspicious spikes were removed. 0% = nothing needed fixing; a big number = big spikes were taken out
- **How to read it** — **green = the raw data was already clean; red = it needed a lot of correcting.** A red cell is a warning that the *raw* total there was inflated and would have overstated activity

<div class="callout-footer">Worked example — <strong>Karene District → Family planning (long-acting): 5.7%, red</strong> means fixing outliers cut that indicator's total by about 6% there; without the fix you'd have over-counted those services. A big correction isn't a failure — it's a sign the raw data would have misled you, and now won't.</div>

The platform also produces this table for **gaps filled** and for **both fixes together** — compare them to see whether spikes or missing months mattered more in an area.
