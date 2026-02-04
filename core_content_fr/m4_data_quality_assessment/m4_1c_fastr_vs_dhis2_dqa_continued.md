---
marp: true
theme: fastr
paginate: true
---

## En quoi l'analyse de la qualité des données FASTR diffère-t-elle de l'analyse AQD effectuée dans DHIS2 ?

<div style="font-size: 0.8em;">

**Sélection des indicateurs, mesures et seuils (suite)**

L'objectif de l'évaluation de la qualité des données guide la sélection des indicateurs, mesures et seuils.

- L'AQD de DHIS2 évalue quatre mesures de cohérence interne : présence de valeurs aberrantes, cohérence dans le temps, cohérence entre indicateurs connexes, et cohérence entre les données déclarées et les registres originaux (cette métrique nécessite une évaluation sur site / collecte de données). FASTR se concentre sur deux de ces mesures : présence de valeurs aberrantes et cohérence entre indicateurs connexes car celles-ci sont importantes pour l'analyse et peuvent être effectuées de manière routinière et à distance sans visites aux établissements de santé.

- FASTR et l'AQD de DHIS2 utilisent différentes méthodes de détection des valeurs aberrantes (EAM vs écarts-types) ; FASTR se concentre sur l'identification des valeurs aberrantes TRÈS importantes qui ont une influence indue sur l'analyse et pour lesquelles des ajustements seront effectués ; l'AQD de DHIS2 se concentre sur l'identification des valeurs aberrantes qui doivent faire l'objet d'un suivi au niveau de l'établissement, sans impact négatif significatif même si quelques valeurs correctes sont signalées comme valeurs aberrantes potentielles, car celles-ci feront l'objet d'une enquête approfondie.

- L'AQD de DHIS2 peut évaluer l'accord avec des sources de données externes telles que les enquêtes périodiques en population et la cohérence des données de population qui servent de dénominateur pour l'analyse de couverture. FASTR n'inclut pas cela dans l'évaluation de la qualité des données mais l'intègre plutôt dans notre analyse de couverture.

</div>
