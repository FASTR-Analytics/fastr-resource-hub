---
marp: true
theme: fastr
paginate: true
---

## Each country is fully separate

- Every country runs as a **completely separate installation**: its own application, its own database, its own storage
- **Nothing is shared** between countries — no shared database, no shared files
- There is **no technical pathway** for one country's data to reach another country's system, even by accident
- Within a country, each project also has its own dedicated database

<!--
- Isolation is structural, not just a policy: separate containers, separate PostgreSQL databases, separate storage directories per country.
- The same principle applies inside a country: each project's charts, reports, and results live in that project's own database.
- This is the strongest answer to "could our data leak to another country or team" — the architecture makes it impossible, not just forbidden.
-->
