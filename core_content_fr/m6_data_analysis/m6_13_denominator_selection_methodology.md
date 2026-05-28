---
marp: true
theme: fastr
paginate: true
---

## Méthodologie de sélection du dénominateur

FASTR construit **quatre chaînes de dénominateurs candidates**, chacune ancrée sur un service d'entrée HMIS différent (CPN1, accouchements, BCG, Penta1). Pour chaque chaîne, la plateforme :

1. **Rétro-calcule la population du point d'entrée** en combinant le volume de service SIGS avec la couverture d'enquête la plus récente pour ce service. (Exemple : volume CPN1 ÷ couverture CPN1 d'enquête → estimation des grossesses.)
2. **Étend la chaîne via la cascade démographique** en appliquant des paramètres propres au pays — perte de grossesse, mortinatalité, mortalité néonatale et post-néonatale — pour dériver les autres populations cibles dont la chaîne a besoin (naissances vivantes, nourrissons survivants, etc.).

Pour choisir entre les quatre chaînes, la plateforme compare chacune aux estimations de **UN World Population Prospects (UN WPP)** au niveau national et retient celle dont le ratio médian à UN WPP est le plus proche de 1,0.

**Une seule chaîne, appliquée uniformément.** La chaîne retenue est ensuite utilisée pour tous les indicateurs et tous les niveaux géographiques de l'analyse.

**Surcharge utilisateur.** Dans la partie 2 (m006), un analyste peut surcharger la sélection automatique en fixant `DENOMINATOR_CHAIN` à une chaîne spécifique (`anc1`, `delivery`, `bcg` ou `penta1`) si des considérations programmatiques justifient un autre choix.

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
