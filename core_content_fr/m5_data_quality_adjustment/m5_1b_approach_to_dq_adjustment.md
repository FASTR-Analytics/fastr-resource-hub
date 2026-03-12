---
marp: true
theme: fastr
paginate: true
---

## Indicateurs exclus de l'ajustement

Certains indicateurs sont exclus du processus d'ajustement :

- **Indicateurs de mortalité** (décès maternels, décès néonatals, décès d'enfants de moins de 5 ans) : Ils représentent des événements discrets pour lesquels le lissage ou l'imputation ne sont pas appropriés
- **Indicateurs de faible volume** : Les indicateurs qui ne dépassent jamais 100 événements déclarés au cours d'un mois donné sont exclus de l'ajustement

<!--
PRESENTER NOTES:
- Ce module traite les problèmes identifiés dans l'évaluation de la qualité des données
- Concept clé : nous remplaçons les valeurs problématiques par des estimations basées sur l'historique propre de l'établissement
- Quatre ensembles de données parallèles permettent l'analyse de sensibilité - dans quelle mesure les résultats changent-ils ?
- La mortalité est exclue car le lissage d'événements rares et discrets n'est pas approprié
- Les faibles volumes sont exclus car l'ajustement ajoute du bruit à des données déjà éparses
-->
