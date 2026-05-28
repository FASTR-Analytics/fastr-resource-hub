---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## How disruption detection works

<div class="output-layout">
<div class="output-text">

The analysis proceeds through four steps. First, we **use past data to set expectations** by examining several years of historical data to understand the typical pattern for each month, accounting for regular seasonal changes.

Second, we **spot unusual changes** by comparing current service volumes to these expectations. Volumes that are much higher or lower than expected are flagged as unusual changes requiring investigation.

Third, we **handle past disruptions** by adjusting historical data to remove previous large, unexpected changes. This ensures that one-off events do not skew our understanding of what constitutes "normal" service delivery.

Fourth, we **detect disruptions over time** by examining trends to identify clear shifts in health service use over several months, distinguishing between temporary fluctuations and sustained changes.

</div>
<div class="output-viz">

![Disruption detection](../../resources/diagrams/disruption_chart.png)

</div>
</div>

<!--
PRESENTER NOTES:
1. Using past data to set expectations: We start by looking at the past few years of health service data to understand the typical pattern for each month. For example, if we see that certain services usually have higher or lower volumes during particular months, we use that pattern to help set "normal" expectations for each month going forward. This step helps us account for regular seasonal changes, like an increase in flu-related visits during winter months.
2. Spotting unusual changes: Once we know what "normal" looks like, we can compare current service volumes to those expectations. If we see that the number of people using a particular health service is much higher or lower than expected, we flag it as an unusual change. This could be due to factors like an epidemic, a natural disaster, or even changes in healthcare policy.
3. Handling past disruptions: To keep our analysis accurate, we adjust our historical data by removing previous big, unexpected changes. This makes sure that one-off events from the past don't skew our understanding of what's "normal" today.
4. Detecting disruptions over time: Finally, we look at trends over time to see if there are clear shifts in health service use. For example, if there's a drop in routine vaccinations over several months, we can identify that as a longer-term disruption. By monitoring these trends, we get a better sense of whether changes are just seasonal or might be due to larger, lasting issues that need attention.
-->
