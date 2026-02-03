---
marp: true
theme: fastr
paginate: true
---

## Méthodologie de l'ajustement d'exhaustivité

Pour les mois identifiés comme incomplets ou manquants, les valeurs sont imputées en utilisant la même approche de moyenne mobile sur 6 mois que celle appliquée à l'ajustement des valeurs aberrantes.

| Priorité | Méthode | Application |
|----------|--------|-------------|
| 1 | Moyenne centrée sur 6 mois | Lorsque des données suffisantes existent avant et après la lacune |
| 2 | Moyenne sur 6 mois vers l'avant | Pour les lacunes au début de la série temporelle |
| 3 | Moyenne sur 6 mois vers l'arrière | Pour les lacunes à la fin de la série temporelle |
| 4 | Moyenne historique de l'établissement | Moyenne de toutes les valeurs valides pour cet indicateur dans cet établissement |

Cette approche permet d'éviter que des lacunes temporaires dans les rapports ne créent des baisses artificielles dans les volumes de services.
