---
marp: true
theme: fastr
paginate: true
---

## Méthodologie de sélection du dénominateur

La plateforme FASTR sélectionne la méthode de dénominateur qui produit des estimations de couverture **les plus proches des références d'enquête** (EDS/MICS). Elle calcule la couverture en utilisant toutes les méthodes de dénominateur disponibles, compare chaque résultat aux estimations de couverture de l'enquête, et sélectionne le dénominateur avec la **plus petite erreur** par rapport à l'enquête. Cette approche minimise l'écart entre les estimations basées sur le SIGS et celles basées sur l'enquête, faisant du dénominateur sélectionné le plus fiable pour estimer la couverture réelle.

Chaque indicateur (CPN1, CPN4, accouchements, etc.) peut utiliser une **méthode de dénominateur différente**. Cependant, pour un indicateur donné, la **même méthode est utilisée pour tous les points temporels et toutes les zones infranationales** pour assurer la cohérence. La sélection est effectuée au **niveau national**, puis appliquée uniformément à tous les niveaux géographiques.

<!--
PRESENTER NOTES:
- Nous avons plusieurs façons de calculer les dénominateurs - laquelle est la meilleure ?
- Les données d'enquête (EDS/MICS) sont notre référence pour la couverture
- Nous testons chaque méthode de dénominateur et choisissons celle la plus proche de l'enquête
- La sélection se fait au niveau national en utilisant les données d'enquête nationales
- La méthode sélectionnée est ensuite appliquée à toutes les zones infranationales
- Cela assure la cohérence : même méthode pour toutes les régions et tous les points temporels au sein d'un indicateur
- Différents indicateurs peuvent utiliser différentes méthodes (CPN1 peut en utiliser une, Penta1 une autre)
- Les utilisateurs peuvent remplacer les sélections automatiques si nécessaire
-->
