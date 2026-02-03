---
marp: true
theme: fastr
paginate: true
---

## Méthodologie d'ajustement des valeurs aberrantes

Les valeurs aberrantes sont remplacées par des données historiques spécifiques à l'établissement. L'ajustement suit une approche hiérarchique :

| Priorité | Méthode | Application |
|----------|--------|-------------|
| 1 | Moyenne centrée sur 6 mois | 3 mois avant + 3 mois après la valeur aberrante |
| 2 | Moyenne sur 6 mois vers l'avant | Lorsque les données précédentes sont insuffisantes (par exemple, début de série) |
| 3 | Moyenne sur 6 mois vers l'arrière | Lorsque les données suivantes sont insuffisantes (par exemple, fin de série) |
| 4 | Même mois, année précédente | Lorsque les moyennes glissantes ne sont pas disponibles ; utile pour les indicateurs saisonniers |
| 5 | Moyenne historique de l'établissement | Moyenne de toutes les valeurs valides pour cet indicateur dans cet établissement |
