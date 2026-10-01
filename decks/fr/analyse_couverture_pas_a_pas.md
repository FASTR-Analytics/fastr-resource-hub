---
marp: true
theme: fastr
paginate: true
footer: "FASTR · L'analyse de couverture, pas à pas"
---

<!--
  Deck-scoped design override (does NOT touch the shared fastr-theme.css):
  swap the theme's vertical accent bar beside titles for a modern horizontal
  rule underneath them. Covers/sections/lead keep their own title treatment.
-->
<style>
  section h1,
  section h2 {
    border-left: none;
    padding-left: 0;
    padding-bottom: 0.24em;
    border-bottom: 3px solid var(--fastr-green);
    width: fit-content;
    max-width: 100%;
  }
  /* Self-contained slide types keep their existing (bar-free) title style. */
  section.title-cover h1,
  section.section-cover h1,
  section.lead h1,
  section.lead h2,
  section.break h1 {
    border-bottom: none;
    padding-bottom: 0;
  }
  /* Dark closing slide: use the lime accent so the rule reads on green. */
  section.bg-green h1,
  section.bg-green h2 { border-bottom-color: var(--fastr-lime); }
  /* Centered statement slides: rule sits centered under the text. */
  section.centered h1,
  section.centered h2 { align-self: center; }
</style>

<!-- _class: title-cover -->

![bg](../../resources/backgrounds/cover_slide_clean.png)

<div style="position: absolute; top: 40px; left: 80px; display: flex; gap: 20px; align-items: center;">
  <img src="../../resources/logos/GFF_Logo_trimmed.png" style="height: 40px;">
</div>

<div style="position: absolute; bottom: 40px; left: 80px; display: flex; gap: 28px; align-items: center;">
  <img src="../../resources/logos/FASTR_White_Horiz.png" style="height: 50px;">
  <img src="../../resources/logos/usefuldata600w.png" style="height: 34px;">
</div>

# L'analyse de couverture dans FASTR

**Comment la plateforme estime la couverture des services, étape par étape**

---

## La question à laquelle on veut répondre

<div class="columns-image-right">
<div>

La couverture d'un service, c'est la part des personnes qui en avaient besoin et qui l'ont reçu.

Le haut de la fraction est dans DHIS2 : le nombre de femmes vues en CPN1, le nombre d'enfants vaccinés, chaque mois, par établissement.

Le bas de la fraction n'y est pas. Personne ne compte les grossesses d'un district. C'est ce chiffre que FASTR doit estimer.

</div>
<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0.4em;font-size:0.95em">

<div style="font-weight:700;color:var(--fastr-deep-green)">Couverture</div>
<div style="font-size:1.6em;color:var(--fastr-deep-green)">=</div>
<div style="padding:0.5em 1em;background:#E8F4F3;border-radius:6px;text-align:center"><strong>Personnes ayant reçu le service</strong><br><span style="font-size:0.75em;color:#4a5a58">DHIS2, volumes après correction de la qualité</span></div>
<div style="width:70%;border-top:3px solid var(--fastr-deep-green)"></div>
<div style="padding:0.5em 1em;background:#FDE8E8;border-radius:6px;text-align:center"><strong>Personnes qui en avaient besoin</strong><br><span style="font-size:0.75em;color:#4a5a58">absent de DHIS2 : à estimer</span></div>

</div>
</div>

---

<!-- _class: spacious -->

## Pourquoi le dénominateur est le problème

Les projections de population datent du dernier recensement et vieillissent vite au niveau des districts.

Les enquêtes ménages (EDS, MICS) mesurent la couverture avec précision, mais tous les cinq ans environ, et rarement en dessous de la région.

Entre deux enquêtes, un ministère a donc des volumes de services chaque mois, et aucune couverture. FASTR comble cet intervalle en combinant les trois sources : le SNIS, la dernière enquête et les projections démographiques.

---

## Vue d'ensemble : deux modules, quatre étapes

<div class="columns-3">
<div>

<div class="eyebrow">Module « Dénominateurs de couverture »</div>

### Étapes 1 à 3

1. Estimer une population de départ à partir d'un service et de la dernière enquête
2. En déduire les autres populations par la cascade démographique
3. Choisir, parmi les chaînes obtenues, celle qui colle le mieux aux projections de l'ONU

</div>
<div>

<div class="eyebrow">Module « Estimations de couverture »</div>

### Étape 4

4. Diviser chaque volume de service par son dénominateur, puis prolonger la dernière enquête avec la tendance du SNIS

</div>
<div>

<div class="eyebrow">Entrées</div>

### Trois sources

- Les volumes du SNIS, **après correction de la qualité**
- Les enquêtes EDS et MICS, fournies avec la plateforme
- Les projections de population de l'ONU (UN WPP)

</div>
</div>

---

## Étape 1 : partir d'un service que l'enquête a mesuré

<div class="columns-image-right">
<div>

Le SNIS dit combien de femmes ont eu une première consultation prénatale. La dernière enquête dit quelle part des femmes enceintes en ont une.

Diviser l'un par l'autre donne le nombre de grossesses.

**Exemple.** 10 000 CPN1 dans l'année, couverture CPN1 de 80 % dans l'enquête : 10 000 ÷ 0,80 = 12 500 grossesses.

La valeur de l'enquête est conservée pour les années suivantes, jusqu'à la prochaine enquête. S'il y a une EDS et une MICS la même année, l'EDS est retenue.

</div>
<div>

![w:560](../../resources/diagrams_fr/coverage_example_anc4.svg)

</div>
</div>

---

## Étape 2 : en déduire les autres populations

Une fois les grossesses connues, la démographie donne le reste. On retire les pertes de grossesse, on ajoute les jumeaux, on retire les mort-nés, puis les décès néonatals.

![w:980](../../resources/diagrams_fr/denominator_cascade_example.svg)

---

<!-- _class: two-panel -->

## Les cinq taux de la cascade

<div class="panel-layout">
<div>

### Valeurs par défaut

| Taux | Défaut |
|------|--------|
| Perte de grossesse | 3 % |
| Jumeaux | 1,5 % |
| Mortinatalité | 20 ‰ |
| Mortalité néonatale | 39 ‰ |
| Mortalité postnéonatale | 28 ‰ |

</div>
<div>

### Ce qu'il faut en savoir

- Ce sont des valeurs de départ, pas des valeurs du pays. Elles se remplacent par l'EDS ou les estimations UN IGME dans **Résultats → Paramètres par défaut des modules**.
- Un taux changé s'applique à chaque paquet de résultats généré ensuite.
- Au niveau des régions et des districts, ce sont ces taux nationaux qui s'appliquent.

</div>
</div>

---

<!-- _class: two-panel -->

## Quatre points de départ, donc quatre chaînes

<div class="panel-layout">
<div>

### Les points de départ

| Service | Population estimée d'abord |
|---------|---------------------------|
| CPN1 | Grossesses |
| Accouchements | Naissances vivantes |
| BCG | Naissances vivantes |
| Penta1 | Nourrissons après la période néonatale |

</div>
<div>

### Pourquoi plusieurs

- La cascade se parcourt dans les deux sens : depuis Penta1, on remonte aux naissances vivantes, puis aux grossesses.
- Chaque point de départ donne donc une estimation complète et indépendante de toutes les populations.
- Quatre chaînes, c'est quatre réponses à la même question. L'étape suivante en retient une.

</div>
</div>

---

<!-- _class: spacious -->

## Étape 3 : retenir la chaîne la plus crédible

Au niveau national, chaque chaîne est comparée aux projections de l'ONU pour trois populations : grossesses, naissances vivantes, nourrissons éligibles au Penta. Pour chaque chaîne, on calcule le rapport chaîne ÷ ONU, année par année, et on prend la médiane.

La chaîne dont la médiane est la plus proche de 1 est retenue. Une médiane de 1,15 signifie que la chaîne compte 15 % de personnes de plus que l'ONU.

La chaîne BCG ne participe pas à ce choix automatique, car elle n'existe qu'au niveau national. Elle reste disponible en choix manuel.

**Une seule chaîne est retenue**, puis appliquée à tous les indicateurs et à tous les niveaux géographiques, pour que les couvertures restent comparables entre eux.

---

<!-- _class: spacious -->

## Étape 4a : calculer la couverture

Pour chaque indicateur, chaque année et chaque niveau géographique :

couverture = volume de service du SNIS ÷ dénominateur de la chaîne retenue.

Le volume utilisé est celui **corrigé des valeurs aberrantes** par le module d'ajustement, le réglage par défaut. Un indicateur qui n'a aucun volume n'a pas de couverture, plutôt qu'un zéro trompeur.

La couverture n'est pas plafonnée. Une valeur au-dessus de 100 % est un signal : le dénominateur est trop petit, ou le numérateur compte des personnes venues d'ailleurs.

---

## Étape 4b : prolonger la dernière enquête

<div class="columns-image-right">
<div>

L'enquête reste la mesure de référence. FASTR part de sa dernière valeur et la fait évoluer comme la couverture SNIS, d'une année à l'autre.

**Exemple.** Enquête 2021 : 82 %. Couverture SNIS : 80 % en 2021, 83 % en 2022, 85 % en 2023.

Le SNIS gagne 3 points puis 2 points. La projection donne 85 % en 2022 et 87 % en 2023.

Le niveau vient de l'enquête, la tendance du SNIS.

</div>
<div>

| Année | SNIS | Enquête | Projection |
|------:|-----:|--------:|-----------:|
| 2021 | 80 % | 82 % | 82 % |
| 2022 | 83 % | | 85 % |
| 2023 | 85 % | | 87 % |

</div>
</div>

---

<!-- _class: two-panel -->

## Lire un graphique de couverture

<div class="panel-layout">
<div>

### Trois séries sur le même graphique

- **Couverture SNIS** : volumes corrigés ÷ dénominateur, chaque année
- **Points d'enquête** : les valeurs EDS ou MICS, les années où il y en a
- **Projection** : la dernière enquête prolongée par la tendance du SNIS

</div>
<div>

### Laquelle regarder

- Pour la **tendance** : la couverture SNIS, disponible chaque année et par district
- Pour le **niveau** : la projection, calée sur l'enquête
- Si les deux s'écartent fortement, c'est le dénominateur qu'il faut questionner avant les services

</div>
</div>

<div class="callout-footer">Par district, seule la couverture SNIS existe. Les enquêtes ne descendent pas à ce niveau.</div>

---

## Dans la plateforme, dans l'ordre

<div class="columns-3">
<div>

<div class="eyebrow">1 · Régler</div>

### Paramètres par défaut des modules

Menu **Résultats**. Carte **Dénominateurs de couverture** : les cinq taux et le niveau de calcul (national, région, district). Carte **Estimations de couverture** : la chaîne, « auto » par défaut.

</div>
<div>

<div class="eyebrow">2 · Générer</div>

### Un paquet de résultats

**Générer un nouveau paquet** avec les deux modules de couverture cochés. L'ajustement de la qualité doit être inclus : il fournit les volumes corrigés.

</div>
<div>

<div class="eyebrow">3 · Lire</div>

### Les visualisations

**Séries temporelles de couverture**, national puis par région et par district, avec les points d'enquête. **Couverture (SNIS uniquement)** pour un tableau de bord opérationnel.

</div>
</div>

---

<!-- _class: two-panel -->

## Avant de faire confiance au résultat

<div class="panel-layout">
<div>

### Vérifier

- La **dernière enquête** disponible pour le pays est bien celle utilisée
- Les **cinq taux** sont ceux du pays, pas les défauts
- La **chaîne retenue** et sa médiane, dans le journal de génération

</div>
<div>

### Interpréter avec prudence

- Une couverture **au-dessus de 100 %** : dénominateur à revoir
- Un **petit district** : quelques établissements suffisent à faire bouger la courbe
- Un **changement brusque** la même année dans tous les indicateurs : souvent un problème de rapportage, pas de service

</div>
</div>

---

<!-- _class: spacious -->

## En une page

1. Un service mesuré par l'enquête donne une population de départ : volume SNIS ÷ couverture d'enquête.
2. La cascade démographique en déduit les autres populations avec cinq taux.
3. Quatre chaînes sont construites ; celle qui colle le mieux aux projections de l'ONU est retenue pour tout.
4. La couverture est le volume corrigé divisé par ce dénominateur ; la dernière enquête est prolongée par la tendance du SNIS.

Le résultat se lit chaque année et par district, là où les enquêtes ne vont pas.

---

<!-- _class: bg-green -->

# FASTR

## Du volume de service à la couverture, chaque année et par district
