---
marp: true
theme: fastr
paginate: true
---

## Détection des perturbations de services

Au-delà des comparaisons d'une année sur l'autre, nous voulons savoir : **La prestation de services est-elle sur la bonne voie, ou quelque chose l'a-t-elle perturbée ?**

**Le défi :** Les comptages bruts de services sont difficiles à interpréter. Une baisse des services pourrait être une vraie perturbation, ou simplement une variation saisonnière normale. Différentes zones ont des volumes de référence différents, rendant la comparaison directe difficile.

**La solution FASTR :** Utiliser la modélisation statistique pour estimer quel volume de service nous *attendrions* basé sur les tendances historiques et la saisonnalité, puis comparer le volume réel à cette attente.

- **Perturbation :** Volume observé significativement inférieur à l'attendu
- **Excédent :** Volume observé significativement supérieur à l'attendu

---

## Résultat de perturbation de service

<div style="display: flex; gap: 1em;">
<div style="flex: 1.2;">

![Résultat de perturbation h:300](../../resources/default_outputs/Module3_2_Actual_vs_expected_national.png)

</div>
<div style="flex: 1; font-size: 0.85em;">

**Ce que vous voyez :** Graphique comparant le volume de service réel au volume attendu prédit par le modèle, en tenant compte de la saisonnalité.

**Ce qu'il montre :** Écarts par rapport à l'attendu - perturbations (en dessous) ou excédents (au-dessus).

**Interprétation :** Considérez les facteurs externes : COVID, grèves, ruptures de stock, campagnes. Les écarts persistants justifient une investigation du programme.

</div>
</div>

<!--
PRESENTER NOTES:
- Version condensée axée sur la méthodologie de détection des perturbations
- Idée clé : les comptages bruts sont difficiles à interpréter sans contexte
- Le modèle statistique fournit une référence "attendue" tenant compte de la saisonnalité
- Perturbation = écart soutenu en dessous de l'attendu, pas juste un mauvais mois
- Lors de l'interprétation des perturbations, considérez les facteurs externes : COVID, grèves, etc.
- Les écarts persistants justifient une investigation plus approfondie des causes
- Peut être exécuté au niveau national, provincial ou du district selon la qualité des données
-->
