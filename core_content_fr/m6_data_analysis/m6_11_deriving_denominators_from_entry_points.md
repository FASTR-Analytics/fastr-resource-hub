---
marp: true
theme: fastr
paginate: true
---

## Dérivation des dénominateurs à partir des points d'entrée

Chaque indicateur SIGS (CPN1, accouchements, BCG, Penta1) sert de **point d'entrée** pour calculer les dénominateurs. À partir de n'importe quel point d'entrée, la cascade dérive les autres populations dans les deux sens :

- **En aval :** Appliquer les taux de mortalité/attrition pour descendre dans la cascade
  - *Exemple :* Éligible au DTC → Éligible à la rougeole1 → Éligible à la rougeole2
- **En amont :** Inverser les taux de mortalité (rajouter les décès) pour remonter dans la cascade
  - *Exemple :* Penta1 → Naissances vivantes → Accouchements → Grossesses

Cela nous donne **plusieurs estimations de dénominateurs indépendantes** pour chaque population cible, nous permettant de sélectionner la plus précise.

<!--
PRESENTER NOTES:
- Chaque indicateur SIGS peut servir de point d'entrée pour le calcul du dénominateur
- La cascade fonctionne dans deux directions - avant et arrière
- En aval : appliquer les taux de mortalité pour obtenir les populations en aval
- En amont : inverser la logique (rajouter les décès) pour obtenir les populations en amont
- Exemple : à partir de Penta1, on peut estimer les naissances vivantes, puis les accouchements, puis les grossesses
- Plusieurs points d'entrée nous donnent plusieurs estimations de dénominateurs indépendantes
- Avoir plusieurs estimations permet la validation et la sélection de la meilleure option
-->
