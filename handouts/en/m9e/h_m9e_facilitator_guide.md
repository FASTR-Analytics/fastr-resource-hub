---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Disruption Report · Facilitator"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Facilitator guide — Disruption Report

<p class="meta-line"><strong>Facilitator guide</strong> · <strong>Disruption Report</strong> · <strong>4 activities · ~180–240 min</strong></p>

## Purpose

This is the capstone of the analysis activities. Teams produce a complete disruption report with the AI Assistant, then verify, refine, and peer-review it. It draws together everything earlier in the workshop — building a report by hand, prompting, and verification — and applies it to a real deliverable. The module assumes participants have already done the manual report build and the prompting activity; if they have not, slow down at the prompt step.

By the end, each team should have a verified, refined disruption report they could present to a decision-maker, and a clear sense of what the AI drafted versus what the team is accountable for.

## Session at a glance

| # | Activity | Time | Format |
|---|----------|------|--------|
| 1 | Create the report with the AI | ~60 min | Team (one driver) |
| 2 | Verify the output | ~20 min | Team |
| 3 | Refine | ~40 min | Team |
| 4 | Peer review and present | ~40 min | Team ↔ team |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Running the session

**Preparation.** Confirm each team has a loaded instance and has completed the prompting and manual-report activities. Have the Prompt library open in the demo account so you can show the first run live. This is the longest activity in the workshop — plan for 3–4 hours and protect it from being squeezed.

**How to demonstrate.** Demonstrate the first prompt run before teams start: open the Prompt library, run Prompt 1, and answer the AI's questions on screen. Then let teams work. Generation takes 5–10 minutes per build, so build the verify-checklist discussion into that waiting time rather than letting the room go idle.

**Grouping.** Teams work in small groups with one **driver** at the keyboard and everyone else reviewing. Rotate the driver between sections if time allows, so more than one person practices the prompts.

**Pacing.** Activity 1 (generation) sets up everything else; do not rush the groupings step within it. If the session runs long, compress activity 3 (refine) rather than activity 2 (verify) — an unverified report is worse than a less-polished one.

**The message to carry through.** The AI drafts; the team is accountable. Reinforce verification at every step, not only in activity 2.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## The activities

### 1. Create the report with the AI · ~60 min · team

**What happens.** Teams generate the core report from a ready-made prompt (Prompt 1 national, or Prompt 4 subnational): create the deck → open the AI Assistant → pick the prompt → answer its questions (period, subtitle, groupings, mortality) → review groupings → confirm → let it build.

**Demonstrate.** Run Prompt 1 on screen and answer the AI's questions, pausing on the **groupings** step — show what a thoughtful grouping looks like, because this is what determines whether the report reads cleanly.

**Say something like.** *"Once it starts building, don't click a slide — it interrupts the build. Take your time on groupings; a rushed grouping gives you a messy report."*

**What a good result looks like.** A complete report built from a deliberate set of groupings, with the driver entering agreed answers rather than the whole group typing at once.

**Watch for.**
- Teams clicking a slide mid-generation — tell them to wait.
- Rushed groupings — spend real time here.
- The whole group talking over the driver — one person types the agreed answers.
- Teams opening the prompt library cold. Have each team agree out loud on country, period, indicator groupings, and audience *before* opening the prompt. Five minutes of agreement here saves thirty minutes of regeneration later.

### 2. Verify the output · ~20 min · team

**What happens.** A two-pass verification before the report is used. **Pass 1**: run **Prompt 5: Review slide deck** — the AI checks its own deck against the data (numbers, indicator names, hedging, consistency). **Pass 2**: the team works the manual checklist for what only they can know — whether groupings make sense, whether a disruption is real or explained by a local event, whether local context is missing.

**Demonstrate.** Run Prompt 5 once on screen so teams see what the AI self-check looks like. Then show one interpretation read aloud against its chart — model checking the words against the line, not the tone of the writing.

**Say something like.** *"Prompt 5 catches mechanical errors. It can't know whether a 'disruption' is real or just a clinic that closed for renovation — that's your job, in the second pass. Both passes matter."*

**What a good result looks like.** Prompt 5 has been run and its flagged issues fixed; then every slide has been read by the team with mismatches between text and chart caught and noted for the refine step.

**Watch for.**
- Teams stopping after Prompt 5 — the AI pass only checks the deck against itself. The manual pass is what catches local context.
- Teams trusting the AI because it sounds confident — make them read interpretations aloud and check against the chart.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 3. Refine · ~40 min · team

**What happens.** Formatting plus optional extra sections via Prompt 2 (regional) and Prompt 3 (data quality): polish for the audience, append the regional and/or DQA sections, and check each new section as it is added.

**Demonstrate.** Show appending one section with Prompt 2 or 3, then immediately verifying it — reinforcing that every new section gets the same check as the base report.

**Say something like.** *"Add only what a decision-maker needs. More sections is not a better report — it's a longer one."*

**What a good result looks like.** A report polished for its audience, with only the extra sections that serve the decision, each verified.

**Watch for.**
- Teams adding every section "to be safe" — steer them to what the audience actually needs.

### 4. Peer review and present · ~40 min · team ↔ team

**What happens.** Teams swap reports, review as a fresh reader, and present feedback: read cold (is the message clear? would a decision-maker act?), note two strengths and two suggestions, present back, then group discussion.

**Demonstrate.** Model one piece of useful feedback versus one vague piece, so teams aim for specific, slide-anchored suggestions.

**Say something like.** *"Tie each suggestion to a specific slide. 'Slide 3's title isn't a finding' helps; 'make it clearer' doesn't."*

**What a good result looks like.** Each team gives another two concrete strengths and two actionable, slide-specific suggestions.

**Watch for.**
- Vague feedback — push for specific suggestions tied to a slide.

## Closing the session

This report is the workshop's main deliverable. Close by reinforcing the division of labour that produced it: the AI drafted quickly, and the team's verification and local knowledge are what make it trustworthy enough to present.
