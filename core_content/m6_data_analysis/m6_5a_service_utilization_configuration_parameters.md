---
marp: true
theme: fastr
paginate: true
---

## Service utilization module: Configuration parameters

**Note:** These parameters apply only to the disruption analysis. Year-over-year service utilization analysis does not require configuration.

<div style="font-size: 0.75em;">

| Parameter | Description |
|-----------|-------------|
| **Count variable for modeling** | Adjusted count used to compute expected values |
| **Count variable for visualization** | Adjusted count plotted as actual observed |
| **Run district-level model** | Regressions at admin area 3. Yes = detailed; No = faster |
| **Run admin area 4 analysis** | Finest-level analysis. Slow on large datasets |
| **MAD threshold** | MADs flagging sharp deviations. Default 1.5; higher = less sensitive |
| **Smoothing window (k)** | Months in the rolling median (odd). Default 7 |
| **Dip threshold** | Flag if actual < X × expected. Default 0.9 (≥10% drop); 0.8 = big drops only |
| **Difference % threshold** | Flag where actual differs from expected by > X%. Default 10 |

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
