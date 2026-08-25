---
marp: true
theme: fastr
paginate: true
footer: "FASTR · Plateforme d'analyse"
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

# La plateforme d'analyse FASTR

**Un même endroit pour rassembler, analyser et partager les données de santé d'un pays**

---

<!-- _class: spacious -->

## Le point de départ

Les données de santé existent déjà. Chaque mois, les établissements les saisissent dans DHIS2. Les enquêtes auprès des formations sanitaires en produisent d'autres. Les enquêtes ménages aussi.

Le problème n'est pas le manque de données. C'est qu'elles restent **dispersées, difficiles à recouper et longues à transformer en analyses**.

Entre le moment où une donnée est saisie et le moment où elle éclaire une décision, il se passe souvent des semaines de travail manuel.

---

<!-- _class: centered -->

## Et si les données d'un pays vivaient — et travaillaient — au même endroit ?

Rassemblées, actualisées, prêtes à être analysées et partagées, sans repartir de zéro à chaque fois.

---

<!-- _class: section-cover -->

![bg](../../resources/backgrounds/section_slide.png)

# Qu'est-ce que FASTR ?

---

<!-- _class: spacious -->

## Une plateforme en ligne, deux rôles

FASTR est un outil en ligne. Il ne demande aucune installation : un navigateur suffit, et l'interface existe en **français, anglais et portugais**.

Il réunit deux choses que l'on trouve d'habitude dans des outils séparés :

- **Un dépôt central** où vivent les données de santé d'un pays
- **Un moteur d'analyse** qui les traite automatiquement, sans écrire de code

C'est cette combinaison qui distingue FASTR d'un simple entrepôt de données.

---

## Une architecture simple : l'instance et les projets

<div class="columns-image-right">
<div>

L'**instance** est l'espace du pays. Elle contient une seule fois la structure sanitaire, les définitions d'indicateurs et toutes les sources de données. C'est la source de vérité partagée.

Les **projets** sont des espaces d'analyse ciblés. Chacun prend un extrait de l'instance — une période, des régions, des indicateurs — pour répondre à une question précise.

</div>
<div>

![w:520](../../resources/diagrams_fr/projects_within_instance.svg)

</div>
</div>

<div class="callout-footer">Une base commune, plusieurs analyses. Tout le monde part des mêmes données.</div>

---

<!-- _class: section-cover -->

![bg](../../resources/backgrounds/section_slide.png)

# Elle se connecte à vos sources de données

---

<!-- _class: compact -->

## Trois types de sources, une même plateforme

<div class="columns-3">
<div>

<div class="eyebrow">Données de routine</div>

### SNIS / DHIS2

Les statistiques mensuelles des établissements : consultations, vaccinations, accouchements.

<span class="data-pill data-pill-navy">DHIS2</span>

</div>
<div>

<div class="eyebrow">Établissements</div>

### Enquêtes FOSA

L'évaluation des formations sanitaires : disponibilité des services, équipements, personnel.

<span class="data-pill data-pill-deep-green">HFA</span>

</div>
<div>

<div class="eyebrow">Équité</div>

### Enquêtes ménages

Les estimations de couverture par quintile de richesse, issues des enquêtes DHS et MICS.

<span class="data-pill data-pill-gold">ICEH</span>

</div>
</div>

<div class="callout-footer">Des sources qui se complètent : le routinier, le structurel et l'équité, côte à côte.</div>

---

<!-- _class: spacious -->

## La connexion à DHIS2, sans ressaisie

FASTR se connecte directement à DHIS2. On sélectionne les indicateurs et la période, et les données arrivent dans la plateforme.

Cet import peut se faire de trois façons :

- **Immédiatement**, à la demande
- **À une date planifiée**, pour un chargement unique
- **De façon récurrente**, chaque semaine ou toutes les deux semaines

Une fois la connexion enregistrée, les mises à jour ne demandent plus de manipulation. Les données restent alignées sur DHIS2.

---

## Un dépôt central, une seule version des faits

<div class="split-panel">
<div>

Les données d'un pays cessent d'être éparpillées entre des fichiers, des postes et des versions différentes.

Elles sont importées une fois, au niveau de l'instance, et deviennent disponibles pour toutes les analyses.

Quand une correction est faite à la source, elle profite à tout le monde, pas à une copie isolée.

</div>
<div>

**Une base**
partagée par toutes les équipes

**Un historique**
suivi dans le temps

**Une référence**
sur laquelle chacun s'appuie

</div>
</div>

---

<!-- _class: section-cover -->

![bg](../../resources/backgrounds/section_slide.png)

# Pas seulement stocker — analyser

---

<!-- _class: output -->

## Un moteur d'analyse intégré

<div class="output-layout">
<div class="output-viz">

![Les modules d'analyse FASTR, tous à l'état « Prêt »](../../resources/screenshots/platform_fr/modules_fr.png)

</div>
<div class="output-text">

Stocker des données ne répond à aucune question. FASTR va plus loin : il **analyse**.

Des **modules** traitent les données automatiquement — qualité, ajustement, utilisation des services, couverture. Chacun exécute des méthodes éprouvées et produit des résultats prêts à visualiser.

L'utilisateur **n'écrit aucune ligne de code**. Les résultats se calculent dans un paquet de résultats ; il le rattache et travaille.

</div>
</div>

---

<!-- _class: two-panel -->

## Des méthodes reconnues, intégrées à l'outil

<div class="panel-layout">
<div>

### Ce que les modules produisent

- Évaluation de la **qualité des données**
- **Ajustement** des données incomplètes
- Analyse de l'**utilisation des services** et des ruptures
- Estimation de la **couverture** et des dénominateurs

</div>
<div>

### Ce qui les rend fiables

- Des méthodes **standardisées**, identiques d'un pays à l'autre
- Des versions **suivies**, pour savoir quel calcul a produit quel résultat
- Un **recalcul automatique** dès que les données changent

</div>
</div>

<div class="callout-footer">La méthode ne dépend plus de la personne qui la connaît. Elle est dans l'outil.</div>

---

<!-- _class: centered -->

## Ce qui est puissant : rien ne se fige

Les analyses restent liées aux données, pas figées dans un fichier.

Quand les données sont mises à jour, les résultats se recalculent et les graphiques suivent. Pas de copier-coller à refaire, pas de chiffre oublié.

---

<!-- _class: section-cover -->

![bg](../../resources/backgrounds/section_slide.png)

# Voir les résultats

---

<!-- _class: two-panel -->

## Des visualisations adaptées à chaque question

<div class="panel-layout">
<div>

### Quatre formes

- **Graphiques** pour comparer entre catégories
- **Séries temporelles** pour suivre une évolution
- **Cartes** pour voir les écarts entre régions
- **Tableaux** pour le détail chiffré exact

</div>
<div>

### Que l'on maîtrise

- **Filtrer** et **désagréger** par région, type d'établissement, période
- **Personnaliser** l'apparence
- **Exporter** en image ou en données pour un usage externe

</div>
</div>

<div class="callout-footer">La forme suit la question : « comment se comparent nos régions ? » n'appelle pas le même graphique que « quel est le chiffre exact ? ».</div>

---

<!-- _class: output -->

## Une analyse, pas seulement un graphique

<div class="output-layout">
<div class="output-viz">

![Analyse des perturbations de services par indicateur, au niveau national](../../resources/screenshots/platform_fr/example-viz-timeseries-fr.png)

</div>
<div class="output-text">

Chaque visualisation s'appuie sur un module. Ici, l'analyse des **perturbations de services** compare le volume observé au volume attendu, pour une dizaine d'indicateurs à la fois.

Les zones colorées signalent les écarts. C'est un signal à recouper avec le terrain, pas une conclusion en soi.

</div>
</div>

---

<!-- _class: section-cover -->

![bg](../../resources/backgrounds/section_slide.png)

# Partager, à chaque public son format

---

<!-- _class: compact -->

## Trois façons de partager les résultats

<div class="columns-3">
<div>

<div class="eyebrow">En direct</div>

### Tableaux de bord

Plusieurs visualisations sur une page, toujours à jour. Publiables via un lien public : les partenaires les ouvrent dans un navigateur, sans compte FASTR.

</div>
<div>

<div class="eyebrow">En réunion</div>

### Présentations

Des diaporamas assemblés dans la plateforme, avec pages de titre et sections. Export vers PowerPoint ou PDF pour une présentation en personne.

</div>
<div>

<div class="eyebrow">À l'écrit</div>

### Rapports

Des documents narratifs mêlant texte et chiffres en direct. Export vers Word ou PDF pour une lecture complète.

</div>
</div>

<div class="callout-footer">Un même jeu de données alimente les trois. On ne refait pas le travail à chaque format.</div>

---

<!-- _class: output -->

## Le fil rouge : des chiffres toujours à jour

<div class="output-layout">
<div class="output-viz">

![Liste de rapports FASTR, chacun combinant texte et figures en direct](../../resources/screenshots/platform_fr/creating-a-report-fr.png)

</div>
<div class="output-text">

Dans un tableau de bord ou un rapport, les graphiques ne sont pas des captures collées qui vieillissent.

Ce sont des **figures vivantes**, reliées aux données du projet. Quand les données changent, le document reflète la nouvelle réalité.

</div>
</div>

---

<!-- _class: spacious -->

## Un assistant IA pour interpréter

Un assistant intégré aide à lire et interpréter les résultats. Il comprend les modules, les indicateurs et les visualisations du projet.

On lui pose des questions en langage courant — « que montre la tendance de la CPN1 ? », « quelles régions ont la couverture la plus basse ? » — et il répond à partir des **données réelles du projet**, pas de suppositions.

Il aide aussi à rédiger le texte des rapports, à partir d'une bibliothèque de prompts que l'équipe peut enrichir et partager.

---

<!-- _class: section-cover -->

![bg](../../resources/backgrounds/section_slide.png)

# Un outil pour les équipes

---

## Conçu pour travailler ensemble

<div class="split-panel">
<div>

Le travail s'organise en projets, et chaque personne reçoit un rôle adapté.

Les droits se règlent finement : consulter, éditer, administrer. Un projet terminé peut être **verrouillé** pour préserver son état tout en restant consultable.

Chacun voit la même donnée, dans la langue de son choix.

</div>
<div>

**Consultation**
lire et exporter

**Édition**
créer visualisations et rapports

**Administration**
paramètres et accès

</div>
</div>

---

<!-- _class: compact -->

## De bout en bout, un seul flux

<div class="results-chain">
<div class="rc-col rc-navy">
<div class="rc-eyebrow">Importer</div>
<h3 class="rc-title">Rassembler</h3>
<p class="rc-desc">Les sources arrivent dans l'instance</p>
<span class="data-pill data-pill-navy">DHIS2 · HFA · ICEH</span>
</div>
<div class="rc-arrow">→</div>
<div class="rc-col rc-deep-green">
<div class="rc-eyebrow">Analyser</div>
<h3 class="rc-title">Traiter</h3>
<p class="rc-desc">Les modules calculent automatiquement</p>
<span class="data-pill data-pill-deep-green">Qualité · Couverture</span>
</div>
<div class="rc-arrow">→</div>
<div class="rc-col rc-green">
<div class="rc-eyebrow">Visualiser</div>
<h3 class="rc-title">Voir</h3>
<p class="rc-desc">Graphiques, cartes, tableaux</p>
<span class="data-pill data-pill-green">Explorer</span>
</div>
<div class="rc-arrow">→</div>
<div class="rc-col rc-gold">
<div class="rc-eyebrow">Partager</div>
<h3 class="rc-title">Diffuser</h3>
<p class="rc-desc">Tableaux de bord, présentations, rapports</p>
<span class="data-pill data-pill-gold">Décider</span>
</div>
</div>

<div class="callout-footer">Chaque étape s'enchaîne dans le même outil. La donnée ne quitte jamais la plateforme jusqu'à la décision.</div>

---

<!-- _class: spacious -->

## Ce que cela change

Sans FASTR, la donnée est dispersée, retravaillée à la main et vite périmée.

Avec FASTR, elle est **rassemblée** en un lieu, **analysée** avec des méthodes reconnues, et **partagée** dans le format qui convient à chaque public.

Le pays passe d'une collection de fichiers à une ressource commune, à jour et fiable, au service de la décision.

---

<!-- _class: bg-green -->

# FASTR

## Des données de routine aux décisions, sans quitter la plateforme

<div style="margin-top: 48px; display: flex; gap: 36px; align-items: center;">
  <img src="../../resources/logos/FASTR_White_Horiz.png" style="height: 46px;">
  <img src="../../resources/logos/GFF_Logo_trimmed.png" style="height: 26px;">
</div>
