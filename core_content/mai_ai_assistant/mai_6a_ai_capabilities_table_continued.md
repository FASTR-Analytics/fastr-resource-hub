---
marp: true
theme: fastr
paginate: true
---

## What makes a good prompt?

A good prompt names what you want, who it is for, what data it covers, and what a good answer looks like. Six elements to spell out:

| # | Element | What to spell out | Example |
|---|---------|------------------|---------|
| 1 | **Purpose** | The task and the use case | *Interpret for a quarterly performance review* |
| 2 | **Audience** | Who reads it, at what technical level | *District MoH managers, plain language* |
| 3 | **Geography, time, scope** | Country or subnational area, period, indicators | *Nigeria, 2024-Q1 to Q4, ANC4 and SBA* |
| 4 | **Interpretation guidance** | Trends, comparisons, or disruptions; description or implications | *Identify sustained disruptions; do not speculate on causes* |
| 5 | **Output format** | Bullets or narrative; slide-ready or report prose; length | *Three slide-ready bullets, under 15 words each* |
| 6 | **Guardrails** | Stay grounded in the data; flag uncertainty or quality issues | *Do not extrapolate beyond the chart* |

**Rule of thumb:** Before sending, read the prompt back. If it is not obvious what should come back, add one more detail.

<!--
PRESENTER NOTES:
- The point is not memorizing six items. It is the habit of asking "have I told the AI everything it needs?".
- Run a live demo: write a prompt that omits half these elements, run it, then add the missing pieces and re-run. The contrast is the lesson.
- Most common gap in practice: people omit format. The AI defaults to long paragraphs when participants needed slide-ready bullets.
- Second most common gap: people omit guardrails. Without them, the AI fills missing context with plausible-sounding speculation.
- The rule of thumb at the bottom is the one thing participants need to remember from this slide.
-->
