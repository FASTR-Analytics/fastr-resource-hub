---
marp: true
theme: fastr
paginate: true
---

## Résumé de la qualité des données

Une mesure composite de la qualité des données donne une vue d'ensemble de la manière dont un ensemble de données répond aux normes de qualité.

En intégrant plusieurs dimensions de la qualité des données dans un score unique, elle simplifie l'interprétation des informations détaillées provenant de plusieurs mesures. Les systèmes de santé peuvent ainsi évaluer rapidement la fiabilité des données, ce qui facilite l'identification des tendances et des problèmes en un coup d'œil.

---

## Définition d'une qualité de données adéquate

Pour l'analyse FASTR, nous avons défini la qualité adéquate des données comme suit :

- Pas de données manquantes pour les indicateurs OPD, Penta1 et CPN1, si disponibles, **ET**
- Pas de données aberrantes pour OPD, Penta1 et CPN1, lorsqu'elles sont disponibles, **ET**
- Rapports cohérents entre Penta1/Penta3 et CPN1/CPN4

---

## Score global du CQD : Pourcentage de valeurs mensuelles répondant à tous les critères

Pour un indicateur donné et une période donnée, le pourcentage de valeurs mensuelles répondant à tous les critères du CQD :

**% de qualité adéquate = # de valeurs mensuelles répondant à tous les critères / N total de valeurs mensuelles**

![Score AQD global h:340](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

---

## Score moyen de l'AQD : Dans quelle mesure sommes-nous proches d'une qualité adéquate ?

Le score moyen de l'AQD indique dans quelle mesure les données d'un établissement répondent à tous les critères de qualité. Un score de **100% signifie que les données passent** tous les contrôles du CQD - pas de valeurs manquantes, pas de valeurs aberrantes et des rapports cohérents.

**AQD moyen = (score d'exhaustivité et de valeurs aberrantes + score de cohérence) / 2**


![Score AQD moyen h:320](../../resources/default_outputs/Default_6._Mean_DQA_score.png)
