---
marp: true
theme: fastr
paginate: true
---

## DQA module: Configuration parameters

The Data Quality Assessment module uses configurable parameters:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `GEOLEVEL` | admin_area_3 | Geographic level for consistency analysis |
| `OUTLIER_PROPORTION_THRESHOLD` | 0.80 | Flag if single month exceeds this proportion of annual volume |
| `MINIMUM_COUNT_THRESHOLD` | 100 | Only flag outliers with count above this threshold |
| `MADS` | 10 | Number of MADs for statistical outlier detection |
| `DQA_INDICATORS` | penta1, anc1, opd | Core indicators for DQA scoring |
| `CONSISTENCY_PAIRS_USED` | penta, anc | Indicator pairs for consistency assessment |

---

## Tuning DQA parameters

| Objective | Adjustment |
|-----------|------------|
| **More sensitive outlier detection** | Lower `MADS` to 8; lower `OUTLIER_PROPORTION_THRESHOLD` to 0.6–0.7 |
| **Less sensitive outlier detection** | Increase `MADS` to 12–15; increase `OUTLIER_PROPORTION_THRESHOLD` to 0.9 |
| **Include small facilities** | Lower `MINIMUM_COUNT_THRESHOLD` to 50 |
| **Focus on large facilities** | Increase `MINIMUM_COUNT_THRESHOLD` to 200+ |
| **Coarser consistency analysis** | Set `GEOLEVEL` to admin_area_2 |
