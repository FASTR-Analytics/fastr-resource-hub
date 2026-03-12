---
marp: true
theme: fastr
paginate: true
---

## Processus analytique en deux parties

Le module d'estimation de la couverture fonctionne en deux parties séquentielles :

| Partie | Composants |
|------|------------|
| **Partie 1 : Calcul du dénominateur** | Calcul des populations cibles à l'aide de plusieurs méthodes ; comparaison avec les références de l'enquête ; sélection du dénominateur optimal pour chaque indicateur |
| **Partie 2 : Estimation de la couverture** | Appliquer les choix de dénominateurs ; projeter les estimations de l'enquête vers l'avant en utilisant les tendances du SIGS ; générer les estimations finales de la couverture |

<!--
PRESENTER NOTES:
- Le module 4 convertit les volumes de services en pourcentages de couverture
- Couverture = services / population cible - le défi est de connaître la population cible
- Le SIGS utilise généralement les populations de zones de desserte qui sont souvent inexactes
- Notre approche : dériver les dénominateurs des données SIGS validées par rapport aux enquêtes
- Processus en deux parties : la partie 1 calcule et valide les dénominateurs, la partie 2 génère les estimations
- Cela permet de suivre les tendances et les disparités infranationales de la couverture
-->
