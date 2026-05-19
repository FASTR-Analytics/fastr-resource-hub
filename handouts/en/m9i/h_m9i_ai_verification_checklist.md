---
marp: true
theme: fastr-handout
paginate: true
footer: "FASTR · Report Builder"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# AI verification checklist

<p class="meta-line"><strong>Reference</strong> · <strong>Report Builder</strong> · <strong>~15 min</strong></p>

## Why this matters

The AI Assistant can generate a complete report in a few minutes. **You** are the one who signs off on it. The AI can sound confident and still be wrong — about a number, a region name, a comparison. This checklist is what you and your team run **before** you share an AI-drafted report with anyone outside the team.

The rule: every claim in the report must be checkable against the underlying chart or table. If you can't trace a sentence back to data, flag it.

## Before you start

- ☐ The AI has generated your report (Prompt 1 = base disruption report, plus optionally Prompt 2 / Prompt 3)
- ☐ Your country team is together — verification is a team activity, not a solo one
- ☐ You have the source charts open on the platform, next to the report

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Prompt 2 — Regional disruption analysis

The AI generates one slide per subnational area, comparing observed vs expected service volumes.

| ☐ | Check | Notes |
|---|-------|-------|
| ☐ | The summary includes **all** subnational areas (count them) |  |
| ☐ | **One slide per area** — none missing, none duplicated |  |
| ☐ | Area names are **spelled correctly** (matches your country's official naming) |  |
| ☐ | Each interpretation references the **right area** (not Region A on Region B's slide) |  |
| ☐ | Observed-vs-expected charts use the **same scale across slides** so comparisons make sense |  |
| ☐ | Magnitudes match what's in the source chart (no inflated drops, no missed spikes) |  |

> **If a check fails:** ask the AI to regenerate the section, naming the issue specifically. *"You mapped the interpretation from Region X to Region Y's slide — please fix slide 7."*

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Prompt 3 — Data quality appendix

The AI adds an appendix with completeness, outlier, and consistency checks.

| ☐ | Check | Notes |
|---|-------|-------|
| ☐ | The appendix is **numbered correctly** (Annex 1 or 2 depending on whether Prompt 2 also ran) |  |
| ☐ | All three DQ dimensions present: **completeness, outliers, internal consistency** |  |
| ☐ | The **colour code is logical**: green = good, red = alert. No inverted scales. |  |
| ☐ | Low-quality areas or indicators are **explicitly flagged** in the text, not hidden in a chart |  |
| ☐ | The DQ scores match what you see on the platform (open the DQA module side-by-side) |  |

> **If a check fails:** the AI may have mis-read the underlying DQA outputs. Re-prompt with: *"Re-check the DQ slides — the [completeness / outlier / consistency] chart for [area] does not match the platform."*

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Final read-out-loud

Once both checklists pass, read **every interpretation in the report out loud as a team**. Listen for:

- **Anything that sounds wrong** — a number that's too round, a trend that's not in the chart
- **Anything that sounds exaggerated** — "dramatic", "alarming", "unprecedented" without evidence
- **Anything generic** — sentences that could apply to any country, not yours
- **Missing local context** — the AI doesn't know about the recent strike, the supply chain issue, the new policy. You need to add it.

If anyone in the room hesitates on a sentence, **flag it**. Hesitation usually means something is off.

## Sign-off

By the time you share this report outside the team, the team must be able to say:

> *"Every number is checkable. Every interpretation reflects what we know. No sentence is generic. No claim is unsupported."*

If you can't say that yet, keep iterating.

## What's next

Once the report passes verification, finalise the formatting (titles, page numbers, logos), export, and disseminate using your country action plan.
