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
  /* Full-width illustrations: the deck's own SVGs are wide and already sized to the slide. */
  section img.illus { width: 100%; max-width: 1120px; max-height: 480px; height: auto; margin: 0.3em auto 0; display: block; }
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

**Comment la plateforme compte les personnes à servir, et ce que cela change, étape par étape**

---

<!-- _class: pic -->

## La couverture, c'est quoi ?

<img src="../../resources/diagrams_fr/cov_21_couverture_def.svg" alt="">

---

<!-- _class: pic -->

## Deux chiffres : un qu'on a, un qu'il faut estimer

<img src="../../resources/diagrams_fr/cov_22_deux_chiffres.svg" alt="">

---

<!-- _class: section-cover -->

![bg](../../resources/backgrounds/section_slide.png)

# Première partie : le problème, avec un exemple

---

<!-- _class: pic -->

## 4 000 enfants vaccinés : quelle couverture ?

<img src="../../resources/diagrams_fr/cov_01_question.svg" alt="">

---

<!-- _class: pic -->

## D'où vient le chiffre qu'on utilise aujourd'hui

<img src="../../resources/diagrams_fr/cov_02_recensement.svg" alt="">

---

<!-- _class: pic -->

## Mais entre deux recensements, les gens bougent

<img src="../../resources/diagrams_fr/cov_03_deplacements.svg" alt="">

---

<!-- _class: pic -->

## Résultat : le 5 000 trompe tout le monde

<img src="../../resources/diagrams_fr/cov_04_resultat.svg" alt="">

---

<!-- _class: section-cover -->

![bg](../../resources/backgrounds/section_slide.png)

# Deuxième partie : comment FASTR compte

---

<!-- _class: pic -->

## L'idée de FASTR : combiner l'enquête et DHIS2

<img src="../../resources/diagrams_fr/cov_05_idee.svg" alt="">

---

<!-- _class: pic -->

## Ce que dit l'enquête : 8 femmes sur 10 viennent

<img src="../../resources/diagrams_fr/cov_06_enquete.svg" alt="">

---

<!-- _class: pic -->

## Ce que dit DHIS2 : 8 000 femmes sont venues

<img src="../../resources/diagrams_fr/cov_07_dhis2.svg" alt="">

---

<!-- _class: pic -->

## Donc elles étaient 10 000

<img src="../../resources/diagrams_fr/cov_08_raisonnement.svg" alt="">

---

<!-- _class: pic -->

## La même idée, écrite en calcul

<img src="../../resources/diagrams_fr/cov_09_division.svg" alt="">

---

<!-- _class: pic -->

## Des grossesses aux enfants à vacciner

<img src="../../resources/diagrams_fr/cov_10_cascade.svg" alt="">

---

<!-- _class: pic -->

## Enfin le chiffre du bas : 43 % de couverture

<img src="../../resources/diagrams_fr/cov_11_couverture.svg" alt="">

---

<!-- _class: section-cover -->

![bg](../../resources/backgrounds/section_slide.png)

# Troisième partie : ce que la plateforme fait, dans l'ordre

---
<!-- _class: pic -->

## La plateforme fait cela en quatre étapes

<img src="../../resources/diagrams_fr/cov_12_quatre_etapes.svg" alt="">

---

<!-- _class: pic -->

## Étape 1 : pourquoi ces quatre services ?

<img src="../../resources/diagrams_fr/cov_20_pourquoi_services.svg" alt="">

---

<!-- _class: pic -->

## Étape 1 : quatre services, donc quatre chaînes

<img src="../../resources/diagrams_fr/cov_13_quatre_chaines.svg" alt="">

---

<!-- _class: pic -->

## Étape 1 : entre deux enquêtes, on garde la dernière valeur

<img src="../../resources/diagrams_fr/cov_23_regles.svg" alt="">

---

<!-- _class: pic -->

## Étape 2 : la cascade, pour descendre ou remonter

<img src="../../resources/diagrams_fr/cov_19_cascade_calcul.svg" alt="">

---

<!-- _class: pic -->

## Étape 2, suite : les cinq taux sont ceux de votre pays

<img src="../../resources/diagrams_fr/cov_10b_taux_pays.svg" alt="">

---
<!-- _class: pic -->

## Étape 3 : garder la chaîne la plus proche de l'ONU

<img src="../../resources/diagrams_fr/cov_14_choix_chaine.svg" alt="">

---
<!-- _class: pic -->

## Étape 4 : calculer la couverture

<img src="../../resources/diagrams_fr/cov_15_couverture_annees.svg" alt="">

---
<!-- _class: pic -->

## Étape 4, suite : prolonger la dernière enquête

<img src="../../resources/diagrams_fr/cov_16_projection.svg" alt="">

---
<!-- _class: pic -->

## Lire un graphique de couverture

<img src="../../resources/diagrams_fr/cov_17_lire_graphique.svg" alt="">

---
<!-- _class: pic -->

## Dans la plateforme : régler, générer, lire

<img src="../../resources/diagrams_fr/cov_18_plateforme.svg" alt="">

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
- Une **petite province** : quelques établissements suffisent à faire bouger la courbe
- Un **changement brusque** la même année dans tous les indicateurs : souvent un problème de rapportage, pas de service

</div>
</div>

---

<!-- _class: pic -->

## En une page

<img src="../../resources/diagrams_fr/cov_24_en_une_page.svg" alt="">

---

<!-- _class: bg-green -->

# FASTR

## Du volume de service à la couverture, chaque année et par province
