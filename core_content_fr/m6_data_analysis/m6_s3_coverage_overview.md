---
marp: true
theme: fastr
paginate: true
---

## Estimation de la couverture des services

**Couverture** = services fournis ÷ population cible

![Équation de la couverture h:100](../../resources/diagrams/coverage_equation.svg)

Le SIGS nous indique combien de services ont été fournis (numérateur), mais pas la taille de la population cible (dénominateur). La couverture SIGS standard utilise les populations de zones de desserte, qui sont souvent inexactes. Les enquêtes (EDS/MICS) fournissent une couverture fiable mais seulement tous les 3-5 ans.

---

## Comment FASTR estime la couverture

**Calculer les dénominateurs de plusieurs façons :** À partir des données SIGS, utiliser les volumes de services combinés à la couverture de l'enquête pour calculer à rebours les populations cibles. Par exemple, si 10 000 visites CPN1 et l'enquête indique 80% de couverture, cela implique environ 12 500 grossesses. Calculer également les dénominateurs à partir des projections de population de l'ONU en utilisant les taux de natalité et les ajustements démographiques.

**Valider par rapport aux enquêtes :** Calculer la couverture en utilisant chaque option de dénominateur, comparer aux références d'enquête, et sélectionner le dénominateur avec la plus petite erreur.

**Projeter la couverture vers l'avant :** S'ancrer à la dernière valeur d'enquête et appliquer les tendances SIGS d'une année sur l'autre pour étendre les estimations aux années post-enquête.

<!--
PRESENTER NOTES:
- Aperçu condensé de la méthodologie d'estimation de la couverture
- Point clé : les dénominateurs SIGS standard (populations de zones de desserte) sont souvent inexacts
- Approche FASTR : dériver les dénominateurs des données, valider par rapport aux enquêtes
- Exemple de calcul : 10 000 CPN1 / 80% couverture = 12 500 grossesses
- Plusieurs options de dénominateurs comparées pour sélectionner le meilleur ajustement
- Les projections étendent les enquêtes vers l'avant en utilisant les tendances SIGS
- Résultat : estimations de couverture plus fiables pour le suivi
-->
