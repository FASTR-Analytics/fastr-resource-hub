---
marp: true
theme: fastr
paginate: true
footer: "FASTR · Analytics platform"
---

<style>
  section h1,
  section h2 {
    border-left: none;
    padding-left: 0;
    padding-bottom: 0.24em;
    border-bottom: 3px solid var(--fastr-green);
    width: fit-content;
    max-width: 100%;
  }
  section.title-cover h1,
  section.section-cover h1,
  section.lead h1,
  section.lead h2,
  section.break h1 {
    border-bottom: none;
    padding-bottom: 0;
  }
  section.centered h1,
  section.centered h2 { align-self: center; }
</style>

<!-- _class: title-cover -->

![bg](../../resources/backgrounds/cover_slide_clean.png)

<div style="position: absolute; top: 40px; left: 80px; display: flex; gap: 20px; align-items: center;">
  <img src="../../resources/logos/GFF_Logo_trimmed.png" style="height: 40px;">
</div>

<div style="position: absolute; bottom: 40px; left: 80px; display: flex; gap: 28px; align-items: center;">
  <img src="../../resources/logos/FASTR_White_Horiz.png" style="height: 50px;">
  <img src="../../resources/logos/usefuldata600w.png" style="height: 34px;">
</div>

# Security, costs, and ownership

**How the FASTR platform protects a country's data — and what it takes to run it**

---

<!-- _class: section-cover -->

![bg](../../resources/backgrounds/section_slide.png)

# Data security

---

<!-- _class: spacious -->

## What the platform holds

- **Monthly service totals per facility** — for example, 45 first antenatal visits at one clinic in March
- The **same figures as the DHIS2 reports** the ministry already produces
- **No patient records** — no names, no addresses, nothing individual

<!--
- Answer the question behind the security question first: what is even in there.
- The platform imports aggregated numerators from DHIS2 (facility-month counts). Nothing more granular exists in it.
- If pressed: even a full breach could not expose a single patient's record, because none are there.
-->

---

## Each country is fully separate

Sharing between countries is not restricted — it is **technically impossible**. Each country runs its own installation.

![w:1020](../../resources/diagrams/gov_country_isolation.svg)

<!--
- Separate application, separate database, separate storage per country. Nothing shared.
- Same principle inside a country: each project team sees its own workspace, reading only the results package attached to it.
-->

---

<!-- _class: spacious -->

## Who can see what

- The ministry decides **who gets an account**, and each person's role
- Roles set what a person can do — **view, edit, or administer** — and in which projects
- Identity is **re-checked on every request**, not just at login
- Only a **small, named group of administrators** can change the setup

<!--
- Sign-in runs through a specialist identity service (Clerk); the platform never stores passwords itself. No back doors in production.
- Two role levels: instance-wide and per-project. Permissions live in the database and are checked on every request.
- The server itself: two named engineers, cryptographic keys only.
-->

---

## How the data is protected

The platform checks who you are at every step, makes everything unreadable while it travels, and keeps automatic backup copies.

![w:1020](../../resources/diagrams/gov_security_layers.svg)

<!--
- HTTPS everywhere, certificates renewed automatically; secrets never reach the browser.
- Database snapshot every 30 minutes (kept 3 days) plus full daily/weekly/monthly snapshots.
- Creating or restoring a backup needs explicit permission on top of a valid login.
-->

---

## What the AI can see

Aggregated totals only — the numbers a user could already see on screen, within that user's permissions. **Never the underlying rows.**

![w:1020](../../resources/diagrams/gov_ai_boundary.svg)

<!--
- The AI is Claude, by Anthropic; the access key stays on the server.
- The platform computes the aggregated answer first and sends only that; identifier lists are collapsed to counts. There is no facility-name dimension the AI can query.
- Fixed, read-only toolset: no code execution, no database access. Web search IS available (runs on Anthropic's servers) for general questions — do not claim "no internet."
- Every request is logged: user, project, model, token usage. Daily per-user and weekly per-instance limits are enforced.
-->

---

<!-- _class: section-cover -->

![bg](../../resources/backgrounds/section_slide.png)

# Costs and ownership

---

## Running costs

Three lines: **server hosting** (fixed), **AI use** (metered), **support** (shared team). No per-user fees.

![w:1020](../../resources/diagrams/gov_cost_structure.svg)

<!--
- Hosting: one dedicated server per country, fixed monthly amount. [Figure TBC — do not present without it.]
- AI: no license fee; every request is logged with its exact cost, so spend can be monitored and capped. Driver = active users, not data volume. [Range TBC.]
- Support: updates, monitoring, backups, user help — one shared team across countries today.
- Adding accounts costs nothing.
-->

---

<!-- _class: spacious -->

## Hosting — today and tomorrow

- Hosted **centrally today**, while the platform is in active development — every country receives fixes and new features the same day
- Built **portable**: the same platform can run on a ministry's own servers
- **Moving later requires no rebuild** — the same software runs in either place

<!--
- "Portable" = Docker containerization. The platform's own technical documentation: deploying a country instance on other infrastructure, including on-premise, is relatively straightforward.
- Central hosting is a development-phase choice, not a permanent dependency.
-->

---

## The path to country ownership

![w:1020](../../resources/diagrams/gov_ownership_roadmap.svg)

<!--
- Stage 2 is already partly real: country admins manage users and data imports today.
- The 2030 goal (end of the current GFF strategy period) is proposed messaging — confirm before presenting as a commitment.
- End on the needs box: server, IT capacity, budget line.
-->

---

<!-- _class: spacious -->

## The essentials

- **Monthly totals only** — never patient records
- **One installation per country** — no pathway between countries
- **Three known cost lines** — hosting, metered AI, support; no per-user fees
- **Country hosting by 2030** — the stated transition goal

<!--
- One-slide recap for the official who reads only one slide.
- If one fact is remembered: zero patient records in the platform.
- Next steps to offer: agree the cost figures; draw up the country readiness checklist.
-->
