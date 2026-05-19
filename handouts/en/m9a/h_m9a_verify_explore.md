---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Instance Setup"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Facility structure</span> <span class="arrow">→</span> <span class="step done">Indicators</span> <span class="arrow">→</span> <span class="step done">Data</span> <span class="arrow">→</span> <span class="step current">Verify</span></div>

# Verify and explore your setup

<p class="meta-line"><strong>Instance Setup</strong> · <strong>~10 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Before you start</p>

- ☐ You've completed all four previous handouts (connect / facilities / indicators / data)

</aside>
<div class="p1-main">

## What you'll do

Spot-check your imported data, learn how to navigate the chart explorer, and confirm everything's ready for analysis modules.

<h2 class="step-h"><span class="step-n">1</span><span>View imported data as a chart</span></h2>

On the **HMIS Data** page, your indicators appear as time series. The left panel lists every indicator you imported.

![h:200](../../../resources/screenshots/m9a_setup/16_chart_imported.jpeg)

<h2 class="step-h"><span class="step-n">2</span><span>Toggle indicators on the chart</span></h2>

In the left panel, **check/uncheck** indicators to show or hide them. Useful when comparing two or three at a time without clutter.

<h2 class="step-h"><span class="step-n">3</span><span>Adjust the y-axis scale</span></h2>

Use the **Scale** slider at the bottom to switch between linear and a wider Y-axis when one indicator dominates the others.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">4</span><span>Spot-check a known value</span></h2>

Pick one period (e.g., last month) and one facility you know well. Mentally compare the FASTR-reported value against what you'd expect from your DHIS2 dashboards.

> If they match → you're good. If they're way off → check your indicator mapping (most common cause) before running any analyses.

<h2 class="step-h"><span class="step-n">5</span><span>Review import history</span></h2>

Click **View previous imports** to see every import that's been run — date, source, rows inserted/updated. Useful for tracking what's loaded and when.

![h:200](../../../resources/screenshots/m9a_setup/17_previous_imports.jpeg)

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Checkpoint

Back on the **Data** page, you should now have:

- ✓ Admin units and facilities (green)
- ✓ Indicators (mapped)
- ✓ HMIS data (loaded with values flowing through time)

You're ready to run analysis modules — data quality, service utilization, coverage estimation, etc.

## What could go wrong

- **All values look flat / zero** — the period range may not overlap with when DHIS2 has data. Check your time range and re-import.
- **Some indicators appear, others don't** — mapping was incomplete. Go back to the indicators page and verify every DHIS2 indicator has a common-indicator link.
- **Chart won't load** — try a different browser; FASTR's charts use modern web features that older browsers may not handle.

> 🔎 **Verify in your current UI**: chart controls and panel layout may differ from the screenshots; the flow is the same.

## What's next

Setup complete. Move on to **Getting Started** (M9b) to learn the platform interface in depth, or jump to running your first analysis module.
