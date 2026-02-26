---
marp: true
theme: fastr
paginate: true
---

<!-- _class: two-panel -->
## Analyse de l'utilisation des services

Suivre les volumes de services dans le temps, détecter les perturbations, comparer entre les zones.

<div class="panel-layout">
<div>

![Volumes de services h:220](../../resources/default_outputs/Module3_5_Number_of_services_reported.png)

**Volumes dans le temps :** Rechercher les tendances et les changements soudains

</div>
<div>

![Variation annuelle h:220](../../resources/default_outputs/Module3_1_Change_in_service_volume.png)

**Variation d'une année sur l'autre :** Changements >±10% signalés pour investigation

</div>
</div>

**Détection des perturbations :** Comparer le volume réel au volume attendu prédit par le modèle (tenant compte de la saisonnalité). Investiguer : COVID ? Grèves ? Ruptures de stock ? Campagnes ?

<!--
PRESENTER NOTES:
- Les volumes de services ne nécessitent pas de dénominateurs de population - utile quand les dénominateurs sont incertains
- La comparaison d'une année sur l'autre contrôle la variation saisonnière
- Perturbation = déviation soutenue en dessous de l'attendu, pas seulement un mauvais mois
- Quand des changements signalés apparaissent, demander : problème de qualité des données, vrai changement de programme, ou événement externe ?
-->
