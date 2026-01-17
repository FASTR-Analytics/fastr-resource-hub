---
marp: true
theme: fastr
paginate: true
---

## Denominator selection methodology

**Selection process:**

1. Calculate coverage using each denominator option
2. Compare each estimate to survey benchmark (DHS/MICS)
3. Select the denominator producing the smallest error

---

### Selection hierarchy

| Priority | Rule | Rationale |
|----------|------|-----------|
| 1 | HMIS-based denominators over population projections | Grounded in observed service delivery |
| 2 | Independent denominators over reference-based | Avoids circular calculation (e.g., ANC1-based denominator for Penta3, not Penta1-based) |
| 3 | Minimum squared error | Closest alignment with survey benchmark |
