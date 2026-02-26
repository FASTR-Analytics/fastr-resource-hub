---
marp: true
theme: fastr
paginate: true
---

<!-- _class: compact -->
## Trois dimensions de la qualité des données + score global

| Dimension | Ce qu'elle mesure | Signal d'alerte |
|-----------|-------------------|-----------------|
| **Complétude** | % d'établissements déclarant chaque indicateur | Lacunes par région ou période |
| **Valeurs aberrantes** | Valeurs anormalement élevées vs historique de l'établissement | Erreurs de saisie |
| **Cohérence** | Relations logiques (ex : CPN1 ≥ CPN4) | Problèmes de système ou de processus |
| **Score EQD global** | Combine les 3 dimensions en une seule métrique | Vue rapide de la qualité des données |

<div class="image-row">

![Complétude h:150](../../resources/default_outputs/Default_2._Proportion_of_completed_records.png) ![Valeurs aberrantes h:150](../../resources/default_outputs/Default_1._Proportion_of_outliers.png) ![Cohérence h:150](../../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png) ![Score EQD h:150](../../resources/default_outputs/Default_5._Overall_DQA_score.png)

</div>

<!--
PRESENTER NOTES:
- Complétude : Les établissements censés déclarer le font-ils effectivement ?
- Valeurs aberrantes : Ne signale que les valeurs ÉLEVÉES (les valeurs basses peuvent être de vraies perturbations de service)
- Cohérence : Évaluée au niveau du district pour tenir compte des mouvements de patients entre établissements
- Score EQD global : 100% signifie que les données passent tous les contrôles - complètes, sans valeurs aberrantes, cohérentes
-->
