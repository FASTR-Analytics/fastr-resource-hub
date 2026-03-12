---
marp: true
theme: fastr
paginate: true
---

<!-- _class: compact -->

## Score résumé de la qualité des données

Les résultats des contrôles de valeurs aberrantes, de complétude et de cohérence sont combinés en un score AQD global pour un ensemble d'indicateurs clés (Penta1, CPN1, OPD).

**Deux mesures complémentaires :**

- **Score AQD global :** Pourcentage d'établissements-mois passant **tous** les contrôles de qualité. Un établissement-mois obtient 100% uniquement si tous les indicateurs clés sont complets, sans valeurs aberrantes et cohérents
- **Score AQD moyen :** Moyenne du score complétude-valeurs aberrantes et du score de cohérence. Capture les progrès partiels même lorsque tous les contrôles ne sont pas réussis

**Un établissement-mois a une qualité de données adéquate lorsque :**

- Toutes les données des indicateurs clés sont rapportées (complets)
- Aucune valeur n'est signalée comme aberrante
- Les seuils de cohérence sont atteints pour les paires d'indicateurs disponibles (ex. Penta1/Penta3, CPN1/CPN4)

**Guide rapide :** Au-dessus de 80 % = fiable pour l'analyse. 60-80 % = utilisable avec prudence. En dessous de 60 % = investiguer avant d'utiliser.

**Essayez :** Vérifiez le score AQD de votre région. Est-il au-dessus ou en dessous de 80 % ? Si en dessous, quelle dimension le tire vers le bas ?

<!--
PRESENTER NOTES:
- Le score AQD global est strict : tout ou rien. Un seul contrôle échoué = 0%
- Le score AQD moyen est plus nuancé : montre à quel point les établissements sont proches de répondre à tous les critères
- Exemple : si le score complétude-valeurs aberrantes est 1.0 mais la cohérence est 0.5, AQD moyen = 0.75 (75%)
- Utilisez le score global pour identifier les zones problématiques ; utilisez le score moyen pour suivre les améliorations
- Cela complète le module AQD - ensuite nous verrons comment ajuster pour ces problèmes
-->
