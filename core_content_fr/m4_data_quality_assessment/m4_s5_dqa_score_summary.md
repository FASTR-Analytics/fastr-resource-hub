---
marp: true
theme: fastr
paginate: true
---

## Score résumé de la qualité des données

Une mesure composite de la qualité des données donne une vue d'ensemble de la manière dont un ensemble de données répond aux normes de qualité.

En intégrant plusieurs dimensions de la qualité des données dans un score unique, elle simplifie l'interprétation des informations détaillées provenant de plusieurs mesures. Cela permet aux systèmes de santé d'évaluer rapidement la fiabilité des données, facilitant l'identification des tendances et des problèmes en un coup d'œil.

**Définition d'une qualité de données adéquate :**

- Pas de données d'indicateur manquantes pour OPD, Penta1 et CPN1, lorsque disponibles
- Pas de valeurs aberrantes pour OPD, Penta1 et CPN1, lorsque disponibles
- Rapportage cohérent entre Penta1/Penta3 et CPN1/CPN4

<!--
PRESENTER NOTES:
- Le score AQD combine toutes les dimensions en un seul score résumé
- 100% = complet + pas de valeurs aberrantes + cohérent - l'objectif pour des données de qualité
- Utilisez la heatmap pour identifier les domaines prioritaires pour l'amélioration de la qualité des données
- Cela complète le module AQD - ensuite nous verrons comment ajuster pour ces problèmes
-->

---

## Sortie du score global de qualité des données

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Sortie score AQD](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**Ce que vous voyez :** Heatmap montrant le score AQD global par indicateur et région, codé par couleur du rouge (mauvais) au vert (bon).

**Formule :** % AQD = (valeurs complètes, sans valeurs aberrantes et cohérentes) / (total des valeurs) × 100

**Interprétation :** 100% = passe tous les contrôles. Utilisez ceci pour prioriser les efforts d'amélioration de la qualité des données par région et indicateur.

</div>
</div>

---

## Sortie du score AQD moyen

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Score AQD moyen](../../resources/default_outputs/Default_6._Mean_DQA_score.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**Ce que vous voyez :** Heatmap montrant le score AQD moyen des établissements par indicateur et région.

**Formule :** AQD moyen = (valeurs complètes, sans valeurs aberrantes et cohérentes) / (total des valeurs) × 100

**Interprétation :** Montre à quel point les établissements sont proches de répondre à tous les critères de qualité. Un score de 100% signifie que les données passent tous les contrôles AQD.

</div>
</div>
