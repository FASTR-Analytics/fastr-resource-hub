---
marp: true
theme: fastr
paginate: true
---

## Un tableau de bord en quatre gestes

<div style="font-size: 0.9em;">

| Geste | Où | Quoi |
|---|---|---|
| **1. Définir** | Données → SNIS → Indicateurs | **Ajouter un indicateur** → type **Calculé** → formule, p. ex. `anc4 / anc1` |
| **2. Régler la règle** | Même formulaire, **Analyse et affichage** | **Format**, **Direction**, **Cible**, **Règle de mise en forme conditionnelle** (seuils, p. ex. 70 et 80) |
| **3. Générer** | Résultats → Générer un nouveau paquet de résultats | Cocher **Valeurs des indicateurs** ; l'épingler, et y déplacer les produits (**⋮ → Paquet de résultats et portée…**) |
| **4. Construire la table** | Produits → **Nouveau → Nouvelle visualisation** | Module **Valeurs des indicateurs** → mesure **Valeur de l'indicateur** → préréglage **Tableau de bord** → **Présentation → Mise en forme conditionnelle : Indicateur** |

</div>

Chaque cellule est colorée selon la règle de son propre indicateur, et la légende montre les tranches. Elle s'enregistre toute seule dans votre dossier ; insérez-en une copie dans un rapport ou une présentation.

<!--
NOTES POUR LE PRÉSENTATEUR :
- Le geste 2 est celui qu'on oublie : sans règle, la table a des chiffres mais pas de couleurs.
- Les changements de formules, de seuils ou de chiffres de population prennent effet dans le paquet SUIVANT, pas le courant. Régénérer après chaque changement.
- Les termes de population (population_pregnancies, population_infants…) viennent de la page Population de l'instance ; si la page n'a pas de chiffre pour une zone et une année, la cellule est omise, pas mise à zéro.
-->
