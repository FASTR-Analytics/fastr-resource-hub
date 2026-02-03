---
marp: true
theme: fastr
paginate: true
---

<!-- _class: columns-image-right -->

## Format et granularité des données

![h:200 Data format wide](../../resources/screenshots/data_format_wide.png)

- Les données doivent être téléchargées pour chaque **indicateur d'intérêt**, au **niveau de l'établissement**, et **mensuellement** pour la **période d'intérêt**
- Les données doivent être sauvegardées en format long, ce qui signifie que chaque ligne représente une observation ou une mesure unique (voir l'exemple)
- Les données doivent être enregistrées au format .csv et peuvent être enregistrées dans un seul fichier .csv ou dans plusieurs fichiers .csv qui seront combinés lors du téléchargement vers la plateforme d'analyse

<!--
PRESENTER NOTES:
- Nous voulons utiliser les données les plus granulaires auxquelles nous avons accès afin de procéder à des évaluations plus fines de la qualité des données et des ajustements
- Nous voulons également pouvoir observer les tendances dans le temps, en tenant compte de la saisonnalité
- L'utilisation de données mensuelles au niveau de l'établissement nous permet de réaliser l'analyse la plus solide
-->
