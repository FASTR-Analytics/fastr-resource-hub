---
marp: true
theme: fastr-handout
paginate: true
footer: "FASTR · Prompting techniques"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<div class="setup-breadcrumb"><span class="step done">Build a clear prompt</span> <span class="arrow">→</span> <span class="step done">Explore</span> <span class="arrow">→</span> <span class="step current">Iterative vs single</span> <span class="arrow">→</span> <span class="step">Refine</span> <span class="arrow">→</span> <span class="step">PDF template</span> <span class="arrow">→</span> <span class="step">Verify output</span></div>

# Iterative vs single-prompt approach

<p class="meta-line"><strong>Activity</strong> · <strong>Prompting techniques</strong> · <strong>~30 min</strong></p>

## Before you start

- ☐ You've worked through **Build a clear prompt** and **Explore with the AI Assistant**
- ☐ The AI Assistant is open in your country's project

## Why this matters

There are two valid ways to get the AI to produce a structured output: build it up across several messages (iterative), or front-load everything into one well-structured prompt (single). Both work. The trade-off is **control vs speed**. This exercise lets you feel the difference on the same task.

## Exercise A — Iterative conversation

Build a short data quality report by stepping through these four prompts **in order**. Wait for the AI's response after each before sending the next:

1. *Can you help me understand the quality of our 2024 data? I'd like a 3-slide summary I can share with my team.*
2. *Let's focus on overall quality, regional differences, and priorities for improvement.*
3. *Which region has the weakest data quality? Highlight that.*
4. *What should we do about this? Make the final slide more actionable.*

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Exercise B — Single well-structured prompt

Now generate the **same** 3-slide report using one prompt. Open a fresh AI conversation and paste:

> Build a 3-slide data quality report for 2024 covering (1) overall status, (2) regional comparison, and (3) recommendations.

## Reflection

After running both exercises, answer:

- How did the outputs differ between the iterative path and the single prompt?
- Which approach felt easier or more natural for *this* task?
- Where did the AI make assumptions that needed clarification?

## When to use each

| Use iterative when… | Use a single prompt when… |
|---------------------|---------------------------|
| You're not sure exactly what you want | You know exactly what you want |
| You want to react to what the AI produces along the way | You want the AI to commit to a structure up front |
| You're exploring or experimenting | You're producing something repeatable (e.g., a recurring report) |

Both approaches use the same underlying data and methods — neither is "better" in general. Match the approach to the task.

## What's next

Move on to **Refine your prompt** for a self-paced exercise on tightening a single prompt across three rounds.
