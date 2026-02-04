---
marp: true
theme: fastr
paginate: true
---

## Évaluation de la qualité des données

L'analyse FASTR suit un flux de travail séquentiel :

1. **Évaluer la qualité des données** - Identifier les problèmes de complétude, valeurs aberrantes et cohérence
2. **Ajuster pour les problèmes de qualité** - Appliquer des corrections pour améliorer la fiabilité des données
3. **Analyser les données ajustées** - Générer des estimations d'utilisation des services et de couverture

![Pipeline analytique h:200](../../resources/diagrams/analytical_pipeline.svg)

**Philosophie :** La qualité des données ne doit pas être un obstacle à l'utilisation des données. Utiliser les données et fournir un retour d'information est la première étape vers l'amélioration de la qualité des données.

<!--
PRESENTER NOTES:
- FASTR adopte une approche multidimensionnelle de la qualité des données
- Accent sur les indicateurs à haut volume pour des estimations plus stables
- Mettre l'accent sur la variation dans le temps et l'espace plutôt que sur les estimations ponctuelles
- Interpréter les résultats en collaboration avec les décideurs dans le pays
-->
