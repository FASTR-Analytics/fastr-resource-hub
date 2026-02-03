---
marp: true
theme: fastr
paginate: true
---

## Sortie d'ajustement combiné

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Ajustement combiné](../../resources/default_outputs/Default_3._Percent_change_in_volume_due_to_both_outlier_and_completeness_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**Ce que vous voyez :** Carte thermique montrant l'effet net de la suppression des valeurs aberrantes et de l'imputation de la complétude sur les volumes de services.

**Formule :** % de changement = (ajusté - original) / original × 100

**Interprétation :** Les valeurs aberrantes réduisent le volume (négatif), la complétude ajoute du volume (positif). L'effet net dépend du problème le plus répandu. Comparez les quatre scénarios pour évaluer la sensibilité.

</div>
</div>
