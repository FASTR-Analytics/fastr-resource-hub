---
marp: true
theme: fastr-handout
paginate: true
class: redesign
footer: "FASTR · Introduction technique"
---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Introduction technique</span>

# FASTR pour les développeurs

<p class="meta-line"><strong>Une vue d'ensemble des données, du pipeline et du vocabulaire</strong></p>

<div class="p1-grid">
<aside class="p1-sidebar">

<p class="sb-label">Ce qu'est FASTR</p>

**F**requent **A**ssessments and **S**ystem **T**ools for **R**esilience — l'approche de la GFF pour l'analyse à cycle rapide et l'usage des données.

<p class="sb-label">En une phrase</p>

Un **pipeline de données** qui extrait les registres de santé mensuels de routine d'une base nationale, les nettoie, et les transforme en estimations fiables indiquant si les gens reçoivent les soins dont ils ont besoin.

<p class="sb-label">Modèle mental</p>

ETL → valider → transformer → KPI. Les termes de santé reposent sur de l'ingénierie de données standard — ce sont des étiquettes métier, rien de plus.

</aside>
<div class="p1-main">

## La forme générale

```
DHIS2                  Données SIGS         Modules FASTR            Résultats
(base source)      →   (comptages     →     (étapes du pipeline) →   (estimations propres,
 une ligne par          bruts)               M1 → M2 → M3             graphiques, % couverture)
 formation ×                                  M5 → M6
 indicateur ×
 mois
```

- **DHIS2** — la base de production du pays pour les données de santé. Application web + API REST. En lecture seule du point de vue du pipeline.
- **Données SIGS** — ce que nous extrayons : des **comptages de services mensuels** de routine, un nombre par formation, par indicateur, par mois.
- **Modules** — étapes du pipeline. Chacune lit le résultat de l'étape précédente ; les dépendances forment un DAG.
- **Résultats** — des CSV et des graphiques que les équipes de santé utilisent pour décider.

</div>
</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Les données</span>

## D'où viennent les données : DHIS2

**DHIS2** est une plateforme open source que la plupart des pays à revenu faible ou intermédiaire utilisent comme entrepôt national de données de santé de routine — autrement dit la **base de production faisant foi**.

- Chaque clinique et hôpital (une **formation sanitaire**) déclare des chiffres chaque mois
- Les données sont indexées par **formation × indicateur × mois**
- Elles sont extraites via l'**API** de DHIS2 (ou un export CSV) dans une table à plat — les **données SIGS** (`hmis_XXX.csv`, où `XXX` est le code pays)

![Un tableau de bord DHIS2 h:300](../../../resources/screenshots/dhis2_demo_dashboard.png)

<p style="text-align:center; font-size:8.5pt; color:#6b7280; margin-top:-0.2em;">Une instance DHIS2 — la démo publique (données d'exemple de la Sierra Leone). C'est le type de système d'où les données sont extraites.</p>

> **Des comptages, pas des pourcentages.** Le pipeline ingère des **comptages bruts** — *« 152 enfants ont reçu le Penta1 dans cette formation en mars 2024 »* — jamais *« 92 % de couverture ».* Les comptages s'additionnent entre formations et permettent à la détection d'aberrants de travailler sur la magnitude ; les pourcentages, non.

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Les données</span>

## Ce qu'est un « indicateur »

En santé mondiale, un **indicateur** est une variable définie et mesurable servant à surveiller un système de santé — pour suivre la prestation de services, la couverture ou les résultats de santé dans le temps et entre lieux, et pour éclairer les décisions. C'est un substitut standardisé : on ne peut pas mesurer « la santé maternelle s'améliore-t-elle ? » directement, alors on suit quelque chose de dénombrable qui en tient lieu.

Dans les données SIGS de routine, chaque indicateur est un événement de service précis que les formations enregistrent et déclarent chaque mois. (Pour un développeur : voyez-le comme une métrique suivie — un événement nommé et compté, comme un type d'événement en analyse produit.) FASTR se concentre sur un petit noyau d'indicateurs **SRMNEA-N** à fort volume (santé reproductive, maternelle, néonatale, de l'enfant, de l'adolescent + nutrition) :

<span class="data-pill data-pill-green">ANC1</span> <span class="data-pill data-pill-green">ANC4</span> <span class="data-pill data-pill-navy">Accouchement institutionnel</span> <span class="data-pill data-pill-navy">PNC1</span> <span class="data-pill data-pill-gold">BCG</span> <span class="data-pill data-pill-gold">Penta1</span> <span class="data-pill data-pill-gold">Penta3</span> <span class="data-pill data-pill-deep-green">Consultations externes</span>

| Indicateur | En clair |
|-----------|---------------|
| **ANC1 / ANC4** | La 1re / 4e consultation prénatale (avant la naissance) d'une femme enceinte |
| **Accouchement institutionnel** | Une naissance survenue dans une formation sanitaire |
| **PNC1** | Première consultation postnatale (après la naissance) |
| **BCG** | Vaccin contre la tuberculose, administré à la naissance |
| **Penta1 / Penta3** | 1re / 3e dose du vaccin nourrisson 5-en-1 |
| **Consultations externes** | Visites en ambulatoire — un substitut de l'usage général des services de santé |

<div class="callout-footer">Choisis pour leur fort volume de déclaration et parce qu'ils tiennent lieu de nombreux autres services rendus lors de la même visite. Les pays ajoutent les leurs par-dessus.</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Le pipeline</span>

## Ce que font les modules

Chaque module est une étape. Ils s'exécutent **dans l'ordre**, et chacun consomme le résultat des précédents — la `→` est une vraie dépendance de données.

<h2 class="step-h"><span class="step-n">1</span><span>M1 — Évaluation de la qualité des données (EQD)</span></h2>

Validation + détection d'anomalies. Signale les **valeurs aberrantes** (un comptage très éloigné de l'historique propre à la formation) et les lacunes de **complétude** (mois où une formation n'a pas déclaré). En lecture seule — elle étiquette les problèmes, ne change rien.

<h2 class="step-h"><span class="step-n">2</span><span>M2 — Ajustement de la qualité des données</span></h2>

L'étape de correction. Consomme les signalements de M1 et **répare** les données — remplace les aberrants, comble les lacunes par des estimations statistiques — pour que les calculs en aval ne soient pas faussés par de mauvaises entrées. Émet le jeu de données ajusté.

<h2 class="step-h"><span class="step-n">3</span><span>M3 — Utilisation des services</span></h2>

Analyse de tendance : les services montent-ils ou descendent-ils ? Utilise la régression pour mesurer les tendances et détecter les **perturbations** (ex. une baisse des visites après une coupe de financement ou un choc).

<h2 class="step-h"><span class="step-n">4</span><span>M5 → M6 — Estimations de couverture</span></h2>

La **couverture** = la part des gens qui *avaient besoin* d'un service et l'ont effectivement reçu. Exemple : 8 000 nourrissons d'un district ont reçu le vaccin contre la rougeole, et environ 10 000 nourrissons y vivent → ~80 % de couverture.

Le chiffre du haut (8 000) est un **comptage** que nous avons déjà. Le chiffre du bas (10 000 — la **population cible**) n'est *pas* dans les données : aucun système ne déclare « combien de nourrissons existent ». Estimer ce dénominateur est le plus difficile, et c'est tout le travail de M5 — il le dérive des données SIGS, d'enquêtes ménages et de projections de population de l'ONU. **M6** calcule ensuite le % de couverture et comble les années entre les enquêtes.

<div class="callout-footer">M1 valider → M2 corriger → M3 tendances → M5/M6 couverture. (M4 est l'ancien module de couverture, remplacé par M5+M6.)</div>

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

<span class="eyebrow">Référence</span>

## Décodeur de jargon

| Terme | Signification |
|------|---------|
| **DHIS2** | Base nationale de santé d'où le pipeline lit (dotée d'une API) |
| **SIGS / HMIS** | Système d'information de gestion sanitaire — les données de routine elles-mêmes |
| **Formation (sanitaire)** | Une clinique ou un hôpital — une source de déclaration |
| **Indicateur** | Un événement de santé compté (une métrique) |
| **Comptage / volume** | Nombre brut d'événements. L'entrée. Jamais un % |
| **Zone administrative** | Niveau géographique : national → région → district → aire de santé |
| **Valeur aberrante** | Un comptage invraisemblablement élevé face à l'historique propre à la formation |
| **Complétude** | Si une formation a déclaré, ou non, pour un mois donné |
| **Couverture** | % de la population cible ayant reçu un service (un KPI) |
| **Dénominateur** | La population cible (ex. toutes les femmes enceintes) — estimée, non comptée |
| **SRMNEA-N** | Le domaine de santé : santé reproductive, maternelle, néonatale, de l'enfant, de l'adolescent + nutrition |
| **Perturbation** | Une baisse significative du volume de services (choc, coupe de financement, etc.) |
| **Module (Mx)** | Une étape du pipeline |

---

<div class="brand-line"><span class="rule"></span><img src="../../../resources/logos/FASTR_Primary_01_FullName.png" alt="FASTR" height="28"></div>

## Pour aller plus loin

- **Docs de méthodologie** — une page par module du pipeline (EQD, ajustement, utilisation des services, couverture), avec toute la logique et les paramètres
  <br>Lire : [FASTR-Analytics.github.io/fastr-resource-hub](https://FASTR-Analytics.github.io/fastr-resource-hub/) · Source : [github.com/FASTR-Analytics/fastr-resource-hub](https://github.com/FASTR-Analytics/fastr-resource-hub/tree/main/methodology)
- **Code source des modules du pipeline** — chaque module (`m001`…`m006`) fournit un `definition.json` (entrées, paramètres, sorties) et un `script.R` (la logique)
  <br>[github.com/FASTR-Analytics/modules](https://github.com/FASTR-Analytics/modules)
