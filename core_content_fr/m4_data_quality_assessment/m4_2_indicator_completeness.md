---
marp: true
theme: fastr
paginate: true
---

## Exhaustivité de l'indicateur

<div style="display : flex ; gap : 1.5em ; align-items : flex-start ;">
<div style="flex : 1 ;">

**Ce qui est mesuré:** La mesure dans laquelle les établissements rapportent des données sur des indicateurs de base sélectionnés

**Pourquoi c'est important:**
- Une plus grande exhaustivité améliore la fiabilité des données
- La stabilité dans le temps renforce l'analyse des tendances

**Distinction clé:**
Complétude de l'indicateur ≠ Complétude du rapport. Cette mesure examine des éléments de données spécifiques, et pas seulement la question de savoir si le formulaire mensuel a été soumis.

</div>
<div style="flex : 2 ;">

![Illustration de la complétude](../../resources/diagrams/completeness_illustration.svg)

</div>
</div>

---

## Définition de l'exhaustivité de l'indicateur

Pour l'analyse FASTR, la complétude est définie comme suit :

**le pourcentage d'établissements ayant fait une déclaration chaque mois par rapport au nombre total d'établissements censés faire une déclaration**

- Une installation est considérée comme "déclarante" si une valeur non manquante et non nulle est enregistrée pour l'indicateur et le mois
- Une installation est censée être déclarée si elle a déclaré un volume quelconque pour cet indicateur à tout moment au cours de l'année
- Les installations qui ne déclarent pas pendant six mois consécutifs ou plus au début ou à la fin de leur période de déclaration sont classées comme **inactives** plutôt qu'incomplètes. Cela permet de ne pas pénaliser les installations qui n'ont pas encore commencé à déclarer ou qui ont définitivement cessé leurs activités

---

## Notes sur l'exhaustivité

- Un niveau élevé d'exhaustivité n'indique pas nécessairement que le SIGS est représentatif de l'ensemble des services fournis dans le pays, étant donné que certains services peuvent ne pas être fournis dans les établissements, ou que certains établissements peuvent ne pas rendre compte de leurs activités

- Pour les pays où le système DHIS2 ne stocke pas les 0, l'exhaustivité des indicateurs peut être sous-estimée s'il y a beaucoup d'établissements à faible volume pour un indicateur donné


---

## Complétude : Pourcentage de valeurs mensuelles complètes

<p style="font-size : 0.9em ; margin-bottom : 0.5rem ;">Pour un indicateur donné dans une période donnée, le pourcentage de valeurs mensuelles qui sont complètes:</p>

<p style="font-size : 0.9em ;"><strong>% complet = # valeurs mensuelles complètes / N total de valeurs mensuelles</strong></p><p>

![Indicateur de complétude h:340](../../resources/default_outputs/Default_2._Proportion_of_completed_records.png)
