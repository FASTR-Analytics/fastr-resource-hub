---
marp: true
theme: fastr
paginate: true
---

## Pourquoi ajuster pour les valeurs aberrantes ?

![Pourquoi ajuster pour les valeurs aberrantes](../../resources/diagrams/outlier_impact.svg)

<!--
PRESENTER NOTES:
- Exemple visuel montrant l'impact d'une valeur aberrante sur l'interprétation des données
- Panneau gauche : données brutes avec un pic causé par une erreur de saisie — déforme la ligne de tendance
- Panneau droit : mêmes données après ajustement des valeurs aberrantes à l'aide de moyennes glissantes — la tendance sous-jacente est préservée
- Point clé : une seule valeur extrême peut tirer significativement les totaux nationaux ou régionaux, faussant les estimations d'utilisation des services et de couverture
- L'ajustement des valeurs aberrantes remplace la valeur extrême par une estimation plus plausible basée sur les données historiques de l'établissement
- Cela rend l'analyse en aval (tendances, perturbations, couverture) plus fiable
-->
