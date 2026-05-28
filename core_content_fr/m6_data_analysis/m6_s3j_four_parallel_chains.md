---
marp: true
theme: fastr
paginate: true
---

## Quatre chaînes parallèles, la meilleure gagne

CPN1 n'est pas le seul point d'entrée. FASTR exécute le même calcul rétrospectif à partir de **quatre services différents** :

- **CPN1** → estime les grossesses
- **Accouchement assisté** → estime les accouchements
- **BCG** → estime les naissances vivantes
- **Penta1** → estime les nourrissons éligibles DTC

Chaque point d'entrée produit une cascade complète. FASTR compare ensuite les quatre à UN World Population Prospects et **garde la chaîne dont le ratio médian est le plus proche de 1,0**. Cette chaîne retenue est ensuite appliquée uniformément à tous les indicateurs, pour que les estimations de couverture à travers le pays restent internement cohérentes.
