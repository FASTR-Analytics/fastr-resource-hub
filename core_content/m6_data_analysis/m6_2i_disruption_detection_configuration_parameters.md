---
marp: true
theme: fastr
paginate: true
---

## Disruption detection module: Configuration parameters

**Note:** Set in Results → Module defaults. They apply to every results package generated afterward.

<div style="font-size: 0.75em;">

| Parameter | Description |
|-----------|-------------|
| **Count variable** | Unadjusted or outlier-adjusted count. Completeness-imputed counts are refused: the module models reporting gaps itself. Default: outlier-adjusted |
| **Fourier seasonality terms (K)** | Sine/cosine pairs for seasonality. Default 2 (annual + semi-annual); 3–4 for campaign-style indicators such as vitamin A |
| **Posterior draws** | Yes = properly calibrated credible bands at district level, about ten times slower. Default no |
| **Zero handling** | all = every zero is a real report (default); none = zeros are missing; auto / strict = a zero is real only if another indicator was submitted that month; detect = choose from the data |
| **Exclude pre-launch months** | Ignore months before a facility's first report, so new facilities are not counted as silent. Default yes |
| **Closure grace (months)** | Drop months more than N months after a facility's last report, as presumed closure. Default 0 (off) |

</div>

<!--
PRESENTER NOTES:
- Most countries run with the defaults. The two settings worth a conversation are the zero policy (does your DHIS2 auto-fill zeros?) and Fourier K for campaign indicators.
- Posterior draws matter only when district-level bands will be used for decisions; for routine national and provincial monitoring the default is fine.
- Closure grace is for systems where many facilities go permanently dark, otherwise leave it off.
-->
