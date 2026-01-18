---
marp: true
theme: fastr
paginate: true
---

## Coverage module: Configuration parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `ANALYSIS_LEVEL` | NATIONAL_PLUS_AA2 | Geographic scope for analysis |
| `SELECTED_COUNT_VARIABLE` | count_final_both | Which adjusted count to use |

**Analysis level options:**
- `NATIONAL_ONLY` — National analysis only
- `NATIONAL_PLUS_AA2` — National + provinces/regions
- `NATIONAL_PLUS_AA2_AA3` — National + provinces + districts

---

## Demographic adjustment parameters

These parameters adjust denominators for the target population:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `PREGNANCY_LOSS_RATE` | 0.03 | 3% pregnancy loss |
| `TWIN_RATE` | 0.015 | 1.5% twin births |
| `STILLBIRTH_RATE` | 0.02 | 2% stillbirths |
| `P1_NMR` | 0.039 | Neonatal mortality rate |
| `P2_PNMR` | 0.028 | Post-neonatal mortality rate |
| `INFANT_MORTALITY_RATE` | 0.063 | Infant mortality rate |
| `UNDER5_MORTALITY_RATE` | 0.103 | Under-5 mortality rate |

**Note:** Country-specific rates may be obtained from DHS reports, UN IGME, or national vital statistics.
