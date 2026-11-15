---
marp: true
theme: fastr
paginate: true
---

## Produits, dossiers et portées

<style scoped>
.container { display: flex; gap: 1rem; }
.container .img-col { flex: 2; }
.container .img-col img { width: 100%; height: auto; }
.container .text-col { flex: 1; font-size: 0.85em; }
</style>

<div class="container">
<div class="img-col">

![Produits, dossiers et portées au sein d'une instance](../../resources/diagrams_fr/products_folders_scopes.svg)

</div>
<div class="text-col">

Une seule page **Produits** pour le pays : chaque visualisation, présentation et rapport, rangés en **dossiers**.

Chaque produit lit un **paquet de résultats** (quel calcul) à travers une **portée** (quelle partie des données).

**Questions clés lors de la configuration :**

- Quel paquet est épinglé ?
- De quelles portées l'équipe a-t-elle besoin ?
- Qui peut ouvrir ou modifier quoi ?

</div>
</div>
