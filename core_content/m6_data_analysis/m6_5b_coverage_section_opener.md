---
marp: true
theme: fastr
paginate: true
---

## Coverage estimation

We've covered service utilization — what was reported and where the volumes are changing. Coverage estimation answers a different question: **what share of the target population actually received each service**.

Coverage is built as a **two-part module** in FASTR:

- **Part 1** constructs and validates the denominator chains
- **Part 2** applies the chosen chain to compute coverage, and projects between surveys

Earlier versions of the platform combined these into a single module. The two-part split lets the denominator chain be reviewed and overridden independently. Some country instances still show the older single-module layout labelled "Module 4 — Coverage"; the underlying methodology is the same.
