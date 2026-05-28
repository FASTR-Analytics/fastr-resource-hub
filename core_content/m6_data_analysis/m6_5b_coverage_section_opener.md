---
marp: true
theme: fastr
paginate: true
---

## Coverage estimation

We've covered service utilization — what was reported and where the volumes are changing. Coverage estimation answers a different question: **what share of the target population actually received each service**.

FASTR builds coverage in two parts:

- First, it constructs and validates the denominator chains.
- Then it applies the chosen chain to compute coverage, and projects values between surveys.

Splitting the two parts lets the denominator chain be reviewed and overridden independently.
