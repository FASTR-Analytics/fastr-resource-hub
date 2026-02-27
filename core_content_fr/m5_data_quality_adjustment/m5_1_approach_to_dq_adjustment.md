---
marp: true
theme: fastr
paginate: true
---

## Justification de l'ajustement de la qualité des données

Les données de routine du SIGS présentent deux limites communes qui peuvent fausser les résultats analytiques :
- **Valeurs aberrantes :** Les valeurs extrêmes créent des pics artificiels dans les volumes de services
- **Rapports incomplets :** Les données manquantes créent des baisses artificielles qui ne reflètent pas la prestation réelle de services

FASTR répond à ces limitations en remplaçant les valeurs problématiques par des estimations dérivées des modèles de rapports historiques de chaque établissement.

**Scénarios d'ajustement :** Pour favoriser la transparence et l'analyse de sensibilité, FASTR produit quatre ensembles de données parallèles :
- **Non ajusté :** Valeurs déclarées originales
- **Valeurs aberrantes ajustées :** Valeurs extrêmes remplacées
- **Complétude ajustée :** Valeurs manquantes imputées
- **Les deux ajustés :** Toutes les corrections appliquées

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
