---
marp: true
theme: fastr
paginate: true
---

## Cohérence interne

<div style="font-size: 0.9em;">

La cohérence interne vérifie si les indicateurs connexes maintiennent les relations logiques attendues. FASTR évalue les paires d'indicateurs suivantes pour mesurer la cohérence interne :

| Paire d'indicateurs | Relation attendue |
|----------------|----------------------|
| CPN1/CPN4 | Le rapport doit être supérieur à 1 |
| Penta1/Penta3 | Le rapport doit être supérieur à 1 |
| BCG/Accouchement en établissement | Le rapport doit être dans les 30% (c.-à-d. >=0,7 et <=1,3) |

Nous nous attendons à ce que le nombre de femmes enceintes recevant une première visite CPN soit toujours supérieur au nombre de femmes enceintes recevant une quatrième visite CPN.

Le BCG est un vaccin administré à la naissance, nous nous attendons donc à ce que le BCG et les accouchements en établissement soient égaux. Cependant, nous reconnaissons qu'il peut y avoir plus de variabilité dans cette relation prédite, nous définissons donc une fourchette de 30%.

FASTR évalue la cohérence au **niveau du district** plutôt qu'au niveau de l'établissement. C'est parce que les patients cherchent fréquemment des soins dans différents établissements au sein du même district - une femme peut avoir sa visite CPN1 au poste de santé mais se rendre à l'hôpital de district pour CPN4. L'évaluation au niveau du district tient compte de ce mouvement des patients.

</div>

---

## Sortie de la cohérence interne

<div style="display: flex; gap: 1em; align-items: flex-start;">
<div style="flex: 1.2;">

![Sortie cohérence](../../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**Ce que vous voyez :** Heatmap montrant le % de districts où les paires d'indicateurs respectent les relations attendues (ex. CPN1 ≥ CPN4).

**Formule :** % Cohérence = (districts respectant les critères / total des districts) × 100

**Interprétation :** Une faible cohérence peut indiquer des problèmes de flux de données, des doubles comptages ou une sous-déclaration systématique au niveau du district.

</div>
</div>
