---
marp: true
theme: fastr
paginate: true
---

## De la détection à la correction

Le module 1 a signalé les problèmes de qualité des données — valeurs extrêmes, rapports manquants, incohérences internes. Le module 2 prend le relais.

FASTR remplace les valeurs signalées par des estimations raisonnables tirées de l'historique de chaque établissement, pour que les analyses d'utilisation des services et de couverture en aval travaillent à partir de données plus propres.

Pour assurer la transparence, FASTR produit **quatre jeux de données parallèles** :

- **Non ajusté** — valeurs déclarées initiales
- **Valeurs aberrantes ajustées** — valeurs extrêmes remplacées
- **Complétude ajustée** — valeurs manquantes imputées
- **Les deux ajustements** — toutes les corrections appliquées

Les diapositives suivantes présentent chaque ajustement et sa sortie.
