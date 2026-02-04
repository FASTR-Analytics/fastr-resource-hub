---
marp: true
theme: fastr
paginate: true
---

## Trois dimensions de la qualité des données + score global

<div style="font-size: 0.85em;">

| Dimension | Ce qu'elle mesure | Signal d'alerte |
|-----------|-------------------|-----------------|
| **Complétude** | % d'établissements déclarant chaque indicateur | Lacunes par région ou période |
| **Valeurs aberrantes** | Valeurs anormalement élevées vs historique de l'établissement | Erreurs de saisie |
| **Cohérence** | Relations logiques (ex : CPN1 ≥ CPN4) | Problèmes de système ou de processus |
| **Score EQD global** | Combine les 3 dimensions en une seule métrique | Vue rapide de la qualité des données |

</div>

<div style="display: flex; gap: 0.4em; margin-top: 0.3em;">
<div style="flex: 1;">

![Complétude h:150](../../resources/default_outputs/Default_2._Proportion_of_completed_records.png)

</div>
<div style="flex: 1;">

![Valeurs aberrantes h:150](../../resources/default_outputs/Default_1._Proportion_of_outliers.png)

</div>
<div style="flex: 1;">

![Cohérence h:150](../../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

</div>
<div style="flex: 1;">

![Score EQD h:150](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

</div>
</div>

<!--
PRESENTER NOTES:
- Complétude : Les établissements censés déclarer le font-ils effectivement ?
- Valeurs aberrantes : Ne signale que les valeurs ÉLEVÉES (les valeurs basses peuvent être de vraies perturbations de service)
- Cohérence : Évaluée au niveau du district pour tenir compte des mouvements de patients entre établissements
- Score EQD global : 100% signifie que les données passent tous les contrôles - complètes, sans valeurs aberrantes, cohérentes
-->
