# Code reference for AI assistants

This document provides instructions for AI assistants (Claude) when working with FASTR documentation.

---

## Source of truth: the FASTR analytical modules repo

When verifying module behavior, checking parameters, or updating documentation, **always refer to the actual analytical-module code first**. The code is the authoritative source for how modules actually work.

The code lives in a separate repository: [**github.com/FASTR-Analytics/modules**](https://github.com/FASTR-Analytics/modules). It's a mix of **R and TypeScript**; the older statistical pipelines (DQA, adjustment, service utilization) are R, the newer denominator + coverage parts include TypeScript. CLAUDE.md at the repo root has the full setup.

| Platform module | Code folder | Methodology chapter |
|-----------------|-------------|----------------------|
| **M1** — Data Quality Assessment | `m001/` | `methodology/04_data_quality_assessment.md` |
| **M2** — Data Quality Adjustment | `m002/` | `methodology/05_data_quality_adjustment.md` |
| **M3** — Service Utilization & Disruption Detection | `m003/` | `methodology/06a_service_utilization.md` |
| **M5** — Denominator calculation (Part 1 of coverage) | `m005/` | `methodology/06b_coverage_estimates.md` |
| **M6** — Coverage Estimation (Part 2 of coverage) | `m006/` | `methodology/06b_coverage_estimates.md` |

> **There is no platform `M4`** — the numbering skips 4. Use M1/M2/M3/M5/M6 explicitly when writing about platform modules.
>
> **Don't confuse platform modules with deck modules.** The deck/workshop modules (`m0`, `m1`, `m2`, `m3`, `m3b`, `m4`, `m5`, `m6`, `m7a–f`, `m8`, `m9a–g`) are workshop sections defined in `modules.yaml` at the repo root — they are not the same as the platform modules `m001`–`m006`. Never write "Module 4/5/6" in deck/handout body text without clarifying which numbering scheme you mean.

Quick lookups via the GitHub CLI:

```bash
gh api repos/FASTR-Analytics/modules/contents/m001
gh search code --repo FASTR-Analytics/modules <query>
```

Clone locally if you need to grep heavily.

---

## Instructions for AI assistants

### When updating documentation

1. **Read the module code first** (R or TS, whichever applies) to understand actual behavior
2. Check parameter names, default values, and data types in the source
3. Verify error messages and edge cases match the code
4. Update documentation to reflect what the code actually does
5. If the **published docs at https://fastr-analytics.org disagree with the platform code, the code wins** — flag the discrepancy so the docs can be fixed upstream

### When answering questions about module behavior

1. Check the relevant code file before answering
2. Quote specific code sections when explaining behavior
3. If documentation conflicts with code, the code is correct

### When reviewing troubleshooting sections

1. Read the code to identify:
   - Configuration parameters and their defaults
   - Error conditions and messages
   - Edge cases and how they're handled
2. Ensure troubleshooting guidance matches actual code behavior

---

## Key sections in the module code

Each module folder typically contains:

- **Configuration parameters** at the top (variables in CAPS like `COUNTRY_ISO3`, `GEOLEVEL`)
- **Data loading and preparation** functions
- **Core analysis logic**
- **Output generation** (CSV files, visualizations)

When documenting parameters, check the actual variable names and default values in the code.
