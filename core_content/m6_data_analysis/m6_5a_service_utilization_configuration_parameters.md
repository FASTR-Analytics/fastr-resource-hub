---
marp: true
theme: fastr
paginate: true
---

## Service utilization: Configuration parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `SELECTEDCOUNT` | count_final_both | Data column used for analysis |
| `SMOOTH_K` | 7 | Rolling median window size (must be odd) |
| `MADS_THRESHOLD` | 1.5 | MAD threshold for sharp disruption detection |
| `DIP_THRESHOLD` | 0.90 | Flag periods below 90% of expected volume |
| `DIFFPERCENT` | 10 | Percentage threshold for visualization |
| `RUN_DISTRICT_MODEL` | FALSE | Enable district-level regression analysis |
| `RUN_ADMIN_AREA_4_ANALYSIS` | FALSE | Enable ward-level analysis |

---

## Tuning sensitivity

| Objective | Adjustment |
|-----------|------------|
| **More sensitive detection** | Lower `MADS_THRESHOLD` to 1.0; set `DIP_THRESHOLD` to 0.95; reduce `SMOOTH_K` to 5 |
| **Less sensitive detection** | Increase `MADS_THRESHOLD` to 2.0; set `DIP_THRESHOLD` to 0.80; increase `SMOOTH_K` to 9 or 11 |
| **Faster runtime** | Set `RUN_DISTRICT_MODEL` and `RUN_ADMIN_AREA_4_ANALYSIS` to FALSE |
| **Detailed subnational analysis** | Set `RUN_DISTRICT_MODEL` to TRUE (slower) |
