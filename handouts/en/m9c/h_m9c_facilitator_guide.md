---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Visualizations & Interpretation · Facilitator"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Facilitator guide — Visualizations & Interpretation

<p class="meta-line"><strong>Facilitator guide</strong> · <strong>Visualizations & Interpretation</strong> · <strong>6 activities · ~100 min</strong></p>

## Purpose

This module teaches participants to read a chart and say what it means — first by hand, then with the AI, ending in a real apply activity on their own country data. It deliberately pairs a "do it yourself" path with an "AI does it, you verify" path, for both building charts and writing interpretations, so participants complete the full loop themselves before they let the AI take it on.

By the end, a participant should be able to: read any FASTR chart with a consistent framework; build a chart and choose the right type; write a three-part interpretation; produce the same outputs with the AI and verify them; and identify a genuine disruption in real data.

## Session at a glance

| # | Activity | Time | Format |
|---|----------|------|--------|
| 1 | How to read a FASTR visualization | ~10 min | Individual, then pairs |
| 2 | Create your first visualization | ~15 min | Hands-on, individual |
| 3 | Write an interpretation for a chart | ~20 min | Individual |
| 4 | Build a visualization with the AI | ~15 min | Hands-on, individual |
| 5 | Let the AI draft the interpretation | ~15 min | Hands-on, individual |
| 6 | Apply — spot a disruption | ~25 min | Country teams |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Running the session

**Preparation.** Have a saved visualization and an existing deck ready in the demo account so you can show charts immediately. Confirm participants completed Instance Setup — activity 6 uses real country data, which must already be loaded.

**How to demonstrate.** Every platform task should be demonstrated first, then practiced from the handout, which re-explains what you showed. The detailed live demo for the chart builder (activity 2) is the one to rehearse — it carries the filter/disaggregate distinction the rest of the module depends on.

**Grouping.** Activities 1–5 are individual, with sharing in pairs. Activity 6 is the country-team capstone — seat teams together for it.

**Pacing.** Activity 1 is the reference the rest builds on; do not skip it. If time is short, tighten activities 4 and 5 (the AI pass) rather than the manual pass (2 and 3) — participants must form their own judgement before seeing the AI work.

**The message to carry through.** The AI is fast, but the participant is accountable. Reinforce verification every time the AI appears.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## The activities

### 1. How to read a FASTR visualization · ~10 min · individual → pairs

**What happens.** Participants learn a six-step framework for reading any chart — indicator, level/period, comparison, values, what stands out, so-what — see how to choose chart types, and practice on an existing deck with a teammate.

**Demonstrate.** Walk the six steps once on a real chart, naming each step aloud, before participants try it on their own.

**What a good result looks like.** A participant who checks the legend, axes and footnotes *before* interpreting, and can state a chart's "so-what" in one sentence.

**Watch for.**
- Misreading the y-axis — the single most common mistake. Have them read the axis aloud first.
- Jumping to "what it means" before establishing "what it shows".

### 2. Create your first visualization · ~15 min · hands-on

**What happens.** Participants build a chart with the built-in builder (the **Metric → Presets → Create** wizard): Create visualization → pick a metric (e.g. *M3. Service utilization → Number of services reported*) → choose a preset like *Service volume over time (monthly)* → Create. The handout then explains **filter vs disaggregate** and the four display modes (Lines / Grid / Rows / Columns).

**Demonstrate (~3 min, live).** Open a saved viz and use the **left panel** — point out you must *scroll* to reach these controls, which is where people get lost:
1. Start with one indicator, national total; say in words what it shows.
2. Under **Display (disaggregate)**, break it down **by district** — switch between **Lines**, **Rows**, then **Grid** so they see the *same data in different shapes*.
3. Under **Filter (subset)**, tick just two districts — the chart shows only those. Name it: *"I'm choosing what to show."*
4. **Show the trap:** disaggregate by district *and* filter to a single district → nothing left to compare.

**Say something like.** *"Filter what you don't need; disaggregate what you want to compare. And line charts for trends, bar charts for comparing."*

**What a good result looks like.** A saved chart, and a participant who can explain the difference between filtering and disaggregating in their own words.

**Watch for.**
- Confusing **filter** (pick what to show) with **disaggregate** (break a total into parts) — the distinction underlies every chart they build.
- Reaching for **Custom** when a preset would do; metric → preset → Create is the quick path.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 3. Write an interpretation for a chart · ~20 min · individual

**What happens.** A writing activity teaching the three-part interpretation structure: a message-carrying title, a facts-only "what you see", and an action-oriented "what it means", added alongside a chart on a slide.

**Demonstrate.** Show a weak title and a strong one side by side — *"Coverage results"* versus a title that states the finding — so the difference between describing and concluding is concrete.

**Say something like.** *"The title is your conclusion, not your topic. 'What you see' is facts only. 'What it means' has to name a person or a next step."*

**What a good result looks like.** A three-part interpretation whose title carries the message and whose "so-what" points to a specific action.

**Watch for.**
- Titles that merely describe ("Coverage results").
- Facts mixed with interpretation in the "what you see".
- Vague so-whats that name no person and no next step.

### 4. Build a visualization with the AI · ~15 min · hands-on

**What happens.** Participants produce the same chart through plain-language AI requests: type a chart request, check whether the AI matched the ask (indicator, period, adjusted vs raw), iterate in short turns, and save.

**Demonstrate.** Type one chart request live, then point out where to confirm the AI used the right indicator, period, and — critically — **adjusted vs raw** data.

**Say something like.** *"Before you save, check the AI used adjusted data, not raw, and the period you actually asked for. It often guesses."*

**What a good result looks like.** A saved chart that matches the request on indicator, period, chart type, and adjusted/raw.

**Watch for.**
- Trusting the first answer. Verify before saving — especially **adjusted vs raw data**.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 5. Let the AI draft the interpretation · ~15 min · hands-on

**What happens.** Participants use the AI to draft interpretation text, then verify it: prompt for an interpretation, check each claim against the chart, refine in plain language, and add local context the AI cannot know.

**Demonstrate.** Generate one interpretation on screen, then check a single claim against the chart aloud — showing that "it sounds right" is not the test.

**Say something like.** *"The AI can describe the chart, but it doesn't know your context. Check every claim against the chart, and you own the recommended action."*

**What a good result looks like.** An interpretation in which every claim has been checked against the chart and local context has been added.

**Watch for.**
- Trusting confident-sounding text. Every claim is checked against the chart; the recommended action is owned by the participant.

### 6. Apply — spot a disruption · ~25 min · country teams

**What happens.** The capstone: using real country data, teams pick a flagged indicator, open its disruption chart, work the six-step framework, add local context, write a three-part finding, and share it with the room.

**Demonstrate.** Nothing new to demonstrate — this applies the whole module. Set it up by reminding teams of the six steps and the three-part finding structure.

**Say something like.** *"A one-month dip is usually noise. Look for a sustained drop — three months or more — and remember stable volumes can still mean falling coverage if the population is growing."*

**What a good result looks like.** A clearly stated finding about a genuine, sustained disruption, defensible in front of the room.

**Watch for.**
- Teams calling a single-month dip a disruption. Steer them to sustained drops (3+ months).
- Use the share-back to surface and correct weak findings — it is the proof the module worked.

## Closing the session

Activity 6 is the evidence these activities landed: a team that can pick a real disruption from its own data and state it clearly has the core FASTR skill. Everything earlier in the module exists to make that final share-back possible.
