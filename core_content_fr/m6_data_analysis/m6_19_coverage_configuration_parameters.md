---
marp: true
theme: fastr
paginate: true
---

## Module de couverture : Paramètres de configuration

<div style="font-size: 0.8em;">

| Paramètre | Description |
|-----------|-------------|
| **Valeur de comptage à utiliser** | Valeur de comptage ajustée à utiliser pour le calcul de la couverture |
| **Niveau pour lequel calculer la couverture** | Niveaux géographiques pour l'estimation de la couverture : national, provincial (zone administrative 2) ou district (zone administrative 3) |
| **Taux de perte de grossesse** | Proportion de grossesses se terminant par une perte avant l'accouchement |
| **Taux de jumeaux** | Proportion d'accouchements donnant lieu à la naissance de jumeaux |
| **Taux de mortinatalité** | Proportion de naissances mort-nées |
| **Taux de mortalité néonatale** | Décès au cours des 28 premiers jours par naissance vivante |
| **Taux de mortalité postnéonatale** | Décès entre 28 jours et 1 an par naissance vivante |
| **Taux de mortalité infantile** | Décès avant l'âge de 1 an par naissance vivante |
| **Taux de mortalité des moins de 5 ans** | Décès avant l'âge de 5 ans par naissance vivante |

</div>

Les taux de mortalité spécifiques à un pays peuvent être obtenus à partir des rapports des EDS, de l'IGME des Nations unies ou des statistiques nationales de l'état civil.

<!--
PRESENTER NOTES:
- Les paramètres de configuration contrôlent les calculs des dénominateurs
- Variable de comptage : quelles données ajustées utiliser (recommandé "both")
- Niveaux d'analyse : national, provincial, district - choisir en fonction de la qualité des données
- Taux démographiques : valeurs par défaut fournies mais utiliser les valeurs spécifiques au pays
- Sources pour les taux : rapports EDS, estimations IGME de l'ONU, statistiques nationales de l'état civil
- Les taux de mortalité affectent significativement les calculs des dénominateurs
- Mortalité plus élevée = dénominateurs de population survivante plus petits
-->
