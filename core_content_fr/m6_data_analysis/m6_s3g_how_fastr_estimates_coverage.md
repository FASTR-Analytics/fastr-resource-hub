---
marp: true
theme: fastr
paginate: true
---

## Comment FASTR estime la couverture

En assemblant les pièces, FASTR estime la couverture en trois étapes :

1. **Construire les dénominateurs de plusieurs façons.** Recalculer rétrospectivement les populations cibles à partir de chaque point d'entrée SNIS (CPN1, accouchement assisté, BCG, Penta1) en combinant les volumes de services avec les valeurs de couverture issues d'enquêtes. *Exemple : 10 000 visites CPN1 à une couverture mesurée de 80 % impliquent ~12 500 grossesses.* En parallèle, dériver des dénominateurs à partir des projections démographiques de l'ONU.

2. **Sélectionner la meilleure chaîne.** Calculer la couverture avec chaque option de dénominateur et comparer le ratio médian entre dénominateurs SNIS et dénominateurs ONU. La chaîne dont le ratio médian est le plus proche de 1,0 est retenue et appliquée uniformément à tous les indicateurs.

3. **Projeter la couverture en avant.** S'ancrer à la dernière valeur d'enquête disponible et appliquer les tendances interannuelles SNIS pour prolonger les estimations de couverture dans les années post-enquête.

> Les enquêtes ancrent le calcul rétrospectif ; UN WPP arbitre entre les chaînes ; les tendances SNIS portent l'estimation vers l'avant.
