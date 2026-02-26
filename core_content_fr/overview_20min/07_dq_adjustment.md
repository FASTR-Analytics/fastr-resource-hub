---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output compact -->
## Ajustement de la qualité des données

<div class="output-layout">
<div class="output-text">

**Pourquoi ajuster ?** Les valeurs aberrantes et les lacunes de déclaration faussent l'analyse si elles ne sont pas corrigées.

**Comment ?** Remplacer les valeurs problématiques par des moyennes mobiles sur 6 mois basées sur l'historique de chaque établissement.

**Quatre scénarios pour l'analyse de sensibilité :**

| Scénario | Ce qu'il montre |
|----------|-----------------|
| Non ajusté | Données brutes telles que déclarées |
| Valeurs aberrantes uniquement | Valeurs élevées lissées |
| Complétude uniquement | Lacunes comblées |
| Les deux ajustés | Correction complète appliquée |

**Exclus :** Indicateurs de mortalité et indicateurs à faible volume (<100/mois)

</div>
<div class="output-viz">

![Ajustement des valeurs aberrantes h:180](../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

![Ajustement de la complétude h:180](../../resources/default_outputs/Default_2._Percent_change_in_volume_due_to_completeness_adjustment.png)

</div>
</div>

<!--
PRESENTER NOTES:
- La comparaison des scénarios montre à quel point les résultats dépendent des choix d'ajustement
- L'ajustement des valeurs aberrantes réduit généralement le volume (supprime les valeurs gonflées)
- L'ajustement de la complétude augmente généralement le volume (comble les lacunes)
- Les ajustements importants indiquent les zones nécessitant une attention particulière à la qualité des données
-->
