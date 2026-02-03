---
marp: true
theme: fastr
paginate: true
---

## Résultat de l'ajustement des valeurs aberrantes

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Ajustement des valeurs aberrantes](../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**Ce que vous voyez :** Heatmap montrant dans quelle mesure le volume de services a changé après le remplacement des valeurs aberrantes par des moyennes mobiles.

**Formule :** % de changement = (ajusté - original) / original × 100

**Interprétation :** Les valeurs sont généralement négatives (la suppression des valeurs aberrantes réduit le volume). Les ajustements importants justifient une investigation de leur source.

</div>
</div>

---

## Résultat de l'ajustement de l'exhaustivité

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Ajustement de l'exhaustivité](../../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**Ce que vous voyez :** Heatmap montrant dans quelle mesure le volume de services a changé après l'imputation des données manquantes par des moyennes mobiles.

**Formule :** % de changement = (ajusté - original) / original × 100

**Interprétation :** Les valeurs sont généralement positives (l'imputation ajoute du volume). Les ajustements importants indiquent les zones nécessitant une amélioration de l'exhaustivité.

</div>
</div>

<!--
PRESENTER NOTES:
- Deux résultats présentés : ajustement des valeurs aberrantes et ajustement de l'exhaustivité
- Heatmap des valeurs aberrantes : les valeurs négatives signifient que les valeurs aberrantes ont été supprimées (réduction des comptages gonflés)
- Heatmap de l'exhaustivité : les valeurs positives signifient que les lacunes ont été comblées (augmentation du volume total)
- Les ajustements importants (couleurs foncées) indiquent les zones/indicateurs avec des problèmes de qualité des données
- Utilisez ces résultats pour identifier où concentrer les efforts d'amélioration de la qualité des données
- Comparez les régions : lesquelles ont plus de problèmes de valeurs aberrantes vs de problèmes d'exhaustivité ?
-->
