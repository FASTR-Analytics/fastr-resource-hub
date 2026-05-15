---
marp: true
theme: fastr-handout
paginate: true
footer: "FASTR · Visualizations & Interpretation"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step current">Reading a viz</span> <span class="arrow">→</span> <span class="step">Build manually</span> <span class="arrow">→</span> <span class="step">Build with AI</span> <span class="arrow">→</span> <span class="step">Write interpretation</span> <span class="arrow">→</span> <span class="step">AI interpretation</span> <span class="arrow">→</span> <span class="step">Spot disruption</span></div>

# How to read a FASTR visualization

<p class="meta-line"><strong>Reference</strong> · <strong>Visualizations & Interpretation</strong> · <strong>~10 min</strong></p>

## What this handout is

A short reference you'll use over and over. A chart is a question rendered as a picture — before you build one, or ask the AI for one, you need to be able to *read* one. Otherwise you can't tell whether what came back actually answers your question.

Keep this handout next to you during the next activities.

## The six-step framework

Use this every time you open a chart, whether you built it or someone else did:

| Step | Ask yourself |
|------|--------------|
| **1. What indicator?** | What health metric is shown? (ANC1, ANC4, vaccination coverage, …) |
| **2. What level & period?** | National, regional, district, facility? What time range? |
| **3. What is being compared?** | Actual vs. expected? District vs. district? Change over time? |
| **4. Read the values** | What's the magnitude — high, low, changing? |
| **5. What stands out?** | Trends, gaps, spikes, disruptions, anomalies |
| **6. So what?** | What does this mean for service delivery? What action would it prompt? |

> **Tip:** Always check the legend, axis labels, and any footnotes *before* you start interpreting. Misreading the y-axis is the single most common mistake.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Choosing the right chart type

Different questions call for different charts. Two patterns cover most FASTR outputs:

- **Line chart** — best for **trends over time**. One or two indicators, monthly values. Easy to see direction.
- **Heatmap** — best for **comparing many places at once**. Districts × indicators in one view. Easy to spot which places are off-pattern.

| When you want to see… | Use |
|------------------------|-----|
| How one indicator changed over the last 12 months | Line chart |
| How 25 districts compare on the same indicator | Heatmap |
| Two indicators on the same time axis | Line chart (dual series) |
| One indicator, one period, across a few districts | Bar chart |

**When in doubt:** start with a line chart for one indicator, or a heatmap for many.

## Quick test — try the six steps

Find any recent chart from your country's data (a screenshot, a slide, a printed report) and walk through steps 1–6 out loud with a teammate. Notice where you slow down — that's usually where the chart is missing a label, or where the question it's trying to answer isn't clear yet.

## What's next

You'll build your own visualization next — first manually, then with the AI Assistant. Both end with this same six-step framework to interpret what you produced.

> 🔎 **Verify in your current UI**: chart types and labels may differ slightly from screenshots elsewhere in this series. The framework above applies to any chart.
