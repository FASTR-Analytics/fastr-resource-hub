---
marp: true
theme: fastr-handout
paginate: true
footer: "FASTR · Prompting Techniques"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Build a clear prompt</span> <span class="arrow">→</span> <span class="step done">Explore</span> <span class="arrow">→</span> <span class="step done">Iterative vs single</span> <span class="arrow">→</span> <span class="step done">Refine</span> <span class="arrow">→</span> <span class="step done">PDF template</span> <span class="arrow">→</span> <span class="step current">Verify output</span></div>

# Verify the output

<p class="meta-line"><strong>Activity</strong> · <strong>Prompting Techniques</strong> · <strong>~20 min</strong></p>

## Before you start

- ☐ You have an AI-generated draft from the previous activities (or one provided by the facilitator)
- ☐ You know which dataset or document the AI was working from
- ☐ You have ~20 minutes to do this properly — don't rush

## Why this matters

The AI is a fluent writer, not a fact-checker. If you put its output into a report or a slide without checking, you become the person responsible for any fabricated number or invented citation. This activity gives you a repeatable way to check before you ship.

## Step 1 — Read once, mark the claims (~5 min)

Read the AI's draft slowly. As you go, **underline or highlight every factual claim** — anything that could be wrong:

- Specific numbers (percentages, counts, dates)
- Names of organizations, programs, or places
- Claims of cause and effect ("X caused Y", "because of Z…")
- Quotes or paraphrases attributed to a source

Don't try to verify yet. Just mark.

## Step 2 — Sort by risk (~3 min)

For each marked claim, assign a risk level:

| Risk | What it looks like | What to do |
|------|---------------------|------------|
| **High** | A statistic, a cause-and-effect, the central recommendation of the slide | Verify manually against the data or source |
| **Medium** | A general statement tied to a specific source you uploaded | Verify with the AI: ask it to quote the source |
| **Low** | A well-known fact, or something supported by multiple sources you trust | Spot-check if you have time |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Step 3 — Verify the high-risk claims (~7 min)

Pick the top two or three high-risk claims and check them yourself:

- **Numbers:** open the data the AI was working from. Does the number match exactly?
- **Cause-and-effect:** does the data actually support the claim, or did the AI imply something the data doesn't show?
- **Sources:** if the AI cited a document, open it. Does the document actually say that?

**Red flags from the AI Writing Guide:**

- Round numbers like *"approximately 1 million"* — may be invented
- Precise figures with no source — likely fabricated
- Numbers that seem plausible but you can't trace

## Step 4 — Use the AI to verify medium-risk claims (~3 min)

Paste a medium-risk claim back into the AI Assistant with this prompt:

> *"I want to use the following claim in a report: [claim]. Does the data or document I gave you support this? Quote the specific passage."*

If the AI cannot quote a source, remove the claim or rewrite it.

## Step 5 — Final consistency check (~2 min)

Quick scan before you call it done:

- ☐ No contradictions between sections (numbers in the summary match numbers in the body)
- ☐ Acronyms defined on first use, then used consistently
- ☐ One spelling convention throughout (e.g., "health workers" everywhere, not mixed with "healthcare workers")
- ☐ Every number you kept can be traced to its source

## What you should leave with

A draft you would be comfortable putting your name on. **If you wouldn't put your name on it, it's not done.**
