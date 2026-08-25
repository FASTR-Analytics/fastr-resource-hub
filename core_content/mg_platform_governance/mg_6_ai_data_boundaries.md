---
marp: true
theme: fastr
paginate: true
---

## What the AI assistant can and cannot see

- The AI is **Claude, by Anthropic** — the access key stays on the server, never in the browser
- It sees only **aggregated, summarized numbers** — the same figures a user sees on a chart
- It **never sees record-level data**, and it inherits the permissions of the user it is helping
- Every AI request is **logged**: who used it, on which project, with what cost

<!--
- The AI works through a fixed set of tools — it cannot run arbitrary code, browse the internet, or reach other systems.
- When it asks for data, the platform computes the aggregated values first and sends only those; long identifier lists (e.g. facility names) are summarized as counts.
- The AI runs inside the user's session: it can never see anything the user themselves is not allowed to see.
- The audit log records user email, project, model, and token cost for every request.
-->
