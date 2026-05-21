---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Visualizations & Interpretation · Facilitator"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Facilitator guide — Visualizations & Interpretation

<p class="meta-line"><strong>Facilitator guide</strong> · <strong>Visualizations & Interpretation</strong></p>

## About these activities

These activities teach participants to **read a chart and say what it means** — first manually, then with the AI, ending in a real apply activity on country data. They deliberately pair a "do it yourself" path with an "AI does it, you verify" path, for both building charts and writing interpretations.

**Six handouts.** **~100 min** of participant time.

## How to run it

- Start with the **reading framework** (handout 1) — it is the reference everything else builds on.
- The sequence pairs **a full manual pass** (handouts 2 + 3) with **a full AI pass** (handouts 4 + 5), so participants complete the whole build-and-interpret loop themselves before they see the AI do it.
- For each platform task, **demo it first**, then let participants follow the handout. The handout re-explains what you showed.
- The through-line: the AI is fast, but the participant is accountable. Reinforce verification every time the AI appears.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## The activities

### 1. How to read a FASTR visualization

**Reference · ~10 min**

**What it is** — a reusable reference: a six-step framework for reading any chart.
**What the handout covers** — the six steps (indicator, level/period, comparison, values, what stands out, so-what), how to choose chart types, and practice on an existing deck with a teammate.
**Watch for** — misreading the y-axis is the single most common mistake. Remind participants to check the legend, axes and footnotes *before* interpreting.

### 2. Create your first visualization

**Activity · ~15 min**

**What it is** — a hands-on activity creating a chart with the built-in builder (the **Metric → Presets → Create** wizard).
**What the handout covers** — + Create visualization → pick a metric (e.g. *M3. Service utilization → Number of services reported*) → choose a ready preset like *Service volume over time (monthly)* → Create. It then explains **filter vs disaggregate**, where to find them when editing a viz, and the four display modes (Lines / Grid / Rows / Columns).
**Watch for** — participants confuse **filter** (take data out — show a slice, hide the rest) with **disaggregate** (break a total into its parts). Reinforce the difference out loud; it underlies every chart they build. The quick path is metric → preset → Create; **Custom** is only for manual control. Also: line charts for trends, bar charts for comparing.

> **Demo — use both, live (~3 min).** Open a saved viz and show the **left panel** (point out you have to *scroll* to reach these — this is where people get lost):
> 1. Start with one indicator, national total. Say in words what it shows.
> 2. Under **Display (disaggregate)**, break it down **by district** — switch between **Lines**, then **Rows**, then **Grid** so they see the *same data in different shapes*.
> 3. Under **Filter (subset)**, untick all but two districts — the chart narrows. Name it: "I just *took data out*."
> 4. **Show the trap:** disaggregate by district **and** filter to a single district → nothing left to compare. Rule to repeat: *filter what you don't need, disaggregate what you want to compare.*

### 3. Write an interpretation for a chart

**Activity · ~20 min**

**What it is** — a writing activity teaching the three-part interpretation structure for a slide.
**What the handout covers** — a message-carrying title, a facts-only "what you see", and an action-oriented "what it means", added alongside a chart on a slide.
**Watch for** — titles that merely describe ("Coverage results"), facts mixed with interpretation, and vague so-whats that name no person or next step.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 4. Build a visualization with the AI Assistant

**Activity · ~15 min**

**What it is** — a hands-on activity producing the same chart via plain-language AI requests.
**What the handout covers** — type a chart request, review whether the AI matched the ask (indicator, period, adjusted vs raw), iterate in short turns, and save.
**Watch for** — participants trust the first answer. They must verify indicator, period, chart type — and especially **adjusted vs raw data** — before saving.

### 5. Let the AI draft the interpretation

**Activity · ~15 min**

**What it is** — a hands-on activity using the AI to draft interpretation text, then verifying it.
**What the handout covers** — prompt the AI for an interpretation, verify each claim against the chart, refine in plain language, and add local context the AI cannot know.
**Watch for** — trusting confident-sounding AI text. Every claim must be checked against the chart, and the recommended action must be owned by the participant.

### 6. Apply — spot a disruption

**Activity · ~25 min**

**What it is** — a capstone apply activity using real country data to identify a disruption and write a finding.
**What the handout covers** — country teams pick a flagged indicator, open its disruption chart, work the six-step framework, add local context, write a three-part finding, and share it with the room.
**Watch for** — a disruption is rarely a single-month dip. Steer teams toward sustained drops (3+ months); remind them that stable volumes can still mean falling coverage if population is growing.

## Wrapping up

Activity 6 is the proof these activities worked: a team that can pick a real disruption and state it clearly has the core FASTR skill. Use the share-back to surface and correct weak findings.
