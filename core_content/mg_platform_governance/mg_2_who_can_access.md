---
marp: true
theme: fastr
paginate: true
---

## Who can access the data?

- Every user signs in through a **specialist login service** (Clerk) — the platform never stores passwords itself
- Every single request is **identity-checked** before anything else happens; no back doors in the live system
- **Two levels of permissions**: instance-wide roles (view data, change settings) and per-project roles (edit this project)
- A small, named group of administrators handles setup and support

<!--
- Authentication is handled by Clerk, a dedicated identity provider; identity is verified on every request before any action runs.
- Permissions are stored in the database and checked on every request — a user cannot claim access they were not given.
- Auth bypass exists only for local development and is explicitly disabled in production.
-->
