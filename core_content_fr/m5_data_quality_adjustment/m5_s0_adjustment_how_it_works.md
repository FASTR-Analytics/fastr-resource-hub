---
marp: true
theme: fastr
paginate: true
---

## Correction des données : comment FASTR répare les problèmes

Plutôt que de jeter les données problématiques, FASTR les **remplace par des estimations raisonnables** — comme remplacer une lecture de compteur défaillante par la moyenne des mois voisins.

**Valeurs extrêmes →** Remplacées par la moyenne des 6 mois autour
**Mois manquants →** Comblés avec la tendance historique de l'établissement

FASTR produit **4 versions** des données pour comparaison :

| Version | Ce qu'elle contient |
|---------|-------------------|
| Données brutes | Aucune modification |
| Aberrantes corrigées | Pics extrêmes lissés |
| Complétude ajustée | Mois manquants comblés |
| Les deux ajustements | Aberrantes lissées + mois manquants comblés |

Vous pouvez comparer les résultats entre les 4 versions. Si vos conclusions changent, c'est un signal que la qualité des données mérite attention.
