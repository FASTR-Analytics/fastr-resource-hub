---
marp: true
theme: fastr-handout
paginate: true
footer: "FASTR · Instance Setup"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Verify and explore your setup

<p class="meta-line"><strong>Activity</strong> · <strong>Instance Setup</strong> · <strong>~10 min</strong></p>

## Before you start

- ☐ You've completed all four previous handouts (connect / facilities / indicators / data)

## What you'll do

Spot-check your imported data, learn how to navigate the chart explorer, and confirm everything's ready for analysis modules.

## Checks

### 1. View imported data as a chart

On the **HMIS Data** page, your indicators appear as time series. The left panel lists every indicator you imported.

![h:200](../../../resources/screenshots/m9a_setup/16_chart_imported.jpeg)

### 2. Toggle indicators on the chart

In the left panel, **check/uncheck** indicators to show or hide them. Useful when comparing two or three at a time without clutter.

### 3. Adjust the y-axis scale

Use the **Scale** slider at the bottom to switch between linear and a wider Y-axis when one indicator dominates the others.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 4. Spot-check a known value

Pick one period (e.g., last month) and one facility you know well. Mentally compare the FASTR-reported value against what you'd expect from your DHIS2 dashboards.

> If they match → you're good. If they're way off → check your indicator mapping (most common cause) before running any analyses.

### 5. Review import history

Click **View previous imports** to see every import that's been run — date, source, rows inserted/updated. Useful for tracking what's loaded and when.

![h:200](../../../resources/screenshots/m9a_setup/17_previous_imports.jpeg)

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
