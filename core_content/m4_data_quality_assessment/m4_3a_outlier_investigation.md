---
marp: true
theme: fastr
paginate: true
---

## Investigating a flagged outlier

When FASTR flags a value as an outlier, ask these five questions before deciding what to do:

| # | Question | What to look for |
|---|----------|------------------|
| 1 | **Data entry error?** | Typo, extra zero, value in wrong field |
| 2 | **Reporting issue?** | Missing reports from other facilities changing the total |
| 3 | **Real event?** | Campaign, outbreak, new facility opened |
| 4 | **Definition change?** | Indicator was redefined or aggregation changed |
| 5 | **Should we exclude it?** | Does it distort the overall picture? |

---

## Making the call

Based on your investigation:

- **Severe problem** (clear data entry error, implausible value) — Exclude from analysis
- **Moderate concern** (plausible but uncertain) — Include with a note explaining the caveat
- **Minor or explainable** (campaign, real event) — Include — it reflects reality

**Try it:** Find one outlier flagged in your data. Walk through the 5 questions. What is your conclusion — exclude, include with caveat, or include?
