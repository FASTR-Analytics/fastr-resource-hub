# Code reference for AI assistants

This document provides instructions for AI assistants (Claude) when working with FASTR documentation.

---

## Source of truth: R module files

When verifying module behavior, checking parameters, or updating documentation, **always refer to the actual R code first**. The R files are the authoritative source for how modules actually work.

| Module | R file | Documentation |
|--------|--------|---------------|
| Module 1: Data quality assessment | `01_module_data_quality_assessment.R` | `methodology/04_data_quality_assessment.md` |
| Module 2: Data quality adjustment | `02_module_data_quality_adjustments.R` | `methodology/05_data_quality_adjustment.md` |
| Module 3: Service utilization | `03_module_service_utilization.R` | `methodology/06a_service_utilization.md` |
| Module 4: Coverage (Part 1) | `05_module_coverage_estimates_part1.R` | `methodology/06b_coverage_estimates.md` |
| Module 4: Coverage (Part 2) | `06_module_coverage_estimates_part2.R` | `methodology/06b_coverage_estimates.md` |

> **Note:** The R module files live in a separate repository. The filenames above are for reference when the modules are available locally.

---

## Instructions for AI assistants

### When updating documentation

1. **Read the R code first** to understand actual behavior
2. Check parameter names, default values, and data types in the R code
3. Verify error messages and edge cases match the code
4. Update documentation to reflect what the code actually does

### When answering questions about module behavior

1. Check the relevant R file before answering
2. Quote specific code sections when explaining behavior
3. If documentation conflicts with code, the code is correct

### When reviewing troubleshooting sections

1. Read the R code to identify:
   - Configuration parameters and their defaults
   - Error conditions and messages
   - Edge cases and how they're handled
2. Ensure troubleshooting guidance matches actual code behavior

---

## Key sections in R files

Each module R file typically contains:

- **Configuration parameters** at the top (variables in CAPS like `COUNTRY_ISO3`, `GEOLEVEL`)
- **Data loading and preparation** functions
- **Core analysis logic**
- **Output generation** (CSV files, visualizations)

When documenting parameters, check the actual variable names and default values in the R code.
