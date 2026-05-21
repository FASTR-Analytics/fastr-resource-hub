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

- **Filter = show less.** Narrow the chart to a slice and hide the rest — e.g. *only ANC1*, *only Northern region*, *only the last 12 months*. Like a spotlight: you keep one thing, the rest disappears.
- **Disaggregate = break it down.** Split one total into its parts so you can compare them on the same chart — e.g. *one line per indicator*, or *one line per district*. Nothing is hidden; the total is shown as its pieces.

> **Example.** Start with *total ANC1 visits, nationally*. **Filter** to "Northern region" → you now see only Northern's ANC1. **Disaggregate** "by district" → you see one line per district, side by side.

In the builder, the ready presets pick sensible breakdowns for you. If you go **Custom**, the *Disaggregate by* options (Indicator, Admin area) are where you choose how the data splits.

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
