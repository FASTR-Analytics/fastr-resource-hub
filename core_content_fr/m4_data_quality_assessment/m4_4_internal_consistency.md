---
marp: true
theme: fastr
paginate: true
---

## Cohérence entre les indicateurs connexes

Les indicateurs du programme ayant une relation prévisible sont examinés afin de déterminer si la relation attendue existe entre eux. En d'autres termes, ce processus permet de déterminer si la relation observée entre les indicateurs, telle qu'elle apparaît dans les données rapportées, est celle qui est attendue.

---

## Paires d'indicateurs évaluées

<div class="columns">
<div>

| Paire d'indicateurs | Relation attendue |
|----------------|----------------------|
| CPN1 / CPN4 | Le rapport doit être ≥ 0,95 |
| Penta1 / Penta3 | Le rapport doit être ≥ 0,95 |
| BCG / Accouchement en établissement | Dans les 30 % (≥0,7 et ≤1,3) |

Ces paires ont des relations attendues. Nous nous attendons à ce que CPN1 > CPN4 puisque toutes les femmes n'effectuent pas quatre visites.

Le BCG est un vaccin administré à la naissance, nous nous attendons donc à ce que le nombre d'accouchements en établissement soit similaire, avec une tolerance de 30 % pour la variabilité.

</div>
<div>

![Illustration de cohérence h:280](../../resources/diagrams/consistency_illustration.svg)

</div>
</div>

---

## Pourquoi évaluer la cohérence au niveau du district ?

<div style="display : flex ; gap : 1.5em ; align-items : flex-start ;">
<div style="flex : 1 ;">

Les patients ont souvent accès à différents services dans différents établissements d'un même district :

- Une femme peut recevoir **CPN1** dans un poste de santé voisin, mais se rendre dans un centre de santé pour **CPN4**
- Un enfant peut recevoir **Penta1** dans un dispensaire local, mais terminer **Penta3** dans un hôpital de district

La vérification de la cohérence au niveau de l'établissement de santé ne tiendrait pas compte de ces schémas. L'agrégation au niveau du district permet d'obtenir une image complète de l'utilisation des services dans une zone géographique.

</div>
<div style="flex : 2 ;">

![Cohérence des districts](../../resources/diagrams/district_consistency.svg)

</div>
</div>

---

## Cohérence interne : Sortie FASTR

![Cohérence interne h:420](../../resources/default_outputs/Default_4._Proportion_of_sub-national_areas_meeting_consistency_criteria.png)
