---
marp: true
theme: fastr
paginate: true
---

## How the expected volume is built

For each area and month, the model adds up the expected volume of **only the facilities that reported that month**, and compares it with what those same facilities actually reported.

<div style="font-size: 0.9em;">

| | Earlier approach | Bayesian approach |
|---|---|---|
| **Unit modeled** | District or province total | Each facility |
| **Missing reports** | Filled in, then modeled | Modeled as a separate question |
| **Expected volume** | Trend + season on the total | Trend + season + each facility's own level |
| **Uncertainty** | Fixed thresholds | 95 % credible band |
| **A facility goes silent** | Looks like a drop | Removed from both sides of the comparison |

</div>

<!--
PRESENTER NOTES:
- The key line is the last one. When a facility stops reporting, the old model saw a drop in the total. The new model drops that facility from both observed and expected for that month, so the comparison stays like for like.
- "Credible band": the range in which the model expects the volume to fall 95 times out of 100. Outside the band is a signal; inside is normal variation.
- The band is wider for small areas and low-volume indicators, which is right: less data, less certainty.
-->
