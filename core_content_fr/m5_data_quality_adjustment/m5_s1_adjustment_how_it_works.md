---
marp: true
theme: fastr
paginate: true
---

## Comment fonctionne l'ajustement

Les valeurs aberrantes et les valeurs manquantes sont remplacées par des **moyennes mobiles sur 6 mois** tirées de l'historique propre à chaque établissement. La même approche hiérarchique s'applique aux deux ajustements :

| Priorité | Méthode | Quand l'appliquer |
|---|---|---|
| 1 | Moyenne centrée sur 6 mois | Données suffisantes avant et après la valeur |
| 2 | Moyenne sur 6 mois vers l'avant | La valeur se situe en début de série |
| 3 | Moyenne sur 6 mois vers l'arrière | La valeur se situe en fin de série |
| 4 | Moyenne historique de l'établissement | Solution de repli si les moyennes mobiles ne sont pas possibles |

Le remplacement repose sur le profil propre à chaque établissement, donc chaque ajustement reste ancré dans ce que cet établissement déclare habituellement.
