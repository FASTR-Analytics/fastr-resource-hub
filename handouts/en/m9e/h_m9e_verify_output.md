---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Disruption Report"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Create with AI</span> <span class="arrow">→</span> <span class="step current">Verify the output</span> <span class="arrow">→</span> <span class="step">Refine</span> <span class="arrow">→</span> <span class="step">Peer review</span></div>

# Verify the AI output

<p class="meta-line"><strong>Activity</strong> · <strong>Disruption Report</strong> · <strong>~20 min</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Why this matters</p>

The AI Assistant can generate a complete disruption report in 5–10 minutes. **You** sign off on it. The AI can sound confident and still be wrong — about a number, a region name, an indicator grouping, a comparison.

<p class="sb-label">The core rule</p>

Every claim in the report must be checkable against the underlying chart or table. If you cannot trace a sentence back to data, flag it.

</aside>
<div class="p1-main">

## Two passes to verify

Verification has two passes, and you need **both**:

1. **Pass 1 — AI self-review.** Run **Prompt 5: Review slide deck** so the AI checks its own output against the data.
2. **Pass 2 — Team review.** The AI cannot catch everything. The team runs the manual checklist below.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Pass 1 — Run the AI review (Prompt 5)

Once the report is generated, open the prompt library and run **Prompt 5: Review slide deck**. The AI goes through every slide in one pass and checks six things:

| # | What Prompt 5 checks |
|---|----------------------|
| 1 | **Data accuracy** — every number in the text matches the underlying data; unverifiable stats are flagged `[UNVERIFIED]` |
| 2 | **Indicator names & direction** — names match the platform labels; service indicators up = good, mortality up = bad, not mixed up |
| 3 | **Acronyms & methodology** — any acronym expansion or methodology description is verified against the official docs |
| 4 | **Language & framing** — no causal claims, appropriate hedging, no overgeneralisation |
| 5 | **Consistency across slides** — same indicator shows the same value everywhere; names and periods consistent |
| 6 | **Word count** — each text block within target range |

**What you get back:** a summary — *"[X] slides reviewed, [Y] issues found across [Z] slides"* — with a suggested fix per issue. You choose: fix all automatically, review one by one, or done.

> Pass 1 catches mechanical errors. But it only checks the deck against itself and the data. It is the start of verification, not the end.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Pass 2 — Team review

Prompt 5 cannot know things only your country team knows. **It cannot tell:**

- whether the indicator **groupings make sense** for your country
- whether a "disruption" is **real or explained** by a known local event (a strike, a campaign, a stock-out)
- whether the **so-what is realistic** and actionable in your context
- whether **local context** is missing

Work through the checklist below **as a team**, with the source charts open on the platform next to the report.

**Before you start the team review:**

- ☐ Prompt 5 has been run and its flagged issues fixed
- ☐ Your country team is together — this is a team activity, not solo
- ☐ The source charts are open on the platform, next to the report

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## General checks — every report

| ☐ | Check | Notes |
|---|-------|-------|
| ☐ | **All slides generated** — none missing, none half-rendered |  |
| ☐ | The **country name** is correct and consistent on every slide |  |
| ☐ | The **analysis period** is correct on every chart |  |
| ☐ | **No placeholder text** left behind — e.g. `[COUNTRY]`, `[UNVERIFIED]` |  |
| ☐ | The **last page** (FASTR link / closing slide) is genuinely the last slide |  |

## Base disruption report — Prompt 1

| ☐ | Check | Notes |
|---|-------|-------|
| ☐ | **Cover page** — country, subtitle, and date all correct |  |
| ☐ | The **indicator groupings match what you confirmed** in the chat |  |
| ☐ | **Each group has its own analysis slide** — none merged, none dropped |  |
| ☐ | **Charts load and show data** — no blank or broken charts |  |
| ☐ | Each **interpretation matches the chart** on that slide |  |
| ☐ | **Titles are findings, not just indicator names** — "ANC1 fell 12% in the North", not "ANC1 results" |  |
| ☐ | Does the **so-what make sense** for your country? Is it actionable? |  |

> **If a check fails:** for placeholders or structure, ask the AI to regenerate the named slide. For a wrong interpretation: *"Slide 6 says volumes rose — the chart shows a fall. Please re-check."*

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

Before moving to refine, the team must be able to say:

> *"Prompt 5 has been run and its issues fixed. Every number is checkable. Every interpretation reflects what we know. No sentence is generic. No claim is unsupported."*

## What's next

**Refine** — apply your formatting and, if useful, add regional or data-quality sections with Prompt 2 and Prompt 3.
