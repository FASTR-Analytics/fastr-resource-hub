---
marp: true
theme: fastr
paginate: true
---

## Saída do ajuste de outlier

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Outlier adjustment](../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**O que você vê:** Mapa de calor mostrando o quanto o volume de serviço mudou após a substituição de outliers por médias móveis.

**Fórmula:** % de alteração = (ajustado - original) / original × 100

**Interpretação:** Os valores são tipicamente negativos (os outliers removidos reduzem o volume). Ajustes grandes justificam uma investigação sobre a sua origem.

</div>
</div>
