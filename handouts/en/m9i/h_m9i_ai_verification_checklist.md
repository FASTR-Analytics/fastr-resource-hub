---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Standard FASTR Reports"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Verifying an AI-generated report

<p class="meta-line"><strong>Reference</strong> · <strong>Standard FASTR Reports</strong> · <strong>~20 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Why this matters</p>

The AI Assistant can generate a complete disruption report in 5–10 minutes. **You** sign off on it. The AI can sound confident and still be wrong — about a number, a region name, an indicator grouping, a comparison.

<p class="sb-label">The core rule</p>

Every claim in the report must be checkable against the underlying chart or table. If you can't trace a sentence back to data, flag it. Verification is what you do **before** the report leaves the team.

</aside>
<div class="p1-main">

## How a FASTR report is built — the prompts

The report builder uses a set of prompts from the prompt library:

- **Prompt 1 — FASTR disruption report.** The base report. The AI asks for country / period / subtitle, finds the available indicators, proposes groupings, you confirm, and it builds the report slide by slide.
- **Prompt 2 — Regional disruption analysis.** *Optional.* Adds one slide per subnational area.
- **Prompt 3 — Data quality assessment.** *Optional.* Adds an appendix on completeness, outliers, consistency.
- **Prompt 5 — Review slide deck.** The **verification prompt**. Run it after the report is generated — it checks the whole deck for you.

## Two passes to verify

Verification has two passes, and you need **both**:

1. **Pass 1 — AI self-review.** Run **Prompt 5** so the AI checks its own output against the data.
2. **Pass 2 — Team review.** The AI can't catch everything. The team runs the manual checklist.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Pass 1 — Run the AI review (Prompt 5)

Once Prompt 1 (and any of Prompt 2 / 3) has finished generating, open the prompt library and run **Prompt 5: Review slide deck**. The AI goes through **every slide in one pass** and checks six things:

| # | What Prompt 5 checks |
|---|----------------------|
| 1 | **Data accuracy** — every number in the text matches the underlying data; unverifiable stats get flagged `[UNVERIFIED]`; watches for hedged fabrication ("approximately X" hiding an invented figure) |
| 2 | **Indicator names & direction** — names match the exact platform labels; service indicators up = good, mortality indicators up = bad, not mixed up |
| 3 | **Acronyms & methodology** — any acronym expansion or methodology description is verified against the official docs |
| 4 | **Language & framing** — no causal claims, appropriate hedging, no overgeneralisation, correct health terms |
| 5 | **Consistency across slides** — same indicator shows the same value everywhere; names and periods consistent |
| 6 | **Word count** — each text block within the target range |

**What you get back:** a summary — *"[X] slides reviewed, [Y] issues found across [Z] slides"* — with a suggested fix per issue. You choose: fix all automatically, review one by one, or done.

> **Pass 1 is fast and catches mechanical errors.** But it only checks the deck against itself and the data. It is not the end of verification — it's the start.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Pass 2 — Team review

Prompt 5 cannot know things only your country team knows. **It cannot tell:**

- whether the indicator **groupings make sense** for your country
- whether a "disruption" is **real or explained** by a known local event (a strike, a campaign, a stockout)
- whether the **so-what is realistic** and actionable in your context
- whether **local context** is missing

That's what the manual checklist below is for. Work through it **as a team**, with the source charts open on the platform next to the report.

**Before you start the team review:**

- ☐ Prompt 5 has been run and its flagged issues fixed
- ☐ Your country team is together — this is a team activity, not solo
- ☐ The source charts are open on the platform, next to the report

> Verify **Section A + Section B** for every report. Add **Section C / D** only if you ran Prompt 2 / Prompt 3.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Section A — General checks (every report)

| ☐ | Check | Notes |
|---|-------|-------|
| ☐ | **All slides generated** — none missing, none half-rendered |  |
| ☐ | The **country name** is correct and consistent on every slide |  |
| ☐ | The **analysis period** is correct on every chart |  |
| ☐ | **No placeholder text** left behind — e.g. `[COUNTRY]`, `[VERIFY]`, `[UNVERIFIED]` |  |
| ☐ | The **last page** (FASTR link / closing slide) is genuinely the last slide |  |

## Section B — Prompt 1: base disruption report

| ☐ | Check | Notes |
|---|-------|-------|
| ☐ | **Cover page** — country, subtitle, and date all correct |  |
| ☐ | The **indicator groupings match what you confirmed** in the chat |  |
| ☐ | **Each group has its own analysis slide** — none merged, none dropped |  |
| ☐ | **Charts load and show data** — no blank or broken charts |  |
| ☐ | Each **interpretation matches the chart** on that slide |  |
| ☐ | **Titles are analytical, not just indicator names** — "ANC1 fell 12% in the North", not "ANC1 results" |  |
| ☐ | Does the **so-what make sense** for your country? Is it actionable? |  |

> **If a check fails:** for placeholders or structure, ask the AI to regenerate the named slide. For a wrong interpretation: *"Slide 6 says volumes rose — the chart shows a fall. Please re-check."*

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Section C — Prompt 2: regional disruption analysis

*Only if you ran Prompt 2.*

| ☐ | Check | Notes |
|---|-------|-------|
| ☐ | The summary includes **all** subnational areas (count them) |  |
| ☐ | **One slide per area** — none missing, none duplicated |  |
| ☐ | Area names **spelled correctly** (matches official naming) |  |
| ☐ | Each interpretation references the **right area** |  |
| ☐ | Observed-vs-expected charts use the **same scale across slides** |  |
| ☐ | Magnitudes match the source chart (no inflated drops, no missed spikes) |  |

## Section D — Prompt 3: data quality appendix

*Only if you ran Prompt 3.*

| ☐ | Check | Notes |
|---|-------|-------|
| ☐ | The appendix is **numbered correctly** (Annex 1 or 2) |  |
| ☐ | All three DQ dimensions present: **completeness, outliers, consistency** |  |
| ☐ | The **color code is logical**: green = good, red = alert |  |
| ☐ | Low-quality areas or indicators are **explicitly flagged** in the text |  |
| ☐ | DQ scores **match the platform** — open the DQA module side-by-side |  |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Final team read-through

Once every section passes, **read every interpretation together as a team** — each team member taking a section, the rest following along. Watch for:

- **Anything that reads wrong** — a number too round, a trend that's not in the chart
- **Anything exaggerated** — "dramatic", "alarming", "unprecedented" without evidence
- **Anything generic** — sentences that could apply to any country, not yours
- **Missing local context** — the strike, the supply-chain issue, the new policy. You add it.

If anyone on the team hesitates on a sentence, **flag it**. Hesitation usually means something is off.

## Sign-off

Before the report leaves the team, the team must be able to say:

> *"Prompt 5 has been run and its issues fixed. Every number is checkable. Every interpretation reflects what we know. No sentence is generic. No claim is unsupported."*

If you can't say that yet, keep iterating.

## What's next

Once the report passes both verification passes, finalize the formatting (titles, page numbers, logos), export, and disseminate using your country action plan.
