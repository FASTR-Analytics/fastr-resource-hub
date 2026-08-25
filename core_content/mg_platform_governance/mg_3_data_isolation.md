---
marp: true
theme: fastr
paginate: true
---

## Each country is fully separate

- Every country runs as a **completely separate installation**: its own application, its own database, its own storage
- **Nothing is shared** between countries — no shared database, no shared files
- There is **no technical pathway** for one country's data to reach another country's system, even by accident
- Within a country, each project is also walled off — its charts and reports are its own, and its numbers come only from the results package attached to it

<!--
- Isolation is structural, not just a policy: separate containers, separate PostgreSQL databases, separate storage directories per country.
- Inside a country: each project's authoring content (charts, reports, decks) is isolated per project; computed results live in versioned results packages generated at instance level, and a project reads only the package attached to it.
- This is the strongest answer to "could our data leak to another country or team" — the architecture makes it impossible, not just forbidden.
-->
