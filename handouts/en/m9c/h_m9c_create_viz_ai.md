---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Visualizations & Interpretation"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Reading a viz</span> <span class="arrow">→</span> <span class="step done">Build manually</span> <span class="arrow">→</span> <span class="step current">Build with AI</span> <span class="arrow">→</span> <span class="step">Write interpretation</span> <span class="arrow">→</span> <span class="step">AI interpretation</span> <span class="arrow">→</span> <span class="step">Spot disruption</span></div>

# Build a visualization with the AI Assistant

<p class="meta-line"><strong>Activity</strong> · <strong>Visualizations & Interpretation</strong> · <strong>~15 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Before you start</p>

- ☐ You've built at least one chart manually (previous handout)
- ☐ You're signed in and your folder is open
- ☐ You know which indicator you want to chart (ANC1, Penta3, …)

</aside>
<div class="p1-main">

## What you'll do

Get the AI Assistant to create the same kind of chart you just built manually — but by typing a request in plain language. Same end result, different path.

<h2 class="step-h"><span class="step-n">1</span><span>Open the AI Assistant</span></h2>

In the **Visualizations** tab, open the AI chat panel (right side of the screen). Type a short request like:

> *"Show me a time-series chart of ANC1 visits over the last 12 months, using the adjusted data."*

**Adjusted data** = data corrected for missing reports (completeness) and extreme values (outliers). It's the cleaner version of your country's data.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<h2 class="step-h"><span class="step-n">2</span><span>Review what the AI returns</span></h2>

The AI proposes a chart with the indicator, period, and chart type it inferred. **Check it against what you asked for:**

- Right indicator? Right period?
- Line chart (for trends) or something else? Did it pick what makes sense?
- Adjusted vs raw — did it use the version you asked for?

If anything is off, **say so in plain language**: *"Use raw data instead"* or *"Switch to a bar chart"*.

<h2 class="step-h"><span class="step-n">3</span><span>Iterate</span></h2>

Don't expect the first answer to be perfect. Refine in short turns:

- *"Break it down by region."*
- *"Add Penta3 on the same axis."*
- *"Show only the last 6 months."*

Each instruction is a small step. The AI updates the chart and you keep going.

<h2 class="step-h"><span class="step-n">4</span><span>Save it</span></h2>

When you like what you see, click **Save** and put it in your folder. Give it a clear name (the AI may suggest one — feel free to keep or rename).

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Try it with three indicators

Run the same flow with three different indicators — pick from different programmes (ANC, immunisation, delivery). You'll get a feel for how the AI interprets short requests.

## Manual vs AI — when to use which

- **Manual** when you know exactly what you want and clicking is faster than typing.
- **AI** when you want to explore — *"show me something useful about X"* — or when you don't remember the exact filter names.

> The AI is an accelerator, not a replacement. You're still the one who decides whether the chart answers your question.

## What's next

The next handout is about **writing the interpretation** — the text that goes next to your chart on a slide. Use the six-step framework from the *Reading a viz* reference.

> 🔎 **Verify in your current UI**: button labels and the AI chat layout may differ slightly. The flow (ask → review → iterate → save) is the same.
