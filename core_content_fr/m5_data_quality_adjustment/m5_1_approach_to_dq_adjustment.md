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
