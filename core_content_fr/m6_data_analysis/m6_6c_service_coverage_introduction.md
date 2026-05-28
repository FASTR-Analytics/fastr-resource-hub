---
marp: true
theme: fastr
paginate: true
---

## Processus analytique en deux parties

Le module d'estimation de la couverture fonctionne en deux parties séquentielles :

| Partie | Composants |
|------|------------|
| **Partie 1 : Calcul du dénominateur** | Construire quatre chaînes candidates en combinant les volumes SIGS et la couverture d'enquête à chaque point d'entrée, puis étendre via les paramètres démographiques. Comparer les chaînes à UN WPP et retenir celle dont le ratio médian à UN WPP est le plus proche de 1,0. |
| **Partie 2 : Estimation de la couverture** | Appliquer la chaîne retenue à tous les indicateurs. Projeter les valeurs d'enquête dans les années post-enquête à l'aide des écarts SIGS d'une année sur l'autre. Générer les estimations finales de couverture aux niveaux national et infranational. |

<!--
PRESENTER NOTES:
- Couverture = services / population cible - le défi est de connaître la population cible
- Le SIGS utilise généralement les populations de zones de desserte qui sont souvent inexactes
- Notre approche : dériver les dénominateurs des données SIGS validées par rapport aux enquêtes
- La partie 1 calcule et valide les dénominateurs, la partie 2 génère les estimations
- Cela permet de suivre les tendances et les disparités infranationales de la couverture
-->
