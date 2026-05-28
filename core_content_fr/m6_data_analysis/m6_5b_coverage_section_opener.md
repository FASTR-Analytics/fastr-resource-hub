---
marp: true
theme: fastr
paginate: true
---

## Estimation de la couverture

Nous avons traité l'utilisation des services — ce qui a été rapporté et où les volumes évoluent. L'estimation de la couverture répond à une autre question : **quelle part de la population cible a effectivement reçu chaque service**.

FASTR construit la couverture en deux parties :

- D'abord, il construit et valide les chaînes de dénominateurs.
- Ensuite, il applique la chaîne retenue pour calculer la couverture, et projette les valeurs entre les enquêtes.

Diviser en deux parties permet de revoir et surcharger la chaîne de dénominateur indépendamment.
