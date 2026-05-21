---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Visualizations & Interpretation"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Reading a viz</span> <span class="arrow">→</span> <span class="step current">Build manually</span> <span class="arrow">→</span> <span class="step">Build with AI</span> <span class="arrow">→</span> <span class="step">Write interpretation</span> <span class="arrow">→</span> <span class="step">AI interpretation</span> <span class="arrow">→</span> <span class="step">Spot disruption</span></div>

# Create your first visualization

<p class="meta-line"><strong>Activity</strong> · <strong>Visualizations & Interpretation</strong> · <strong>~15 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Before you start</p>

- ☐ You're signed in and looking at your country's project
- ☐ You're in the **Visualizations** tab
- ☐ You have a folder of your own (or you can use the shared one)

</aside>
<div class="p1-main">

## What you'll do

Create your first chart using the built-in builder: pick a **metric**, choose a **ready-made chart**, and it's saved to the project. You'll click through the builder yourself; the next activity does the same with the AI Assistant.

<h2 class="step-h"><span class="step-n">1</span><span>Open the visualization builder</span></h2>

In the Visualizations tab, click **+ Create visualization**. A three-step builder opens: **Metric → Presets → Configure**.

![The "+ Create visualization" button h:34](../../../resources/screenshots/m9c/new_viz_button.png)

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Pick a metric</span></h2>

Metrics are grouped by module on the left (M1. Data quality, M3. Service utilization, M4. Coverage…). A metric is **what is measured** — e.g. *Number of services reported*, *Actual vs expected service volume*, *Coverage*.

For a service-volume trend, open **M3. Service utilization** and pick a metric such as **Number of services reported**. Click **Next**.

<h2 class="step-h"><span class="step-n">3</span><span>Choose a ready-made chart</span></h2>

You'll see a grid of **presets** — ready-made charts. Choose **Service volume over time (monthly)** — a line chart of monthly volume by indicator. Click **Create**.

Your chart is created and appears in the **Visualizations** list. Use the **By folder** view to drop it into your folder.

> The other presets give quarterly or annual **bar** charts. **Custom → Configure manually** lets you choose the chart type (table, time series, bar, map) and how to break the data down — see the next section.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Filter vs disaggregate — what's the difference?

These two words come up a lot. They are not the same:

- **Filter = pick what to show.** Choose the indicators, places, or months you want — only those appear. e.g. *show ANC1 only*, or *Northern region only*. Like a spotlight: you point it at what you want to see.
- **Disaggregate = break it down.** Split one total into its parts so you can compare them — e.g. *one line per indicator*, or *one bar per district*. Nothing is hidden; the total is shown as its pieces.

![Filter = choose what to show: tick ANC1, and only ANC1 appears h:140](../../../resources/diagrams/m9c_filter.svg)

![Disaggregate "ANC1 by district" shown four ways — Lines, Grid, Rows, Columns h:195](../../../resources/diagrams/m9c_disaggregate.svg)

> **Example.** Start with *total ANC1 visits, nationally*. **Filter** to "Northern region" → now you see only Northern's ANC1. **Disaggregate** "by district" → the same total split into one bar (or line) per district.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Where you do this when you edit a viz

Open a saved visualization — the controls live in the **left panel**, and you'll often need to **scroll down** to find them (this is where people get lost). Two sections do the work:

- **Filter (subset)** — **pick what you want to see**: set the time period, and tick the indicator(s) you want. Only what you tick appears.
- **Display (disaggregate)** — choose **how the parts are shown**. The dropdown gives four options:
  - **Lines** — one line per part, all on the same chart
  - **Grid** — a separate little chart for each part, side by side
  - **Rows** — one table row per part
  - **Columns** — one table column per part

![The viz editor's left panel — scroll to find "Filter (subset)" and "Display (disaggregate)" h:400](../../../resources/screenshots/m9c/edit_viz_panel.png)

> **Watch out when you use both together.** Here's the trap, with an example. You split a chart **by district** because you want to compare the districts. Then you **filter** it down to just one district — so the others disappear. Now you're looking at a single district on its own, and there's nothing left to compare.
>
> **The simple rule:** use **filter** to pick the data you want to look at, and use **disaggregate** to split it into the parts you want to compare. Just don't filter down to only one of the things you wanted to compare.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Try a few options

Repeat with a different metric or preset — a coverage metric under **M4**, or the quarterly-change bar chart — to see how each reads.

> **Tip:** Line charts (*Service volume over time*) are best for trends over time. Bar charts (*quarterly / annual change*) are better for comparing periods or places. The reference handout *How to read a FASTR visualization* goes deeper.

## Check yourself

You should now have:

- At least one chart created and visible in your **Visualizations** list
- The path in muscle memory: **+ Create visualization → Metric → Presets → Create**
- A sense of which presets suit trends vs comparisons

## What's next

The next activity does the same thing using the AI Assistant — typing a request in plain language instead of clicking through the builder. Same end result, different path.

> 🔎 **Verify in your current UI**: labels (*+ Create visualization*, *Create*) may differ slightly. The **Metric → Presets → Create** path is the key structure.
