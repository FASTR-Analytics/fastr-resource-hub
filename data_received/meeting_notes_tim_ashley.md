# Meeting notes: GFF demo prep

**Updated** after Ashley's email (25 Feb evening)

---

## Situation

Ashley has tested 5 prompts and has a flow. She's leading with Sierra Leone ("Demo project 26Feb2026" with a subset of indicators for speed), then Nigeria at the end. She'll run **Prompts 1, 2, and 3 live** in SLE. Prompts 4 (RMET triangulation) and 5 (Nigeria climate shock) should be **pre-generated and shown** -- too risky live.

Two technical issues to fix: Anthropic PDF error in SLE, chat history not saving.

---

## Key concerns to raise

### 1. Prompt 4 still has causal language

> "Does funding availability correlate to program performance?"

A sharp donor will ask "how do you know?" and the data can't answer it. The AI might produce slides claiming funding caused service changes. Reframe to:

> "Where do resource trends and service delivery trends move in the same or different directions?"

Same insight, defensible framing.

### 2. The Anthropic PDF error

Ashley hit an error reading the RMET PDF in SLE. She switched to Claude 4.6 with 1M context and it worked. **Before the meeting**:
- Confirm the project is still set to Claude 4.6 + 1M context
- Test that the PDF reads successfully right now -- don't discover a problem live
- If it errors again, have the key RMET numbers written into the prompt itself as a fallback

### 3. Chat history not saving

Separate technical issue. Not critical for the demo but Ashley flagged it. Check WhatsApp for error details, investigate before the call.

---

## Prompt-by-prompt feedback for Ashley

### Prompt 1 -- ANC trend + interpretation (LIVE)
Ashley's version:
> Show me the latest trend for service utilization of antenatal care. Can you add interpretation to this slide with only key messages?

**This is good.** Quick, visual, easy to narrate. One suggestion -- split into two steps so the audience sees the progression:
1. "Show me the latest trend for service utilization of antenatal care" -- chart appears
2. "Can you add interpretation to this slide with only key messages?" -- interpretation appears

Gives Ashley a natural narration beat between them. More interactive feel.

### Prompt 2 -- Immunization deck (LIVE)
Ashley's version:
> Create a slide deck for the Minister of Health showing immunization progress in Sierra Leone from 2019-2025, including growth trends, district performance, disruptions analysis, and coverage estimates for BCG, Penta1, and Penta3. Use a layout with key messages on the left and charts on the right

**Ambitious live.** Multi-slide deck generation takes time and could surface issues. Suggested optimization:

> Create a 4-slide deck for the Minister of Health on immunization progress in Sierra Leone (2019-2025). Cover: national trends for BCG, Penta1, and Penta3; district performance comparison; and any disruptions detected. Key messages on the left, charts on the right. Keep interpretations under 60 words per slide.

Changes: capped at 4 slides (predictable timing), added word limit (prevents walls of text), slightly tighter scope.

### Prompt 3 -- Prompt library short report (LIVE)
Ashley's version:
> Create a new slide deck, run from prompt library short report prompt

**Fine as a feature demo.** Make sure the prompt library loads quickly. If it's slow or requires multiple clicks, walk through it quickly and move on. This one is more "showing a feature exists" than "telling a data story."

### Prompt 4 -- RMET triangulation (PRE-GENERATE)
Ashley's version:
> Using FASTR data (service performance) from the platform and RMET (financing data) from the attached PDF, can you triangulate data sources and generate a presentation that speaks to: What is the envelope of resources available versus needed for programs, geographies, levels of the health systems? How are those same areas performing on service readiness, use, and coverage? Does funding availability correlate to program performance?

**This needs the most work.** Three issues:
1. "Does funding availability correlate to program performance?" -- causal framing
2. Open-ended "generate a presentation" -- could produce 2 slides or 10
3. Three broad questions -- a lot for the AI to handle well in one pass

Suggested rewrite:

> Using FASTR data (service performance) from the platform and the RMET report (financing data) uploaded to Assets, create 3 slides for GFF Trust Fund Committee donors:
>
> Slide 1: What is the resource envelope? Summarize total resources, trends, and execution rates from the RMET data.
>
> Slide 2: How are services performing? Summarize service delivery trends from FASTR for the same period and program areas.
>
> Slide 3: Where do resource trends and service trends align or diverge? Show side by side where financing went up/down and whether services moved in the same direction. Describe patterns -- do not claim that funding caused service changes.
>
> Keep each slide under 120 words. Use bold for key numbers. Only reference data from the RMET report or the FASTR platform.

**Pre-generate this, validate every number against the RMET PDF, then show the polished output.** The PDF reading + triangulation is the riskiest moment. If it errors in front of donors, it's the worst possible failure.

### Prompt 5 -- Nigeria climate shock (PRE-GENERATE)
Ashley's version:
> Create a climate shock health impact assessment report for the May 2025 flood in Northern Nigeria (Niger, Kebbi, Sokoto, Katsina, Kano states). Analyze SAM, diarrhea, maternal health (ANC, delivery, family planning), and malaria services from May-August 2025.

**Strongest story in the whole demo.** Suggested optimization:

> Create a climate shock health impact report for the May 2025 floods in Northern Nigeria (Niger, Kebbi, Sokoto, Katsina, Kano states). Analyze SAM, diarrhea, maternal health (ANC, delivery, family planning), and malaria services from May-August 2025. Start with a key findings slide summarizing the 3-5 most significant impacts. Keep language non-technical -- this is for senior donors.

Changes: added key findings slide up front (donors see the punchline immediately), added audience framing.

**Pre-generate this in SANDBOX DAY 1.** Have the project open in a separate tab, ready to navigate to.

---

## Demo flow

| # | What | Live / pre-built | Time |
|---|------|-----------------|------|
| 1 | ANC trend + interpretation (SLE) | Live | 1:30 |
| 2 | Immunization deck (SLE) | Live | 2:00 |
| 3 | Prompt library short report (SLE) | Live | 1:00 |
| 4 | RMET triangulation (SLE) | Pre-built, show + narrate | 1:30 |
| 5 | Nigeria climate shock | Pre-built, show + narrate | 1:00 |
| | **Total** | | **~7:00** |

If cutting to 5-6 min: condense Prompt 3 (quick show of prompt library) or skip it.

**Transition into pre-built decks**: "Let me show you two examples we prepared earlier -- these took the AI about 15 minutes each to generate, but I'll walk you through the results."

---

## Technical issues to check before the call

- [ ] Anthropic PDF error in SLE -- is the project set to Claude 4.6 + 1M context? Test it now
- [ ] Chat history not saving -- check WhatsApp for error details, investigate
- [ ] "Demo project 26Feb2026" in SLE -- confirm the indicator subset covers ANC, immunization (BCG/Penta1/Penta3), and whatever the prompt library report needs
- [ ] SANDBOX DAY 1 in Nigeria -- confirm it has the right data for the flood analysis
- [ ] Both projects pre-loaded in separate tabs for smooth switching
- [ ] Run verification prompt (in `demo_prompts_gff.md`) against pre-built Prompts 4 and 5

---

## Questions for the call

**For Tim:**
- Does he want to review the pre-built output for Prompts 4 and 5 before the meeting?
- The causal language in Prompt 4 -- does he agree we should reframe?

**For Ashley:**
- How long did Prompts 1, 2, 3 each take to respond when she tested? (Determines if 3 live prompts fit in ~4.5 min)
- Has she tested the project switch from SLE to Nigeria? How smooth is it?
- The PDF error -- was it a one-time thing or recurring?
- Does she want optimized versions of her prompts or is she happy with hers as-is?
