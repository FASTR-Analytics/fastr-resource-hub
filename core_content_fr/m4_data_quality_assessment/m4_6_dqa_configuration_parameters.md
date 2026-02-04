---
marp: true
theme: fastr
paginate: true
---

## Module AQD : Paramètres de configuration

| Paramètre | Description |
|-----------|-------------|
| **Seuil de proportion pour la détection des valeurs aberrantes** | Ajuste le seuil de contribution proportionnelle pour signaler un mois d'établissement comme aberrant |
| **Seuil de comptage minimum** | Définit le comptage minimum requis pour qu'un mois d'établissement soit considéré comme une valeur aberrante |
| **Nombre d'EAM** | Les valeurs aberrantes sont définies comme des observations supérieures à X fois l'écart absolu médian (EAM) par rapport à la valeur médiane mensuelle de l'indicateur pour chaque période |
| **Indicateurs soumis à l'AQD** | Définit quels indicateurs sont inclus pour l'évaluation des valeurs aberrantes et de la complétude pour l'inclusion dans le score de l'AQD |
| **Paires de cohérence utilisées** | Définit les paires d'indicateurs utilisées pour l'analyse de cohérence et les fourchettes de ratios attendues |

<!--
PRESENTER NOTES:
- Ces paramètres peuvent être ajustés dans les paramètres de la plateforme
- Les valeurs par défaut fonctionnent bien pour la plupart des contextes mais peuvent être personnalisées
- Le multiplicateur EAM de 10 est conservateur - ne signale que les valeurs aberrantes extrêmes
- Le comptage minimum de 100 empêche les établissements à faible volume d'être trop signalés
- Les paires de cohérence peuvent être modifiées en fonction des indicateurs que vous analysez
-->
