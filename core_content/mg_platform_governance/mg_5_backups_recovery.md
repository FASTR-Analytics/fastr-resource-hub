---
marp: true
theme: fastr
paginate: true
---

## Backups and recovery

- A snapshot of every country's database is taken **every 30 minutes** and kept for 3 days
- **Full storage snapshots** are kept on a daily, weekly, and monthly schedule
- An entire country instance can be **rebuilt from a snapshot**, even in a worst-case scenario
- Creating or restoring a backup requires **explicit permission** plus a valid login — neither alone is enough

<!--
- Two independent layers: application-level pg_dump snapshots every 30 minutes (3-day rolling window) for fine-grained recovery from accidental deletions or bad imports; infrastructure-level volume snapshots (daily/weekly/monthly) covering databases, files, and logs.
- Backup actions are gated by dedicated permissions (create vs restore) and a server-side key, and the restore flow validates paths and fully resets the target database.
-->
