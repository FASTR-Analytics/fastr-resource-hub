---
marp: true
theme: fastr
paginate: true
---

## Comment fonctionne l'ajustement des valeurs aberrantes

Pour chaque valeur signalée, FASTR calcule une **moyenne mobile** à partir des mois voisins — une fenêtre de six mois qui capte le niveau de rapportage habituel de l'établissement sans être faussée par la valeur aberrante elle-même. La valeur aberrante est ensuite remplacée par cette moyenne.

Lorsqu'une fenêtre centrée de six mois n'est pas possible (par exemple, la valeur se situe près du début ou de la fin de la série), FASTR recourt à une hiérarchie d'alternatives :

| Priorité | Méthode | Quand l'appliquer |
|---|---|---|
| 1 | Moyenne centrée sur 6 mois | 3 mois avant + 3 mois après la valeur aberrante |
| 2 | Moyenne sur 6 mois vers l'avant | Données précédentes insuffisantes (valeur près du début de la série) |
| 3 | Moyenne sur 6 mois vers l'arrière | Données suivantes insuffisantes (valeur près de la fin de la série) |
| 4 | Même mois, année précédente | Quand les moyennes mobiles ne sont pas possibles ; utile pour les indicateurs fortement saisonniers |
| 5 | Moyenne historique de l'établissement | Solution de repli finale quand aucune donnée comparable récente n'est disponible |

Le remplacement reste toujours ancré dans l'historique propre à l'établissement — jamais importé d'un autre établissement ou d'une moyenne nationale.
