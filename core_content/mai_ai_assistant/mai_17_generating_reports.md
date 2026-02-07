---
marp: true
theme: fastr
paginate: true
---

## Country Disruptions Reports

The FASTR platform can generate **standardized Country Disruptions Reports** using AI.

These reports include:
- Cover and methodology slides
- National-level disruption analysis for key indicators
- Subnational annex with regional breakdowns
- Data quality annex

**To make this possible, we created a Report Instructions File** that teaches the AI exactly how to structure and format these reports consistently.

---

## What is the Report Instructions File?

The Report Instructions File is a document you upload to the AI that contains everything it needs to generate your report.

**Think of it as a detailed blueprint** that tells the AI:

| Section | What it defines |
|---------|-----------------|
| **Report structure** | The exact sections and their order (cover, methodology, national analysis, annexes) |
| **Slide templates** | Layout for each slide type (title placement, text on left, visualization on right) |
| **Writing style** | Use cautious language, complete sentences, bold indicator names, no causal claims |
| **Indicator groupings** | Which indicators appear together (ANC1/4, delivery services, vaccines, etc.) |
| **Standard text** | Fixed methodology descriptions and interpretation guidance |

---

## How to use it

**Step 1:** Upload the Report Instructions File to your AI session

**Step 2:** Tell the AI what report you want

The instructions file teaches the AI *how* to build the report. Your prompt tells it *which* report to build. The AI needs to know:

- Which **country**?
- What **time period** does the analysis cover? (start and end dates)
- What **report period** label should appear on the cover? (e.g., Q2 2025)
- When was the **analysis generated**? (month and year)

Include these details in your prompt:

> Generate a FASTR Disruptions Report for **Nigeria** covering **Jan 2024** to **Dec 2025**. Report period: **2025 Annual**. Analysis generated: **February 2026**.

The AI combines your details with the instructions file to produce the full report.

---

## Customizing for different reports

The instructions file is a starting point. You can modify it for different contexts:

| If you want to... | Change this in the file |
|-------------------|-------------------------|
| Add or remove indicators | Edit the indicator groupings section |
| Change slide layouts | Modify the slide template descriptions |
| Add new sections | Add new section headers and content specifications |
| Adjust language/tone | Update the writing style guidelines |
| Use different visualizations | Change which charts are referenced for each slide |

**Save your modified version** as a new file for that report type. This way you build a library of report templates over time.

---

## Working without an instructions file

You don't always need an instructions file. You can also build reports through conversation with the AI, but this requires more back-and-forth to get the structure and formatting right.

**Tips for working without an instructions file:**

- **Upload an existing report:** Share a previous report and ask the AI to follow its style and structure for a new one
- **Build section by section:** Ask for methodology slides first, refine them, then move to the analysis sections
- **Be specific about formatting:** Tell the AI exactly how you want slides laid out, what language to use, etc.

The instructions file saves time by front-loading all these decisions. Without it, you make the same decisions through conversation.
