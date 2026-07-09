---
marp: true
theme: fastr
paginate: true
---

## Adding indicators to your instance

Your country instance already holds the priority RMNCAH-N indicators. But it may not hold every indicator your reports and bulletins need.

**FASTR and DHIS2 are two separate databases.** To use a DHIS2 indicator in FASTR, you connect the two: import the indicator from DHIS2 and map it to a "common indicator" in the platform.

The process has five phases:

| Phase | Where | What |
|---|---|---|
| 1. Identify | DHIS2 | Find the official name and the UID (11 characters) |
| 2. Document | Spreadsheet | Record the name and UID before you start |
| 3. Create common indicator | FASTR | Make the container: a common ID and a label |
| 4. Import DHIS2 indicator | FASTR | Connect to DHIS2, search by UID, add it |
| 5. Map | FASTR | Link the imported DHIS2 indicator to the common indicator |
