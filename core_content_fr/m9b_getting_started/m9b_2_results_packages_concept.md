---
marp: true
theme: fastr
paginate: true
---

## D'où viennent les chiffres d'un produit

**Les données vivent au niveau de l'instance.** Les administrateurs les importent depuis DHIS2, une fois pour tout le pays.

**Les analyses sont calculées dans un paquet de résultats.** Un administrateur sélectionne les modules et génère un paquet : un ensemble versionné de résultats déjà calculés. Un paquet est **épinglé** comme référence.

**Chaque produit lit un paquet et une portée.** Une présentation, un rapport ou une visualisation les affiche dans sa ligne sur la page Produits, et dans le bouton en haut de son éditeur.

- Un nouveau mois de données ? → nouveau paquet → les produits y sont basculés
- Pour changer le paquet ou la portée d'un produit : son **menu ⋮ → Paquet de résultats et portée…**
- Pour voir les paquets eux-mêmes : l'entrée **Résultats** de la navigation latérale

<!--
NOTES PRÉSENTATEUR :
- Diapositive concept, ~5 min, avant que les participants ne se demandent pourquoi il n'y a pas de « données » à charger.
- Message clé : les participants n'exécutent jamais d'analyses. Les admins importent et génèrent ; les produits lisent.
- La seule chose à vérifier quand les chiffres semblent anciens : le paquet affiché sur le produit. Est-ce celui qui est épinglé ?
- Une portée est une vue nommée (une zone, une période). « Toutes les données » est la portée par défaut des nouveaux produits.
- Analogie : l'instance est la cuisine, le paquet est le plat prêt, le produit est l'assiette dans laquelle il est servi.
-->
