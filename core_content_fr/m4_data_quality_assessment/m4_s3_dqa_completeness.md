---
marp: true
theme: fastr
paginate: true
---

## Complétude de l'indicateur

La complétude de l'indicateur mesure si les établissements qui devraient déclarer des données sur des indicateurs spécifiques le font effectivement. Ceci est différent de la complétude globale du rapportage - nous examinons des éléments de données spécifiques, pas seulement si le formulaire mensuel a été soumis.

**Définition :** Pourcentage d'établissements déclarants chaque mois par rapport aux établissements censés déclarer.
- Un établissement est "déclarant" s'il y a une valeur non manquante et non nulle pour l'indicateur ce mois-là
- Un établissement est "censé déclarer" s'il a déclaré un volume quelconque pour cet indicateur au cours de l'année écoulée

Une complétude plus élevée et stable améliore la fiabilité des données.

<div class="highlight">

**Notes sur la complétude :**

- Un niveau élevé de complétude n'indique pas nécessairement que le SIGS est représentatif de toute la prestation de services dans le pays car certains services peuvent ne pas être fournis dans les établissements, ou certains établissements peuvent ne pas déclarer.
- Pour les pays où le système DHIS2 ne stocke pas les 0, la complétude des indicateurs peut être sous-estimée s'il y a beaucoup d'établissements à faible volume pour un indicateur donné.

</div>

---

<!-- _class: output -->
## Sortie de la complétude de l'indicateur

<div class="output-layout">
<div class="output-viz">

![Sortie complétude](../../resources/default_outputs/Default_2._Proportion_of_completed_records.png)

</div>
<div class="output-text">

**Ce que vous voyez :** Heatmap montrant la complétude par indicateur et région au fil du temps.

**Formule :** % Complétude = (établissements déclarants / établissements attendus) × 100

**Interprétation :** Recherchez les lacunes systématiques par région ou indicateur, les tendances à la baisse ou les schémas saisonniers. Une faible complétude suggère des obstacles au rapportage nécessitant attention.

</div>
</div>

<!--
PRESENTER NOTES:
- Parcourez la heatmap : les lignes sont les indicateurs, les colonnes sont les périodes
- L'intensité de la couleur montre le niveau de complétude - plus foncé = plus complet
- Soulignez les schémas éventuels : baisses saisonnières ? Indicateurs spécifiques avec des problèmes ?
- Insistez : nous examinons la complétude de l'indicateur, pas la soumission du formulaire
-->
