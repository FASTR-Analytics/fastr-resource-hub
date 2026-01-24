---
marp: true
theme: fastr
paginate: true
---

## Service coverage estimation

**Coverage** = services delivered ÷ target population

![Coverage equation h:100](../../resources/diagrams/coverage_equation.svg)

HMIS tells us how many services were delivered (numerator), but not the target population size (denominator). Standard HMIS coverage uses catchment populations, which are often inaccurate. Surveys (DHS/MICS) provide reliable coverage but only every 3-5 years.

---

## How FASTR estimates coverage

**Calculate denominators multiple ways:** From HMIS data, use service volumes combined with survey coverage to back-calculate target populations. For example, if 10,000 ANC1 visits and survey says 80% coverage, this implies ~12,500 pregnancies. Also calculate denominators from UN population projections using birth rates and demographic adjustments.

**Validate against surveys:** Calculate coverage using each denominator option, compare to survey benchmarks, and select the denominator with lowest error.

**Project coverage forward:** Anchor to the last survey value and apply year-over-year HMIS trends to extend estimates into post-survey years.
