---
marp: true
theme: fastr
paginate: true
---

## Analyse de l'utilisation des services

L'analyse de l'utilisation des services suit le nombre de services de santé fournis au fil du temps, identifiant les tendances, les anomalies et les comparaisons entre les zones.

<!-- _class: output -->

<div class="output-layout">
<div class="output-viz">

![Nombre de services déclarés h:300](../../resources/default_outputs/Module3_5_Number_of_services_reported.png)

</div>
<div class="output-text">

**Ce que vous voyez :** Graphique linéaire montrant les volumes de services absolus au fil du temps par indicateur.

**Ce qu'il montre :** Comptage des services fournis chaque mois/trimestre.

**Interprétation :** Recherchez les tendances globales (augmentation/diminution) et les baisses ou pics soudains qui peuvent nécessiter une investigation.

</div>
</div>

---

<!-- _class: output -->
## Résultat de la variation d'une année sur l'autre

<div class="output-layout">
<div class="output-viz">

![Changement du volume de service h:300](../../resources/default_outputs/Module3_1_Change_in_service_volume.png)

</div>
<div class="output-text">

**Ce que vous voyez :** Heatmap comparant la période actuelle à la même période l'année dernière, avec les changements > ±10% signalés.

**Formule :** Changement annuel % = (cette année - année dernière) / année dernière × 100

**Interprétation :** Les changements signalés nécessitent un suivi - s'agit-il d'un vrai changement de programme, d'un problème de données ou d'un événement attendu ?

</div>
</div>

<!--
PRESENTER NOTES:
- Version condensée combinant les tendances de service et la comparaison annuelle
- Le premier graphique montre les volumes absolus - identifier les schémas globaux
- Le deuxième graphique montre les changements relatifs - plus facile à comparer entre les indicateurs
- Les changements annuels > ±10% sont signalés - mais le seuil est configurable
- Pour les changements signalés, demandez : problème de qualité des données, vrai changement de programme ou événement externe ?
- Ces résultats ne nécessitent pas de dénominateurs de population - utile quand les dénominateurs sont incertains
-->
