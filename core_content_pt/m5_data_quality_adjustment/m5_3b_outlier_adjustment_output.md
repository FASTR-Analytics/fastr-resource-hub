---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output -->
## Saída de ajuste de outlier

<div class="output-layout">
<div class="output-viz">

![Outlier adjustment](../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

</div>
<div class="output-text">

**O que você vê:** Mapa de calor mostrando o quanto o volume de serviço mudou após a substituição de valores atípicos por médias móveis.

**Fórmula:** % de alteração = (ajustado - original) / original × 100

**Interpretação:** Os valores são tipicamente negativos - a remoção de outliers reduz o volume. Ajustes grandes justificam uma investigação sobre a sua origem.

</div>
</div>
