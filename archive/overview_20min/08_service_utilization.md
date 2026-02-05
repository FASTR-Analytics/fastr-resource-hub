---
marp: true
theme: fastr
paginate: true
---

## Service utilization analysis

Track service volumes over time, detect disruptions, compare across areas.

<div style="display: flex; gap: 1em;">
<div style="flex: 1;">

![Service volumes h:220](../../resources/default_outputs/Module3_5_Number_of_services_reported.png)

**Volumes over time:** Look for trends and sudden changes

</div>
<div style="flex: 1;">

![Year-over-year h:220](../../resources/default_outputs/Module3_1_Change_in_service_volume.png)

**Year-over-year change:** Changes >±10% flagged for investigation

</div>
</div>

**Disruption detection:** Compare actual volume to model-predicted expected volume (accounting for seasonality). Investigate: COVID? Strikes? Stockouts? Campaigns?

<!--
PRESENTER NOTES:
- Service volumes don't require population denominators - useful when denominators uncertain
- YoY comparison controls for seasonal variation
- Disruption = sustained deviation below expected, not just a single bad month
- When flagged changes appear, ask: data quality issue, real program change, or external event?
-->
