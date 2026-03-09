---
marp: true
theme: fastr
paginate: true
---

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

---

<!-- _class: output -->
## Sortie du score global de qualité des données

<div class="output-layout">
<div class="output-viz">

![Sortie score AQD](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

</div>
<div class="output-text">

**Ce que vous voyez :** Heatmap montrant le pourcentage d'établissements-mois qui passent **tous** les contrôles de qualité, par indicateur et région.

**Score :** Binaire — chaque établissement-mois est soit adéquat (passe tous les contrôles) soit non. Le pourcentage reflète la part qui réussit.

**Interprétation :** Une mesure stricte. Des scores bas indiquent que de nombreux établissements-mois échouent à au moins un contrôle. Utilisez ceci pour identifier les régions et indicateurs nécessitant une amélioration.

</div>
</div>

---

<!-- _class: output -->
## Sortie du score AQD moyen

<div class="output-layout">
<div class="output-viz">

![Score AQD moyen](../../resources/default_outputs/Default_6._Mean_DQA_score.png)

</div>
<div class="output-text">

**Ce que vous voyez :** Heatmap montrant le score AQD moyen des établissements-mois, par indicateur et région.

**Score :** Moyenne du score complétude-valeurs aberrantes et du score de cohérence. Varie de 0% à 100%.

**Interprétation :** Une mesure plus nuancée que le score global. Capture les progrès partiels — une région peut obtenir 75% même si tous les contrôles ne sont pas réussis. Utilisez ceci pour suivre les améliorations au fil du temps.

</div>
</div>
