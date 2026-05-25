---
marp: true
theme: fastr-handout
paginate: true
class: facilitator
footer: "FASTR · Prompting Techniques · Facilitator"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

# Facilitator guide — Prompting Techniques

<p class="meta-line"><strong>Facilitator guide</strong> · <strong>Prompting Techniques</strong> · <strong>6 activities · ~115 min</strong></p>

## Purpose

This module develops a single practical skill: instructing the AI Assistant clearly enough to get a useful result. Participants progress from writing one well-formed prompt, through exploring how the AI responds to small changes, to refining and verifying outputs. The skills established here are assumed by every later AI-assisted activity in the workshop — building visualisations, slide decks, and disruption reports — so the module functions as the foundation for that work.

By the end, a participant should be able to: write a prompt that states its objective, audience, scope, and format; adjust a prompt deliberately and observe the effect; choose between an iterative conversation and a single structured prompt; and apply a consistent check to an AI-generated draft before using it.

## Session at a glance

| # | Activity | Time | Format |
|---|----------|------|--------|
| 1 | Build a clear prompt | ~15 min | Individual, then share |
| 2 | Explore with the AI Assistant | ~20 min | Pairs or small teams |
| 3 | Iterative vs single prompt | ~30 min | Pairs or small teams |
| 4 | Refine your prompt | ~20 min | Individual (self-paced) |
| 5 | Use a previous report as a template | ~10 min | Pairs or small teams |
| 6 | Verify the AI's output | ~20 min | Individual or pairs |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Running the session

**Preparation.** Confirm before the session that each table can sign in to the platform and open the AI Assistant within its country project. Generation takes up to a minute per request, so a reliable connection matters more here than in most modules. Prepare one prompt of your own in advance so you can demonstrate from a known-good example rather than improvising.

**How to demonstrate.** Most activities are hands-on. For each, show the first step on the shared screen — enough that participants recognise the interface — then let them work from the handout at their own pace. Resist working through a whole activity on screen: participants learn prompting by writing prompts, not by watching you write them. The on-screen moments that matter most are flagged under **Demonstrate** in each activity below.

**Grouping.** Activities 2, 3 and 5 work well in pairs or small teams, where participants compare outputs and discuss why they differ. Activities 1 and 4 are individual; participants need to form their own judgement before comparing notes.

**Pacing.** Activity 1 is foundational and should not be abbreviated, even when time is short — the later activities assume participants can name the six dimensions of a good prompt. If the session runs behind, shorten Activity 5 (the shortest and most self-explanatory) rather than Activity 1 or 6.

**The message to carry through.** A strong prompt is rarely the first one written; refining is the normal way of working, not a sign of failure. Reinforce this at each activity so participants do not become discouraged when a first attempt returns a generic answer.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## The activities

### 1. Build a clear prompt · ~15 min · individual

**What happens.** Participants take a task they do regularly and, before writing anything, check it against six dimensions: objective, audience, geography/period/scope, interpretation guidance, output format, and guardrails. They then write a single prompt that addresses each, and share it with one neighbour.

**Demonstrate.** Put a deliberately vague prompt on screen — *"tell me about our data"* — and ask the group what the AI is likely to return. Then show a version that names objective, audience, scope and format, and contrast the two. The point lands faster from a side-by-side than from explanation.

**Say something like.** *"The six dimensions are not a form to fill in. They are a 30-second check before you type, so your first message is already close."*

**What a good result looks like.** A prompt — a short paragraph is enough — in which a reader can predict what the AI will return, because the objective, audience, scope and format are all stated.

**Watch for.**
- Aiming for one perfect prompt. Reassure them the six dimensions just produce a stronger *first* message; refining still follows.
- A vague prompt. Rather than rewriting it, ask which of the six dimensions is missing and have them add it.
- Guardrails skipped — the dimension most often dropped. Remind them to tell the AI to stay within the data shown and flag uncertainty.

### 2. Explore with the AI Assistant · ~20 min · pairs

**What happens.** Participants run a supplied base prompt (*ANC1 utilization by region over the last 12 months*), re-run it changing exactly one element — indicator, period, or geographic level — and observe how the output changes. They ask one follow-up to see the exchange can continue as a conversation, and save anything worth keeping to their personal folder.

**Demonstrate.** Paste the base prompt into the AI Assistant on screen and run it. Then change a single word — swap the indicator — and run it again, so the group sees one change produce one difference before they try it themselves.

**Say something like.** *"Change one thing, look at what moved, then change the next. If you change two at once you won't know which one did it."*

**What a good result looks like.** Two or three outputs that differ in a single, identifiable way, and a participant who can say which change produced which difference.

**Watch for.**
- Changing two things at once — the most common error. Hold them to one variable per run.
- Useful output left unsaved. Prompt them to save a good chart or interpretation to their folder before moving on.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 3. Iterative vs single prompt · ~30 min · pairs

**What happens.** Participants build the same three-slide data quality report twice. In Exercise A they reach it through four prompts sent in sequence, reacting to each response. In Exercise B they open a fresh conversation and reach it with one structured prompt. They compare the two outputs and complete a short reflection, supported by a "when to use each" table.

**Demonstrate.** Before they start Exercise B, show how to open a *fresh* conversation, and explain why it matters: if they continue in the Exercise A thread, the single prompt inherits all that earlier context and the comparison is meaningless.

**Say something like.** *"Neither approach is better. Iterate when you're still working out what you want; use one structured prompt when you already know and will repeat it."*

**What a good result looks like.** Two comparable reports and a participant who can state the trade-off: the iterative path gives more control and suits exploration; the single prompt is faster and suits repeatable, routine outputs.

**Watch for.**
- Declaring one approach "better". Both use the same data and methods — the choice depends on the task.
- Exercise B run in the same thread as A. Check they started a new conversation, or the result is contaminated.

### 4. Refine your prompt · ~20 min · individual (self-paced)

**What happens.** Participants choose one topic — outliers, completeness, or disruptions — and run three rounds on it, each in a new conversation: a simple request, the same request with context added, then a version asking for prioritisation and next steps. After each round they note what improved.

**Demonstrate.** Walk through the three-round table once with a neutral topic so the progression is clear — round 1 bare, round 2 adds *where/when*, round 3 adds *why/who* — then let them run their own topic.

**Say something like.** *"Don't just notice that the last one was better — name what you added that made it better. That's the part you can reuse."*

**What a good result looks like.** Three visibly different slides on one topic, and a participant who can name what each round added — round two typically adds *where* and *when*, round three adds *why* and *for whom*.

**Watch for.**
- Running rounds as follow-ups in one thread instead of fresh conversations — they then can't see each prompt's standalone effect.
- Seeing improvement without seeing the cause. Push them to articulate the specific addition each round, and to save the strongest phrasing.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

### 5. Use a previous report as a template · ~10 min · pairs

**What happens.** Rather than describing a structure in words, participants show the AI an example. They upload a report they already trust to Assets, include it in a fresh conversation through the three-dot menu, and ask the AI to reproduce its structure for a new period or scope.

**Demonstrate.** This activity turns on one fiddly sequence — show it slowly on screen: **Assets → Upload assets → select PDF**, then in a conversation **three-dot menu → Include file → select it**. Point out that the menu must show the file as *attached*.

**Say something like.** *"Uploading a file is not the same as including it. If the AI says it can't see your report, this is almost always why."*

**What a good result looks like.** A new report that follows the structure of the uploaded model, checked section by section against it.

**Watch for.**
- File uploaded but not included in the conversation — the single most common failure. Confirm the three-dot menu shows it attached.
- The AI drifting from the template — simplifying a chart, dropping a section. Have them compare output to model side by side before using it.
- A PDF too large to upload. Suggest splitting it into chapters or extracting the relevant pages.

### 6. Verify the AI's output · ~20 min · individual or pairs

**What happens.** Participants apply a repeatable check to an AI-generated draft: read once and mark every factual claim, sort claims by risk, verify high-risk claims manually against the data, ask the AI to quote its source for medium-risk claims, and finish with a short consistency scan.

**Demonstrate.** Take a short AI draft on screen and mark two or three claims aloud — a number, a cause-and-effect statement — then show the risk table and place those claims into it. Modelling the marking step removes most of the hesitation.

**Say something like.** *"The AI writes fluently, which makes wrong numbers sound right. Fluent is not the same as correct — every figure has to trace back to the data."*

**What a good result looks like.** A draft in which every retained number can be traced to its source, and any claim the AI could not support has been removed or rewritten.

**Watch for.**
- Rushing — the most common failure. It needs the full twenty minutes; protect the time.
- Trusting confident phrasing. Flag the tell-tale signs: round numbers, precise figures with no source, plausible numbers that can't be traced.
- The principle to leave them with: the person who submits the work owns every figure in it — a draft is not finished until they would put their name to it.

## Closing the session

Close on verification. Prompting well produces a fast first draft; verifying well is what makes that draft the participant's own, defensible work. This pairing — generate, then verify — is the habit the rest of the workshop relies on.
