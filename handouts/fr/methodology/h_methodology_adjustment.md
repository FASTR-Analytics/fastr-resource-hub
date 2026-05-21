---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Récapitulatif méthodologique · Ajustement de la qualité des données"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Récapitulatif méthodologique · Module M2</span>

# Ajustement de la qualité des données

<p class="meta-line"><strong>Ce que fait le module</strong> · <strong>Comment lire ses résultats</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Ce qu'il fait</p>

Ce module **répare** les problèmes trouvés par le précédent. Il comble les mois manquants et remplace les pics aberrants, pour que les tendances et la couverture ne soient pas faussées par quelques mauvais chiffres.

<p class="sb-label">Ce qu'il ne fait pas</p>

Il n'invente jamais de tendance. Chaque remplacement vient de l'**historique propre** de la formation, et les données qui ont passé les vérifications restent exactement telles que déclarées.

<p class="sb-label">Quatre versions</p>

Il enregistre les données de quatre façons — **non ajustées**, **aberrances corrigées**, **lacunes comblées** et **les deux** — pour que vous voyiez toujours exactement ce qui a changé.

</aside>
<div class="p1-main">

## Comment fonctionne la correction

Quand le module précédent signale un mois comme **aberrant** ou **manquant**, FASTR ne remplace que cette valeur — en utilisant les **mois voisins de la formation elle-même**, jamais des chiffres empruntés à une autre formation. Il descend une courte échelle et prend la première option que permet l'historique :

1. **Les mois juste autour** — la moyenne des mois de part et d'autre du mois signalé. C'est le cas normal : le niveau propre de la formation à ce moment-là
2. **Si le mois signalé est tout au début ou à la fin des données** — il n'y a pas assez de mois des *deux* côtés, alors FASTR utilise le côté qui a des données : les **6 mois juste après** (lacune près du début) ou les **6 juste avant** (près de la fin)
3. **Pour une aberrance seulement — le même mois un an plus tôt** — pour les services saisonniers, on compare ce qui est comparable (un décembre à un décembre)
4. **Si rien de tout cela n'existe** — la **moyenne globale** de la formation pour cet indicateur

Les mois qui ont passé les vérifications restent exactement tels que déclarés, ce qui préserve la forme réelle de l'activité.

**Certains indicateurs ne sont jamais ajustés :** décès et mortinaissances (chaque cas compte et ne doit pas être lissé), et les indicateurs à très faible volume — ceux qui n'atteignent jamais 100 dans un mois, où il y a trop peu de signal pour estimer. Ils gardent leurs valeurs brutes.

<div class="callout-footer">L'ajustement comble et lisse à partir de l'historique propre de chaque formation — il n'emprunte jamais à d'autres formations et n'invente jamais de tendance.</div>

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Ce que fait la correction</span>

## Un pic remplacé — la tendance conservée

![Avant et après : un seul pic aberrant est remplacé par la moyenne des mois voisins, et la tendance de fond est préservée w:100%](../../../resources/diagrams_fr/why_adjust_outliers.svg)

Chaque valeur signalée est remplacée par le niveau normal propre à la formation : le pic disparaît, mais la forme réelle de l'activité reste intacte.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Le résultat</span>

## De combien les données ont-elles changé ?

![Pourcentage de variation du volume dû à l'ajustement des aberrances : un tableau districts × indicateurs, chaque case en vert, orange ou rouge w:100%](../../../resources/default_outputs/Default_1._Percent_change_in_volume_due_to_outlier_adjustment.png)

- **Ce qu'est chaque case** — choisissez un district (une ligne) et un indicateur (une colonne). Le chiffre indique de combien le total de cet indicateur a **changé** une fois les pics suspects retirés. 0 % = rien à corriger ; un grand nombre = de gros pics ont été retirés
- **Comment le lire** — **vert = les données brutes étaient déjà propres ; rouge = il a fallu beaucoup corriger.** Une case rouge avertit que le total *brut* y était gonflé et aurait surestimé l'activité

<div class="callout-footer">Exemple — <strong>Karene District → Family planning methods-long acting : 5.7 %, en rouge</strong> : corriger les aberrances a réduit le total de cet indicateur d'environ 6 % à cet endroit ; sans la correction, vous auriez sur-compté ces services. Une grosse correction n'est pas un échec — c'est le signe que les données brutes vous auraient induit en erreur, et ne le feront plus.</div>

Le module produit aussi ce tableau pour les **lacunes comblées** et pour **les deux corrections ensemble** — comparez-les pour voir si ce sont les pics ou les mois manquants qui comptaient le plus dans une zone.
