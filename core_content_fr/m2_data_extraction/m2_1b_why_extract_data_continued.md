---
marp: true
theme: fastr
paginate: true
---

<!-- _class: columns-image-right -->

## Format et granularité des données

![h:200 Data format wide](../../resources/screenshots/data_format_wide.png)

- Les données doivent être téléchargées pour chaque **indicateur de santé** (par ex. visites CPN1, vaccinations BCG), au **niveau de l'établissement** (centres de santé individuels), et **mensuellement** pour la **période d'intérêt**
- Les données doivent être en format long — une ligne par observation (par ex. une ligne = un établissement, un mois, un indicateur)
- Les données doivent être enregistrées en fichier `.csv` (un format tableur simple) — soit un fichier unique, soit plusieurs fichiers qui seront combinés lors du téléchargement vers la plateforme FASTR

<!--
PRESENTER NOTES:
- Nous voulons utiliser les données les plus granulaires auxquelles nous avons accès afin de procéder à des évaluations plus fines de la qualité des données et des ajustements
- Nous voulons également pouvoir observer les tendances dans le temps, en tenant compte de la saisonnalité
- L'utilisation de données mensuelles au niveau de l'établissement nous permet de réaliser l'analyse la plus solide
-->
