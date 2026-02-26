---
marp: true
theme: fastr
paginate: true
---

<!-- _class: output compact -->
## Estimation de la couverture

<div class="output-layout">
<div class="output-text">

**Le défi :** Le SNIS a les numérateurs (services) mais pas de dénominateurs fiables (population cible). Les populations de zone de desserte standard sont souvent inexactes. Les enquêtes fournissent une couverture fiable mais seulement tous les 3-5 ans.

**Solution FASTR :**

1. **Rétro-calculer les dénominateurs** à partir de la couverture de l'enquête + volumes SNIS
   - Exemple : 10 000 visites CPN1 ÷ 80% couverture enquête = 12 500 grossesses
2. **Valider** par rapport à plusieurs options de dénominateurs (dérivés du SNIS, projections ONU)
3. **Projeter en avant** en s'ancrant sur la dernière enquête et en appliquant les tendances SNIS

</div>
<div class="output-viz">

**Couverture** = services délivrés ÷ population cible

![Équation de couverture h:120](../../resources/diagrams_fr/coverage_equation.svg)

</div>
</div>

<!--
PRESENTER NOTES:
- Idée clé : on peut dériver les dénominateurs des données elles-mêmes
- Plusieurs options de dénominateurs comparées pour trouver la meilleure correspondance avec les références d'enquête
- Les projections prolongent les estimations d'enquête en utilisant les tendances SNIS
- Résultat : des estimations de couverture plus fiables et actualisées pour le suivi
-->
