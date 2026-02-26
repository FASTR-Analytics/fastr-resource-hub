# Demo prompts: GFF Trust Fund Committee presentation

**For**: Ashley and Tim
**Context**: 5-7 minute live demo of the FASTR analytics platform to GFF Trust Fund Committee (all GFF donors). Peter provides introductory framing, then Ashley demos.
**Date prepared**: 25 February 2026
**Projects**: Sierra Leone "Demo project 26Feb2026" (subset of indicators) | Nigeria "SANDBOX DAY 1"

---

## Overview

| Prompt | Topic | Live / pre-built |
|--------|-------|-----------------|
| **Prompt 1** | ANC trend + interpretation | Live (SLE) |
| **Prompt 2** | Immunization progress deck | Live (SLE) |
| **Prompt 3** | Prompt library short report | Live (SLE) |
| **Prompt 4** | RMET triangulation | Pre-built (SLE) |
| **Prompt 5** | Nigeria climate shock | Pre-built (Nigeria) |
| **Verification** | Data accuracy check | Run against Prompts 4 and 5 before the demo |

**Core principle**: Prompts 1-3 run live to show the platform in action. Prompts 4-5 are pre-generated and validated -- too risky to generate live in front of donors.

---

## Prompt 1: ANC trend + interpretation (LIVE)

**Goal**: Show how the platform queries data, creates a chart, adds it to a deck, and generates interpretation.

### Ashley's prompt

```
Show me the latest trend for service utilization of antenatal care
```

Then, after the chart appears:

```
Can you add interpretation to this slide with only key messages?
```

### Suggestion

Split it into two steps as above (rather than one combined prompt) so the audience sees the progression: first the chart, then the interpretation. Gives Ashley a natural beat to narrate between them.

### What it demonstrates

- Data querying in plain language
- Chart generation
- AI-generated interpretation
- The build-up from data to insight

---

## Prompt 2: Immunization progress deck (LIVE)

**Goal**: Show how the platform can create a more comprehensive multi-slide deck from a single prompt.

### Ashley's prompt

```
Create a slide deck for the Minister of Health showing immunization progress
in Sierra Leone from 2019-2025, including growth trends, district performance,
disruptions analysis, and coverage estimates for BCG, Penta1, and Penta3.
Use a layout with key messages on the left and charts on the right
```

### Suggested optimization

```
Create a 4-slide deck for the Minister of Health on immunization progress in
Sierra Leone (2019-2025). Cover: national trends for BCG, Penta1, and Penta3;
district performance comparison; and any disruptions detected. Key messages on
the left, charts on the right. Keep interpretations under 60 words per slide.
```

**Why**: Capping at 4 slides makes timing predictable. Word limit prevents walls of text. Same content, tighter scope.

### What it demonstrates

- Multi-slide deck generation from a single prompt
- Audience-tailored output (Minister of Health)
- Structured layout capability

---

## Prompt 3: Prompt library short report (LIVE)

**Goal**: Demonstrate the value of the prompt library for helping people get started or run standardized reports.

### Ashley's prompt

```
Create a new slide deck, run from prompt library short report prompt
```

### Notes

- This is more "showing a feature exists" than "telling a data story"
- Make sure the prompt library loads quickly -- if it's slow or requires multiple clicks, walk through it briskly
- Good transition line: "For teams who don't want to write their own prompts, we have a library of standardized reports they can run with one click"

### What it demonstrates

- Standardized, reusable prompts
- Accessibility for non-technical users
- Consistency across country teams

---

## Prompt 4: RMET triangulation (PRE-GENERATE)

**Goal**: Show how the platform can bring together FASTR service delivery data with external financing data (RMET report).

### Why pre-generate, not live

| Risk | Mitigation |
|------|-----------|
| PDF reading error (Ashley already hit one) | Pre-generate with Claude 4.6 + 1M context; validate it works |
| Unvalidated output in front of donors | Pre-generate, validate every number against the RMET PDF |
| Open-ended output -- could produce 2 or 10 slides | Structured prompt caps at 3 slides |
| Causal claims about funding and performance | Explicit guardrails in prompt |

### Ashley's original prompt

> Using FASTR data (service performance) from the platform and RMET (financing data) from the attached PDF, can you triangulate data sources and generate a presentation that speaks to: What is the envelope of resources available versus needed for programs, geographies, levels of the health systems? How are those same areas performing on service readiness, use, and coverage? Does funding availability correlate to program performance?

### Suggested rewrite

```
Using FASTR data (service performance) from the platform and the RMET report
(financing data) uploaded to Assets, create 3 slides for GFF Trust Fund
Committee donors:

Slide 1: What is the resource envelope? Summarize total resources, trends,
and execution rates from the RMET data.

Slide 2: How are services performing? Summarize service delivery trends from
FASTR for the same period and program areas.

Slide 3: Where do resource trends and service trends align or diverge? Show
side by side where financing went up/down and whether services moved in the
same direction. Describe patterns -- do not claim that funding caused service
changes.

Do not frame any comparison as "return on investment," "value for money," or
"efficiency." A program area receiving X% of the budget and showing service
growth does not mean the money caused the growth -- there are many possible
explanations (campaigns, data quality, population changes). Describe alignment
or misalignment between resource and service trends, nothing more.

Keep each slide under 120 words. Use bold for key numbers. Only reference data
from the RMET report or the FASTR platform. Flag any areas where the data is
insufficient to draw conclusions.
```

### What changed from Ashley's original

- Capped at 3 slides (predictable output)
- Removed "Does funding availability correlate to program performance?" -- causal framing that the data can't support. Reframed as "where do trends align or diverge?"
- Added explicit guardrails against ROI/value-for-money language
- Added "flag insufficient data" to prevent hallucinated connections
- Added word limits and audience framing

### Preparation steps

1. Confirm SLE project is set to **Claude 4.6 + 1M context** (Ashley hit a PDF error without this)
2. Confirm `RMET_R5_SierraLeone_2025.pdf` is uploaded to Assets
3. Run the prompt above
4. **Validate every slide** -- check numbers against the RMET PDF
5. Run the verification prompt (below)
6. Save the polished deck, ready to show

### Ashley's narration (during the demo)

> "We uploaded the Sierra Leone RMET expenditure report, and the AI cross-referenced it with our routine service delivery data. This is a first step -- we're actively refining this capability, but it shows what becomes possible when you bring financing and service data together in one platform."

---

## Prompt 5: Nigeria climate shock (PRE-GENERATE)

**Goal**: Show how FASTR can rapidly assess the health impact of a known climate event.

### Ashley's prompt

```
Create a climate shock health impact assessment report for the May 2025 flood
in Northern Nigeria (Niger, Kebbi, Sokoto, Katsina, Kano states). Analyze SAM,
diarrhea, maternal health (ANC, delivery, family planning), and malaria
services from May-August 2025.
```

### Suggested optimization

```
Create a climate shock health impact report for the May 2025 floods in
Northern Nigeria (Niger, Kebbi, Sokoto, Katsina, Kano states). Analyze SAM,
diarrhea, maternal health (ANC, delivery, family planning), and malaria
services from May-August 2025. Start with a key findings slide summarizing the
3-5 most significant impacts. Keep language non-technical -- this is for
senior donors.
```

**Why**: Key findings slide up front means donors see the punchline immediately. Audience framing keeps output appropriate.

### Preparation steps

1. Run in the Nigeria "SANDBOX DAY 1" project
2. Run the verification prompt (below) against the output
3. Save the polished deck
4. Have this project open in a separate tab, ready to navigate to

### Background for narration

Rachel created the original climate shock report in ~5 minutes on a call with the Climate team and it landed very well. This was the inspiration for the prompt. Good talking point: "A country analyst created the first version of this in under 5 minutes."

---

## Verification prompt: data accuracy check

Run this against **Prompts 4 and 5** after generating them. Do NOT skip this -- one wrong number in front of donors undermines the entire demo.

### For the Nigeria climate shock deck (Prompt 5)

```
Review every slide in this deck for data accuracy. For each slide that contains
numbers, percentages, or quantitative claims:

1. State the claim as written on the slide
2. Show the actual data values from the platform that the claim is based on
3. Flag whether the claim accurately reflects those values (CORRECT / INCORRECT / CANNOT VERIFY)
4. If incorrect, state what the correct value should be

Also check for:
- Inconsistencies between slides (e.g. a number on the key findings slide
  that contradicts the detail slide)
- Geographic names that don't match the data (state/LGA spelling)
- Time periods that are wrong or misaligned
- Any claim that goes beyond what the data shows (causal language,
  unsupported comparisons)

Present your findings as a numbered list. If everything checks out, say so
explicitly.
```

### For the RMET triangulation deck (Prompt 4)

```
Review every slide in this deck for data accuracy. This deck references two
data sources: the uploaded RMET report and FASTR platform data.

For each quantitative claim on each slide:

1. State the claim as written
2. Identify which source it comes from (RMET report or FASTR platform)
3. If from the RMET report: quote the exact passage or table from the
   uploaded document that supports it
4. If from FASTR: show the platform data values
5. Flag: CORRECT / INCORRECT / CANNOT VERIFY

Pay special attention to:
- Dollar amounts and percentages cited from the RMET report -- do they match
  the uploaded PDF exactly?
- Any claim that combines RMET and FASTR data -- is the comparison valid
  (same time period, compatible geographic scope)?
- Causal or correlational language -- flag anything that implies causation
- Value-for-money or "return" language -- flag any framing that implies
  a program area's budget share explains its service delivery performance
  (service growth can reflect campaigns, data quality, population changes,
  not just funding)
- Claims about trends that aren't supported by enough data points

Present your findings as a numbered list grouped by slide.
```

### What to do with the results

- **CORRECT on everything**: Good to go. Save the deck.
- **INCORRECT on any claim**: Fix the slide manually or re-prompt to correct it, then re-run this verification prompt.
- **CANNOT VERIFY**: Decide whether to keep the claim (if low-risk and directionally right) or soften the language (e.g. "approximately" or "the RMET report indicates").

---

## Recommended demo flow (7 minutes)

| # | Segment | Time | What happens |
|---|---------|------|-------------|
| 1 | **ANC trend** (SLE) | 1:30 | Live: query ANC data, chart appears, add interpretation. Quick and visual. |
| 2 | **Immunization deck** (SLE) | 2:00 | Live: generate multi-slide deck. While it builds, Ashley narrates what it's doing. |
| 3 | **Prompt library** (SLE) | 1:00 | Live: show prompt library, run short report. Feature demo -- keep it brisk. |
| 4 | **RMET triangulation** (SLE) | 1:30 | Pre-built: navigate to deck, show resource vs service slides. Ashley narrates the value. |
| 5 | **Nigeria climate shock** | 1:00 | Pre-built: switch to Nigeria project, show key findings + one detail slide. |
| | **Total** | **~7:00** | |

**If cutting to 5-6 min**: Condense Prompt 3 (quick mention of prompt library) or skip it.

**Transition from live to pre-built (Prompt 3 → 4)**: "Now let me show you what happens when we bring in external data sources..."

**Transition to Nigeria (Prompt 4 → 5)**: "And here's how we used the same platform to assess the health impact of a real climate event..."

---

## Reliability checklist

- [ ] SLE "Demo project 26Feb2026" set to Claude 4.6 + 1M context
- [ ] RMET PDF uploaded to SLE project Assets
- [ ] Pre-generate Prompt 4 (RMET triangulation); validate every number against source PDF
- [ ] Pre-generate Prompt 5 (Nigeria climate shock) in SANDBOX DAY 1
- [ ] Run **verification prompts** against both pre-built decks; fix any issues
- [ ] Test Prompts 1, 2, 3 live in SLE demo project -- confirm they work with the indicator subset
- [ ] Both projects pre-loaded in separate browser tabs
- [ ] Pre-type Prompts 1, 2, 3 in a text file, ready to copy-paste
- [ ] Test exact demo flow on same network/equipment as the presentation
- [ ] Have screenshots of key slides from Prompts 4 and 5 as backup if platform is slow
- [ ] Plan B: if a live prompt is slow, narrate while waiting -- "what the platform is doing now is..."

---

## Prepared talking points

| Likely question | Suggested response |
|----------------|-------------------|
| "How do we know the AI is accurate?" | "The AI reads actual HMIS data and shows the numbers it used. The statistical calculations -- expected trends, disruption flagging -- are validated algorithms, not AI. The AI interprets and presents those results. We also have built-in review tools where the AI checks its own output against the data." |
| "Could a country MoH team do this themselves?" | "Yes. In our Abuja workshop last month, the Nigeria team generated this exact report. The prompts are standardized and in a library. An analyst can produce a report like this in under an hour." |
| "How fast can this respond to a new crisis?" | "As fast as the HMIS data arrives -- monthly in most countries. Within weeks of the flooding, we had enough data. The AI generation takes minutes once data is in." |
| "What about data quality?" | "Every report includes a data quality assessment. We check completeness, outliers, and consistency. The AI flags where quality is low so users interpret with caution." |
| "How does this connect to investment decisions?" | "That's exactly what the RMET triangulation shows. By bringing financing data alongside service delivery data, we can see where investments are and aren't reaching services. This helps prioritize where GFF resources will have the most impact." |

---

## What NOT to do in the demo

- **Do not** generate Prompts 4 or 5 live -- always show pre-validated output
- **Do not** show the AI making errors then correcting (undermines donor confidence)
- **Do not** explain statistical methodology (regression models, control charts) to donors
- **Do not** make causal claims about funding and service delivery (say "patterns" not "caused by")
- **Do not** apologize for the platform or undersell it -- present confidently with honest framing about what's in development

---

## Technical notes

- **Anthropic PDF error**: Ashley hit an error reading the RMET PDF in SLE. Fixed by switching to Claude 4.6 + 1M context. Confirm this setting is still active before the demo.
- **Chat history not saving**: Separate issue Ashley flagged. Investigate before the call -- not critical for the demo but needs fixing.
