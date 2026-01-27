---
marp: true
theme: fastr
paginate: true
---

## Service utilization module: Configuration parameters

<div style="font-size: 0.8em;">

| Parameter | Description |
|-----------|-------------|
| **Count variable to use for modeling** | Which adjusted count to use for calculating expected values |
| **Count variable to use for visualization** | Which adjusted count to use as actual observed values |
| **Run district-level model** | Run regressions at admin_area_3 level. Set to Yes for detailed analysis, No for faster runtime |
| **Run admin_area_4 analysis** | Run finest-level analysis. Warning: can be very slow for large datasets |
| **Threshold for MAD-based control limits** | Number of MADs to flag sharp deviations. Default 1.5; higher = less sensitive |
| **Smoothing window (k)** | Window size in months for rolling median smoothing. Must be odd. Default 7 |
| **Dip threshold** | Flag if actual falls below this proportion of expected. Default 0.9 (≥10% drop); use 0.8 to flag only big drops |
| **Difference percent threshold** | Highlight points where actual differs from expected by more than this percent. Default 10 |

</div>

<!--
PRESENTER NOTES:
- These parameters control sensitivity of disruption detection
- MAD threshold: lower = more sensitive (more flags), higher = more conservative
- Smoothing window: larger = smoother trends, smaller = captures rapid changes
- Dip threshold: 0.9 means flag if <90% of expected (10% drop)
- District-level analysis is optional - increases computation time significantly
- Count variable selection: use "both" for most analyses (outlier + completeness adjusted)
- Parameters can be tuned based on country context and data quality
-->
