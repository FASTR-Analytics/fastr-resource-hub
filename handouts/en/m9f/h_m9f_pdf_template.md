---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Prompting techniques"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Build a clear prompt</span> <span class="arrow">→</span> <span class="step done">Explore</span> <span class="arrow">→</span> <span class="step done">Iterative vs single</span> <span class="arrow">→</span> <span class="step done">Refine</span> <span class="arrow">→</span> <span class="step current">PDF template</span> <span class="arrow">→</span> <span class="step">Verify output</span></div>

# Use a previous report as a template

<p class="meta-line"><strong>Activity</strong> · <strong>Prompting techniques</strong> · <strong>~10 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Before you start</p>

- ☐ You've worked through the earlier prompting activities
- ☐ You have a previous report (PDF) you're satisfied with and would like to reproduce for a new period

<p class="sb-label">Why it matters</p>

Sometimes the easiest way to brief the AI is not to describe what you want — it's to **show** it. A prior report lets the AI match an existing structure rather than reinventing the format.

</aside>
<div class="p1-main">

## When to use this approach

- You have a previous report you trust and want to replicate
- You want to keep a consistent format across time periods
- You don't have a custom prompt available for this report type

<h2 class="step-h"><span class="step-n">1</span><span>Upload the report to your Assets</span></h2>

From the main page, go to **Assets** → **Upload assets** → select your PDF.

<h2 class="step-h"><span class="step-n">2</span><span>Include the report in the AI conversation</span></h2>

Open a fresh AI conversation. Click the **three-dot menu** → **Include file** → select the report you just uploaded.

The AI now has the PDF as context for everything in this conversation.

<h2 class="step-h"><span class="step-n">3</span><span>Ask the AI to replicate the structure</span></h2>

A starter prompt:

> Use this report as a template. Create a similar report covering [time period] for [country/region/scope].

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Tips

> **Verify, don't trust.** Even when given a template, the AI can drift — it may simplify a chart, drop a section, or summarize loosely. Walk through the output side-by-side with the template before sharing.

> **Save your "good" examples.** As your team produces reports you're proud of, save them to Assets. Each one becomes a template you (or a colleague) can reuse.

## What could go wrong

- **AI doesn't seem to "see" the file** — re-check that you included it in the conversation (not just uploaded it). The three-dot menu must show the file as attached.
- **Output skips sections from the template** — ask the AI explicitly: *"Include all the sections from the template, in the same order."*
- **PDF is too large to upload** — split it into chapters, or extract the relevant pages first.

## What's next

This finishes the prompting techniques module. From here you'll move into using these skills in real workshop activities — building visualizations, slide decks, and disruption reports with the AI as your collaborator.
